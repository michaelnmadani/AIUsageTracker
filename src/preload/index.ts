import { contextBridge, ipcRenderer } from 'electron';

export interface UsageAPI {
  getCurrent: () => Promise<any>;
  getHistory: () => Promise<any>;
  getProjects: () => Promise<any>;
  getModels: () => Promise<any>;
  getDiagnostics: () => Promise<any>;
  refresh: () => Promise<any>;
  onUsageUpdate: (callback: (data: any) => void) => () => void;
  onStatusChange: (callback: (status: any) => void) => () => void;
  getSettings: () => Promise<any>;
  setApiKey: (apiKey: string | null) => Promise<any>;
  setCustomPaths: (paths: string[]) => Promise<any>;
  toggleAlwaysOnTop: () => Promise<boolean>;
  minimize: () => Promise<void>;
  close: () => Promise<void>;
}

contextBridge.exposeInMainWorld('usageAPI', {
  getCurrent: () => ipcRenderer.invoke('usage:get-current'),
  getHistory: () => ipcRenderer.invoke('usage:get-history'),
  getProjects: () => ipcRenderer.invoke('usage:get-projects'),
  getModels: () => ipcRenderer.invoke('usage:get-models'),
  getDiagnostics: () => ipcRenderer.invoke('usage:get-diagnostics'),
  refresh: () => ipcRenderer.invoke('usage:refresh'),
  onUsageUpdate: (callback: (data: any) => void) => {
    const handler = (_event: any, data: any) => callback(data);
    ipcRenderer.on('usage:update', handler);
    return () => ipcRenderer.removeListener('usage:update', handler);
  },
  onStatusChange: (callback: (status: any) => void) => {
    const handler = (_event: any, status: any) => callback(status);
    ipcRenderer.on('usage:status-change', handler);
    return () => ipcRenderer.removeListener('usage:status-change', handler);
  },
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setApiKey: (apiKey: string | null) => ipcRenderer.invoke('settings:set-api-key', apiKey),
  setCustomPaths: (paths: string[]) => ipcRenderer.invoke('settings:set-custom-paths', paths),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('window:toggle-always-on-top'),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  close: () => ipcRenderer.invoke('window:close'),
} as UsageAPI);
