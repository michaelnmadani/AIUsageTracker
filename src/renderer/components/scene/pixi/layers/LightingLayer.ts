import { Container, Sprite } from 'pixi.js';
import { SCENE_WIDTH, SCENE_HEIGHT, FIREPLACE, WINDOW_LIGHT, DESK_LAMP, FLOOR_LAMP } from '../config/SceneConfig';
import { getGlowTexture, getVignetteTexture } from '../GlowTextures';
import { TweenManager } from '../TweenManager';

/**
 * Lighting overlay built from tinted radial-gradient sprites with additive
 * blending: fireplace glow (flickering), golden window light, warm lamp
 * pools, a soft ambient wash, and a gentle vignette.
 */
export class LightingLayer extends Container {
  private fireGlow: Sprite;
  private fireCore: Sprite;
  private lampGlows: Sprite[] = [];
  // Two overlapping oscillators make the flicker feel organic
  private flickerSlow = { v: 1 };
  private flickerFast = { v: 1 };
  private lampPulse = { v: 1 };

  constructor(tweenManager: TweenManager) {
    super();

    const glow = (x: number, y: number, w: number, h: number, tint: number, alpha: number): Sprite => {
      const s = new Sprite(getGlowTexture());
      s.anchor.set(0.5);
      s.position.set(x, y);
      s.width = w;
      s.height = h;
      s.tint = tint;
      s.alpha = alpha;
      s.blendMode = 'add';
      this.addChild(s);
      return s;
    };

    // Warm ambient wash over the whole room
    glow(SCENE_WIDTH / 2, SCENE_HEIGHT * 0.48, 640, 640, 0xffc98a, 0.13);

    // Golden hour window light (the angled beam itself is baked, pre-blurred,
    // into the room art — a runtime polygon would show hard edges)
    glow(WINDOW_LIGHT.x, WINDOW_LIGHT.y + 4, 230, 200, 0xffe2a0, 0.26);
    glow(80, 200, 190, 160, 0xffe2a0, 0.12);

    // Fireplace glow (flickers in update)
    this.fireGlow = glow(FIREPLACE.x, FIREPLACE.y + 4, 300, 240, 0xff8c3a, 0.34);
    this.fireCore = glow(FIREPLACE.x, FIREPLACE.y + 2, 140, 110, 0xffc25e, 0.4);
    // Warm pool the fire casts on the floor in front of the hearth
    glow(FIREPLACE.x, 172, 220, 90, 0xff9848, 0.2);

    // Lanterns
    this.lampGlows.push(glow(DESK_LAMP.x, DESK_LAMP.y, 120, 100, 0xffc668, 0.32));
    this.lampGlows.push(glow(FLOOR_LAMP.x, FLOOR_LAMP.y, 140, 120, 0xffc668, 0.3));

    // Vignette (normal blend, warm dark edges)
    const vignette = new Sprite(getVignetteTexture());
    vignette.position.set(-24, -24);
    vignette.width = SCENE_WIDTH + 48;
    vignette.height = SCENE_HEIGHT + 48;
    vignette.alpha = 0.4;
    this.addChild(vignette);

    tweenManager.oscillate(this.flickerSlow, 'v', 0.82, 1.0, 2700);
    tweenManager.oscillate(this.flickerFast, 'v', 0.92, 1.0, 640);
    tweenManager.oscillate(this.lampPulse, 'v', 0.9, 1.0, 3800);
  }

  update(_deltaMs: number): void {
    const flicker = this.flickerSlow.v * this.flickerFast.v;
    this.fireGlow.alpha = 0.34 * flicker;
    this.fireCore.alpha = 0.4 * flicker;
    for (const lamp of this.lampGlows) {
      lamp.alpha = 0.3 * this.lampPulse.v;
    }
  }
}
