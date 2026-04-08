import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { ModelStats } from '../../types/usage';
import { formatTokenCount } from '../../utils/formatters';

interface ModelsProps {
  models: ModelStats[];
}

export const Models: React.FC<ModelsProps> = ({ models }) => {
  const totalTokens = useMemo(
    () => models.reduce((sum, m) => sum + m.totalTokens, 0),
    [models]
  );

  if (models.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100px',
          color: '#64748b',
          fontSize: '12px',
        }}
      >
        No model data yet
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Donut chart */}
      <div style={{ height: 100, WebkitAppRegion: 'no-drag' as any }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={models}
              dataKey="totalTokens"
              nameKey="displayName"
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={40}
              paddingAngle={2}
              strokeWidth={0}
            >
              {models.map((model) => (
                <Cell key={model.model} fill={model.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e2a4a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '10px',
                color: '#e2e8f0',
              }}
              formatter={(value: number) => [formatTokenCount(value), 'Tokens']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Model list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {models.map((model) => {
          const percentage = totalTokens > 0 ? ((model.totalTokens / totalTokens) * 100).toFixed(1) : '0';
          return (
            <div
              key={model.model}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '6px',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: model.color,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#e2e8f0' }}>
                  {model.displayName}
                </div>
                <div style={{ fontSize: '9px', color: '#64748b' }}>
                  {model.entryCount} request{model.entryCount !== 1 ? 's' : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: model.color,
                    fontFamily: "'SF Mono', monospace",
                  }}
                >
                  {formatTokenCount(model.totalTokens)}
                </div>
                <div style={{ fontSize: '8px', color: '#64748b' }}>{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
