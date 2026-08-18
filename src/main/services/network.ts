import { EventEmitter } from 'events';
import { exec } from 'child_process';
import fs from 'fs';
import os from 'os';
import { promisify } from 'util';
import type { NetworkConfig, NetworkData, NetworkSample, SpeedTestResult } from '../../shared/types';

const execAsync = promisify(exec);

const SAMPLE_MS = 1000;
const HISTORY_POINTS = 90;
const SPEED_TEST_HOST = 'https://speed.cloudflare.com';

interface Counters {
  /** Per-interface cumulative byte counters since boot. */
  interfaces: Map<string, { rx: number; tx: number }>;
  at: number;
}

const LOOPBACK = /^(lo|lo0|Loopback)/i;

async function readLinuxCounters(): Promise<Counters['interfaces']> {
  const out = new Map<string, { rx: number; tx: number }>();
  const text = await fs.promises.readFile('/proc/net/dev', 'utf-8');
  for (const line of text.split('\n').slice(2)) {
    const [rawName, rest] = line.split(':');
    if (!rest) continue;
    const name = rawName.trim();
    const cols = rest.trim().split(/\s+/).map(Number);
    // /proc/net/dev columns: rx bytes first, tx bytes at index 8.
    out.set(name, { rx: cols[0] || 0, tx: cols[8] || 0 });
  }
  return out;
}

async function readDarwinCounters(): Promise<Counters['interfaces']> {
  const out = new Map<string, { rx: number; tx: number }>();
  const { stdout } = await execAsync('netstat -ibn');
  for (const line of stdout.split('\n')) {
    const p = line.trim().split(/\s+/);
    // Only the <Link#n> rows carry the per-interface totals; the AF rows repeat them.
    if (p.length < 10 || !p[2]?.startsWith('<Link')) continue;
    out.set(p[0], { rx: Number(p[6]) || 0, tx: Number(p[9]) || 0 });
  }
  return out;
}

async function readWindowsCounters(): Promise<Counters['interfaces']> {
  const out = new Map<string, { rx: number; tx: number }>();
  const script =
    'Get-NetAdapterStatistics | Select-Object Name,ReceivedBytes,SentBytes | ConvertTo-Json -Compress';
  const { stdout } = await execAsync(
    `powershell.exe -NoProfile -NonInteractive -Command "${script}"`,
    { windowsHide: true }
  );
  const parsed = JSON.parse(stdout.trim() || '[]');
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  for (const row of rows) {
    if (!row?.Name) continue;
    out.set(row.Name, { rx: Number(row.ReceivedBytes) || 0, tx: Number(row.SentBytes) || 0 });
  }
  return out;
}

async function readCounters(): Promise<Counters> {
  const platform = os.platform();
  const interfaces =
    platform === 'linux'
      ? await readLinuxCounters()
      : platform === 'darwin'
        ? await readDarwinCounters()
        : await readWindowsCounters();
  return { interfaces, at: Date.now() };
}

/**
 * Polls the OS byte counters once a second and turns the deltas into a live
 * throughput reading. Emits `sample` after every poll.
 */
export class NetworkMonitor extends EventEmitter {
  private timer: NodeJS.Timeout | null = null;
  private previous: Counters | null = null;
  private history: NetworkSample[] = [];
  private peakDown = 0;
  private peakUp = 0;
  private totalDown = 0;
  private totalUp = 0;
  private current: NetworkData;
  private lastError: string | null = null;

  constructor(private config: NetworkConfig) {
    super();
    this.current = this.emptyData();
  }

  private emptyData(): NetworkData {
    return {
      interfaceName: this.config.interfaceName ?? 'all interfaces',
      downloadBps: 0,
      uploadBps: 0,
      peakDownloadBps: 0,
      peakUploadBps: 0,
      totalDownloadBytes: 0,
      totalUploadBytes: 0,
      history: [],
      lastSpeedTest: null,
      updatedAt: Date.now(),
    };
  }

  setConfig(config: NetworkConfig): void {
    const changed = config.interfaceName !== this.config.interfaceName;
    this.config = config;
    if (changed) {
      this.previous = null;
      this.peakDown = 0;
      this.peakUp = 0;
      this.history = [];
      this.current.interfaceName = config.interfaceName ?? 'all interfaces';
    }
  }

