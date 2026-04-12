import React, { useState, useEffect, useRef } from 'react';

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

interface PrinterDialProps {
  status: BambuPrintStatus | null;
  connectionState: ConnectionState;
}

const RADIUS = 82;
const STROKE_WIDTH = 8;
const CENTER = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getArcColor(percent: number): string {
  // Amber (#f59e0b) at 0% -> Green (#22c55e) at 100%
  const r = Math.round(245 + (34 - 245) * (percent / 100));
  const g = Math.round(158 + (197 - 158) * (percent / 100));
  const b = Math.round(11 + (94 - 11) * (percent / 100));
  return `rgb(${r}, ${g}, ${b})`;
}

function formatTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00';
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const PrinterDial: React.FC<PrinterDialProps> = ({ status, connectionState }) => {
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const referenceTimestamp = useRef(0);
  const referenceSeconds = useRef(0);

  // Sync countdown when MQTT status arrives
  useEffect(() => {
    if (status && status.gcodeState === 'RUNNING') {
      referenceSeconds.current = status.remainingMinutes * 60;
      referenceTimestamp.current = status.timestamp;
      setDisplaySeconds(referenceSeconds.current);
    } else if (status) {
      setDisplaySeconds(status.remainingMinutes * 60);
    }
  }, [status]);

  // Tick down every second between MQTT updates
  useEffect(() => {
    if (!status || status.gcodeState !== 'RUNNING') return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - referenceTimestamp.current) / 1000);
      const remaining = Math.max(0, referenceSeconds.current - elapsed);
      setDisplaySeconds(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Determine display state
  let percent = 0;
  let stateLabel = '';
  let arcColor = 'rgba(255,255,255,0.15)';
  let showCountdown = false;
  let isPaused = false;
  let subtaskName = '';

  if (connectionState === 'disconnected' || connectionState === 'error') {
    stateLabel = 'Offline';
    arcColor = 'rgba(120,120,120,0.4)';
  } else if (connectionState === 'connecting') {
    stateLabel = 'Connecting...';
    arcColor = 'rgba(120,120,120,0.4)';
  } else if (!status || status.gcodeState === 'IDLE' || status.gcodeState === 'UNKNOWN') {
    stateLabel = 'No Print';
    arcColor = 'rgba(255,255,255,0.15)';
  } else if (status.gcodeState === 'RUNNING') {
    percent = status.percentComplete;
    arcColor = getArcColor(percent);
    showCountdown = true;
    subtaskName = status.subtaskName || '';
  } else if (status.gcodeState === 'PAUSE') {
    percent = status.percentComplete;
    arcColor = getArcColor(percent);
    showCountdown = true;
    isPaused = true;
    subtaskName = status.subtaskName || '';
  } else if (status.gcodeState === 'FINISH') {
    percent = 100;
    arcColor = '#22c55e';
    stateLabel = 'Complete!';
  } else if (status.gcodeState === 'FAILED') {
    percent = status.percentComplete;
    arcColor = '#ef4444';
    stateLabel = 'Failed';
  }

  const dashOffset = CIRCUMFERENCE * (1 - percent / 100);

  // Truncate long file names
  const displayName = subtaskName.length > 16
    ? subtaskName.substring(0, 14) + '...'
    : subtaskName;

  return (
    <div className="dial-container">
      <svg width={200} height={200} viewBox="0 0 200 200">
        {/* Background circle for readability */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={94}
          fill="rgba(0,0,0,0.6)"
        />

        {/* Outer track */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE_WIDTH}
        />

        {/* Progress arc */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={arcColor}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
          className={isPaused ? 'arc-paused' : ''}
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
        />

        {/* Center content */}
        {showCountdown ? (
          <>
            {/* Countdown timer */}
            <text
              x={CENTER}
              y={92}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#e2e8f0"
              fontFamily="'SF Mono', 'Fira Code', 'Consolas', monospace"
              fontSize="28"
              fontWeight="600"
            >
              {formatTime(displaySeconds)}
            </text>

            {/* Percentage */}
            <text
              x={CENTER}
              y={118}
              textAnchor="middle"
              dominantBaseline="central"
              fill={arcColor}
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              fontSize="16"
              fontWeight="500"
            >
              {Math.round(percent)}%
            </text>

            {/* File name or Paused label */}
            <text
              x={CENTER}
              y={140}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(255,255,255,0.5)"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              fontSize="9"
            >
              {isPaused ? 'PAUSED' : displayName}
            </text>

            {/* Layer info */}
            {status && status.totalLayers > 0 && (
              <text
                x={CENTER}
                y={155}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(255,255,255,0.35)"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                fontSize="8"
              >
                Layer {status.currentLayer}/{status.totalLayers}
              </text>
            )}
          </>
        ) : (
          <>
            {/* State label */}
            <text
              x={CENTER}
              y={CENTER}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(255,255,255,0.6)"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              fontSize="16"
              fontWeight="500"
            >
              {stateLabel}
            </text>

            {/* Percent if applicable (FINISH/FAILED) */}
            {percent > 0 && (
              <text
                x={CENTER}
                y={CENTER + 22}
                textAnchor="middle"
                dominantBaseline="central"
                fill={arcColor}
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                fontSize="14"
                fontWeight="500"
              >
                {Math.round(percent)}%
              </text>
            )}
          </>
        )}
      </svg>
    </div>
  );
};

export default PrinterDial;
