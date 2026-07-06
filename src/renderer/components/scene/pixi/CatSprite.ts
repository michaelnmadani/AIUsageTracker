import { Container, AnimatedSprite, Sprite, Texture } from 'pixi.js';
import type { CatActivity } from '../../../types/usage';
import { CAT_POSITIONS, CAT_BOB_PERIODS, WALK_DURATIONS } from './config/SceneConfig';
import { WALK_PATHS, interpolateWalkPath } from './WalkPaths';
import { TweenManager } from './TweenManager';
import { getCatAnimFps } from './SvgRasterizer';
import { getGlowTexture } from './GlowTextures';

/** The cat SVG artwork is authored on a 120x120 viewBox */
const CAT_ART_SIZE = 120;

/**
 * Individual cat display object with frame-by-frame animation.
 * Each cat is an AnimatedSprite playing pre-rendered SVG frames
 * with different arm/tool positions baked into each frame.
 */
export class CatSprite extends Container {
  readonly activity: CatActivity;
  private animSprite: AnimatedSprite;
  private shadow: Sprite;
  private shadowBaseY: number;
  private spriteScale: number;
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

    // Normalize so pos.scale is always relative to the 120-unit artwork,
    // regardless of the supersampling factor the frames were rasterized at.
    this.spriteScale = (pos.scale * CAT_ART_SIZE) / Math.max(1, frames[0]?.width ?? CAT_ART_SIZE);

    // Soft ground shadow (radial gradient tinted black — clearly visible)
    const sleeping = activity === 'sleeping';
    this.shadow = new Sprite(getGlowTexture());
    this.shadow.anchor.set(0.5);
    this.shadow.tint = 0x2a180a;
    this.shadow.alpha = 0.38;
    this.shadow.width = (sleeping ? 165 : 120) * pos.scale;
    this.shadow.height = (sleeping ? 40 : 32) * pos.scale;
    // Body center is ~37 art-units from the texture's left edge; feet at ~96
    this.shadow.x = (sleeping ? 45 : 37) * pos.scale;
    this.shadowBaseY = (sleeping ? 88 : 96) * pos.scale;
    this.shadow.y = this.shadowBaseY;
    this.addChild(this.shadow);

    // Animated sprite from pre-rendered SVG frames
    this.animSprite = new AnimatedSprite(frames);
    this.animSprite.anchor.set(0, 0);
    this.animSprite.scale.set(this.spriteScale);
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
      this.tweenManager.oscillate(this.bobState, 'y', 0, -2.5, period);
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
    // Apply bob — shadow shrinks slightly as the cat lifts
    this.animSprite.y = this.bobState.y;
    this.shadow.y = this.shadowBaseY + this.bobState.y * 0.3;
    this.shadow.alpha = 0.38 + this.bobState.y * 0.02;

    // Apply breathing for sleeping cat
    if (this._breathState) {
      this.animSprite.scale.y = this.spriteScale * this._breathState.scaleY;
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
    return this.y + CAT_POSITIONS[this.activity].scale * 96;
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
