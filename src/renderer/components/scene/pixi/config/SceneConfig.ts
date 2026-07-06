import type { CatActivity } from '../../../../types/usage';

/** Logical scene dimensions */
export const SCENE_WIDTH = 400;
export const SCENE_HEIGHT = 400;

/** Scene background color (matches the room wall so letterbox edges blend in) */
export const SCENE_BG = 0xf3ddba;

/** Y where the back wall meets the floor in the room art */
export const WALL_FLOOR_Y = 150;

/** Landmark positions in the room art, used by lighting + effects */
export const FIREPLACE = { x: 200, y: 126 };
export const WINDOW_LIGHT = { x: 62, y: 56 };
export const DESK_LAMP = { x: 362, y: 92 };
export const FLOOR_LAMP = { x: 352, y: 176 };

/**
 * Cat positions within the scene.
 * `scale` is a multiplier on the 120px SVG art — cats stand ~72-78px tall so
 * the anime-level SVG detail (irises, whiskers, blush) actually reads.
 * Anchors are the top-left of the cat texture; feet land at y + 96*scale.
 */
export const CAT_POSITIONS: Record<CatActivity, { x: number; y: number; scale: number }> = {
  cooking:   { x: 12,  y: 88,  scale: 0.66 },  // in front of the kitchen counter
  typing:    { x: 292, y: 86,  scale: 0.66 },  // at the desk nook
  reading:   { x: 242, y: 182, scale: 0.66 },  // beside the armchair
  sweeping:  { x: 134, y: 172, scale: 0.66 },  // open floor near the fireplace
  sleeping:  { x: 260, y: 268, scale: 0.68 },  // cat bed on the braided mat
  gardening: { x: 18,  y: 260, scale: 0.68 },  // garden corner by the monstera
};

/** Cat bob animation periods (seconds) */
export const CAT_BOB_PERIODS: Record<CatActivity, number> = {
  cooking:   3.0,
  reading:   4.0,
  sweeping:  2.0,
  sleeping:  3.0,  // uses sleepBreathe (scaleY) instead of catBob
  typing:    2.5,
  gardening: 3.5,
};

/** Walk path durations (seconds) */
export const WALK_DURATIONS: Record<CatActivity, number> = {
  cooking:   14,
  typing:    16,
  reading:   18,
  sweeping:  12,
  sleeping:  20,
  gardening: 15,
};

/**
 * Scene state filter settings.
 * Idle stays warm and readable (previously 0.75 brightness washed the scene out).
 */
export const SCENE_STATES = {
  active: {
    brightness: 1.04,
    saturate: 1.12,
    sepia: 0.02,
  },
  idle: {
    brightness: 0.9,
    saturate: 0.94,
    sepia: 0.05,
  },
  celebrating: {
    brightness: 1.12,
    saturate: 1.28,
    sepia: 0,
  },
} as const;

/** Transition duration for scene state changes (ms) */
export const STATE_TRANSITION_MS = 500;

/** Celebration effect duration (ms) */
export const CELEBRATION_DURATION_MS = 3500;

/** Colors used for the pre-texture placeholder fill */
export const ROOM_COLORS = {
  wall: 0xf3ddba,
  floor: 0xb5814e,
} as const;
