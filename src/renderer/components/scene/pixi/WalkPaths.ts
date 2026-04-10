import type { CatActivity } from '../../../types/usage';

export interface PathKeyframe {
  pct: number;  // 0-100
  x: number;
  y: number;
}

/** Walk path data extracted from CSS @keyframes */
export const WALK_PATHS: Record<CatActivity, PathKeyframe[]> = {
  cooking: [
    { pct: 0, x: 0, y: 0 },
    { pct: 15, x: 15, y: 8 },
    { pct: 35, x: 25, y: -5 },
    { pct: 55, x: 10, y: -12 },
    { pct: 75, x: -8, y: 5 },
    { pct: 100, x: 0, y: 0 },
  ],
  typing: [
    { pct: 0, x: 0, y: 0 },
    { pct: 20, x: -10, y: 12 },
    { pct: 40, x: 8, y: 20 },
    { pct: 60, x: 15, y: 5 },
    { pct: 80, x: -5, y: -8 },
    { pct: 100, x: 0, y: 0 },
  ],
  reading: [
    { pct: 0, x: 0, y: 0 },
    { pct: 25, x: -15, y: 5 },
    { pct: 50, x: -20, y: -10 },
    { pct: 75, x: -5, y: -15 },
    { pct: 100, x: 0, y: 0 },
  ],
  sweeping: [
    { pct: 0, x: 0, y: 0 },
    { pct: 12, x: 20, y: 5 },
    { pct: 25, x: 35, y: -8 },
    { pct: 37, x: 20, y: -15 },
    { pct: 50, x: 0, y: -10 },
    { pct: 62, x: -15, y: -5 },
    { pct: 75, x: -25, y: 8 },
    { pct: 87, x: -10, y: 10 },
    { pct: 100, x: 0, y: 0 },
  ],
  sleeping: [
    { pct: 0, x: 0, y: 0 },
    { pct: 50, x: 3, y: 2 },
    { pct: 100, x: 0, y: 0 },
  ],
  gardening: [
    { pct: 0, x: 0, y: 0 },
    { pct: 20, x: 18, y: -5 },
    { pct: 40, x: 30, y: 8 },
    { pct: 60, x: 15, y: 15 },
    { pct: 80, x: -5, y: 8 },
    { pct: 100, x: 0, y: 0 },
  ],
};

/**
 * Interpolate position along a walk path given a normalized time (0-1).
 * Uses linear interpolation between keyframes.
 */
export function interpolateWalkPath(path: PathKeyframe[], t: number): { x: number; y: number } {
  const pct = (t % 1) * 100;

  // Find surrounding keyframes
  let i = 0;
  while (i < path.length - 1 && path[i + 1].pct <= pct) {
    i++;
  }

  if (i >= path.length - 1) {
    return { x: path[path.length - 1].x, y: path[path.length - 1].y };
  }

  const a = path[i];
  const b = path[i + 1];
  const segmentT = (pct - a.pct) / (b.pct - a.pct);

  // Ease in-out (matching CSS ease-in-out)
  const eased = segmentT < 0.5
    ? 2 * segmentT * segmentT
    : 1 - Math.pow(-2 * segmentT + 2, 2) / 2;

  return {
    x: a.x + (b.x - a.x) * eased,
    y: a.y + (b.y - a.y) * eased,
  };
}
