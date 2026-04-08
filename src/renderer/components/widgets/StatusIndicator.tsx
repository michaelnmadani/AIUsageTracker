import React from 'react';
import type { ClaudeStatus } from '../../types/usage';

interface StatusIndicatorProps {
  status: ClaudeStatus;
}

const STATUS_CONFIG = {
  active: { color: '#22c55e', label: 'Active', pulse: true },
  idle: { color: '#6b7280', label: 'Idle', pulse: false },
  offline: { color: '#ef4444', label: 'Offline', pulse: false },
};

/**
 * Pulsing status dot with label.
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          width: '8px',
          height: '8px',
        }}
      >
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: config.color,
          }}
        />
        {config.pulse && (
          <span
            style={{
              position: 'absolute',
              inset: '-3px',
              borderRadius: '50%',
              backgroundColor: config.color,
              opacity: 0.3,
              animation: 'statusPulse 1.5s ease-out infinite',
            }}
          />
        )}
      </span>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 500,
          color: config.color,
        }}
      >
        {config.label}
      </span>
      <style>{`
        @keyframes statusPulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
