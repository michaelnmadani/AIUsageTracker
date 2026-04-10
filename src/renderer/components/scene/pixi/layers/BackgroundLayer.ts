import { Container, Graphics } from 'pixi.js';
import { SCENE_WIDTH, SCENE_HEIGHT } from '../config/SceneConfig';

/**
 * Richly detailed isometric-style room background.
 * Simulates painted game art using dense PixiJS Graphics layers.
 */
export class BackgroundLayer extends Container {
  constructor() {
    super();
    this.buildRoom();
  }

  private buildRoom(): void {
    // Layer 1: Base fills (walls, floor, ceiling)
    const base = new Graphics();
    this.addChild(base);

    // Outer dark background
    base.rect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
    base.fill(0x1a2a1a);

    // Grass strip at bottom
    base.rect(0, 228, SCENE_WIDTH, 22);
    base.fill(0x3a5e2a);
    base.rect(0, 228, SCENE_WIDTH, 4);
    base.fill({ color: 0x4a7e3a, alpha: 0.5 });

    // === BACK WALL ===
    base.rect(30, 25, 340, 125);
    base.fill(0xd4c4a8);
    // Wainscoting: lower panel darker
    base.rect(30, 100, 340, 50);
    base.fill(0xc0b090);
    // Wainscoting divider rail
    base.rect(30, 98, 340, 3);
    base.fill(0x8b7355);
    base.rect(30, 98, 340, 1);
    base.fill({ color: 0xffffff, alpha: 0.08 });
    // Crown molding
    base.rect(30, 25, 340, 4);
    base.fill(0x8b7355);
    base.rect(30, 25, 340, 1);
    base.fill({ color: 0xffffff, alpha: 0.1 });
    base.rect(30, 29, 340, 1);
    base.fill({ color: 0x000000, alpha: 0.05 });

    // Wallpaper subtle pattern (diamonds)
    const wallPattern = new Graphics();
    for (let wx = 40; wx < 365; wx += 20) {
      for (let wy = 35; wy < 95; wy += 16) {
        wallPattern.star(wx, wy, 4, 1.5, 3);
        wallPattern.fill({ color: 0xb0a080, alpha: 0.08 });
      }
    }
    this.addChild(wallPattern);

    // Wainscoting vertical panels
    const wainscot = new Graphics();
    for (let px = 50; px < 370; px += 30) {
      wainscot.rect(px, 102, 1, 46);
      wainscot.fill({ color: 0x9a8a70, alpha: 0.15 });
    }
    this.addChild(wainscot);

    // === CEILING BEAMS ===
    const beams = new Graphics();
    for (let bx = 100; bx < 350; bx += 120) {
      beams.rect(bx, 25, 8, 6);
      beams.fill(0x6b5340);
      beams.rect(bx, 25, 8, 1);
      beams.fill({ color: 0x8b7355, alpha: 0.4 });
      beams.rect(bx, 30, 8, 1);
      beams.fill({ color: 0x000000, alpha: 0.1 });
    }
    this.addChild(beams);

    // === FLOOR (wood planks) ===
    const floor = new Graphics();
    const plankColors = [0x8b7355, 0x927a5a, 0x846e50, 0x8f7858, 0x7d6a4a, 0x96805e];
    const plankWidth = 34;
    for (let i = 0; i < 10; i++) {
      const px = 30 + i * plankWidth;
      const w = Math.min(plankWidth, 370 - px);
      const color = plankColors[i % plankColors.length];

      // Plank body
      floor.rect(px, 150, w, 75);
      floor.fill(color);

      // Gap between planks
      floor.rect(px + w - 1, 150, 1, 75);
      floor.fill({ color: 0x3a2a18, alpha: 0.2 });

      // Wood grain lines
      for (let gy = 155; gy < 225; gy += 8 + Math.floor(i * 1.3) % 4) {
        floor.rect(px + 2, gy, w - 4, 0.5);
        floor.fill({ color: 0x6a5a40, alpha: 0.08 });
      }

      // Plank highlight (top edge)
      floor.rect(px, 150, w - 1, 1);
      floor.fill({ color: 0xffffff, alpha: 0.04 });

      // Random knot
      if (i % 3 === 1) {
        floor.ellipse(px + w / 2, 175 + i * 3, 2.5, 1.5);
        floor.fill({ color: 0x5a4a30, alpha: 0.12 });
      }
    }
    // Floor-wall join shadow
    floor.rect(30, 150, 340, 3);
    floor.fill({ color: 0x000000, alpha: 0.08 });
    this.addChild(floor);

    // === BASEBOARD ===
    const baseboard = new Graphics();
    baseboard.rect(30, 220, 340, 5);
    baseboard.fill(0x6b5340);
    baseboard.rect(30, 220, 340, 1);
    baseboard.fill({ color: 0x8b7355, alpha: 0.3 });
    baseboard.rect(30, 225, 340, 1);
    baseboard.fill({ color: 0x000000, alpha: 0.06 });
    this.addChild(baseboard);

    // === DECORATIVE RUG ===
    const rug = new Graphics();
    // Outer ring
    rug.ellipse(200, 192, 85, 22);
    rug.fill({ color: 0x8b3030, alpha: 0.4 });
    // Middle ring
    rug.ellipse(200, 192, 70, 18);
    rug.fill({ color: 0xa04040, alpha: 0.35 });
    // Pattern border
    for (let angle = 0; angle < 360; angle += 15) {
      const rad = (angle * Math.PI) / 180;
      const dx = Math.cos(rad) * 77;
      const dy = Math.sin(rad) * 20;
      rug.circle(200 + dx, 192 + dy, 1.5);
      rug.fill({ color: 0xd4a040, alpha: 0.3 });
    }
    // Inner area
    rug.ellipse(200, 192, 50, 13);
    rug.fill({ color: 0xc06050, alpha: 0.25 });
    // Center medallion
    rug.ellipse(200, 192, 15, 5);
    rug.fill({ color: 0xd4a040, alpha: 0.2 });
    // Rug fringe edges
    for (let fx = 120; fx < 280; fx += 5) {
      rug.rect(fx, 213, 1, 2);
      rug.fill({ color: 0xa04040, alpha: 0.15 });
    }
    this.addChild(rug);

    // === WINDOW (left side) ===
    const win = new Graphics();
    // Window frame outer
    win.roundRect(55, 35, 56, 68, 2);
    win.fill(0x6b5340);
    // Glass panes (sky gradient simulated with layers)
    win.rect(58, 38, 24, 30);
    win.fill(0x88bbdd);
    win.rect(58, 38, 24, 12);
    win.fill({ color: 0xaaddee, alpha: 0.4 });
    win.rect(84, 38, 24, 30);
    win.fill(0x88bbdd);
    win.rect(84, 38, 24, 12);
    win.fill({ color: 0xaaddee, alpha: 0.4 });
    win.rect(58, 70, 24, 30);
    win.fill(0x7ab0cc);
    win.rect(84, 70, 24, 30);
    win.fill(0x7ab0cc);
    // Cross dividers
    win.rect(80, 38, 4, 62);
    win.fill(0x6b5340);
    win.rect(58, 67, 50, 4);
    win.fill(0x6b5340);
    // Divider highlights
    win.rect(80, 38, 1, 62);
    win.fill({ color: 0xffffff, alpha: 0.08 });
    win.rect(58, 67, 50, 1);
    win.fill({ color: 0xffffff, alpha: 0.08 });
    // Window sill
    win.rect(52, 102, 62, 5);
    win.fill(0x7a6348);
    win.rect(52, 102, 62, 1);
    win.fill({ color: 0xffffff, alpha: 0.1 });
    // Small potted plant on sill
    win.roundRect(76, 95, 10, 8, 1);
    win.fill(0xa06040);
    win.ellipse(81, 92, 6, 5);
    win.fill(0x5a9a3a);
    win.ellipse(78, 94, 4, 3);
    win.fill(0x6aaa4a);
    this.addChild(win);

    // Curtains
    const curtains = new Graphics();
    // Left curtain
    curtains.rect(40, 32, 16, 75);
    curtains.fill({ color: 0x9a5050, alpha: 0.6 });
    curtains.rect(42, 32, 3, 75);
    curtains.fill({ color: 0x7a3838, alpha: 0.15 });
    curtains.rect(48, 32, 2, 75);
    curtains.fill({ color: 0xba6868, alpha: 0.08 });
    // Right curtain
    curtains.rect(110, 32, 16, 75);
    curtains.fill({ color: 0x9a5050, alpha: 0.6 });
    curtains.rect(118, 32, 3, 75);
    curtains.fill({ color: 0x7a3838, alpha: 0.15 });
    curtains.rect(114, 32, 2, 75);
    curtains.fill({ color: 0xba6868, alpha: 0.08 });
    // Curtain rod
    curtains.rect(38, 30, 92, 3);
    curtains.fill(0x6b5340);
    curtains.circle(38, 31, 3);
    curtains.fill(0x8b7355);
    curtains.circle(130, 31, 3);
    curtains.fill(0x8b7355);
    this.addChild(curtains);

    // Window light on floor
    const winLight = new Graphics();
    winLight.poly([65, 150, 100, 150, 130, 220, 80, 220]);
    winLight.fill({ color: 0xfff8d0, alpha: 0.04 });
    winLight.poly([72, 150, 95, 150, 115, 200, 85, 200]);
    winLight.fill({ color: 0xfff8d0, alpha: 0.03 });
    this.addChild(winLight);

    // === FIREPLACE (center-right) ===
    const fp = new Graphics();
    // Stone surround — individual stones
    const stoneColors = [0x8a8078, 0x7a7068, 0x9a9088, 0x6a6058, 0x8a7a70];
    for (let sy = 0; sy < 5; sy++) {
      for (let sx = 0; sx < 3; sx++) {
        const offset = sy % 2 === 0 ? 0 : 8;
        const sc = stoneColors[(sy * 3 + sx) % stoneColors.length];
        fp.roundRect(172 + sx * 18 + offset, 45 + sy * 15, 16, 13, 2);
        fp.fill(sc);
        fp.roundRect(172 + sx * 18 + offset, 45 + sy * 15, 16, 13, 2);
        fp.stroke({ color: 0x5a5048, width: 0.5 });
      }
    }
    // Fire opening
    fp.roundRect(180, 65, 40, 45, 3);
    fp.fill(0x2a1a0a);
    // Fire flames
    fp.poly([190, 108, 195, 85, 200, 95, 205, 80, 210, 95, 215, 108]);
    fp.fill({ color: 0xff4400, alpha: 0.7 });
    fp.poly([192, 108, 197, 90, 200, 96, 203, 88, 208, 96, 212, 108]);
    fp.fill({ color: 0xff8800, alpha: 0.6 });
    fp.poly([196, 108, 199, 95, 201, 98, 203, 92, 206, 108]);
    fp.fill({ color: 0xffcc00, alpha: 0.5 });
    // Embers
    fp.circle(195, 106, 1);
    fp.fill({ color: 0xff6600, alpha: 0.4 });
    fp.circle(205, 107, 1.5);
    fp.fill({ color: 0xff4400, alpha: 0.3 });
    // Mantle
    fp.rect(165, 42, 70, 6);
    fp.fill(0x6b5340);
    fp.rect(165, 42, 70, 1);
    fp.fill({ color: 0x8b7355, alpha: 0.4 });
    // Mantle decorations
    // Small clock
    fp.circle(185, 38, 5);
    fp.fill(0xd4c4a0);
    fp.circle(185, 38, 5);
    fp.stroke({ color: 0x8b7355, width: 0.8 });
    fp.circle(185, 38, 0.8);
    fp.fill(0x4a3a2a);
    // Candle
    fp.rect(210, 34, 3, 8);
    fp.fill(0xf0e8d0);
    fp.circle(211.5, 33, 2);
    fp.fill({ color: 0xffaa00, alpha: 0.6 });
    fp.circle(211.5, 32, 1);
    fp.fill({ color: 0xffee66, alpha: 0.4 });
    // Hearth base
    fp.rect(170, 110, 60, 5);
    fp.fill(0x7a7068);
    fp.rect(170, 110, 60, 1);
    fp.fill({ color: 0xffffff, alpha: 0.05 });
    // Fire warm glow
    fp.ellipse(200, 105, 35, 20);
    fp.fill({ color: 0xff6622, alpha: 0.06 });
    fp.ellipse(200, 105, 20, 12);
    fp.fill({ color: 0xff8844, alpha: 0.04 });
    this.addChild(fp);

    // === BOOKSHELF (right side) ===
    const shelf = new Graphics();
    // Frame
    shelf.rect(290, 32, 65, 85);
    shelf.fill(0x5a4530);
    shelf.rect(290, 32, 65, 85);
    shelf.stroke({ color: 0x4a3520, width: 1 });
    // Inner back
    shelf.rect(293, 35, 59, 79);
    shelf.fill(0x4a3a28);

    // 4 shelves
    const shelfYs = [50, 68, 86, 104];
    for (const sy of shelfYs) {
      shelf.rect(293, sy, 59, 3);
      shelf.fill(0x6b5340);
      shelf.rect(293, sy, 59, 1);
      shelf.fill({ color: 0x8b7355, alpha: 0.3 });
    }

    // Books on shelves
    const bColors = [0xcc4444, 0x44aa44, 0x4488cc, 0xccaa44, 0xaa44aa,
      0x44aaaa, 0xcc8844, 0x8844cc, 0xcc4488, 0x88cc44,
      0x4444cc, 0xaa8844, 0xcc6666, 0x6688aa, 0x88aa66];
    let bi = 0;
    for (let si = 0; si < 4; si++) {
      const y = shelfYs[si];
      let bx = 295;
      const count = 4 + (si % 2);
      for (let bk = 0; bk < count && bx < 348; bk++) {
        const bw = 5 + (bi % 4) * 2;
        const bh = 13 + (bi % 3);
        shelf.rect(bx, y - bh, bw, bh);
        shelf.fill(bColors[bi % bColors.length]);
        // Spine line
        shelf.rect(bx + bw / 2, y - bh + 2, 0.5, bh - 4);
        shelf.fill({ color: 0xffffff, alpha: 0.08 });
        bx += bw + 1;
        bi++;
      }
      // Small decoration between books
      if (si === 1) {
        // Tiny globe
        shelf.circle(342, y - 6, 4);
        shelf.fill(0x6688aa);
        shelf.circle(342, y - 6, 4);
        shelf.stroke({ color: 0x4a6888, width: 0.5 });
      }
      if (si === 3) {
        // Small plant
        shelf.rect(340, y - 5, 5, 5);
        shelf.fill(0xa06040);
        shelf.circle(342, y - 8, 4);
        shelf.fill(0x5a9a3a);
      }
    }
    this.addChild(shelf);

    // === KITCHEN COUNTER (far left, for cooking cat) ===
    const kitchen = new Graphics();
    // Counter surface
    kitchen.rect(32, 115, 55, 5);
    kitchen.fill(0x8b7355);
    kitchen.rect(32, 115, 55, 1);
    kitchen.fill({ color: 0xa0896a, alpha: 0.4 });
    // Counter front
    kitchen.rect(32, 120, 55, 30);
    kitchen.fill(0x7a6348);
    // Cabinet doors
    kitchen.roundRect(35, 123, 22, 24, 2);
    kitchen.stroke({ color: 0x5a4830, width: 0.8 });
    kitchen.roundRect(62, 123, 22, 24, 2);
    kitchen.stroke({ color: 0x5a4830, width: 0.8 });
    // Knobs
    kitchen.circle(54, 135, 1.2);
    kitchen.fill(0xc4a060);
    kitchen.circle(65, 135, 1.2);
    kitchen.fill(0xc4a060);
    // Pot on counter
    kitchen.roundRect(48, 108, 18, 8, 2);
    kitchen.fill(0x5a5a5a);
    kitchen.roundRect(48, 108, 18, 8, 2);
    kitchen.stroke({ color: 0x3a3a3a, width: 0.8 });
    kitchen.ellipse(57, 108, 10, 2);
    kitchen.fill(0x4a4a4a);
    // Hanging utensils
    kitchen.rect(40, 42, 1, 12);
    kitchen.fill(0x8a8a8a);
    kitchen.ellipse(40, 55, 3, 4);
    kitchen.fill({ color: 0x8a8a8a, alpha: 0.7 });
    kitchen.rect(52, 40, 1, 10);
    kitchen.fill(0x8a8a8a);
    kitchen.rect(51, 51, 3, 6);
    kitchen.fill({ color: 0x8a8a8a, alpha: 0.7 });
    // Spice shelf
    kitchen.rect(34, 60, 40, 4);
    kitchen.fill(0x6b5340);
    const spiceColors = [0xcc4444, 0x44aa44, 0xccaa44, 0x8844aa, 0xaa6644];
    for (let si = 0; si < 5; si++) {
      kitchen.roundRect(36 + si * 7, 50, 5, 10, 1);
      kitchen.fill(spiceColors[si]);
      kitchen.roundRect(36 + si * 7, 50, 5, 10, 1);
      kitchen.stroke({ color: 0x000000, width: 0.3, alpha: 0.15 });
    }
    this.addChild(kitchen);

    // === WALL DECORATIONS ===
    const decor = new Graphics();
    // Picture frame 1 (left of fireplace)
    decor.rect(138, 48, 22, 18);
    decor.fill(0x6b5340);
    decor.rect(140, 50, 18, 14);
    decor.fill(0x88bbaa);
    // Tiny landscape painting
    decor.rect(140, 58, 18, 6);
    decor.fill(0x5a9a3a);
    decor.circle(148, 53, 2);
    decor.fill({ color: 0xffdd44, alpha: 0.5 });
    // Picture frame 2 (right of fireplace)
    decor.rect(240, 42, 18, 24);
    decor.fill(0x6b5340);
    decor.rect(242, 44, 14, 20);
    decor.fill(0xc8a888);
    // Cat portrait silhouette
    decor.circle(249, 52, 4);
    decor.fill({ color: 0x8a6a4a, alpha: 0.3 });
    decor.ellipse(249, 58, 5, 4);
    decor.fill({ color: 0x8a6a4a, alpha: 0.3 });

    // Hanging lantern
    decor.rect(265, 30, 1, 10);
    decor.fill(0x6b5340);
    decor.roundRect(260, 40, 12, 14, 2);
    decor.fill({ color: 0xffaa44, alpha: 0.25 });
    decor.roundRect(260, 40, 12, 14, 2);
    decor.stroke({ color: 0x6b5340, width: 0.8 });
    decor.rect(262, 42, 8, 1);
    decor.fill({ color: 0x6b5340, alpha: 0.5 });
    decor.rect(262, 50, 8, 1);
    decor.fill({ color: 0x6b5340, alpha: 0.5 });
    // Lantern glow
    decor.ellipse(266, 47, 12, 10);
    decor.fill({ color: 0xffaa44, alpha: 0.03 });

    // Small table (center-left)
    decor.ellipse(145, 175, 15, 6);
    decor.fill(0x7a6348);
    decor.ellipse(145, 175, 15, 6);
    decor.stroke({ color: 0x5a4830, width: 0.8 });
    decor.rect(142, 178, 2, 14);
    decor.fill(0x6b5340);
    decor.rect(147, 178, 2, 14);
    decor.fill(0x6b5340);
    // Tea cup on table
    decor.roundRect(140, 170, 6, 5, 1);
    decor.fill(0xe0d8c8);
    decor.roundRect(140, 170, 6, 5, 1);
    decor.stroke({ color: 0xb0a898, width: 0.5 });

    // Floor cushion near fireplace
    decor.ellipse(230, 180, 12, 5);
    decor.fill({ color: 0x8060a0, alpha: 0.4 });
    decor.ellipse(230, 179, 10, 4);
    decor.fill({ color: 0x9070b0, alpha: 0.3 });
    this.addChild(decor);

    // === DOOR (right side) ===
    const door = new Graphics();
    door.roundRect(340, 105, 25, 115, 2);
    door.fill(0x3a2a1a);
    door.roundRect(340, 105, 25, 115, 2);
    door.stroke({ color: 0x6b5340, width: 2 });
    // Door panel insets
    door.roundRect(344, 110, 17, 30, 1);
    door.stroke({ color: 0x5a4530, width: 0.5 });
    door.roundRect(344, 145, 17, 30, 1);
    door.stroke({ color: 0x5a4530, width: 0.5 });
    // Door knob
    door.circle(359, 155, 2);
    door.fill(0xc4a060);
    door.circle(359, 155, 2);
    door.stroke({ color: 0xa08040, width: 0.5 });
    // Dark hallway visible
    door.rect(342, 112, 13, 26);
    door.fill({ color: 0x1a0a00, alpha: 0.4 });
    this.addChild(door);

    // === CORNER VINES ===
    const vines = new Graphics();
    // Top-left corner vine
    vines.rect(30, 28, 2, 20);
    vines.fill({ color: 0x4a8a2a, alpha: 0.4 });
    vines.ellipse(32, 34, 3, 2);
    vines.fill({ color: 0x5a9a3a, alpha: 0.3 });
    vines.ellipse(30, 40, 2.5, 2);
    vines.fill({ color: 0x6aaa4a, alpha: 0.25 });
    // Top-right corner vine
    vines.rect(368, 28, 2, 15);
    vines.fill({ color: 0x4a8a2a, alpha: 0.35 });
    vines.ellipse(368, 36, 3, 2);
    vines.fill({ color: 0x5a9a3a, alpha: 0.3 });
    this.addChild(vines);

    // === ATMOSPHERIC SHADOWS ===
    const atmo = new Graphics();
    // Corner shadows
    atmo.rect(30, 25, 25, 200);
    atmo.fill({ color: 0x000000, alpha: 0.04 });
    atmo.rect(345, 25, 25, 200);
    atmo.fill({ color: 0x000000, alpha: 0.04 });
    // Floor edge shadow
    atmo.rect(30, 215, 340, 10);
    atmo.fill({ color: 0x000000, alpha: 0.03 });
    // Warm ambient center pool
    atmo.ellipse(200, 180, 100, 35);
    atmo.fill({ color: 0xffddaa, alpha: 0.02 });
    this.addChild(atmo);
  }
}
