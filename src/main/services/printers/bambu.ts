import mqtt, { type MqttClient } from 'mqtt';
import { EventEmitter } from 'events';
import type { BambuPrinterConfig, PrinterState, PrinterStatus } from '../../../shared/types';

const PORT = 8883;
const USERNAME = 'bblp';
const SPEED_LEVELS: Record<number, string> = {
  1: 'Silent',
  2: 'Standard',
  3: 'Sport',
  4: 'Ludicrous',
};

/** gcode_state values reported over the LAN MQTT topic. */
const STATE_MAP: Record<string, { state: PrinterState; label: string }> = {
  IDLE: { state: 'idle', label: 'Idle' },
  PREPARE: { state: 'printing', label: 'Preparing' },
  SLICING: { state: 'printing', label: 'Slicing' },
  RUNNING: { state: 'printing', label: 'Printing' },
  PAUSE: { state: 'paused', label: 'Paused' },
  FINISH: { state: 'finished', label: 'Finished' },
  FAILED: { state: 'error', label: 'Failed' },
};

function offline(config: BambuPrinterConfig, error: string | null): PrinterStatus {
  return {
    id: config.id,
    name: config.name,
    brand: 'bambu',
    model: 'Bambu Lab',
    host: config.host,
    state: 'offline',
    stateLabel: 'Offline',
    jobName: null,
    progress: 0,
    layer: null,
    totalLayers: null,
    remainingSeconds: null,
    nozzleTemp: null,
    nozzleTarget: null,
    bedTemp: null,
    bedTarget: null,
    chamberTemp: null,
    fanSpeed: null,
    speedLevel: null,
    filament: null,
    error,
    updatedAt: Date.now(),
  };
}

/**
 * One long-lived MQTT connection per printer, in LAN mode: TLS on 8883 with the
 * printer's self-signed certificate, user `bblp`, password = LAN access code.
 * The printer only sends deltas after the initial `pushall`, so state is merged.
 */
class BambuConnection {
  private client: MqttClient | null = null;
  private report: Record<string, any> = {};
  private status: PrinterStatus;
  private lastMessageAt = 0;

  constructor(
    private config: BambuPrinterConfig,
    private accessCode: string | undefined,
    private onUpdate: () => void
  ) {
    this.status = offline(config, accessCode ? null : 'No LAN access code set.');
    if (accessCode) this.connect();
  }

  private connect(): void {
    this.status = { ...this.status, state: 'connecting', stateLabel: 'Connecting' };
    const client = mqtt.connect(`mqtts://${this.config.host}:${PORT}`, {
      username: USERNAME,
      password: this.accessCode,
      // The printer ships a self-signed certificate; LAN mode has no CA to verify against.
      rejectUnauthorized: false,
      reconnectPeriod: 15_000,
      connectTimeout: 8_000,
      clientId: `command-centre-${Math.random().toString(16).slice(2, 10)}`,
    });
    this.client = client;

    client.on('connect', () => {
      client.subscribe(`device/${this.config.serial}/report`);
      client.publish(
        `device/${this.config.serial}/request`,
        JSON.stringify({ pushing: { sequence_id: '0', command: 'pushall' } })
      );
    });

    client.on('message', (_topic, payload) => {
      try {
        const message = JSON.parse(payload.toString());
        if (message.print) {
          this.report = { ...this.report, ...message.print };
          this.lastMessageAt = Date.now();
          this.status = this.toStatus();
          this.onUpdate();
        }
      } catch {
        // Ignore frames we can't parse — the printer also emits non-JSON keepalives.
      }
    });

    client.on('error', (error) => {
      this.status = offline(this.config, error.message);
      this.onUpdate();
    });

    client.on('close', () => {
      if (Date.now() - this.lastMessageAt > 30_000) {
        this.status = offline(this.config, null);
        this.onUpdate();
      }
    });
  }

  private toStatus(): PrinterStatus {
    const p = this.report;
    const mapped = STATE_MAP[p.gcode_state] ?? { state: 'idle' as PrinterState, label: p.gcode_state ?? 'Idle' };
    const activeHms = Array.isArray(p.hms) ? p.hms.filter((h: any) => h?.attr) : [];
    const trays = p.ams?.ams?.flatMap((unit: any) => unit.tray ?? []) ?? [];
    const activeTray = trays.find((tray: any) => tray?.tray_type);

    return {
      id: this.config.id,
      name: this.config.name,
      brand: 'bambu',
      model: 'Bambu Lab',
      host: this.config.host,
      state: mapped.state,
      stateLabel: mapped.label,
      jobName: p.subtask_name || p.gcode_file || null,
      progress: Number(p.mc_percent ?? 0),
      layer: p.layer_num ?? null,
      totalLayers: p.total_layer_num ?? null,
      // mc_remaining_time is in minutes.
      remainingSeconds: p.mc_remaining_time != null ? Number(p.mc_remaining_time) * 60 : null,
      nozzleTemp: p.nozzle_temper ?? null,
      nozzleTarget: p.nozzle_target_temper ?? null,
      bedTemp: p.bed_temper ?? null,
      bedTarget: p.bed_target_temper ?? null,
      chamberTemp: p.chamber_temper ?? null,
      fanSpeed: p.cooling_fan_speed != null ? Number(p.cooling_fan_speed) : null,
      speedLevel: SPEED_LEVELS[Number(p.spd_lvl)] ?? null,
      filament: activeTray?.tray_type ?? null,
      error: activeHms.length > 0 ? `${activeHms.length} HMS alert(s) active` : null,
      updatedAt: Date.now(),
    };
  }

  getStatus(): PrinterStatus {
    return this.status;
  }

  dispose(): void {
    this.client?.end(true);
    this.client = null;
  }
}

/** Keeps one connection per configured Bambu printer and re-syncs on config changes. */
export class BambuService extends EventEmitter {
  private connections = new Map<string, BambuConnection>();
  private configs: BambuPrinterConfig[] = [];

  sync(configs: BambuPrinterConfig[], accessCodeFor: (id: string) => string | undefined): void {
    this.configs = configs;
    const wanted = new Set(configs.filter((c) => c.enabled).map((c) => c.id));

    for (const [id, connection] of this.connections) {
      if (!wanted.has(id)) {
        connection.dispose();
        this.connections.delete(id);
      }
    }

    for (const config of configs) {
      if (!config.enabled || this.connections.has(config.id)) continue;
      this.connections.set(
        config.id,
        new BambuConnection(config, accessCodeFor(config.id), () => this.emit('update'))
      );
    }
  }

  /** Drops and rebuilds a printer's connection — used after editing its settings. */
  reconnect(id: string): void {
    this.connections.get(id)?.dispose();
    this.connections.delete(id);
  }

  getStatuses(): PrinterStatus[] {
    return this.configs
      .filter((config) => config.enabled)
      .map((config) => this.connections.get(config.id)?.getStatus() ?? offline(config, null));
  }

  dispose(): void {
    for (const connection of this.connections.values()) connection.dispose();
    this.connections.clear();
  }
}
