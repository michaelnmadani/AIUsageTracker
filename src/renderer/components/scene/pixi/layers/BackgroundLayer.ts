import { Container, Graphics, Sprite } from 'pixi.js';
import { SCENE_WIDTH, SCENE_HEIGHT, ROOM_COLORS, FIREPLACE, WALL_FLOOR_Y } from '../config/SceneConfig';
import { rasterizeSvg } from '../SvgRasterizer';
import { buildRoomSvg, ROOM_BLEED } from './RoomSvg';

/**
 * Room background: hand-crafted SVG art rasterized once to a texture
 * (same pipeline as the cats), plus a small animated fireplace flame
 * drawn with Graphics on top.
 */
export class BackgroundLayer extends Container {
  private placeholder: Graphics;
  private flames: Graphics;
  private flameTime = Math.random() * 10000;
  private disposed = false;

  constructor() {
    super();

    // Flat wall/floor fill shown for the few frames before the texture is ready
    this.placeholder = new Graphics();
    this.placeholder.rect(-ROOM_BLEED - 8, -ROOM_BLEED - 8, SCENE_WIDTH + ROOM_BLEED * 2 + 16, WALL_FLOOR_Y + ROOM_BLEED + 8);
    this.placeholder.fill(ROOM_COLORS.wall);
    this.placeholder.rect(-ROOM_BLEED - 8, WALL_FLOOR_Y, SCENE_WIDTH + ROOM_BLEED * 2 + 16, SCENE_HEIGHT - WALL_FLOOR_Y + ROOM_BLEED + 8);
    this.placeholder.fill(ROOM_COLORS.floor);
    this.addChild(this.placeholder);

    this.flames = new Graphics();
    this.addChild(this.flames);

    void this.loadRoomTexture();
  }

  private async loadRoomTexture(): Promise<void> {
    const artSize = SCENE_WIDTH + ROOM_BLEED * 2;
    const texture = await rasterizeSvg(buildRoomSvg(), artSize, artSize, 2.5, 'room_bg');
    if (!texture || this.disposed) return;

    const sprite = new Sprite(texture);
    sprite.position.set(-ROOM_BLEED, -ROOM_BLEED);
    sprite.width = artSize;
    sprite.height = artSize;
    this.addChildAt(sprite, 0);

    this.placeholder.visible = false;
  }

  /** Animated fireplace flames — the only dynamic piece of the background */
  update(deltaMs: number): void {
    this.flameTime += deltaMs;
    const t = this.flameTime;
    const g = this.flames;
    g.clear();

    const baseY = FIREPLACE.y + 10; // flame roots sit on the log bed
    const tongues = [
      { dx: -11, w: 10, h: 20, phase: 0.0 },
      { dx: 0.5, w: 14, h: 29, phase: 2.1 },
      { dx: 11, w: 9, h: 17, phase: 4.2 },
    ];

    // Soft glow pad behind the tongues
    g.ellipse(FIREPLACE.x, baseY - 6, 24, 14);
    g.fill({ color: 0xff9838, alpha: 0.28 + 0.06 * Math.sin(t / 220) });

    for (const f of tongues) {
      const flicker = 1 + 0.16 * Math.sin(t / 130 + f.phase) + 0.09 * Math.sin(t / 51 + f.phase * 3);
      const sway = 1.3 * Math.sin(t / 160 + f.phase * 2);
      const x = FIREPLACE.x + f.dx + sway;
      const h = f.h * flicker;
      const w = f.w * (1 + 0.06 * Math.sin(t / 90 + f.phase));

      this.drawTongue(g, x, baseY, w, h, 0xff7a26, 0.92);
      this.drawTongue(g, x + sway * 0.3, baseY, w * 0.62, h * 0.66, 0xffa63c, 0.95);
      this.drawTongue(g, x + sway * 0.5, baseY - 1, w * 0.34, h * 0.4, 0xffe08a, 1);
    }
  }

  private drawTongue(g: Graphics, x: number, y: number, w: number, h: number, color: number, alpha: number): void {
    g.moveTo(x - w / 2, y);
    g.quadraticCurveTo(x - w / 2 - w * 0.12, y - h * 0.5, x, y - h);
    g.quadraticCurveTo(x + w / 2 + w * 0.12, y - h * 0.5, x + w / 2, y);
    g.closePath();
    g.fill({ color, alpha });
  }

  destroy(): void {
    this.disposed = true;
    super.destroy({ children: true });
  }
}
