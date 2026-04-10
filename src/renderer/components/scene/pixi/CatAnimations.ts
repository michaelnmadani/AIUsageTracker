import type { CatActivity } from '../../../types/usage';
import { ParticleSystem, type ParticleConfig } from './ParticleSystem';
import { CAT_POSITIONS } from './config/SceneConfig';

/**
 * Activity-specific particle effect configurations.
 * These create the visual effects that accompany each cat's activity.
 */

/** Get particle config for a cat activity's ambient effects */
export function getActivityEffectConfig(activity: CatActivity): {
  config: ParticleConfig;
  intervalMs: number;
} | null {
  const pos = CAT_POSITIONS[activity];

  switch (activity) {
    case 'cooking':
      // Steam rising from pot
      return {
        config: {
          x: pos.x + 50 * pos.scale,
          y: pos.y + 42 * pos.scale,
          spawnRadius: 3,
          vx: 0,
          vy: -8,
          vRandom: 2,
          lifetime: 2000,
          size: 2.5,
          color: 0xe8ddd0,
          alpha: 0.3,
          endScale: 1.5,
        },
        intervalMs: 600,
      };

    case 'sweeping':
      // Dust particles
      return {
        config: {
          x: pos.x + 50 * pos.scale,
          y: pos.y + 85 * pos.scale,
          spawnRadius: 5,
          vx: 5,
          vy: -6,
          vRandom: 3,
          lifetime: 1500,
          size: 1.5,
          color: 0xd8c8b0,
          alpha: 0.4,
          endScale: 0.5,
        },
        intervalMs: 350,
      };

    case 'sleeping':
      // Zzz bubbles
      return {
        config: {
          x: pos.x + 35 * pos.scale,
          y: pos.y + 20 * pos.scale,
          spawnRadius: 2,
          vx: 3,
          vy: -5,
          vRandom: 1,
          lifetime: 3000,
          size: 8,
          color: 0xaabbcc,
          alpha: 0.6,
          type: 'text',
          text: 'z',
          textStyle: { fontFamily: 'serif', fontStyle: 'italic' },
          endScale: 1.3,
        },
        intervalMs: 1000,
      };

    case 'gardening':
      // Water drops
      return {
        config: {
          x: pos.x + 50 * pos.scale,
          y: pos.y + 55 * pos.scale,
          spawnRadius: 3,
          vx: 0,
          vy: 10,
          vRandom: 2,
          lifetime: 1000,
          size: 1.5,
          color: 0x6699cc,
          alpha: 0.6,
          gravity: 20,
          endScale: 0.3,
        },
        intervalMs: 300,
      };

    case 'typing':
      // No particles for typing (typing uses paw animation only)
      return null;

    case 'reading':
      // Subtle thought sparkles
      return {
        config: {
          x: pos.x + 10 * pos.scale,
          y: pos.y + 10 * pos.scale,
          spawnRadius: 5,
          vx: -1,
          vy: -3,
          vRandom: 2,
          lifetime: 2500,
          size: 1,
          color: 0xffd700,
          alpha: 0.4,
          endScale: 0.5,
        },
        intervalMs: 800,
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

  const ps = new ParticleSystem(15);
  ps.startEmitting(effectCfg.config, effectCfg.intervalMs);
  return ps;
}
