import { app, safeStorage } from 'electron';
import path from 'path';
import fs from 'fs';
import type { BambuConfig } from './types';

interface StoredConfig {
  ip: string;
  serial: string;
  accessCodeEncrypted: string;
  printerName?: string;
}

function getConfigPath(): string {
  return path.join(app.getPath('userData'), 'bambu-config.json');
}

export function loadBambuConfig(): BambuConfig | null {
  try {
    const configPath = getConfigPath();
    if (!fs.existsSync(configPath)) return null;

    const raw = fs.readFileSync(configPath, 'utf-8');
    const stored: StoredConfig = JSON.parse(raw);

    let accessCode = '';
    if (stored.accessCodeEncrypted && safeStorage.isEncryptionAvailable()) {
      const buffer = Buffer.from(stored.accessCodeEncrypted, 'base64');
      accessCode = safeStorage.decryptString(buffer);
    }

    return {
      ip: stored.ip,
      serial: stored.serial,
      accessCode,
      printerName: stored.printerName,
    };
  } catch (err: any) {
    console.error('[Bambu] Failed to load config:', err.message);
    return null;
  }
}

export function saveBambuConfig(config: BambuConfig): void {
  try {
    let accessCodeEncrypted = '';
    if (config.accessCode && safeStorage.isEncryptionAvailable()) {
      const buffer = safeStorage.encryptString(config.accessCode);
      accessCodeEncrypted = buffer.toString('base64');
    }

    const stored: StoredConfig = {
      ip: config.ip,
      serial: config.serial,
      accessCodeEncrypted,
      printerName: config.printerName,
    };

    const configPath = getConfigPath();
    fs.writeFileSync(configPath, JSON.stringify(stored, null, 2), 'utf-8');
    console.log('[Bambu] Config saved to', configPath);
  } catch (err: any) {
    console.error('[Bambu] Failed to save config:', err.message);
  }
}
