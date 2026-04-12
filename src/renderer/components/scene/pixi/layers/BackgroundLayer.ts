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
    // Wall color variation — subtle vertical stripes for aged plaster feel
    for (let wx = 0; wx < W; wx += 18) {
      const shade = wx % 36 === 0 ? 0xcebfa3 : 0xd8c9ae;
      base.rect(wx, 0, 9, H * 0.39);
      base.fill({ color: shade, alpha: 0.3 });
    }
    // Plaster texture — dense stipple overlay
    const plaster = new Graphics();
    for (let tx = 2; tx < W; tx += 6) {
      for (let ty = 6; ty < H * 0.39; ty += 5) {
        const jx = tx + ((ty * 7 + tx * 3) % 5) - 2;
        const jy = ty + ((tx * 11 + ty * 2) % 4) - 1;
        plaster.circle(jx, jy, 0.6);
        plaster.fill({ color: (tx + ty) % 10 < 5 ? 0xbfb098 : 0xe0d4bc, alpha: 0.06 });
      }
    }
    this.addChild(plaster);

    // Wainscoting: lower panel darker with wood tone
    base.rect(0, H * 0.4, W, H * 0.2);
    base.fill(0xb8a888);
    // Wainscoting wood grain
    for (let wy = H * 0.41; wy < H * 0.59; wy += 3) {
      base.rect(0, wy, W, 0.5);
      base.fill({ color: 0x9a8a68, alpha: 0.1 });
    }
    // Wainscoting divider rail — multi-layer
    base.rect(0, H * 0.39 - 1, W, 5);
    base.fill(0x7a6345);
    base.rect(0, H * 0.39 - 1, W, 1);
    base.fill({ color: 0x9a8365, alpha: 0.6 });
    base.rect(0, H * 0.39, W, 1);
    base.fill({ color: 0xffffff, alpha: 0.12 });
    base.rect(0, H * 0.39 + 3, W, 1);
    base.fill({ color: 0x000000, alpha: 0.08 });

    // Crown molding — multi-profile with depth
    base.rect(0, 0, W, 7);
    base.fill(0x7a6345);
    base.rect(0, 0, W, 2);
    base.fill(0x8b7355);
    base.rect(0, 0, W, 1);
    base.fill({ color: 0xffffff, alpha: 0.15 });
    base.rect(0, 2, W, 1);
    base.fill({ color: 0x6a5335, alpha: 0.8 });
    base.rect(0, 3, W, 1);
    base.fill({ color: 0x8b7355, alpha: 0.6 });
    base.rect(0, 5, W, 1);
    base.fill({ color: 0xffffff, alpha: 0.06 });
    base.rect(0, 7, W, 1);
    base.fill({ color: 0x000000, alpha: 0.06 });

    // Wallpaper pattern — denser diamond + floral motif
    const wallPattern = new Graphics();
    // Primary pattern: diamond grid
    for (let wx = 8; wx < W; wx += 14) {
      for (let wy = 10; wy < H * 0.38; wy += 12) {
        wallPattern.star(wx, wy, 4, 1.8, 3);
        wallPattern.fill({ color: 0xb8a878, alpha: 0.1 });
      }
    }
    // Secondary pattern: small dots between diamonds
    for (let wx = 15; wx < W; wx += 14) {
      for (let wy = 16; wy < H * 0.38; wy += 12) {
        wallPattern.circle(wx, wy, 0.8);
        wallPattern.fill({ color: 0xa89868, alpha: 0.12 });
      }
    }
    // Tertiary: faint vertical stripes
    for (let vx = 0; vx < W; vx += 28) {
      wallPattern.rect(vx, 8, 0.5, H * 0.31);
      wallPattern.fill({ color: 0xc0b090, alpha: 0.08 });
    }
    this.addChild(wallPattern);

    // Wall shadow gradient — darker near ceiling and floor line
    const wallShade = new Graphics();
    wallShade.rect(0, 8, W, 12);
    wallShade.fill({ color: 0x000000, alpha: 0.03 });
    wallShade.rect(0, H * 0.34, W, H * 0.05);
    wallShade.fill({ color: 0x000000, alpha: 0.02 });
    this.addChild(wallShade);

    // Wainscoting vertical panels — more visible with recessed shadow
    const wainscot = new Graphics();
    for (let px = 18; px < W; px += 22) {
      // Panel recess
      wainscot.roundRect(px, H * 0.42, 16, H * 0.15, 1);
      wainscot.fill({ color: 0xa89878, alpha: 0.2 });
      // Left edge highlight
      wainscot.rect(px, H * 0.42, 0.5, H * 0.15);
      wainscot.fill({ color: 0xffffff, alpha: 0.06 });
      // Right edge shadow
      wainscot.rect(px + 15.5, H * 0.42, 0.5, H * 0.15);
      wainscot.fill({ color: 0x000000, alpha: 0.05 });
    }
    this.addChild(wainscot);

    // === CEILING BEAMS ===
    const beams = new Graphics();
    const beamPositions = [50, 150, 260, 350];
    for (const bx of beamPositions) {
      // Main beam body
      beams.rect(bx, 0, 10, 8);
      beams.fill(0x5a4430);
      // Wood grain on beam
      beams.rect(bx + 2, 1, 6, 0.5);
      beams.fill({ color: 0x6b5340, alpha: 0.5 });
      beams.rect(bx + 1, 3, 8, 0.5);
      beams.fill({ color: 0x4a3420, alpha: 0.4 });
      beams.rect(bx + 3, 5, 5, 0.5);
      beams.fill({ color: 0x6b5340, alpha: 0.3 });
      // Top highlight
      beams.rect(bx, 0, 10, 1);
      beams.fill({ color: 0x8b7355, alpha: 0.5 });
      // Bottom shadow
      beams.rect(bx, 7, 10, 1);
      beams.fill({ color: 0x000000, alpha: 0.15 });
      // Cast shadow on wall below beam
      beams.rect(bx - 1, 8, 12, 3);
      beams.fill({ color: 0x000000, alpha: 0.04 });
    }
    this.addChild(beams);

    // === FLOOR (wood planks, bottom 40%) ===
    const floorY = H * 0.6;
    const floorH = H - floorY;
    const floor = new Graphics();
    const plankColors = [0x8b7355, 0x927a5a, 0x846e50, 0x8f7858, 0x7d6a4a, 0x96805e, 0x887050, 0x9a8260];
    const plankWidth = W / 14;
    for (let i = 0; i < 14; i++) {
      const px = i * plankWidth;
      const pw = plankWidth;
      const color = plankColors[i % plankColors.length];

      // Plank body
      floor.rect(px, floorY, pw, floorH);
      floor.fill(color);

      // Subtle color variation within plank
      floor.rect(px, floorY, pw / 2, floorH);
      floor.fill({ color: 0xffffff, alpha: 0.02 });

      // Gap between planks — darker shadow
      floor.rect(px + pw - 1, floorY, 1.5, floorH);
      floor.fill({ color: 0x2a1a08, alpha: 0.35 });
      // Gap highlight (light catching edge)
      floor.rect(px, floorY, 0.5, floorH);
      floor.fill({ color: 0xffffff, alpha: 0.03 });

      // Dense wood grain lines — multiple layers
      for (let gy = floorY + 3; gy < H - 8; gy += 4 + (i % 3)) {
        const gw = pw - 3 - (gy % 6 < 3 ? 2 : 0);
        const gx = px + 1 + (gy % 6 < 3 ? 1 : 0);
        floor.rect(gx, gy, gw, 0.5);
        floor.fill({ color: 0x5a4a30, alpha: 0.1 });
      }
      // Secondary grain — offset
      for (let gy = floorY + 5; gy < H - 8; gy += 7 + (i % 2)) {
        floor.rect(px + 3, gy, pw - 6, 0.3);
        floor.fill({ color: 0x7a6a50, alpha: 0.06 });
      }

      // Plank highlight (top edge — light reflection)
      floor.rect(px, floorY, pw - 1, 1.5);
      floor.fill({ color: 0xffffff, alpha: 0.06 });

      // Nail/peg heads at plank edges
      if (i > 0) {
        floor.circle(px + 1, floorY + 4, 0.8);
        floor.fill({ color: 0x4a3a20, alpha: 0.3 });
        floor.circle(px + 1, H - 12, 0.8);
        floor.fill({ color: 0x4a3a20, alpha: 0.3 });
      }

      // Knots — more varied
      if (i % 3 === 1) {
        const ky = floorY + 18 + (i * 7) % 30;
        floor.ellipse(px + pw / 2, ky, 2.5, 1.8);
        floor.fill({ color: 0x5a4a30, alpha: 0.18 });
        floor.ellipse(px + pw / 2, ky, 1.5, 1);
        floor.fill({ color: 0x4a3a20, alpha: 0.12 });
      }
      if (i % 4 === 2) {
        const ky2 = floorY + 40 + (i * 5) % 20;
        floor.ellipse(px + pw * 0.3, ky2, 1.8, 1.2);
        floor.fill({ color: 0x5a4a30, alpha: 0.14 });
      }
    }
    // Floor-wall join shadow — gradient fade
    floor.rect(0, floorY, W, 5);
    floor.fill({ color: 0x000000, alpha: 0.12 });
    floor.rect(0, floorY + 5, W, 4);
    floor.fill({ color: 0x000000, alpha: 0.06 });
    floor.rect(0, floorY + 9, W, 3);
    floor.fill({ color: 0x000000, alpha: 0.02 });
    // Floor polish shine — warm highlight in center
    floor.ellipse(W * 0.45, H * 0.78, W * 0.2, 15);
    floor.fill({ color: 0xffe8c0, alpha: 0.03 });
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
    // Window frame outer — thicker, detailed
    win.roundRect(winX - 1, winY - 1, 58, 70, 3);
    win.fill(0x5a4330);
    win.roundRect(winX, winY, 56, 68, 2);
    win.fill(0x6b5340);
    // Frame inner edge highlight
    win.roundRect(winX + 1, winY + 1, 54, 66, 2);
    win.stroke({ color: 0x7a6350, width: 0.5 });

    // Glass panes — sky gradient with outdoor scene
    // Top-left pane: sky + clouds
    win.rect(winX + 3, winY + 3, 24, 30);
    win.fill(0x6eaadd);
    win.rect(winX + 3, winY + 3, 24, 10);
    win.fill(0x88ccee);
    win.rect(winX + 3, winY + 3, 24, 4);
    win.fill({ color: 0xaaddff, alpha: 0.5 });
    // Cloud shapes
    win.ellipse(winX + 10, winY + 8, 5, 2);
    win.fill({ color: 0xffffff, alpha: 0.35 });
    win.ellipse(winX + 20, winY + 12, 4, 1.5);
    win.fill({ color: 0xffffff, alpha: 0.25 });
    // Tree silhouettes in lower part of top panes
    win.poly([winX + 6, winY + 30, winX + 9, winY + 18, winX + 12, winY + 30]);
    win.fill({ color: 0x3a7a2a, alpha: 0.5 });
    win.poly([winX + 14, winY + 30, winX + 17, winY + 20, winX + 20, winY + 30]);
    win.fill({ color: 0x4a8a3a, alpha: 0.45 });
    win.poly([winX + 10, winY + 30, winX + 13, winY + 22, winX + 16, winY + 30]);
    win.fill({ color: 0x2a6a1a, alpha: 0.35 });

    // Top-right pane
    win.rect(winX + 29, winY + 3, 24, 30);
    win.fill(0x6eaadd);
    win.rect(winX + 29, winY + 3, 24, 10);
    win.fill(0x88ccee);
    win.rect(winX + 29, winY + 3, 24, 4);
    win.fill({ color: 0xaaddff, alpha: 0.5 });
    win.ellipse(winX + 42, winY + 9, 6, 2);
    win.fill({ color: 0xffffff, alpha: 0.3 });
    // More trees
    win.poly([winX + 32, winY + 30, winX + 36, winY + 19, winX + 40, winY + 30]);
    win.fill({ color: 0x3a7a2a, alpha: 0.45 });
    win.poly([winX + 40, winY + 30, winX + 44, winY + 22, winX + 48, winY + 30]);
    win.fill({ color: 0x4a8a3a, alpha: 0.4 });

    // Bottom panes — darker sky / distant landscape
    win.rect(winX + 3, winY + 35, 24, 30);
    win.fill(0x5a9abb);
    win.rect(winX + 3, winY + 50, 24, 15);
    win.fill({ color: 0x4a8a3a, alpha: 0.3 });
    win.rect(winX + 29, winY + 35, 24, 30);
    win.fill(0x5a9abb);
    win.rect(winX + 29, winY + 50, 24, 15);
    win.fill({ color: 0x4a8a3a, alpha: 0.3 });

    // Glass reflections — diagonal highlights
    win.poly([winX + 5, winY + 5, winX + 12, winY + 5, winX + 5, winY + 15]);
    win.fill({ color: 0xffffff, alpha: 0.1 });
    win.poly([winX + 31, winY + 5, winX + 38, winY + 5, winX + 31, winY + 15]);
    win.fill({ color: 0xffffff, alpha: 0.08 });
    win.poly([winX + 5, winY + 37, winX + 10, winY + 37, winX + 5, winY + 44]);
    win.fill({ color: 0xffffff, alpha: 0.06 });

    // Cross dividers — thicker with detail
    win.rect(winX + 25, winY + 3, 5, 62);
    win.fill(0x6b5340);
    win.rect(winX + 3, winY + 31, 50, 5);
    win.fill(0x6b5340);
    // Divider highlights
    win.rect(winX + 25, winY + 3, 1, 62);
    win.fill({ color: 0x8b7355, alpha: 0.3 });
    win.rect(winX + 3, winY + 31, 50, 1);
    win.fill({ color: 0x8b7355, alpha: 0.3 });
    // Divider shadows
    win.rect(winX + 29, winY + 3, 1, 62);
    win.fill({ color: 0x000000, alpha: 0.08 });
    win.rect(winX + 3, winY + 35, 50, 1);
    win.fill({ color: 0x000000, alpha: 0.08 });

    // Window sill — deeper with shadow
    win.rect(winX - 5, winY + 67, 66, 6);
    win.fill(0x6b5340);
    win.rect(winX - 5, winY + 67, 66, 1.5);
    win.fill(0x7a6348);
    win.rect(winX - 5, winY + 67, 66, 0.5);
    win.fill({ color: 0xffffff, alpha: 0.12 });
    win.rect(winX - 5, winY + 72, 66, 1);
    win.fill({ color: 0x000000, alpha: 0.06 });

    // Potted plant on sill — more detail
    win.roundRect(winX + 20, winY + 60, 12, 8, 1);
    win.fill(0x9a5838);
    win.roundRect(winX + 20, winY + 60, 12, 8, 1);
    win.stroke({ color: 0x7a4828, width: 0.5 });
    // Soil
    win.ellipse(winX + 26, winY + 60, 5, 1.5);
    win.fill(0x4a3a2a);
    // Plant leaves
    win.ellipse(winX + 26, winY + 55, 7, 6);
    win.fill(0x4a9a2a);
    win.ellipse(winX + 23, winY + 57, 4, 3);
    win.fill(0x5aaa3a);
    win.ellipse(winX + 29, winY + 56, 4, 4);
    win.fill(0x3a8a1a);
    win.ellipse(winX + 26, winY + 53, 3, 3);
    win.fill(0x6aba4a);
    // Leaf veins
    win.poly([winX + 26, winY + 53, winX + 26, winY + 58]);
    win.stroke({ color: 0x3a7a1a, width: 0.3 });

    // Second small item on sill — tiny book
    win.rect(winX + 8, winY + 64, 8, 4);
    win.fill(0xcc5544);
    win.rect(winX + 8, winY + 64, 8, 0.5);
    win.fill({ color: 0xffffff, alpha: 0.1 });
    this.addChild(win);

    // Curtains — richer draping with folds
    const curtains = new Graphics();
    // Left curtain — multi-fold
    curtains.rect(winX - 18, winY - 3, 19, 78);
    curtains.fill({ color: 0x8a4040, alpha: 0.75 });
    // Fold shadows
    curtains.rect(winX - 16, winY - 3, 3, 78);
    curtains.fill({ color: 0x6a2828, alpha: 0.3 });
    curtains.rect(winX - 10, winY - 3, 2, 78);
    curtains.fill({ color: 0x6a2828, alpha: 0.2 });
    curtains.rect(winX - 5, winY - 3, 1.5, 78);
    curtains.fill({ color: 0x6a2828, alpha: 0.15 });
    // Fold highlights
    curtains.rect(winX - 13, winY - 3, 1.5, 78);
    curtains.fill({ color: 0xba6868, alpha: 0.2 });
    curtains.rect(winX - 7, winY - 3, 1, 78);
    curtains.fill({ color: 0xba6868, alpha: 0.15 });
    // Curtain bottom gather
    curtains.ellipse(winX - 9, winY + 74, 10, 2);
    curtains.fill({ color: 0x7a3030, alpha: 0.3 });

    // Right curtain — multi-fold
    curtains.rect(winX + 55, winY - 3, 19, 78);
    curtains.fill({ color: 0x8a4040, alpha: 0.75 });
    curtains.rect(winX + 57, winY - 3, 3, 78);
    curtains.fill({ color: 0x6a2828, alpha: 0.3 });
    curtains.rect(winX + 63, winY - 3, 2, 78);
    curtains.fill({ color: 0x6a2828, alpha: 0.2 });
    curtains.rect(winX + 68, winY - 3, 1.5, 78);
    curtains.fill({ color: 0x6a2828, alpha: 0.15 });
    curtains.rect(winX + 60, winY - 3, 1.5, 78);
    curtains.fill({ color: 0xba6868, alpha: 0.2 });
    curtains.rect(winX + 66, winY - 3, 1, 78);
    curtains.fill({ color: 0xba6868, alpha: 0.15 });
    curtains.ellipse(winX + 64, winY + 74, 10, 2);
    curtains.fill({ color: 0x7a3030, alpha: 0.3 });

    // Curtain rod — brass with finials
    curtains.rect(winX - 20, winY - 6, 96, 3);
    curtains.fill(0x6b5340);
    curtains.rect(winX - 20, winY - 6, 96, 1);
    curtains.fill({ color: 0x8b7355, alpha: 0.4 });
    // Rod finials — decorative balls
    curtains.circle(winX - 21, winY - 5, 3.5);
    curtains.fill(0x8b7355);
    curtains.circle(winX - 21, winY - 5, 3.5);
    curtains.stroke({ color: 0x6b5340, width: 0.5 });
    curtains.circle(winX - 21, winY - 6, 1.5);
    curtains.fill({ color: 0xffffff, alpha: 0.1 });
    curtains.circle(winX + 77, winY - 5, 3.5);
    curtains.fill(0x8b7355);
    curtains.circle(winX + 77, winY - 5, 3.5);
    curtains.stroke({ color: 0x6b5340, width: 0.5 });
    curtains.circle(winX + 77, winY - 6, 1.5);
    curtains.fill({ color: 0xffffff, alpha: 0.1 });
    // Curtain rings
    for (let ri = 0; ri < 4; ri++) {
      curtains.circle(winX - 15 + ri * 5, winY - 5, 1.5);
      curtains.stroke({ color: 0x8b7355, width: 0.6 });
      curtains.circle(winX + 58 + ri * 5, winY - 5, 1.5);
      curtains.stroke({ color: 0x8b7355, width: 0.6 });
    }
    this.addChild(curtains);

    // Window light on floor — stronger, wider beam
    const winLight = new Graphics();
    winLight.poly([winX + 5, floorY, winX + 50, floorY, winX + 80, H - 8, winX + 20, H - 8]);
    winLight.fill({ color: 0xfff8d0, alpha: 0.07 });
    winLight.poly([winX + 12, floorY, winX + 42, floorY, winX + 65, H * 0.85, winX + 28, H * 0.85]);
    winLight.fill({ color: 0xfff8d0, alpha: 0.05 });
    // Cross pattern from window dividers in light
    winLight.poly([winX + 28, floorY, winX + 30, floorY, winX + 48, H - 8, winX + 45, H - 8]);
    winLight.fill({ color: 0x000000, alpha: 0.02 });
    // Dust motes in light beam
    const motePositions = [[winX + 35, floorY + 8], [winX + 42, floorY + 15], [winX + 30, floorY + 22],
      [winX + 48, floorY + 12], [winX + 38, floorY + 28], [winX + 55, floorY + 20]];
    for (const [mx, my] of motePositions) {
      winLight.circle(mx, my, 0.5);
      winLight.fill({ color: 0xfff8d0, alpha: 0.15 });
    }
    this.addChild(winLight);

    // === FIREPLACE (center) ===
    const fpX = W * 0.43;
    const fpY = H * 0.08;
    const fp = new Graphics();

    // Chimney breast — slight recess behind stones
    fp.roundRect(fpX - 5, fpY + 14, 66, 78, 2);
    fp.fill(0x6a6058);

    // Stone surround — 6 rows × 4 columns, varied sizes
    const stoneColors = [0x8a8078, 0x7a7068, 0x9a9088, 0x6a6058, 0x8a7a70, 0x7a7a70, 0x8a8880, 0x6a6860];
    const stoneWidths = [14, 16, 13, 15, 12, 17, 14, 16];
    const stoneHeights = [11, 12, 10, 13, 11, 12, 10, 11];
    for (let sy = 0; sy < 6; sy++) {
      let sx = 0;
      const rowOffset = sy % 2 === 0 ? 0 : 7;
      let xPos = fpX + rowOffset - 2;
      while (sx < 4 && xPos < fpX + 56) {
        const idx = (sy * 4 + sx) % stoneWidths.length;
        const sw = stoneWidths[idx];
        const sh = stoneHeights[idx];
        const sc = stoneColors[(sy * 4 + sx) % stoneColors.length];
        const stoneY = fpY + 18 + sy * 13;
        fp.roundRect(xPos, stoneY, sw, sh, 2);
        fp.fill(sc);
        // Stone texture — subtle speckle
        fp.circle(xPos + sw * 0.3, stoneY + sh * 0.4, 0.5);
        fp.fill({ color: 0x5a5048, alpha: 0.2 });
        fp.circle(xPos + sw * 0.7, stoneY + sh * 0.6, 0.4);
        fp.fill({ color: 0xaaa098, alpha: 0.15 });
        // Mortar lines
        fp.roundRect(xPos, stoneY, sw, sh, 2);
        fp.stroke({ color: 0x5a5048, width: 0.6 });
        xPos += sw + 1;
        sx++;
      }
    }

    // Fire opening — deeper, darker
    fp.roundRect(fpX + 6, fpY + 38, 44, 48, 4);
    fp.fill(0x1a0a00);
    // Inner soot staining
    fp.roundRect(fpX + 7, fpY + 39, 42, 20, 3);
    fp.fill({ color: 0x0a0000, alpha: 0.4 });

    // Ash bed at bottom of fireplace
    fp.ellipse(fpX + 28, fpY + 84, 18, 3);
    fp.fill({ color: 0x6a6a6a, alpha: 0.5 });
    fp.ellipse(fpX + 28, fpY + 84, 14, 2);
    fp.fill({ color: 0x8a8a8a, alpha: 0.3 });

    // Fire flames — 5 layers for rich depth
    fp.poly([fpX + 15, fpY + 85, fpX + 20, fpY + 58, fpX + 26, fpY + 68, fpX + 30, fpY + 50, fpX + 35, fpY + 65, fpX + 40, fpY + 55, fpX + 45, fpY + 85]);
    fp.fill({ color: 0xcc2200, alpha: 0.8 });
    fp.poly([fpX + 18, fpY + 85, fpX + 23, fpY + 60, fpX + 28, fpY + 70, fpX + 33, fpY + 55, fpX + 38, fpY + 70, fpX + 43, fpY + 85]);
    fp.fill({ color: 0xff4400, alpha: 0.75 });
    fp.poly([fpX + 20, fpY + 85, fpX + 25, fpY + 65, fpX + 28, fpY + 71, fpX + 31, fpY + 63, fpX + 36, fpY + 71, fpX + 40, fpY + 85]);
    fp.fill({ color: 0xff7700, alpha: 0.65 });
    fp.poly([fpX + 23, fpY + 85, fpX + 26, fpY + 68, fpX + 29, fpY + 72, fpX + 32, fpY + 66, fpX + 35, fpY + 85]);
    fp.fill({ color: 0xffaa22, alpha: 0.6 });
    fp.poly([fpX + 26, fpY + 85, fpX + 28, fpY + 72, fpX + 30, fpY + 75, fpX + 32, fpY + 70, fpX + 34, fpY + 85]);
    fp.fill({ color: 0xffdd44, alpha: 0.5 });

    // Glowing embers scattered
    const emberPositions = [[20, 83], [25, 84], [30, 83], [35, 84], [38, 82], [23, 82]];
    for (const [ex, ey] of emberPositions) {
      fp.circle(fpX + ex, fpY + ey, 0.8 + Math.random() * 0.5);
      fp.fill({ color: 0xff6600, alpha: 0.5 });
    }

    // Fire tools — poker leaning against right side
    fp.poly([fpX + 50, fpY + 40, fpX + 52, fpY + 86]);
    fp.stroke({ color: 0x4a4a4a, width: 1.2 });
    fp.circle(fpX + 50, fpY + 40, 1.5);
    fp.fill(0x3a3a3a);
    // Tongs
    fp.poly([fpX + 53, fpY + 44, fpX + 54, fpY + 86]);
    fp.stroke({ color: 0x5a5a5a, width: 1 });

    // Mantle — multi-layer with depth
    fp.rect(fpX - 10, fpY + 14, 76, 8);
    fp.fill(0x5a4330);
    fp.rect(fpX - 10, fpY + 14, 76, 2);
    fp.fill(0x6b5340);
    fp.rect(fpX - 10, fpY + 14, 76, 1);
    fp.fill({ color: 0x8b7355, alpha: 0.5 });
    fp.rect(fpX - 10, fpY + 21, 76, 1);
    fp.fill({ color: 0x000000, alpha: 0.1 });
    // Mantle edge detail
    fp.rect(fpX - 10, fpY + 16, 76, 0.5);
    fp.fill({ color: 0x4a3320, alpha: 0.4 });

    // Mantle decorations — detailed clock
    fp.circle(fpX + 15, fpY + 10, 6);
    fp.fill(0xeae0c8);
    fp.circle(fpX + 15, fpY + 10, 6);
    fp.stroke({ color: 0x7a6345, width: 1 });
    fp.circle(fpX + 15, fpY + 10, 5);
    fp.stroke({ color: 0x8b7355, width: 0.5 });
    // Clock hour markers
    for (let h = 0; h < 12; h++) {
      const a = (h * 30 - 90) * Math.PI / 180;
      fp.circle(fpX + 15 + Math.cos(a) * 4, fpY + 10 + Math.sin(a) * 4, 0.4);
      fp.fill(0x4a3a2a);
    }
    // Clock hands
    fp.poly([fpX + 15, fpY + 10, fpX + 15, fpY + 6.5]);
    fp.stroke({ color: 0x2a1a0a, width: 0.6 });
    fp.poly([fpX + 15, fpY + 10, fpX + 18, fpY + 9]);
    fp.stroke({ color: 0x2a1a0a, width: 0.4 });
    fp.circle(fpX + 15, fpY + 10, 0.6);
    fp.fill(0x2a1a0a);

    // Candle with wax drips
    fp.rect(fpX + 40, fpY + 6, 4, 10);
    fp.fill(0xf0e8d0);
    fp.rect(fpX + 40, fpY + 6, 4, 10);
    fp.stroke({ color: 0xd8d0b8, width: 0.3 });
    // Wax drip
    fp.ellipse(fpX + 41, fpY + 15, 1.5, 1);
    fp.fill(0xf0e8d0);
    fp.rect(fpX + 40.5, fpY + 12, 1, 3);
    fp.fill(0xf0e8d0);
    // Candle flame
    fp.ellipse(fpX + 42, fpY + 5, 2, 3);
    fp.fill({ color: 0xffaa00, alpha: 0.7 });
    fp.ellipse(fpX + 42, fpY + 4.5, 1.2, 2);
    fp.fill({ color: 0xffee44, alpha: 0.5 });
    // Candle glow
    fp.ellipse(fpX + 42, fpY + 5, 8, 6);
    fp.fill({ color: 0xffaa44, alpha: 0.04 });

    // Small vase on mantle
    fp.roundRect(fpX + 50, fpY + 8, 5, 7, 1);
    fp.fill(0x6688aa);
    fp.roundRect(fpX + 50, fpY + 8, 5, 7, 1);
    fp.stroke({ color: 0x5577aa, width: 0.5 });
    fp.ellipse(fpX + 52.5, fpY + 7, 4, 3);
    fp.fill(0x5a9a3a);

    // Hearth base — stone slab
    fp.rect(fpX - 5, fpY + 86, 66, 7);
    fp.fill(0x7a7068);
    fp.rect(fpX - 5, fpY + 86, 66, 1);
    fp.fill({ color: 0xffffff, alpha: 0.06 });
    fp.rect(fpX - 5, fpY + 92, 66, 1);
    fp.fill({ color: 0x000000, alpha: 0.05 });
    // Hearth stone texture
    fp.rect(fpX + 15, fpY + 87, 0.5, 5);
    fp.fill({ color: 0x6a6058, alpha: 0.3 });
    fp.rect(fpX + 35, fpY + 87, 0.5, 5);
    fp.fill({ color: 0x6a6058, alpha: 0.3 });

    // Fire warm glow — stronger, multiple layers
    fp.ellipse(fpX + 28, fpY + 75, 50, 30);
    fp.fill({ color: 0xff4400, alpha: 0.04 });
    fp.ellipse(fpX + 28, fpY + 80, 40, 22);
    fp.fill({ color: 0xff6622, alpha: 0.06 });
    fp.ellipse(fpX + 28, fpY + 82, 25, 14);
    fp.fill({ color: 0xff8844, alpha: 0.05 });
    // Glow on floor in front of fireplace
    fp.ellipse(fpX + 28, fpY + 100, 45, 12);
    fp.fill({ color: 0xff6622, alpha: 0.04 });
    // Glow on wall above fireplace
    fp.ellipse(fpX + 28, fpY - 5, 30, 15);
    fp.fill({ color: 0xff8844, alpha: 0.03 });
    this.addChild(fp);

    // === BOOKSHELF (right side) ===
    const shelfX = W * 0.72;
    const shelfY = H * 0.05;
    const shelf = new Graphics();
    // Frame — ornate with carved edge suggestion
    shelf.rect(shelfX - 1, shelfY - 1, 67, 87);
    shelf.fill(0x4a3520);
    shelf.rect(shelfX, shelfY, 65, 85);
    shelf.fill(0x5a4530);
    shelf.rect(shelfX, shelfY, 65, 85);
    shelf.stroke({ color: 0x4a3520, width: 1.2 });
    // Frame edge detail
    shelf.rect(shelfX + 1, shelfY + 1, 63, 1);
    shelf.fill({ color: 0x7a6550, alpha: 0.4 });
    shelf.rect(shelfX + 1, shelfY + 1, 1, 83);
    shelf.fill({ color: 0x7a6550, alpha: 0.3 });
    // Inner back — darker with grain
    shelf.rect(shelfX + 3, shelfY + 3, 59, 79);
    shelf.fill(0x3a2a18);
    for (let gy = shelfY + 5; gy < shelfY + 80; gy += 4) {
      shelf.rect(shelfX + 4, gy, 57, 0.3);
      shelf.fill({ color: 0x2a1a08, alpha: 0.3 });
    }

    // 4 shelves with shadow
    const shelfYs = [shelfY + 18, shelfY + 36, shelfY + 54, shelfY + 72];
    for (const sy of shelfYs) {
      // Shelf shadow underneath
      shelf.rect(shelfX + 3, sy + 2, 59, 2);
      shelf.fill({ color: 0x000000, alpha: 0.15 });
      // Shelf board
      shelf.rect(shelfX + 3, sy, 59, 3);
      shelf.fill(0x6b5340);
      // Top highlight
      shelf.rect(shelfX + 3, sy, 59, 0.5);
      shelf.fill({ color: 0x8b7355, alpha: 0.4 });
      // Front edge
      shelf.rect(shelfX + 3, sy + 2, 59, 0.5);
      shelf.fill({ color: 0x5a4330, alpha: 0.3 });
    }

    // Books on shelves — more varied, denser
    const bColors = [0xcc4444, 0x44aa44, 0x4488cc, 0xccaa44, 0xaa44aa,
      0x44aaaa, 0xcc8844, 0x8844cc, 0xcc4488, 0x88cc44,
      0x4444cc, 0xaa8844, 0xcc6666, 0x6688aa, 0x88aa66,
      0xbb5533, 0x3399aa, 0xaa6688, 0x668844, 0x9955aa];
    let bi = 0;
    for (let si = 0; si < 4; si++) {
      const y = shelfYs[si];
      let bx = shelfX + 5;
      const count = 6 + (si % 2);
      for (let bk = 0; bk < count && bx < shelfX + 56; bk++) {
        const bw = 4 + (bi % 5);
        const bh = 12 + (bi % 4);
        // Slight tilt for some books
        const tilted = bi % 7 === 3;
        if (tilted && bx + bw + 3 < shelfX + 56) {
          shelf.poly([bx, y, bx + bw, y, bx + bw + 2, y - bh, bx + 2, y - bh]);
          shelf.fill(bColors[bi % bColors.length]);
          bx += bw + 2;
        } else {
          shelf.rect(bx, y - bh, bw, bh);
          shelf.fill(bColors[bi % bColors.length]);
          // Book spine highlight
          shelf.rect(bx + 1, y - bh + 1, 0.4, bh - 2);
          shelf.fill({ color: 0xffffff, alpha: 0.1 });
          // Book title suggestion — small colored bar
          if (bi % 3 === 0) {
            shelf.rect(bx + 1, y - bh + 3, bw - 2, 1);
            shelf.fill({ color: 0xffffff, alpha: 0.12 });
          }
          // Book shadow on right edge
          shelf.rect(bx + bw - 0.5, y - bh, 0.5, bh);
          shelf.fill({ color: 0x000000, alpha: 0.1 });
          bx += bw + 1;
        }
        bi++;
      }
      // Decorative items on shelves
      if (si === 0) {
        // Small framed photo
        shelf.rect(shelfX + 52, y - 10, 8, 10);
        shelf.fill(0x6b5340);
        shelf.rect(shelfX + 53, y - 9, 6, 8);
        shelf.fill(0xd8c8a8);
      }
      if (si === 1) {
        // Globe
        shelf.circle(shelfX + 54, y - 6, 4);
        shelf.fill(0x5a8aaa);
        shelf.circle(shelfX + 54, y - 6, 4);
        shelf.stroke({ color: 0x4a7a9a, width: 0.5 });
        // Globe land masses
        shelf.ellipse(shelfX + 53, y - 7, 2, 1.5);
        shelf.fill({ color: 0x4a9a3a, alpha: 0.4 });
        // Globe stand
        shelf.rect(shelfX + 53, y - 2, 2, 2);
        shelf.fill(0x8b7355);
      }
      if (si === 2) {
        // Small figurine
        shelf.rect(shelfX + 53, y - 8, 3, 8);
        shelf.fill(0xd4c4a0);
        shelf.circle(shelfX + 54.5, y - 9, 2);
        shelf.fill(0xd4c4a0);
      }
      if (si === 3) {
        // Small potted succulent
        shelf.roundRect(shelfX + 50, y - 5, 7, 5, 1);
        shelf.fill(0xa06040);
        shelf.circle(shelfX + 53.5, y - 7, 3);
        shelf.fill(0x5aaa4a);
        shelf.circle(shelfX + 51, y - 6, 2);
        shelf.fill(0x6aba5a);
      }
    }
    // Top of bookshelf — decorative items
    shelf.rect(shelfX + 5, shelfY - 2, 12, 2);
    shelf.fill(0x6b5340);
    this.addChild(shelf);

    // === KITCHEN COUNTER (far left, for cooking cat) ===
    const kX = 2;
    const kY = H * 0.36;
    const kitchen = new Graphics();

    // Tile backsplash above counter
    const tileColors = [0xd8d0c0, 0xd0c8b8, 0xe0d8c8, 0xccc4b4];
    for (let tx = 0; tx < 8; tx++) {
      for (let ty = 0; ty < 3; ty++) {
        const tc = tileColors[(tx + ty) % tileColors.length];
        kitchen.rect(kX + tx * 7, kY - 12 + ty * 4, 6, 3);
        kitchen.fill(tc);
        kitchen.rect(kX + tx * 7, kY - 12 + ty * 4, 6, 3);
        kitchen.stroke({ color: 0xb8b0a0, width: 0.3 });
      }
    }

    // Counter surface — polished wood with highlight
    kitchen.rect(kX, kY, 58, 6);
    kitchen.fill(0x7a6345);
    kitchen.rect(kX, kY, 58, 1.5);
    kitchen.fill(0x8b7355);
    kitchen.rect(kX, kY, 58, 0.5);
    kitchen.fill({ color: 0xffffff, alpha: 0.12 });
    kitchen.rect(kX, kY + 5, 58, 0.5);
    kitchen.fill({ color: 0x000000, alpha: 0.08 });
    // Counter front
    kitchen.rect(kX, kY + 6, 58, 30);
    kitchen.fill(0x6a5838);
    // Wood grain on counter front
    for (let cg = kY + 8; cg < kY + 34; cg += 3) {
      kitchen.rect(kX + 2, cg, 54, 0.3);
      kitchen.fill({ color: 0x5a4828, alpha: 0.15 });
    }
    // Cabinet doors — recessed panels
    kitchen.roundRect(kX + 3, kY + 9, 24, 24, 2);
    kitchen.fill({ color: 0x5a4828, alpha: 0.15 });
    kitchen.roundRect(kX + 3, kY + 9, 24, 24, 2);
    kitchen.stroke({ color: 0x4a3818, width: 0.8 });
    kitchen.roundRect(kX + 31, kY + 9, 24, 24, 2);
    kitchen.fill({ color: 0x5a4828, alpha: 0.15 });
    kitchen.roundRect(kX + 31, kY + 9, 24, 24, 2);
    kitchen.stroke({ color: 0x4a3818, width: 0.8 });
    // Panel inner recesses
    kitchen.roundRect(kX + 5, kY + 11, 20, 20, 1);
    kitchen.stroke({ color: 0x5a4830, width: 0.4 });
    kitchen.roundRect(kX + 33, kY + 11, 20, 20, 1);
    kitchen.stroke({ color: 0x5a4830, width: 0.4 });
    // Knobs — brass with highlight
    kitchen.circle(kX + 24, kY + 21, 1.5);
    kitchen.fill(0xc4a060);
    kitchen.circle(kX + 24, kY + 20.5, 0.5);
    kitchen.fill({ color: 0xffffff, alpha: 0.2 });
    kitchen.circle(kX + 34, kY + 21, 1.5);
    kitchen.fill(0xc4a060);
    kitchen.circle(kX + 34, kY + 20.5, 0.5);
    kitchen.fill({ color: 0xffffff, alpha: 0.2 });

    // Pot on counter — detailed with handles
    kitchen.roundRect(kX + 16, kY - 8, 20, 9, 2);
    kitchen.fill(0x5a5a5a);
    kitchen.roundRect(kX + 16, kY - 8, 20, 9, 2);
    kitchen.stroke({ color: 0x3a3a3a, width: 0.8 });
    // Pot rim
    kitchen.ellipse(kX + 26, kY - 8, 11, 2.5);
    kitchen.fill(0x4a4a4a);
    kitchen.ellipse(kX + 26, kY - 8, 11, 2.5);
    kitchen.stroke({ color: 0x3a3a3a, width: 0.5 });
    // Pot handles
    kitchen.rect(kX + 14, kY - 5, 3, 2);
    kitchen.fill(0x4a4a4a);
    kitchen.rect(kX + 35, kY - 5, 3, 2);
    kitchen.fill(0x4a4a4a);
    // Steam wisps above pot
    kitchen.ellipse(kX + 23, kY - 14, 2, 3);
    kitchen.fill({ color: 0xffffff, alpha: 0.06 });
    kitchen.ellipse(kX + 28, kY - 16, 2, 4);
    kitchen.fill({ color: 0xffffff, alpha: 0.05 });
    kitchen.ellipse(kX + 25, kY - 18, 1.5, 2);
    kitchen.fill({ color: 0xffffff, alpha: 0.04 });

    // Hanging utensils — more detail
    // Ladle
    kitchen.rect(kX + 8, H * 0.06, 1, 14);
    kitchen.fill(0x8a8a8a);
    kitchen.ellipse(kX + 8, H * 0.14, 3, 4);
    kitchen.fill(0x7a7a7a);
    kitchen.ellipse(kX + 8, H * 0.14, 3, 4);
    kitchen.stroke({ color: 0x6a6a6a, width: 0.3 });
    // Spatula
    kitchen.rect(kX + 20, H * 0.05, 1, 12);
    kitchen.fill(0x8a8a8a);
    kitchen.rect(kX + 18, H * 0.1, 5, 7);
    kitchen.fill(0x7a7a7a);
    kitchen.rect(kX + 19, H * 0.11, 1, 4);
    kitchen.fill({ color: 0x000000, alpha: 0.15 });
    kitchen.rect(kX + 21, H * 0.11, 1, 4);
    kitchen.fill({ color: 0x000000, alpha: 0.15 });
    // Hanging pan
    kitchen.rect(kX + 38, H * 0.04, 1, 8);
    kitchen.fill(0x6a6a6a);
    kitchen.ellipse(kX + 38, H * 0.1, 8, 4);
    kitchen.fill(0x4a4a4a);
    kitchen.ellipse(kX + 38, H * 0.1, 8, 4);
    kitchen.stroke({ color: 0x3a3a3a, width: 0.5 });
    kitchen.rect(kX + 44, H * 0.09, 6, 1);
    kitchen.fill(0x5a5a5a);

    // Spice shelf — with labels
    kitchen.rect(kX + 2, H * 0.2, 42, 4);
    kitchen.fill(0x6b5340);
    kitchen.rect(kX + 2, H * 0.2, 42, 0.5);
    kitchen.fill({ color: 0x8b7355, alpha: 0.3 });
    const spiceColors = [0xcc4444, 0x44aa44, 0xccaa44, 0x8844aa, 0xaa6644, 0x44aaaa];
    for (let si = 0; si < 6; si++) {
      kitchen.roundRect(kX + 3 + si * 6.5, H * 0.155, 5, 11, 1);
      kitchen.fill(spiceColors[si]);
      kitchen.roundRect(kX + 3 + si * 6.5, H * 0.155, 5, 11, 1);
      kitchen.stroke({ color: 0x000000, width: 0.3, alpha: 0.2 });
      // Label
      kitchen.rect(kX + 4 + si * 6.5, H * 0.17, 3, 2);
      kitchen.fill({ color: 0xffffff, alpha: 0.2 });
      // Cap
      kitchen.rect(kX + 3.5 + si * 6.5, H * 0.155, 4, 1.5);
      kitchen.fill({ color: 0x000000, alpha: 0.15 });
    }
    this.addChild(kitchen);

    // === WALL DECORATIONS ===
    const decor = new Graphics();
    // Picture frame 1 (left of fireplace) — landscape painting
    decor.rect(W * 0.32 - 1, H * 0.1 - 1, 24, 20);
    decor.fill(0x5a4330);
    decor.rect(W * 0.32, H * 0.1, 22, 18);
    decor.fill(0x6b5340);
    decor.rect(W * 0.32 + 2, H * 0.1 + 2, 18, 14);
    decor.fill(0x7abbaa);
    // Painting: sky
    decor.rect(W * 0.32 + 2, H * 0.1 + 2, 18, 7);
    decor.fill(0x88ccdd);
    // Painting: mountains
    decor.poly([W * 0.32 + 2, H * 0.1 + 9, W * 0.32 + 8, H * 0.1 + 4, W * 0.32 + 14, H * 0.1 + 9]);
    decor.fill({ color: 0x6a8a7a, alpha: 0.7 });
    // Painting: green hills
    decor.rect(W * 0.32 + 2, H * 0.1 + 9, 18, 7);
    decor.fill(0x5a9a3a);
    // Painting: sun
    decor.circle(W * 0.32 + 15, H * 0.1 + 5, 2);
    decor.fill({ color: 0xffdd44, alpha: 0.6 });
    // Frame shadow
    decor.rect(W * 0.32, H * 0.1 + 18, 22, 2);
    decor.fill({ color: 0x000000, alpha: 0.05 });

    // Picture frame 2 — cat portrait
    decor.rect(W * 0.6 - 1, H * 0.08 - 1, 20, 26);
    decor.fill(0x5a4330);
    decor.rect(W * 0.6, H * 0.08, 18, 24);
    decor.fill(0x6b5340);
    decor.rect(W * 0.6 + 2, H * 0.08 + 2, 14, 20);
    decor.fill(0xd8c8a8);
    // Cat portrait — more detail
    decor.circle(W * 0.6 + 9, H * 0.08 + 9, 5);
    decor.fill(0xff9800);
    // Cat ears
    decor.poly([W * 0.6 + 5.5, H * 0.08 + 6, W * 0.6 + 4, H * 0.08 + 2, W * 0.6 + 7.5, H * 0.08 + 5]);
    decor.fill(0xff9800);
    decor.poly([W * 0.6 + 12.5, H * 0.08 + 6, W * 0.6 + 14, H * 0.08 + 2, W * 0.6 + 10.5, H * 0.08 + 5]);
    decor.fill(0xff9800);
    // Cat eyes
    decor.circle(W * 0.6 + 7.5, H * 0.08 + 8, 1);
    decor.fill(0x2a2a2a);
    decor.circle(W * 0.6 + 10.5, H * 0.08 + 8, 1);
    decor.fill(0x2a2a2a);
    // Cat body
    decor.ellipse(W * 0.6 + 9, H * 0.08 + 17, 5, 5);
    decor.fill(0xff9800);

    // Wall sconce (left of fireplace)
    const scX = W * 0.33;
    const scY = H * 0.28;
    decor.rect(scX + 2, scY, 3, 8);
    decor.fill(0x6b5340);
    decor.roundRect(scX - 1, scY + 6, 10, 5, 2);
    decor.fill(0x8b7355);
    decor.roundRect(scX - 1, scY + 6, 10, 5, 2);
    decor.stroke({ color: 0x6b5340, width: 0.5 });
    // Sconce candle
    decor.rect(scX + 3, scY + 2, 2, 5);
    decor.fill(0xf0e8d0);
    decor.ellipse(scX + 4, scY + 1, 1.5, 2);
    decor.fill({ color: 0xffaa00, alpha: 0.6 });
    decor.ellipse(scX + 4, scY + 0.5, 0.8, 1.2);
    decor.fill({ color: 0xffee44, alpha: 0.4 });
    // Sconce glow
    decor.ellipse(scX + 4, scY + 3, 15, 12);
    decor.fill({ color: 0xffaa44, alpha: 0.04 });

    // Wall sconce (right side)
    const sc2X = W * 0.62;
    decor.rect(sc2X + 2, scY, 3, 8);
    decor.fill(0x6b5340);
    decor.roundRect(sc2X - 1, scY + 6, 10, 5, 2);
    decor.fill(0x8b7355);
    decor.roundRect(sc2X - 1, scY + 6, 10, 5, 2);
    decor.stroke({ color: 0x6b5340, width: 0.5 });
    decor.rect(sc2X + 3, scY + 2, 2, 5);
    decor.fill(0xf0e8d0);
    decor.ellipse(sc2X + 4, scY + 1, 1.5, 2);
    decor.fill({ color: 0xffaa00, alpha: 0.6 });
    decor.ellipse(sc2X + 4, scY + 0.5, 0.8, 1.2);
    decor.fill({ color: 0xffee44, alpha: 0.4 });
    decor.ellipse(sc2X + 4, scY + 3, 15, 12);
    decor.fill({ color: 0xffaa44, alpha: 0.04 });

    // Hanging lantern (center)
    decor.rect(W * 0.66, H * 0.01, 1.5, 12);
    decor.fill(0x5a4330);
    decor.roundRect(W * 0.66 - 5, H * 0.06, 13, 15, 2);
    decor.fill({ color: 0xffaa44, alpha: 0.3 });
    decor.roundRect(W * 0.66 - 5, H * 0.06, 13, 15, 2);
    decor.stroke({ color: 0x5a4330, width: 1 });
    // Lantern glass panels
    decor.rect(W * 0.66 - 3, H * 0.06 + 2, 3, 10);
    decor.fill({ color: 0xffcc66, alpha: 0.15 });
    decor.rect(W * 0.66 + 2, H * 0.06 + 2, 3, 10);
    decor.fill({ color: 0xffcc66, alpha: 0.15 });
    // Cross bars
    decor.rect(W * 0.66 - 4, H * 0.06 + 3, 10, 0.5);
    decor.fill({ color: 0x5a4330, alpha: 0.6 });
    decor.rect(W * 0.66 - 4, H * 0.06 + 11, 10, 0.5);
    decor.fill({ color: 0x5a4330, alpha: 0.6 });
    // Lantern glow — warm pool
    decor.ellipse(W * 0.66 + 1.5, H * 0.06 + 8, 18, 14);
    decor.fill({ color: 0xffaa44, alpha: 0.05 });

    // Small table (center-left) — more detail
    // Table shadow
    decor.ellipse(W * 0.36, H * 0.85, 16, 3);
    decor.fill({ color: 0x000000, alpha: 0.06 });
    // Table legs
    decor.rect(W * 0.36 - 10, H * 0.7 + 3, 2, 16);
    decor.fill(0x5a4330);
    decor.rect(W * 0.36 + 8, H * 0.7 + 3, 2, 16);
    decor.fill(0x5a4330);
    decor.rect(W * 0.36 - 1, H * 0.7 + 3, 2, 16);
    decor.fill(0x5a4330);
    // Table top
    decor.ellipse(W * 0.36, H * 0.7, 16, 6);
    decor.fill(0x6a5838);
    decor.ellipse(W * 0.36, H * 0.7, 16, 6);
    decor.stroke({ color: 0x5a4828, width: 0.8 });
    // Table top highlight
    decor.ellipse(W * 0.36, H * 0.695, 12, 4);
    decor.fill({ color: 0x7a6848, alpha: 0.4 });
    // Tea cup — better detail
    decor.roundRect(W * 0.36 - 5, H * 0.68, 7, 5, 1);
    decor.fill(0xe8e0d0);
    decor.roundRect(W * 0.36 - 5, H * 0.68, 7, 5, 1);
    decor.stroke({ color: 0xc0b8a8, width: 0.5 });
    // Cup handle
    decor.ellipse(W * 0.36 + 3, H * 0.7, 2, 1.5);
    decor.stroke({ color: 0xc0b8a8, width: 0.5 });
    // Saucer
    decor.ellipse(W * 0.36 - 1.5, H * 0.73, 5, 1.5);
    decor.fill(0xd8d0c0);
    // Small book on table
    decor.rect(W * 0.36 + 4, H * 0.685, 6, 4);
    decor.fill(0x4488cc);
    decor.rect(W * 0.36 + 4, H * 0.685, 6, 0.5);
    decor.fill({ color: 0xffffff, alpha: 0.1 });

    // Floor cushion near fireplace — richer
    decor.ellipse(W * 0.58, H * 0.72, 13, 5.5);
    decor.fill({ color: 0x7050a0, alpha: 0.6 });
    decor.ellipse(W * 0.58, H * 0.716, 11, 4.5);
    decor.fill({ color: 0x8060b0, alpha: 0.5 });
    decor.ellipse(W * 0.58, H * 0.714, 7, 3);
    decor.fill({ color: 0x9070c0, alpha: 0.3 });
    // Cushion tassels
    decor.rect(W * 0.58 - 13, H * 0.72, 1, 3);
    decor.fill({ color: 0x9070b0, alpha: 0.3 });
    decor.rect(W * 0.58 + 12, H * 0.72, 1, 3);
    decor.fill({ color: 0x9070b0, alpha: 0.3 });

    // Cat food bowls (near bottom-left)
    decor.ellipse(W * 0.15, H * 0.92, 6, 2.5);
    decor.fill(0xcc6644);
    decor.ellipse(W * 0.15, H * 0.915, 5, 2);
    decor.fill(0xaa5533);
    decor.ellipse(W * 0.15, H * 0.91, 4, 1.5);
    decor.fill({ color: 0x8a7355, alpha: 0.6 });
    // Water bowl
    decor.ellipse(W * 0.21, H * 0.93, 5, 2);
    decor.fill(0x4488aa);
    decor.ellipse(W * 0.21, H * 0.925, 4, 1.5);
    decor.fill(0x5599bb);
    decor.ellipse(W * 0.21, H * 0.92, 3, 1);
    decor.fill({ color: 0x88ccee, alpha: 0.4 });

    // Yarn ball on floor
    decor.circle(W * 0.28, H * 0.9, 3.5);
    decor.fill(0xcc4466);
    decor.circle(W * 0.28, H * 0.9, 3.5);
    decor.stroke({ color: 0xaa3355, width: 0.3 });
    // Yarn spiral pattern
    decor.ellipse(W * 0.28, H * 0.9, 2, 2.5);
    decor.stroke({ color: 0xee6688, width: 0.4 });
    decor.ellipse(W * 0.28 + 0.5, H * 0.9 - 0.5, 1, 1.5);
    decor.stroke({ color: 0xdd5577, width: 0.3 });
    // Trailing yarn
    decor.poly([W * 0.28 + 3, H * 0.91, W * 0.32, H * 0.92, W * 0.34, H * 0.9, W * 0.36, H * 0.91]);
    decor.stroke({ color: 0xcc4466, width: 0.5 });

    // Toy mouse on floor
    decor.ellipse(W * 0.72, H * 0.88, 3, 1.5);
    decor.fill(0x888888);
    decor.circle(W * 0.72 - 2, H * 0.875, 1);
    decor.fill(0x999999);
    // Mouse tail
    decor.poly([W * 0.72 + 3, H * 0.88, W * 0.72 + 6, H * 0.87, W * 0.72 + 7, H * 0.88]);
    decor.stroke({ color: 0x777777, width: 0.4 });

    this.addChild(decor);

    // === DOOR (right edge) — improved detail ===
    const doorX = W - 30;
    const door = new Graphics();
    // Door frame
    door.rect(doorX - 3, H * 0.36, 34, H * 0.64);
    door.fill(0x6b5340);
    door.rect(doorX - 3, H * 0.36, 34, 2);
    door.fill({ color: 0x8b7355, alpha: 0.3 });
    // Door body
    door.roundRect(doorX, H * 0.38, 28, H * 0.62, 2);
    door.fill(0x3a2a1a);
    // Wood grain on door
    for (let dy = H * 0.4; dy < H * 0.95; dy += 5) {
      door.rect(doorX + 3, dy, 22, 0.3);
      door.fill({ color: 0x2a1a0a, alpha: 0.2 });
    }
    // Door panels — recessed with shadow
    door.roundRect(doorX + 4, H * 0.4, 18, 28, 1);
    door.fill({ color: 0x2a1a0a, alpha: 0.15 });
    door.roundRect(doorX + 4, H * 0.4, 18, 28, 1);
    door.stroke({ color: 0x4a3520, width: 0.6 });
    door.roundRect(doorX + 4, H * 0.55, 18, 28, 1);
    door.fill({ color: 0x2a1a0a, alpha: 0.15 });
    door.roundRect(doorX + 4, H * 0.55, 18, 28, 1);
    door.stroke({ color: 0x4a3520, width: 0.6 });
    // Door knob with escutcheon plate
    door.roundRect(doorX + 17, H * 0.55, 5, 10, 1);
    door.fill(0xb09050);
    door.roundRect(doorX + 17, H * 0.55, 5, 10, 1);
    door.stroke({ color: 0x8a7040, width: 0.3 });
    door.circle(doorX + 19.5, H * 0.57, 2.5);
    door.fill(0xc4a060);
    door.circle(doorX + 19.5, H * 0.57, 2.5);
    door.stroke({ color: 0xa08040, width: 0.5 });
    door.circle(doorX + 19.5, H * 0.565, 1);
    door.fill({ color: 0xffffff, alpha: 0.15 });
    // Keyhole
    door.ellipse(doorX + 19.5, H * 0.61, 0.8, 1.2);
    door.fill(0x1a0a00);
    // Dark hallway through gap
    door.rect(doorX + 1, H * 0.42, 3, 24);
    door.fill({ color: 0x0a0000, alpha: 0.5 });
    // Door hinge suggestion
    door.rect(doorX + 1, H * 0.44, 2, 4);
    door.fill({ color: 0x8a7a5a, alpha: 0.4 });
    door.rect(doorX + 1, H * 0.62, 2, 4);
    door.fill({ color: 0x8a7a5a, alpha: 0.4 });
    this.addChild(door);

    // === CORNER VINES — lusher ===
    const vines = new Graphics();
    // Top-left corner vine
    vines.rect(0, 3, 2, 25);
    vines.fill({ color: 0x4a8a2a, alpha: 0.5 });
    // Vine branches
    vines.poly([2, 10, 8, 8, 12, 10]);
    vines.stroke({ color: 0x4a8a2a, width: 0.8 });
    vines.poly([1, 18, 6, 16, 10, 18]);
    vines.stroke({ color: 0x4a8a2a, width: 0.6 });
    // Leaves
    vines.ellipse(4, 8, 3, 2);
    vines.fill({ color: 0x5aaa3a, alpha: 0.4 });
    vines.ellipse(10, 9, 2.5, 1.8);
    vines.fill({ color: 0x6aba4a, alpha: 0.35 });
    vines.ellipse(1, 14, 2.5, 2);
    vines.fill({ color: 0x5a9a3a, alpha: 0.4 });
    vines.ellipse(5, 16, 2, 1.5);
    vines.fill({ color: 0x6aaa4a, alpha: 0.3 });
    vines.ellipse(8, 17, 2.5, 2);
    vines.fill({ color: 0x4a9a2a, alpha: 0.3 });
    vines.ellipse(-1, 20, 2, 1.5);
    vines.fill({ color: 0x5aaa3a, alpha: 0.35 });
    // Top-right corner vine
    vines.rect(W - 4, 3, 2, 20);
    vines.fill({ color: 0x4a8a2a, alpha: 0.45 });
    vines.poly([W - 4, 8, W - 9, 6, W - 12, 8]);
    vines.stroke({ color: 0x4a8a2a, width: 0.7 });
    vines.ellipse(W - 6, 7, 2.5, 2);
    vines.fill({ color: 0x5a9a3a, alpha: 0.4 });
    vines.ellipse(W - 10, 7, 2, 1.5);
    vines.fill({ color: 0x6aaa4a, alpha: 0.3 });
    vines.ellipse(W - 3, 14, 2.5, 2);
    vines.fill({ color: 0x5aaa3a, alpha: 0.35 });
    vines.ellipse(W - 5, 18, 2, 1.5);
    vines.fill({ color: 0x4a9a2a, alpha: 0.3 });
    this.addChild(vines);

    // === ATMOSPHERIC SHADOWS & LIGHTING ===
    const atmo = new Graphics();
    // Corner shadows — stronger
    atmo.rect(0, 0, 30, H);
    atmo.fill({ color: 0x000000, alpha: 0.06 });
    atmo.rect(0, 0, 15, H);
    atmo.fill({ color: 0x000000, alpha: 0.04 });
    atmo.rect(W - 30, 0, 30, H);
    atmo.fill({ color: 0x000000, alpha: 0.06 });
    atmo.rect(W - 15, 0, 15, H);
    atmo.fill({ color: 0x000000, alpha: 0.04 });
    // Ceiling shadow
    atmo.rect(0, 0, W, 10);
    atmo.fill({ color: 0x000000, alpha: 0.03 });
    // Floor edge shadow
    atmo.rect(0, H - 18, W, 18);
    atmo.fill({ color: 0x000000, alpha: 0.04 });
    atmo.rect(0, H - 8, W, 8);
    atmo.fill({ color: 0x000000, alpha: 0.03 });
    // Warm ambient center pool — fire + lantern combined
    atmo.ellipse(W * 0.48, H * 0.72, W * 0.3, 40);
    atmo.fill({ color: 0xffddaa, alpha: 0.03 });
    atmo.ellipse(W * 0.48, H * 0.72, W * 0.18, 25);
    atmo.fill({ color: 0xffcc88, alpha: 0.02 });
    // Window side warm/cool contrast
    atmo.rect(0, floorY, W * 0.25, floorH);
    atmo.fill({ color: 0xddeeff, alpha: 0.02 });
    // Furniture cast shadows on floor
    // Table shadow
    atmo.ellipse(W * 0.36, H * 0.87, 14, 4);
    atmo.fill({ color: 0x000000, alpha: 0.04 });
    // Bookshelf shadow
    atmo.rect(shelfX - 3, floorY, 3, floorH);
    atmo.fill({ color: 0x000000, alpha: 0.04 });
    // Kitchen counter shadow
    atmo.rect(kX + 50, floorY, 5, floorH);
    atmo.fill({ color: 0x000000, alpha: 0.03 });
    this.addChild(atmo);
  }
}
