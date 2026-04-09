import React from 'react';
import styles from '../scene.module.css';

/**
 * Decorative details: plants, lamps, scattered items, wall decorations.
 */
export const RoomDecor: React.FC = () => (
  <g>
    {/* ===== WALL-MOUNTED ITEMS ===== */}

    {/* Cat portrait frame (back wall left) */}
    <rect x="128" y="12" width="14" height="12" rx="1" fill="#c4a060" stroke="#8a6a3a" strokeWidth="1" />
    <rect x="130" y="14" width="10" height="8" fill="#e8d8c0" /> {/* canvas */}
    {/* Mini cat face in portrait */}
    <circle cx="135" cy="17" r="2.5" fill="#f0dcc8" />
    <circle cx="134" cy="16.5" r="0.5" fill="#3a2a1a" />
    <circle cx="136" cy="16.5" r="0.5" fill="#3a2a1a" />
    <polygon points="133,14.5 132,12.5 134,14" fill="#f0dcc8" />
    <polygon points="137,14.5 138,12.5 136,14" fill="#f0dcc8" />

    {/* Second picture frame */}
    <rect x="108" y="15" width="10" height="8" rx="0.5" fill="#8a6a3a" stroke="#6a4a2a" strokeWidth="0.6" />
    <rect x="109.5" y="16.5" width="7" height="5" fill="#aaddaa" opacity="0.4" /> {/* landscape painting */}
    <rect x="109.5" y="19" width="7" height="2.5" fill="#88aa44" opacity="0.3" /> {/* grass */}

    {/* Clock (back wall right) */}
    <circle cx="260" cy="20" r="6" fill="#f0e4c8" stroke="#8a6a3a" strokeWidth="1" />
    <circle cx="260" cy="20" r="5" fill="#f8f0e0" />
    {/* Clock hour marks */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <line key={`cm-${i}`}
        x1={260 + 3.8 * Math.cos(deg * Math.PI / 180)} y1={20 + 3.8 * Math.sin(deg * Math.PI / 180)}
        x2={260 + 4.5 * Math.cos(deg * Math.PI / 180)} y2={20 + 4.5 * Math.sin(deg * Math.PI / 180)}
        stroke="#6a5a4a" strokeWidth="0.4" />
    ))}
    <line x1="260" y1="20" x2="260" y2="16" stroke="#4a3a2a" strokeWidth="0.6" /> {/* hour hand */}
    <line x1="260" y1="20" x2="263.5" y2="20" stroke="#4a3a2a" strokeWidth="0.4" /> {/* minute hand */}
    <circle cx="260" cy="20" r="0.8" fill="#4a3a2a" />

    {/* Mounted fish trophy (left wall) */}
    <ellipse cx="26" cy="100" rx="4" ry="8" fill="#6a9ab8" stroke="#4a7a98" strokeWidth="0.5" transform="rotate(-15, 26, 100)" />
    <path d="M 26 92 L 24 88 L 28 88 Z" fill="#6a9ab8" transform="rotate(-15, 26, 100)" /> {/* tail */}
    {/* Plaque under fish */}
    <rect x="22" y="108" width="8" height="3" rx="0.5" fill="#8a6a3a" stroke="#6a4a2a" strokeWidth="0.3" />

    {/* Shelf with trinkets (right wall) */}
    <rect x="360" y="80" width="10" height="2" fill="#8a6a3a" stroke="#6a4a2a" strokeWidth="0.3" />
    <circle cx="363" cy="79" r="1.5" fill="#cc8844" /> {/* small jar */}
    <rect x="366" y="77" width="2" height="3" rx="0.3" fill="#88aacc" stroke="#6088aa" strokeWidth="0.2" /> {/* tiny vase */}

    {/* Hanging herbs (from ceiling, left area) */}
    {[85, 95, 105].map((x) => (
      <g key={`herb-${x}`}>
        <line x1={x} y1="28" x2={x} y2="35" stroke="#5a8a3a" strokeWidth="0.6" />
        <ellipse cx={x} cy="37" rx="3" ry="4" fill="#5a8a3a" opacity="0.7" />
        <ellipse cx={x - 1} cy="36" rx="2" ry="3" fill="#7aaa5a" opacity="0.5" />
      </g>
    ))}

    {/* ===== WALL SCONCES / CANDLES ===== */}

    {/* Left wall sconce */}
    <rect x="29" y="60" width="5" height="3" fill="#8a7060" stroke="#6a5040" strokeWidth="0.3" />
    <circle cx="31.5" cy="59" r="1.5" fill="#ffdd66" />
    <circle cx="31.5" cy="59" r="6" fill="#ffdd44" opacity="0.08" className={styles.lanternFlicker} />

    {/* Right wall sconce */}
    <rect x="366" y="140" width="5" height="3" fill="#8a7060" stroke="#6a5040" strokeWidth="0.3" />
    <circle cx="368.5" cy="139" r="1.5" fill="#ffdd66" />
    <circle cx="368.5" cy="139" r="6" fill="#ffdd44" opacity="0.08" className={styles.lanternFlicker} />

    {/* ===== POTTED PLANTS ===== */}

    {/* Plant near door (bottom-right) */}
    <rect x="250" y="210" width="7" height="7" rx="1" fill="#a08060" stroke="#806040" strokeWidth="0.5" />
    <circle cx="253" cy="207" r="5" fill="#5a8a3a" />
    <circle cx="250" cy="209" r="3" fill="#6a9a4a" />
    <circle cx="257" cy="208" r="3.5" fill="#4a7a30" />

    {/* Small plant (top-right corner) */}
    <rect x="350" y="28" width="5" height="5" rx="0.8" fill="#c88060" stroke="#a06040" strokeWidth="0.4" />
    <circle cx="352" cy="26" r="3.5" fill="#5a8a3a" />
    <circle cx="355" cy="27" r="2.5" fill="#6a9a4a" />

    {/* Plant near bookshelf */}
    <rect x="346" y="165" width="6" height="6" rx="1" fill="#a08060" stroke="#806040" strokeWidth="0.5" />
    <circle cx="349" cy="162" r="4" fill="#4a7a30" />
    <circle cx="352" cy="163" r="3" fill="#6a9a4a" />

    {/* ===== SCATTERED FLOOR ITEMS ===== */}

    {/* Yarn ball */}
    <circle cx="110" cy="180" r="4" fill="#cc6688" stroke="#aa4466" strokeWidth="0.5" />
    <path d="M 110 176 Q 114 178, 112 182 Q 108 180, 110 176" fill="none" stroke="#aa4466" strokeWidth="0.4" />
    {/* Yarn trail */}
    <path d="M 114 180 Q 118 178, 122 182 Q 126 185, 128 182" fill="none" stroke="#cc6688" strokeWidth="0.6" opacity="0.5" />

    {/* Cat toy (mouse) */}
    <ellipse cx="290" cy="165" rx="3" ry="2" fill="#c8b8a0" stroke="#a89880" strokeWidth="0.3" />
    <line x1="293" y1="165" x2="298" y2="163" stroke="#a89880" strokeWidth="0.4" /> {/* tail */}
    <circle cx="288" cy="164" r="0.5" fill="#4a3a2a" /> {/* eye */}

    {/* Broom (leaning against left wall) */}
    <line x1="36" y1="140" x2="38" y2="170" stroke="#8d6e63" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="34" y="168" width="8" height="6" rx="1" fill="#d4a060" stroke="#b08040" strokeWidth="0.4" />

    {/* Bucket */}
    <ellipse cx="42" cy="180" rx="5" ry="3.5" fill="#78909c" stroke="#546e7a" strokeWidth="0.5" />
    <ellipse cx="42" cy="178" rx="5" ry="3.5" fill="none" stroke="#546e7a" strokeWidth="0.8" />
    <ellipse cx="42" cy="178" rx="4" ry="2.5" fill="#88bbdd" opacity="0.4" /> {/* water */}

    {/* Cat food bowl (near kitchen) */}
    <ellipse cx="85" cy="90" rx="5" ry="3" fill="#c8b8a0" stroke="#a89880" strokeWidth="0.5" />
    <ellipse cx="85" cy="89" rx="3.5" ry="2" fill="#b08040" opacity="0.5" />

    {/* Cat water bowl */}
    <ellipse cx="95" cy="93" rx="4.5" ry="2.5" fill="#c8b8a0" stroke="#a89880" strokeWidth="0.5" />
    <ellipse cx="95" cy="92" rx="3" ry="1.5" fill="#88bbdd" opacity="0.5" />

    {/* ===== COBBLESTONE PATH (through door) ===== */}
    <g>
      {[
        { x: 195, y: 232, rx: 5, ry: 3 },
        { x: 205, y: 235, rx: 4, ry: 2.5 },
        { x: 215, y: 232, rx: 5, ry: 2.5 },
        { x: 190, y: 237, rx: 4.5, ry: 2.5 },
        { x: 200, y: 240, rx: 5, ry: 3 },
        { x: 210, y: 238, rx: 4, ry: 2 },
        { x: 220, y: 237, rx: 4.5, ry: 2.5 },
      ].map((s, i) => (
        <ellipse key={`cob-${i}`} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry}
          fill={i % 2 === 0 ? '#b0a898' : '#a89888'} stroke="#8a7a6a" strokeWidth="0.3" />
      ))}
    </g>

    {/* ===== DUST PARTICLES / AMBIENT (doubled + golden motes) ===== */}
    <g className={styles.fireflies}>
      <circle cx="100" cy="60" r="0.8" fill="#ffdd88" opacity="0.3" />
      <circle cx="180" cy="80" r="0.6" fill="#ffdd88" opacity="0.2" />
      <circle cx="250" cy="50" r="0.7" fill="#ffdd88" opacity="0.25" />
      <circle cx="300" cy="100" r="0.5" fill="#ffdd88" opacity="0.2" />
      <circle cx="140" cy="150" r="0.6" fill="#ffdd88" opacity="0.25" />
      <circle cx="320" cy="160" r="0.5" fill="#ffdd88" opacity="0.2" />
      {/* Additional motes */}
      <circle cx="70" cy="75" r="0.5" fill="#ffe8a0" opacity="0.2" />
      <circle cx="220" cy="65" r="0.7" fill="#ffe8a0" opacity="0.22" />
      <circle cx="160" cy="120" r="0.5" fill="#ffe8a0" opacity="0.18" />
      <circle cx="280" cy="140" r="0.6" fill="#ffe8a0" opacity="0.2" />
      <circle cx="350" cy="90" r="0.5" fill="#ffe8a0" opacity="0.15" />
      <circle cx="120" cy="200" r="0.6" fill="#ffe8a0" opacity="0.18" />
    </g>

    {/* ===== WARM LIGHT POOLS (expanded) ===== */}
    {/* Light pool from left wall sconce */}
    <circle cx="45" cy="65" r="24" fill="url(#lampPool)" />
    {/* Light pool from right wall sconce */}
    <circle cx="355" cy="145" r="24" fill="url(#lampPool)" />
    {/* Fireplace warm glow on floor (expanded) */}
    <ellipse cx="200" cy="70" rx="40" ry="18" fill="url(#lampPool)" opacity="0.85" />

    {/* ===== EXTRA FLOOR ITEMS ===== */}
    {/* Small cushion near bookshelf */}
    <ellipse cx="340" cy="155" rx="6" ry="4" fill="#c87880" stroke="#a86068" strokeWidth="0.5" />
    <ellipse cx="340" cy="154" rx="5" ry="3" fill="#d88890" opacity="0.6" />

    {/* Scattered acorn/nut */}
    <circle cx="130" cy="170" r="1.5" fill="#a08040" stroke="#806020" strokeWidth="0.3" />
    <circle cx="135" cy="172" r="1.2" fill="#b09050" stroke="#806020" strokeWidth="0.3" />

    {/* Small rug at kitchen area */}
    <rect x="42" y="85" width="25" height="15" rx="2" fill="#8a7a5a" stroke="#6a5a3a" strokeWidth="0.5" opacity="0.5" />

    {/* Warm ambient overlay (strengthened) */}
    <rect x="30" y="25" width="340" height="200" fill="#ffaa44" opacity="0.05" />
  </g>
);
