import { contextBridge, ipcRenderer } from 'electron';

export interface BambuAPI {
  connect: (config: { ip: string; serial: string; accessCode: string; printerName?: string }) => Promise<void>;
  disconnect: () => Promise<void>;
  getStatus: () => Promise<any>;
  getConfig: () => Promise<any>;
  saveConfig: (config: { ip: string; serial: string; accessCode: string; printerName?: string }) => Promise<void>;
  getConnectionState: () => Promise<string>;
  onPrintStatus: (callback: (status: any) => void) => () => void;
  onConnectionState: (callback: (state: string) => void) => () => void;
  onShowSettings: (callback: () => void) => () => void;
  close: () => Promise<void>;
}

contextBridge.exposeInMainWorld('bambuAPI', {
  connect: (config: any) => ipcRenderer.invoke('bambu:connect', config),
  disconnect: () => ipcRenderer.invoke('bambu:disconnect'),
  getStatus: () => ipcRenderer.invoke('bambu:get-status'),
  getConfig: () => ipcRenderer.invoke('bambu:get-config'),
  saveConfig: (config: any) => ipcRenderer.invoke('bambu:save-config', config),
  getConnectionState: () => ipcRenderer.invoke('bambu:get-connection-state'),
  onPrintStatus: (callback: (status: any) => void) => {
    const handler = (_event: any, data: any) => callback(data);
    ipcRenderer.on('bambu:print-status', handler);
    return () => ipcRenderer.removeListener('bambu:print-status', handler);
  },
  onConnectionState: (callback: (state: string) => void) => {
    const handler = (_event: any, state: string) => callback(state);
    ipcRenderer.on('bambu:connection-state', handler);
    return () => ipcRenderer.removeListener('bambu:connection-state', handler);
  },
  onShowSettings: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('bambu:show-settings', handler);
    return () => ipcRenderer.removeListener('bambu:show-settings', handler);
  },
  close: () => ipcRenderer.invoke('bambu:close-widget'),
} as BambuAPI);
