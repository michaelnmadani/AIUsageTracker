import type { CatActivity } from '../../../../types/usage';

/** Logical scene dimensions (matches original SVG viewBox) */
export const SCENE_WIDTH = 400;
export const SCENE_HEIGHT = 250;

/** Scene background color */
export const SCENE_BG = 0x2a3a2a;

/** Cat positions within the scene (reused from CatHouseScene) */
export const CAT_POSITIONS: Record<CatActivity, { x: number; y: number; scale: number }> = {
  cooking:   { x: 40,  y: 30,  scale: 0.275 },
  typing:    { x: 275, y: 25,  scale: 0.265 },
  reading:   { x: 265, y: 100, scale: 0.275 },
  sweeping:  { x: 150, y: 100, scale: 0.265 },
  sleeping:  { x: 275, y: 170, scale: 0.25 },
  gardening: { x: 40,  y: 170, scale: 0.275 },
};

/** Cat bob animation periods (seconds) — from CSS catBob / sleepBreathe */
export const CAT_BOB_PERIODS: Record<CatActivity, number> = {
  cooking:   3.0,
  reading:   4.0,
  sweeping:  2.0,
  sleeping:  3.0,  // uses sleepBreathe (scaleY) instead of catBob
  typing:    2.5,
  gardening: 3.5,
};

/** Walk path durations (seconds) — from CSS walk animation durations */
export const WALK_DURATIONS: Record<CatActivity, number> = {
  cooking:   14,
  typing:    16,
  reading:   18,
  sweeping:  12,
  sleeping:  20,
  gardening: 15,
};

/** Scene state filter settings */
export const SCENE_STATES = {
  active: {
    brightness: 1.05,
    saturate: 1.15,
    sepia: 0.05,
  },
  idle: {
    brightness: 0.75,
    saturate: 0.85,
    sepia: 0.1,
  },
  celebrating: {
    brightness: 1.15,
    saturate: 1.3,
    sepia: 0,
  },
} as const;

/** Transition duration for scene state changes (ms) */
export const STATE_TRANSITION_MS = 500;

/** Celebration effect duration (ms) — matches CSS celebrationFadeOut */
export const CELEBRATION_DURATION_MS = 3500;

/** Room colors for placeholder background */
export const ROOM_COLORS = {
  outerBg: 0x2a3a2a,
  grass: 0x4a6e34,
  floor: 0x8b7355,
  floorLight: 0xa0896a,
  wallBack: 0x6b8e6b,
  wallSide: 0x5a7d5a,
  ceiling: 0x7a9e7a,
  wallInner: 0xd4c4a8,
  windowGlow: 0xfff8e0,
  fireGlow: 0xff8844,
} as const;
