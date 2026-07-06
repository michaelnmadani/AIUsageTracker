import { Texture } from 'pixi.js';

/**
 * Shared procedural textures for soft lighting: white radial gradients that
 * sprites tint to any color. Flat Graphics ellipses read as hard-edged blobs;
 * these give real falloff.
 */

let glowTexture: Texture | null = null;
let vignetteTexture: Texture | null = null;

/** White radial glow (opaque center → transparent edge). Tint the sprite. */
export function getGlowTexture(): Texture {
  if (glowTexture && !glowTexture.destroyed) return glowTexture;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.62)');
  g.addColorStop(0.65, 'rgba(255,255,255,0.2)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  glowTexture = Texture.from(canvas);
  return glowTexture;
}

/** Transparent center → dark warm-brown edges. Overlay at full size. */
export function getVignetteTexture(): Texture {
  if (vignetteTexture && !vignetteTexture.destroyed) return vignetteTexture;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const r = size * 0.72;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, r);
  g.addColorStop(0, 'rgba(40,20,8,0)');
  g.addColorStop(0.62, 'rgba(40,20,8,0)');
  g.addColorStop(0.85, 'rgba(40,20,8,0.45)');
  g.addColorStop(1, 'rgba(40,20,8,0.9)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  vignetteTexture = Texture.from(canvas);
  return vignetteTexture;
}

/** Destroy cached textures (call on scene teardown) */
export function destroyGlowTextures(): void {
  if (glowTexture && !glowTexture.destroyed) glowTexture.destroy(true);
  if (vignetteTexture && !vignetteTexture.destroyed) vignetteTexture.destroy(true);
  glowTexture = null;
  vignetteTexture = null;
}
