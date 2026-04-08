import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HistoricalUsage } from '../../types/usage';
import { formatTokenCount, formatDate, formatHour } from '../../utils/formatters';

interface HistoryProps {
  history: HistoricalUsage;
}

export const History: React.FC<HistoryProps> = ({ history }) => {
  const [view, setView] = useState<'hourly' | 'daily'>('hourly');

  const data = useMemo(() => {
    const source = view === 'hourly' ? history.hourly : history.daily;
    return Object.entries(source)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-24) // Last 24 data points
      .map(([time, usage]) => ({
        time,
        label: view === 'hourly' ? formatHour(time) : formatDate(time),
        input: usage.inputTokens,
        output: usage.outputTokens,
        cache: usage.cacheCreationTokens + usage.cacheReadTokens,
        total: usage.inputTokens + usage.outputTokens,
      }));
  }, [history, view]);

  const totalTokens = useMemo(
    () => data.reduce((sum, d) => sum + d.total, 0),
    [data]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* View toggle */}
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
        {(['hourly', 'daily'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '3px 10px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              backgroundColor: view === v ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: view === v ? '#e2e8f0' : '#64748b',
              border: 'none',
              cursor: 'pointer',
              WebkitAppRegion: 'no-drag' as any,
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Summary stat */}
      <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>
        Total: <span style={{ color: '#f59e0b', fontWeight: 600 }}>{formatTokenCount(totalTokens)}</span> tokens
      </div>

      {/* Chart */}
      {data.length > 0 ? (
        <div style={{ height: 120, WebkitAppRegion: 'no-drag' as any }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="inputGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outputGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 8, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 8, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatTokenCount(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e2a4a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '10px',
                  color: '#e2e8f0',
                }}
                formatter={(value: number, name: string) => [
                  formatTokenCount(value),
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
              />
              <Area
                type="monotone"
                dataKey="input"
                stroke="#3b82f6"
                fill="url(#inputGrad)"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="output"
                stroke="#22c55e"
                fill="url(#outputGrad)"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div
          style={{
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontSize: '12px',
          }}
        >
          No usage data yet
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#94a3b8' }}>
          <span style={{ width: 8, height: 3, backgroundColor: '#3b82f6', borderRadius: 1 }} />
          Input
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#94a3b8' }}>
          <span style={{ width: 8, height: 3, backgroundColor: '#22c55e', borderRadius: 1 }} />
          Output
        </div>
      </div>
    </div>
  );
};
