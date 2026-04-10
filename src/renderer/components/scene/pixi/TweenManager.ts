import * as TWEEN from '@tweenjs/tween.js';

/**
 * Manages tween lifecycle integrated with PixiJS ticker.
 * Call update() each frame from the ticker callback.
 */
export class TweenManager {
  private group: TWEEN.Group;

  constructor() {
    this.group = new TWEEN.Group();
  }

  /** Call from PixiJS ticker each frame */
  update(): void {
    this.group.update();
  }

  /** Create a tween managed by this group */
  create<T extends Record<string, number>>(target: T): TWEEN.Tween<T> {
    return new TWEEN.Tween(target, this.group);
  }

  /** Remove all tweens */
  removeAll(): void {
    this.group.removeAll();
  }

  /** Convenience: oscillate a property between min and max */
  oscillate<T extends Record<string, number>>(
    target: T,
    prop: keyof T & string,
    min: number,
    max: number,
    periodMs: number,
    delay = 0,
  ): TWEEN.Tween<T> {
    (target as Record<string, number>)[prop] = min;
    return this.create(target)
      .to({ [prop]: max } as Partial<T>, periodMs / 2)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .delay(delay)
      .start();
  }

  destroy(): void {
    this.group.removeAll();
  }
}
