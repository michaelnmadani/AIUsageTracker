import React, { useState } from 'react';
import { PixiScene } from './components/scene/PixiScene';
import { Dashboard } from './components/dashboard/Dashboard';
import { useUsageData } from './hooks/useUsageData';
import { useClaudeStatus } from './hooks/useClaudeStatus';
import { useSoundEffects } from './hooks/useSoundEffects';

export const App: React.FC = () => {
  const { current, history, projects, models, loading } = useUsageData();
  const { status, catActivities, isActive, celebrating } = useClaudeStatus(current);
  const { muted, volume, setVolume, toggleMute } = useSoundEffects(status);
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);

  const handleToggleAlwaysOnTop = async () => {
    if (window.usageAPI) {
      const result = await window.usageAPI.toggleAlwaysOnTop();
      setAlwaysOnTop(result);
    }
  };

  const handleMinimize = () => window.usageAPI?.minimize();
  const handleClose = () => window.usageAPI?.close();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#1a1a2e',
      }}
    >
      {/* Custom title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          position: 'relative',
          padding: '6px 10px',
          WebkitAppRegion: 'drag' as any,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          flexShrink: 0,
        }}
      >
        {/* Centered title */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'none',
        }}>
          {/* Cat icon */}
          <svg width="14" height="14" viewBox="0 0 20 20">
            <circle cx="10" cy="12" r="7" fill="#ff9800" />
            <polygon points="4,6 2,0 7,4" fill="#ff9800" />
            <polygon points="16,6 18,0 13,4" fill="#ff9800" />
            <circle cx="7" cy="11" r="1.5" fill="#424242" />
            <circle cx="13" cy="11" r="1.5" fill="#424242" />
          </svg>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>
            AI Usage Tracker
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            WebkitAppRegion: 'no-drag' as any,
          }}
        >
          {/* Sound toggle */}
          <button
            onClick={toggleMute}
            style={{
              width: '22px',
              height: '22px',
              marginTop: '2px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: muted ? '#ef4444' : '#94a3b8',
              fontSize: '12px',
            }}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>

          {/* Volume slider */}
          {!muted && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{
                width: '40px',
                height: '3px',
                accentColor: '#f59e0b',
                cursor: 'pointer',
              }}
            />
          )}

          {/* Pin button */}
          <button
            onClick={handleToggleAlwaysOnTop}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alwaysOnTop ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: alwaysOnTop ? '#f59e0b' : '#64748b',
              fontSize: '10px',
            }}
            title={alwaysOnTop ? 'Unpin' : 'Pin on top'}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill={alwaysOnTop ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M12 2L12 12" />
              <path d="M17 5H7L5 12H19L17 5Z" />
              <path d="M12 12V22" />
            </svg>
          </button>

          {/* Minimize */}
          <button
            onClick={handleMinimize}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <svg width="10" height="2" viewBox="0 0 10 2">
              <rect width="10" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>

          {/* Close */}
          <button
            onClick={handleClose}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cat scene (top ~55%) */}
      <div style={{ height: '55%', flexShrink: 0, overflow: 'hidden' }}>
        <PixiScene activities={catActivities} isActive={isActive} celebrating={celebrating} />
      </div>

      {/* Dashboard (bottom ~45%) */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {loading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#64748b',
              fontSize: '12px',
            }}
          >
            Loading usage data...
          </div>
        ) : (
          <Dashboard
            current={current}
            history={history}
            projects={projects}
            models={models}
            status={status}
          />
        )}
      </div>
    </div>
  );
};
