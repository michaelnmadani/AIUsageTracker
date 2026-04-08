import React from 'react';
import { House } from './House';
import { CookingCat } from './CookingCat';
import { ReadingCat } from './ReadingCat';
import { SweepingCat } from './SweepingCat';
import { SleepingCat } from './SleepingCat';
import { TypingCat } from './TypingCat';
import { GardeningCat } from './GardeningCat';
import type { CatActivity } from '../../types/usage';
import styles from './scene.module.css';

interface CatHouseSceneProps {
  activities: CatActivity[];
  isActive: boolean;
}

const CAT_POSITIONS: Record<string, { x: number; y: number; scale: number }> = {
  cooking: { x: 82, y: 100, scale: 0.55 },
  reading: { x: 232, y: 92, scale: 0.55 },
  sweeping: { x: 160, y: 112, scale: 0.52 },
  sleeping: { x: 278, y: 128, scale: 0.48 },
  typing: { x: 62, y: 68, scale: 0.48 },
  gardening: { x: 2, y: 148, scale: 0.55 },
};

const CatComponent: Record<CatActivity, React.FC<{ x?: number; y?: number }>> = {
  cooking: CookingCat,
  reading: ReadingCat,
  sweeping: SweepingCat,
  sleeping: SleepingCat,
  typing: TypingCat,
  gardening: GardeningCat,
};

export const CatHouseScene: React.FC<CatHouseSceneProps> = ({ activities, isActive }) => {
  // Deduplicate activities
  const uniqueActivities = [...new Set(activities)];

  return (
    <div className={`${styles.sceneContainer} ${isActive ? styles.sceneActive : styles.sceneIdle}`}>
      <svg
        viewBox="0 0 400 250"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        className={styles.sceneSvg}
      >
        {/* Warm twilight background gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4956a" />
            <stop offset="30%" stopColor="#8faa6e" />
            <stop offset="60%" stopColor="#6b8e4e" />
            <stop offset="100%" stopColor="#4a6e34" />
          </linearGradient>
        </defs>
        <rect width="400" height="250" fill="url(#bgGradient)" />

        {/* Soft clouds */}
        <g opacity={isActive ? 0.35 : 0.25}>
          <ellipse cx="60" cy="25" rx="30" ry="8" fill="#e8d8c0" />
          <ellipse cx="45" cy="22" rx="18" ry="7" fill="#e8d8c0" />
          <ellipse cx="320" cy="18" rx="25" ry="6" fill="#e8d8c0" />
          <ellipse cx="340" cy="15" rx="15" ry="5" fill="#e8d8c0" />
          <ellipse cx="200" cy="12" rx="20" ry="5" fill="#e8d8c0" />
        </g>

        {/* Warm sun glow (top right) */}
        <circle cx="370" cy="20" r="20" fill="#f5c842" opacity="0.15" />
        <circle cx="370" cy="20" r="12" fill="#f5d062" opacity="0.25" />

        {/* Distant trees / hills */}
        <g opacity="0.4">
          <ellipse cx="15" cy="130" rx="20" ry="18" fill="#4a7030" />
          <ellipse cx="385" cy="128" rx="18" ry="16" fill="#4a7030" />
          <ellipse cx="395" cy="135" rx="12" ry="10" fill="#5a8040" />
          <ellipse cx="5" cy="135" rx="14" ry="12" fill="#5a8040" />
        </g>

        {/* House background elements */}
        <House />

        {/* Render active cats - positioned inside the tavern with scaling */}
        {uniqueActivities.map((activity) => {
          const Component = CatComponent[activity];
          const pos = CAT_POSITIONS[activity];
          return (
            <g key={activity} transform={`translate(${pos.x}, ${pos.y}) scale(${pos.scale})`}>
              <Component x={0} y={0} />
            </g>
          );
        })}

        {/* Status indicator overlay */}
        {isActive && (
          <g className={styles.activeOverlay}>
            <circle cx="380" cy="235" r="4" fill="#22c55e" opacity="0.8" />
            <circle cx="380" cy="235" r="6" fill="#22c55e" opacity="0.2" className={styles.pulse} />
          </g>
        )}
      </svg>
    </div>
  );
};
