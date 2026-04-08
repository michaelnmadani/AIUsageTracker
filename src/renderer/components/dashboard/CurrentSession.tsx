import React, { useMemo } from 'react';
import type { CurrentSessionInfo } from '../../types/usage';
import { TokenCounter } from '../widgets/TokenCounter';
import { ModelBadge } from '../widgets/ModelBadge';
import { StatusIndicator } from '../widgets/StatusIndicator';
import { MiniChart } from '../widgets/MiniChart';
import { formatDuration, formatTokenCount } from '../../utils/formatters';
import type { ClaudeStatus } from '../../types/usage';

interface CurrentSessionProps {
  current: CurrentSessionInfo;
  status: ClaudeStatus;
}

export const CurrentSession: React.FC<CurrentSessionProps> = ({ current, status }) => {
  const sessionDuration = useMemo(() => {
    if (!current.startedAt) return '--';
    return formatDuration(Date.now() - current.startedAt);
  }, [current.startedAt]);

  // Generate sparkline data from recent entries
  const sparklineData = useMemo(() => {
    const entries = current.recentEntries || [];
    if (entries.length === 0) return [0, 0, 0, 0, 0];
    return entries.slice(-10).map((e) => e.usage.inputTokens + e.usage.outputTokens);
  }, [current.recentEntries]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Status bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <StatusIndicator status={status} />
        <ModelBadge model={current.model} />
      </div>

      {/* Project name */}
      {current.projectName && (
        <div
          style={{
            fontSize: '12px',
            color: '#94a3b8',
            padding: '4px 8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          {current.projectName}
        </div>
      )}

      {/* Token counters grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
        }}
      >
        <div
          style={{
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
          }}
        >
          <TokenCounter
            value={current.totalInputTokens}
            label="Input"
            color="#3b82f6"
            size="sm"
          />
        </div>
        <div
          style={{
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
          }}
        >
          <TokenCounter
            value={current.totalOutputTokens}
            label="Output"
            color="#22c55e"
            size="sm"
          />
        </div>
        <div
          style={{
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
          }}
        >
          <TokenCounter
            value={current.totalCacheTokens}
            label="Cache"
            color="#f59e0b"
            size="sm"
          />
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 8px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '8px',
        }}
      >
        <div style={{ fontSize: '10px', color: '#64748b' }}>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>
            {formatTokenCount(current.tokensPerMinute)}
          </span>{' '}
          tok/min
        </div>
        <MiniChart data={sparklineData} color="#f59e0b" width={60} height={20} />
        <div style={{ fontSize: '10px', color: '#64748b' }}>
          {sessionDuration}
        </div>
      </div>

      {/* Total tokens */}
      <div
        style={{
          padding: '10px',
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))',
          borderRadius: '10px',
          textAlign: 'center',
        }}
      >
        <TokenCounter
          value={current.totalInputTokens + current.totalOutputTokens + current.totalCacheTokens}
          label="Total Session Tokens"
          color="#e2e8f0"
          size="lg"
        />
      </div>
    </div>
  );
};
