import dgram from 'dgram';
import crypto from 'crypto';
import WebSocket from 'ws';
import type { ElegooPrinterConfig, PrinterState, PrinterStatus } from '../../../shared/types';

const DISCOVERY_PORT = 3000;
const DISCOVERY_MESSAGE = 'M99999';
const DISCOVERY_TIMEOUT_MS = 2_500;
const WS_TIMEOUT_MS = 6_000;

/** SDCP machine status (Data.Status.CurrentStatus). */
const SDCP_MACHINE_STATUS: Record<number, { state: PrinterState; label: string }> = {
  0: { state: 'idle', label: 'Idle' },
  1: { state: 'printing', label: 'Printing' },
  2: { state: 'idle', label: 'File transfer' },
  3: { state: 'idle', label: 'Exposure test' },
  4: { state: 'idle', label: 'Self test' },
};

/** SDCP print status (Data.Status.PrintInfo.Status) — finer grained than the above. */
const SDCP_PRINT_STATUS: Record<number, { state: PrinterState; label: string }> = {
  0: { state: 'idle', label: 'Idle' },
  1: { state: 'printing', label: 'Homing' },
  2: { state: 'printing', label: 'Dropping' },
  3: { state: 'printing', label: 'Exposing' },
  4: { state: 'printing', label: 'Lifting' },
  5: { state: 'printing', label: 'Pausing' },
  6: { state: 'paused', label: 'Paused' },
  7: { state: 'printing', label: 'Stopping' },
  8: { state: 'idle', label: 'Stopped' },
  9: { state: 'finished', label: 'Complete' },
  10: { state: 'printing', label: 'Filling' },
  12: { state: 'printing', label: 'Printing' },
  13: { state: 'printing', label: 'Printing' },
  16: { state: 'error', label: 'Error' },
  20: { state: 'printing', label: 'Heating' },
};

function blank(config: ElegooPrinterConfig, error: string | null): PrinterStatus {
  return {
    id: config.id,
    name: config.name,
    brand: 'elegoo',
    model: config.protocol === 'sdcp' ? 'Elegoo (SDCP)' : 'Elegoo (Klipper)',
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

/** UDP broadcast handshake — the only way to learn a printer's MainboardID. */
function discover(host: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket('udp4');
    const timer = setTimeout(() => {
      socket.close();
      reject(new Error(`No SDCP reply from ${host}:${DISCOVERY_PORT}`));
    }, DISCOVERY_TIMEOUT_MS);

    socket.on('message', (payload) => {
      clearTimeout(timer);
      socket.close();
      try {
        resolve(JSON.parse(payload.toString()));
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Malformed SDCP discovery reply'));
      }
    });
    socket.on('error', (error) => {
      clearTimeout(timer);
      socket.close();
      reject(error);
    });
    socket.send(DISCOVERY_MESSAGE, DISCOVERY_PORT, host);
  });
}

/** Opens the SDCP websocket, asks for a status frame, and closes again. */
function requestStatus(host: string, port: number, mainboardId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(`ws://${host}:${port}/websocket`);
    const timer = setTimeout(() => {
      socket.terminate();
      reject(new Error('Timed out waiting for an SDCP status frame'));
    }, WS_TIMEOUT_MS);

    const done = (error: Error | null, value?: any) => {
      clearTimeout(timer);
      try {
        socket.close();
      } catch {
        /* already closing */
      }
      if (error) reject(error);
      else resolve(value);
    };

    socket.on('open', () => {
      socket.send(
        JSON.stringify({
          Id: crypto.randomUUID().replace(/-/g, ''),
          Data: {
            Cmd: 0,
            Data: {},
            RequestID: crypto.randomUUID().replace(/-/g, ''),
            MainboardID: mainboardId,
            TimeStamp: Date.now(),
            From: 0,
          },
          Topic: `sdcp/request/${mainboardId}`,
        })
      );
    });

    socket.on('message', (raw) => {
      try {
        const message = JSON.parse(raw.toString());
        if (message?.Status || String(message?.Topic ?? '').startsWith('sdcp/status/')) {
          done(null, message.Status ?? message.Data?.Status ?? message.Data);
        }
      } catch {
        /* keepalive or attribute frame — wait for the status one */
      }
    });

    socket.on('error', (error) => done(error as Error));
  });
}

