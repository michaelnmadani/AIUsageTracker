import React, { useMemo } from 'react';

interface MiniChartProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

/**
 * Tiny sparkline chart showing recent activity trends.
 */
export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  color = '#f59e0b',
  width = 80,
  height = 24,
}) => {
  const path = useMemo(() => {
    if (data.length < 2) return '';

    const max = Math.max(...data, 1);
    const step = width / (data.length - 1);
    const padding = 2;
    const chartHeight = height - padding * 2;

    const points = data.map((val, i) => ({
      x: i * step,
      y: padding + chartHeight - (val / max) * chartHeight,
    }));

    // Smooth curve through points
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return d;
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (!path) return '';
    const last = data.length - 1;
    const step = width / Math.max(last, 1);
    return `${path} L ${last * step} ${height} L 0 ${height} Z`;
  }, [path, data.length, width, height]);

  if (data.length < 2) {
    return (
      <svg width={width} height={height}>
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
          strokeDasharray="2 2"
        />
      </svg>
    );
  }

  return (
    <svg width={width} height={height}>
      {/* Fill area under curve */}
      <path d={areaPath} fill={color} opacity="0.1" />
      {/* Line */}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Last point dot */}
      <circle
        cx={width}
        cy={(() => {
          const max = Math.max(...data, 1);
          const padding = 2;
          const chartHeight = height - padding * 2;
          return padding + chartHeight - (data[data.length - 1] / max) * chartHeight;
        })()}
        r="2"
        fill={color}
      />
    </svg>
  );
};
