import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen } from 'electron';
import path from 'path';
import { ClaudeWatcher } from './watcher';
import { UsageParser } from './parser';
import { BambuMqttClient } from './bambu/bambuClient';
import { setupBambuIPC } from './bambu/bambuIpc';
import { loadBambuConfig } from './bambu/bambuConfig';

let mainWindow: BrowserWindow | null = null;
let printerWidget: BrowserWindow | null = null;
let tray: Tray | null = null;
let watcher: ClaudeWatcher | null = null;
const parser = new UsageParser();
const bambuClient = new BambuMqttClient();

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
    // In production, __dirname is inside the asar: app.asar/dist-electron/main/
    // The renderer dist is at app.asar/dist/index.html
    const indexPath = path.join(__dirname, '../../dist/index.html');
    console.log('[AIUsageTracker] Loading:', indexPath);
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createPrinterWidget() {
  printerWidget = new BrowserWindow({
    width: 220,
    height: 220,
    frame: false,
    transparent: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, '../preload/bambuPreload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Desktop level: visible on wallpaper, behind all app windows
  printerWidget.setAlwaysOnTop(true, 'normal', -1);
  printerWidget.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false });

  // Position bottom-right corner of screen
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  printerWidget.setPosition(width - 240, height - 240);

  if (process.env.VITE_DEV_SERVER_URL) {
    printerWidget.loadURL(process.env.VITE_DEV_SERVER_URL + '/bambu/');
  } else {
    const bambuPath = path.join(__dirname, '../../dist/bambu/index.html');
    printerWidget.loadFile(bambuPath);
  }

  printerWidget.on('closed', () => {
    printerWidget = null;
  });
}

function createTray() {
  const icon = nativeImage.createEmpty();
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
      label: 'Printer Widget',
      submenu: [
        {
          label: 'Show/Hide',
          click: () => {
            if (printerWidget?.isVisible()) {
              printerWidget.hide();
            } else {
              printerWidget?.show();
            }
          },
        },
        {
          label: 'Settings...',
          click: () => {
            if (printerWidget && !printerWidget.isDestroyed()) {
              printerWidget.show();
              printerWidget.webContents.send('bambu:show-settings');
            }
          },
        },
      ],
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
    return {
      current: parser.getCurrentSession(),
      history: parser.getHistoricalUsage(),
      projects: parser.getProjects(),
      models: parser.getModelBreakdown(),
    };
  });

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

  // Bambu printer IPC
  setupBambuIPC(bambuClient, () => printerWidget);
}

function startWatching() {
  const homedir = require('os').homedir();
  const claudeDir = path.join(homedir, '.claude');

  console.log('[AIUsageTracker] Home directory:', homedir);
  console.log('[AIUsageTracker] Watching Claude dir:', claudeDir);

  const fs = require('fs');
  if (fs.existsSync(claudeDir)) {
    console.log('[AIUsageTracker] Claude directory exists');
    try {
      const contents = fs.readdirSync(claudeDir);
      console.log('[AIUsageTracker] Contents:', contents);
    } catch (e: any) {
      console.error('[AIUsageTracker] Cannot read claude dir:', e.message);
    }
  } else {
    console.warn('[AIUsageTracker] Claude directory NOT found at:', claudeDir);
  }

  watcher = new ClaudeWatcher(claudeDir, parser);

  watcher.on('usage-update', (data) => {
    console.log('[AIUsageTracker] Usage update - projects:', data.projects?.length, 'models:', data.models?.length);
    mainWindow?.webContents.send('usage:update', data);
  });

  watcher.on('status-change', (status) => {
    console.log('[AIUsageTracker] Status change:', status);
    mainWindow?.webContents.send('usage:status-change', status);
  });

  watcher.start();
  console.log('[AIUsageTracker] Watcher started');
}

function autoConnectPrinter() {
  const config = loadBambuConfig();
  if (config && config.ip && config.serial && config.accessCode) {
    console.log('[Bambu] Auto-connecting to saved printer:', config.ip);
    bambuClient.connect(config);
  }
}

app.whenReady().then(() => {
  createWindow();
  createPrinterWidget();
  createTray();
  setupIPC();
  startWatching();
  autoConnectPrinter();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      createPrinterWidget();
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
  bambuClient.disconnect();
});
