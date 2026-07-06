/**
 * Hand-crafted SVG artwork for the room background.
 *
 * Art direction: cozy 2D painterly anime with rustic-fantasy, slice-of-life
 * themes — a timber-framed cottage interior in muted-but-rich earth tones
 * (walnut browns, moss greens, warm ambers, soft creams). Shapes are slightly
 * rounded and hand-built; clutter is purposeful: books, potion bottles,
 * quills, dried herbs, woven fabrics. Depth comes from layered glazes,
 * blurred contact shadows and baked directional light rather than outlines.
 *
 * The SVG is rasterized once to a texture (same pipeline as the cats).
 * Logical scene is 400x400 with a bleed margin so letterboxing never shows
 * a hard edge.
 */

/** Extra art drawn beyond every scene edge (logical px) */
export const ROOM_BLEED = 16;

/** Wall/floor split line (logical px) — cats' feet land at/below this */
export const WALL_BOTTOM_Y = 150;

// ---------------------------------------------------------------------------
// Small generators for repetitive detail
// ---------------------------------------------------------------------------

/** Wood floor planks: wide hand-hewn boards with staggered joints + grain */
function floorPlanks(): string {
  let s = '';
  const rows: number[] = [];
  for (let y = 150; y <= 420; y += 27) rows.push(y);

  // Per-board tonal variation — alternating warm/dark boards, painterly
  rows.forEach((y, i) => {
    const tone = i % 3 === 0 ? '#6e4522' : i % 3 === 1 ? '#e8b878' : '#4f3016';
    const op = i % 3 === 1 ? 0.05 : 0.07;
    s += `<rect x="-16" y="${y}" width="432" height="27" fill="${tone}" opacity="${op}"/>`;
  });

  // Board seams — slightly wavy for the hand-built feel
  rows.forEach((y, i) => {
    const bow = i % 2 === 0 ? 1.6 : -1.4;
    s += `<path d="M -16 ${y} Q 200 ${y + bow}, 416 ${y}" fill="none" stroke="#4a2c12" stroke-width="1.5" opacity="0.5"/>`;
    s += `<path d="M -16 ${y + 1.4} Q 200 ${y + bow + 1.4}, 416 ${y + 1.4}" fill="none" stroke="#d9a468" stroke-width="0.8" opacity="0.22"/>`;
  });

  // Staggered vertical joints
  const joints = [
    [70, 150], [250, 150], [360, 150],
    [140, 177], [310, 177], [30, 177],
    [90, 204], [220, 204], [380, 204],
    [170, 231], [330, 231], [50, 231],
    [110, 258], [270, 258],
    [200, 285], [370, 285], [40, 285],
    [140, 312], [300, 312],
    [80, 339], [240, 339], [390, 339],
    [180, 366], [340, 366], [20, 366],
    [120, 393], [280, 393],
  ];
  for (const [x, y] of joints) {
    s += `<line x1="${x}" y1="${y + 1}" x2="${x}" y2="${y + 26}" stroke="#4a2c12" stroke-width="1.3" opacity="0.45"/>`;
  }

  // Wood grain + a few knots
  const grain = [
    [30, 162, 60], [180, 190, 50], [320, 166, 44], [90, 244, 56],
    [250, 270, 48], [30, 322, 40], [350, 298, 52], [150, 374, 60], [300, 400, 46],
  ];
  for (const [x, y, w] of grain) {
    s += `<path d="M ${x} ${y} q ${w / 2} -3, ${w} 0" fill="none" stroke="#4a2c12" stroke-width="1" opacity="0.16"/>`;
    s += `<path d="M ${x + 8} ${y + 5} q ${w / 3} 2.5, ${w * 0.7} 0" fill="none" stroke="#4a2c12" stroke-width="0.7" opacity="0.11"/>`;
  }
  const knots: Array<[number, number]> = [[64, 218], [238, 348], [352, 240], [128, 288]];
  for (const [x, y] of knots) {
    s += `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.2" fill="none" stroke="#4a2c12" stroke-width="1" opacity="0.28"/>`;
    s += `<ellipse cx="${x}" cy="${y}" rx="1.3" ry="0.8" fill="#4a2c12" opacity="0.3"/>`;
  }
  return s;
}

/** A row of books for shelves: [width, height, color, lean?] */
function books(x0: number, yBottom: number, specs: Array<[number, number, string, number?]>): string {
  let s = '';
  let x = x0;
  for (const [w, h, color, lean] of specs) {
    const rot = lean ? ` transform="rotate(${lean} ${x + w / 2} ${yBottom})"` : '';
    s += `<g${rot}>`;
    s += `<rect x="${x}" y="${yBottom - h}" width="${w}" height="${h}" rx="1.4" fill="${color}"/>`;
    s += `<rect x="${x}" y="${yBottom - h}" width="${w}" height="${h}" rx="1.4" fill="#2a180a" opacity="0.16"/>`;
    s += `<rect x="${x + 0.8}" y="${yBottom - h + 0.8}" width="${w - 1.6}" height="${h - 1.6}" rx="1" fill="${color}"/>`;
    s += `<rect x="${x + 1.5}" y="${yBottom - h + 3}" width="${w - 3}" height="1.2" fill="#e8d8b0" opacity="0.5"/>`;
    s += `<rect x="${x + 1.5}" y="${yBottom - 5}" width="${w - 3}" height="1.2" fill="#e8d8b0" opacity="0.3"/>`;
    s += `</g>`;
    x += w + 1.4;
  }
  return s;
}

/** Corked potion bottle with a soft inner glow */
function potion(x: number, yBottom: number, w: number, h: number, glass: string, glow: string): string {
  const neckW = w * 0.36;
  const bodyTop = yBottom - h * 0.72;
  return `<g>
    <ellipse cx="${x}" cy="${yBottom}" rx="${w * 0.62}" ry="1.6" fill="#2a180a" opacity="0.25"/>
    <path d="M ${x - neckW / 2} ${yBottom - h} L ${x - neckW / 2} ${bodyTop - 2}
             Q ${x - w / 2} ${bodyTop + 2}, ${x - w / 2} ${yBottom - h * 0.4}
             Q ${x - w / 2} ${yBottom}, ${x} ${yBottom}
             Q ${x + w / 2} ${yBottom}, ${x + w / 2} ${yBottom - h * 0.4}
             Q ${x + w / 2} ${bodyTop + 2}, ${x + neckW / 2} ${bodyTop - 2}
             L ${x + neckW / 2} ${yBottom - h} Z" fill="${glass}" opacity="0.9"/>
    <ellipse cx="${x}" cy="${yBottom - h * 0.3}" rx="${w * 0.32}" ry="${h * 0.24}" fill="${glow}" opacity="0.75"/>
    <ellipse cx="${x}" cy="${yBottom - h * 0.3}" rx="${w * 0.5}" ry="${h * 0.34}" fill="${glow}" opacity="0.25"/>
    <rect x="${x - neckW / 2 - 0.6}" y="${yBottom - h - 3}" width="${neckW + 1.2}" height="3.6" rx="1.2" fill="#a67c4e"/>
    <path d="M ${x - w * 0.34} ${yBottom - h * 0.52} q 1.5 ${h * 0.18}, 0 ${h * 0.34}" fill="none" stroke="#fff" stroke-width="1" opacity="0.35"/>
  </g>`;
}

