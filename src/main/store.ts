import { app, safeStorage } from 'electron';
import fs from 'fs';
import path from 'path';
import type { AppConfig, TodoItem } from '../shared/types';

const CONFIG_FILE = 'command-centre.json';
const SECRETS_FILE = 'secrets.bin';
const TODOS_FILE = 'todos.json';

export const DEFAULT_CONFIG: AppConfig = {
  general: {
    alwaysOnTop: false,
    operatorName: 'Sir',
    transparentWindow: true,
    glassOpacity: 0.44,
    showGridOverlay: true,
    hiddenPanels: [],
    clockFormat24h: true,
    showSeconds: true,
  },
  weather: {
    latitude: 51.5074,
    longitude: -0.1278,
    locationName: 'London, United Kingdom',
    units: 'metric',
  },
  network: {
    interfaceName: null,
    speedTestBytes: 25_000_000,
  },
  google: {
    clientId: '',
    accounts: [],
  },
  claude: {
    plan: 'max5',
    sessionWindowHours: 5,
    windowTokenBudget: 20_000_000,
    apiUsageEnabled: false,
    apiWorkspaceId: '',
  },
  printers: {
    bambu: [],
    elegoo: [],
  },
};

/** Secrets never leave the main process — the renderer only learns whether one is set. */
export interface Secrets {
  /** Google OAuth client secret for the installed-app client. */
  googleClientSecret?: string;
  /** Per-account Google refresh tokens, keyed by account id. */
  googleRefreshTokens?: Record<string, string>;
  /** Anthropic Admin API key (sk-ant-admin01-...). */
  anthropicAdminKey?: string;
  /** Bambu LAN access codes, keyed by printer id. */
  bambuAccessCodes?: Record<string, string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Deep merge that keeps defaults for anything the stored file is missing. */
function mergeDefaults<T>(defaults: T, stored: unknown): T {
  if (!isRecord(stored) || !isRecord(defaults)) {
    return (stored === undefined ? defaults : (stored as T));
  }
  const out: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(stored)) {
    const fallback = (defaults as Record<string, unknown>)[key];
    out[key] = isRecord(fallback) && isRecord(value) ? mergeDefaults(fallback, value) : value;
  }
  return out as T;
}

export class Store {
  private configPath: string;
  private secretsPath: string;
  private todosPath: string;
  private config: AppConfig;
  private secrets: Secrets;
  private todos: TodoItem[];

  constructor(dir = app.getPath('userData')) {
    this.configPath = path.join(dir, CONFIG_FILE);
    this.secretsPath = path.join(dir, SECRETS_FILE);
    this.todosPath = path.join(dir, TODOS_FILE);
    this.config = this.readConfig();
    this.secrets = this.readSecrets();
    this.todos = this.readTodos();
  }

  /* ------------------------------------------------------------- config */

  private readConfig(): AppConfig {
    try {
      const raw = fs.readFileSync(this.configPath, 'utf-8');
      return mergeDefaults(DEFAULT_CONFIG, JSON.parse(raw));
    } catch {
      return structuredClone(DEFAULT_CONFIG);
    }
  }

  getConfig(): AppConfig {
    return structuredClone(this.config);
  }

  /** Applies a partial config (deep merged) and persists it. */
  updateConfig(patch: Partial<AppConfig>): AppConfig {
    this.config = mergeDefaults(this.config, patch);
    this.writeJson(this.configPath, this.config);
    return this.getConfig();
  }

  /* ------------------------------------------------------------ secrets */

  private readSecrets(): Secrets {
    try {
      const buf = fs.readFileSync(this.secretsPath);
      // The first byte flags whether the payload went through safeStorage.
      const encrypted = buf[0] === 1;
      const body = buf.subarray(1);
      const json = encrypted
        ? safeStorage.decryptString(body)
        : body.toString('utf-8');
      return JSON.parse(json) as Secrets;
    } catch {
      return {};
    }
  }

  private writeSecrets(): void {
    const json = JSON.stringify(this.secrets);
    let payload: Buffer;
    if (safeStorage.isEncryptionAvailable()) {
      payload = Buffer.concat([Buffer.from([1]), safeStorage.encryptString(json)]);
    } else {
      // No OS keychain (common on a bare Linux box) — still keep it out of the
      // config file and off-limits to the renderer, but say so in the log.
      console.warn('[store] safeStorage unavailable, secrets stored unencrypted');
      payload = Buffer.concat([Buffer.from([0]), Buffer.from(json, 'utf-8')]);
    }
    fs.mkdirSync(path.dirname(this.secretsPath), { recursive: true });
    fs.writeFileSync(this.secretsPath, payload, { mode: 0o600 });
  }

  getSecret<K extends keyof Secrets>(key: K): Secrets[K] {
    return this.secrets[key];
  }

  setSecret<K extends keyof Secrets>(key: K, value: Secrets[K]): void {
    if (value === undefined || value === '') {
      delete this.secrets[key];
    } else {
      this.secrets[key] = value;
    }
    this.writeSecrets();
  }

  setKeyedSecret(
    bucket: 'googleRefreshTokens' | 'bambuAccessCodes',
    id: string,
    value: string | null
  ): void {
    const current = { ...(this.secrets[bucket] ?? {}) };
    if (value === null || value === '') {
      delete current[id];
    } else {
      current[id] = value;
    }
    this.secrets[bucket] = current;
    this.writeSecrets();
  }

  getKeyedSecret(
    bucket: 'googleRefreshTokens' | 'bambuAccessCodes',
    id: string
  ): string | undefined {
    return this.secrets[bucket]?.[id];
  }

  /** Which secrets exist — safe to hand to the renderer. */
  getSecretFlags(): Record<string, boolean> {
    return {
      googleClientSecret: Boolean(this.secrets.googleClientSecret),
      anthropicAdminKey: Boolean(this.secrets.anthropicAdminKey),
    };
  }

  /* -------------------------------------------------------------- todos */

  private readTodos(): TodoItem[] {
    try {
      const parsed = JSON.parse(fs.readFileSync(this.todosPath, 'utf-8'));
      return Array.isArray(parsed) ? (parsed as TodoItem[]) : [];
    } catch {
      return [];
    }
  }

  getTodos(): TodoItem[] {
    return structuredClone(this.todos);
  }

  setTodos(items: TodoItem[]): TodoItem[] {
    this.todos = items;
    this.writeJson(this.todosPath, this.todos);
    return this.getTodos();
  }

  private writeJson(file: string, data: unknown): void {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  }
}
