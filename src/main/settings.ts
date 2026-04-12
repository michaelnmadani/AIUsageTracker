import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export interface AppSettings {
  /** Anthropic API key for usage tracking (optional) */
  apiKey: string | null;
  /** Extra directories to scan for JSONL data */
  customPaths: string[];
  /** How often to poll the API in minutes (default 5) */
  apiPollIntervalMinutes: number;
}

const DEFAULTS: AppSettings = {
  apiKey: null,
  customPaths: [],
  apiPollIntervalMinutes: 5,
};

function settingsPath(): string {
  const userDataDir = app.getPath('userData');
  return path.join(userDataDir, 'settings.json');
}

export function loadSettings(): AppSettings {
  try {
    const filePath = settingsPath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      return { ...DEFAULTS, ...parsed };
    }
  } catch (err) {
    console.error('[Settings] Failed to load settings:', err);
  }
  return { ...DEFAULTS };
}

export function saveSettings(settings: AppSettings): void {
  try {
    const filePath = settingsPath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8');
    console.log('[Settings] Saved to:', filePath);
  } catch (err) {
    console.error('[Settings] Failed to save settings:', err);
  }
}
