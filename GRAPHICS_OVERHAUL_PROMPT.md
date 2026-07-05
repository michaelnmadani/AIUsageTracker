# Graphics Overhaul Prompt for AI Usage Tracker

Use this prompt in a new Claude Code session to review and fix the visual quality of the PixiJS cat scene.

---

## Prompt

I have an Electron desktop app called "AI Usage Tracker" that shows animated cats doing housework in a cozy room scene, rendered with PixiJS v8. The graphics are currently terrible and need a complete visual overhaul. Please review the scene rendering code and make it look like a polished, charming game.

### The Problem

The scene looks crude and low quality despite having ~3,400 lines of graphics code. The core issues are:

1. **The background room (BackgroundLayer.ts, 1215 lines) is drawn entirely with PixiJS Graphics primitives** (rect, circle, ellipse, poly, lines). No matter how many primitives you stack, basic geometric shapes with flat fills will never look like game art. The room currently has:
   - Flat rectangles for walls, floor, wainscoting 
   - Tiny circles for "plaster texture" at alpha 0.06 (invisible)
   - Most decorative details drawn at extremely low alpha (0.06-0.15) making them invisible
   - A fireplace made of stacked rectangles
   - Furniture that looks like colored blocks
   - The whole scene reads as "beige rectangle with some blobs" rather than a cozy room

2. **The cat SVGs are high quality but rendered at tiny sizes**. Each cat SVG is 120x120px with anime-quality detail (radial gradients, whiskers, blush marks, detailed eyes with iris gradients). But `CAT_POSITIONS` in SceneConfig.ts scales them to `0.375-0.41` of that, making them ~45-50px tall in a 400x400 scene. All the SVG detail is wasted at this size.

3. **The lighting layer (73 lines) is near-invisible**. Fire glow at alpha 0.04-0.06, window light at alpha 0.02, ambient overlay at alpha 0.015. These values are so low they have essentially zero visual impact.

4. **The particle effects (EffectsLayer, 81 lines) are generic dots**. Fireflies are 1.5px dots at alpha 0.5. Activity effects (steam, sparkles) are similarly tiny and sparse.

5. **The scene is 400x400 logical pixels** (SceneConfig.ts), uniformly scaled to fit the container. With cats at 0.4 scale, the effective detail resolution is very low.

### Files to Review and Fix

All files are in `src/renderer/components/scene/pixi/`:

| File | Lines | What it does | Problems |
|------|-------|-------------|----------|
| `layers/BackgroundLayer.ts` | 1215 | Room background with Graphics primitives | Looks like colored rectangles, most detail invisible due to low alpha |
| `SvgRasterizer.ts` | 1159 | Cat SVG definitions + frame animation system | SVGs are great quality but rendered too small to see detail |
| `config/SceneConfig.ts` | 77 | Scene dimensions (400x400), cat positions/scales | Cat scales too small (0.375-0.41) |
| `CatSprite.ts` | 129 | Individual cat display + animation | Shadow too faint (alpha 0.15) |
| `layers/LightingLayer.ts` | 73 | Fire glow, window light, ambient overlay | All alpha values near-zero (0.02-0.06) |
| `layers/EffectsLayer.ts` | 81 | Firefly particles + activity effects | Generic, sparse, tiny |
| `CatAnimations.ts` | 137 | Per-activity particle configs | Effects positioned relative to cat positions |
| `layers/CelebrationLayer.ts` | 102 | Confetti burst on milestone | Fine as-is |
| `SceneController.ts` | 218 | Orchestrates all layers | Scene state filters (brightness/saturate/sepia) |
| `ParticleSystem.ts` | 189 | Generic particle engine | Fine as-is |
| `TweenManager.ts` | 51 | Tween/oscillation manager | Fine as-is |

Also:
| `../PixiScene.tsx` | 110 | React wrapper, creates PixiJS Application | Background color 0xd4c4a8 |
| `../../App.tsx` | ~233 | Main app, scene gets 55% height | Scene container styling |

### What "Good" Looks Like

Think **Cats & Soup** or **Neko Atsume** — warm, cozy, painterly game art with visible cats doing cute activities. The current implementation has the right concept but terrible execution.

### Recommended Approach

**Option A: Replace Graphics primitives with pre-rendered image assets**
- The best approach for visual quality
- Create the room background as a single high-quality image (or a few layers)
- Could use an SVG background rendered to texture (same approach as the cats)
- Keeps the scene lightweight while looking dramatically better

**Option B: Dramatically improve the Graphics-based rendering**
- Increase ALL alpha values so details are actually visible
- Use proper color contrasts instead of same-tone-at-low-alpha
- Add actual shadows with visible depth
- Make furniture look like furniture, not colored blocks
- This approach has diminishing returns — Graphics primitives have inherent limitations

**Option C: Hybrid — SVG background + Graphics overlays**
- Render the static room as an SVG-to-texture (like the cats)
- Use Graphics only for dynamic elements (fire animation, light effects)
- Best balance of quality and maintainability

### Specific Fixes Needed Regardless of Approach

1. **Lighting layer**: Increase all alpha values by 5-10x. Fire glow should be 0.2-0.4, window light 0.1-0.15, ambient 0.05-0.08.

2. **Cat sizes**: Either increase SCENE_WIDTH/HEIGHT to give more resolution, or increase cat scales to 0.6-0.7 so the SVG detail is visible.

3. **Shadows**: Cat shadows at alpha 0.15 are invisible. Should be 0.3-0.4.

4. **Background contrast**: The room is currently all variations of beige (#d4c4a8, #b8a888, #cebfa3). Needs stronger color differentiation between walls, floor, and furniture.

5. **Scene state filters**: The "idle" state uses brightness 0.75 and sepia 0.1, which darkens and washes out the already-pale scene. Consider raising idle brightness to 0.85-0.9.

### Build & Test

```bash
npm run build:vite    # Build
npx electron .        # Run
```

Branch: `claude/cat-usage-tracker-app-A8PiI`

The app window is 400x700, with the scene taking the top 55% (~385px height). The scene is 400x400 logical pixels uniformly scaled to fit.
