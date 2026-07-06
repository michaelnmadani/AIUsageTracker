/**
 * Hand-crafted SVG artwork for the cozy room background.
 *
 * The room is authored as a single SVG (with real gradients, soft blurred
 * shadows and baked light pools) and rasterized once to a texture — the same
 * pipeline the cats use. This gives painterly game-art quality that stacked
 * Graphics primitives can never reach, while staying fully procedural.
 *
 * Logical scene is 400x400. The SVG is drawn with a bleed margin on every
 * side so uniform-scale letterboxing never shows a hard edge.
 */

/** Extra art drawn beyond every scene edge (logical px) */
export const ROOM_BLEED = 16;

/** Wall/floor split line (logical px) — cats' feet land at/below this */
export const WALL_BOTTOM_Y = 150;

// ---------------------------------------------------------------------------
// Small generators for repetitive detail
// ---------------------------------------------------------------------------

/** Wood floor planks: horizontal boards with staggered joints + grain */
function floorPlanks(): string {
  let s = '';
  const rows: number[] = [];
  for (let y = 150; y <= 420; y += 26) rows.push(y);

  // Per-board tonal variation (subtle warm/cool alternation)
  rows.forEach((y, i) => {
    const tone = i % 3 === 0 ? '#8a5a34' : i % 3 === 1 ? '#ffffff' : '#5f3a1e';
    const op = i % 3 === 1 ? 0.045 : 0.06;
    s += `<rect x="-16" y="${y}" width="432" height="26" fill="${tone}" opacity="${op}"/>`;
  });

  // Board seams
  rows.forEach((y) => {
    s += `<line x1="-16" y1="${y}" x2="416" y2="${y}" stroke="#71481f" stroke-width="1.4" opacity="0.45"/>`;
    s += `<line x1="-16" y1="${y + 1.2}" x2="416" y2="${y + 1.2}" stroke="#e8b97f" stroke-width="0.8" opacity="0.25"/>`;
  });

  // Staggered vertical joints
  const joints = [
    [70, 150], [250, 150], [360, 150],
    [140, 176], [310, 176], [30, 176],
    [90, 202], [220, 202], [380, 202],
    [170, 228], [330, 228], [50, 228],
    [110, 254], [270, 254],
    [200, 280], [370, 280], [40, 280],
    [140, 306], [300, 306],
    [80, 332], [240, 332], [390, 332],
    [180, 358], [340, 358], [20, 358],
    [120, 384], [280, 384],
  ];
  for (const [x, y] of joints) {
    s += `<line x1="${x}" y1="${y + 1}" x2="${x}" y2="${y + 25}" stroke="#71481f" stroke-width="1.2" opacity="0.4"/>`;
  }

  // Sparse wood grain strokes
  const grain = [
    [30, 162, 60], [180, 190, 50], [320, 166, 44], [90, 242, 56],
    [250, 268, 48], [30, 320, 40], [350, 296, 52], [150, 372, 60], [300, 398, 46],
  ];
  for (const [x, y, w] of grain) {
    s += `<path d="M ${x} ${y} q ${w / 2} -2.5, ${w} 0" fill="none" stroke="#5f3a1e" stroke-width="1" opacity="0.14"/>`;
    s += `<path d="M ${x + 8} ${y + 4} q ${w / 3} 2, ${w * 0.7} 0" fill="none" stroke="#5f3a1e" stroke-width="0.7" opacity="0.1"/>`;
  }
  return s;
}

/** A row of books for shelves: [x, width, height, color, lean?] */
function books(x0: number, yBottom: number, specs: Array<[number, number, string, number?]>): string {
  let s = '';
  let x = x0;
  for (const [w, h, color, lean] of specs) {
    const rot = lean ? ` transform="rotate(${lean} ${x + w / 2} ${yBottom})"` : '';
    s += `<g${rot}>`;
    s += `<rect x="${x}" y="${yBottom - h}" width="${w}" height="${h}" rx="1" fill="${color}"/>`;
    s += `<rect x="${x}" y="${yBottom - h}" width="${w}" height="${h}" rx="1" fill="#000" opacity="0.12"/>`;
    s += `<rect x="${x + 0.8}" y="${yBottom - h + 0.8}" width="${w - 1.6}" height="${h - 1.6}" rx="0.8" fill="${color}"/>`;
    s += `<rect x="${x + 1.5}" y="${yBottom - h + 3}" width="${w - 3}" height="1.2" fill="#f7ecd7" opacity="0.55"/>`;
    s += `<rect x="${x + 1.5}" y="${yBottom - 5}" width="${w - 3}" height="1.2" fill="#f7ecd7" opacity="0.35"/>`;
    s += `</g>`;
    x += w + 1.4;
  }
  return s;
}

/** String lights: sagging wire + glowing bulbs across the top of the wall */
function stringLights(): string {
  const bulbColors = ['#ffd98a', '#ffb3a0', '#c9e4a0', '#a8d8e8'];
  let s = `<path d="M -16 10 Q 100 34, 200 24 Q 300 14, 416 30" fill="none" stroke="#7a5a40" stroke-width="1.4" opacity="0.8"/>`;
  // Sample points roughly along the curve
  const pts: Array<[number, number]> = [
    [12, 15], [52, 22], [92, 27], [132, 28], [172, 27], [212, 23],
    [252, 20], [292, 18], [332, 19], [372, 23],
  ];
  pts.forEach(([x, y], i) => {
    const c = bulbColors[i % bulbColors.length];
    s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 4}" stroke="#7a5a40" stroke-width="1" opacity="0.7"/>`;
    s += `<circle cx="${x}" cy="${y + 7}" r="6.5" fill="${c}" opacity="0.16"/>`;
    s += `<circle cx="${x}" cy="${y + 7}" r="3" fill="${c}"/>`;
    s += `<circle cx="${x - 1}" cy="${y + 6}" r="1" fill="#fffdf4" opacity="0.85"/>`;
  });
  return s;
}

