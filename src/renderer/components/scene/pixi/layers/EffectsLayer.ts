import { Container } from 'pixi.js';
import type { CatActivity } from '../../../../types/usage';
import { ParticleSystem } from '../ParticleSystem';
import { createActivityParticles } from '../CatAnimations';
import { FIREPLACE } from '../config/SceneConfig';

/**
 * Manages all particle effects in the scene:
 * - Per-cat activity effects (steam, dust, zzz, water drops, sparkles)
 * - Ambient effects (sunlit dust motes, fireplace embers)
 */
export class EffectsLayer extends Container {
  private activityEffects = new Map<CatActivity, ParticleSystem>();
  private moteSystem: ParticleSystem;
  private emberSystem: ParticleSystem;

  constructor() {
    super();

    // Golden dust motes drifting through the room light
    this.moteSystem = new ParticleSystem(14);
    this.moteSystem.startEmitting(
      {
        x: 190,
        y: 170,
        spawnRadius: 160,
        vx: 1,
        vy: -1.5,
        vRandom: 2.5,
        lifetime: 6500,
        size: 2.2,
        color: 0xffe2a8,
        alpha: 0.55,
        type: 'glow',
        blendMode: 'add',
        endScale: 0.5,
      },
      620,
    );
    this.addChild(this.moteSystem);

    // Embers rising from the fireplace
    this.emberSystem = new ParticleSystem(10);
    this.emberSystem.startEmitting(
      {
        x: FIREPLACE.x,
        y: FIREPLACE.y + 8,
        spawnRadius: 9,
        vx: 0,
        vy: -15,
        vRandom: 5,
        gravity: -6,
        lifetime: 1300,
        size: 1.7,
        color: 0xffa050,
        alpha: 0.85,
        type: 'glow',
        blendMode: 'add',
        endScale: 0.35,
      },
      420,
    );
    this.addChild(this.emberSystem);
  }

  /** Update which activity effects are active */
  setActivities(activities: CatActivity[]): void {
    const activeSet = new Set(activities);

    // Remove effects for inactive cats
    for (const [activity, ps] of this.activityEffects) {
      if (!activeSet.has(activity)) {
        ps.stopEmitting();
        this.removeChild(ps);
        ps.destroy();
        this.activityEffects.delete(activity);
      }
    }

    // Add effects for newly active cats
    for (const activity of activities) {
      if (!this.activityEffects.has(activity)) {
        const ps = createActivityParticles(activity);
        if (ps) {
          this.activityEffects.set(activity, ps);
          this.addChild(ps);
        }
      }
    }
  }

  /** Update all particle systems */
  update(deltaMs: number): void {
    this.moteSystem.update(deltaMs);
    this.emberSystem.update(deltaMs);
    for (const ps of this.activityEffects.values()) {
      ps.update(deltaMs);
    }
  }

  destroy(): void {
    this.moteSystem.destroy();
    this.emberSystem.destroy();
    for (const ps of this.activityEffects.values()) {
      ps.destroy();
    }
    this.activityEffects.clear();
    super.destroy();
  }
}
