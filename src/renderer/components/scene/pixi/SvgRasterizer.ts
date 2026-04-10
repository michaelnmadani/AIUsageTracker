import { Texture } from 'pixi.js';
import type { CatActivity } from '../../../types/usage';

/**
 * SVG cat definitions as inline SVG markup.
 * Contains the shared <defs> (gradients, filters) and each cat's SVG group.
 * We render these to offscreen SVG → canvas → PixiJS texture.
 */

// Shared defs from CatDefs.tsx (gradients + filters)
const SHARED_DEFS = `
<defs>
  <radialGradient id="furCream" cx="45%" cy="35%" r="65%" fx="40%" fy="30%">
    <stop offset="0%" stop-color="#fffaf0"/>
    <stop offset="30%" stop-color="#fff5eb"/>
    <stop offset="65%" stop-color="#f0dcc8"/>
    <stop offset="85%" stop-color="#dcc4a8"/>
    <stop offset="100%" stop-color="#c8a888"/>
  </radialGradient>
  <radialGradient id="furGray" cx="45%" cy="35%" r="65%" fx="40%" fy="30%">
    <stop offset="0%" stop-color="#e8e0d8"/>
    <stop offset="30%" stop-color="#d8d0c8"/>
    <stop offset="65%" stop-color="#a89a90"/>
    <stop offset="85%" stop-color="#8a7a6a"/>
    <stop offset="100%" stop-color="#6a5a4a"/>
  </radialGradient>
  <radialGradient id="furOrange" cx="45%" cy="35%" r="65%" fx="40%" fy="30%">
    <stop offset="0%" stop-color="#ffd890"/>
    <stop offset="30%" stop-color="#f8c070"/>
    <stop offset="65%" stop-color="#d89040"/>
    <stop offset="85%" stop-color="#c07828"/>
    <stop offset="100%" stop-color="#a06020"/>
  </radialGradient>
  <radialGradient id="furBrown" cx="45%" cy="35%" r="65%" fx="40%" fy="30%">
    <stop offset="0%" stop-color="#c8a078"/>
    <stop offset="30%" stop-color="#a88060"/>
    <stop offset="65%" stop-color="#7a5838"/>
    <stop offset="85%" stop-color="#5a3a20"/>
    <stop offset="100%" stop-color="#402810"/>
  </radialGradient>
  <radialGradient id="furCalico" cx="45%" cy="35%" r="65%" fx="40%" fy="30%">
    <stop offset="0%" stop-color="#fff8f0"/>
    <stop offset="30%" stop-color="#fff0e8"/>
    <stop offset="65%" stop-color="#e8d8c8"/>
    <stop offset="85%" stop-color="#d0c0a8"/>
    <stop offset="100%" stop-color="#b8a890"/>
  </radialGradient>
  <radialGradient id="eyeHighlight" cx="35%" cy="30%" r="50%">
    <stop offset="0%" stop-color="white" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="white" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="blushMark" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ff7777" stop-opacity="0.55"/>
    <stop offset="40%" stop-color="#ff8888" stop-opacity="0.35"/>
    <stop offset="70%" stop-color="#ff9999" stop-opacity="0.15"/>
    <stop offset="100%" stop-color="#ff9999" stop-opacity="0"/>
  </radialGradient>
  <pattern id="apronLace" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="0.5" fill="white" opacity="0.3"/>
  </pattern>
  <radialGradient id="irisAmber" cx="40%" cy="35%" r="55%" fx="35%" fy="30%">
    <stop offset="0%" stop-color="#f0d870"/>
    <stop offset="25%" stop-color="#e8c060"/>
    <stop offset="65%" stop-color="#b89030"/>
    <stop offset="100%" stop-color="#806020"/>
  </radialGradient>
  <radialGradient id="irisGreen" cx="40%" cy="35%" r="55%" fx="35%" fy="30%">
    <stop offset="0%" stop-color="#a0e898"/>
    <stop offset="25%" stop-color="#80c878"/>
    <stop offset="65%" stop-color="#4a8840"/>
    <stop offset="100%" stop-color="#306028"/>
  </radialGradient>
  <radialGradient id="irisBlue" cx="40%" cy="35%" r="55%" fx="35%" fy="30%">
    <stop offset="0%" stop-color="#a0d8f8"/>
    <stop offset="25%" stop-color="#78b8e8"/>
    <stop offset="65%" stop-color="#4080b0"/>
    <stop offset="100%" stop-color="#285878"/>
  </radialGradient>
  <radialGradient id="catWarmGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffdd88" stop-opacity="0.4"/>
    <stop offset="100%" stop-color="#ffdd88" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="aoUnderChin" cx="50%" cy="20%" r="60%">
    <stop offset="0%" stop-color="#000000" stop-opacity="0.12"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="aoEarBase" cx="50%" cy="80%" r="50%">
    <stop offset="0%" stop-color="#000000" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="specHighlight" cx="40%" cy="30%" r="35%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
    <stop offset="60%" stop-color="#ffffff" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
  <filter id="catsAndSoupStyle" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="soft"/>
    <feComponentTransfer in="soft" result="poster">
      <feFuncR type="discrete" tableValues="0.12 0.30 0.50 0.68 0.82 0.95"/>
      <feFuncG type="discrete" tableValues="0.12 0.30 0.50 0.68 0.82 0.95"/>
      <feFuncB type="discrete" tableValues="0.12 0.30 0.50 0.68 0.82 0.95"/>
    </feComponentTransfer>
    <feBlend in="poster" in2="SourceGraphic" mode="normal" result="celBlend"/>
    <feColorMatrix in="celBlend" type="matrix" result="warmed"
      values="1.05 0.02 0.0  0 0.02
              0.0  1.02 0.01 0 0.01
              0.0  0.0  0.95 0 0.0
              0    0    0    1 0"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="glowAlpha"/>
    <feFlood flood-color="#fff0dd" flood-opacity="0.15" result="glowColor"/>
    <feComposite in="glowColor" in2="glowAlpha" operator="in" result="softGlow"/>
    <feMerge>
      <feMergeNode in="softGlow"/>
      <feMergeNode in="warmed"/>
    </feMerge>
  </filter>
  <filter id="catShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
    <feOffset dx="0" dy="2"/>
    <feComponentTransfer>
      <feFuncA type="linear" slope="0.15"/>
    </feComponentTransfer>
    <feMerge>
      <feMergeNode/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>
`;

