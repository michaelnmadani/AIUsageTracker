import React from 'react';

interface Props {
  progress: number;
  size?: number;
  stroke?: number;
  colour?: string;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({
  progress,
  size = 74,
  stroke = 7,
  colour = 'var(--accent)',
  label,
  sublabel,
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colour}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeContent: 'center',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 640, fontVariantNumeric: 'tabular-nums' }}>
          {label ?? `${Math.round(clamped)}%`}
        </div>
        {sublabel ? (
          <div style={{ fontSize: 9.5, color: 'var(--text-faint)' }}>{sublabel}</div>
        ) : null}
      </div>
    </div>
  );
}
