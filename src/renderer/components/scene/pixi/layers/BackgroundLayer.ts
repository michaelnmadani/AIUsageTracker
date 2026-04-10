import { Container, Graphics } from 'pixi.js';
import { SCENE_WIDTH, SCENE_HEIGHT, ROOM_COLORS } from '../config/SceneConfig';

/**
 * Renders the room background using PixiJS Graphics.
 * Phase 1: Geometric placeholder matching the original SVG room.
 * Phase 2: Will be replaced with a painted isometric room image.
 */
export class BackgroundLayer extends Container {
  constructor() {
    super();
    this.buildRoom();
  }

  private buildRoom(): void {
    const g = new Graphics();

    // Outer background
    g.rect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
    g.fill(ROOM_COLORS.outerBg);

    // Grass strip at bottom
    g.rect(0, 228, SCENE_WIDTH, 22);
    g.fill(ROOM_COLORS.grass);

    // Room interior — back wall
    g.rect(30, 25, 340, 200);
    g.fill(ROOM_COLORS.wallInner);

    // Floor
    g.rect(30, 150, 340, 75);
    g.fill(ROOM_COLORS.floor);

    // Floor planks (subtle)
    for (let x = 30; x < 370; x += 40) {
      g.rect(x, 150, 1, 75);
      g.fill({ color: 0x000000, alpha: 0.05 });
    }

    // Floor highlight strip
    g.rect(30, 150, 340, 2);
    g.fill({ color: ROOM_COLORS.floorLight, alpha: 0.3 });

    // Wall panel lines
    g.rect(30, 25, 340, 2);
    g.fill({ color: 0x000000, alpha: 0.1 });
    g.rect(30, 120, 340, 1);
    g.fill({ color: 0x000000, alpha: 0.05 });

    // Window (left side)
    g.rect(60, 40, 50, 60);
    g.fill({ color: 0x87ceeb, alpha: 0.3 });
    g.rect(60, 40, 50, 60);
    g.stroke({ color: 0x8b7355, width: 2 });
    // Window cross
    g.rect(84, 40, 2, 60);
    g.fill(0x8b7355);
    g.rect(60, 68, 50, 2);
    g.fill(0x8b7355);
    // Window light glow
    g.ellipse(85, 100, 40, 30);
    g.fill({ color: ROOM_COLORS.windowGlow, alpha: 0.06 });

    // Fireplace (center)
    g.roundRect(175, 50, 50, 70, 4);
    g.fill(0x8b6b4a);
    g.roundRect(180, 55, 40, 50, 3);
    g.fill(0x3a2a1a);
    // Fire glow
    g.ellipse(200, 100, 25, 15);
    g.fill({ color: ROOM_COLORS.fireGlow, alpha: 0.12 });
    // Mantle
    g.rect(170, 47, 60, 5);
    g.fill(0x6b5340);

    // Bookshelf (right side)
    g.rect(290, 35, 60, 80);
    g.fill(0x6b5340);
    // Shelf lines
    for (let y = 55; y < 115; y += 20) {
      g.rect(292, y, 56, 2);
      g.fill(0x5a4530);
    }
    // Book spines (colored rectangles)
    const bookColors = [0xcc4444, 0x44aa44, 0x4488cc, 0xccaa44, 0xaa44aa, 0x44aaaa];
    for (let i = 0; i < 6; i++) {
      const shelfRow = Math.floor(i / 3);
      const col = i % 3;
      g.rect(295 + col * 18, 38 + shelfRow * 20, 12, 16);
      g.fill(bookColors[i]);
    }

    // Rug on floor
    g.ellipse(200, 190, 80, 25);
    g.fill({ color: 0xcc6644, alpha: 0.3 });
    g.ellipse(200, 190, 60, 18);
    g.fill({ color: 0xcc8866, alpha: 0.2 });

    // Baseboard
    g.rect(30, 220, 340, 5);
    g.fill(0x6b5340);

    // Door opening (right side)
    g.roundRect(335, 130, 30, 90, 3);
    g.fill(0x4a3a2a);
    // Door frame
    g.roundRect(335, 130, 30, 90, 3);
    g.stroke({ color: 0x6b5340, width: 2 });

    // Vignette corners (ambient darkness)
    g.rect(30, 25, 20, 200);
    g.fill({ color: 0x000000, alpha: 0.04 });
    g.rect(350, 25, 20, 200);
    g.fill({ color: 0x000000, alpha: 0.04 });

    this.addChild(g);
  }
}