/** Decorative diamonds around the rug's mid ring */
function rugDiamonds(cx: number, cy: number, rx: number, ry: number, n: number): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;
    s += `<rect x="${(x - 4).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="8" height="8" fill="#ecd9b0" opacity="0.85" transform="rotate(45 ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    s += `<rect x="${(x - 2).toFixed(1)}" y="${(y - 2).toFixed(1)}" width="4" height="4" fill="#cf7f6d" opacity="0.9" transform="rotate(45 ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  return s;
}

// ---------------------------------------------------------------------------
// The room
// ---------------------------------------------------------------------------

export function buildRoomSvg(): string {
  const B = ROOM_BLEED;
  const size = 400 + B * 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-B} ${-B} ${size} ${size}">
<defs>
  <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f9e9cd"/>
    <stop offset="55%" stop-color="#f3ddba"/>
    <stop offset="100%" stop-color="#e9cba0"/>
  </linearGradient>
  <linearGradient id="chimneyGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f2d9b1"/>
    <stop offset="100%" stop-color="#e3c193"/>
  </linearGradient>
  <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#d3a069"/>
    <stop offset="45%" stop-color="#bd8752"/>
    <stop offset="100%" stop-color="#9c6a3c"/>
  </linearGradient>
  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fff8d8"/>
    <stop offset="55%" stop-color="#ffe1a0"/>
    <stop offset="100%" stop-color="#ffc97e"/>
  </linearGradient>
  <linearGradient id="curtainGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#e29a85"/>
    <stop offset="55%" stop-color="#d68a74"/>
    <stop offset="100%" stop-color="#c1745f"/>
  </linearGradient>
  <linearGradient id="counterGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#a97a50"/>
    <stop offset="100%" stop-color="#8a5c38"/>
  </linearGradient>
  <linearGradient id="brickGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#c07a56"/>
    <stop offset="100%" stop-color="#9e5e40"/>
  </linearGradient>
  <radialGradient id="fireboxGrad" cx="50%" cy="78%" r="75%">
    <stop offset="0%" stop-color="#6e3413"/>
    <stop offset="45%" stop-color="#401f0d"/>
    <stop offset="100%" stop-color="#1d100a"/>
  </radialGradient>
  <radialGradient id="emberGlow" cx="50%" cy="60%" r="55%">
    <stop offset="0%" stop-color="#ffd97a" stop-opacity="0.95"/>
    <stop offset="45%" stop-color="#ff9838" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#ff7a26" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="mantelGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f0dcb8"/>
    <stop offset="100%" stop-color="#d5b787"/>
  </linearGradient>
  <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#a9754c"/>
    <stop offset="100%" stop-color="#875836"/>
  </linearGradient>
  <linearGradient id="chairGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#d18374"/>
    <stop offset="100%" stop-color="#b2604f"/>
  </linearGradient>
  <radialGradient id="rugGrad" cx="50%" cy="42%" r="72%">
    <stop offset="0%" stop-color="#5d968b"/>
    <stop offset="70%" stop-color="#4d8177"/>
    <stop offset="100%" stop-color="#3f6d64"/>
  </radialGradient>
  <linearGradient id="lampShadeGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f5cf76"/>
    <stop offset="100%" stop-color="#dfa63f"/>
  </linearGradient>
  <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#c97e54"/>
    <stop offset="100%" stop-color="#9d5836"/>
  </linearGradient>
  <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#74a35a"/>
    <stop offset="100%" stop-color="#48713a"/>
  </linearGradient>
  <radialGradient id="poolGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffdf9e" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#ffdf9e" stop-opacity="0"/>
  </radialGradient>
  <pattern id="wallpaper" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
    <rect x="12" y="12" width="4.4" height="4.4" fill="#d8b184" opacity="0.55" transform="rotate(45 14.2 14.2)"/>
    <circle cx="0" cy="0" r="1.1" fill="#cfa878" opacity="0.4"/>
    <circle cx="28" cy="0" r="1.1" fill="#cfa878" opacity="0.4"/>
    <circle cx="0" cy="28" r="1.1" fill="#cfa878" opacity="0.4"/>
    <circle cx="28" cy="28" r="1.1" fill="#cfa878" opacity="0.4"/>
  </pattern>
  <filter id="soft6" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="soft3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="soft1" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.2"/></filter>
</defs>

<!-- ======================= WALL ======================= -->
<rect x="${-B}" y="${-B}" width="${size}" height="${166 + B}" fill="url(#wallGrad)"/>
<rect x="${-B}" y="12" width="${size}" height="128" fill="url(#wallpaper)"/>
<!-- side falloff so the wall doesn't read flat -->
<rect x="${-B}" y="${-B}" width="70" height="${166 + B}" fill="#8a5a34" opacity="0.07"/>
<rect x="346" y="${-B}" width="70" height="${166 + B}" fill="#8a5a34" opacity="0.09"/>
<!-- crown molding -->
<rect x="${-B}" y="${-B}" width="${size}" height="${B + 9}" fill="#f8efdd"/>
<rect x="${-B}" y="7" width="${size}" height="2" fill="#d9c19a"/>
<rect x="${-B}" y="9" width="${size}" height="4" fill="#5f3a1e" opacity="0.1"/>

