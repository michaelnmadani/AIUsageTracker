import { EventEmitter } from 'events';
import mqtt from 'mqtt';
import type { BambuConfig, BambuPrintStatus, BambuConnectionState } from './types';

const RECONNECT_DELAYS = [2000, 4000, 8000, 16000, 30000];

export class BambuMqttClient extends EventEmitter {
  private client: mqtt.MqttClient | null = null;
  private config: BambuConfig | null = null;
  private lastStatus: BambuPrintStatus | null = null;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connectionState: BambuConnectionState = 'disconnected';

  connect(config: BambuConfig): void {
    this.disconnect();
    this.config = config;
    this.reconnectAttempt = 0;
    this.doConnect();
  }

  private doConnect(): void {
    if (!this.config) return;

    this.setConnectionState('connecting');
    const { ip, serial, accessCode } = this.config;
    const url = `mqtts://${ip}:8883`;

    console.log(`[Bambu] Connecting to ${url} (serial: ${serial})`);

    this.client = mqtt.connect(url, {
      username: 'bblp',
      password: accessCode,
      rejectUnauthorized: false,
      connectTimeout: 10000,
      keepalive: 30,
      reconnectPeriod: 0, // we handle reconnection ourselves
    });

    this.client.on('connect', () => {
      console.log('[Bambu] Connected');
      this.reconnectAttempt = 0;
      this.setConnectionState('connected');

      const topic = `device/${serial}/report`;
      this.client!.subscribe(topic, (err) => {
        if (err) {
          console.error('[Bambu] Subscribe error:', err.message);
        } else {
          console.log(`[Bambu] Subscribed to ${topic}`);
          this.requestFullStatus();
        }
      });
    });

    this.client.on('message', (_topic: string, payload: Buffer) => {
      try {
        const data = JSON.parse(payload.toString());
        if (data.print) {
          const status = this.parsePrintStatus(data.print);
          this.lastStatus = status;
          this.emit('print-status', status);
        }
      } catch (err: any) {
        console.error('[Bambu] Message parse error:', err.message);
      }
    });

    this.client.on('error', (err) => {
      console.error('[Bambu] MQTT error:', err.message);
      this.setConnectionState('error');
    });

    this.client.on('close', () => {
      console.log('[Bambu] Connection closed');
      if (this.connectionState !== 'disconnected') {
        this.setConnectionState('disconnected');
        this.scheduleReconnect();
      }
    });

    this.client.on('offline', () => {
      console.log('[Bambu] Client offline');
    });
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.client) {
      this.client.removeAllListeners();
      this.client.end(true);
      this.client = null;
    }
    this.lastStatus = null;
    this.setConnectionState('disconnected');
  }

  requestFullStatus(): void {
    if (!this.client || !this.config) return;

    const topic = `device/${this.config.serial}/request`;
    const payload = JSON.stringify({
      pushing: {
        sequence_id: '0',
        command: 'pushall',
      },
    });

    this.client.publish(topic, payload);
    console.log('[Bambu] Requested full status push');
  }

  getLastStatus(): BambuPrintStatus | null {
    return this.lastStatus;
  }

  getConnectionState(): BambuConnectionState {
    return this.connectionState;
  }

  private setConnectionState(state: BambuConnectionState): void {
    if (this.connectionState !== state) {
      this.connectionState = state;
      this.emit('connection-state', state);
    }
  }

  private scheduleReconnect(): void {
    if (!this.config) return;

    const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempt, RECONNECT_DELAYS.length - 1)];
    this.reconnectAttempt++;

    console.log(`[Bambu] Reconnecting in ${delay / 1000}s (attempt ${this.reconnectAttempt})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.doConnect();
    }, delay);
  }

  private parsePrintStatus(print: any): BambuPrintStatus {
    const stateMap: Record<string, BambuPrintStatus['gcodeState']> = {
      RUNNING: 'RUNNING',
      PAUSE: 'PAUSE',
      FINISH: 'FINISH',
      IDLE: 'IDLE',
      FAILED: 'FAILED',
    };

    return {
      gcodeState: stateMap[print.gcode_state] || 'UNKNOWN',
      percentComplete: typeof print.mc_percent === 'number' ? print.mc_percent : 0,
      remainingMinutes: typeof print.mc_remaining_time === 'number' ? print.mc_remaining_time : 0,
      subtaskName: print.subtask_name || null,
      currentLayer: typeof print.layer_num === 'number' ? print.layer_num : 0,
      totalLayers: typeof print.total_layer_num === 'number' ? print.total_layer_num : 0,
      nozzleTemp: typeof print.nozzle_temper === 'number' ? print.nozzle_temper : 0,
      bedTemp: typeof print.bed_temper === 'number' ? print.bed_temper : 0,
      timestamp: Date.now(),
    };
  }
}
