import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import { ClaudeWatcher } from './watcher';
import { UsageParser } from './parser';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let watcher: ClaudeWatcher | null = null;
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

  if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
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

function startWatching() {
  const homedir = require('os').homedir();
  const claudeDir = path.join(homedir, '.claude');

  watcher = new ClaudeWatcher(claudeDir, parser);

  watcher.on('usage-update', (data) => {
    mainWindow?.webContents.send('usage:update', data);
  });

  watcher.on('status-change', (status) => {
    mainWindow?.webContents.send('usage:status-change', status);
  });

  watcher.start();
}

app.whenReady().then(() => {
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