<!-- ======================= WINDOW (golden hour) ======================= -->
<g>
  <rect x="18" y="16" width="90" height="84" rx="6" fill="#8a5a34" opacity="0.18" filter="url(#soft3)"/>
  <rect x="20" y="16" width="84" height="80" rx="5" fill="#b98a5c"/>
  <rect x="24" y="20" width="76" height="72" rx="3" fill="#faf1de"/>
  <rect x="28" y="24" width="68" height="64" rx="2" fill="url(#skyGrad)"/>
  <!-- sun + glow -->
  <circle cx="76" cy="46" r="15" fill="#fff3b8" opacity="0.55"/>
  <circle cx="76" cy="46" r="8.5" fill="#fffbe2"/>
  <!-- distant hills -->
  <path d="M 28 76 Q 44 62, 60 74 Q 74 84, 96 72 L 96 88 L 28 88 Z" fill="#e8a55e" opacity="0.75"/>
  <path d="M 28 82 Q 48 72, 68 82 Q 82 88, 96 80 L 96 88 L 28 88 Z" fill="#d18b4a" opacity="0.8"/>
  <!-- birds -->
  <path d="M 42 38 q 2.5 -2.4 5 0 M 47 38 q 2.5 -2.4 5 0" fill="none" stroke="#8a6136" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 36 48 q 2 -2 4 0 M 40 48 q 2 -2 4 0" fill="none" stroke="#8a6136" stroke-width="0.9" stroke-linecap="round" opacity="0.8"/>
  <!-- mullions -->
  <rect x="59.5" y="20" width="5" height="72" fill="#faf1de"/>
  <rect x="24" y="52.5" width="76" height="5" fill="#faf1de"/>
  <rect x="60.5" y="21" width="3" height="70" fill="#e3d3b4"/>
  <rect x="25" y="53.5" width="74" height="3" fill="#e3d3b4"/>
  <!-- glass shine -->
  <path d="M 32 24 L 46 24 L 28 62 L 28 38 Z" fill="#ffffff" opacity="0.18"/>
  <!-- sill + plant -->
  <rect x="16" y="96" width="92" height="7" rx="2.5" fill="#c99a68"/>
  <rect x="16" y="101" width="92" height="2" rx="1" fill="#8a5a34" opacity="0.5"/>
  <!-- curtain rod + curtains -->
  <rect x="8" y="10" width="110" height="3.4" rx="1.7" fill="#8a5f3d"/>
  <circle cx="8" cy="11.7" r="3" fill="#a77a4c"/><circle cx="118" cy="11.7" r="3" fill="#a77a4c"/>
  <path d="M 12 13 Q 8 55, 4 96 L 26 96 Q 20 54, 24 13 Z" fill="url(#curtainGrad)"/>
  <path d="M 17 14 Q 14 55, 12 94 L 18 94 Q 17 54, 21 14 Z" fill="#c1745f" opacity="0.55"/>
  <path d="M 24 13 Q 20 54, 26 96 L 20 96 Q 16 54, 18 13 Z" fill="#f0b39c" opacity="0.35"/>
  <path d="M 112 13 Q 116 55, 120 96 L 98 96 Q 104 54, 100 13 Z" fill="url(#curtainGrad)"/>
  <path d="M 107 14 Q 110 55, 112 94 L 106 94 Q 107 54, 103 14 Z" fill="#c1745f" opacity="0.55"/>
  <path d="M 100 13 Q 104 54, 98 96 L 104 96 Q 108 54, 106 13 Z" fill="#f0b39c" opacity="0.35"/>
</g>

<!-- ======================= BETWEEN WINDOW & FIREPLACE ======================= -->
<!-- hanging plant -->
<g>
  <line x1="128" y1="9" x2="128" y2="26" stroke="#8a6a48" stroke-width="1.2"/>
  <path d="M 120 30 Q 128 24, 136 30 L 134 40 Q 128 44, 122 40 Z" fill="url(#potGrad)"/>
  <path d="M 120 30 Q 128 34, 136 30" fill="none" stroke="#7c4227" stroke-width="1.2"/>
  <path d="M 121 34 q -6 10, -3 22 M 124 38 q -2 12, 2 20 M 133 34 q 6 9, 4 20 M 130 38 q 3 10, -1 18"
        fill="none" stroke="#5f8f4e" stroke-width="2" stroke-linecap="round"/>
  <circle cx="118" cy="52" r="2.4" fill="#6fa055"/><circle cx="121" cy="60" r="2.2" fill="#77a75e"/>
  <circle cx="126" cy="58" r="2" fill="#5f8f4e"/><circle cx="137" cy="50" r="2.4" fill="#6fa055"/>
  <circle cx="134" cy="58" r="2.1" fill="#77a75e"/><circle cx="129" cy="64" r="1.9" fill="#5f8f4e"/>
</g>
<!-- little round frame -->
<g>
  <circle cx="128" cy="88" r="11" fill="#b98a5c"/>
  <circle cx="128" cy="88" r="8.6" fill="#f6ead2"/>
  <circle cx="128" cy="90" r="4" fill="#d18b6a"/>
  <path d="M 124.5 87.5 L 123 83 L 126 86 Z M 131.5 87.5 L 133 83 L 130 86 Z" fill="#d18b6a"/>
</g>

