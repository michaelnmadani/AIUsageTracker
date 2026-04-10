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

  reading: `<g filter="url(#catsAndSoupStyle)">
    <ellipse cx="28" cy="97" rx="24" ry="5" fill="#3a2a1a" opacity="0.08"/>
    <ellipse cx="28" cy="96" rx="18" ry="3.5" fill="#3a2a1a" opacity="0.2"/>
    <g>
      <rect x="26" y="58" width="32" height="22" rx="2" fill="#e8d5b7" stroke="#a08060" stroke-width="1"/>
      <rect x="42" y="58" width="1.5" height="22" fill="#c4a882" opacity="0.3"/>
      <line x1="42" y1="58" x2="42" y2="80" stroke="#a08060" stroke-width="1"/>
      <line x1="29" y1="63" x2="39" y2="63" stroke="#c4a882" stroke-width="0.5"/>
      <line x1="29" y1="66" x2="38" y2="66" stroke="#c4a882" stroke-width="0.5"/>
      <line x1="29" y1="69" x2="39" y2="69" stroke="#c4a882" stroke-width="0.5"/>
      <line x1="29" y1="72" x2="37" y2="72" stroke="#c4a882" stroke-width="0.5"/>
      <line x1="45" y1="63" x2="55" y2="63" stroke="#c4a882" stroke-width="0.5"/>
      <line x1="45" y1="66" x2="56" y2="66" stroke="#c4a882" stroke-width="0.5"/>
      <line x1="45" y1="69" x2="54" y2="69" stroke="#c4a882" stroke-width="0.5"/>
      <path d="M 54 58 L 54 52 L 56 54 L 58 52 L 58 58" fill="#cc4444" stroke="#aa3333" stroke-width="0.3"/>
      <line x1="55" y1="53" x2="56" y2="57" stroke="#aa3333" stroke-width="0.3" opacity="0.3"/>
    </g>
    <path d="M 8 82 Q -2 66, 2 50 Q 4 44, 8 42" fill="none" stroke="url(#furGray)" stroke-width="6" stroke-linecap="round"/>
    <path d="M 8 82 Q -2 66, 2 50 Q 4 44, 8 42" fill="none" stroke="#7a6a5a" stroke-width="0.8" stroke-linecap="round" opacity="0.2"/>
    <ellipse cx="8" cy="41" rx="3.5" ry="3" fill="url(#furGray)" stroke="#7a6a5a" stroke-width="0.4" opacity="0.6"/>
    <path d="M 6 39 Q 8 38, 10 40" fill="none" stroke="#d8d0c8" stroke-width="0.4" opacity="0.25"/>
    <path d="M 17 78 L 16 88 Q 16 92, 13 92 L 13 93 Q 13 95, 19 95 Q 21 95, 21 92 L 21 88 L 20 78" fill="url(#furGray)" stroke="#7a6a5a" stroke-width="0.7"/>
    <path d="M 27 78 L 26 88 Q 26 92, 23 92 L 23 93 Q 23 95, 29 95 Q 31 95, 31 92 L 31 88 L 30 78" fill="url(#furGray)" stroke="#7a6a5a" stroke-width="0.7"/>
    <path d="M 17 78 L 16 88 Q 16 89, 17 88 L 18 78" fill="#7a6a5a" opacity="0.08"/>
    <path d="M 27 78 L 26 88 Q 26 89, 27 88 L 28 78" fill="#7a6a5a" opacity="0.08"/>
    <ellipse cx="17" cy="94" rx="5" ry="2.5" fill="#6d4c2a" stroke="#4a3018" stroke-width="0.5"/>
    <ellipse cx="29" cy="94" rx="5" ry="2.5" fill="#6d4c2a" stroke="#4a3018" stroke-width="0.5"/>
    <ellipse cx="16" cy="93.5" rx="2.5" ry="1" fill="#8a6440" opacity="0.3"/>
    <ellipse cx="28" cy="93.5" rx="2.5" ry="1" fill="#8a6440" opacity="0.3"/>
    <rect x="15" y="86" width="6" height="6" rx="2" fill="#e8ddd0" stroke="#d0c0b0" stroke-width="0.3"/>
    <rect x="25" y="86" width="6" height="6" rx="2" fill="#e8ddd0" stroke="#d0c0b0" stroke-width="0.3"/>
    <path d="M 10 52 Q 8 58, 9 68 Q 10 78, 14 80 Q 23 84, 32 80 Q 36 78, 37 68 Q 38 58, 36 52 Q 30 48, 23 48 Q 16 48, 10 52 Z" fill="url(#furGray)" stroke="#7a6a5a" stroke-width="1"/>
    <path d="M 10 52 Q 8 58, 9 68 Q 10 74, 12 78 Q 14 68, 14 56 Q 14 50, 10 52" fill="#7a6a5a" opacity="0.1"/>
    <path d="M 12 54 Q 11 60, 12 68 Q 13 72, 16 74 Q 16 66, 16 58 Q 15 52, 12 54" fill="#7a6a5a" opacity="0.05"/>
    <path d="M 14 54 Q 23 51, 32 54 L 32 76 Q 23 80, 14 76 Z" fill="#8b6848" stroke="#6d4c2a" stroke-width="0.6" opacity="0.85"/>
    <path d="M 19 54 L 18 62" fill="none" stroke="#5a3a1a" stroke-width="0.4" opacity="0.3"/>
    <path d="M 27 54 L 28 62" fill="none" stroke="#5a3a1a" stroke-width="0.4" opacity="0.3"/>
    <path d="M 16 64 L 15 72" fill="none" stroke="#5a3a1a" stroke-width="0.3" opacity="0.2"/>
    <path d="M 30 64 L 31 72" fill="none" stroke="#5a3a1a" stroke-width="0.3" opacity="0.2"/>
    <path d="M 28 56 Q 32 62, 30 72" fill="#c4a078" opacity="0.1"/>
    <circle cx="23" cy="58" r="1.2" fill="#c4a060" stroke="#a08040" stroke-width="0.3"/>
    <circle cx="23" cy="64" r="1.2" fill="#c4a060" stroke="#a08040" stroke-width="0.3"/>
    <circle cx="23" cy="70" r="1.2" fill="#c4a060" stroke="#a08040" stroke-width="0.3"/>
    <path d="M 18 53 Q 23 51, 28 53 L 26 57 Q 23 55, 20 57 Z" fill="#f0e8e0" stroke="#d0c0b0" stroke-width="0.4"/>
    <ellipse cx="23" cy="50" rx="10" ry="4" fill="url(#aoUnderChin)"/>
    <circle cx="23" cy="36" r="17" fill="url(#furGray)" stroke="#7a6a5a" stroke-width="1"/>
    <path d="M 8 30 Q 6 36, 8 42 Q 10 38, 10 32 Q 9 28, 8 30" fill="#7a6a5a" opacity="0.1"/>
    <path d="M 10 46 Q 23 52, 36 46 Q 32 48, 23 48 Q 14 48, 10 46" fill="#7a6a5a" opacity="0.06"/>
    <ellipse cx="21" cy="30" rx="5" ry="3" fill="url(#specHighlight)"/>
    <path d="M 16 28 Q 20 26, 24 28" fill="none" stroke="#e8e0d8" stroke-width="0.6" opacity="0.2"/>
    <path d="M 12 34 Q 14 32, 16 34" fill="none" stroke="#e8e0d8" stroke-width="0.5" opacity="0.15"/>
    <path d="M 14 20 Q 16 15, 19 20 Q 20 14, 23 19 Q 26 14, 27 20 Q 29 15, 32 20" fill="url(#furGray)" stroke="#7a6a5a" stroke-width="0.6"/>
    <path d="M 7 32 Q 4 28, 6 24" fill="none" stroke="#9a8a7a" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M 39 32 Q 42 28, 40 24" fill="none" stroke="#9a8a7a" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M 11,26 Q 7,16 5,8 Q 9,14 19,23" fill="url(#furGray)" stroke="#7a6a5a" stroke-width="1"/>
    <path d="M 13,24 Q 10,17 9,12 Q 11,15 18,23" fill="#e8b0a0" opacity="0.45"/>
    <ellipse cx="14" cy="24" rx="3" ry="2" fill="url(#aoEarBase)"/>
    <path d="M 8 12 Q 10 9, 9 7" fill="none" stroke="#9a8a7a" stroke-width="0.8" stroke-linecap="round"/>
    <path d="M 35,26 Q 39,16 41,8 Q 37,14 27,23" fill="url(#furGray)" stroke="#7a6a5a" stroke-width="1"/>
    <path d="M 33,24 Q 36,17 37,12 Q 35,15 28,23" fill="#e8b0a0" opacity="0.45"/>
    <ellipse cx="32" cy="24" rx="3" ry="2" fill="url(#aoEarBase)"/>
    <path d="M 38 12 Q 36 9, 37 7" fill="none" stroke="#9a8a7a" stroke-width="0.8" stroke-linecap="round"/>
    <circle cx="17" cy="35" r="6" fill="none" stroke="#4a2a1a" stroke-width="1.3"/>
    <circle cx="31" cy="35" r="6" fill="none" stroke="#4a2a1a" stroke-width="1.3"/>
    <line x1="23" y1="34.5" x2="25" y2="34.5" stroke="#4a2a1a" stroke-width="1"/>
    <line x1="11" y1="34" x2="8" y2="31" stroke="#4a2a1a" stroke-width="0.8"/>
    <line x1="37" y1="34" x2="40" y2="31" stroke="#4a2a1a" stroke-width="0.8"/>
    <path d="M 14 32 Q 15.5 31, 17 32" fill="none" stroke="white" stroke-width="0.6" opacity="0.35"/>
    <path d="M 28 32 Q 29.5 31, 31 32" fill="none" stroke="white" stroke-width="0.6" opacity="0.35"/>
    <path d="M 19 36 Q 20 37, 19 38" fill="none" stroke="white" stroke-width="0.4" opacity="0.15"/>
    <path d="M 33 36 Q 34 37, 33 38" fill="none" stroke="white" stroke-width="0.4" opacity="0.15"/>
    <ellipse cx="17" cy="35" rx="3" ry="3.8" fill="white"/>
    <path d="M 14 32.5 Q 17 31.5, 20 32.5" fill="#4a3020" opacity="0.06"/>
    <ellipse cx="17" cy="35.5" rx="2.6" ry="3.2" fill="#4a8840" opacity="0.15"/>
    <ellipse cx="17" cy="36" rx="2.4" ry="3" fill="url(#irisGreen)"/>
    <ellipse cx="17" cy="36.5" rx="1.5" ry="2" fill="#2a2a2a"/>
    <circle cx="15.5" cy="34.5" r="1.2" fill="white" opacity="0.85"/>
    <circle cx="18.5" cy="37" r="0.5" fill="white" opacity="0.5"/>
    <circle cx="18" cy="38" r="0.3" fill="white" opacity="0.3"/>
    <path d="M 13 31 Q 15.5 30, 18 31" fill="none" stroke="#4a3020" stroke-width="1" stroke-linecap="round"/>
    <ellipse cx="31" cy="35" rx="3" ry="3.8" fill="white"/>
    <path d="M 28 32.5 Q 31 31.5, 34 32.5" fill="#4a3020" opacity="0.06"/>
    <ellipse cx="31" cy="35.5" rx="2.6" ry="3.2" fill="#4a8840" opacity="0.15"/>
    <ellipse cx="31" cy="36" rx="2.4" ry="3" fill="url(#irisGreen)"/>
    <ellipse cx="31" cy="36.5" rx="1.5" ry="2" fill="#2a2a2a"/>
    <circle cx="29.5" cy="34.5" r="1.2" fill="white" opacity="0.85"/>
    <circle cx="32.5" cy="37" r="0.5" fill="white" opacity="0.5"/>
    <circle cx="32" cy="38" r="0.3" fill="white" opacity="0.3"/>
    <path d="M 27 31 Q 29.5 30, 32 31" fill="none" stroke="#4a3020" stroke-width="1" stroke-linecap="round"/>
    <ellipse cx="11" cy="40" rx="3.5" ry="2" fill="url(#blushMark)"/>
    <ellipse cx="37" cy="40" rx="3.5" ry="2" fill="url(#blushMark)"/>
    <path d="M 23 42 L 24 40.5 L 25 42 Z" fill="#d8a090"/>
    <path d="M 20.5 43 Q 24 45.5, 27.5 43" fill="none" stroke="#7a6a5a" stroke-width="0.6"/>
    <line x1="5" y1="40" x2="14" y2="41" stroke="#9a8a7a" stroke-width="0.4" opacity="0.3"/>
    <line x1="4" y1="43" x2="14" y2="42" stroke="#9a8a7a" stroke-width="0.4" opacity="0.3"/>
    <line x1="34" y1="41" x2="43" y2="40" stroke="#9a8a7a" stroke-width="0.4" opacity="0.3"/>
    <line x1="34" y1="42" x2="44" y2="43" stroke="#9a8a7a" stroke-width="0.4" opacity="0.3"/>
    <path d="M 36 28 Q 38 34, 36 42" fill="none" stroke="#fff8e0" stroke-width="0.8" opacity="0.2"/>
    <path d="M 35 52 Q 37 62, 35 72" fill="none" stroke="#fff8e0" stroke-width="0.6" opacity="0.15"/>
    <ellipse cx="32" cy="60" rx="5.5" ry="3.5" fill="url(#furGray)" stroke="#7a6a5a" stroke-width="0.8"/>
    <circle cx="30" cy="59" r="0.8" fill="#d8a898" opacity="0.5"/>
    <circle cx="32" cy="58.5" r="0.8" fill="#d8a898" opacity="0.5"/>
    <circle cx="34" cy="59" r="0.8" fill="#d8a898" opacity="0.5"/>
    <g>
      <ellipse cx="52" cy="18" rx="11" ry="9" fill="#fff8f0" opacity="0.15"/>
      <ellipse cx="52" cy="18" rx="9" ry="7" fill="#fff8f0" stroke="#c4a882" stroke-width="0.5" opacity="0.85"/>
      <text x="52" y="20" text-anchor="middle" font-size="6" fill="#6d4c2a" opacity="0.7">?!</text>
      <circle cx="46" cy="26" r="1.5" fill="#fff8f0" opacity="0.6"/>
      <circle cx="44" cy="29" r="1" fill="#fff8f0" opacity="0.4"/>
    </g>
  </g>`,
  sweeping: `<g filter="url(#catsAndSoupStyle)">
    <ellipse cx="26" cy="97" rx="24" ry="5" fill="#3a2a1a" opacity="0.08"/>
    <ellipse cx="26" cy="96" rx="18" ry="3.5" fill="#3a2a1a" opacity="0.2"/>
    <g>
      <circle cx="54" cy="78" r="1.2" fill="#d4c4a4" opacity="0.5"/>
      <circle cx="59" cy="72" r="1.5" fill="#d4c4a4" opacity="0.4"/>
      <circle cx="51" cy="68" r="1" fill="#d4c4a4" opacity="0.55"/>
      <circle cx="57" cy="82" r="1.2" fill="#d4c4a4" opacity="0.3"/>
    </g>
    <g>
      <line x1="42" y1="42" x2="56" y2="80" stroke="#8d6e50" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 50 76 Q 56 74, 62 78 Q 60 86, 50 84 Z" fill="#d4a060" stroke="#b08040" stroke-width="0.8"/>
      <line x1="52" y1="77" x2="51" y2="83" stroke="#c09040" stroke-width="0.5"/>
      <line x1="54" y1="76" x2="54" y2="84" stroke="#c09040" stroke-width="0.5"/>
      <line x1="56" y1="76" x2="57" y2="84" stroke="#c09040" stroke-width="0.5"/>
      <line x1="58" y1="77" x2="59" y2="83" stroke="#c09040" stroke-width="0.5"/>
      <line x1="53" y1="77" x2="52.5" y2="83.5" stroke="#b88030" stroke-width="0.3"/>
      <line x1="55" y1="76.5" x2="55.5" y2="83.5" stroke="#b88030" stroke-width="0.3"/>
      <line x1="57" y1="76.5" x2="58" y2="83.5" stroke="#b88030" stroke-width="0.3"/>
      <rect x="50" y="75" width="10" height="2" rx="0.5" fill="#6d5030" stroke="#5a4020" stroke-width="0.3"/>
    </g>
    <path d="M 8 82 Q 0 66, 5 52 Q 7 44, 12 42" fill="none" stroke="url(#furOrange)" stroke-width="6" stroke-linecap="round"/>
    <path d="M 8 82 Q 0 66, 5 52 Q 7 44, 12 42" fill="none" stroke="#a06820" stroke-width="0.8" stroke-linecap="round" opacity="0.2"/>
    <path d="M 4 62 Q 6 60, 8 62" fill="none" stroke="#c47020" stroke-width="1.2" opacity="0.35"/>
    <path d="M 3 55 Q 5 53, 7 55" fill="none" stroke="#c47020" stroke-width="1.2" opacity="0.35"/>
    <path d="M 5 48 Q 7 46, 9 48" fill="none" stroke="#c47020" stroke-width="1" opacity="0.25"/>
    <path d="M 16 78 L 15 88 Q 15 92, 12 92 L 12 93 Q 12 95, 18 95 Q 20 95, 20 92 L 20 88 L 19 78" fill="url(#furOrange)" stroke="#a06820" stroke-width="0.7"/>
    <path d="M 26 78 L 25 88 Q 25 92, 22 92 L 22 93 Q 22 95, 28 95 Q 30 95, 30 92 L 30 88 L 29 78" fill="url(#furOrange)" stroke="#a06820" stroke-width="0.7"/>
    <path d="M 16 78 L 15 88 Q 15 89, 16 88 L 17 78" fill="#a06820" opacity="0.08"/>
    <path d="M 26 78 L 25 88 Q 25 89, 26 88 L 27 78" fill="#a06820" opacity="0.08"/>
    <ellipse cx="16" cy="94" rx="5" ry="2.5" fill="#8b4513" stroke="#6d3410" stroke-width="0.5"/>
    <ellipse cx="28" cy="94" rx="5" ry="2.5" fill="#8b4513" stroke="#6d3410" stroke-width="0.5"/>
    <ellipse cx="15" cy="93.5" rx="2.5" ry="1" fill="#a05820" opacity="0.3"/>
    <ellipse cx="27" cy="93.5" rx="2.5" ry="1" fill="#a05820" opacity="0.3"/>
    <rect x="13" y="86" width="6" height="6" rx="2" fill="white" stroke="#e0d0c0" stroke-width="0.3"/>
    <rect x="23" y="86" width="6" height="6" rx="2" fill="white" stroke="#e0d0c0" stroke-width="0.3"/>
    <path d="M 9 52 Q 7 58, 8 68 Q 9 78, 13 80 Q 22 84, 31 80 Q 35 78, 36 68 Q 37 58, 35 52 Q 29 48, 22 48 Q 15 48, 9 52 Z" fill="url(#furOrange)" stroke="#a06820" stroke-width="1"/>
    <path d="M 13 56 Q 22 54, 31 56" fill="none" stroke="#c47020" stroke-width="1.2" opacity="0.3"/>
    <path d="M 12 62 Q 22 60, 32 62" fill="none" stroke="#c47020" stroke-width="1.2" opacity="0.3"/>
    <path d="M 13 68 Q 22 66, 31 68" fill="none" stroke="#c47020" stroke-width="1.2" opacity="0.3"/>
    <path d="M 14 59 Q 22 57, 30 59" fill="none" stroke="#c47020" stroke-width="0.6" opacity="0.15"/>
    <path d="M 13 65 Q 22 63, 31 65" fill="none" stroke="#c47020" stroke-width="0.6" opacity="0.15"/>
    <path d="M 9 52 Q 7 58, 8 68 Q 9 74, 11 78 Q 12 68, 12 56 Q 13 50, 9 52" fill="#a06820" opacity="0.1"/>
    <path d="M 11 54 Q 10 60, 11 68 Q 12 72, 14 74 Q 14 66, 14 58 Q 14 52, 11 54" fill="#a06820" opacity="0.05"/>
    <path d="M 31 54 Q 35 60, 34 68 Q 33 72, 29 76 Q 31 68, 31 58 Z" fill="#ffd890" opacity="0.08"/>
    <path d="M 13 55 Q 22 52, 31 55 L 33 80 Q 22 84, 11 80 Z" fill="#fff8f2" stroke="#e0d0c0" stroke-width="0.7" opacity="0.9"/>
    <rect x="18" y="64" width="10" height="7" rx="1.5" fill="#fff0e8" stroke="#e0c8b8" stroke-width="0.4"/>
    <path d="M 11 78 Q 14 76, 17 78 Q 20 76, 23 78 Q 26 76, 29 78 Q 32 76, 33 78" fill="none" stroke="#e0d0c0" stroke-width="0.7"/>
    <path d="M 13 77 L 14 78 L 15 77 L 16 78 L 17 77" fill="none" stroke="#d8c8b8" stroke-width="0.3" opacity="0.4"/>
    <ellipse cx="22" cy="50" rx="10" ry="4" fill="url(#aoUnderChin)"/>
    <circle cx="22" cy="36" r="17" fill="url(#furOrange)" stroke="#a06820" stroke-width="1"/>
    <path d="M 14 26 L 18 22 L 22 26 L 26 22 L 30 26" fill="none" stroke="#c47020" stroke-width="1.2" opacity="0.45"/>
    <path d="M 15 27 L 18.5 23.5 L 22 27" fill="none" stroke="#e8a050" stroke-width="0.4" opacity="0.2"/>
    <path d="M 7 30 Q 5 36, 7 42 Q 10 38, 10 32 Q 8 28, 7 30" fill="#a06820" opacity="0.1"/>
    <path d="M 9 46 Q 22 52, 35 46 Q 30 48, 22 48 Q 14 48, 9 46" fill="#a06820" opacity="0.06"/>
    <ellipse cx="20" cy="30" rx="5" ry="3" fill="url(#specHighlight)"/>
    <path d="M 6 36 Q 3 32, 6 28" fill="none" stroke="#d89040" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M 38 36 Q 41 32, 38 28" fill="none" stroke="#d89040" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M 16 28 Q 20 26, 24 28" fill="none" stroke="#ffd890" stroke-width="0.6" opacity="0.2"/>
    <path d="M 10,26 Q 6,14 4,6 Q 8,12 18,22" fill="url(#furOrange)" stroke="#a06820" stroke-width="1"/>
    <path d="M 12,24 Q 9,16 8,10 Q 10,14 17,22" fill="#f0b8a0" opacity="0.45"/>
    <ellipse cx="14" cy="24" rx="3" ry="2" fill="url(#aoEarBase)"/>
    <path d="M 7 10 Q 9 7, 8 5" fill="none" stroke="#d89040" stroke-width="0.8" stroke-linecap="round"/>
    <path d="M 34,26 Q 38,14 40,6 Q 36,12 26,22" fill="url(#furOrange)" stroke="#a06820" stroke-width="1"/>
    <path d="M 32,24 Q 35,16 36,10 Q 34,14 27,22" fill="#f0b8a0" opacity="0.45"/>
    <ellipse cx="30" cy="24" rx="3" ry="2" fill="url(#aoEarBase)"/>
    <path d="M 37 10 Q 35 7, 36 5" fill="none" stroke="#d89040" stroke-width="0.8" stroke-linecap="round"/>
    <path d="M 10 28 Q 22 30, 34 28" fill="none" stroke="#cc3333" stroke-width="3" stroke-linecap="round"/>
    <polygon points="33,28 40,38 37,40" fill="#cc3333" opacity="0.85"/>
    <polygon points="34,29 39,36 37,38" fill="#dd5555" opacity="0.4"/>
    <path d="M 15 28.5 Q 18 29.5, 21 28.5" fill="none" stroke="#aa2222" stroke-width="0.4" opacity="0.2"/>
    <path d="M 25 28.5 Q 28 29.5, 31 28.5" fill="none" stroke="#aa2222" stroke-width="0.4" opacity="0.2"/>
    <circle cx="18" cy="29" r="0.8" fill="#ff8888" opacity="0.5"/>
    <circle cx="22" cy="29.5" r="0.8" fill="#ff8888" opacity="0.5"/>
    <circle cx="27" cy="29" r="0.8" fill="#ff8888" opacity="0.5"/>
    <ellipse cx="16" cy="35" rx="3.5" ry="4.2" fill="white" stroke="#8a6840" stroke-width="0.5"/>
    <path d="M 12.5 32 Q 16 31, 19.5 32" fill="#8a6840" opacity="0.06"/>
    <ellipse cx="16" cy="35.5" rx="3" ry="3.5" fill="#b89030" opacity="0.15"/>
    <ellipse cx="16" cy="36" rx="2.8" ry="3.3" fill="url(#irisAmber)"/>
    <ellipse cx="16" cy="36.5" rx="1.8" ry="2.2" fill="#3a2a1a"/>
    <circle cx="14.5" cy="34.5" r="1.3" fill="white" opacity="0.9"/>
    <circle cx="17.5" cy="37" r="0.6" fill="white" opacity="0.5"/>
    <circle cx="17" cy="38" r="0.3" fill="white" opacity="0.3"/>
    <path d="M 12.5 31 Q 14.5 30, 17 31.5" fill="none" stroke="#a06820" stroke-width="1.1" stroke-linecap="round"/>
    <ellipse cx="28" cy="35" rx="3.5" ry="4.2" fill="white" stroke="#8a6840" stroke-width="0.5"/>
    <path d="M 24.5 32 Q 28 31, 31.5 32" fill="#8a6840" opacity="0.06"/>
    <ellipse cx="28" cy="35.5" rx="3" ry="3.5" fill="#b89030" opacity="0.15"/>
    <ellipse cx="28" cy="36" rx="2.8" ry="3.3" fill="url(#irisAmber)"/>
    <ellipse cx="28" cy="36.5" rx="1.8" ry="2.2" fill="#3a2a1a"/>
    <circle cx="26.5" cy="34.5" r="1.3" fill="white" opacity="0.9"/>
    <circle cx="29.5" cy="37" r="0.6" fill="white" opacity="0.5"/>
    <circle cx="29" cy="38" r="0.3" fill="white" opacity="0.3"/>
    <path d="M 26 31.5 Q 28.5 30, 31.5 31" fill="none" stroke="#a06820" stroke-width="1.1" stroke-linecap="round"/>
    <ellipse cx="11" cy="40" rx="3.5" ry="2" fill="url(#blushMark)"/>
    <ellipse cx="33" cy="40" rx="3.5" ry="2" fill="url(#blushMark)"/>
    <path d="M 21 42 L 22 40.5 L 23 42 Z" fill="#e8a898"/>
    <path d="M 19 43 Q 22 45, 25 43" fill="none" stroke="#8d6e63" stroke-width="0.6"/>
    <line x1="4" y1="39" x2="13" y2="40" stroke="#c4a060" stroke-width="0.4" opacity="0.3"/>
    <line x1="3" y1="42" x2="13" y2="41.5" stroke="#c4a060" stroke-width="0.4" opacity="0.3"/>
    <line x1="31" y1="40" x2="40" y2="39" stroke="#c4a060" stroke-width="0.4" opacity="0.3"/>
    <line x1="31" y1="41.5" x2="41" y2="42" stroke="#c4a060" stroke-width="0.4" opacity="0.3"/>
    <path d="M 36 28 Q 38 34, 36 42" fill="none" stroke="#fff8e0" stroke-width="0.8" opacity="0.2"/>
    <path d="M 34 52 Q 36 62, 34 72" fill="none" stroke="#fff8e0" stroke-width="0.6" opacity="0.15"/>
    <ellipse cx="40" cy="52" rx="5.5" ry="4" fill="url(#furOrange)" stroke="#a06820" stroke-width="0.8"/>
    <circle cx="38" cy="51" r="0.8" fill="#e8b0a0" opacity="0.5"/>
    <circle cx="40" cy="50.5" r="0.8" fill="#e8b0a0" opacity="0.5"/>
    <circle cx="42" cy="51" r="0.8" fill="#e8b0a0" opacity="0.5"/>
  </g>`,
  sleeping: `<g filter="url(#catsAndSoupStyle)">
    <ellipse cx="30" cy="83" rx="30" ry="6" fill="#3a2a1a" opacity="0.08"/>
    <ellipse cx="30" cy="82" rx="24" ry="4.5" fill="#3a2a1a" opacity="0.15"/>
    <ellipse cx="30" cy="78" rx="30" ry="11" fill="#c87060" stroke="#a05040" stroke-width="1"/>
    <ellipse cx="30" cy="76" rx="28" ry="9" fill="#d88878" stroke="#b06050" stroke-width="0.5"/>
    <path d="M 10 76 L 20 68 L 30 76 L 20 84 Z" fill="none" stroke="#b06050" stroke-width="0.4" opacity="0.35"/>
    <path d="M 20 76 L 30 68 L 40 76 L 30 84 Z" fill="none" stroke="#b06050" stroke-width="0.4" opacity="0.35"/>
    <path d="M 30 76 L 40 68 L 50 76 L 40 84 Z" fill="none" stroke="#b06050" stroke-width="0.4" opacity="0.35"/>
    <ellipse cx="35" cy="72" rx="10" ry="5" fill="#e8a090" opacity="0.1"/>
    <line x1="2" y1="78" x2="0" y2="82" stroke="#a05040" stroke-width="1" stroke-linecap="round"/>
    <line x1="58" y1="78" x2="60" y2="82" stroke="#a05040" stroke-width="1" stroke-linecap="round"/>
    <line x1="1" y1="78" x2="-2" y2="81" stroke="#a05040" stroke-width="0.8" stroke-linecap="round"/>
    <line x1="59" y1="78" x2="62" y2="81" stroke="#a05040" stroke-width="0.8" stroke-linecap="round"/>
    <path d="M 8 50 Q 30 44, 50 52 Q 56 64, 50 76 Q 30 82, 10 76 Q 4 64, 8 50" fill="#8090c8" stroke="#6070a8" stroke-width="0.8"/>
    <path d="M 8 50 Q 30 54, 50 52" fill="none" stroke="#5060a0" stroke-width="0.5" opacity="0.3"/>
    <path d="M 10 60 Q 28 58, 48 62" fill="none" stroke="#5060a0" stroke-width="0.4" opacity="0.2"/>
    <path d="M 12 70 Q 30 68, 48 72" fill="none" stroke="#5060a0" stroke-width="0.4" opacity="0.15"/>
    <path d="M 35 52 Q 48 58, 48 68 Q 46 74, 38 76" fill="#a0b0d8" opacity="0.08"/>
    <g opacity="0.3">
      <circle cx="20" cy="57.5" r="3" fill="#c0d0f0" opacity="0.08"/>
      <polygon points="20,55 21,57 23,57 21.5,58.5 22,60.5 20,59 18,60.5 18.5,58.5 17,57 19,57" fill="#c0d0f0"/>
      <circle cx="38" cy="54" r="3" fill="#c0d0f0" opacity="0.08"/>
      <polygon points="38,52 39,54 41,54 39.5,55.5 40,57.5 38,56 36,57.5 36.5,55.5 35,54 37,54" fill="#c0d0f0"/>
      <circle cx="42" cy="66" r="3" fill="#c0d0f0" opacity="0.08"/>
      <polygon points="42,64 43,66 45,66 43.5,67.5 44,69.5 42,68 40,69.5 40.5,67.5 39,66 41,66" fill="#c0d0f0"/>
      <circle cx="15" cy="68" r="3" fill="#c0d0f0" opacity="0.08"/>
      <polygon points="15,66 16,68 18,68 16.5,69.5 17,71.5 15,70 13,71.5 13.5,69.5 12,68 14,68" fill="#c0d0f0"/>
    </g>
    <path d="M 8 50 Q 11 47, 14 50 Q 17 47, 20 50 Q 23 47, 26 50" fill="none" stroke="#7080b8" stroke-width="0.8"/>
    <ellipse cx="28" cy="58" rx="18" ry="12" fill="url(#furCream)" stroke="#c4a888" stroke-width="1"/>
    <ellipse cx="24" cy="60" rx="8" ry="6" fill="#c4a888" opacity="0.08"/>
    <ellipse cx="20" cy="62" rx="5" ry="4" fill="#c4a888" opacity="0.04"/>
    <ellipse cx="42" cy="72" rx="5" ry="3.5" fill="url(#furCream)" stroke="#c4a888" stroke-width="0.7"/>
    <circle cx="40.5" cy="71.5" r="0.7" fill="#e8b0a0" opacity="0.45"/>
    <circle cx="42.5" cy="71" r="0.7" fill="#e8b0a0" opacity="0.45"/>
    <circle cx="44" cy="71.5" r="0.7" fill="#e8b0a0" opacity="0.45"/>
    <ellipse cx="46" cy="74" rx="4.5" ry="3" fill="url(#furCream)" stroke="#c4a888" stroke-width="0.6"/>
    <circle cx="44.5" cy="73.5" r="0.6" fill="#e8b0a0" opacity="0.4"/>
    <circle cx="46.5" cy="73" r="0.6" fill="#e8b0a0" opacity="0.4"/>
    <path d="M 48 64 Q 56 52, 52 42 Q 48 36, 42 38" fill="none" stroke="url(#furCream)" stroke-width="6" stroke-linecap="round"/>
    <path d="M 48 64 Q 56 52, 52 42 Q 48 36, 42 38" fill="none" stroke="#c4a888" stroke-width="0.6" stroke-linecap="round" opacity="0.25"/>
    <ellipse cx="42" cy="37.5" rx="3.5" ry="3" fill="url(#furCream)" stroke="#c4a888" stroke-width="0.4" opacity="0.7"/>
    <path d="M 40 36 Q 42 35, 44 36" fill="none" stroke="#fff5eb" stroke-width="0.4" opacity="0.25"/>
    <ellipse cx="22" cy="60" rx="8" ry="3" fill="url(#aoUnderChin)"/>
    <circle cx="22" cy="48" r="16" fill="url(#furCream)" stroke="#c4a888" stroke-width="1"/>
    <path d="M 8 42 Q 6 48, 8 54 Q 10 50, 10 44 Q 9 40, 8 42" fill="#c4a888" opacity="0.1"/>
    <path d="M 10 58 Q 22 64, 34 58 Q 30 60, 22 60 Q 14 60, 10 58" fill="#c4a888" opacity="0.06"/>
    <ellipse cx="20" cy="42" rx="5" ry="3" fill="url(#specHighlight)"/>
    <path d="M 16 33 Q 18 29, 20 33 Q 22 29, 24 33 Q 26 29, 28 33" fill="url(#furCream)" stroke="#c4a888" stroke-width="0.5"/>
    <path d="M 16 40 Q 20 38, 24 40" fill="none" stroke="#fff8f0" stroke-width="0.5" opacity="0.2"/>
    <path d="M 10,40 Q 6,32 4,26 Q 8,30 16,38" fill="url(#furCream)" stroke="#c4a888" stroke-width="1"/>
    <path d="M 11,39 Q 8,34 7,30 Q 9,32 15,38" fill="#f0b8a8" opacity="0.45"/>
    <ellipse cx="12" cy="38" rx="3" ry="2" fill="url(#aoEarBase)"/>
    <path d="M 32,40 Q 36,32 38,26 Q 34,30 26,38" fill="url(#furCream)" stroke="#c4a888" stroke-width="1"/>
    <path d="M 31,39 Q 34,34 35,30 Q 33,32 27,38" fill="#f0b8a8" opacity="0.45"/>
    <ellipse cx="30" cy="38" rx="3" ry="2" fill="url(#aoEarBase)"/>
    <path d="M 10 40 Q 22 30, 34 40" fill="#8090c8" stroke="#6070a8" stroke-width="0.6"/>
    <path d="M 10 40 Q 8 30, 22 20 Q 28 18, 30 22" fill="#8090c8" stroke="#6070a8" stroke-width="0.6"/>
    <path d="M 12 36 Q 16 32, 22 36" fill="none" stroke="#a0b0d8" stroke-width="1.5" opacity="0.4"/>
    <path d="M 11 30 Q 15 26, 20 30" fill="none" stroke="#a0b0d8" stroke-width="1.5" opacity="0.4"/>
    <path d="M 18 26 Q 22 22, 26 26" fill="#a0b0e0" opacity="0.12"/>
    <circle cx="29" cy="21" r="3.5" fill="#c0d0f0" stroke="#a0b0d0" stroke-width="0.4"/>
    <circle cx="28" cy="20" r="1.2" fill="white" opacity="0.4"/>
    <circle cx="30" cy="22" r="0.8" fill="white" opacity="0.2"/>
    <circle cx="27.5" cy="22" r="0.6" fill="white" opacity="0.15"/>
    <path d="M 14 48 Q 17 52, 20 48" fill="none" stroke="#8d6e63" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 23 48 Q 26 52, 29 48" fill="none" stroke="#8d6e63" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 14 47 Q 17 46, 20 47" fill="#8d6e63" opacity="0.06"/>
    <path d="M 23 47 Q 26 46, 29 47" fill="#8d6e63" opacity="0.06"/>
    <path d="M 14 47 Q 15.5 46, 17 47" fill="none" stroke="#8d6e63" stroke-width="0.6"/>
    <path d="M 23 47 Q 24.5 46, 26 47" fill="none" stroke="#8d6e63" stroke-width="0.6"/>
    <line x1="20" y1="48" x2="21" y2="47" stroke="#8d6e63" stroke-width="0.4"/>
    <line x1="20.5" y1="48.5" x2="21.5" y2="48" stroke="#8d6e63" stroke-width="0.3"/>
    <line x1="29" y1="48" x2="30" y2="47" stroke="#8d6e63" stroke-width="0.4"/>
    <line x1="29.5" y1="48.5" x2="30.5" y2="48" stroke="#8d6e63" stroke-width="0.3"/>
    <line x1="20" y1="50" x2="20.5" y2="51" stroke="#8d6e63" stroke-width="0.4"/>
    <line x1="29" y1="50" x2="29.5" y2="51" stroke="#8d6e63" stroke-width="0.4"/>
    <ellipse cx="12" cy="52" rx="3.5" ry="2" fill="url(#blushMark)"/>
    <ellipse cx="31" cy="52" rx="3.5" ry="2" fill="url(#blushMark)"/>
    <path d="M 21 54 L 22 52.5 L 23 54 Z" fill="#e8a898"/>
    <path d="M 19.5 55 Q 22 56.5, 24.5 55" fill="none" stroke="#8d6e63" stroke-width="0.5"/>
    <path d="M 34 40 Q 36 46, 34 54" fill="none" stroke="#fff8e0" stroke-width="0.8" opacity="0.2"/>
    <ellipse cx="14" cy="64" rx="5.5" ry="3.5" fill="url(#furCream)" stroke="#c4a888" stroke-width="0.8"/>
    <circle cx="12" cy="63.5" r="0.8" fill="#e8b0a0" opacity="0.5"/>
    <circle cx="14" cy="63" r="0.8" fill="#e8b0a0" opacity="0.5"/>
    <circle cx="16" cy="63.5" r="0.8" fill="#e8b0a0" opacity="0.5"/>
    <g>
      <circle cx="44" cy="34" r="6" fill="#8090c8" opacity="0.04"/>
      <text x="44" y="34" font-size="10" fill="#8090c8" opacity="0.7" font-weight="bold" font-family="serif">z</text>
      <circle cx="50" cy="25" r="7" fill="#8090c8" opacity="0.03"/>
      <text x="50" y="25" font-size="13" fill="#8090c8" opacity="0.5" font-weight="bold" font-family="serif">z</text>
      <circle cx="57" cy="14" r="8" fill="#8090c8" opacity="0.02"/>
      <text x="57" y="14" font-size="16" fill="#8090c8" opacity="0.3" font-weight="bold" font-family="serif">Z</text>
    </g>
  </g>`,
  typing: `<g filter="url(#catsAndSoupStyle)">
    <ellipse cx="32" cy="97" rx="32" ry="6" fill="#3a2a1a" opacity="0.08"/>
    <ellipse cx="32" cy="96" rx="24" ry="4" fill="#3a2a1a" opacity="0.18"/>
    <rect x="18" y="62" width="44" height="5" rx="1.5" fill="#a07848" stroke="#7a5828" stroke-width="1"/>
    <path d="M 22 63 Q 35 62.5, 48 63.5" fill="none" stroke="#8a6438" stroke-width="0.3" opacity="0.3"/>
    <path d="M 20 64.5 Q 40 64, 60 65" fill="none" stroke="#8a6438" stroke-width="0.3" opacity="0.2"/>
    <rect x="20" y="67" width="3.5" height="20" fill="#a07848" stroke="#7a5828" stroke-width="0.5"/>
    <rect x="56" y="67" width="3.5" height="20" fill="#a07848" stroke="#7a5828" stroke-width="0.5"/>
    <line x1="22" y1="64" x2="58" y2="64" stroke="#8a6438" stroke-width="0.3" opacity="0.3"/>
    <rect x="30" y="38" width="28" height="24" rx="2" fill="#f0e4c8" stroke="#c4a882" stroke-width="1"/>
    <rect x="32" y="40" width="24" height="20" fill="#e8d8b0" opacity="0.15"/>
    <ellipse cx="44" cy="38" rx="14" ry="2" fill="#e8d8b8" stroke="#c4a882" stroke-width="0.5"/>
    <ellipse cx="44" cy="62" rx="14" ry="1.5" fill="#e8d8b8" stroke="#c4a882" stroke-width="0.5"/>
    <g>
      <line x1="34" y1="44" x2="48" y2="44" stroke="#8d6e63" stroke-width="0.8" opacity="0.5"/>
      <line x1="34" y1="48" x2="54" y2="48" stroke="#8d6e63" stroke-width="0.8" opacity="0.5"/>
      <line x1="36" y1="52" x2="52" y2="52" stroke="#8d6e63" stroke-width="0.8" opacity="0.5"/>
      <line x1="34" y1="56" x2="46" y2="56" stroke="#8d6e63" stroke-width="0.8" opacity="0.5"/>
    </g>
    <line x1="56" y1="44" x2="66" y2="28" stroke="#5a3a1a" stroke-width="1.2"/>
    <path d="M 66 28 Q 68 26, 70 30 Q 68 29, 66 28" fill="#d8c8b0" stroke="#a09080" stroke-width="0.3"/>
    <path d="M 64 32 Q 66 30, 68 32" fill="none" stroke="#c8b8a0" stroke-width="0.3" opacity="0.4"/>
    <path d="M 62 36 Q 64 34, 66 36" fill="none" stroke="#c8b8a0" stroke-width="0.3" opacity="0.3"/>
    <rect x="25" y="59" width="6" height="5" rx="1.5" fill="#2a1a0a" stroke="#1a0a00" stroke-width="0.5"/>
    <ellipse cx="28" cy="59" rx="3" ry="1" fill="#3a2a1a"/>
    <ellipse cx="27" cy="59.5" rx="1" ry="0.5" fill="#4a3a2a" opacity="0.5"/>
    <path d="M 3 76 Q -5 60, -1 46 Q 1 40, 5 38" fill="none" stroke="url(#furBrown)" stroke-width="6" stroke-linecap="round"/>
    <path d="M 3 76 Q -5 60, -1 46 Q 1 40, 5 38" fill="none" stroke="#5a3a1a" stroke-width="0.8" stroke-linecap="round" opacity="0.2"/>
    <ellipse cx="5" cy="37.5" rx="3.5" ry="3" fill="url(#furBrown)" stroke="#5a3a1a" stroke-width="0.4" opacity="0.6"/>
    <path d="M 3 36 Q 5 35, 7 36" fill="none" stroke="#c8a078" stroke-width="0.4" opacity="0.25"/>
    <path d="M 12 78 L 11 88 Q 11 92, 8 92 L 8 93 Q 8 95, 14 95 Q 16 95, 16 92 L 16 88 L 15 78" fill="url(#furBrown)" stroke="#5a3a1a" stroke-width="0.7"/>
    <path d="M 22 78 L 21 88 Q 21 92, 18 92 L 18 93 Q 18 95, 24 95 Q 26 95, 26 92 L 26 88 L 25 78" fill="url(#furBrown)" stroke="#5a3a1a" stroke-width="0.7"/>
    <path d="M 12 78 L 11 88 Q 11 89, 12 88 L 13 78" fill="#5a3a1a" opacity="0.08"/>
    <path d="M 22 78 L 21 88 Q 21 89, 22 88 L 23 78" fill="#5a3a1a" opacity="0.08"/>
    <ellipse cx="12" cy="94" rx="5" ry="2.5" fill="#3a2a1a" stroke="#2a1a0a" stroke-width="0.5"/>
    <ellipse cx="24" cy="94" rx="5" ry="2.5" fill="#3a2a1a" stroke="#2a1a0a" stroke-width="0.5"/>
    <ellipse cx="11" cy="93.5" rx="2" ry="0.8" fill="#5a4a3a" opacity="0.3"/>
    <ellipse cx="23" cy="93.5" rx="2" ry="0.8" fill="#5a4a3a" opacity="0.3"/>
    <rect x="9" y="86" width="6" height="6" rx="2" fill="#e8ddd0" stroke="#d0c0b0" stroke-width="0.3"/>
    <rect x="19" y="86" width="6" height="6" rx="2" fill="#e8ddd0" stroke="#d0c0b0" stroke-width="0.3"/>
    <path d="M 5 52 Q 3 58, 4 68 Q 5 78, 9 80 Q 18 84, 27 80 Q 31 78, 32 68 Q 33 58, 31 52 Q 25 48, 18 48 Q 11 48, 5 52 Z" fill="url(#furBrown)" stroke="#5a3a1a" stroke-width="1"/>
    <path d="M 5 52 Q 3 58, 4 68 Q 5 74, 7 78 Q 8 68, 8 56 Q 9 50, 5 52" fill="#5a3a1a" opacity="0.1"/>
    <path d="M 7 54 Q 6 60, 7 68 Q 8 72, 10 74 Q 10 66, 10 58 Q 10 52, 7 54" fill="#5a3a1a" opacity="0.05"/>
    <path d="M 27 54 Q 31 60, 30 68 Q 29 72, 25 76 Q 27 68, 27 58 Z" fill="#c8a078" opacity="0.08"/>
    <path d="M 9 54 Q 18 51, 27 54 L 27 76 Q 18 80, 9 76 Z" fill="#6a2838" stroke="#4a1828" stroke-width="0.6" opacity="0.85"/>
    <path d="M 22 56 Q 26 62, 25 72" fill="#8a4858" opacity="0.12"/>
    <path d="M 15 54 L 14 68" fill="none" stroke="#4a1020" stroke-width="0.3" opacity="0.3"/>
    <path d="M 21 54 L 22 68" fill="none" stroke="#4a1020" stroke-width="0.3" opacity="0.3"/>
    <path d="M 12 62 L 11 72" fill="none" stroke="#4a1020" stroke-width="0.2" opacity="0.2"/>
    <circle cx="18" cy="60" r="1.2" fill="#c4a060" stroke="#a08040" stroke-width="0.3"/>
    <circle cx="18" cy="67" r="1.2" fill="#c4a060" stroke="#a08040" stroke-width="0.3"/>
    <path d="M 12 53 L 18 50 L 24 53 L 22 57 L 18 55 L 14 57 Z" fill="#f0e8e0" stroke="#d0c0b0" stroke-width="0.4"/>
    <ellipse cx="18" cy="53" rx="5" ry="1.5" fill="#8a2222" opacity="0.1"/>
    <path d="M 14 54 Q 12 52, 14 50 L 18 52 Z" fill="#cc3333" stroke="#aa2222" stroke-width="0.3"/>
    <path d="M 22 54 Q 24 52, 22 50 L 18 52 Z" fill="#cc3333" stroke="#aa2222" stroke-width="0.3"/>
    <circle cx="18" cy="52" r="1.4" fill="#dd4444" stroke="#aa2222" stroke-width="0.3"/>
    <ellipse cx="18" cy="50" rx="10" ry="4" fill="url(#aoUnderChin)"/>
    <circle cx="18" cy="36" r="17" fill="url(#furBrown)" stroke="#5a3a1a" stroke-width="1"/>
    <path d="M 3 30 Q 1 36, 3 42 Q 6 38, 6 32 Q 4 28, 3 30" fill="#5a3a1a" opacity="0.1"/>
    <path d="M 5 46 Q 18 52, 31 46 Q 27 48, 18 48 Q 9 48, 5 46" fill="#5a3a1a" opacity="0.06"/>
    <ellipse cx="16" cy="30" rx="5" ry="3" fill="url(#specHighlight)"/>
    <path d="M 8 20 Q 10 14, 14 20 Q 16 12, 18 18 Q 20 12, 22 20 Q 24 14, 28 20" fill="url(#furBrown)" stroke="#5a3a1a" stroke-width="0.6"/>
    <path d="M 2 34 Q -1 30, 1 26" fill="none" stroke="#7a5838" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M 34 34 Q 37 30, 35 26" fill="none" stroke="#7a5838" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M 12 28 Q 16 26, 20 28" fill="none" stroke="#c8a078" stroke-width="0.6" opacity="0.2"/>
    <path d="M 5,26 Q 1,14 -1,6 Q 3,12 15,22" fill="url(#furBrown)" stroke="#5a3a1a" stroke-width="1"/>
    <path d="M 7,24 Q 4,16 3,10 Q 5,14 13,22" fill="#e0a898" opacity="0.45"/>
    <ellipse cx="9" cy="24" rx="3" ry="2" fill="url(#aoEarBase)"/>
    <path d="M 2 10 Q 4 7, 3 5" fill="none" stroke="#7a5838" stroke-width="0.8" stroke-linecap="round"/>
    <path d="M 31,26 Q 35,14 37,6 Q 33,12 21,22" fill="url(#furBrown)" stroke="#5a3a1a" stroke-width="1"/>
    <path d="M 29,24 Q 32,16 33,10 Q 31,14 23,22" fill="#e0a898" opacity="0.45"/>
    <ellipse cx="27" cy="24" rx="3" ry="2" fill="url(#aoEarBase)"/>
    <path d="M 34 10 Q 32 7, 33 5" fill="none" stroke="#7a5838" stroke-width="0.8" stroke-linecap="round"/>
    <ellipse cx="12" cy="35" rx="3.5" ry="4.2" fill="white" stroke="#5a4030" stroke-width="0.5"/>
    <path d="M 8.5 32 Q 12 31, 15.5 32" fill="#5a4030" opacity="0.06"/>
    <ellipse cx="12" cy="35.5" rx="3" ry="3.5" fill="#b89030" opacity="0.15"/>
    <ellipse cx="12" cy="36" rx="2.8" ry="3.3" fill="url(#irisAmber)"/>
    <ellipse cx="12" cy="36.5" rx="1.8" ry="2.2" fill="#2a1a0a"/>
    <circle cx="10.5" cy="34.5" r="1.2" fill="white" opacity="0.9"/>
    <circle cx="13.5" cy="37" r="0.6" fill="white" opacity="0.5"/>
    <circle cx="13" cy="38" r="0.3" fill="white" opacity="0.3"/>
    <path d="M 8.5 31 Q 10.5 30, 13 31.5" fill="none" stroke="#5a3a1a" stroke-width="1.1" stroke-linecap="round"/>
    <ellipse cx="24" cy="35" rx="3.5" ry="4.2" fill="white" stroke="#5a4030" stroke-width="0.5"/>
    <path d="M 20.5 32 Q 24 31, 27.5 32" fill="#5a4030" opacity="0.06"/>
    <ellipse cx="24" cy="35.5" rx="3" ry="3.5" fill="#b89030" opacity="0.15"/>
    <ellipse cx="24" cy="36" rx="2.8" ry="3.3" fill="url(#irisAmber)"/>
    <ellipse cx="24" cy="36.5" rx="1.8" ry="2.2" fill="#2a1a0a"/>
    <circle cx="22.5" cy="34.5" r="1.2" fill="white" opacity="0.9"/>
    <circle cx="25.5" cy="37" r="0.6" fill="white" opacity="0.5"/>
    <circle cx="25" cy="38" r="0.3" fill="white" opacity="0.3"/>
    <path d="M 21.5 31.5 Q 24 30, 27 31" fill="none" stroke="#5a3a1a" stroke-width="1.1" stroke-linecap="round"/>
    <ellipse cx="7" cy="40" rx="3.5" ry="2" fill="url(#blushMark)"/>
    <ellipse cx="29" cy="40" rx="3.5" ry="2" fill="url(#blushMark)"/>
    <path d="M 17 42 L 18 40.5 L 19 42 Z" fill="#d8a090"/>
    <path d="M 15.5 43 Q 18 45, 20.5 43" fill="none" stroke="#5a3a1a" stroke-width="0.6"/>
    <line x1="1" y1="39" x2="10" y2="40" stroke="#8a7060" stroke-width="0.4" opacity="0.3"/>
    <line x1="0" y1="42" x2="10" y2="41" stroke="#8a7060" stroke-width="0.4" opacity="0.3"/>
    <line x1="26" y1="40" x2="35" y2="39" stroke="#8a7060" stroke-width="0.4" opacity="0.3"/>
    <line x1="26" y1="41" x2="36" y2="42" stroke="#8a7060" stroke-width="0.4" opacity="0.3"/>
    <path d="M 32 28 Q 34 34, 32 42" fill="none" stroke="#fff8e0" stroke-width="0.8" opacity="0.2"/>
    <path d="M 30 52 Q 32 62, 30 72" fill="none" stroke="#fff8e0" stroke-width="0.6" opacity="0.15"/>
    <g>
      <ellipse cx="30" cy="62" rx="5.5" ry="3.5" fill="url(#furBrown)" stroke="#5a3a1a" stroke-width="0.8"/>
      <circle cx="28.5" cy="61" r="0.7" fill="#d8a898" opacity="0.5"/>
      <circle cx="30.5" cy="60.5" r="0.7" fill="#d8a898" opacity="0.5"/>
      <circle cx="32.5" cy="61" r="0.7" fill="#d8a898" opacity="0.5"/>
      <ellipse cx="42" cy="62" rx="5.5" ry="3.5" fill="url(#furBrown)" stroke="#5a3a1a" stroke-width="0.8"/>
      <circle cx="40" cy="61" r="0.7" fill="#d8a898" opacity="0.5"/>
      <circle cx="42" cy="60.5" r="0.7" fill="#d8a898" opacity="0.5"/>
      <circle cx="44" cy="61" r="0.7" fill="#d8a898" opacity="0.5"/>
    </g>
    <rect x="57" y="56" width="8" height="8" rx="1.5" fill="#c4a060" stroke="#a08040" stroke-width="0.6"/>
    <line x1="57" y1="56.5" x2="65" y2="56.5" stroke="#e8d090" stroke-width="0.5" opacity="0.4"/>
    <path d="M 65 57.5 Q 68 59.5, 65 63" fill="none" stroke="#a08040" stroke-width="1"/>
    <ellipse cx="61" cy="56" rx="4" ry="1.8" fill="#fff8e0" stroke="#c4a060" stroke-width="0.3"/>
    <g>
      <path d="M 59 54 Q 60 51, 59 48" fill="none" stroke="#e8ddd0" stroke-width="0.6" opacity="0.3"/>
      <path d="M 62 54.5 Q 63 51, 62 47" fill="none" stroke="#e8ddd0" stroke-width="0.6" opacity="0.25"/>
    </g>
  </g>`,
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
