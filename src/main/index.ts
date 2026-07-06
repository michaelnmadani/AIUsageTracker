import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import { ClaudeWatcher } from './watcher';
import { UsageParser } from './parser';
import { AnthropicApiClient } from './api-client';
import { loadSettings, saveSettings, type AppSettings } from './settings';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let watcher: ClaudeWatcher | null = null;
let settings: AppSettings;
const parser = new UsageParser();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 700,
    minWidth: 350,
    minHeight: 500,
    frame: false,
    transparent: false,
    resizable: true,
    alwaysOnTop: false,
    backgroundColor: '#1a1a2e',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    vibrancy: 'under-window',
    visualEffectState: 'active',
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.join(__dirname, '../../dist/index.html');
    console.log('[AIUsageTracker] Loading:', indexPath);
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  // 'Template' suffix lets macOS recolor the icon for light/dark menu bars
  const trayIconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'tray', 'trayTemplate.png')
    : path.join(__dirname, '../../build/tray/trayTemplate.png');
  let icon = nativeImage.createFromPath(trayIconPath);
  if (icon.isEmpty()) {
    icon = nativeImage.createEmpty();
  }
  tray = new Tray(icon);
  tray.setToolTip('AI Usage Tracker');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide',
      click: () => {
        if (mainWindow?.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow?.show();
        }
      },
    },
    {
      label: 'Always on Top',
      type: 'checkbox',
      checked: false,
      click: (menuItem) => {
        mainWindow?.setAlwaysOnTop(menuItem.checked);
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit(),
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow?.isVisible() ? mainWindow.hide() : mainWindow?.show();
  });
}

function setupIPC() {
  // --- Usage data ---
  ipcMain.handle('usage:get-current', async () => {
    return parser.getCurrentSession();
  });

  ipcMain.handle('usage:get-history', async () => {
    return parser.getHistoricalUsage();
  });

  ipcMain.handle('usage:get-projects', async () => {
    return parser.getProjects();
  });

  ipcMain.handle('usage:get-models', async () => {
    return parser.getModelBreakdown();
  });

  ipcMain.handle('usage:refresh', async () => {
    parser.parseAll();
    // Also sync API data if configured
    if (settings.apiKey) {
      await parser.syncFromApi();
    }
    return {
      current: parser.getCurrentSession(),
      history: parser.getHistoricalUsage(),
      projects: parser.getProjects(),
      models: parser.getModelBreakdown(),
    };
  });

  // --- Diagnostics ---
  ipcMain.handle('usage:get-diagnostics', async () => {
    return parser.getDiagnostics();
  });

  // --- Settings ---
  ipcMain.handle('settings:get', async () => {
    return {
      apiKeySet: !!settings.apiKey,
      apiKeyPreview: settings.apiKey ? maskApiKey(settings.apiKey) : null,
      customPaths: settings.customPaths,
      apiPollIntervalMinutes: settings.apiPollIntervalMinutes,
    };
  });

  ipcMain.handle('settings:set-api-key', async (_event, apiKey: string | null) => {
    if (apiKey && apiKey.trim()) {
      const client = new AnthropicApiClient(apiKey.trim());
      const validation = await client.validateKey();

      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      settings.apiKey = apiKey.trim();
      parser.setApiClient(client);
      saveSettings(settings);

      // Start API polling
      watcher?.startApiPolling(settings.apiPollIntervalMinutes);

      // Do an immediate sync
      const syncResult = await parser.syncFromApi();

      // Emit update to renderer
      mainWindow?.webContents.send('usage:update', {
        current: parser.getCurrentSession(),
        history: parser.getHistoricalUsage(),
        projects: parser.getProjects(),
        models: parser.getModelBreakdown(),
      });

      return { success: true, fetched: syncResult.fetched };
    } else {
      settings.apiKey = null;
      parser.setApiClient(null);
      saveSettings(settings);
      watcher?.stopApiPolling();
      return { success: true };
    }
  });

  ipcMain.handle('settings:set-custom-paths', async (_event, paths: string[]) => {
    settings.customPaths = paths;
    parser.setCustomPaths(paths);
    saveSettings(settings);

    // Re-parse with new paths
    parser.parseAll();
    if (settings.apiKey) {
      await parser.syncFromApi();
    }

    mainWindow?.webContents.send('usage:update', {
      current: parser.getCurrentSession(),
      history: parser.getHistoricalUsage(),
      projects: parser.getProjects(),
      models: parser.getModelBreakdown(),
    });

    return { success: true };
  });

  // --- Window controls ---
  ipcMain.handle('window:toggle-always-on-top', async () => {
    const isOnTop = mainWindow?.isAlwaysOnTop();
    mainWindow?.setAlwaysOnTop(!isOnTop);
    return !isOnTop;
  });

  ipcMain.handle('window:minimize', async () => {
    mainWindow?.minimize();
  });

  ipcMain.handle('window:close', async () => {
    mainWindow?.hide();
  });
}

function maskApiKey(key: string): string {
  if (key.length <= 12) return '****';
  return key.slice(0, 12) + '...' + key.slice(-4);
}

function startWatching() {
  console.log('[AIUsageTracker] Starting watcher...');

  // Apply settings to parser
  if (settings.customPaths.length > 0) {
    parser.setCustomPaths(settings.customPaths);
  }

  // Set up API client if key is configured
  if (settings.apiKey) {
    const client = new AnthropicApiClient(settings.apiKey);
    parser.setApiClient(client);
    console.log('[AIUsageTracker] API key configured, will sync from API');
  }

  watcher = new ClaudeWatcher(parser);

  watcher.on('usage-update', (data) => {
    console.log('[AIUsageTracker] Usage update - entries:', data.projects?.length, 'projects');
    mainWindow?.webContents.send('usage:update', data);
  });

  watcher.on('status-change', (status) => {
    console.log('[AIUsageTracker] Status change:', status);
    mainWindow?.webContents.send('usage:status-change', status);
  });

  watcher.start();

  // Start API polling if configured
  if (settings.apiKey) {
    watcher.startApiPolling(settings.apiPollIntervalMinutes);
  }

  console.log('[AIUsageTracker] Watcher started');
}

app.whenReady().then(() => {
  // Load settings before anything else
  settings = loadSettings();
  console.log('[AIUsageTracker] Settings loaded, API key:', settings.apiKey ? 'configured' : 'not set');

  createWindow();
  createTray();
  setupIPC();
  startWatching();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  watcher?.stop();
});
