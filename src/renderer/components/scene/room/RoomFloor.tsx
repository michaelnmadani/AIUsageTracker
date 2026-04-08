import React from 'react';

/**
 * Top-down wooden floor with plank details, rug, and wall shadows.
 * Room interior: x=30..370, y=25..225
 */
export const RoomFloor: React.FC = () => (
  <g>
    {/* Main floor area */}
    <rect x="30" y="25" width="340" height="200" fill="url(#floorWood)" />

    {/* Floor color variation strips (alternating plank tones) */}
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => (
      <rect
        key={`strip-${i}`}
        x="30"
        y={25 + i * 12}
        width="340"
        height="12"
        fill={i % 3 === 0 ? '#c4a060' : i % 3 === 1 ? '#b89050' : '#aa8448'}
        opacity="0.15"
      />
    ))}

    {/* Individual plank joints (horizontal lines) */}
    {[37, 49, 61, 73, 85, 97, 109, 121, 133, 145, 157, 169, 181, 193, 205, 217].map((y) => (
      <line key={`joint-${y}`} x1="30" y1={y} x2="370" y2={y} stroke="#8a6830" strokeWidth="0.4" opacity="0.3" />
    ))}

    {/* Stagger joints (vertical gaps between planks) */}
    {[70, 130, 190, 250, 310].map((x) => (
      <g key={`vj-${x}`}>
        <line x1={x} y1="25" x2={x} y2="225" stroke="#8a6830" strokeWidth="0.3" opacity="0.2" />
      </g>
    ))}

    {/* Wood knots */}
    {[
      { x: 55, y: 45 }, { x: 160, y: 78 }, { x: 280, y: 55 }, { x: 340, y: 120 },
      { x: 95, y: 155 }, { x: 220, y: 195 }, { x: 310, y: 200 }, { x: 140, y: 40 },
    ].map((k, i) => (
      <ellipse key={`knot-${i}`} cx={k.x} cy={k.y} rx="2.5" ry="1.8" fill="#8a6830" opacity="0.2" />
    ))}

    {/* Extra wood grain curves for realism */}
    {[
      { x: 80, y: 70, rx: 8, ry: 2 }, { x: 250, y: 90, rx: 6, ry: 1.5 },
      { x: 320, y: 180, rx: 10, ry: 2.5 }, { x: 120, y: 200, rx: 7, ry: 1.8 },
      { x: 180, y: 48, rx: 5, ry: 1.2 }, { x: 350, y: 60, rx: 6, ry: 1.5 },
    ].map((g, i) => (
      <ellipse key={`grain-${i}`} cx={g.x} cy={g.y} rx={g.rx} ry={g.ry}
        fill="none" stroke="#8a6830" strokeWidth="0.3" opacity="0.15" />
    ))}

    {/* Worn/scuffed area near center (under table) */}
    <ellipse cx="200" cy="130" rx="50" ry="30" fill="#a88040" opacity="0.08" />
    {/* Worn area near kitchen */}
    <ellipse cx="60" cy="75" rx="20" ry="12" fill="#a88040" opacity="0.05" />
    {/* Worn area near door */}
    <ellipse cx="200" cy="215" rx="25" ry="10" fill="#9a7838" opacity="0.06" />

    {/* === Large Decorative Rug (center) === */}
    <rect x="130" y="95" width="140" height="80" rx="3" fill="url(#rugPattern)" />
    {/* Rug border */}
    <rect x="130" y="95" width="140" height="80" rx="3" fill="none" stroke="#6a2828" strokeWidth="2" />
    {/* Inner border */}
    <rect x="135" y="100" width="130" height="70" rx="2" fill="none" stroke="#d4a060" strokeWidth="1" opacity="0.6" />
    {/* Rug fringe (top) */}
    {[132, 138, 144, 150, 156, 162, 168, 174, 180, 186, 192, 198, 204, 210, 216, 222, 228, 234, 240, 246, 252, 258, 264].map((x) => (
      <line key={`ft-${x}`} x1={x} y1="95" x2={x} y2="91" stroke="#8b3a3a" strokeWidth="0.8" opacity="0.5" />
    ))}
    {/* Rug fringe (bottom) */}
    {[132, 138, 144, 150, 156, 162, 168, 174, 180, 186, 192, 198, 204, 210, 216, 222, 228, 234, 240, 246, 252, 258, 264].map((x) => (
      <line key={`fb-${x}`} x1={x} y1="175" x2={x} y2="179" stroke="#8b3a3a" strokeWidth="0.8" opacity="0.5" />
    ))}
    {/* Rug diamond pattern center */}
    <polygon points="200,115 220,135 200,155 180,135" fill="none" stroke="#d4a060" strokeWidth="1" opacity="0.4" />
    <polygon points="200,122 212,135 200,148 188,135" fill="#c46050" opacity="0.25" />

    {/* Small mat near door */}
    <rect x="180" y="210" width="40" height="15" rx="2" fill="#a08860" stroke="#806840" strokeWidth="0.8" />
    <text x="200" y="220" textAnchor="middle" fontSize="4" fill="#604828" fontWeight="bold">WELCOME</text>

    {/* Wall shadow overlay (inner shadow effect from walls) */}
    <rect x="30" y="25" width="340" height="8" fill="url(#windowLight)" transform="rotate(180, 200, 29)" opacity="0.4" />
    <rect x="30" y="25" width="8" height="200" fill="#5a4030" opacity="0.06" />
    <rect x="362" y="25" width="8" height="200" fill="#5a4030" opacity="0.06" />
  </g>
);
