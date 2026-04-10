import { Application, Container, Graphics, ColorMatrixFilter } from 'pixi.js';
import type { CatActivity } from '../../../types/usage';
import { SCENE_WIDTH, SCENE_HEIGHT, SCENE_STATES, STATE_TRANSITION_MS } from './config/SceneConfig';
import { BackgroundLayer } from './layers/BackgroundLayer';
import { CharacterLayer } from './layers/CharacterLayer';
import { EffectsLayer } from './layers/EffectsLayer';
import { CelebrationLayer } from './layers/CelebrationLayer';
import { LightingLayer } from './layers/LightingLayer';
import { TweenManager } from './TweenManager';
import { preloadAllCatTextures, clearTextureCache } from './SvgRasterizer';

type SceneState = 'idle' | 'active' | 'celebrating';

/**
 * Main orchestration class for the PixiJS scene.
 * Manages all layers, animation loop, and scene state transitions.
 */
export class SceneController {
  private app: Application;
  private tweenManager: TweenManager;
  private backgroundLayer!: BackgroundLayer;
  private characterLayer!: CharacterLayer;
  private effectsLayer!: EffectsLayer;
  private celebrationLayer!: CelebrationLayer;
  private lightingLayer!: LightingLayer;
  private uiLayer!: Container;
  private colorFilter!: ColorMatrixFilter;
  private currentState: SceneState = 'idle';
  private stateTransition = { brightness: 0.75, saturate: 0.85, sepia: 0.1 };
  private initialized = false;

  constructor(app: Application) {
    this.app = app;
    this.tweenManager = new TweenManager();
  }

  /** Initialize the scene. Must be called after construction. */
  async init(): Promise<void> {
    if (this.initialized) return;

    // Scale the stage to fit the logical scene size
    this.updateStageScale();

    // Create layers (back to front)
    this.backgroundLayer = new BackgroundLayer();
    this.characterLayer = new CharacterLayer(this.tweenManager);
    this.effectsLayer = new EffectsLayer();
    this.celebrationLayer = new CelebrationLayer();
    this.lightingLayer = new LightingLayer(this.tweenManager);
    this.uiLayer = new Container();

    // Add layers to stage
    this.app.stage.addChild(this.backgroundLayer);
    this.app.stage.addChild(this.characterLayer);
    this.app.stage.addChild(this.effectsLayer);
    this.app.stage.addChild(this.celebrationLayer);
    this.app.stage.addChild(this.lightingLayer);
    this.app.stage.addChild(this.uiLayer);

    // Scene state color filter
    this.colorFilter = new ColorMatrixFilter();
    this.app.stage.filters = [this.colorFilter];
    this.applySceneState('idle');

    // Status indicator (green dot — shown when active)
    this.buildStatusIndicator();

    // Preload cat textures from SVG
    const textures = await preloadAllCatTextures(2);
    this.characterLayer.setTextures(textures);

    // Start the animation loop
    this.app.ticker.add(this.onTick, this);

    // Handle resize
    this.app.renderer.on('resize', () => this.updateStageScale());

    this.initialized = true;
  }

  /** Scale the stage so logical 400x250 fits the canvas */
  private updateStageScale(): void {
    const screenW = this.app.renderer.width / (this.app.renderer.resolution || 1);
    const screenH = this.app.renderer.height / (this.app.renderer.resolution || 1);
    const scaleX = screenW / SCENE_WIDTH;
    const scaleY = screenH / SCENE_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    this.app.stage.scale.set(scale);
    // Center the scene
    this.app.stage.x = (screenW - SCENE_WIDTH * scale) / 2;
    this.app.stage.y = (screenH - SCENE_HEIGHT * scale) / 2;
  }

  private buildStatusIndicator(): void {
    const dot = new Graphics();
    dot.circle(390, 8, 4);
    dot.fill({ color: 0x22c55e, alpha: 0.8 });
    dot.label = 'statusDot';
    this.uiLayer.addChild(dot);

    const pulse = new Graphics();
    pulse.circle(390, 8, 6);
    pulse.fill({ color: 0x22c55e, alpha: 0.2 });
    pulse.label = 'statusPulse';
    this.uiLayer.addChild(pulse);

    // Pulse animation
    const pulseState = { scale: 1, alpha: 0.4 };
    this.tweenManager.oscillate(pulseState, 'scale', 1, 1.5, 1500);
    this.tweenManager.oscillate(pulseState, 'alpha', 0.4, 0, 1500);

    this.app.ticker.add(() => {
      pulse.scale.set(pulseState.scale);
      pulse.alpha = pulseState.alpha;
    });

    // Initially hidden (idle state)
    this.uiLayer.visible = false;
  }

  /** Animation loop callback */
  private onTick(): void {
    const deltaMs = this.app.ticker.deltaMS;

    // Update tween manager
    this.tweenManager.update();

    // Update layers
    this.characterLayer.update(deltaMs);
    this.effectsLayer.update(deltaMs);
    this.celebrationLayer.update(deltaMs);
    this.lightingLayer.update(deltaMs);

    // Apply scene state filter
    this.applyColorFilter();
  }

  /** Apply current color filter values */
  private applyColorFilter(): void {
    this.colorFilter.reset();
    this.colorFilter.brightness(this.stateTransition.brightness, false);
    this.colorFilter.saturate(this.stateTransition.saturate - 1, true); // saturate expects delta from 1
    if (this.stateTransition.sepia > 0) {
      this.colorFilter.sepia(true);
      // Blend sepia by mixing with identity
      const m = this.colorFilter.matrix;
      const sepia = this.stateTransition.sepia;
      for (let i = 0; i < 20; i++) {
        const identity = [1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0];
        m[i] = identity[i] + (m[i] - identity[i]) * sepia;
      }
    }
  }

  /** Set which cats are visible and active */
  setActivities(activities: CatActivity[]): void {
    const unique = [...new Set(activities)];
    this.characterLayer.setActivities(unique);
    this.effectsLayer.setActivities(unique);
  }

  /** Set the active state (cats walk, scene brightens) */
  setActiveState(isActive: boolean): void {
    const newState: SceneState = isActive ? 'active' : 'idle';
    if (newState === this.currentState) return;
    this.currentState = newState;
    this.applySceneState(newState);
    this.characterLayer.setWalking(isActive);
    this.uiLayer.visible = isActive;
  }

  /** Trigger celebration effects */
  triggerCelebration(): void {
    this.celebrationLayer.trigger();
    // Temporarily apply celebrating filter
    const prevState = this.currentState;
    this.applySceneState('celebrating');
    // Return to previous state after celebration
    setTimeout(() => {
      if (this.currentState !== 'celebrating') return;
      this.applySceneState(prevState);
    }, CELEBRATION_DURATION_MS);
    this.currentState = 'celebrating';
  }

  /** Transition to a scene state */
  private applySceneState(state: SceneState): void {
    const target = SCENE_STATES[state === 'celebrating' ? 'celebrating' : state];
    const from = { ...this.stateTransition };

    // Tween to target state
    this.tweenManager.create(this.stateTransition)
      .to(
        {
          brightness: target.brightness,
          saturate: target.saturate,
          sepia: target.sepia,
        },
        STATE_TRANSITION_MS,
      )
      .start();
  }

  /** Full cleanup */
  destroy(): void {
    this.app.ticker.remove(this.onTick, this);
    this.tweenManager.destroy();
    this.backgroundLayer.destroy();
    this.characterLayer.destroy();
    this.effectsLayer.destroy();
    this.celebrationLayer.destroy();
    this.lightingLayer.destroy();
    this.uiLayer.destroy();
    clearTextureCache();
  }
}
