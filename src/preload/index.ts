import { contextBridge, ipcRenderer } from 'electron';
import type {
  AppConfig,
  DashboardData,
  DataChannel,
  GeocodeResult,
  ServiceError,
  SpeedTestResult,
  TodoData,
  TodoItem,
} from '../shared/types';

export interface Bootstrap {
  config: AppConfig;
  secrets: Record<string, boolean>;
  data: DashboardData;
  errors: Record<string, string>;
  platform: string;
  version: string;
}

function subscribe<T extends unknown[]>(channel: string, callback: (...args: T) => void) {
  const handler = (_event: unknown, ...args: unknown[]) => callback(...(args as T));
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

const api = {
  bootstrap: (): Promise<Bootstrap> => ipcRenderer.invoke('app:bootstrap'),
  updateConfig: (patch: Partial<AppConfig>): Promise<AppConfig> =>
    ipcRenderer.invoke('config:update', patch),
  setSecret: (key: string, value: string): Promise<Record<string, boolean>> =>
    ipcRenderer.invoke('secret:set', key, value),
  refresh: (channel: DataChannel | 'all'): Promise<DashboardData> =>
    ipcRenderer.invoke('data:refresh', channel),

  searchLocations: (query: string): Promise<GeocodeResult[]> =>
    ipcRenderer.invoke('weather:search', query),

  listInterfaces: (): Promise<string[]> => ipcRenderer.invoke('network:interfaces'),
  runSpeedTest: (): Promise<SpeedTestResult> => ipcRenderer.invoke('network:speed-test'),

  connectGoogle: (): Promise<{ config: AppConfig; email: string }> =>
    ipcRenderer.invoke('google:connect'),
  disconnectGoogle: (accountId: string): Promise<AppConfig> =>
    ipcRenderer.invoke('google:disconnect', accountId),

  setPrinterAccessCode: (printerId: string, code: string): Promise<boolean> =>
    ipcRenderer.invoke('printers:set-access-code', printerId, code),

  todos: {
    add: (input: Partial<TodoItem> & { title: string }): Promise<TodoData> =>
      ipcRenderer.invoke('todos:add', input),
    update: (id: string, patch: Partial<TodoItem>): Promise<TodoData> =>
      ipcRenderer.invoke('todos:update', id, patch),
    remove: (id: string): Promise<TodoData> => ipcRenderer.invoke('todos:remove', id),
    clearCompleted: (): Promise<TodoData> => ipcRenderer.invoke('todos:clear-completed'),
    reorder: (ids: string[]): Promise<TodoData> => ipcRenderer.invoke('todos:reorder', ids),
  },

  openExternal: (url: string): Promise<void> => ipcRenderer.invoke('shell:open-external', url),

  relaunch: (): Promise<void> => ipcRenderer.invoke('app:relaunch'),

  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    toggleMaximize: (): Promise<boolean> => ipcRenderer.invoke('window:toggle-maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },

  onData: (callback: (channel: DataChannel, payload: unknown) => void) =>
    subscribe<[DataChannel, unknown]>('data', callback),
  onServiceError: (callback: (error: ServiceError) => void) =>
    subscribe<[ServiceError]>('service-error', callback),
  onConfig: (callback: (config: AppConfig) => void) => subscribe<[AppConfig]>('config', callback),
};

export type CommandCentreAPI = typeof api;

contextBridge.exposeInMainWorld('commandCentre', api);