<!-- ======================= FIREPLACE (center) ======================= -->
<!-- chimney breast -->
<rect x="148" y="${-B}" width="104" height="${166 + B}" fill="url(#chimneyGrad)"/>
<rect x="148" y="${-B}" width="3" height="${166 + B}" fill="#5f3a1e" opacity="0.14"/>
<rect x="249" y="${-B}" width="3" height="${166 + B}" fill="#5f3a1e" opacity="0.18"/>
<!-- framed cat portrait above the mantel -->
<g>
  <rect x="176" y="18" width="48" height="42" rx="3" fill="#8a5a34" opacity="0.25" filter="url(#soft3)"/>
  <rect x="176" y="16" width="48" height="42" rx="3" fill="#c9a05a"/>
  <rect x="180" y="20" width="40" height="34" rx="2" fill="#f6ead2"/>
  <rect x="182" y="22" width="36" height="30" rx="1.5" fill="#e8d3ae"/>
  <circle cx="200" cy="40" r="9" fill="#a9764a"/>
  <path d="M 193 34 L 190 26 L 197 31 Z M 207 34 L 210 26 L 203 31 Z" fill="#a9764a"/>
  <circle cx="196.5" cy="39" r="1.1" fill="#3a2414"/><circle cx="203.5" cy="39" r="1.1" fill="#3a2414"/>
  <path d="M 198.8 42.5 q 1.2 1.2 2.4 0" fill="none" stroke="#3a2414" stroke-width="0.8"/>
  <ellipse cx="194" cy="42" rx="1.6" ry="0.9" fill="#e08a7a" opacity="0.6"/>
  <ellipse cx="206" cy="42" rx="1.6" ry="0.9" fill="#e08a7a" opacity="0.6"/>
</g>
<!-- brick surround -->
<rect x="156" y="46" width="88" height="104" rx="4" fill="url(#brickGrad)"/>
<g opacity="0.4">
  <line x1="156" y1="60" x2="244" y2="60" stroke="#7c4227" stroke-width="1.2"/>
  <line x1="156" y1="74" x2="244" y2="74" stroke="#7c4227" stroke-width="1.2"/>
  <line x1="156" y1="102" x2="172" y2="102" stroke="#7c4227" stroke-width="1.2"/>
  <line x1="228" y1="102" x2="244" y2="102" stroke="#7c4227" stroke-width="1.2"/>
  <line x1="156" y1="116" x2="172" y2="116" stroke="#7c4227" stroke-width="1.2"/>
  <line x1="228" y1="116" x2="244" y2="116" stroke="#7c4227" stroke-width="1.2"/>
  <line x1="156" y1="130" x2="172" y2="130" stroke="#7c4227" stroke-width="1.2"/>
  <line x1="228" y1="130" x2="244" y2="130" stroke="#7c4227" stroke-width="1.2"/>
  <line x1="178" y1="53" x2="178" y2="60" stroke="#7c4227" stroke-width="1"/>
  <line x1="200" y1="46" x2="200" y2="53" stroke="#7c4227" stroke-width="1"/>
  <line x1="222" y1="53" x2="222" y2="60" stroke="#7c4227" stroke-width="1"/>
  <line x1="190" y1="60" x2="190" y2="67" stroke="#7c4227" stroke-width="1"/>
  <line x1="212" y1="60" x2="212" y2="67" stroke="#7c4227" stroke-width="1"/>
  <line x1="164" y1="108" x2="164" y2="116" stroke="#7c4227" stroke-width="1"/>
  <line x1="236" y1="108" x2="236" y2="116" stroke="#7c4227" stroke-width="1"/>
</g>
<rect x="156" y="46" width="88" height="6" fill="#ffffff" opacity="0.12"/>
<!-- mantel shelf -->
<rect x="150" y="72" width="100" height="11" rx="2.5" fill="url(#mantelGrad)"/>
<rect x="150" y="81" width="100" height="2.4" rx="1.2" fill="#8a5a34" opacity="0.55"/>
<rect x="152" y="83" width="96" height="4" fill="#5f3a1e" opacity="0.14"/>
<!-- mantel decor: candle, tiny plant, snoozing-cat figurine -->
<g>
  <rect x="160" y="60" width="7" height="12" rx="2" fill="#f2e2c4"/>
  <ellipse cx="163.5" cy="58.5" rx="2.2" ry="3.2" fill="#ffca5f"/>
  <ellipse cx="163.5" cy="57.8" rx="1" ry="1.7" fill="#fff3c0"/>
  <circle cx="163.5" cy="58" r="5.5" fill="#ffca5f" opacity="0.22"/>
  <path d="M 232 62 q -3 -8, 2 -12 M 232 62 q 3 -7, -1 -12 M 232 62 q 0 -9, 4 -11" stroke="#5f8f4e" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M 226 62 Q 232 58, 238 62 L 236 70 Q 232 72, 228 70 Z" fill="#7a9ec9"/>
  <ellipse cx="205" cy="68" rx="7" ry="4" fill="#c9c2b8"/>
  <circle cx="210" cy="65.5" r="3" fill="#c9c2b8"/>
  <path d="M 208 63.5 L 207.2 61.4 L 209.4 62.6 Z M 212 63.5 L 212.8 61.4 L 210.6 62.6 Z" fill="#c9c2b8"/>
  <path d="M 209 66 q 1 0.8 2 0" fill="none" stroke="#6a6258" stroke-width="0.6"/>