  start(): void {
    if (this.timer) return;
    void this.poll();
    this.timer = setInterval(() => void this.poll(), SAMPLE_MS);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  getData(): NetworkData {
    return this.current;
  }

  async listInterfaces(): Promise<string[]> {
    try {
      const counters = await readCounters();
      return [...counters.interfaces.keys()].filter((name) => !LOOPBACK.test(name)).sort();
    } catch {
      return Object.keys(os.networkInterfaces());
    }
  }

  private selected(counters: Counters['interfaces']): { rx: number; tx: number } {
    if (this.config.interfaceName) {
      return counters.get(this.config.interfaceName) ?? { rx: 0, tx: 0 };
    }
    let rx = 0;
    let tx = 0;
    for (const [name, value] of counters) {
      if (LOOPBACK.test(name)) continue;
      rx += value.rx;
      tx += value.tx;
    }
    return { rx, tx };
  }

  private async poll(): Promise<void> {
    let counters: Counters;
    try {
      counters = await readCounters();
      this.lastError = null;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message !== this.lastError) {
        console.error('[network] counter read failed:', message);
        this.lastError = message;
      }
      return;
    }

    const totals = this.selected(counters.interfaces);
    if (this.previous) {
      const seconds = (counters.at - this.previous.at) / 1000;
      const before = this.selected(this.previous.interfaces);
      if (seconds > 0) {
        // Counters reset on interface restart/rollover — clamp instead of spiking.
        const rxDelta = Math.max(0, totals.rx - before.rx);
        const txDelta = Math.max(0, totals.tx - before.tx);
        const downloadBps = (rxDelta * 8) / seconds;
        const uploadBps = (txDelta * 8) / seconds;

        this.totalDown += rxDelta;
        this.totalUp += txDelta;
        this.peakDown = Math.max(this.peakDown, downloadBps);
        this.peakUp = Math.max(this.peakUp, uploadBps);
        this.history.push({ timestamp: counters.at, downloadBps, uploadBps });
        if (this.history.length > HISTORY_POINTS) this.history.shift();

        this.current = {
          ...this.current,
          interfaceName: this.config.interfaceName ?? 'all interfaces',
          downloadBps,
          uploadBps,
          peakDownloadBps: this.peakDown,
          peakUploadBps: this.peakUp,
          totalDownloadBytes: this.totalDown,
          totalUploadBytes: this.totalUp,
          history: [...this.history],
          updatedAt: counters.at,
        };
        this.emit('sample', this.current);
      }
    }
    this.previous = counters;
  }

  /** One-off bandwidth check against Cloudflare's speed endpoints. */
  async runSpeedTest(): Promise<SpeedTestResult> {
    const bytes = Math.max(1_000_000, this.config.speedTestBytes);

    const pingStart = Date.now();
    await fetch(`${SPEED_TEST_HOST}/__down?bytes=0`, { cache: 'no-store' });
    const latencyMs = Date.now() - pingStart;

    const downStart = Date.now();
    const downResponse = await fetch(`${SPEED_TEST_HOST}/__down?bytes=${bytes}`, {
      cache: 'no-store',
    });
    const downloaded = (await downResponse.arrayBuffer()).byteLength;
    const downSeconds = (Date.now() - downStart) / 1000;

    const payload = Buffer.alloc(Math.min(bytes, 10_000_000), 0);
    const upStart = Date.now();
    await fetch(`${SPEED_TEST_HOST}/__up`, {
      method: 'POST',
      body: payload,
      headers: { 'content-type': 'application/octet-stream' },
    });
    const upSeconds = (Date.now() - upStart) / 1000;

    const result: SpeedTestResult = {
      downloadMbps: downSeconds > 0 ? (downloaded * 8) / downSeconds / 1e6 : 0,
      uploadMbps: upSeconds > 0 ? (payload.length * 8) / upSeconds / 1e6 : 0,
      latencyMs,
      ranAt: Date.now(),
    };
    this.current = { ...this.current, lastSpeedTest: result };
    this.emit('sample', this.current);
    return result;
  }
}