/** Bundle of dried herbs hanging upside-down from the garland rope */
function herbBundle(x: number, y: number): string {
  return `<g>
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 4}" stroke="#6e5638" stroke-width="1"/>
    <circle cx="${x}" cy="${y + 4.5}" r="1.4" fill="#a8503e"/>
    <path d="M ${x} ${y + 5} q -3.5 5, -4.5 11 M ${x} ${y + 5} q 0 6, 0 12 M ${x} ${y + 5} q 3.5 5, 4.5 11"
          fill="none" stroke="#5c7040" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M ${x - 3.5} ${y + 13} q -1 2.5, -1.5 4 M ${x + 3.5} ${y + 13} q 1 2.5, 1.5 4"
          fill="none" stroke="#6e8450" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="${x - 4.5}" cy="${y + 16.5}" r="1.1" fill="#7c9458"/>
    <circle cx="${x}" cy="${y + 17.5}" r="1.1" fill="#6e8450"/>
    <circle cx="${x + 4.5}" cy="${y + 16.5}" r="1.1" fill="#7c9458"/>
  </g>`;
}

/** Tiny hanging lantern with a warm glow */
function miniLantern(x: number, y: number): string {
  return `<g>
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 3.5}" stroke="#6e5638" stroke-width="1"/>
    <circle cx="${x}" cy="${y + 10}" r="8" fill="#ffbe5c" opacity="0.18"/>
    <rect x="${x - 3.2}" y="${y + 3.5}" width="6.4" height="2" rx="1" fill="#4f3822"/>
    <path d="M ${x - 4} ${y + 5.5} L ${x + 4} ${y + 5.5} L ${x + 3} ${y + 14} L ${x - 3} ${y + 14} Z" fill="#ffd98a"/>
    <path d="M ${x - 4} ${y + 5.5} L ${x + 4} ${y + 5.5} L ${x + 3} ${y + 14} L ${x - 3} ${y + 14} Z" fill="none" stroke="#4f3822" stroke-width="1"/>
    <line x1="${x}" y1="${y + 5.5}" x2="${x}" y2="${y + 14}" stroke="#4f3822" stroke-width="0.8" opacity="0.6"/>
    <ellipse cx="${x}" cy="${y + 10.5}" rx="1.6" ry="2.4" fill="#fff3c8"/>
    <rect x="${x - 2.4}" y="${y + 14}" width="4.8" height="1.6" rx="0.8" fill="#4f3822"/>
  </g>`;
}

/** Garland across the top: rope with herb bundles and tiny lanterns */
function garland(): string {
  let s = `<path d="M -16 12 Q 100 34, 200 26 Q 300 16, 416 32" fill="none" stroke="#6e5638" stroke-width="2" opacity="0.9"/>`;
  s += `<path d="M -16 12 Q 100 34, 200 26 Q 300 16, 416 32" fill="none" stroke="#8a7048" stroke-width="0.8" opacity="0.5"/>`;
  const pts: Array<[number, number]> = [
    [16, 17], [62, 25], [112, 29], [162, 28], [238, 23], [288, 20], [338, 21], [386, 26],
  ];
  pts.forEach(([x, y], i) => {
    s += i % 2 === 0 ? miniLantern(x, y) : herbBundle(x, y);
  });
  return s;
}

/** Decorative diamonds around the rug's mid ring (cream + rust wool) */
function rugDiamonds(cx: number, cy: number, rx: number, ry: number, n: number): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;
    s += `<rect x="${(x - 4).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="8" height="8" fill="#e2d0a4" opacity="0.85" transform="rotate(45 ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    s += `<rect x="${(x - 2).toFixed(1)}" y="${(y - 2).toFixed(1)}" width="4" height="4" fill="#b06848" opacity="0.9" transform="rotate(45 ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  return s;
}

