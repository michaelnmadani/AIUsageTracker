import { ipcMain, BrowserWindow } from 'electron';
import { BambuMqttClient } from './bambuClient';
import { loadBambuConfig, saveBambuConfig } from './bambuConfig';
import type { BambuConfig } from './types';

export function setupBambuIPC(
  bambuClient: BambuMqttClient,
  getWidgetWindow: () => BrowserWindow | null
): void {
  ipcMain.handle('bambu:connect', async (_event, config: BambuConfig) => {
    saveBambuConfig(config);
    bambuClient.connect(config);
  });

  ipcMain.handle('bambu:disconnect', async () => {
    bambuClient.disconnect();
  });

  ipcMain.handle('bambu:get-status', async () => {
    return bambuClient.getLastStatus();
  });

  ipcMain.handle('bambu:get-config', async () => {
    return loadBambuConfig();
  });

  ipcMain.handle('bambu:save-config', async (_event, config: BambuConfig) => {
    saveBambuConfig(config);
  });

  ipcMain.handle('bambu:get-connection-state', async () => {
    return bambuClient.getConnectionState();
  });

  ipcMain.handle('bambu:close-widget', async () => {
    const widget = getWidgetWindow();
    widget?.hide();
  });

  // Forward MQTT events to the widget renderer
  bambuClient.on('print-status', (status) => {
    const widget = getWidgetWindow();
    if (widget && !widget.isDestroyed()) {
      widget.webContents.send('bambu:print-status', status);
    }
  });

  bambuClient.on('connection-state', (state) => {
    const widget = getWidgetWindow();
    if (widget && !widget.isDestroyed()) {
      widget.webContents.send('bambu:connection-state', state);
    }
  });
}