</g>
<!-- firebox -->
<path d="M 170 150 L 170 104 Q 170 88, 200 88 Q 230 88, 230 104 L 230 150 Z" fill="#5f3a1e"/>
<path d="M 173 150 L 173 106 Q 173 91, 200 91 Q 227 91, 227 106 L 227 150 Z" fill="url(#fireboxGrad)"/>
<!-- baked ember bed + glow (animated flames render on top at runtime) -->
<ellipse cx="200" cy="132" rx="26" ry="18" fill="url(#emberGlow)"/>
<rect x="182" y="136" width="36" height="5" rx="2.5" fill="#4a2410" transform="rotate(-4 200 138)"/>
<rect x="184" y="140" width="34" height="5" rx="2.5" fill="#3a1c0c" transform="rotate(3 200 142)"/>
<circle cx="190" cy="139" r="1.4" fill="#ffb35f" opacity="0.9"/>
<circle cx="207" cy="142" r="1.2" fill="#ff9838" opacity="0.8"/>
<circle cx="199" cy="144" r="1" fill="#ffd97a" opacity="0.7"/>
<!-- hearth stone -->
<rect x="158" y="146" width="84" height="12" rx="4" fill="#ddc69e"/>
<rect x="158" y="154" width="84" height="4" rx="2" fill="#8a5a34" opacity="0.35"/>
<!-- log basket -->
<g>
  <ellipse cx="264" cy="150" rx="16" ry="4" fill="#5f3a1e" opacity="0.22" filter="url(#soft3)"/>
  <path d="M 250 128 L 254 150 L 274 150 L 278 128 Z" fill="#b08954"/>
  <path d="M 250 128 L 254 150 L 274 150 L 278 128 Z" fill="none" stroke="#8a6136" stroke-width="1.2"/>
  <line x1="252" y1="134" x2="276" y2="134" stroke="#8a6136" stroke-width="1" opacity="0.7"/>
  <line x1="253" y1="141" x2="275" y2="141" stroke="#8a6136" stroke-width="1" opacity="0.7"/>
  <circle cx="259" cy="126" r="4.6" fill="#8a5c38"/><circle cx="259" cy="126" r="2.3" fill="#c9a06e"/>
  <circle cx="269" cy="125" r="4.2" fill="#7c5230"/><circle cx="269" cy="125" r="2" fill="#bd946a"/>
</g>

<!-- ======================= CLOCK ======================= -->
<g>
  <circle cx="272" cy="38" r="13.5" fill="#8a5f3d"/>
  <circle cx="272" cy="38" r="11" fill="#f6ead2"/>
  <circle cx="272" cy="38" r="1.4" fill="#5a4632"/>
  <line x1="272" y1="38" x2="272" y2="30.5" stroke="#5a4632" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="272" y1="38" x2="277.5" y2="41" stroke="#5a4632" stroke-width="1.2" stroke-linecap="round"/>
  <g stroke="#a08a68" stroke-width="1">
    <line x1="272" y1="28.6" x2="272" y2="30.6"/><line x1="272" y1="45.4" x2="272" y2="47.4"/>
    <line x1="262.6" y1="38" x2="264.6" y2="38"/><line x1="279.4" y1="38" x2="281.4" y2="38"/>
  </g>
</g>

<!-- ======================= DESK NOOK (right) ======================= -->
<!-- wall shelf with books + plant -->
<g>
  <rect x="294" y="56" width="92" height="6" rx="2" fill="#a9754c"/>
  <rect x="294" y="60" width="92" height="2.4" fill="#5f3a1e" opacity="0.35"/>
  <path d="M 300 62 l 4 7 h -8 Z M 376 62 l 4 7 h -8 Z" fill="#8a5f3d"/>
  ${books(300, 56, [[7, 20, '#b55a4e'], [6, 16, '#557d8a'], [8, 22, '#c9973f'], [6, 15, '#6d8f5a', -7], [7, 19, '#8a5a7a'], [6, 17, '#4f6d9d']])}
  <path d="M 366 50 q -2 -7, 3 -10 M 366 50 q 3 -6, -1 -10 M 366 50 q 1 -8, 5 -8" stroke="#5f8f4e" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M 361 50 Q 366 47, 371 50 L 370 56 Q 366 58, 362 56 Z" fill="#c96f5c"/>
</g>
<!-- pinned notes -->
<g>
  <rect x="300" y="74" width="13" height="13" fill="#f7e9a8" transform="rotate(-5 306 80)"/>
  <rect x="320" y="80" width="12" height="12" fill="#bfe3d9" transform="rotate(4 326 86)"/>
  <rect x="341" y="72" width="13" height="13" fill="#f3c5b8" transform="rotate(-3 347 78)"/>
  <circle cx="306" cy="76" r="1.2" fill="#c9564a"/>
  <circle cx="326" cy="82" r="1.2" fill="#4a7ac9"/>
  <circle cx="347" cy="74" r="1.2" fill="#c9a03f"/>
  <g stroke="#9a8a6a" stroke-width="0.7" opacity="0.6">
    <line x1="302" y1="80" x2="310" y2="79.5"/><line x1="302" y1="83" x2="309" y2="82.6"/>
    <line x1="322" y1="86" x2="330" y2="86.5"/><line x1="322" y1="89" x2="328" y2="89.3"/>
    <line x1="343" y1="78" x2="351" y2="77.6"/><line x1="343" y1="81" x2="350" y2="80.7"/>
  </g>
