import React from 'react';
import styles from './scene.module.css';

/**
 * Isometric tavern/workshop scene inspired by cozy fantasy game art.
 * Stone walls, wooden floors, large cauldron, tables, barrels, crates.
 * Warm color palette with detailed environmental props.
 */
export const House: React.FC = () => {
  return (
    <g>
      <defs>
        {/* Gradients */}
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a574" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8fbc8f" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="stoneWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a09080" />
          <stop offset="100%" stopColor="#887868" />
        </linearGradient>
        <linearGradient id="stoneWallSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#908070" />
          <stop offset="100%" stopColor="#786858" />
        </linearGradient>
        <linearGradient id="woodFloor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b08050" />
          <stop offset="50%" stopColor="#c09060" />
          <stop offset="100%" stopColor="#a07848" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5e3c" />
          <stop offset="100%" stopColor="#6d4c2a" />
        </linearGradient>
        <linearGradient id="cauldronGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4a4a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>
        <radialGradient id="fireGlow" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor="#ff6600" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffdd44" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffdd44" stopOpacity="0" />
        </radialGradient>
        <pattern id="stonePattern" width="12" height="10" patternUnits="userSpaceOnUse">
          <rect width="12" height="10" fill="#998878" />
          <rect x="0" y="0" width="5.5" height="4.5" rx="0.5" fill="#a09080" stroke="#887060" strokeWidth="0.3" />
          <rect x="6" y="0" width="5.5" height="4.5" rx="0.5" fill="#9a8a7a" stroke="#887060" strokeWidth="0.3" />
          <rect x="3" y="5" width="5.5" height="4.5" rx="0.5" fill="#a09888" stroke="#887060" strokeWidth="0.3" />
          <rect x="9" y="5" width="2.5" height="4.5" rx="0.5" fill="#9a8a7a" stroke="#887060" strokeWidth="0.3" />
          <rect x="0" y="5" width="2.5" height="4.5" rx="0.5" fill="#a09080" stroke="#887060" strokeWidth="0.3" />
        </pattern>
        <pattern id="woodPattern" width="20" height="6" patternUnits="userSpaceOnUse">
          <rect width="20" height="6" fill="#b08858" />
          <line x1="0" y1="3" x2="20" y2="3" stroke="#9a7848" strokeWidth="0.3" />
          <line x1="0" y1="0" x2="20" y2="0" stroke="#9a7848" strokeWidth="0.3" />
          <line x1="10" y1="0" x2="10" y2="3" stroke="#9a7848" strokeWidth="0.3" />
          <line x1="0" y1="3" x2="0" y2="6" stroke="#9a7848" strokeWidth="0.3" />
        </pattern>
      </defs>

      {/* ===== GROUND / OUTDOOR AREA ===== */}

      {/* Grass base */}
      <rect x="0" y="130" width="400" height="120" fill="#6b8e4e" />
      <rect x="0" y="130" width="400" height="5" fill="#7da058" opacity="0.5" />

      {/* Cobblestone path */}
      <g>
        {[
          { x: 5, y: 195, rx: 9, ry: 5 },
          { x: 22, y: 200, rx: 8, ry: 4.5 },
          { x: 38, y: 196, rx: 10, ry: 5 },
          { x: 56, y: 201, rx: 8, ry: 4 },
          { x: 72, y: 197, rx: 9, ry: 4.5 },
          { x: 90, y: 202, rx: 10, ry: 5 },
          { x: 108, y: 198, rx: 8, ry: 4 },
          { x: 125, y: 203, rx: 9, ry: 4.5 },
        ].map((s, i) => (
          <ellipse key={`stone-${i}`} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry}
            fill={i % 2 === 0 ? '#b0a898' : '#a89888'} stroke="#8a7a6a" strokeWidth="0.5" />
        ))}
      </g>

      {/* ===== BUILDING - BACK WALL (isometric left face) ===== */}

      {/* Back left wall */}
      <polygon points="60,50 200,50 200,175 60,175" fill="url(#stonePattern)" />
      <polygon points="60,50 200,50 200,175 60,175" fill="url(#stoneWall)" opacity="0.3" />

      {/* Back right wall */}
      <polygon points="200,50 340,80 340,195 200,175" fill="url(#stonePattern)" />
      <polygon points="200,50 340,80 340,195 200,175" fill="url(#stoneWallSide)" opacity="0.4" />

      {/* Wall stone detail lines */}
      {[65, 80, 95, 110, 125, 140, 155].map((y) => (
        <line key={`wl-${y}`} x1="62" y1={y} x2="198" y2={y} stroke="#7a6a5a" strokeWidth="0.3" opacity="0.4" />
      ))}

      {/* Window on back wall */}
      <rect x="100" y="70" width="30" height="25" rx="2" fill="#2a1a0a" stroke="#6d4c2a" strokeWidth="1.5" />
      <line x1="115" y1="70" x2="115" y2="95" stroke="#6d4c2a" strokeWidth="1" />
      <line x1="100" y1="82" x2="130" y2="82" stroke="#6d4c2a" strokeWidth="1" />
      {/* Window glow */}
      <rect x="101" y="71" width="13" height="10" fill="#ffdd88" opacity="0.3" />
      <rect x="116" y="71" width="13" height="10" fill="#ffcc66" opacity="0.2" />

      {/* Second window */}
      <rect x="150" y="70" width="30" height="25" rx="2" fill="#2a1a0a" stroke="#6d4c2a" strokeWidth="1.5" />
      <line x1="165" y1="70" x2="165" y2="95" stroke="#6d4c2a" strokeWidth="1" />
      <line x1="150" y1="82" x2="180" y2="82" stroke="#6d4c2a" strokeWidth="1" />
      <rect x="151" y="71" width="13" height="10" fill="#ffdd88" opacity="0.3" />

      {/* ===== ROOF ===== */}

      {/* Main roof */}
      <polygon points="50,50 130,20 270,20 340,80 200,50 60,50" fill="url(#roofGrad)" />
      <polygon points="50,50 130,20 270,20 340,80 200,50 60,50" fill="#7b4e2c" opacity="0.3" />
      {/* Roof ridge line */}
      <line x1="130" y1="20" x2="270" y2="20" stroke="#5a3a1a" strokeWidth="1.5" />

      {/* Roof tiles suggestion */}
      {[28, 36, 44].map((y) => (
        <g key={`roof-${y}`}>
          <line x1="55" y1={y + 5} x2="195" y2={y + 5} stroke="#6a4020" strokeWidth="0.4" opacity="0.5" />
        </g>
      ))}

      {/* Chimney */}
      <rect x="155" y="5" width="16" height="20" fill="#8a7060" stroke="#6a5040" strokeWidth="1" />
      <rect x="152" y="3" width="22" height="5" rx="1" fill="#7a6050" stroke="#5a4030" strokeWidth="0.5" />
      {/* Smoke */}
      <g className={styles.steam}>
        <circle cx="163" cy="-2" r="3" fill="#c0c0c0" opacity="0.2" />
        <circle cx="160" cy="-8" r="4" fill="#c0c0c0" opacity="0.15" />
        <circle cx="166" cy="-14" r="3" fill="#c0c0c0" opacity="0.1" />
      </g>

      {/* ===== FLOOR ===== */}

      {/* Wooden floor (isometric diamond) */}
      <polygon points="60,175 200,145 340,195 200,220" fill="url(#woodPattern)" />
      <polygon points="60,175 200,145 340,195 200,220" fill="#b08858" opacity="0.3" />

      {/* Floor plank lines */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const t = i / 7;
        const x1 = 60 + (200 - 60) * t;
        const y1 = 175 + (145 - 175) * t;
        const x2 = 200 + (340 - 200) * t;
        const y2 = 220 + (195 - 220) * t;
        return <line key={`fp-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9a7040" strokeWidth="0.4" opacity="0.4" />;
      })}

      {/* ===== FRONT WALL (low stone wall / counter) ===== */}

      {/* Front left low wall */}
      <polygon points="60,175 60,155 140,155 140,175" fill="url(#stonePattern)" />
      <polygon points="60,175 60,155 140,155 140,175" fill="#998878" opacity="0.3" />
      {/* Wall top edge */}
      <polygon points="60,155 140,155 200,145 120,145" fill="#a89888" stroke="#887060" strokeWidth="0.5" />

      {/* Front right low wall with opening */}
      <polygon points="220,175 220,155 340,195 340,175" fill="url(#stonePattern)" />
      <polygon points="220,175 220,155 340,195 340,175" fill="#908070" opacity="0.3" />

      {/* ===== LARGE CAULDRON / COOKING AREA ===== */}

      {/* Fire pit base */}
      <ellipse cx="120" cy="170" rx="22" ry="8" fill="#4a3a2a" />
      {/* Fire glow */}
      <ellipse cx="120" cy="165" rx="18" ry="6" fill="url(#fireGlow)" />
      {/* Fire */}
      <g className={styles.lanternFlicker}>
        <ellipse cx="115" cy="162" rx="4" ry="7" fill="#ff4400" opacity="0.7" />
        <ellipse cx="120" cy="160" rx="5" ry="9" fill="#ff6600" opacity="0.6" />
        <ellipse cx="125" cy="162" rx="4" ry="7" fill="#ff8800" opacity="0.5" />
        <ellipse cx="120" cy="158" rx="3" ry="5" fill="#ffaa00" opacity="0.8" />
      </g>

      {/* Cauldron */}
      <ellipse cx="120" cy="155" rx="20" ry="7" fill="#3a3a3a" />
      <path d="M 100 155 Q 98 170, 108 175 Q 120 178, 132 175 Q 142 170, 140 155"
        fill="url(#cauldronGrad)" stroke="#2a2a2a" strokeWidth="1" />
      {/* Cauldron liquid */}
      <ellipse cx="120" cy="155" rx="18" ry="5.5" fill="#cc8844" opacity="0.8" />
      <ellipse cx="118" cy="154" rx="8" ry="3" fill="#ddaa55" opacity="0.5" />
      {/* Cauldron rim */}
      <ellipse cx="120" cy="153" rx="19" ry="6" fill="none" stroke="#555555" strokeWidth="1.5" />
      {/* Cauldron handles */}
      <path d="M 100 158 Q 96 155, 100 152" fill="none" stroke="#444" strokeWidth="1.5" />
      <path d="M 140 158 Q 144 155, 140 152" fill="none" stroke="#444" strokeWidth="1.5" />

      {/* Ladle */}
      <line x1="128" y1="148" x2="142" y2="135" stroke="#8a7a6a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="142" cy="134" r="3" fill="none" stroke="#8a7a6a" strokeWidth="1.5" />

      {/* Steam from cauldron */}
      <g className={styles.steam}>
        <circle cx="112" cy="145" r="2.5" fill="white" opacity="0.25" />
        <circle cx="120" cy="140" r="3" fill="white" opacity="0.2" />
        <circle cx="128" cy="143" r="2" fill="white" opacity="0.22" />
      </g>

      {/* ===== WOODEN TABLE (right side) ===== */}

      {/* Table top (isometric) */}
      <polygon points="240,148 290,138 330,155 280,165" fill="#b89060" stroke="#8a6840" strokeWidth="0.8" />
      {/* Table legs */}
      <line x1="242" y1="148" x2="242" y2="162" stroke="#8a6840" strokeWidth="2" />
      <line x1="328" y1="155" x2="328" y2="169" stroke="#8a6840" strokeWidth="2" />
      <line x1="278" y1="165" x2="278" y2="179" stroke="#8a6840" strokeWidth="2" />

      {/* Food items on table */}
      {/* Plate */}
      <ellipse cx="260" cy="148" rx="8" ry="3" fill="#e8ddd0" stroke="#c8bdb0" strokeWidth="0.5" />
      <ellipse cx="260" cy="147" rx="5" ry="2" fill="#d4a060" opacity="0.7" />
      {/* Bread loaf */}
      <ellipse cx="280" cy="146" rx="6" ry="3" fill="#d4a060" stroke="#b88040" strokeWidth="0.5" />
      <ellipse cx="280" cy="145" rx="5" ry="2" fill="#ddb070" />
      {/* Cup */}
      <rect x="300" y="143" width="5" height="6" rx="1" fill="#c8b8a0" stroke="#a89880" strokeWidth="0.5" />
      <ellipse cx="302.5" cy="143" rx="2.5" ry="1" fill="#a07040" />
      {/* Second cup */}
      <rect x="310" y="145" width="5" height="6" rx="1" fill="#c8b8a0" stroke="#a89880" strokeWidth="0.5" />

      {/* ===== COUNTER / SHELF (back left) ===== */}

      {/* Wooden counter */}
      <polygon points="65,130 65,110 140,110 140,130" fill="#a07848" stroke="#886838" strokeWidth="0.8" />
      <polygon points="65,110 140,110 150,105 75,105" fill="#b08858" stroke="#886838" strokeWidth="0.5" />

      {/* Bottles on shelf */}
      {[75, 85, 95, 105, 115, 125].map((x, i) => (
        <g key={`bottle-${i}`}>
          <rect x={x} y={100 - (i % 2) * 2} width="4" height="10" rx="1"
            fill={['#558844', '#884422', '#446688', '#aa6633', '#668844', '#884466'][i]}
            stroke="#333" strokeWidth="0.3" />
          <rect x={x + 0.5} y={98 - (i % 2) * 2} width="3" height="3" rx="0.5"
            fill={['#558844', '#884422', '#446688', '#aa6633', '#668844', '#884466'][i]}
            opacity="0.7" />
        </g>
      ))}

      {/* ===== BARRELS ===== */}

      {/* Large barrel (right side) */}
      <g transform="translate(320, 160)">
        <ellipse cx="0" cy="15" rx="12" ry="5" fill="#6a4a2a" />
        <rect x="-12" y="0" width="24" height="15" rx="2" fill="#8a6a3a" stroke="#5a3a1a" strokeWidth="0.8" />
        <ellipse cx="0" cy="0" rx="12" ry="5" fill="#9a7a4a" stroke="#5a3a1a" strokeWidth="0.8" />
        <line x1="-10" y1="5" x2="10" y2="5" stroke="#5a3a1a" strokeWidth="0.5" />
        <line x1="-11" y1="10" x2="11" y2="10" stroke="#5a3a1a" strokeWidth="0.5" />
      </g>

      {/* Small barrel */}
      <g transform="translate(340, 170)">
        <ellipse cx="0" cy="10" rx="8" ry="3.5" fill="#6a4a2a" />
        <rect x="-8" y="0" width="16" height="10" rx="1.5" fill="#8a6a3a" stroke="#5a3a1a" strokeWidth="0.6" />
        <ellipse cx="0" cy="0" rx="8" ry="3.5" fill="#9a7a4a" stroke="#5a3a1a" strokeWidth="0.6" />
      </g>

      {/* ===== CRATES & SACKS ===== */}

      {/* Wooden crate */}
      <g transform="translate(45, 160)">
        <rect x="0" y="0" width="14" height="12" fill="#a08040" stroke="#705020" strokeWidth="0.8" />
        <rect x="-2" y="-2" width="16" height="3" fill="#b09050" stroke="#705020" strokeWidth="0.5" />
        <line x1="2" y1="0" x2="2" y2="12" stroke="#705020" strokeWidth="0.4" />
        <line x1="12" y1="0" x2="12" y2="12" stroke="#705020" strokeWidth="0.4" />
        <line x1="0" y1="6" x2="14" y2="6" stroke="#705020" strokeWidth="0.4" />
      </g>

      {/* Sack */}
      <g transform="translate(30, 175)">
        <ellipse cx="8" cy="8" rx="9" ry="8" fill="#d4c4a4" stroke="#b0a080" strokeWidth="0.8" />
        <path d="M 3 2 Q 8 -2, 13 2" fill="none" stroke="#b0a080" strokeWidth="1" />
        <line x1="6" y1="6" x2="5" y2="10" stroke="#b0a080" strokeWidth="0.3" />
        <line x1="10" y1="6" x2="11" y2="10" stroke="#b0a080" strokeWidth="0.3" />
      </g>

      {/* Second sack */}
      <g transform="translate(355, 185)">
        <ellipse cx="7" cy="7" rx="8" ry="7" fill="#c8b898" stroke="#a89878" strokeWidth="0.8" />
        <path d="M 2 1 Q 7 -2, 12 1" fill="none" stroke="#a89878" strokeWidth="1" />
      </g>

      {/* ===== HANGING LAMP ===== */}

      {/* Lamp over cauldron */}
      <line x1="120" y1="50" x2="120" y2="115" stroke="#5a4a3a" strokeWidth="0.8" />
      <polygon points="112,115 128,115 125,125 115,125" fill="#6a5a3a" stroke="#4a3a2a" strokeWidth="0.5" />
      <circle cx="120" cy="120" r="8" fill="url(#lampGlow)" className={styles.lanternFlicker} />
      <rect x="116" y="118" width="8" height="4" rx="1" fill="#ffcc44" opacity="0.6" />

      {/* Lamp over table */}
      <line x1="270" y1="50" x2="270" y2="108" stroke="#5a4a3a" strokeWidth="0.8" />
      <polygon points="262,108 278,108 276,118 264,118" fill="#6a5a3a" stroke="#4a3a2a" strokeWidth="0.5" />
      <circle cx="270" cy="113" r="8" fill="url(#lampGlow)" className={styles.lanternFlicker} />
      <rect x="266" y="111" width="8" height="4" rx="1" fill="#ffcc44" opacity="0.6" />

      {/* ===== OUTDOOR PROPS ===== */}

      {/* Bush left */}
      <g>
        <circle cx="20" cy="185" r="8" fill="#4a7a3a" />
        <circle cx="12" cy="188" r="6" fill="#5a8a4a" />
        <circle cx="28" cy="187" r="7" fill="#4a7030" />
      </g>

      {/* Small flowers */}
      {[
        { x: 15, y: 205 }, { x: 45, y: 210 }, { x: 370, y: 200 }, { x: 385, y: 195 },
      ].map((f, i) => (
        <g key={`flower-${i}`}>
          <line x1={f.x} y1={f.y} x2={f.x} y2={f.y - 5} stroke="#5a8a3a" strokeWidth="0.8" />
          <circle cx={f.x} cy={f.y - 6} r="2" fill={['#ff8888', '#ffaa44', '#ff88aa', '#ffcc44'][i]} />
          <circle cx={f.x} cy={f.y - 7} r="1" fill={['#ffaaaa', '#ffcc66', '#ffaacc', '#ffee66'][i]} />
        </g>
      ))}

      {/* Grass tufts */}
      {[10, 35, 55, 140, 355, 375, 390].map((x) => (
        <g key={`grass-${x}`} opacity="0.5">
          <path d={`M ${x} ${195 + Math.random() * 10} Q ${x + 2} ${188 + Math.random() * 5}, ${x + 4} ${195 + Math.random() * 10}`}
            fill="none" stroke="#7da058" strokeWidth="1" />
        </g>
      ))}

      {/* ===== WOODEN SIGN ===== */}
      <g transform="translate(150, 190)">
        <rect x="-2" y="0" width="4" height="18" fill="#6a4a2a" />
        <rect x="-14" y="-5" width="28" height="12" rx="2" fill="#b09060" stroke="#6a4a2a" strokeWidth="0.8" />
        <text x="0" y="3" textAnchor="middle" fontSize="6" fill="#3a2a1a" fontWeight="bold" fontFamily="serif">INN</text>
      </g>

      {/* ===== STONE WALL EXTENSION (front right) ===== */}
      <g>
        {/* Low stone wall border */}
        <polygon points="340,195 340,185 395,205 395,215" fill="url(#stonePattern)" />
        <polygon points="340,195 340,185 395,205 395,215" fill="#887868" opacity="0.3" />
        {/* Wall cap stones */}
        <polygon points="340,185 395,205 395,202 340,182" fill="#a89888" stroke="#887060" strokeWidth="0.3" />
      </g>

      {/* ===== WARM AMBIENT LIGHT OVERLAY ===== */}
      <rect x="60" y="100" width="280" height="120" fill="#ffaa44" opacity="0.03" />

      {/* Floating dust/particles in light */}
      <g className={styles.fireflies}>
        <circle cx="100" cy="130" r="0.8" fill="#ffdd88" opacity="0.4" />
        <circle cx="180" cy="120" r="0.6" fill="#ffdd88" opacity="0.3" />
        <circle cx="250" cy="135" r="0.7" fill="#ffdd88" opacity="0.35" />
        <circle cx="300" cy="125" r="0.5" fill="#ffdd88" opacity="0.25" />
        <circle cx="140" cy="140" r="0.6" fill="#ffdd88" opacity="0.3" />
      </g>
    </g>
  );
};
