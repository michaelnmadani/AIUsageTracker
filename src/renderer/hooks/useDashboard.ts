import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AppConfig,
  DashboardData,
  DataChannel,
  ServiceError,
} from '../../shared/types';
import { api } from '../lib/api';

const EMPTY: DashboardData = {
  weather: null,
  network: null,
  mail: null,
  calendar: null,
  claude: null,
  printers: null,
  todos: { items: [], updatedAt: 0 },
};

export interface Dashboard {
  ready: boolean;
  data: DashboardData;
  config: AppConfig | null;
  secrets: Record<string, boolean>;
  /** Latest failure per channel, cleared as soon as that channel succeeds. */
  errors: Record<string, string>;
  lastError: ServiceError | null;
  dismissError: () => void;
  refresh: (channel?: DataChannel | 'all') => Promise<void>;
  saveConfig: (patch: Partial<AppConfig>) => Promise<void>;
  saveSecret: (key: string, value: string) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<DashboardData>>;
}

/** Single subscription to the main process; every panel reads from this. */
export function useDashboard(): Dashboard {
  const [data, setData] = useState<DashboardData>(EMPTY);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [secrets, setSecrets] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [lastError, setLastError] = useState<ServiceError | null>(null);
  const errorTimer = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    void api.bootstrap().then((boot) => {
      if (cancelled) return;
      setData(boot.data);
      setConfig(boot.config);
      setSecrets(boot.secrets);
      setErrors(boot.errors);
      setReady(true);
    });

    const offData = api.onData((channel, payload) => {
      setData((current) => ({ ...current, [channel]: payload } as DashboardData));
      setErrors((current) => {
        if (!(channel in current)) return current;
        const next = { ...current };
        delete next[channel];
        return next;
      });
    });
    const offConfig = api.onConfig((next) => setConfig(next));
    const offError = api.onServiceError((error) => {
      setErrors((current) => ({ ...current, [error.channel]: error.message }));
      setLastError(error);
      if (errorTimer.current) window.clearTimeout(errorTimer.current);
      errorTimer.current = window.setTimeout(() => setLastError(null), 12_000);
    });

    return () => {
      cancelled = true;
      offData();
      offConfig();
      offError();
      if (errorTimer.current) window.clearTimeout(errorTimer.current);
    };
  }, []);

  const refresh = useCallback(async (channel: DataChannel | 'all' = 'all') => {
    const next = await api.refresh(channel);
    setData(next);
  }, []);

  const saveConfig = useCallback(async (patch: Partial<AppConfig>) => {
    setConfig(await api.updateConfig(patch));
  }, []);

  const saveSecret = useCallback(async (key: string, value: string) => {
    setSecrets(await api.setSecret(key, value));
  }, []);

  return {
    ready,
    data,
    config,
    secrets,
    errors,
    lastError,
    dismissError: () => setLastError(null),
    refresh,
    saveConfig,
    saveSecret,
    setData,
  };
}