/** Texture cache to avoid re-rasterizing */
const textureCache = new Map<string, Texture>();

/**
 * Rasterize an SVG cat component to a PixiJS Texture.
 * Uses the DOM to render SVG → canvas → texture.
 */
export async function rasterizeSvgCat(
  activity: CatActivity,
  scale = 2,
): Promise<Texture> {
  const cacheKey = `${activity}_${scale}`;
  const cached = textureCache.get(cacheKey);
  if (cached) return cached;

  // Get the SVG content for this cat from the DOM
  const svgContent = await getCatSvgContent(activity);
  if (!svgContent) {
    // Fallback: return a colored circle placeholder
    return createPlaceholderTexture(activity);
  }

  // Wrap in a standalone SVG with shared defs
  const svgWidth = 120;
  const svgHeight = 120;
  const fullSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth * scale}" height="${svgHeight * scale}" viewBox="-15 0 ${svgWidth} ${svgHeight}">
      ${SHARED_DEFS}
      ${svgContent}
    </svg>
  `;

  try {
    const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = svgWidth * scale;
    canvas.height = svgHeight * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    URL.revokeObjectURL(url);

    const texture = Texture.from(canvas);
    textureCache.set(cacheKey, texture);
    return texture;
  } catch {
    return createPlaceholderTexture(activity);
  }
}

/** Get SVG markup for a cat by extracting from existing DOM (if rendered) or from inline data */
async function getCatSvgContent(activity: CatActivity): Promise<string | null> {
  // Try to find the SVG in the existing DOM first
  const existing = document.querySelector(`[data-cat="${activity}"]`);
  if (existing) {
    return existing.outerHTML;
  }

  // Fall back to inline SVG definitions
  return CAT_SVG_DATA[activity] ?? null;
}

function createPlaceholderTexture(activity: CatActivity): Texture {
  const colors: Record<CatActivity, number> = {
    cooking: 0xfffaf0,
    reading: 0xa89a90,
    sweeping: 0xd8d0c8,
    sleeping: 0xffd890,
    typing: 0xc8a078,
    gardening: 0xfff8f0,
  };

  const canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 100;
  const ctx = canvas.getContext('2d')!;

  const color = colors[activity];
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;

  // Simple cat silhouette
  ctx.fillStyle = `rgb(${r},${g},${b})`;

  // Body
  ctx.beginPath();
  ctx.ellipse(40, 65, 22, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(40, 32, 18, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.moveTo(26, 25);
  ctx.lineTo(22, 10);
  ctx.lineTo(34, 22);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(54, 25);
  ctx.lineTo(58, 10);
  ctx.lineTo(46, 22);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#2a1a0a';
  ctx.beginPath();
  ctx.ellipse(33, 35, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(47, 35, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlights
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(32, 33, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(46, 33, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Blush
  ctx.fillStyle = 'rgba(255,120,120,0.3)';
  ctx.beginPath();
  ctx.ellipse(27, 42, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(53, 42, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose + mouth
  ctx.fillStyle = '#e8a898';
  ctx.beginPath();
  ctx.moveTo(39, 43);
  ctx.lineTo(40, 41);
  ctx.lineTo(41, 43);
  ctx.fill();
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(37, 44);
  ctx.quadraticCurveTo(40, 47, 43, 44);
  ctx.stroke();

  const texture = Texture.from(canvas);
  textureCache.set(`${activity}_placeholder`, texture);
  return texture;
}

/**
 * Inline SVG data for each cat (extracted from the React components).
 * These are the static SVG paths without CSS animations.
 */
const CAT_SVG_DATA: Record<CatActivity, string> = {
  cooking: `<g filter="url(#catsAndSoupStyle)">
    <ellipse cx="22" cy="97" rx="22" ry="5" fill="#3a2a1a" opacity="0.08"/>
    <ellipse cx="22" cy="96" rx="16" ry="3.5" fill="#3a2a1a" opacity="0.2"/>
    <path d="M 3 80 Q -10 64, -5 48 Q -2 40, 3 37" fill="none" stroke="url(#furCream)" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="3" cy="36" rx="3.5" ry="3" fill="url(#furCream)" stroke="#c4a888" stroke-width="0.4" opacity="0.7"/>
    <path d="M 13 76 L 12 88 Q 12 92, 9 92 L 9 93 Q 9 95, 15 95 Q 17 95, 17 92 L 17 88 L 16 76" fill="url(#furCream)" stroke="#c4a888" stroke-width="0.7"/>
    <path d="M 23 76 L 22 88 Q 22 92, 19 92 L 19 93 Q 19 95, 25 95 Q 27 95, 27 92 L 27 88 L 26 76" fill="url(#furCream)" stroke="#c4a888" stroke-width="0.7"/>
    <ellipse cx="13" cy="94" rx="5" ry="2.5" fill="#8b5e3c" stroke="#6d4228" stroke-width="0.5"/>
    <ellipse cx="25" cy="94" rx="5" ry="2.5" fill="#8b5e3c" stroke="#6d4228" stroke-width="0.5"/>
    <path d="M 6 52 Q 4 58, 5 66 Q 6 76, 10 78 Q 20 82, 30 78 Q 34 76, 35 66 Q 36 58, 34 52 Q 28 48, 20 48 Q 12 48, 6 52 Z" fill="url(#furCream)" stroke="#c4a888" stroke-width="1"/>
    <path d="M 10 53 Q 20 50, 30 53 L 32 78 Q 20 82, 8 78 Z" fill="#fff8f2" stroke="#e0d0c0" stroke-width="0.8"/>
    <circle cx="20" cy="55" r="1.8" fill="#ff8888" stroke="#e06060" stroke-width="0.3"/>
    <circle cx="20" cy="36" r="17" fill="url(#furCream)" stroke="#c4a888" stroke-width="1"/>
    <ellipse cx="18" cy="30" rx="5" ry="3" fill="url(#specHighlight)"/>
    <path d="M 12 20 Q 14 15, 17 20 Q 18 14, 20 19 Q 22 14, 23 20 Q 26 15, 28 20" fill="url(#furCream)" stroke="#c4a888" stroke-width="0.6"/>
    <path d="M 6,27 Q 2,18 0,10 Q 4,14 14,24" fill="url(#furCream)" stroke="#c4a888" stroke-width="1"/>
    <path d="M 8,25 Q 5,18 4,14 Q 6,16 13,24" fill="#f0b8a8" opacity="0.55"/>
    <path d="M 34,27 Q 38,18 40,10 Q 36,14 26,24" fill="url(#furCream)" stroke="#c4a888" stroke-width="1"/>
    <path d="M 32,25 Q 35,18 36,14 Q 34,16 27,24" fill="#f0b8a8" opacity="0.55"/>
    <ellipse cx="20" cy="22" rx="13" ry="3.5" fill="#fff8f0" stroke="#d4c4b0" stroke-width="0.6"/>
    <path d="M 9 22 Q 9 14, 14 10 Q 18 6, 20 6 Q 22 6, 26 10 Q 31 14, 31 22" fill="#fff8f0" stroke="#d4c4b0" stroke-width="0.5"/>
    <rect x="9" y="20" width="22" height="3" rx="1" fill="#ff8888" opacity="0.35"/>
    <ellipse cx="13" cy="35" rx="4" ry="5" fill="white" stroke="#8a7060" stroke-width="0.5"/>
    <ellipse cx="13" cy="36" rx="3.2" ry="4" fill="url(#irisAmber)"/>
    <ellipse cx="13" cy="37" rx="2" ry="2.5" fill="#2a1a0a"/>
    <circle cx="11.2" cy="34" r="1.4" fill="white" opacity="0.9"/>
    <circle cx="14.5" cy="37" r="0.7" fill="white" opacity="0.5"/>
    <path d="M 9 31.5 Q 11 30, 13 30.5 Q 15 31, 17 31.5" fill="none" stroke="#5a4030" stroke-width="1.2" stroke-linecap="round"/>
    <ellipse cx="27" cy="35" rx="4" ry="5" fill="white" stroke="#8a7060" stroke-width="0.5"/>
    <ellipse cx="27" cy="36" rx="3.2" ry="4" fill="url(#irisAmber)"/>
    <ellipse cx="27" cy="37" rx="2" ry="2.5" fill="#2a1a0a"/>
    <circle cx="25.2" cy="34" r="1.4" fill="white" opacity="0.9"/>
    <circle cx="28.5" cy="37" r="0.7" fill="white" opacity="0.5"/>
    <path d="M 23 31.5 Q 25 30, 27 30.5 Q 29 31, 31 31.5" fill="none" stroke="#5a4030" stroke-width="1.2" stroke-linecap="round"/>
    <ellipse cx="8" cy="41" rx="3.5" ry="2" fill="url(#blushMark)"/>
    <ellipse cx="32" cy="41" rx="3.5" ry="2" fill="url(#blushMark)"/>
    <path d="M 19 43 L 20 41.5 L 21 43 Z" fill="#e8a898"/>
    <path d="M 17 44 Q 20 46.5, 23 44" fill="none" stroke="#8d6e63" stroke-width="0.7"/>
    <line x1="4" y1="41" x2="13" y2="42" stroke="#c4a888" stroke-width="0.4" opacity="0.35"/>
    <line x1="3" y1="44" x2="13" y2="43.5" stroke="#c4a888" stroke-width="0.4" opacity="0.35"/>
    <line x1="27" y1="42" x2="36" y2="41" stroke="#c4a888" stroke-width="0.4" opacity="0.35"/>
    <line x1="27" y1="43.5" x2="37" y2="44" stroke="#c4a888" stroke-width="0.4" opacity="0.35"/>
    <line x1="34" y1="56" x2="52" y2="48" stroke="#8d6e63" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="54" cy="47" rx="4.5" ry="2.5" fill="#8a8a8a" stroke="#6a6a6a" stroke-width="0.6"/>
    <ellipse cx="35" cy="56" rx="5.5" ry="4" fill="url(#furCream)" stroke="#c4a888" stroke-width="0.8"/>
  </g>`,

  reading: '',   // Will use placeholder
  sweeping: '',  // Will use placeholder
  sleeping: '',  // Will use placeholder
  typing: '',    // Will use placeholder
  gardening: '', // Will use placeholder
};

/** Pre-rasterize all cat textures. Call at scene init. */
export async function preloadAllCatTextures(scale = 2): Promise<Map<CatActivity, Texture>> {
  const activities: CatActivity[] = ['cooking', 'reading', 'sweeping', 'sleeping', 'typing', 'gardening'];
  const map = new Map<CatActivity, Texture>();

  await Promise.all(
    activities.map(async (activity) => {
      const texture = await rasterizeSvgCat(activity, scale);
      map.set(activity, texture);
    }),
  );

  return map;
}

/** Cleanup all cached textures */
export function clearTextureCache(): void {
  for (const texture of textureCache.values()) {
    texture.destroy(true);
  }
  textureCache.clear();
}
