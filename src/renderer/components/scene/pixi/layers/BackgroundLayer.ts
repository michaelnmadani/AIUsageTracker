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
    const W = SCENE_WIDTH;
    const H = SCENE_HEIGHT;

    // Layer 1: Base fills (walls, floor, ceiling)
    const base = new Graphics();
    this.addChild(base);

    // Full-coverage base fill (prevents sub-pixel gaps at scaled edges)
    base.rect(-10, -10, W + 20, H + 20);
    base.fill(0xd4c4a8);

    // === BACK WALL (fills top ~60%) ===
    base.rect(0, 0, W, H * 0.6);
    base.fill(0xd4c4a8);
    // Wainscoting: lower panel darker
    base.rect(0, H * 0.4, W, H * 0.2);
    base.fill(0xc0b090);
    // Wainscoting divider rail
    base.rect(0, H * 0.39, W, 3);
    base.fill(0x8b7355);
    base.rect(0, H * 0.39, W, 1);
    base.fill({ color: 0xffffff, alpha: 0.08 });
    // Crown molding
    base.rect(0, 0, W, 4);
    base.fill(0x8b7355);
    base.rect(0, 0, W, 1);
    base.fill({ color: 0xffffff, alpha: 0.1 });
    base.rect(0, 4, W, 1);
    base.fill({ color: 0x000000, alpha: 0.05 });

    // Wallpaper subtle pattern (diamonds)
    const wallPattern = new Graphics();
    for (let wx = 10; wx < W; wx += 20) {
      for (let wy = 10; wy < H * 0.38; wy += 16) {
        wallPattern.star(wx, wy, 4, 1.5, 3);
        wallPattern.fill({ color: 0xb0a080, alpha: 0.08 });
      }
    }
    this.addChild(wallPattern);

    // Wainscoting vertical panels
    const wainscot = new Graphics();
    for (let px = 20; px < W; px += 30) {
      wainscot.rect(px, H * 0.41, 1, H * 0.18);
      wainscot.fill({ color: 0x9a8a70, alpha: 0.15 });
    }
    this.addChild(wainscot);

    // === CEILING BEAMS ===
    const beams = new Graphics();
    for (let bx = 80; bx < W - 50; bx += 120) {
      beams.rect(bx, 0, 8, 6);
      beams.fill(0x6b5340);
      beams.rect(bx, 0, 8, 1);
      beams.fill({ color: 0x8b7355, alpha: 0.4 });
      beams.rect(bx, 5, 8, 1);
      beams.fill({ color: 0x000000, alpha: 0.1 });
    }
    this.addChild(beams);

    // === FLOOR (wood planks, bottom 40%) ===
    const floorY = H * 0.6;
    const floorH = H - floorY;
    const floor = new Graphics();
    const plankColors = [0x8b7355, 0x927a5a, 0x846e50, 0x8f7858, 0x7d6a4a, 0x96805e];
    const plankWidth = W / 12;
    for (let i = 0; i < 12; i++) {
      const px = i * plankWidth;
      const pw = plankWidth;
      const color = plankColors[i % plankColors.length];

      // Plank body
      floor.rect(px, floorY, pw, floorH);
      floor.fill(color);

      // Gap between planks
      floor.rect(px + pw - 1, floorY, 1, floorH);
      floor.fill({ color: 0x3a2a18, alpha: 0.2 });

      // Wood grain lines
      for (let gy = floorY + 5; gy < H - 5; gy += 8 + Math.floor(i * 1.3) % 4) {
        floor.rect(px + 2, gy, pw - 4, 0.5);
        floor.fill({ color: 0x6a5a40, alpha: 0.08 });
      }

      // Plank highlight (top edge)
      floor.rect(px, floorY, pw - 1, 1);
      floor.fill({ color: 0xffffff, alpha: 0.04 });

      // Random knot
      if (i % 3 === 1) {
        floor.ellipse(px + pw / 2, floorY + 25 + i * 3, 2.5, 1.5);
        floor.fill({ color: 0x5a4a30, alpha: 0.12 });
      }
    }
    // Floor-wall join shadow
    floor.rect(0, floorY, W, 3);
    floor.fill({ color: 0x000000, alpha: 0.08 });
    this.addChild(floor);

    // === BASEBOARD ===
    const baseboard = new Graphics();
    baseboard.rect(-5, H - 8, W + 10, 8);
    baseboard.fill(0x6b5340);
    baseboard.rect(-5, H - 8, W + 10, 1);
    baseboard.fill({ color: 0x8b7355, alpha: 0.3 });
    baseboard.rect(-5, H - 1, W + 10, 1);
    baseboard.fill({ color: 0x000000, alpha: 0.06 });
    // Extend floor color below baseboard for overflow
    baseboard.rect(-5, H, W + 10, 10);
    baseboard.fill(0x6b5340);
    this.addChild(baseboard);

    // === DECORATIVE RUG ===
    const rugCY = H * 0.77;
    const rug = new Graphics();
    // Outer ring
    rug.ellipse(W / 2, rugCY, W * 0.22, 22);
    rug.fill({ color: 0x8b3030, alpha: 0.9 });
    // Middle ring
    rug.ellipse(W / 2, rugCY, W * 0.18, 18);
    rug.fill({ color: 0xa04040, alpha: 0.85 });
    // Pattern border
    for (let angle = 0; angle < 360; angle += 15) {
      const rad = (angle * Math.PI) / 180;
      const dx = Math.cos(rad) * W * 0.19;
      const dy = Math.sin(rad) * 20;
      rug.circle(W / 2 + dx, rugCY + dy, 1.5);
      rug.fill({ color: 0xd4a040, alpha: 0.8 });
    }
    // Inner area
    rug.ellipse(W / 2, rugCY, W * 0.13, 13);
    rug.fill({ color: 0xc06050, alpha: 0.8 });
    // Center medallion
    rug.ellipse(W / 2, rugCY, 15, 5);
    rug.fill({ color: 0xd4a040, alpha: 0.85 });
    // Rug fringe edges
    for (let fx = W * 0.28; fx < W * 0.72; fx += 5) {
      rug.rect(fx, rugCY + 21, 1, 2);
      rug.fill({ color: 0xa04040, alpha: 0.7 });
    }
    this.addChild(rug);

    // === WINDOW (left side) ===
    const winX = W * 0.12;
    const winY = H * 0.06;
    const win = new Graphics();
    // Window frame outer
    win.roundRect(winX, winY, 56, 68, 2);
    win.fill(0x6b5340);
    // Glass panes (sky gradient simulated with layers)
    win.rect(winX + 3, winY + 3, 24, 30);
    win.fill(0x88bbdd);
    win.rect(winX + 3, winY + 3, 24, 12);
    win.fill({ color: 0xaaddee, alpha: 0.4 });
    win.rect(winX + 29, winY + 3, 24, 30);
    win.fill(0x88bbdd);
    win.rect(winX + 29, winY + 3, 24, 12);
    win.fill({ color: 0xaaddee, alpha: 0.4 });
    win.rect(winX + 3, winY + 35, 24, 30);
    win.fill(0x7ab0cc);
    win.rect(winX + 29, winY + 35, 24, 30);
    win.fill(0x7ab0cc);
    // Cross dividers
    win.rect(winX + 25, winY + 3, 4, 62);
    win.fill(0x6b5340);
    win.rect(winX + 3, winY + 32, 50, 4);
    win.fill(0x6b5340);
    // Divider highlights
    win.rect(winX + 25, winY + 3, 1, 62);
    win.fill({ color: 0xffffff, alpha: 0.08 });
    win.rect(winX + 3, winY + 32, 50, 1);
    win.fill({ color: 0xffffff, alpha: 0.08 });
    // Window sill
    win.rect(winX - 3, winY + 67, 62, 5);
    win.fill(0x7a6348);
    win.rect(winX - 3, winY + 67, 62, 1);
    win.fill({ color: 0xffffff, alpha: 0.1 });
    // Small potted plant on sill
    win.roundRect(winX + 21, winY + 60, 10, 8, 1);
    win.fill(0xa06040);
    win.ellipse(winX + 26, winY + 57, 6, 5);
    win.fill(0x5a9a3a);
    win.ellipse(winX + 23, winY + 59, 4, 3);
    win.fill(0x6aaa4a);
    this.addChild(win);

    // Curtains
    const curtains = new Graphics();
    // Left curtain
    curtains.rect(winX - 15, winY - 3, 16, 75);
    curtains.fill({ color: 0x9a5050, alpha: 0.6 });
    curtains.rect(winX - 13, winY - 3, 3, 75);
    curtains.fill({ color: 0x7a3838, alpha: 0.15 });
    curtains.rect(winX - 7, winY - 3, 2, 75);
    curtains.fill({ color: 0xba6868, alpha: 0.08 });
    // Right curtain
    curtains.rect(winX + 55, winY - 3, 16, 75);
    curtains.fill({ color: 0x9a5050, alpha: 0.6 });
    curtains.rect(winX + 63, winY - 3, 3, 75);
    curtains.fill({ color: 0x7a3838, alpha: 0.15 });
    curtains.rect(winX + 59, winY - 3, 2, 75);
    curtains.fill({ color: 0xba6868, alpha: 0.08 });
    // Curtain rod
    curtains.rect(winX - 17, winY - 5, 92, 3);
    curtains.fill(0x6b5340);
    curtains.circle(winX - 17, winY - 4, 3);
    curtains.fill(0x8b7355);
    curtains.circle(winX + 75, winY - 4, 3);
    curtains.fill(0x8b7355);
    this.addChild(curtains);

    // Window light on floor
    const winLight = new Graphics();
    winLight.poly([winX + 10, floorY, winX + 45, floorY, winX + 75, H - 10, winX + 25, H - 10]);
    winLight.fill({ color: 0xfff8d0, alpha: 0.04 });
    winLight.poly([winX + 17, floorY, winX + 40, floorY, winX + 60, H * 0.82, winX + 30, H * 0.82]);
    winLight.fill({ color: 0xfff8d0, alpha: 0.03 });
    this.addChild(winLight);

    // === FIREPLACE (center) ===
    const fpX = W * 0.43;
    const fpY = H * 0.08;
    const fp = new Graphics();
    // Stone surround — individual stones
    const stoneColors = [0x8a8078, 0x7a7068, 0x9a9088, 0x6a6058, 0x8a7a70];
    for (let sy = 0; sy < 5; sy++) {
      for (let sx = 0; sx < 3; sx++) {
        const offset = sy % 2 === 0 ? 0 : 8;
        const sc = stoneColors[(sy * 3 + sx) % stoneColors.length];
        fp.roundRect(fpX + sx * 18 + offset, fpY + 20 + sy * 15, 16, 13, 2);
        fp.fill(sc);
        fp.roundRect(fpX + sx * 18 + offset, fpY + 20 + sy * 15, 16, 13, 2);
        fp.stroke({ color: 0x5a5048, width: 0.5 });
      }
    }
    // Fire opening
    fp.roundRect(fpX + 8, fpY + 40, 40, 45, 3);
    fp.fill(0x2a1a0a);
    // Fire flames
    fp.poly([fpX + 18, fpY + 83, fpX + 23, fpY + 60, fpX + 28, fpY + 70, fpX + 33, fpY + 55, fpX + 38, fpY + 70, fpX + 43, fpY + 83]);
    fp.fill({ color: 0xff4400, alpha: 0.7 });
    fp.poly([fpX + 20, fpY + 83, fpX + 25, fpY + 65, fpX + 28, fpY + 71, fpX + 31, fpY + 63, fpX + 36, fpY + 71, fpX + 40, fpY + 83]);
    fp.fill({ color: 0xff8800, alpha: 0.6 });
    fp.poly([fpX + 24, fpY + 83, fpX + 27, fpY + 70, fpX + 29, fpY + 73, fpX + 31, fpY + 67, fpX + 34, fpY + 83]);
    fp.fill({ color: 0xffcc00, alpha: 0.5 });
    // Embers
    fp.circle(fpX + 23, fpY + 81, 1);
    fp.fill({ color: 0xff6600, alpha: 0.4 });
    fp.circle(fpX + 33, fpY + 82, 1.5);
    fp.fill({ color: 0xff4400, alpha: 0.3 });
    // Mantle
    fp.rect(fpX - 7, fpY + 17, 70, 6);
    fp.fill(0x6b5340);
    fp.rect(fpX - 7, fpY + 17, 70, 1);
    fp.fill({ color: 0x8b7355, alpha: 0.4 });
    // Mantle decorations
    // Small clock
    fp.circle(fpX + 13, fpY + 13, 5);
    fp.fill(0xd4c4a0);
    fp.circle(fpX + 13, fpY + 13, 5);
    fp.stroke({ color: 0x8b7355, width: 0.8 });
    fp.circle(fpX + 13, fpY + 13, 0.8);
    fp.fill(0x4a3a2a);
    // Candle
    fp.rect(fpX + 38, fpY + 9, 3, 8);
    fp.fill(0xf0e8d0);
    fp.circle(fpX + 39.5, fpY + 8, 2);
    fp.fill({ color: 0xffaa00, alpha: 0.6 });
    fp.circle(fpX + 39.5, fpY + 7, 1);
    fp.fill({ color: 0xffee66, alpha: 0.4 });
    // Hearth base
    fp.rect(fpX - 2, fpY + 85, 60, 5);
    fp.fill(0x7a7068);
    fp.rect(fpX - 2, fpY + 85, 60, 1);
    fp.fill({ color: 0xffffff, alpha: 0.05 });
    // Fire warm glow
    fp.ellipse(fpX + 28, fpY + 80, 35, 20);
    fp.fill({ color: 0xff6622, alpha: 0.06 });
    fp.ellipse(fpX + 28, fpY + 80, 20, 12);
    fp.fill({ color: 0xff8844, alpha: 0.04 });
    this.addChild(fp);

    // === BOOKSHELF (right side) ===
    const shelfX = W * 0.72;
    const shelfY = H * 0.05;
    const shelf = new Graphics();
    // Frame
    shelf.rect(shelfX, shelfY, 65, 85);
    shelf.fill(0x5a4530);
    shelf.rect(shelfX, shelfY, 65, 85);
    shelf.stroke({ color: 0x4a3520, width: 1 });
    // Inner back
    shelf.rect(shelfX + 3, shelfY + 3, 59, 79);
    shelf.fill(0x4a3a28);

    // 4 shelves
    const shelfYs = [shelfY + 18, shelfY + 36, shelfY + 54, shelfY + 72];
    for (const sy of shelfYs) {
      shelf.rect(shelfX + 3, sy, 59, 3);
      shelf.fill(0x6b5340);
      shelf.rect(shelfX + 3, sy, 59, 1);
      shelf.fill({ color: 0x8b7355, alpha: 0.3 });
    }

    // Books on shelves
    const bColors = [0xcc4444, 0x44aa44, 0x4488cc, 0xccaa44, 0xaa44aa,
      0x44aaaa, 0xcc8844, 0x8844cc, 0xcc4488, 0x88cc44,
      0x4444cc, 0xaa8844, 0xcc6666, 0x6688aa, 0x88aa66];
    let bi = 0;
    for (let si = 0; si < 4; si++) {
      const y = shelfYs[si];
      let bx = shelfX + 5;
      const count = 4 + (si % 2);
      for (let bk = 0; bk < count && bx < shelfX + 58; bk++) {
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
        shelf.circle(shelfX + 52, y - 6, 4);
        shelf.fill(0x6688aa);
        shelf.circle(shelfX + 52, y - 6, 4);
        shelf.stroke({ color: 0x4a6888, width: 0.5 });
      }
      if (si === 3) {
        // Small plant
        shelf.rect(shelfX + 50, y - 5, 5, 5);
        shelf.fill(0xa06040);
        shelf.circle(shelfX + 52, y - 8, 4);
        shelf.fill(0x5a9a3a);
      }
    }
    this.addChild(shelf);

    // === KITCHEN COUNTER (far left, for cooking cat) ===
    const kX = 2;
    const kY = H * 0.36;
    const kitchen = new Graphics();
    // Counter surface
    kitchen.rect(kX, kY, 55, 5);
    kitchen.fill(0x8b7355);
    kitchen.rect(kX, kY, 55, 1);
    kitchen.fill({ color: 0xa0896a, alpha: 0.4 });
    // Counter front
    kitchen.rect(kX, kY + 5, 55, 30);
    kitchen.fill(0x7a6348);
    // Cabinet doors
    kitchen.roundRect(kX + 3, kY + 8, 22, 24, 2);
    kitchen.stroke({ color: 0x5a4830, width: 0.8 });
    kitchen.roundRect(kX + 30, kY + 8, 22, 24, 2);
    kitchen.stroke({ color: 0x5a4830, width: 0.8 });
    // Knobs
    kitchen.circle(kX + 22, kY + 20, 1.2);
    kitchen.fill(0xc4a060);
    kitchen.circle(kX + 33, kY + 20, 1.2);
    kitchen.fill(0xc4a060);
    // Pot on counter
    kitchen.roundRect(kX + 16, kY - 7, 18, 8, 2);
    kitchen.fill(0x5a5a5a);
    kitchen.roundRect(kX + 16, kY - 7, 18, 8, 2);
    kitchen.stroke({ color: 0x3a3a3a, width: 0.8 });
    kitchen.ellipse(kX + 25, kY - 7, 10, 2);
    kitchen.fill(0x4a4a4a);
    // Hanging utensils
    kitchen.rect(kX + 8, H * 0.08, 1, 12);
    kitchen.fill(0x8a8a8a);
    kitchen.ellipse(kX + 8, H * 0.13, 3, 4);
    kitchen.fill({ color: 0x8a8a8a, alpha: 0.7 });
    kitchen.rect(kX + 20, H * 0.06, 1, 10);
    kitchen.fill(0x8a8a8a);
    kitchen.rect(kX + 19, H * 0.1, 3, 6);
    kitchen.fill({ color: 0x8a8a8a, alpha: 0.7 });
    // Spice shelf
    kitchen.rect(kX + 2, H * 0.2, 40, 4);
    kitchen.fill(0x6b5340);
    const spiceColors = [0xcc4444, 0x44aa44, 0xccaa44, 0x8844aa, 0xaa6644];
    for (let si = 0; si < 5; si++) {
      kitchen.roundRect(kX + 4 + si * 7, H * 0.16, 5, 10, 1);
      kitchen.fill(spiceColors[si]);
      kitchen.roundRect(kX + 4 + si * 7, H * 0.16, 5, 10, 1);
      kitchen.stroke({ color: 0x000000, width: 0.3, alpha: 0.15 });
    }
    this.addChild(kitchen);

    // === WALL DECORATIONS ===
    const decor = new Graphics();
    // Picture frame 1 (left of fireplace)
    decor.rect(W * 0.32, H * 0.1, 22, 18);
    decor.fill(0x6b5340);
    decor.rect(W * 0.32 + 2, H * 0.1 + 2, 18, 14);
    decor.fill(0x88bbaa);
    // Tiny landscape painting
    decor.rect(W * 0.32 + 2, H * 0.1 + 10, 18, 6);
    decor.fill(0x5a9a3a);
    decor.circle(W * 0.32 + 10, H * 0.1 + 5, 2);
    decor.fill({ color: 0xffdd44, alpha: 0.5 });
    // Picture frame 2 (right of bookshelf)
    decor.rect(W * 0.6, H * 0.08, 18, 24);
    decor.fill(0x6b5340);
    decor.rect(W * 0.6 + 2, H * 0.08 + 2, 14, 20);
    decor.fill(0xc8a888);
    // Cat portrait silhouette
    decor.circle(W * 0.6 + 9, H * 0.08 + 10, 4);
    decor.fill({ color: 0x8a6a4a, alpha: 0.3 });
    decor.ellipse(W * 0.6 + 9, H * 0.08 + 16, 5, 4);
    decor.fill({ color: 0x8a6a4a, alpha: 0.3 });

    // Hanging lantern
    decor.rect(W * 0.66, H * 0.02, 1, 10);
    decor.fill(0x6b5340);
    decor.roundRect(W * 0.66 - 5, H * 0.06, 12, 14, 2);
    decor.fill({ color: 0xffaa44, alpha: 0.25 });
    decor.roundRect(W * 0.66 - 5, H * 0.06, 12, 14, 2);
    decor.stroke({ color: 0x6b5340, width: 0.8 });
    decor.rect(W * 0.66 - 3, H * 0.06 + 2, 8, 1);
    decor.fill({ color: 0x6b5340, alpha: 0.5 });
    decor.rect(W * 0.66 - 3, H * 0.06 + 10, 8, 1);
    decor.fill({ color: 0x6b5340, alpha: 0.5 });
    // Lantern glow
    decor.ellipse(W * 0.66 + 1, H * 0.06 + 7, 12, 10);
    decor.fill({ color: 0xffaa44, alpha: 0.03 });

    // Small table (center-left)
    decor.ellipse(W * 0.36, H * 0.7, 15, 6);
    decor.fill(0x7a6348);
    decor.ellipse(W * 0.36, H * 0.7, 15, 6);
    decor.stroke({ color: 0x5a4830, width: 0.8 });
    decor.rect(W * 0.36 - 3, H * 0.7 + 3, 2, 14);
    decor.fill(0x6b5340);
    decor.rect(W * 0.36 + 2, H * 0.7 + 3, 2, 14);
    decor.fill(0x6b5340);
    // Tea cup on table
    decor.roundRect(W * 0.36 - 5, H * 0.68, 6, 5, 1);
    decor.fill(0xe0d8c8);
    decor.roundRect(W * 0.36 - 5, H * 0.68, 6, 5, 1);
    decor.stroke({ color: 0xb0a898, width: 0.5 });

    // Floor cushion near fireplace
    decor.ellipse(W * 0.58, H * 0.72, 12, 5);
    decor.fill({ color: 0x8060a0, alpha: 0.4 });
    decor.ellipse(W * 0.58, H * 0.716, 10, 4);
    decor.fill({ color: 0x9070b0, alpha: 0.3 });
    this.addChild(decor);

    // === DOOR (right edge) ===
    const doorX = W - 28;
    const door = new Graphics();
    door.roundRect(doorX, H * 0.38, 28, H * 0.62, 2);
    door.fill(0x3a2a1a);
    door.roundRect(doorX, H * 0.38, 28, H * 0.62, 2);
    door.stroke({ color: 0x6b5340, width: 2 });
    // Door panel insets
    door.roundRect(doorX + 4, H * 0.4, 17, 30, 1);
    door.stroke({ color: 0x5a4530, width: 0.5 });
    door.roundRect(doorX + 4, H * 0.54, 17, 30, 1);
    door.stroke({ color: 0x5a4530, width: 0.5 });
    // Door knob
    door.circle(doorX + 19, H * 0.56, 2);
    door.fill(0xc4a060);
    door.circle(doorX + 19, H * 0.56, 2);
    door.stroke({ color: 0xa08040, width: 0.5 });
    // Dark hallway visible
    door.rect(doorX + 2, H * 0.42, 13, 26);
    door.fill({ color: 0x1a0a00, alpha: 0.4 });
    this.addChild(door);

    // === CORNER VINES ===
    const vines = new Graphics();
    // Top-left corner vine
    vines.rect(0, 3, 2, 20);
    vines.fill({ color: 0x4a8a2a, alpha: 0.4 });
    vines.ellipse(2, 9, 3, 2);
    vines.fill({ color: 0x5a9a3a, alpha: 0.3 });
    vines.ellipse(0, 15, 2.5, 2);
    vines.fill({ color: 0x6aaa4a, alpha: 0.25 });
    // Top-right corner vine
    vines.rect(W - 4, 3, 2, 15);
    vines.fill({ color: 0x4a8a2a, alpha: 0.35 });
    vines.ellipse(W - 4, 11, 3, 2);
    vines.fill({ color: 0x5a9a3a, alpha: 0.3 });
    this.addChild(vines);

    // === ATMOSPHERIC SHADOWS ===
    const atmo = new Graphics();
    // Corner shadows
    atmo.rect(0, 0, 25, H);
    atmo.fill({ color: 0x000000, alpha: 0.04 });
    atmo.rect(W - 25, 0, 25, H);
    atmo.fill({ color: 0x000000, alpha: 0.04 });
    // Floor edge shadow
    atmo.rect(0, H - 15, W, 15);
    atmo.fill({ color: 0x000000, alpha: 0.03 });
    // Warm ambient center pool
    atmo.ellipse(W / 2, H * 0.72, W * 0.25, 35);
    atmo.fill({ color: 0xffddaa, alpha: 0.02 });
    this.addChild(atmo);
  }
}
