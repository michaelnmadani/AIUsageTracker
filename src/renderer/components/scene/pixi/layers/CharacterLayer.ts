import { Container, Texture } from 'pixi.js';
import type { CatActivity } from '../../../../types/usage';
import { CatSprite } from '../CatSprite';
import { TweenManager } from '../TweenManager';

/**
 * Manages all cat sprites within the scene.
 * Handles creation, removal, z-sorting, and updates.
 */
export class CharacterLayer extends Container {
  private cats = new Map<CatActivity, CatSprite>();
  private textures = new Map<CatActivity, Texture>();
  private tweenManager: TweenManager;

  constructor(tweenManager: TweenManager) {
    super();
    this.tweenManager = tweenManager;
  }

  /** Set available textures (from SvgRasterizer) */
  setTextures(textures: Map<CatActivity, Texture>): void {
    this.textures = textures;
  }

  /** Update which cats are visible based on active activities */
  setActivities(activities: CatActivity[]): void {
    const activeSet = new Set(activities);

    // Remove cats that are no longer active
    for (const [activity, cat] of this.cats) {
      if (!activeSet.has(activity)) {
        this.removeChild(cat);
        cat.destroy();
        this.cats.delete(activity);
      }
    }

    // Add new cats
    for (const activity of activities) {
      if (!this.cats.has(activity)) {
        const texture = this.textures.get(activity);
        if (texture) {
          const cat = new CatSprite(activity, texture, this.tweenManager);
          this.cats.set(activity, cat);
          this.addChild(cat);
        }
      }
    }
  }

  /** Start/stop walking for all cats */
  setWalking(walking: boolean): void {
    for (const cat of this.cats.values()) {
      if (walking) {
        cat.startWalking();
      } else {
        cat.stopWalking();
      }
    }
  }

  /** Update all cats and z-sort */
  update(deltaMs: number): void {
    for (const cat of this.cats.values()) {
      cat.update(deltaMs);
    }

    // Z-sort: cats with lower Y (further back) render first
    this.children.sort((a, b) => {
      const catA = a as CatSprite;
      const catB = b as CatSprite;
      if (catA.getSortY && catB.getSortY) {
        return catA.getSortY() - catB.getSortY();
      }
      return 0;
    });
  }

  destroy(): void {
    for (const cat of this.cats.values()) {
      cat.destroy();
    }
    this.cats.clear();
    super.destroy();
  }
}
