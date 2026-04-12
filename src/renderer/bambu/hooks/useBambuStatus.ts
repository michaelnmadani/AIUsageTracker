import { useState, useEffect } from 'react';

interface BambuPrintStatus {
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

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export function useBambuStatus() {
  const [status, setStatus] = useState<BambuPrintStatus | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');

  useEffect(() => {
    if (!window.bambuAPI) return;

    // Load cached status on mount
    window.bambuAPI.getStatus().then((cached: BambuPrintStatus | null) => {
      if (cached) setStatus(cached);
    });

    window.bambuAPI.getConnectionState().then((state: ConnectionState) => {
      setConnectionState(state);
    });

    const unsubStatus = window.bambuAPI.onPrintStatus((newStatus: BambuPrintStatus) => {
      setStatus(newStatus);
    });

    const unsubConnection = window.bambuAPI.onConnectionState((state: ConnectionState) => {
      setConnectionState(state);
    });

    return () => {
      unsubStatus();
      unsubConnection();
    };
  }, []);

  return { status, connectionState };
}
