import React from 'react';

interface Props {
  progress: number;
  size?: number;
  stroke?: number;
  colour?: string;
  label?: string;
  sublabel?: string;
  /** Spin the outer reticle — used while something is actively running. */
  active?: boolean;
}

const TICKS = 36;

/** Arc-reactor style dial: ticked bezel, dashed reticle, glowing progress arc. */
export function ProgressRing({
  progress,
  size = 76,
  stroke = 5,
  colour = 'var(--hud)',
  label,
  sublabel,
  active = false,
}: Props) {
  const centre = size / 2;
  const radius = centre - stroke * 1.6;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progress));
  const litTicks = Math.round((clamped / 100) * TICKS);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
          <circle
            cx={centre}
            cy={centre}
            r={radius}
            fill="none"
            stroke="rgba(94,214,255,0.12)"
            strokeWidth={stroke}
          />
          <circle
            cx={centre}
            cy={centre}
            r={radius}
            fill="none"
            stroke={colour}
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - clamped / 100)}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: 'drop-shadow(0 0 5px currentColor)',
              color: colour,
            }}
          />
        </g>

        {/* Tick bezel: lit ticks track progress, the rest sit dim. */}
        <g>
          {Array.from({ length: TICKS }, (_, index) => {
            const angle = (index / TICKS) * Math.PI * 2 - Math.PI / 2;
            const outer = radius + stroke * 1.35;
            const inner = outer - (index % 3 === 0 ? 4 : 2.2);
            return (
              <line
                key={index}
                x1={centre + Math.cos(angle) * inner}
                y1={centre + Math.sin(angle) * inner}
                x2={centre + Math.cos(angle) * outer}
                y2={centre + Math.sin(angle) * outer}
                stroke={index < litTicks ? colour : 'rgba(94,214,255,0.18)'}
                strokeWidth={index % 3 === 0 ? 1.2 : 0.8}
                style={{ transition: 'stroke 0.4s ease' }}
              />
            );
          })}
        </g>

        {/* Reticle: dashed inner ring that rotates while the job runs. */}
        <circle
          cx={centre}
          cy={centre}
          r={radius - stroke * 1.9}
          fill="none"
          stroke="rgba(94,214,255,0.35)"
          strokeWidth="0.9"
          strokeDasharray="3 7"
          style={{
            transformOrigin: 'center',
            animation: active ? 'spin 7s linear infinite' : 'spin 34s linear infinite',
          }}
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeContent: 'center',
          textAlign: 'center',
          lineHeight: 1.25,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.04em',
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--hud-bright)',
          }}
        >
          {label ?? `${Math.round(clamped)}%`}
        </div>
        {sublabel ? (
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 8.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
            }}
          >
            {sublabel}
          </div>
        ) : null}
      </div>
    </div>
  );
}