/** Rounded fieldstone for the fireplace surround: [cx, cy, rx, ry, tone] */
function stones(list: Array<[number, number, number, number, number]>): string {
  const tones = ['#a89478', '#b5a084', '#9a8870', '#c0ac8e', '#8f7e68'];
  let s = '';
  for (const [cx, cy, rx, ry, t] of list) {
    const fill = tones[t % tones.length];
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
    s += `<ellipse cx="${cx - rx * 0.22}" cy="${cy - ry * 0.3}" rx="${rx * 0.6}" ry="${ry * 0.5}" fill="#fff8e8" opacity="0.14"/>`;
    s += `<path d="M ${cx - rx * 0.5} ${cy + ry * 0.6} Q ${cx} ${cy + ry * 1.05}, ${cx + rx * 0.55} ${cy + ry * 0.55}" fill="none" stroke="#4a3a26" stroke-width="1" opacity="0.3"/>`;
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
    <stop offset="0%" stop-color="#e5cea2"/>
    <stop offset="55%" stop-color="#dec28f"/>
    <stop offset="100%" stop-color="#cead79"/>
  </linearGradient>
  <linearGradient id="chimneyGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#d8bd8c"/>
    <stop offset="100%" stop-color="#c3a271"/>
  </linearGradient>
  <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#b5824a"/>
    <stop offset="45%" stop-color="#9c6c3a"/>
    <stop offset="100%" stop-color="#7a4f26"/>
  </linearGradient>
  <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#6a4c2c"/>
    <stop offset="45%" stop-color="#54381e"/>
    <stop offset="100%" stop-color="#412a14"/>
  </linearGradient>
  <linearGradient id="postGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#6a4c2c"/>
    <stop offset="55%" stop-color="#54381e"/>
    <stop offset="100%" stop-color="#3c2712"/>
  </linearGradient>
  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f9e9b8"/>
    <stop offset="55%" stop-color="#f2c983"/>
    <stop offset="100%" stop-color="#dfa05e"/>
  </linearGradient>
  <linearGradient id="curtainGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#b8724c"/>
    <stop offset="55%" stop-color="#a86341"/>
    <stop offset="100%" stop-color="#8f5134"/>
  </linearGradient>
  <linearGradient id="counterGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#8f6238"/>
    <stop offset="100%" stop-color="#6e4726"/>
  </linearGradient>
  <radialGradient id="fireboxGrad" cx="50%" cy="78%" r="75%">
    <stop offset="0%" stop-color="#6e3413"/>
    <stop offset="45%" stop-color="#3c1e0c"/>
    <stop offset="100%" stop-color="#190d07"/>
  </radialGradient>
  <radialGradient id="emberGlow" cx="50%" cy="60%" r="55%">
    <stop offset="0%" stop-color="#ffd97a" stop-opacity="0.95"/>
    <stop offset="45%" stop-color="#ff9838" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#ff7a26" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#916138"/>
    <stop offset="100%" stop-color="#6e4726"/>
  </linearGradient>
  <linearGradient id="chairGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#b06a52"/>
    <stop offset="100%" stop-color="#8f4f3a"/>
  </linearGradient>
  <radialGradient id="rugGrad" cx="50%" cy="42%" r="72%">
    <stop offset="0%" stop-color="#5e7a4c"/>
    <stop offset="70%" stop-color="#4c663f"/>
    <stop offset="100%" stop-color="#3c5232"/>
  </radialGradient>
  <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#b5714a"/>
    <stop offset="100%" stop-color="#8a4f2e"/>
  </linearGradient>
  <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#6b924e"/>
    <stop offset="100%" stop-color="#3f5c30"/>
  </linearGradient>
  <radialGradient id="poolGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffce7e" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#ffce7e" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffc668" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#ffc668" stop-opacity="0"/>
  </radialGradient>
  <filter id="soft6" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="soft3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="soft1" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.2"/></filter>
</defs>

<!-- ======================= PLASTER WALL ======================= -->
<rect x="${-B}" y="${-B}" width="${size}" height="${166 + B}" fill="url(#wallGrad)"/>
<!-- hand-troweled plaster mottling -->
<g filter="url(#soft6)">
  <ellipse cx="60" cy="52" rx="42" ry="24" fill="#c3a271" opacity="0.18"/>
  <ellipse cx="150" cy="96" rx="34" ry="20" fill="#f0dcae" opacity="0.16"/>
  <ellipse cx="255" cy="50" rx="40" ry="22" fill="#c3a271" opacity="0.15"/>
  <ellipse cx="330" cy="104" rx="44" ry="24" fill="#f0dcae" opacity="0.13"/>
  <ellipse cx="110" cy="30" rx="30" ry="16" fill="#f0dcae" opacity="0.14"/>
  <ellipse cx="370" cy="46" rx="30" ry="18" fill="#c3a271" opacity="0.16"/>
</g>
<!-- painterly corner shadow + window-side light wash -->
<rect x="${-B}" y="${-B}" width="90" height="${166 + B}" fill="#4a3018" opacity="0.07" filter="url(#soft6)"/>
<rect x="330" y="${-B}" width="90" height="${166 + B}" fill="#4a3018" opacity="0.12" filter="url(#soft6)"/>
<rect x="20" y="20" width="120" height="120" fill="#ffe8b0" opacity="0.1" filter="url(#soft6)"/>

<!-- ======================= TIMBER FRAME ======================= -->
<!-- main ceiling beam -->
<rect x="${-B}" y="${-B}" width="${size}" height="${B + 16}" fill="url(#beamGrad)"/>
<path d="M -16 6 Q 120 8, 416 5" fill="none" stroke="#7c5c38" stroke-width="1.2" opacity="0.5"/>
<path d="M -16 11 Q 180 13, 416 10" fill="none" stroke="#2e1c0c" stroke-width="1.2" opacity="0.45"/>
<rect x="${-B}" y="14" width="${size}" height="2.4" fill="#2e1c0c" opacity="0.55"/>
<rect x="${-B}" y="16" width="${size}" height="5" fill="#2e1c0c" opacity="0.16" filter="url(#soft3)"/>
<!-- corner posts at the bleed edges -->
<rect x="${-B}" y="${-B}" width="${B + 10}" height="${166 + B}" fill="url(#postGrad)"/>
<rect x="406" y="${-B}" width="${B + 10}" height="${166 + B}" fill="url(#postGrad)"/>
<line x1="-6" y1="16" x2="-6" y2="150" stroke="#7c5c38" stroke-width="1" opacity="0.4"/>
<line x1="406" y1="16" x2="406" y2="150" stroke="#2e1c0c" stroke-width="1.4" opacity="0.5"/>
<!-- chimney posts (frame the hearth) with pegs and braces -->
<g>
  <rect x="140" y="14" width="11" height="136" rx="1.5" fill="url(#postGrad)"/>
  <rect x="249" y="14" width="11" height="136" rx="1.5" fill="url(#postGrad)"/>
  <line x1="142.5" y1="16" x2="142.5" y2="150" stroke="#7c5c38" stroke-width="1" opacity="0.45"/>
  <line x1="251.5" y1="16" x2="251.5" y2="150" stroke="#7c5c38" stroke-width="1" opacity="0.45"/>
  <line x1="148.5" y1="16" x2="148.5" y2="150" stroke="#2e1c0c" stroke-width="1.2" opacity="0.4"/>
  <line x1="257.5" y1="16" x2="257.5" y2="150" stroke="#2e1c0c" stroke-width="1.2" opacity="0.4"/>
  <circle cx="145.5" cy="24" r="1.6" fill="#2e1c0c" opacity="0.55"/>
  <circle cx="254.5" cy="24" r="1.6" fill="#2e1c0c" opacity="0.55"/>
  <circle cx="145.5" cy="140" r="1.6" fill="#2e1c0c" opacity="0.55"/>
  <circle cx="254.5" cy="140" r="1.6" fill="#2e1c0c" opacity="0.55"/>
  <!-- angled braces into the ceiling beam -->
  <path d="M 140 34 L 118 16 L 128 16 L 140 26 Z" fill="#54381e"/>
  <path d="M 260 34 L 282 16 L 272 16 L 260 26 Z" fill="#4a3018"/>
  <!-- soft cast shadow right of each post -->
  <rect x="151" y="18" width="7" height="132" fill="#3a2412" opacity="0.16" filter="url(#soft3)"/>
  <rect x="260" y="18" width="7" height="132" fill="#3a2412" opacity="0.16" filter="url(#soft3)"/>
</g>
<!-- mid-wall studs -->
<rect x="116" y="14" width="8" height="136" fill="url(#postGrad)" opacity="0.92"/>
<rect x="282" y="14" width="8" height="136" fill="url(#postGrad)" opacity="0.92"/>
<line x1="118" y1="16" x2="118" y2="150" stroke="#7c5c38" stroke-width="0.8" opacity="0.4"/>
<line x1="284" y1="16" x2="284" y2="150" stroke="#7c5c38" stroke-width="0.8" opacity="0.4"/>

<!-- ======================= ARCHED WINDOW (late golden hour) ======================= -->
<g>
  <path d="M 20 100 L 20 52 Q 20 18, 62 18 Q 104 18, 104 52 L 104 100 Z" fill="#3a2412" opacity="0.22" filter="url(#soft3)" transform="translate(3 3)"/>
  <path d="M 20 100 L 20 52 Q 20 18, 62 18 Q 104 18, 104 52 L 104 100 Z" fill="#54381e"/>
  <path d="M 25 100 L 25 53 Q 25 23, 62 23 Q 99 23, 99 53 L 99 100 Z" fill="#8a6a42"/>
  <path d="M 28 100 L 28 54 Q 28 26, 62 26 Q 96 26, 96 54 L 96 100 Z" fill="url(#skyGrad)"/>
  <!-- low sun + haze -->
  <circle cx="78" cy="52" r="16" fill="#fff0b8" opacity="0.5"/>
  <circle cx="78" cy="52" r="8.5" fill="#fffbe0"/>
  <!-- rolling hills + tiny village silhouette -->
  <path d="M 28 78 Q 44 64, 60 76 Q 74 86, 96 74 L 96 100 L 28 100 Z" fill="#b98352" opacity="0.85"/>
  <path d="M 28 86 Q 48 76, 68 86 Q 82 92, 96 84 L 96 100 L 28 100 Z" fill="#96633a" opacity="0.9"/>
  <path d="M 40 82 l 3 -4 l 3 4 Z M 44 82 h -5 v 3 h 5 Z" fill="#5c3a22" opacity="0.8"/>
  <path d="M 52 85 l 2.6 -3.5 l 2.6 3.5 Z M 56 85 h -4.6 v 2.6 h 4.6 Z" fill="#5c3a22" opacity="0.7"/>
  <path d="M 42 38 q 2.5 -2.4 5 0 M 47 38 q 2.5 -2.4 5 0" fill="none" stroke="#8a6136" stroke-width="1.1" stroke-linecap="round"/>
  <!-- mullions (dark wood) -->
  <rect x="59" y="26" width="6" height="74" rx="1" fill="#8a6a42"/>
  <rect x="60.4" y="26" width="3.2" height="74" fill="#54381e"/>
  <rect x="28" y="56" width="68" height="6" rx="1" fill="#8a6a42"/>
  <rect x="28" y="57.4" width="68" height="3.2" fill="#54381e"/>
  <!-- glass shine -->
  <path d="M 34 28 L 48 26 L 30 62 L 30 42 Z" fill="#fff" opacity="0.16"/>
  <!-- chunky sill -->
  <rect x="14" y="98" width="96" height="8" rx="3" fill="#8a6a42"/>
  <rect x="14" y="103" width="96" height="3" rx="1.5" fill="#3c2712" opacity="0.6"/>
  <!-- potted herb on the sill -->
  <path d="M 84 92 L 96 92 L 94 98 L 86 98 Z" fill="url(#potGrad)"/>
  <path d="M 88 91 q -2.5 -5, -6 -6 M 90 91 q 0 -6, 1 -8 M 92 91 q 3 -4.5, 6 -5.5" fill="none" stroke="#5c7040" stroke-width="1.5" stroke-linecap="round"/>
  <!-- rust curtains, tied -->
  <path d="M 16 20 Q 12 58, 8 100 L 30 100 Q 23 58, 27 20 Z" fill="url(#curtainGrad)"/>
  <path d="M 21 21 Q 18 58, 16 98 L 22 98 Q 21 58, 25 21 Z" fill="#8f5134" opacity="0.6"/>
  <path d="M 27 20 Q 23 58, 30 100 L 24 100 Q 19 58, 21 20 Z" fill="#d99868" opacity="0.35"/>
  <path d="M 108 20 Q 112 58, 116 100 L 94 100 Q 101 58, 97 20 Z" fill="url(#curtainGrad)"/>
  <path d="M 103 21 Q 106 58, 108 98 L 102 98 Q 103 58, 99 21 Z" fill="#8f5134" opacity="0.6"/>
  <path d="M 97 20 Q 101 58, 94 100 L 100 100 Q 105 58, 103 20 Z" fill="#d99868" opacity="0.35"/>
  <path d="M 12 60 q 8 4, 16 1" fill="none" stroke="#e2b04a" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M 112 60 q -8 4, -16 1" fill="none" stroke="#e2b04a" stroke-width="2.4" stroke-linecap="round"/>
</g>

<!-- ======================= BETWEEN WINDOW & HEARTH ======================= -->
<!-- hanging trailing plant -->
<g>
  <line x1="130" y1="16" x2="130" y2="30" stroke="#8a7048" stroke-width="1.2"/>
  <path d="M 122 34 Q 130 27, 138 34 L 136 44 Q 130 48, 124 44 Z" fill="url(#potGrad)"/>
  <path d="M 122 34 Q 130 38, 138 34" fill="none" stroke="#6e3c20" stroke-width="1.2"/>
  <path d="M 123 38 q -6 11, -3 24 M 126 42 q -2 13, 2 22 M 135 38 q 6 10, 4 22 M 132 42 q 3 11, -1 20"
        fill="none" stroke="#5c7040" stroke-width="2" stroke-linecap="round"/>
  <circle cx="120" cy="58" r="2.4" fill="#6b924e"/><circle cx="123" cy="67" r="2.2" fill="#7c9458"/>
  <circle cx="128" cy="64" r="2" fill="#5c7040"/><circle cx="139" cy="56" r="2.4" fill="#6b924e"/>
  <circle cx="136" cy="64" r="2.1" fill="#7c9458"/><circle cx="131" cy="71" r="1.9" fill="#5c7040"/>
</g>
<!-- small round frame: cat cameo on parchment -->
<g>
  <circle cx="130" cy="94" r="11" fill="#3a2412" opacity="0.25" filter="url(#soft1)" transform="translate(1.5 1.5)"/>
  <circle cx="130" cy="94" r="11" fill="#6e4f30"/>
  <circle cx="130" cy="94" r="8.4" fill="#ecdcb4"/>
  <circle cx="130" cy="96" r="4" fill="#a8724a"/>
  <path d="M 126.5 93.5 L 125 89 L 128 92 Z M 133.5 93.5 L 135 89 L 132 92 Z" fill="#a8724a"/>
</g>

<!-- ======================= STONE HEARTH (center) ======================= -->
<!-- chimney breast between posts (starts under the ceiling beam) -->
<rect x="151" y="16" width="98" height="150" fill="url(#chimneyGrad)"/>
<rect x="151" y="16" width="98" height="4" fill="#2e1c0c" opacity="0.16" filter="url(#soft1)"/>
<g filter="url(#soft6)">
  <ellipse cx="200" cy="34" rx="44" ry="16" fill="#b5945e" opacity="0.25"/>
</g>
<!-- framed cat portrait above the mantel, rounded rustic frame -->
<g>
  <rect x="177" y="20" width="46" height="40" rx="8" fill="#3a2412" opacity="0.3" filter="url(#soft1)" transform="translate(2 2)"/>
  <rect x="177" y="18" width="46" height="40" rx="8" fill="#6e4f30"/>
  <rect x="181" y="22" width="38" height="32" rx="5" fill="#e8d8ac"/>
  <rect x="183" y="24" width="34" height="28" rx="4" fill="#d9c391"/>
  <circle cx="200" cy="41" r="9" fill="#a8724a"/>
  <path d="M 193 35 L 190 27 L 197 32 Z M 207 35 L 210 27 L 203 32 Z" fill="#a8724a"/>
  <circle cx="196.5" cy="40" r="1.1" fill="#3a2414"/><circle cx="203.5" cy="40" r="1.1" fill="#3a2414"/>
  <path d="M 198.8 43.5 q 1.2 1.2 2.4 0" fill="none" stroke="#3a2414" stroke-width="0.8"/>
  <ellipse cx="194" cy="43" rx="1.6" ry="0.9" fill="#c97a5e" opacity="0.6"/>
  <ellipse cx="206" cy="43" rx="1.6" ry="0.9" fill="#c97a5e" opacity="0.6"/>
</g>
<!-- rounded fieldstone surround -->
<path d="M 158 150 L 158 96 Q 158 82, 172 80 L 228 80 Q 242 82, 242 96 L 242 150 Z" fill="#8f7e68"/>
${stones([
  [166, 92, 9, 7, 0], [184, 88, 10, 6.5, 1], [203, 87, 9.5, 6.5, 3], [221, 88, 9, 6.5, 2], [235, 93, 8, 7, 1],
  [162, 108, 8, 7.5, 2], [238, 108, 8.5, 7.5, 0],
  [162, 124, 8.5, 7.5, 1], [238, 124, 8, 7.5, 3],
  [163, 140, 9, 7.5, 3], [237, 140, 9, 7.5, 2],
])}
<!-- heavy timber mantel beam -->
<rect x="150" y="66" width="100" height="13" rx="4" fill="#54381e"/>
<rect x="150" y="66" width="100" height="3.5" rx="1.75" fill="#7c5c38"/>
<rect x="152" y="77" width="96" height="2.4" rx="1.2" fill="#2e1c0c" opacity="0.7"/>
<rect x="153" y="79" width="94" height="5" fill="#2e1c0c" opacity="0.18" filter="url(#soft1)"/>
<path d="M 158 72 q 20 1.5, 40 0.5 M 210 71.5 q 18 1, 34 0.5" fill="none" stroke="#3c2712" stroke-width="0.8" opacity="0.5"/>
<!-- mantel clutter: candle, potions, snoozing-cat figurine -->
<g>
  <rect x="158" y="54" width="7" height="12" rx="2.4" fill="#e8d8ac"/>
  <path d="M 159 56 q 2 1.5, 5 0.8" fill="none" stroke="#c9b585" stroke-width="1" opacity="0.7"/>
  <ellipse cx="161.5" cy="52.5" rx="2.2" ry="3.2" fill="#ffca5f"/>
  <ellipse cx="161.5" cy="51.8" rx="1" ry="1.7" fill="#fff3c0"/>
  <circle cx="161.5" cy="52" r="6.5" fill="#ffca5f" opacity="0.25"/>
  ${potion(232, 66, 9, 15, '#8fa8b5', '#7cc2a8')}
  ${potion(222, 66, 7, 11, '#b5a08f', '#e2a84e')}
  <ellipse cx="196" cy="62" rx="7" ry="4" fill="#c2b6a4"/>
  <circle cx="201" cy="59.5" r="3" fill="#c2b6a4"/>
  <path d="M 199 57.5 L 198.2 55.4 L 200.4 56.6 Z M 203 57.5 L 203.8 55.4 L 201.6 56.6 Z" fill="#c2b6a4"/>
  <path d="M 200 60 q 1 0.8 2 0" fill="none" stroke="#6a6258" stroke-width="0.6"/>
</g>
<!-- firebox (arch interior kept in place for the runtime flames) -->
<path d="M 170 150 L 170 104 Q 170 88, 200 88 Q 230 88, 230 104 L 230 150 Z" fill="#4a3320"/>
<path d="M 173 150 L 173 106 Q 173 91, 200 91 Q 227 91, 227 106 L 227 150 Z" fill="url(#fireboxGrad)"/>
<!-- baked ember bed + glow (animated flames render on top at runtime) -->
<ellipse cx="200" cy="132" rx="26" ry="18" fill="url(#emberGlow)"/>
<rect x="182" y="136" width="36" height="5" rx="2.5" fill="#4a2410" transform="rotate(-4 200 138)"/>
<rect x="184" y="140" width="34" height="5" rx="2.5" fill="#3a1c0c" transform="rotate(3 200 142)"/>
<circle cx="190" cy="139" r="1.4" fill="#ffb35f" opacity="0.9"/>
<circle cx="207" cy="142" r="1.2" fill="#ff9838" opacity="0.8"/>
<circle cx="199" cy="144" r="1" fill="#ffd97a" opacity="0.7"/>
<!-- stone hearth slab -->
<rect x="156" y="146" width="88" height="13" rx="5" fill="#b5a084"/>
<rect x="156" y="154" width="88" height="5" rx="2.5" fill="#4a3a26" opacity="0.4"/>
<path d="M 176 148 L 174 158 M 202 147 L 203 158 M 226 148 L 228 158" stroke="#4a3a26" stroke-width="1" opacity="0.3"/>
<!-- dried herbs hanging from the right chimney post -->
<g transform="translate(255 40)">${herbBundle(0, 0)}</g>
<g transform="translate(144 52)">${herbBundle(0, 0)}</g>
<!-- log basket -->
<g>
  <ellipse cx="266" cy="152" rx="17" ry="4.5" fill="#3a2412" opacity="0.28" filter="url(#soft3)"/>
  <path d="M 252 128 Q 250 150, 256 150 L 276 150 Q 282 150, 280 128 Q 266 122, 252 128 Z" fill="#a67c4e"/>
  <path d="M 253 134 Q 266 138, 279 134 M 254 142 Q 266 146, 278 142" fill="none" stroke="#7c5a34" stroke-width="1.4" opacity="0.8"/>
  <path d="M 252 128 Q 266 133, 280 128" fill="none" stroke="#6e4f30" stroke-width="1.6"/>
  <circle cx="261" cy="126" r="4.6" fill="#6e4726"/><circle cx="261" cy="126" r="2.3" fill="#b58a58"/>
  <circle cx="271" cy="125" r="4.2" fill="#5c3a1e"/><circle cx="271" cy="125" r="2" fill="#a87c4e"/>
</g>

<!-- ======================= WOODEN CLOCK ======================= -->
<g>
  <circle cx="272" cy="42" r="13.5" fill="#3a2412" opacity="0.3" filter="url(#soft1)" transform="translate(1.5 1.5)"/>
  <circle cx="272" cy="42" r="13.5" fill="#6e4f30"/>
  <circle cx="272" cy="42" r="13.5" fill="none" stroke="#54381e" stroke-width="2"/>
  <circle cx="272" cy="42" r="10.5" fill="#e8d8ac"/>
  <circle cx="272" cy="42" r="1.4" fill="#4a3520"/>
  <line x1="272" y1="42" x2="272" y2="34.8" stroke="#4a3520" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="272" y1="42" x2="277.2" y2="45" stroke="#4a3520" stroke-width="1.2" stroke-linecap="round"/>
  <g stroke="#9a8a68" stroke-width="1">
    <line x1="272" y1="33" x2="272" y2="35"/><line x1="272" y1="49" x2="272" y2="51"/>
    <line x1="263" y1="42" x2="265" y2="42"/><line x1="279" y1="42" x2="281" y2="42"/>
  </g>
</g>

<!-- ======================= SCHOLAR'S NOOK (right) ======================= -->
<!-- shelf with books + potions, held by carved brackets -->
<g>
  <rect x="294" y="58" width="94" height="7" rx="3" fill="#6e4f30"/>
  <rect x="294" y="58" width="94" height="2" rx="1" fill="#8f6d44"/>
  <rect x="294" y="63" width="94" height="2.4" fill="#2e1c0c" opacity="0.45"/>
  <path d="M 301 65 q 1 8, -6 9 L 301 74 Z M 381 65 q -1 8, 6 9 L 381 74 Z" fill="#54381e"/>
  ${books(298, 58, [[7, 20, '#8f4f3a'], [6, 16, '#4c663f'], [8, 22, '#b08a3c'], [6, 15, '#5c6e82', -7], [7, 19, '#7a5470']])}
  ${potion(356, 58, 8, 13, '#95a88f', '#8fc470')}
  ${potion(366, 58, 6.5, 10, '#b5a08f', '#e2a84e')}
  <path d="M 376 50 q -2 -7, 3 -10 M 376 50 q 3 -6, -1 -10" stroke="#5c7040" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M 371 50 Q 376 47, 381 50 L 380 57 Q 376 59, 372 57 Z" fill="#a8604a"/>
</g>
<!-- parchment notes pinned to the wall -->
<g>
  <rect x="300" y="76" width="13" height="14" fill="#ecdcb4" transform="rotate(-5 306 83)"/>
  <path d="M 300 88 q 3 2.5, 6 0" fill="none" stroke="#c9b585" stroke-width="1" transform="rotate(-5 306 83)"/>
  <rect x="322" y="82" width="12" height="12" fill="#e2cfa0" transform="rotate(4 328 88)"/>
  <rect x="343" y="74" width="13" height="14" fill="#ecdcb4" transform="rotate(-3 349 81)"/>
  <circle cx="306" cy="78" r="1.3" fill="#8f4f3a"/>
  <circle cx="328" cy="84" r="1.3" fill="#4c663f"/>
  <circle cx="349" cy="76" r="1.3" fill="#b08a3c"/>
  <g stroke="#8a7452" stroke-width="0.7" opacity="0.65">
    <line x1="302" y1="82" x2="310" y2="81.5"/><line x1="302" y1="85" x2="309" y2="84.6"/>
    <line x1="324" y1="88" x2="332" y2="88.5"/><line x1="324" y1="91" x2="330" y2="91.3"/>
    <line x1="345" y1="80" x2="353" y2="79.6"/><line x1="345" y1="83" x2="352" y2="82.7"/>
  </g>
</g>
<!-- farm table desk with quill, ink, scroll and a candle lantern -->
<g>
  <ellipse cx="340" cy="152" rx="56" ry="7" fill="#3a2412" opacity="0.3" filter="url(#soft3)"/>
  <path d="M 286 106 Q 340 102, 394 106 L 394 116 Q 340 113, 286 116 Z" fill="url(#deskGrad)"/>
  <path d="M 286 106 Q 340 102, 394 106 L 394 109 Q 340 105.5, 286 109 Z" fill="#b58a58" opacity="0.8"/>
  <path d="M 288 116 L 292 150 L 299 150 L 296 116 Z" fill="#5c3a1e"/>
  <path d="M 392 116 L 388 150 L 381 150 L 384 116 Z" fill="#4a2e16"/>
  <path d="M 296 128 L 384 124 L 384 128 L 296 132 Z" fill="#5c3a1e" opacity="0.8"/>
  <!-- inkpot + quill -->
  <ellipse cx="302" cy="104" rx="4.5" ry="2" fill="#2e1c0c"/>
  <path d="M 300 104 Q 299 98, 302 96 Q 303 100, 302 104 Z" fill="#3a3a3a"/>
  <path d="M 303 103 Q 310 92, 318 88 Q 311 96, 306 104 Z" fill="#e8dcc0"/>
  <path d="M 305 101 Q 311 93, 317 89" fill="none" stroke="#b5a888" stroke-width="0.7"/>
  <!-- scroll + open book -->
  <rect x="318" y="100" width="20" height="5" rx="2.5" fill="#e2cfa0" transform="rotate(-3 328 102)"/>
  <circle cx="318.5" cy="102" r="2.5" fill="#c9b585" transform="rotate(-3 328 102)"/>
  <path d="M 340 100 Q 347 97, 354 100 L 354 106 Q 347 103.5, 340 106 Z" fill="#ecdcb4"/>
  <path d="M 347 98.8 L 347 104.6" stroke="#b5a480" stroke-width="0.8"/>
  <!-- brass candle lantern (matches DESK_LAMP glow anchor) -->
  <ellipse cx="366" cy="92" rx="22" ry="18" fill="url(#lanternGlow)"/>
  <rect x="359" y="102" width="15" height="3" rx="1.5" fill="#54381e"/>
  <path d="M 360 102 L 361 82 L 371 82 L 372 102 Z" fill="#ffd98a" opacity="0.92"/>
  <path d="M 360 102 L 361 82 L 371 82 L 372 102 Z" fill="none" stroke="#6e4f30" stroke-width="1.6"/>
  <line x1="366" y1="82" x2="366" y2="102" stroke="#6e4f30" stroke-width="0.9" opacity="0.6"/>
  <rect x="362" y="78" width="8" height="4.5" rx="2" fill="#54381e"/>
  <path d="M 364 78 Q 366 72, 368 78" fill="none" stroke="#54381e" stroke-width="1.6"/>
  <ellipse cx="366" cy="94" rx="2" ry="3.2" fill="#fff3c8"/>
</g>

<!-- ======================= SILL PLATE & FLOOR ======================= -->
<rect x="${-B}" y="140" width="${size}" height="10" fill="url(#beamGrad)"/>
<rect x="${-B}" y="140" width="${size}" height="2" fill="#7c5c38"/>
<rect x="${-B}" y="148" width="${size}" height="2" fill="#2e1c0c" opacity="0.7"/>
<rect x="${-B}" y="150" width="${size}" height="${266 + B}" fill="url(#floorGrad)"/>
${floorPlanks()}
<!-- contact shadow along the wall -->
<rect x="${-B}" y="150" width="${size}" height="8" fill="#3a2412" opacity="0.3" filter="url(#soft3)"/>
<!-- baked light: window shaft + hearth pool + big room glow -->
<path d="M 34 150 L 116 150 L 144 272 L 8 272 Z" fill="#ffd98a" opacity="0.17" filter="url(#soft6)"/>
<ellipse cx="200" cy="188" rx="88" ry="32" fill="url(#poolGlow)" opacity="0.65"/>
<ellipse cx="200" cy="272" rx="195" ry="112" fill="url(#poolGlow)" opacity="0.3"/>

<!-- ======================= WOOL RUG ======================= -->
<g>
  <ellipse cx="195" cy="300" rx="128" ry="57" fill="#22301e" opacity="0.4" filter="url(#soft3)" transform="translate(0 4)"/>
  <ellipse cx="195" cy="300" rx="128" ry="57" fill="url(#rugGrad)"/>
  <ellipse cx="195" cy="300" rx="118" ry="50" fill="none" stroke="#e2d0a4" stroke-width="3" opacity="0.85"/>
  <ellipse cx="195" cy="300" rx="108" ry="44" fill="none" stroke="#b06848" stroke-width="1.8" opacity="0.7"/>
  ${rugDiamonds(195, 300, 88, 34, 10)}
  <ellipse cx="195" cy="300" rx="30" ry="13" fill="#e2d0a4" opacity="0.9"/>
  <ellipse cx="195" cy="300" rx="20" ry="8.5" fill="#b06848"/>
  <ellipse cx="195" cy="300" rx="9" ry="4" fill="#4c663f"/>
  <!-- woven texture arcs -->
  <path d="M 100 282 Q 195 262, 290 282" fill="none" stroke="#3c5232" stroke-width="1" opacity="0.35"/>
  <path d="M 92 306 Q 195 288, 298 306" fill="none" stroke="#3c5232" stroke-width="1" opacity="0.3"/>
  <path d="M 108 326 Q 195 312, 282 326" fill="none" stroke="#3c5232" stroke-width="1" opacity="0.3"/>
  <!-- fringe -->
  <g stroke="#e2d0a4" stroke-width="1.6" opacity="0.8" stroke-linecap="round">
    <line x1="66" y1="292" x2="59" y2="290"/><line x1="64" y1="300" x2="56" y2="300"/>
    <line x1="66" y1="308" x2="59" y2="310"/><line x1="70" y1="316" x2="64" y2="320"/>
    <line x1="324" y1="292" x2="331" y2="290"/><line x1="326" y1="300" x2="334" y2="300"/>
    <line x1="324" y1="308" x2="331" y2="310"/><line x1="320" y1="316" x2="326" y2="320"/>
  </g>
</g>

<!-- ======================= KITCHEN SIDEBOARD (left, behind cooking cat) ======================= -->
<g>
  <ellipse cx="50" cy="152" rx="52" ry="7" fill="#3a2412" opacity="0.32" filter="url(#soft3)"/>
  <path d="M 2 106 Q 4 102, 8 102 L 90 102 Q 94 102, 96 106 L 96 150 L 2 150 Z" fill="url(#counterGrad)"/>
  <!-- rounded plank doors with iron hinges -->
  <rect x="8" y="112" width="38" height="34" rx="5" fill="#5c3a1e"/>
  <rect x="50" y="112" width="38" height="34" rx="5" fill="#5c3a1e"/>
  <rect x="10.5" y="114.5" width="33" height="29" rx="4" fill="#7c5230"/>
  <rect x="52.5" y="114.5" width="33" height="29" rx="4" fill="#7c5230"/>
  <path d="M 20 115 L 20 143 M 33 115 L 33 143 M 62 115 L 62 143 M 75 115 L 75 143" stroke="#5c3a1e" stroke-width="1" opacity="0.6"/>
  <circle cx="41" cy="129" r="2" fill="#2e1c0c"/><circle cx="55" cy="129" r="2" fill="#2e1c0c"/>
  <path d="M 12 118 h 6 M 12 140 h 6 M 80 118 h 6 M 80 140 h 6" stroke="#3c2712" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <!-- thick worn top plank -->
  <path d="M -2 98 Q 48 94, 100 98 L 100 107 Q 48 103, -2 107 Z" fill="#c9a06e"/>
  <path d="M -2 98 Q 48 94, 100 98 L 100 100.5 Q 48 96.5, -2 100.5 Z" fill="#e2c08c" opacity="0.8"/>
  <path d="M -2 104 Q 48 100.5, 100 104 L 100 107 Q 48 103, -2 107 Z" fill="#8a5c34"/>
  <!-- counter clutter: bread board, mortar & pestle, honey jar, cauldron pot -->
  <rect x="6" y="88" width="17" height="10" rx="2.5" fill="#b58a58" transform="rotate(-2 14 93)"/>
  <line x1="9" y1="93" x2="21" y2="92.5" stroke="#8a6136" stroke-width="0.9" opacity="0.8"/>
  <ellipse cx="33" cy="96" rx="6" ry="3" fill="#9a8870"/>
  <path d="M 27 96 Q 27 90, 33 90 Q 39 90, 39 96" fill="#b5a084"/>
  <path d="M 36 88 L 41 84" stroke="#8a6a42" stroke-width="2.2" stroke-linecap="round"/>
  <rect x="46" y="86" width="10" height="12" rx="2.5" fill="#d9a441"/>
  <rect x="46" y="86" width="10" height="4" rx="2" fill="#e8c068"/>
  <rect x="47.5" y="83.5" width="7" height="3.5" rx="1.4" fill="#8a6a42"/>
  <path d="M 72 86 Q 72 82, 76 82 L 84 82 Q 88 82, 88 86 L 87 96 Q 80 99, 73 96 Z" fill="#4a4440"/>
  <ellipse cx="80" cy="83" rx="7" ry="2.4" fill="#5c5650"/>
  <ellipse cx="80" cy="83" rx="4.5" ry="1.4" fill="#2e2a26"/>
  <path d="M 71 86 q -3 1, -3 4 M 89 86 q 3 1, 3 4" fill="none" stroke="#3a3632" stroke-width="1.4"/>
</g>

<!-- ======================= READING NOOK (mid-right) ======================= -->
<g>
  <ellipse cx="290" cy="250" rx="58" ry="10" fill="#3a2412" opacity="0.32" filter="url(#soft3)"/>
  <!-- rounded hand-built armchair -->
  <path d="M 252 246 Q 248 200, 258 184 Q 268 170, 290 170 Q 312 170, 322 184 Q 332 200, 328 246 Z" fill="url(#chairGrad)"/>
  <path d="M 259 240 Q 256 202, 265 189 Q 274 179, 290 179 Q 306 179, 315 189 Q 324 202, 321 240 Z" fill="#a05e46" opacity="0.75"/>
  <!-- arms -->
  <path d="M 243 246 Q 241 210, 246 202 Q 250 195, 256 197 Q 263 200, 263 210 L 263 246 Z" fill="#96543e"/>
  <path d="M 337 246 Q 339 210, 334 202 Q 330 195, 324 197 Q 317 200, 317 210 L 317 246 Z" fill="#83462f"/>
  <path d="M 245 210 Q 245 200, 252 198" fill="none" stroke="#d9a488" stroke-width="1.8" opacity="0.55"/>
  <!-- seat cushion -->
  <rect x="258" y="222" width="64" height="19" rx="9" fill="#d9a878"/>
  <rect x="258" y="222" width="64" height="7" rx="3.5" fill="#e8c096" opacity="0.75"/>
  <!-- ochre pillow + folded wool blanket over the arm -->
  <rect x="296" y="196" width="24" height="24" rx="6" fill="#c99a4a" transform="rotate(-8 308 208)"/>
  <rect x="299" y="199" width="18" height="18" rx="5" fill="#d9ae60" transform="rotate(-8 308 208)" opacity="0.75"/>
  <path d="M 240 214 Q 252 208, 264 214 L 264 232 Q 252 238, 240 232 Z" fill="#5e7a4a"/>
  <path d="M 240 219 Q 252 213, 264 219 M 240 226 Q 252 220, 264 226" fill="none" stroke="#e2d0a4" stroke-width="1.6" opacity="0.7"/>
  <!-- stubby wooden feet -->
  <path d="M 250 246 q 0 8, 7 8 l -7 0 Z M 251 246 h 7 v 7 q -7 1, -7 -7" fill="#4a2e16"/>
  <rect x="251" y="246" width="8" height="7" rx="2.5" fill="#4a2e16"/>
  <rect x="321" y="246" width="8" height="7" rx="2.5" fill="#3c2712"/>
  <!-- book stack + rolled scroll beside chair -->
  <g>
    <rect x="228" y="248" width="22" height="5.5" rx="2" fill="#4c663f"/>
    <rect x="230" y="242.5" width="20" height="5.5" rx="2" fill="#b08a3c"/>
    <rect x="229" y="237" width="19" height="5.5" rx="2" fill="#8f4f3a"/>
    <rect x="226" y="230" width="24" height="5" rx="2.5" fill="#e2cfa0" transform="rotate(-4 238 232)"/>
    <circle cx="227" cy="232" r="2.4" fill="#c9b585" transform="rotate(-4 238 232)"/>
  </g>
</g>
<!-- standing iron lantern post (matches FLOOR_LAMP glow anchor) -->
<g>
  <ellipse cx="352" cy="260" rx="17" ry="4.5" fill="#3a2412" opacity="0.32" filter="url(#soft3)"/>
  <path d="M 340 258 Q 352 252, 364 258 L 362 261 Q 352 256.5, 342 261 Z" fill="#3c2f26"/>
  <rect x="350" y="196" width="4" height="62" rx="2" fill="#3c2f26"/>
  <rect x="350.8" y="196" width="1.4" height="62" fill="#6a5a4a"/>
  <ellipse cx="352" cy="176" rx="26" ry="24" fill="url(#lanternGlow)"/>
  <path d="M 344 192 L 346 162 L 358 162 L 360 192 Z" fill="#ffd98a" opacity="0.92"/>
  <path d="M 344 192 L 346 162 L 358 162 L 360 192 Z" fill="none" stroke="#3c2f26" stroke-width="2"/>
  <line x1="352" y1="162" x2="352" y2="192" stroke="#3c2f26" stroke-width="1" opacity="0.6"/>
  <line x1="345" y1="177" x2="359" y2="177" stroke="#3c2f26" stroke-width="1" opacity="0.5"/>
  <rect x="342" y="190" width="20" height="4" rx="2" fill="#3c2f26"/>
  <rect x="345" y="157" width="14" height="5" rx="2.4" fill="#3c2f26"/>
  <path d="M 348 157 Q 352 150, 356 157" fill="none" stroke="#3c2f26" stroke-width="1.8"/>
  <ellipse cx="352" cy="180" rx="2.4" ry="4" fill="#fff3c8"/>
</g>

<!-- ======================= GARDEN CORNER (bottom-left) ======================= -->
<g>
  <!-- monstera in a glazed pot -->
  <ellipse cx="38" cy="326" rx="30" ry="7" fill="#3a2412" opacity="0.32" filter="url(#soft3)"/>
  <g stroke="#3f5c30" stroke-width="2.6" fill="none" stroke-linecap="round">
    <path d="M 38 294 Q 30 262, 16 242"/>
    <path d="M 38 294 Q 38 254, 44 228"/>
    <path d="M 38 294 Q 48 264, 62 248"/>
  </g>
  <path d="M 16 244 Q 2 236, 4 220 Q 8 206, 22 210 Q 34 214, 30 230 Q 27 242, 16 244 Z" fill="url(#leafGrad)"/>
  <path d="M 16 242 L 12 226 M 16 242 L 22 222" stroke="#324c26" stroke-width="1.4" opacity="0.6" fill="none"/>
  <path d="M 44 230 Q 32 218, 38 202 Q 46 190, 58 198 Q 68 206, 60 220 Q 54 230, 44 230 Z" fill="#5c7f42"/>
  <path d="M 46 228 L 46 208 M 46 228 L 56 210" stroke="#324c26" stroke-width="1.4" opacity="0.6" fill="none"/>
  <path d="M 62 250 Q 58 232, 72 224 Q 86 220, 90 234 Q 92 248, 78 252 Q 68 254, 62 250 Z" fill="#6b924e"/>
  <path d="M 64 248 L 74 234 M 64 248 L 80 242" stroke="#324c26" stroke-width="1.3" opacity="0.6" fill="none"/>
  <path d="M 30 270 Q 18 264, 20 252 Q 24 242, 34 248 Q 42 254, 38 264 Q 35 270, 30 270 Z" fill="#77a75e"/>
  <path d="M 22 288 Q 38 284, 54 288 L 51 326 Q 38 330, 25 326 Z" fill="url(#potGrad)"/>
  <path d="M 18 284 Q 38 279, 58 284 L 57 292 Q 38 287.5, 19 292 Z" fill="#b5714a"/>
  <path d="M 18 289 Q 38 284.5, 58 289 L 57 292 Q 38 287.5, 19 292 Z" fill="#8a4f2e"/>
  <path d="M 26 294 L 29 324" stroke="#6e3c20" stroke-width="1" opacity="0.4"/>
  <path d="M 47 296 Q 52 308, 49 322" stroke="#d9976a" stroke-width="1.4" opacity="0.4" fill="none"/>
  <ellipse cx="38" cy="291" rx="15" ry="2.6" fill="#4a3018"/>
</g>
<!-- rough-sawn planter box with sprouts -->
<g>
  <ellipse cx="52" cy="378" rx="44" ry="7" fill="#3a2412" opacity="0.3" filter="url(#soft3)"/>
  <path d="M 12 346 Q 52 342, 92 346 L 92 374 Q 52 378, 12 374 Z" fill="#8a5c34"/>
  <path d="M 12 346 Q 52 342, 92 346 L 92 351 Q 52 347, 12 351 Z" fill="#b5824e"/>
  <path d="M 12 369 Q 52 373, 92 369 L 92 374 Q 52 378, 12 374 Z" fill="#5c3a1e"/>
  <line x1="38" y1="349" x2="38" y2="371" stroke="#6e4726" stroke-width="1.3" opacity="0.7"/>
  <line x1="64" y1="349" x2="64" y2="371" stroke="#6e4726" stroke-width="1.3" opacity="0.7"/>
  <path d="M 16 342 Q 52 338, 88 342 L 88 348 Q 52 344, 16 348 Z" fill="#4a3018"/>
  <g stroke="#5c7040" stroke-width="2" fill="none" stroke-linecap="round">
    <path d="M 26 342 q -1 -8, -4 -11 M 26 342 q 1 -8, 4 -11"/>
    <path d="M 50 342 q -1 -9, -5 -13 M 50 342 q 1 -9, 5 -13"/>
    <path d="M 74 342 q -1 -7, -4 -10 M 74 342 q 1 -7, 4 -10"/>
  </g>
  <circle cx="22" cy="330" r="2.6" fill="#77a75e"/><circle cx="30" cy="330" r="2.6" fill="#6b924e"/>
  <circle cx="45" cy="328" r="2.9" fill="#77a75e"/><circle cx="55" cy="328" r="2.9" fill="#5c7f42"/>
  <circle cx="70" cy="331" r="2.5" fill="#6b924e"/><circle cx="78" cy="331" r="2.5" fill="#77a75e"/>
</g>
<!-- little terracotta pot with a wildflower -->
<g>
  <ellipse cx="112" cy="362" rx="15" ry="4" fill="#3a2412" opacity="0.3" filter="url(#soft3)"/>
  <path d="M 102 338 Q 112 335, 122 338 L 119 360 Q 112 362, 105 360 Z" fill="url(#potGrad)"/>
  <path d="M 100 334 Q 112 331, 124 334 L 123 340 Q 112 337, 101 340 Z" fill="#b5714a"/>
  <path d="M 112 334 Q 110 320, 112 310" stroke="#5c7040" stroke-width="1.8" fill="none"/>
  <path d="M 112 322 q -7 -2, -9 -9 M 112 324 q 7 -3, 8 -10" stroke="#5c7040" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <circle cx="112" cy="306" r="5" fill="#d98a52"/>
  <circle cx="112" cy="306" r="2.2" fill="#8a4f2e"/>
  <circle cx="108.5" cy="303" r="2.8" fill="#e2a066"/><circle cx="115.5" cy="303" r="2.8" fill="#e2a066"/>
  <circle cx="108.5" cy="309" r="2.8" fill="#d98a52"/><circle cx="115.5" cy="309" r="2.8" fill="#d98a52"/>
</g>

<!-- ======================= SLEEP CORNER (bottom-right) ======================= -->
<g>
  <!-- braided wool mat under the cat bed -->
  <ellipse cx="298" cy="332" rx="60" ry="23" fill="#3a2412" opacity="0.3" filter="url(#soft3)" transform="translate(0 3)"/>
  <ellipse cx="298" cy="332" rx="60" ry="23" fill="#c99a68"/>
  <ellipse cx="298" cy="332" rx="52" ry="19" fill="none" stroke="#a87c4e" stroke-width="4" opacity="0.85"/>
  <ellipse cx="298" cy="332" rx="42" ry="15" fill="none" stroke="#d9b586" stroke-width="4" opacity="0.85"/>
  <ellipse cx="298" cy="332" rx="32" ry="11" fill="none" stroke="#a87c4e" stroke-width="4" opacity="0.75"/>
  <ellipse cx="298" cy="332" rx="21" ry="7" fill="none" stroke="#d9b586" stroke-width="4" opacity="0.75"/>
  <path d="M 250 322 Q 298 306, 346 322" fill="none" stroke="#8a6136" stroke-width="0.9" opacity="0.4"/>
</g>
<!-- yarn basket + toy mouse -->
<g>
  <ellipse cx="368" cy="366" rx="20" ry="5" fill="#3a2412" opacity="0.28" filter="url(#soft3)"/>
  <path d="M 352 344 Q 350 364, 357 364 L 379 364 Q 386 364, 384 344 Q 368 338, 352 344 Z" fill="#a67c4e"/>
  <path d="M 353 350 Q 368 354, 383 350 M 354 357 Q 368 361, 382 357" fill="none" stroke="#7c5a34" stroke-width="1.4" opacity="0.8"/>
  <path d="M 352 344 Q 368 349, 384 344" fill="none" stroke="#6e4f30" stroke-width="1.6"/>
  <circle cx="362" cy="342" r="7.5" fill="#a8503e"/>
  <path d="M 355.5 340 Q 362 336, 368.5 341 M 356.5 345 Q 362 341, 368 345" fill="none" stroke="#8a3f30" stroke-width="1.3"/>
  <circle cx="375" cy="340" r="6.5" fill="#5e7a4a"/>
  <path d="M 369 338 Q 375 334.5, 381 339 M 370 342.5 Q 375 339, 380 342.5" fill="none" stroke="#4a6139" stroke-width="1.2"/>
  <path d="M 384 348 Q 394 352, 400 348" fill="none" stroke="#a8503e" stroke-width="1.6" stroke-linecap="round"/>
  <ellipse cx="338" cy="374" rx="7" ry="4.4" fill="#a89078"/>
  <path d="M 345 374 Q 353 372, 356 366" fill="none" stroke="#8a7460" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="333" cy="371.6" r="1.6" fill="#948066"/>
  <circle cx="331.6" cy="373.4" r="0.5" fill="#3c2e20"/>
</g>

<!-- ======================= GARLAND + PAINTERLY FINISH ======================= -->
${garland()}
<!-- warm hearth glaze + cool corner falloff for depth -->
<ellipse cx="200" cy="150" rx="150" ry="90" fill="#ff9c46" opacity="0.07" filter="url(#soft6)"/>
<rect x="${-B}" y="${-B}" width="150" height="60" fill="#2e1c0c" opacity="0.12" filter="url(#soft6)"/>
<rect x="280" y="${-B}" width="150" height="60" fill="#2e1c0c" opacity="0.14" filter="url(#soft6)"/>
<rect x="${-B}" y="378" width="${size}" height="40" fill="#241408" opacity="0.16" filter="url(#soft6)"/>
</svg>`;
}
