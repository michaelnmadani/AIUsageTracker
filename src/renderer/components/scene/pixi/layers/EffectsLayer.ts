import { Container } from 'pixi.js';
import type { CatActivity } from '../../../../types/usage';
import { ParticleSystem } from '../ParticleSystem';
import { createActivityParticles } from '../CatAnimations';

/**
 * Manages all particle effects in the scene:
 * - Per-cat activity effects (steam, dust, zzz, water drops)
 * - Ambient effects (fireflies)
 */
export class EffectsLayer extends Container {
  private activityEffects = new Map<CatActivity, ParticleSystem>();
  private fireflySystem: ParticleSystem;

  constructor() {
    super();

    // Ambient fireflies
    this.fireflySystem = new ParticleSystem(12);
    this.fireflySystem.startEmitting(
      {
        x: 200,
        y: 125,
        spawnRadius: 150,
        vx: 0,
        vy: 0,
        vRandom: 3,
        lifetime: 5000,
        size: 1.5,
        color: 0xffdd88,
        alpha: 0.5,
        endScale: 0.8,
      },
      800,
    );
    this.addChild(this.fireflySystem);
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
    this.fireflySystem.update(deltaMs);
    for (const ps of this.activityEffects.values()) {
      ps.update(deltaMs);
    }
  }

  destroy(): void {
    this.fireflySystem.destroy();
    for (const ps of this.activityEffects.values()) {
      ps.destroy();
    }
    this.activityEffects.clear();
    super.destroy();
  }
}