async function readSdcp(config: ElegooPrinterConfig): Promise<PrinterStatus> {
  const discovery = await discover(config.host);
  const info = discovery?.Data ?? {};
  const mainboardId = info.MainboardID;
  const model = info.MachineName || info.Name || 'Elegoo (SDCP)';
  if (!mainboardId) throw new Error('Discovery reply had no MainboardID');

  const status = await requestStatus(config.host, config.port, mainboardId);
  const print = status?.PrintInfo ?? {};
  const machineStatus = Array.isArray(status?.CurrentStatus)
    ? status.CurrentStatus[0]
    : status?.CurrentStatus;

  const printMapped = SDCP_PRINT_STATUS[Number(print.Status)];
  const machineMapped = SDCP_MACHINE_STATUS[Number(machineStatus)] ?? {
    state: 'idle' as PrinterState,
    label: 'Idle',
  };
  const mapped = printMapped && printMapped.state !== 'idle' ? printMapped : machineMapped;

  const totalTicks = Number(print.TotalTicks ?? 0);
  const currentTicks = Number(print.CurrentTicks ?? 0);
  const totalLayer = Number(print.TotalLayer ?? 0);
  const currentLayer = Number(print.CurrentLayer ?? 0);
  const progress =
    totalTicks > 0
      ? (currentTicks / totalTicks) * 100
      : totalLayer > 0
        ? (currentLayer / totalLayer) * 100
        : 0;

  return {
    id: config.id,
    name: config.name,
    brand: 'elegoo',
    model,
    host: config.host,
    state: mapped.state,
    stateLabel: mapped.label,
    jobName: print.Filename || null,
    progress,
    layer: totalLayer > 0 ? currentLayer : null,
    totalLayers: totalLayer > 0 ? totalLayer : null,
    remainingSeconds: totalTicks > currentTicks ? (totalTicks - currentTicks) / 1000 : null,
    nozzleTemp: status?.TempOfNozzle ?? null,
    nozzleTarget: status?.TempTargetNozzle ?? null,
    bedTemp: status?.TempOfHotbed ?? null,
    bedTarget: status?.TempTargetHotbed ?? null,
    chamberTemp: status?.TempOfBox ?? null,
    fanSpeed: status?.CurrentFanSpeed?.ModelFan ?? null,
    speedLevel: null,
    filament: null,
    error: print.ErrorNumber ? `Printer error ${print.ErrorNumber}` : null,
    updatedAt: Date.now(),
  };
}

/** Neptune-series printers run Klipper, so Moonraker's REST API is the way in. */
async function readMoonraker(config: ElegooPrinterConfig): Promise<PrinterStatus> {
  const url =
    `http://${config.host}:${config.port}/printer/objects/query` +
    '?print_stats&display_status&extruder&heater_bed&virtual_sdcard&fan';
  const response = await fetch(url, { signal: AbortSignal.timeout(WS_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const status = (await response.json())?.result?.status ?? {};

  const printStats = status.print_stats ?? {};
  const display = status.display_status ?? {};
  const extruder = status.extruder ?? {};
  const bed = status.heater_bed ?? {};

  const stateMap: Record<string, { state: PrinterState; label: string }> = {
    standby: { state: 'idle', label: 'Idle' },
    printing: { state: 'printing', label: 'Printing' },
    paused: { state: 'paused', label: 'Paused' },
    complete: { state: 'finished', label: 'Complete' },
    cancelled: { state: 'idle', label: 'Cancelled' },
    error: { state: 'error', label: 'Error' },
  };
  const mapped = stateMap[printStats.state] ?? { state: 'idle' as PrinterState, label: 'Idle' };
  const progress = Number(display.progress ?? 0) * 100;
  const elapsed = Number(printStats.print_duration ?? 0);

  return {
    id: config.id,
    name: config.name,
    brand: 'elegoo',
    model: 'Elegoo (Klipper)',
    host: config.host,
    state: mapped.state,
    stateLabel: mapped.label,
    jobName: printStats.filename || null,
    progress,
    layer: printStats.info?.current_layer ?? null,
    totalLayers: printStats.info?.total_layer ?? null,
    // Moonraker has no ETA of its own — extrapolate from elapsed time vs progress.
    remainingSeconds: progress > 1 ? (elapsed / (progress / 100)) * (1 - progress / 100) : null,
    nozzleTemp: extruder.temperature ?? null,
    nozzleTarget: extruder.target ?? null,
    bedTemp: bed.temperature ?? null,
    bedTarget: bed.target ?? null,
    chamberTemp: null,
    fanSpeed: status.fan?.speed != null ? Number(status.fan.speed) * 100 : null,
    speedLevel: null,
    filament: null,
    error: printStats.message || null,
    updatedAt: Date.now(),
  };
}

export async function fetchElegooStatuses(
  configs: ElegooPrinterConfig[]
): Promise<PrinterStatus[]> {
  return Promise.all(
    configs
      .filter((config) => config.enabled)
      .map(async (config) => {
        try {
          return config.protocol === 'sdcp'
            ? await readSdcp(config)
            : await readMoonraker(config);
        } catch (error) {
          return blank(config, error instanceof Error ? error.message : String(error));
        }
      })
  );
}
