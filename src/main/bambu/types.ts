export interface BambuConfig {
  ip: string;
  serial: string;
  accessCode: string;
  printerName?: string;
}

export interface BambuPrintStatus {
  gcodeState: 'RUNNING' | 'PAUSE' | 'FINISH' | 'IDLE' | 'FAILED' | 'UNKNOWN';
  percentComplete: number;
  remainingMinutes: number;
  subtaskName: string | null;
  currentLayer: number;
  totalLayers: number;
  nozzleTemp: number;
  bedTemp: number;
  timestamp: number;
}

export type BambuConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
