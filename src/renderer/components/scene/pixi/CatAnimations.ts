import type { CatActivity } from '../../../types/usage';
import { ParticleSystem, type ParticleConfig } from './ParticleSystem';
import { CAT_POSITIONS } from './config/SceneConfig';

/**
 * Activity-specific particle effect configurations.
 *
 * Offsets are in cat-texture units: the cat SVG viewBox starts at x=-15, so a
 * prop at SVG x maps to (x + 15) * scale from the sprite's left edge.
 */

/** Get particle config for a cat activity's ambient effects */
export function getActivityEffectConfig(activity: CatActivity): {
  config: ParticleConfig;
  intervalMs: number;
} | null {
  const pos = CAT_POSITIONS[activity];
  const s = pos.scale;

  switch (activity) {
    case 'cooking':
      // Steam puffs rising from the pot held on the spoon
      return {
        config: {
          x: pos.x + 69 * s,
          y: pos.y + 40 * s,
          spawnRadius: 4,
          vx: 1,
          vy: -11,
          vRandom: 2.5,
          lifetime: 2200,
          size: 3.4,
          color: 0xf5ece2,
          alpha: 0.55,
          endScale: 2.1,
        },
        intervalMs: 450,
      };

    case 'sweeping':
      // Dust kicked up at the broom head
      return {
        config: {
          x: pos.x + 71 * s,
          y: pos.y + 80 * s,
          spawnRadius: 6,
          vx: 9,
          vy: -8,
          vRandom: 5,
          lifetime: 1300,
          size: 2.2,
          color: 0xd9c4a4,
          alpha: 0.55,
          endScale: 0.4,
        },
        intervalMs: 240,
      };

    case 'sleeping':
      // Drifting Zzz bubbles above the sleeping cat
      return {
        config: {
          x: pos.x + 59 * s,
          y: pos.y + 28 * s,
          spawnRadius: 3,
          vx: 4.5,
          vy: -7,
          vRandom: 1.5,
          lifetime: 2800,
          size: 12,
          color: 0x8ea6c9,
          alpha: 0.8,
          type: 'text',
          text: 'z',
          textStyle: { fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 'bold' },
          endScale: 1.4,
        },
        intervalMs: 1050,
      };

    case 'gardening':
      // Sparkling water drops from the watering can
      return {
        config: {
          x: pos.x + 71 * s,
          y: pos.y + 50 * s,
          spawnRadius: 4,
          vx: 2,
          vy: 15,
          vRandom: 3,
          lifetime: 850,
          size: 2,
          color: 0x8fc3e8,
          alpha: 0.85,
          gravity: 34,
          type: 'glow',
          endScale: 0.45,
        },
        intervalMs: 190,
      };

    case 'typing':
      // Little mint "code sparks" popping off the laptop keys
      return {
        config: {
          x: pos.x + 76 * s,
          y: pos.y + 52 * s,
          spawnRadius: 4,
          vx: 1,
          vy: -6,
          vRandom: 3,
          lifetime: 1100,
          size: 1.7,
          color: 0xa8e6cf,
          alpha: 0.85,
          type: 'glow',
          blendMode: 'add',
          endScale: 0.4,
        },
        intervalMs: 480,
      };

    case 'reading':
      // Golden thought sparkles near the "?!" bubble
      return {
        config: {
          x: pos.x + 67 * s,
          y: pos.y + 14 * s,
          spawnRadius: 6,
          vx: -1,
          vy: -3.5,
          vRandom: 2,
          lifetime: 2100,
          size: 1.9,
          color: 0xffd76e,
          alpha: 0.85,
          type: 'glow',
          blendMode: 'add',
          endScale: 0.4,
        },
        intervalMs: 600,
      };

    default:
      return null;
  }
}

/**
 * Create and configure a ParticleSystem for a cat activity.
 * Returns null if the activity has no particle effects.
 */
export function createActivityParticles(activity: CatActivity): ParticleSystem | null {
  const effectCfg = getActivityEffectConfig(activity);
  if (!effectCfg) return null;

  const ps = new ParticleSystem(18);
  ps.startEmitting(effectCfg.config, effectCfg.intervalMs);
  return ps;
}
