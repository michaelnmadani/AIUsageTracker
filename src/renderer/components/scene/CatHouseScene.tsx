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

const CAT_POSITIONS = {
  cooking: { x: 30, y: 95 },
  reading: { x: 260, y: 90 },
  sweeping: { x: 150, y: 88 },
  sleeping: { x: 90, y: 105 },
  typing: { x: 170, y: 85 },
  gardening: { x: 310, y: 90 },
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
        {/* Background gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="40%" stopColor="#16213e" />
            <stop offset="100%" stopColor="#1b3a1b" />
          </linearGradient>
        </defs>
        <rect width="400" height="250" fill="url(#bgGradient)" />

        {/* Stars (when idle/night feel) */}
        <g className={styles.stars} opacity={isActive ? 0.2 : 0.6}>
          <circle cx="30" cy="20" r="1" fill="white" />
          <circle cx="80" cy="35" r="0.5" fill="white" />
          <circle cx="150" cy="15" r="0.8" fill="white" />
          <circle cx="220" cy="28" r="0.6" fill="white" />
          <circle cx="290" cy="10" r="1" fill="white" />
          <circle cx="340" cy="40" r="0.5" fill="white" />
          <circle cx="380" cy="18" r="0.7" fill="white" />
          <circle cx="120" cy="45" r="0.4" fill="white" />
          <circle cx="270" cy="50" r="0.6" fill="white" />
          <circle cx="60" cy="55" r="0.5" fill="white" />
        </g>

        {/* Moon */}
        <circle cx="350" cy="35" r="15" fill="#fff9c4" opacity="0.3" />
        <circle cx="355" cy="32" r="13" fill="url(#bgGradient)" />

        {/* House background elements */}
        <House />

        {/* Render active cats */}
        {uniqueActivities.map((activity) => {
          const Component = CatComponent[activity];
          const pos = CAT_POSITIONS[activity];
          return (
            <Component
              key={activity}
              x={pos.x}
              y={pos.y}
            />
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
