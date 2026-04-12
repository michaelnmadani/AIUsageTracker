import { Container } from 'pixi.js';
import { ParticleSystem } from '../ParticleSystem';
import { SCENE_WIDTH, CELEBRATION_DURATION_MS } from '../config/SceneConfig';

/**
 * Handles celebration effects: confetti burst + sparkle overlay.
 * Triggered when a milestone is reached.
 */
export class CelebrationLayer extends Container {
  private confettiSystem: ParticleSystem;
  private sparkleSystem: ParticleSystem;
  private celebrationTimer = 0;
  private isCelebrating = false;

  constructor() {
    super();

    this.confettiSystem = new ParticleSystem(30);
    this.addChild(this.confettiSystem);

    this.sparkleSystem = new ParticleSystem(10);
    this.addChild(this.sparkleSystem);
  }

  /** Trigger a celebration burst */
  trigger(): void {
    this.isCelebrating = true;
    this.celebrationTimer = 0;
    this.alpha = 1;

    // Confetti burst — 20 pieces in various colors
    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa8e6cf, 0xdda0dd, 0x87ceeb, 0xffa07a, 0x98fb98];

    for (let i = 0; i < 20; i++) {
      const color = colors[i % colors.length];
      this.confettiSystem.burst(
        {
          x: Math.random() * SCENE_WIDTH,
          y: -10,
          vx: (Math.random() - 0.5) * 30,
          vy: 40 + Math.random() * 60,
          vRandom: 10,
          lifetime: 3000 + Math.random() * 500,
          size: 3 + Math.random() * 2,
          color,
          alpha: 1,
          gravity: 30,
          rotationSpeed: (Math.random() - 0.5) * 10,
          type: 'rect',
        },
        1,
      );
    }

    // Sparkle burst — 8 sparkles scattered across scene
    for (let i = 0; i < 8; i++) {
      this.sparkleSystem.burst(
        {
          x: 40 + Math.random() * 320,
          y: 48 + Math.random() * 304,
          vx: 0,
          vy: -2,
          lifetime: 1500 + Math.random() * 1000,
          size: 2 + Math.random() * 2,
          color: 0xffd700,
          alpha: 0.8,
          endScale: 0.3,
        },
        1,
      );
    }
  }

  /** Update celebration animation */
  update(deltaMs: number): void {
    if (!this.isCelebrating) return;

    this.celebrationTimer += deltaMs;
    this.confettiSystem.update(deltaMs);
    this.sparkleSystem.update(deltaMs);

    // Fade out over the last 25% of duration (matches CSS)
    const fadeStart = CELEBRATION_DURATION_MS * 0.75;
    if (this.celebrationTimer > fadeStart) {
      const fadeT = (this.celebrationTimer - fadeStart) / (CELEBRATION_DURATION_MS - fadeStart);
      this.alpha = Math.max(0, 1 - fadeT);
    }

    if (this.celebrationTimer >= CELEBRATION_DURATION_MS) {
      this.isCelebrating = false;
      this.confettiSystem.clear();
      this.sparkleSystem.clear();
      this.alpha = 0;
    }
  }

  destroy(): void {
    this.confettiSystem.destroy();
    this.sparkleSystem.destroy();
    super.destroy();
  }
}
