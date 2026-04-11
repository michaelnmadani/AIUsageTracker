import { Container, Sprite, Graphics, Texture } from 'pixi.js';
import type { CatActivity } from '../../../types/usage';
import { CAT_POSITIONS, CAT_BOB_PERIODS, WALK_DURATIONS } from './config/SceneConfig';
import { WALK_PATHS, interpolateWalkPath } from './WalkPaths';
import { TweenManager } from './TweenManager';

/** Activity animation config: defines the animated overlay for each cat */
interface ActivityAnimConfig {
  /** Arm pivot relative to sprite top-left (in sprite-local px before scaling) */
  armPivotX: number;
  armPivotY: number;
  /** Arm length in px */
  armLength: number;
  /** Arm rest angle in radians (0 = pointing right) */
  armRestAngle: number;
  /** Arm rotation oscillation range (± radians) */
  armSwing: number;
  /** Arm swing period (ms) */
  armPeriod: number;
  /** Tool offset from arm end */
  toolOffsetX: number;
  toolOffsetY: number;
  /** Additional tool rotation oscillation (± radians) */
  toolSwing: number;
  toolPeriod: number;
  /** Draw functions */
  drawArm: (g: Graphics) => void;
  drawTool: (g: Graphics) => void;
}

const ACTIVITY_ANIMS: Partial<Record<CatActivity, ActivityAnimConfig>> = {
  cooking: {
    armPivotX: 34, armPivotY: 52,
    armLength: 20, armRestAngle: -0.6,
    armSwing: 0.25, armPeriod: 1500,
    toolOffsetX: 0, toolOffsetY: 0,
    toolSwing: 0.3, toolPeriod: 1500,
    drawArm: (g) => {
      // Forearm
      g.moveTo(0, 0);
      g.lineTo(18, 0);
      g.stroke({ color: 0xfff0e0, width: 5 });
      // Paw
      g.circle(18, 0, 4);
      g.fill(0xfff0e0);
    },
    drawTool: (g) => {
      // Ladle handle
      g.moveTo(0, 0);
      g.lineTo(14, -4);
      g.stroke({ color: 0x8d6e63, width: 2.5 });
      // Ladle bowl
      g.ellipse(16, -4, 5, 3);
      g.fill(0x8a8a8a);
      g.ellipse(16, -4, 5, 3);
      g.stroke({ color: 0x6a6a6a, width: 0.6 });
    },
  },
  sweeping: {
    armPivotX: 38, armPivotY: 48,
    armLength: 18, armRestAngle: 0.3,
    armSwing: 0.2, armPeriod: 800,
    toolOffsetX: 0, toolOffsetY: 0,
    toolSwing: 0.15, toolPeriod: 800,
    drawArm: (g) => {
      g.moveTo(0, 0);
      g.lineTo(16, 0);
      g.stroke({ color: 0xffd890, width: 5 });
      g.circle(16, 0, 4);
      g.fill(0xfff0e0);
    },
    drawTool: (g) => {
      // Broom handle
      g.moveTo(0, 0);
      g.lineTo(24, 20);
      g.stroke({ color: 0x8d6e50, width: 2.5 });
      // Bristles
      g.moveTo(20, 20);
      g.lineTo(16, 30);
      g.lineTo(20, 28);
      g.lineTo(24, 30);
      g.lineTo(28, 28);
      g.lineTo(32, 30);
      g.lineTo(28, 20);
      g.fill(0xd4a060);
    },
  },
  typing: {
    armPivotX: 28, armPivotY: 58,
    armLength: 14, armRestAngle: 0.2,
    armSwing: 0.0, armPeriod: 300,
    toolOffsetX: 0, toolOffsetY: 0,
    toolSwing: 0.0, toolPeriod: 300,
    drawArm: (g) => {
      // Left paw
      g.circle(-4, 0, 4.5);
      g.fill(0xc8a078);
      g.circle(-4, -1, 1, 1);
      g.fill({ color: 0xd8a898, alpha: 0.5 });
      g.circle(-5.5, 0, 1, 1);
      g.fill({ color: 0xd8a898, alpha: 0.5 });
      g.circle(-2.5, 0, 1, 1);
      g.fill({ color: 0xd8a898, alpha: 0.5 });
      // Right paw
      g.circle(12, 0, 4.5);
      g.fill(0xc8a078);
      g.circle(12, -1, 1, 1);
      g.fill({ color: 0xd8a898, alpha: 0.5 });
      g.circle(10.5, 0, 1, 1);
      g.fill({ color: 0xd8a898, alpha: 0.5 });
      g.circle(13.5, 0, 1, 1);
      g.fill({ color: 0xd8a898, alpha: 0.5 });
    },
    drawTool: () => {
      // No separate tool — keyboard is in the background
    },
  },
  reading: {
    armPivotX: 32, armPivotY: 56,
    armLength: 16, armRestAngle: -0.2,
    armSwing: 0.08, armPeriod: 4000,
    toolOffsetX: 2, toolOffsetY: -4,
    toolSwing: 0.06, toolPeriod: 4000,
    drawArm: (g) => {
      g.moveTo(0, 0);
      g.lineTo(14, -2);
      g.stroke({ color: 0xa89a90, width: 5 });
      g.circle(14, -2, 4);
      g.fill(0xd8d0c8);
    },
    drawTool: (g) => {
      // Book
      g.roundRect(-2, -12, 20, 14, 2);
      g.fill(0xe8d5b7);
      g.roundRect(-2, -12, 20, 14, 2);
      g.stroke({ color: 0xa08060, width: 1 });
      // Spine
      g.moveTo(8, -12);
      g.lineTo(8, 2);
      g.stroke({ color: 0xa08060, width: 1 });
      // Text lines
      g.moveTo(0, -8);
      g.lineTo(6, -8);
      g.stroke({ color: 0xc4a882, width: 0.5 });
      g.moveTo(0, -5);
      g.lineTo(5, -5);
      g.stroke({ color: 0xc4a882, width: 0.5 });
      g.moveTo(10, -8);
      g.lineTo(16, -8);
      g.stroke({ color: 0xc4a882, width: 0.5 });
      g.moveTo(10, -5);
      g.lineTo(15, -5);
      g.stroke({ color: 0xc4a882, width: 0.5 });
    },
  },
  gardening: {
    armPivotX: 32, armPivotY: 52,
    armLength: 18, armRestAngle: -0.8,
    armSwing: 0.3, armPeriod: 2000,
    toolOffsetX: 0, toolOffsetY: 0,
    toolSwing: 0.25, toolPeriod: 2000,
    drawArm: (g) => {
      g.moveTo(0, 0);
      g.lineTo(16, 0);
      g.stroke({ color: 0xfff0e0, width: 5 });
      g.circle(16, 0, 4);
      g.fill(0xfff0e0);
    },
    drawTool: (g) => {
      // Watering can body
      g.roundRect(-4, -6, 14, 10, 2.5);
      g.fill(0x8a9aaa);
      g.roundRect(-4, -6, 14, 10, 2.5);
      g.stroke({ color: 0x6a7a8a, width: 0.8 });
      // Spout
      g.moveTo(10, -2);
      g.lineTo(18, -8);
      g.stroke({ color: 0x8a9aaa, width: 2.5 });
      // Handle
      g.moveTo(-2, -6);
      g.quadraticCurveTo(1, -14, 8, -6);
      g.stroke({ color: 0x7a8a9a, width: 1.5 });
      // Water drops
      g.circle(19, -6, 1);
      g.fill({ color: 0x88ccee, alpha: 0.7 });
      g.circle(20, -4, 0.8);
      g.fill({ color: 0x88ccee, alpha: 0.5 });
    },
  },
};

