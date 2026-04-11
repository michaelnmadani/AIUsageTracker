import { Container, AnimatedSprite, Graphics, Texture } from 'pixi.js';
import type { CatActivity } from '../../../types/usage';
import { CAT_POSITIONS, CAT_BOB_PERIODS, WALK_DURATIONS } from './config/SceneConfig';
import { WALK_PATHS, interpolateWalkPath } from './WalkPaths';
import { TweenManager } from './TweenManager';
import { getCatAnimFps } from './SvgRasterizer';

/**
 * Individual cat display object with frame-by-frame animation.
 * Each cat is an AnimatedSprite playing pre-rendered SVG frames
 * with different arm/tool positions baked into each frame.
 */
export class CatSprite extends Container {
  readonly activity: CatActivity;
  private animSprite: AnimatedSprite;
  private shadow: Graphics;
  private bobState = { y: 0 };
  private walkElapsed = 0;
  private isWalking = false;
  private baseX: number;
  private baseY: number;
  private _breathState?: { scaleY: number };

  constructor(
    activity: CatActivity,
    frames: Texture[],
    private tweenManager: TweenManager,
  ) {
    super();
    this.activity = activity;

    const pos = CAT_POSITIONS[activity];
    this.baseX = pos.x;
    this.baseY = pos.y;

    // Ground shadow
    this.shadow = new Graphics();
    this.shadow.ellipse(0, 0, 18, 5);
    this.shadow.fill({ color: 0x1a1a1a, alpha: 0.15 });
    this.shadow.x = 40 * pos.scale;
    this.shadow.y = 95 * pos.scale;
    this.addChild(this.shadow);

    // Animated sprite from pre-rendered SVG frames
    this.animSprite = new AnimatedSprite(frames);
    this.animSprite.anchor.set(0, 0);
    this.animSprite.scale.set(pos.scale);
    this.animSprite.animationSpeed = getCatAnimFps(activity) / 60;
    this.animSprite.loop = true;
    this.animSprite.play();
    this.addChild(this.animSprite);

    // Set position
    this.x = this.baseX;
    this.y = this.baseY;

    // Start bob animation
    this.startBob();
  }

  private startBob(): void {
    const period = CAT_BOB_PERIODS[this.activity] * 1000;

    if (this.activity === 'sleeping') {
      const breathState = { scaleY: 1.0 };
      this.tweenManager.oscillate(breathState, 'scaleY', 1.0, 1.02, period);
      this._breathState = breathState;
    } else {
      this.tweenManager.oscillate(this.bobState, 'y', 0, -2, period);
    }
  }

  /** Start walking along the path */
  startWalking(): void {
    this.isWalking = true;
    this.walkElapsed = 0;
  }

  /** Stop walking, return to base position */
  stopWalking(): void {
    this.isWalking = false;
    this.walkElapsed = 0;
  }

  /** Update each frame. deltaMs = milliseconds since last frame. */
  update(deltaMs: number): void {
    const scale = CAT_POSITIONS[this.activity].scale;

    // Apply bob
    this.animSprite.y = this.bobState.y;
    this.shadow.y = 95 * scale + this.bobState.y * 0.5;

    // Apply breathing for sleeping cat
    if (this._breathState) {
      this.animSprite.scale.y = scale * this._breathState.scaleY;
    }

    // Walk path
    if (this.isWalking) {
      const duration = WALK_DURATIONS[this.activity] * 1000;
      this.walkElapsed += deltaMs;
      const t = (this.walkElapsed % duration) / duration;
      const path = WALK_PATHS[this.activity];
      const pos = interpolateWalkPath(path, t);
      this.x = this.baseX + pos.x;
      this.y = this.baseY + pos.y;
    } else {
      this.x = this.baseX;
      this.y = this.baseY;
    }
  }

  /** Get the Y position for z-sorting (lower Y = further back = rendered first) */
  getSortY(): number {
    return this.y + CAT_POSITIONS[this.activity].scale * 95;
  }

  updateFrames(frames: Texture[]): void {
    this.animSprite.textures = frames;
    this.animSprite.play();
  }

  destroy(): void {
    this.shadow.destroy();
    this.animSprite.stop();
    this.animSprite.destroy();
    super.destroy();
  }
}
