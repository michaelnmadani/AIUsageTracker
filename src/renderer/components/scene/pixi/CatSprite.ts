import { Container, Sprite, Graphics, Texture } from 'pixi.js';
import type { CatActivity } from '../../../types/usage';
import { CAT_POSITIONS, CAT_BOB_PERIODS, WALK_DURATIONS } from './config/SceneConfig';
import { WALK_PATHS, interpolateWalkPath } from './WalkPaths';
import { TweenManager } from './TweenManager';

/**
 * Individual cat display object.
 * Manages sprite display, walking animation, bob animation, and ground shadow.
 */
export class CatSprite extends Container {
  readonly activity: CatActivity;
  private sprite: Sprite;
  private shadow: Graphics;
  private bobState = { y: 0 };
  private walkElapsed = 0;
  private isWalking = false;
  private baseX: number;
  private baseY: number;

  constructor(
    activity: CatActivity,
    texture: Texture,
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

    // Cat sprite from rasterized SVG
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0, 0);
    this.sprite.scale.set(pos.scale);
    this.addChild(this.sprite);

    // Set position
    this.x = this.baseX;
    this.y = this.baseY;

    // Start bob animation
    this.startBob();
  }

  private startBob(): void {
    const period = CAT_BOB_PERIODS[this.activity] * 1000;

    if (this.activity === 'sleeping') {
      // Sleeping uses scaleY breathing instead of Y bob
      const breathState = { scaleY: 1.0 };
      this.tweenManager.oscillate(breathState, 'scaleY', 1.0, 1.02, period);
      // Apply in update
      this._breathState = breathState;
    } else {
      this.tweenManager.oscillate(this.bobState, 'y', 0, -2, period);
    }
  }

  private _breathState?: { scaleY: number };

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
    // Apply bob
    this.sprite.y = this.bobState.y;
    this.shadow.y = 95 * CAT_POSITIONS[this.activity].scale + this.bobState.y * 0.5;

    // Apply breathing for sleeping cat
    if (this._breathState) {
      this.sprite.scale.y = CAT_POSITIONS[this.activity].scale * this._breathState.scaleY;
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

  updateTexture(texture: Texture): void {
    this.sprite.texture = texture;
  }

  destroy(): void {
    this.shadow.destroy();
    this.sprite.destroy();
    super.destroy();
  }
}