/**
 * Individual cat display object with skeletal activity animations.
 * The base cat is a rasterized SVG texture. Animated arms/tools are
 * drawn with PixiJS Graphics and rotated via tweens.
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

  // Activity animation overlays
  private armContainer?: Container;
  private toolContainer?: Container;
  private armAnimState = { rotation: 0 };
  private toolAnimState = { rotation: 0 };
  private typingState = { leftY: 0, rightY: 0 };
  private _breathState?: { scaleY: number };

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

    // Build activity-specific animated overlay
    this.buildActivityAnimation();
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

  private buildActivityAnimation(): void {
    const config = ACTIVITY_ANIMS[this.activity];
    if (!config) return; // sleeping has no overlay

    const scale = CAT_POSITIONS[this.activity].scale;

    if (this.activity === 'typing') {
      // Typing is special — two paws bouncing alternately
      this.buildTypingAnimation(config, scale);
      return;
    }

    // Arm container: positioned at shoulder pivot, rotates
    this.armContainer = new Container();
    this.armContainer.x = config.armPivotX * scale;
    this.armContainer.y = config.armPivotY * scale;
    this.armContainer.scale.set(scale);
    this.armContainer.rotation = config.armRestAngle;

    const armGfx = new Graphics();
    config.drawArm(armGfx);
    this.armContainer.addChild(armGfx);

    // Tool container: attached to the end of the arm
    this.toolContainer = new Container();
    this.toolContainer.x = config.armLength;
    this.toolContainer.y = 0;

    const toolGfx = new Graphics();
    config.drawTool(toolGfx);
    this.toolContainer.addChild(toolGfx);

    this.armContainer.addChild(this.toolContainer);
    this.addChild(this.armContainer);

    // Start arm swing animation
    this.tweenManager.oscillate(
      this.armAnimState, 'rotation',
      config.armRestAngle - config.armSwing,
      config.armRestAngle + config.armSwing,
      config.armPeriod,
    );

    // Start tool rotation animation
    if (config.toolSwing > 0) {
      this.tweenManager.oscillate(
        this.toolAnimState, 'rotation',
        -config.toolSwing,
        config.toolSwing,
        config.toolPeriod,
      );
    }
  }

  private buildTypingAnimation(config: ActivityAnimConfig, scale: number): void {
    // Two paws that alternate bouncing
    this.armContainer = new Container();
    this.armContainer.x = config.armPivotX * scale;
    this.armContainer.y = config.armPivotY * scale;
    this.armContainer.scale.set(scale);

    const pawsGfx = new Graphics();
    config.drawArm(pawsGfx);
    this.armContainer.addChild(pawsGfx);
    this.addChild(this.armContainer);

    // Alternating paw bounce
    this.tweenManager.oscillate(this.typingState, 'leftY', 0, -3, 300);
    this.tweenManager.oscillate(this.typingState, 'rightY', -3, 0, 300);
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
    this.sprite.y = this.bobState.y;
    this.shadow.y = 95 * scale + this.bobState.y * 0.5;

    // Apply breathing for sleeping cat
    if (this._breathState) {
      this.sprite.scale.y = scale * this._breathState.scaleY;
    }

    // Apply arm/tool rotation from tweens
    if (this.armContainer && this.activity !== 'typing') {
      this.armContainer.rotation = this.armAnimState.rotation;
      this.armContainer.y = this.sprite.y + (ACTIVITY_ANIMS[this.activity]?.armPivotY ?? 0) * scale;
      if (this.toolContainer) {
        this.toolContainer.rotation = this.toolAnimState.rotation;
      }
    }

    // Typing paw bounce
    if (this.armContainer && this.activity === 'typing') {
      this.armContainer.y = this.sprite.y + (ACTIVITY_ANIMS[this.activity]?.armPivotY ?? 0) * scale + this.typingState.leftY * scale;
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
    this.armContainer?.destroy({ children: true });
    this.toolContainer?.destroy({ children: true });
    super.destroy();
  }
}
