import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export interface ParticleConfig {
  /** Spawn area center */
  x: number;
  y: number;
  /** Spawn area radius (random offset from center) */
  spawnRadius?: number;
  /** Initial velocity */
  vx: number;
  vy: number;
  /** Velocity randomness (±) */
  vRandom?: number;
  /** Particle lifetime in ms */
  lifetime: number;
  /** Size of particle circle */
  size: number;
  /** Color (hex number) */
  color: number;
  /** Initial alpha */
  alpha?: number;
  /** Gravity (pixels per second squared, positive = down) */
  gravity?: number;
  /** Rotation speed (radians per second) */
  rotationSpeed?: number;
  /** Scale at end of life (1 = no change) */
  endScale?: number;
  /** Type of particle visual. 'glow' draws a soft halo around a bright core. */
  type?: 'circle' | 'rect' | 'text' | 'glow';
  /** Text content (for type=text) */
  text?: string;
  /** Text style options */
  textStyle?: Partial<TextStyle>;
  /** Blend mode for each particle (e.g. 'add' for light effects) */
  blendMode?: 'normal' | 'add' | 'screen';
}

interface Particle {
  display: Graphics | Text;
  vx: number;
  vy: number;
  gravity: number;
  rotationSpeed: number;
  lifetime: number;
  elapsed: number;
  startAlpha: number;
  endScale: number;
}

/**
 * Lightweight particle emitter using PixiJS Graphics.
 * No external dependencies — spawns/manages particles each frame.
 */
export class ParticleSystem extends Container {
  private particles: Particle[] = [];
  private emitting = false;
  private emitTimer = 0;
  private emitInterval = 0;
  private config: ParticleConfig | null = null;
  private maxParticles: number;

  constructor(maxParticles = 30) {
    super();
    this.maxParticles = maxParticles;
  }

  /** Start continuous emission */
  startEmitting(config: ParticleConfig, intervalMs: number): void {
    this.config = config;
    this.emitInterval = intervalMs;
    this.emitTimer = 0;
    this.emitting = true;
  }

  /** Stop emitting (existing particles continue to live) */
  stopEmitting(): void {
    this.emitting = false;
  }

  /** Emit a single burst of particles */
  burst(config: ParticleConfig, count: number): void {
    for (let i = 0; i < count; i++) {
      this.spawnParticle(config);
    }
  }

  /** Call each frame with delta time in ms */
  update(deltaMs: number): void {
    // Emit new particles
    if (this.emitting && this.config) {
      this.emitTimer += deltaMs;
      while (this.emitTimer >= this.emitInterval && this.particles.length < this.maxParticles) {
        this.spawnParticle(this.config);
        this.emitTimer -= this.emitInterval;
      }
    }

    // Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.elapsed += deltaMs;

      if (p.elapsed >= p.lifetime) {
        this.removeChild(p.display);
        p.display.destroy();
        this.particles.splice(i, 1);
        continue;
      }

      const t = p.elapsed / p.lifetime; // 0 to 1

      // Update position
      p.vy += p.gravity * (deltaMs / 1000);
      p.display.x += p.vx * (deltaMs / 1000);
      p.display.y += p.vy * (deltaMs / 1000);

      // Fade out
      p.display.alpha = p.startAlpha * (1 - t);

      // Scale
      const scale = 1 + (p.endScale - 1) * t;
      p.display.scale.set(scale);

      // Rotation
      if (p.rotationSpeed) {
        p.display.rotation += p.rotationSpeed * (deltaMs / 1000);
      }
    }
  }

  private spawnParticle(cfg: ParticleConfig): void {
    const r = cfg.spawnRadius ?? 0;
    const ox = (Math.random() - 0.5) * 2 * r;
    const oy = (Math.random() - 0.5) * 2 * r;
    const vr = cfg.vRandom ?? 0;

    let display: Graphics | Text;

    if (cfg.type === 'text' && cfg.text) {
      display = new Text({
        text: cfg.text,
        style: new TextStyle({
          fontSize: cfg.size,
          fill: cfg.color,
          ...cfg.textStyle,
        }),
      });
    } else if (cfg.type === 'rect') {
      display = new Graphics();
      display.rect(-cfg.size / 2, -cfg.size / 2, cfg.size, cfg.size);
      display.fill(cfg.color);
    } else if (cfg.type === 'glow') {
      // Bright core with two translucent halo rings for a soft light-mote look
      display = new Graphics();
      display.circle(0, 0, cfg.size * 2.6);
      display.fill({ color: cfg.color, alpha: 0.14 });
      display.circle(0, 0, cfg.size * 1.55);
      display.fill({ color: cfg.color, alpha: 0.3 });
      display.circle(0, 0, cfg.size);
      display.fill({ color: cfg.color, alpha: 1 });
    } else {
      display = new Graphics();
      display.circle(0, 0, cfg.size);
      display.fill(cfg.color);
    }

    if (cfg.blendMode) {
      display.blendMode = cfg.blendMode;
    }
    display.x = cfg.x + ox;
    display.y = cfg.y + oy;
    display.alpha = cfg.alpha ?? 1;

    const particle: Particle = {
      display,
      vx: cfg.vx + (Math.random() - 0.5) * 2 * vr,
      vy: cfg.vy + (Math.random() - 0.5) * 2 * vr,
      gravity: cfg.gravity ?? 0,
      rotationSpeed: cfg.rotationSpeed ?? 0,
      lifetime: cfg.lifetime,
      elapsed: 0,
      startAlpha: cfg.alpha ?? 1,
      endScale: cfg.endScale ?? 1,
    };

    this.particles.push(particle);
    this.addChild(display);
  }

  /** Clear all particles */
  clear(): void {
    for (const p of this.particles) {
      this.removeChild(p.display);
      p.display.destroy();
    }
    this.particles = [];
  }

  destroy(): void {
    this.clear();
    super.destroy();
  }
}
