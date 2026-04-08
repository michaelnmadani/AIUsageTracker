import React from 'react';
import styles from './scene.module.css';

interface CelebrationEffectsProps {
  celebrating: boolean;
}

const CONFETTI = [
  { x: 40,  y: 10, w: 4, h: 3, color: '#ff6b6b', variant: 0 },
  { x: 80,  y: 5,  w: 3, h: 4, color: '#ffd93d', variant: 1 },
  { x: 130, y: 8,  w: 4, h: 3, color: '#6bcb77', variant: 2 },
  { x: 170, y: 3,  w: 3, h: 4, color: '#4d96ff', variant: 3 },
  { x: 210, y: 7,  w: 4, h: 3, color: '#ff6b6b', variant: 4 },
  { x: 250, y: 4,  w: 3, h: 4, color: '#ffd93d', variant: 0 },
  { x: 290, y: 9,  w: 4, h: 3, color: '#c678dd', variant: 1 },
  { x: 330, y: 2,  w: 3, h: 4, color: '#6bcb77', variant: 2 },
  { x: 60,  y: 12, w: 3, h: 3, color: '#4d96ff', variant: 3 },
  { x: 110, y: 6,  w: 4, h: 3, color: '#c678dd', variant: 4 },
  { x: 190, y: 11, w: 3, h: 4, color: '#ff6b6b', variant: 0 },
  { x: 270, y: 1,  w: 4, h: 3, color: '#ffd93d', variant: 1 },
  { x: 350, y: 8,  w: 3, h: 4, color: '#6bcb77', variant: 2 },
  { x: 150, y: 14, w: 4, h: 3, color: '#4d96ff', variant: 3 },
  { x: 310, y: 5,  w: 3, h: 4, color: '#c678dd', variant: 4 },
];

const SPARKLES = [
  { x: 100, y: 60 },
  { x: 200, y: 45 },
  { x: 300, y: 55 },
  { x: 150, y: 80 },
  { x: 250, y: 70 },
  { x: 80,  y: 100 },
  { x: 320, y: 95 },
  { x: 180, y: 110 },
];

/**
 * Celebration overlay: confetti falling + sparkle stars.
 * Renders for ~3.5 seconds then fades out via CSS.
 */
export const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({ celebrating }) => {
  if (!celebrating) return null;

  return (
    <g className={styles.celebration}>
      {/* Confetti pieces */}
      {CONFETTI.map((c, i) => (
        <rect
          key={`conf-${i}`}
          x={c.x}
          y={c.y}
          width={c.w}
          height={c.h}
          rx="0.5"
          fill={c.color}
          className={styles[`confetti_${c.variant}` as keyof typeof styles]}
        />
      ))}

      {/* Sparkle stars */}
      {SPARKLES.map((s, i) => (
        <g key={`spark-${i}`} className={styles.sparkle}>
          {/* 4-point star shape */}
          <polygon
            points={`${s.x},${s.y - 4} ${s.x + 1},${s.y - 1} ${s.x + 4},${s.y} ${s.x + 1},${s.y + 1} ${s.x},${s.y + 4} ${s.x - 1},${s.y + 1} ${s.x - 4},${s.y} ${s.x - 1},${s.y - 1}`}
            fill="#ffdd66"
            opacity="0.9"
          />
        </g>
      ))}
    </g>
  );
};
