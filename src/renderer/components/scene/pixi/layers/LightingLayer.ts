import { Container, Graphics } from 'pixi.js';
import { SCENE_WIDTH, SCENE_HEIGHT } from '../config/SceneConfig';
import { TweenManager } from '../TweenManager';

/**
 * Volumetric lighting overlay using additive blending.
 * Provides warm ambient glow, fireplace light, and window light shafts.
 */
export class LightingLayer extends Container {
  private pulseState = { alpha: 0.8 };

  constructor(tweenManager: TweenManager) {
    super();
    // Use 'add' blend mode for light overlay
    this.blendMode = 'add' as any;

    this.buildLights();

    // Pulsing warm glow animation
    tweenManager.oscillate(this.pulseState, 'alpha', 0.7, 1.0, 4000);
  }

  private buildLights(): void {
    // Fireplace glow
    const fireGlow = new Graphics();
    fireGlow.ellipse(200, 160, 50, 64);
    fireGlow.fill({ color: 0xff6622, alpha: 0.04 });
    fireGlow.ellipse(200, 160, 30, 40);
    fireGlow.fill({ color: 0xff8844, alpha: 0.06 });
    this.addChild(fireGlow);

    // Window light shaft
    const windowLight = new Graphics();
    // Angled light beam from window
    windowLight.poly([
      60, 64,    // top-left of window
      110, 64,   // top-right of window
      140, 320,  // bottom-right of beam
      80, 320,   // bottom-left of beam
    ]);
    windowLight.fill({ color: 0xfff8e0, alpha: 0.02 });
    this.addChild(windowLight);

    // Window glow at source
    const windowGlow = new Graphics();
    windowGlow.ellipse(85, 96, 30, 32);
    windowGlow.fill({ color: 0xfff8e0, alpha: 0.04 });
    this.addChild(windowGlow);

    // Ambient warm overlay (full scene)
    const ambient = new Graphics();
    ambient.rect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
    ambient.fill({ color: 0xffddaa, alpha: 0.015 });
    this.addChild(ambient);

    // Vignette (darker edges)
    const vignette = new Graphics();
    // Top edge
    vignette.rect(0, 0, SCENE_WIDTH, 30);
    vignette.fill({ color: 0x000000, alpha: 0.03 });
    // Bottom edge
    vignette.rect(0, SCENE_HEIGHT - 20, SCENE_WIDTH, 20);
    vignette.fill({ color: 0x000000, alpha: 0.05 });
    // Use normal blend for vignette
    vignette.blendMode = 'normal';
    this.addChild(vignette);
  }

  update(_deltaMs: number): void {
    // Apply pulsing alpha to the whole lighting layer
    this.alpha = this.pulseState.alpha;
  }
}
