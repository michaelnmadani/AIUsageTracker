import { app, BrowserWindow, ipcMain, Menu, nativeImage, shell, Tray } from 'electron';
import crypto from 'crypto';
import path from 'path';
import { Hub } from './hub';
import { searchLocations } from './services/weather';
import { DEFAULT_MAIL_QUERY } from './services/google/gmail';
import type { AppConfig, DataChannel, GoogleAccountConfig, TodoItem } from '../shared/types';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let hub: Hub | null = null;

function createWindow(config: AppConfig): BrowserWindow {
  const window = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#0b0e14',
    show: false,
    autoHideMenuBar: true,
    title: 'Command Centre',
    alwaysOnTop: config.general.alwaysOnTop,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    void window.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    void window.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  window.once('ready-to-show', () => window.show());
  window.on('closed', () => {
    mainWindow = null;
  });

  // Keep external links (mail threads, calendar events) in the real browser.
  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  return window;
}

function createTray(): void {
  tray = new Tray(nativeImage.createEmpty());
  tray.setToolTip('Command Centre');
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Show / hide', click: () => toggleWindow() },
      {
        label: 'Always on top',
        type: 'checkbox',
        checked: hub?.store.getConfig().general.alwaysOnTop ?? false,
        click: (item) => hub?.updateConfig({ general: { alwaysOnTop: item.checked } as any }),
      },
      { type: 'separator' },
      { label: 'Refresh everything', click: () => void hub?.refreshAll() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() },
    ])
  );
  tray.on('click', toggleWindow);
}

function toggleWindow(): void {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) mainWindow.hide();
  else mainWindow.show();
}

function send(channel: string, ...args: unknown[]): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, ...args);
  }
}

function registerIpc(activeHub: Hub): void {
  ipcMain.handle('app:bootstrap', () => ({
    config: activeHub.store.getConfig(),
    secrets: activeHub.store.getSecretFlags(),
    data: activeHub.getAll(),
    errors: activeHub.getErrors(),
    platform: process.platform,
    version: app.getVersion(),
  }));

  ipcMain.handle('config:update', (_event, patch: Partial<AppConfig>) =>
    activeHub.updateConfig(patch)
  );

  ipcMain.handle('secret:set', (_event, key: string, value: string) => {
    activeHub.store.setSecret(key as any, value);
    if (key === 'anthropicAdminKey') void activeHub.refresh('claude');
    return activeHub.store.getSecretFlags();
  });

  ipcMain.handle('data:refresh', async (_event, channel: DataChannel | 'all') => {
    if (channel === 'all') await activeHub.refreshAll();
    else await activeHub.refresh(channel);
    return activeHub.getAll();
  });

  ipcMain.handle('weather:search', (_event, query: string) => searchLocations(query));

  ipcMain.handle('network:interfaces', () => activeHub.network.listInterfaces());
  ipcMain.handle('network:speed-test', () => activeHub.network.runSpeedTest());

  ipcMain.handle('google:connect', async () => {
    const result = await activeHub.auth.authorise();
    const config = activeHub.store.getConfig();
    const existing = config.google.accounts.find((a) => a.email === result.email);
    const id = existing?.id ?? crypto.randomUUID();

    activeHub.store.setKeyedSecret('googleRefreshTokens', id, result.refreshToken);

    const account: GoogleAccountConfig = existing ?? {
      id,
      email: result.email,
      label: result.email.split('@')[0],
      mailQuery: DEFAULT_MAIL_QUERY,
      calendarIds: [],
      enabled: true,
    };
    const accounts = existing
      ? config.google.accounts.map((a) => (a.id === id ? account : a))
      : [...config.google.accounts, account];

    const updated = activeHub.updateConfig({ google: { ...config.google, accounts } });
    return { config: updated, email: result.email };
  });

  ipcMain.handle('google:disconnect', (_event, accountId: string) => {
    activeHub.auth.forget(accountId);
    const config = activeHub.store.getConfig();
    return activeHub.updateConfig({
      google: {
        ...config.google,
        accounts: config.google.accounts.filter((a) => a.id !== accountId),
      },
    });
  });

  ipcMain.handle('printers:set-access-code', (_event, printerId: string, code: string) => {
    activeHub.store.setKeyedSecret('bambuAccessCodes', printerId, code || null);
    activeHub.reconnectPrinter(printerId);
    return true;
  });

  ipcMain.handle('todos:add', (_event, input: Partial<TodoItem> & { title: string }) =>
    activeHub.addTodo(input)
  );
  ipcMain.handle('todos:update', (_event, id: string, patch: Partial<TodoItem>) =>
    activeHub.updateTodo(id, patch)
  );
  ipcMain.handle('todos:remove', (_event, id: string) => activeHub.removeTodo(id));
  ipcMain.handle('todos:clear-completed', () => activeHub.clearCompletedTodos());
  ipcMain.handle('todos:reorder', (_event, ids: string[]) => activeHub.reorderTodos(ids));

  ipcMain.handle('shell:open-external', (_event, url: string) => {
    if (/^https?:\/\//i.test(url)) void shell.openExternal(url);
  });

  ipcMain.handle('window:minimize', () => mainWindow?.minimize());
  ipcMain.handle('window:toggle-maximize', () => {
    if (!mainWindow) return false;
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
    return mainWindow.isMaximized();
  });
  ipcMain.handle('window:close', () => mainWindow?.close());
}

const singleInstance = app.requestSingleInstanceLock();
if (!singleInstance) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  void app.whenReady().then(() => {
    hub = new Hub();
    mainWindow = createWindow(hub.store.getConfig());

    hub.on('data', (channel: DataChannel, payload: unknown) => send('data', channel, payload));
    hub.on('error', (payload: unknown) => send('service-error', payload));
    hub.on('config', (config: AppConfig) => send('config', config));
    hub.on('always-on-top', (value: boolean) => mainWindow?.setAlwaysOnTop(value));

    registerIpc(hub);
    createTray();
    hub.start();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0 && hub) {
        mainWindow = createWindow(hub.store.getConfig());
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('before-quit', () => hub?.stop());
}