</g>
<!-- desk -->
<g>
  <rect x="288" y="106" width="106" height="9" rx="3" fill="url(#deskGrad)"/>
  <rect x="288" y="106" width="106" height="2.4" rx="1.2" fill="#c99a68"/>
  <rect x="290" y="115" width="102" height="6" fill="#7c4e2d"/>
  <rect x="294" y="121" width="7" height="30" rx="1.5" fill="#7c4e2d"/>
  <rect x="381" y="121" width="7" height="30" rx="1.5" fill="#6e4427"/>
  <rect x="294" y="121" width="2" height="30" fill="#a9754c" opacity="0.6"/>
  <!-- mug + papers -->
  <rect x="296" y="98" width="9" height="8.5" rx="1.5" fill="#b55a4e"/>
  <path d="M 305 100 q 4 1.5, 0 4.5" fill="none" stroke="#b55a4e" stroke-width="1.6"/>
  <rect x="296.8" y="98.6" width="7.4" height="2" fill="#7c3a32"/>
  <rect x="352" y="100" width="18" height="6" rx="1" fill="#f2e8d4" transform="rotate(-3 361 103)"/>
  <rect x="354" y="103" width="18" height="6" rx="1" fill="#e8dcc2" transform="rotate(2 363 106)"/>
  <!-- desk lamp -->
  <ellipse cx="374" cy="106" rx="8" ry="2.4" fill="#8a5a34" opacity="0.35"/>
  <rect x="370" y="102" width="8" height="4" rx="2" fill="#b58a4e"/>
  <path d="M 374 102 Q 372 92, 366 88" fill="none" stroke="#b58a4e" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M 356 84 L 372 84 L 367 94 L 359 94 Z" fill="url(#lampShadeGrad)" transform="rotate(18 364 89)"/>
  <ellipse cx="362" cy="95" rx="9" ry="5" fill="#ffe9ad" opacity="0.4"/>
</g>

<!-- ======================= BASEBOARD & FLOOR ======================= -->
<rect x="${-B}" y="140" width="${size}" height="10" fill="#bc8d5d"/>
<rect x="${-B}" y="140" width="${size}" height="2" fill="#dcae7c"/>
<rect x="${-B}" y="148" width="${size}" height="2" fill="#8a5a34" opacity="0.6"/>
<rect x="${-B}" y="150" width="${size}" height="${266 + B}" fill="url(#floorGrad)"/>
${floorPlanks()}
<!-- contact shadow along the wall -->
<rect x="${-B}" y="150" width="${size}" height="7" fill="#5f3a1e" opacity="0.22" filter="url(#soft3)"/>
<!-- baked light pools -->
<path d="M 34 150 L 122 150 L 148 268 L 10 268 Z" fill="#ffe2a0" opacity="0.20" filter="url(#soft6)"/>
<ellipse cx="200" cy="185" rx="86" ry="30" fill="url(#poolGlow)" opacity="0.6"/>
<ellipse cx="200" cy="270" rx="190" ry="110" fill="url(#poolGlow)" opacity="0.35"/>

<!-- ======================= RUG ======================= -->
<g>
  <ellipse cx="195" cy="300" rx="128" ry="57" fill="#2d4a44" opacity="0.35" filter="url(#soft3)" transform="translate(0 4)"/>
  <ellipse cx="195" cy="300" rx="128" ry="57" fill="url(#rugGrad)"/>
  <ellipse cx="195" cy="300" rx="118" ry="50" fill="none" stroke="#ecd9b0" stroke-width="3" opacity="0.9"/>
  <ellipse cx="195" cy="300" rx="108" ry="44" fill="none" stroke="#cf7f6d" stroke-width="1.6" opacity="0.7"/>
  ${rugDiamonds(195, 300, 88, 34, 10)}
  <ellipse cx="195" cy="300" rx="30" ry="13" fill="#ecd9b0" opacity="0.9"/>
  <ellipse cx="195" cy="300" rx="20" ry="8.5" fill="#cf7f6d"/>
  <ellipse cx="195" cy="300" rx="9" ry="4" fill="#47776e"/>
  <!-- fringe -->
  <g stroke="#ecd9b0" stroke-width="1.6" opacity="0.85" stroke-linecap="round">
    <line x1="66" y1="292" x2="59" y2="290"/><line x1="64" y1="300" x2="56" y2="300"/>
    <line x1="66" y1="308" x2="59" y2="310"/><line x1="70" y1="316" x2="64" y2="320"/>
    <line x1="324" y1="292" x2="331" y2="290"/><line x1="326" y1="300" x2="334" y2="300"/>
    <line x1="324" y1="308" x2="331" y2="310"/><line x1="320" y1="316" x2="326" y2="320"/>
  </g>
</g>

<!-- ======================= KITCHEN COUNTER (left, behind cooking cat) ======================= -->
<g>
  <ellipse cx="50" cy="152" rx="52" ry="7" fill="#5f3a1e" opacity="0.3" filter="url(#soft3)"/>
  <rect x="2" y="104" width="94" height="46" rx="3" fill="url(#counterGrad)"/>
  <rect x="8" y="112" width="38" height="32" rx="2.5" fill="#7c4e2d"/>
  <rect x="50" y="112" width="38" height="32" rx="2.5" fill="#7c4e2d"/>
  <rect x="10" y="114" width="34" height="28" rx="2" fill="#96613c"/>
  <rect x="52" y="114" width="34" height="28" rx="2" fill="#96613c"/>
  <circle cx="41" cy="128" r="2" fill="#e5c890"/>
  <circle cx="55" cy="128" r="2" fill="#e5c890"/>
  <rect x="0" y="98" width="98" height="9" rx="3" fill="#f0e2c6"/>
  <rect x="0" y="104" width="98" height="2.6" fill="#c9ae82"/>
  <!-- items on the counter -->
  <rect x="8" y="88" width="16" height="10" rx="1.5" fill="#c9a06e"/>
  <line x1="10" y1="92" x2="22" y2="92" stroke="#a07846" stroke-width="0.9" opacity="0.8"/>
  <rect x="30" y="84" width="10" height="14" rx="2" fill="#9db4c9"/>
  <rect x="31.5" y="81.5" width="7" height="3.5" rx="1.2" fill="#7c93a8"/>
  <ellipse cx="35" cy="90" rx="3" ry="4" fill="#c9dcec" opacity="0.5"/>
  <rect x="76" y="86" width="12" height="12" rx="2" fill="#c96f5c"/>
  <ellipse cx="82" cy="86" rx="5" ry="2" fill="#e8a55e"/>
  <path d="M 80 83 q 2 -3 4 0" fill="none" stroke="#5f8f4e" stroke-width="1.4"/>
</g>

<!-- ======================= READING NOOK (mid-right) ======================= -->
<g>
  <ellipse cx="290" cy="248" rx="56" ry="9" fill="#5f3a1e" opacity="0.3" filter="url(#soft3)"/>
  <!-- armchair -->
  <path d="M 252 246 L 252 190 Q 252 168, 290 168 Q 328 168, 328 190 L 328 246 Z" fill="url(#chairGrad)"/>
  <path d="M 258 240 L 258 196 Q 258 178, 290 178 Q 322 178, 322 196 L 322 240 Z" fill="#c47265" opacity="0.7"/>
  <!-- arms -->
  <path d="M 244 246 L 244 206 Q 244 196, 254 196 Q 263 196, 263 206 L 263 246 Z" fill="#b2604f"/>
  <path d="M 317 246 L 317 206 Q 317 196, 327 196 Q 336 196, 336 206 L 336 246 Z" fill="#a85847"/>
  <path d="M 246 208 Q 246 198, 254 198" fill="none" stroke="#e0a494" stroke-width="1.8" opacity="0.6"/>
  <!-- seat cushion -->
  <rect x="258" y="222" width="64" height="18" rx="8" fill="#e2a893"/>
  <rect x="258" y="222" width="64" height="6" rx="3" fill="#f0c0ac" opacity="0.7"/>
  <!-- mustard throw pillow -->
  <rect x="296" y="196" width="24" height="24" rx="5" fill="#d9a441" transform="rotate(-8 308 208)"/>
  <rect x="299" y="199" width="18" height="18" rx="4" fill="#e5b658" transform="rotate(-8 308 208)" opacity="0.7"/>
  <!-- feet -->
  <rect x="250" y="246" width="7" height="7" rx="2" fill="#7c4e2d"/>
  <rect x="322" y="246" width="7" height="7" rx="2" fill="#6e4427"/>
  <!-- book stack beside chair -->
  <g>
    <rect x="230" y="246" width="22" height="5.5" rx="1.5" fill="#557d8a"/>
    <rect x="232" y="240.5" width="20" height="5.5" rx="1.5" fill="#c9973f"/>
    <rect x="231" y="235" width="19" height="5.5" rx="1.5" fill="#b55a4e"/>
  </g>
</g>
<!-- floor lamp -->
<g>
  <ellipse cx="352" cy="258" rx="17" ry="4.5" fill="#5f3a1e" opacity="0.3" filter="url(#soft3)"/>
  <ellipse cx="352" cy="256" rx="12" ry="3.4" fill="#8a5f3d"/>
  <rect x="350" y="188" width="4" height="68" fill="#a77a4c"/>
  <rect x="350" y="188" width="1.4" height="68" fill="#c99a68"/>
  <path d="M 336 190 L 368 190 L 362 160 L 342 160 Z" fill="url(#lampShadeGrad)"/>
  <path d="M 336 190 L 368 190 L 366.5 186 L 337.5 186 Z" fill="#c98f2e" opacity="0.6"/>
  <ellipse cx="352" cy="192" rx="15" ry="6" fill="#ffe9ad" opacity="0.5"/>
</g>

<!-- ======================= GARDEN CORNER (bottom-left) ======================= -->
<g>
  <!-- monstera -->
  <ellipse cx="38" cy="324" rx="30" ry="6.5" fill="#5f3a1e" opacity="0.3" filter="url(#soft3)"/>
  <g stroke="#4c7a3a" stroke-width="2.6" fill="none" stroke-linecap="round">
    <path d="M 38 292 Q 30 260, 16 240"/>
    <path d="M 38 292 Q 38 252, 44 226"/>
    <path d="M 38 292 Q 48 262, 62 246"/>
  </g>
  <path d="M 16 242 Q 2 234, 4 218 Q 8 204, 22 208 Q 34 212, 30 228 Q 27 240, 16 242 Z" fill="url(#leafGrad)"/>
  <path d="M 16 240 L 12 224 M 16 240 L 22 220" stroke="#3c6130" stroke-width="1.4" opacity="0.6" fill="none"/>
  <path d="M 44 228 Q 32 216, 38 200 Q 46 188, 58 196 Q 68 204, 60 218 Q 54 228, 44 228 Z" fill="#5f8f4e"/>
  <path d="M 46 226 L 46 206 M 46 226 L 56 208" stroke="#3c6130" stroke-width="1.4" opacity="0.6" fill="none"/>
  <path d="M 62 248 Q 58 230, 72 222 Q 86 218, 90 232 Q 92 246, 78 250 Q 68 252, 62 248 Z" fill="#6fa055"/>
  <path d="M 64 246 L 74 232 M 64 246 L 80 240" stroke="#3c6130" stroke-width="1.3" opacity="0.6" fill="none"/>
  <path d="M 30 268 Q 18 262, 20 250 Q 24 240, 34 246 Q 42 252, 38 262 Q 35 268, 30 268 Z" fill="#77a75e"/>
  <path d="M 20 286 L 56 286 L 52 324 L 24 324 Z" fill="url(#potGrad)"/>
  <rect x="17" y="282" width="42" height="8" rx="2.5" fill="#c97e54"/>
  <rect x="17" y="287" width="42" height="3" rx="1.5" fill="#9d5836"/>
  <path d="M 24 292 L 27 322" stroke="#7c4227" stroke-width="1" opacity="0.35"/>
  <ellipse cx="38" cy="290" rx="16" ry="2.6" fill="#5a3d26"/>
</g>
<!-- wooden planter box with sprouts -->
<g>
  <ellipse cx="52" cy="376" rx="44" ry="7" fill="#5f3a1e" opacity="0.28" filter="url(#soft3)"/>
  <rect x="12" y="344" width="80" height="30" rx="3" fill="#a9754c"/>
  <rect x="12" y="344" width="80" height="5" rx="2.5" fill="#c99a68"/>
  <rect x="12" y="368" width="80" height="6" rx="3" fill="#7c4e2d"/>
  <line x1="38" y1="349" x2="38" y2="368" stroke="#8a6136" stroke-width="1.2" opacity="0.7"/>
  <line x1="64" y1="349" x2="64" y2="368" stroke="#8a6136" stroke-width="1.2" opacity="0.7"/>
  <rect x="16" y="340" width="72" height="6" rx="3" fill="#5a3d26"/>
  <g stroke="#5f8f4e" stroke-width="2" fill="none" stroke-linecap="round">
    <path d="M 26 340 q -1 -8, -4 -11 M 26 340 q 1 -8, 4 -11"/>
    <path d="M 50 340 q -1 -9, -5 -13 M 50 340 q 1 -9, 5 -13"/>
    <path d="M 74 340 q -1 -7, -4 -10 M 74 340 q 1 -7, 4 -10"/>
  </g>
  <circle cx="22" cy="328" r="2.6" fill="#77a75e"/><circle cx="30" cy="328" r="2.6" fill="#6fa055"/>
  <circle cx="45" cy="326" r="2.9" fill="#77a75e"/><circle cx="55" cy="326" r="2.9" fill="#5f8f4e"/>
  <circle cx="70" cy="329" r="2.5" fill="#6fa055"/><circle cx="78" cy="329" r="2.5" fill="#77a75e"/>
</g>
<!-- little tulip pot -->
<g>
  <ellipse cx="112" cy="360" rx="15" ry="4" fill="#5f3a1e" opacity="0.28" filter="url(#soft3)"/>
  <path d="M 102 336 L 122 336 L 119 358 L 105 358 Z" fill="url(#potGrad)"/>
  <rect x="100" y="333" width="24" height="6" rx="2" fill="#c97e54"/>
  <path d="M 112 332 Q 110 318, 112 308" stroke="#5f8f4e" stroke-width="1.8" fill="none"/>
  <path d="M 112 320 q -7 -2, -9 -9 M 112 322 q 7 -3, 8 -10" stroke="#5f8f4e" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M 106 308 Q 106 298, 112 298 Q 118 298, 118 308 Q 115 312, 112 308 Q 109 312, 106 308 Z" fill="#e58896"/>
  <path d="M 108 306 Q 108 300, 112 300" stroke="#f2b3bc" stroke-width="1.2" fill="none"/>
</g>

<!-- ======================= SLEEP CORNER (bottom-right) ======================= -->
<g>
  <!-- braided mat under the cat bed -->
  <ellipse cx="298" cy="330" rx="60" ry="23" fill="#5f3a1e" opacity="0.25" filter="url(#soft3)" transform="translate(0 3)"/>
  <ellipse cx="298" cy="330" rx="60" ry="23" fill="#e2b088"/>
  <ellipse cx="298" cy="330" rx="52" ry="19" fill="none" stroke="#c98d66" stroke-width="4" opacity="0.8"/>
  <ellipse cx="298" cy="330" rx="42" ry="15" fill="none" stroke="#eec39a" stroke-width="4" opacity="0.8"/>
  <ellipse cx="298" cy="330" rx="32" ry="11" fill="none" stroke="#c98d66" stroke-width="4" opacity="0.7"/>
  <ellipse cx="298" cy="330" rx="21" ry="7" fill="none" stroke="#eec39a" stroke-width="4" opacity="0.7"/>
</g>
<!-- yarn balls + toy mouse -->
<g>
  <ellipse cx="366" cy="362" rx="13" ry="3.6" fill="#5f3a1e" opacity="0.25" filter="url(#soft3)"/>
  <circle cx="364" cy="352" r="10" fill="#cf6f6f"/>
  <path d="M 355 349 Q 364 344, 373 350 M 356 356 Q 364 350, 372 356 M 358 360 Q 365 355, 371 359" fill="none" stroke="#b25454" stroke-width="1.4"/>
  <path d="M 373 356 Q 384 360, 392 356" fill="none" stroke="#cf6f6f" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="382" cy="336" r="7.5" fill="#6f9ea0"/>
  <path d="M 375 334 Q 382 330, 389 335 M 376 339 Q 382 335, 388 339" fill="none" stroke="#578082" stroke-width="1.2"/>
  <ellipse cx="340" cy="372" rx="7" ry="4.4" fill="#b9a08a"/>
  <path d="M 347 372 Q 355 370, 358 364" fill="none" stroke="#9a8270" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="335" cy="369.6" r="1.6" fill="#a08a74"/>
  <circle cx="333.6" cy="371.4" r="0.5" fill="#4a3a2c"/>
</g>

<!-- ======================= STRING LIGHTS + FINISHING TOUCHES ======================= -->
${stringLights()}
<!-- soft global corner shading, painterly finish -->
<rect x="${-B}" y="${-B}" width="${size}" height="40" fill="#5f3a1e" opacity="0.05" filter="url(#soft6)"/>
<rect x="${-B}" y="376" width="${size}" height="40" fill="#3a2414" opacity="0.10" filter="url(#soft6)"/>
</svg>`;
}
