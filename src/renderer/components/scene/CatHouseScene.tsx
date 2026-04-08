import React from 'react';
import { House } from './House';
import { CookingCat } from './CookingCat';
import { ReadingCat } from './ReadingCat';
import { SweepingCat } from './SweepingCat';
import { SleepingCat } from './SleepingCat';
import { TypingCat } from './TypingCat';
import { GardeningCat } from './GardeningCat';
import { CelebrationEffects } from './CelebrationEffects';
import type { CatActivity } from '../../types/usage';
import styles from './scene.module.css';

interface CatHouseSceneProps {
  activities: CatActivity[];
  isActive: boolean;
  celebrating: boolean;
}

const CAT_POSITIONS: Record<string, { x: number; y: number; scale: number }> = {
  cooking:   { x: 40,  y: 30,  scale: 0.50 },
  typing:    { x: 280, y: 25,  scale: 0.48 },
  reading:   { x: 270, y: 100, scale: 0.50 },
  sweeping:  { x: 150, y: 100, scale: 0.48 },
  sleeping:  { x: 280, y: 170, scale: 0.45 },
  gardening: { x: 40,  y: 170, scale: 0.50 },
};

const CatComponent: Record<CatActivity, React.FC<{ x?: number; y?: number }>> = {
  cooking: CookingCat,
  reading: ReadingCat,
  sweeping: SweepingCat,
  sleeping: SleepingCat,
  typing: TypingCat,
  gardening: GardeningCat,
};

export const CatHouseScene: React.FC<CatHouseSceneProps> = ({ activities, isActive, celebrating }) => {
  const uniqueActivities = [...new Set(activities)];

  const sceneClass = celebrating
    ? styles.sceneCelebrating
    : isActive
      ? styles.sceneActive
      : styles.sceneIdle;

  return (
    <div className={`${styles.sceneContainer} ${sceneClass}`}>
      <svg
        viewBox="0 0 400 250"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        className={styles.sceneSvg}
      >
        {/* Dark background behind room (visible outside walls/door) */}
        <rect width="400" height="250" fill="#2a3a2a" />
        {/* Outdoor grass visible around edges */}
        <rect x="0" y="228" width="400" height="22" fill="#4a6e34" />

        {/* Room interior */}
        <House />

        {/* Render cats with walking animation wrappers */}
        {uniqueActivities.map((activity) => {
          const Component = CatComponent[activity];
          const pos = CAT_POSITIONS[activity];
          const walkClass = isActive
            ? styles[`walkPath_${activity}` as keyof typeof styles]
            : undefined;

          return (
            <g key={activity} transform={`translate(${pos.x}, ${pos.y}) scale(${pos.scale})`}>
              <g className={walkClass || undefined}>
                <Component x={0} y={0} />
              </g>
            </g>
          );
        })}

        {/* Celebration effects overlay */}
        <CelebrationEffects celebrating={celebrating} />

        {/* Status indicator */}
        {isActive && (
          <g className={styles.activeOverlay}>
            <circle cx="390" cy="8" r="4" fill="#22c55e" opacity="0.8" />
            <circle cx="390" cy="8" r="6" fill="#22c55e" opacity="0.2" className={styles.pulse} />
          </g>
        )}
      </svg>
    </div>
  );
};
