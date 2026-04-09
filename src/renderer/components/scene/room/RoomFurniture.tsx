import React from 'react';
import styles from '../scene.module.css';

/**
 * Top-down furniture: kitchen, table, bookshelf, barrels, bed area, desk.
 */
export const RoomFurniture: React.FC = () => (
  <g>
    {/* ===== FIREPLACE (center back wall) ===== */}
    <rect x="175" y="27" width="50" height="28" fill="#5a4a3a" stroke="#4a3a2a" strokeWidth="1" />
    {/* Fireplace stone surround */}
    <rect x="172" y="27" width="56" height="4" fill="#9a8a7a" stroke="#6a5a4a" strokeWidth="0.5" />
    <rect x="172" y="27" width="3" height="28" fill="#9a8a7a" />
    <rect x="225" y="27" width="3" height="28" fill="#9a8a7a" />
    {/* Fire */}
    <g className={styles.lanternFlicker}>
      <ellipse cx="200" cy="42" rx="10" ry="5" fill="url(#fireGlow2)" />
      <ellipse cx="197" cy="42" rx="4" ry="3" fill="#ff4400" opacity="0.7" />
      <ellipse cx="203" cy="41" rx="3" ry="4" fill="#ff6600" opacity="0.6" />
      <ellipse cx="200" cy="40" rx="2" ry="2" fill="#ffaa00" opacity="0.8" />
    </g>
    {/* Logs */}
    <line x1="190" y1="47" x2="210" y2="47" stroke="#6a4a2a" strokeWidth="3" strokeLinecap="round" />
    <line x1="192" y1="50" x2="208" y2="50" stroke="#7a5a3a" strokeWidth="2.5" strokeLinecap="round" />
    {/* Warm glow on floor (expanded) */}
    <circle cx="200" cy="60" r="30" fill="url(#warmGlow)" opacity="0.45" />
    {/* Orange glow on stone surround */}
    <rect x="172" y="30" width="56" height="25" fill="#ff8844" opacity="0.04" />
    {/* Mantel shelf */}
    <rect x="170" y="55" width="60" height="3" fill="#8a6a3a" stroke="#6a4a2a" strokeWidth="0.5" />
    {/* Items on mantel */}
    <rect x="178" y="52" width="5" height="4" fill="#c4a060" stroke="#a08040" strokeWidth="0.3" /> {/* clock */}
    <circle cx="195" cy="53" r="2" fill="#e8d0a0" stroke="#c4a060" strokeWidth="0.3" /> {/* plate */}
    <rect x="212" y="51" width="3" height="5" rx="0.5" fill="#558844" stroke="#336622" strokeWidth="0.3" /> {/* vase */}
    <circle cx="222" cy="53" r="1.5" fill="#cc6644" /> {/* candle */}

    {/* ===== KITCHEN AREA (top-left) ===== */}
    {/* Counter */}
    <rect x="34" y="30" width="45" height="18" rx="1" fill="#a08050" stroke="#7a5a30" strokeWidth="1" filter="url(#shadow)" />
    {/* Bottles on counter */}
    {[38, 44, 50, 56, 62, 68].map((x, i) => (
      <g key={`kb-${i}`}>
        <rect x={x} y={32 + (i % 2)} width="3" height="6" rx="0.5"
          fill={['#558844', '#884422', '#446688', '#aa6633', '#668844', '#884466'][i]}
          stroke="#333" strokeWidth="0.3" />
        {/* Bottle label */}
        <rect x={x + 0.5} y={34 + (i % 2)} width="2" height="2" rx="0.2" fill="white" opacity="0.2" />
      </g>
    ))}
    {/* Hanging pots/pans above counter */}
    <circle cx="48" cy="28" r="4" fill="none" stroke="#6a6a6a" strokeWidth="1" />
    <circle cx="58" cy="27" r="3.5" fill="none" stroke="#5a5a5a" strokeWidth="1" />
    <line x1="48" y1="25" x2="48" y2="24" stroke="#888" strokeWidth="0.5" />
    <line x1="58" y1="25" x2="58" y2="23.5" stroke="#888" strokeWidth="0.5" />
    {/* Cutting board */}
    <rect x="40" y="52" width="14" height="10" rx="1" fill="#c4a060" stroke="#a08040" strokeWidth="0.5" />
    <ellipse cx="47" cy="55" rx="3" ry="2" fill="#dd6644" opacity="0.5" /> {/* tomato */}
    <rect x="43" y="58" width="8" height="1" fill="#88aa44" /> {/* herbs */}
    {/* Stack of dishes near kitchen */}
    <g>
      <ellipse cx="82" cy="52" rx="5" ry="3" fill="#e8ddd0" stroke="#c8bdb0" strokeWidth="0.4" />
      <ellipse cx="82" cy="51" rx="4.5" ry="2.8" fill="#e4d8c8" stroke="#c8bdb0" strokeWidth="0.3" />
      <ellipse cx="82" cy="50" rx="4" ry="2.5" fill="#e0d4c4" stroke="#c8bdb0" strokeWidth="0.3" />
    </g>

    {/* Cauldron/stove */}
    <circle cx="60" cy="75" r="14" fill="#4a4a4a" stroke="#3a3a3a" strokeWidth="1.5" filter="url(#shadow)" />
    <circle cx="60" cy="75" r="11" fill="#3a3a3a" />
    <circle cx="60" cy="75" r="8" fill="#cc8844" opacity="0.7" /> {/* soup */}
    <circle cx="58" cy="73" r="4" fill="#ddaa55" opacity="0.4" />
    {/* Cauldron rim */}
    <circle cx="60" cy="75" r="12" fill="none" stroke="#555" strokeWidth="1.2" />
    {/* Steam */}
    <g className={styles.steam}>
      <circle cx="55" cy="65" r="2" fill="white" opacity="0.25" />
      <circle cx="60" cy="62" r="2.5" fill="white" opacity="0.2" />
      <circle cx="65" cy="66" r="1.8" fill="white" opacity="0.22" />
    </g>
    {/* Stove glow */}
    <circle cx="60" cy="75" r="18" fill="url(#warmGlow)" opacity="0.25" />

    {/* ===== CENTRAL DINING TABLE ===== */}
    <ellipse cx="200" cy="135" rx="45" ry="25" fill="#b89060" stroke="#8a6840" strokeWidth="1.5" filter="url(#shadow)" />
    {/* Table cloth (half covering) */}
    <ellipse cx="200" cy="132" rx="35" ry="18" fill="url(#clothCheck)" stroke="#c4b090" strokeWidth="0.5" opacity="0.6" />
    {/* Table grain lines */}
    <ellipse cx="200" cy="135" rx="40" ry="21" fill="none" stroke="#9a7040" strokeWidth="0.4" opacity="0.3" />
    <ellipse cx="200" cy="135" rx="30" ry="15" fill="none" stroke="#9a7040" strokeWidth="0.3" opacity="0.2" />
    {/* Items on table */}
    <ellipse cx="185" cy="128" rx="6" ry="4" fill="#e8ddd0" stroke="#c8bdb0" strokeWidth="0.4" /> {/* plate */}
    <ellipse cx="185" cy="127" rx="3.5" ry="2" fill="#d4a060" opacity="0.5" /> {/* food */}
    <ellipse cx="215" cy="130" rx="5" ry="3.5" fill="#e8ddd0" stroke="#c8bdb0" strokeWidth="0.4" /> {/* plate2 */}
    <ellipse cx="215" cy="129" rx="3" ry="2" fill="#cc6644" opacity="0.4" /> {/* food on plate2 */}
    <ellipse cx="195" cy="140" rx="5" ry="3" fill="#d4a060" stroke="#b88040" strokeWidth="0.4" /> {/* bread */}
    <ellipse cx="195" cy="139" rx="2.5" ry="1.5" fill="#e8c080" opacity="0.4" /> {/* bread highlight */}
    <rect x="207" y="126" width="4" height="5" rx="0.8" fill="#c8b090" stroke="#a89070" strokeWidth="0.3" /> {/* mug */}
    <rect x="178" y="138" width="4" height="5" rx="0.8" fill="#c8b090" stroke="#a89070" strokeWidth="0.3" /> {/* mug2 */}
    {/* Flower vase on table */}
    <rect x="220" y="136" width="4" height="7" rx="1" fill="#88aacc" stroke="#6088aa" strokeWidth="0.4" />
    <line x1="222" y1="136" x2="222" y2="130" stroke="#5a8a3a" strokeWidth="0.8" />
    <circle cx="220" cy="129" r="2" fill="#e888aa" opacity="0.7" />
    <circle cx="224" cy="130" r="1.8" fill="#e8aa88" opacity="0.6" />
    {/* Candle holder (center) */}
    <circle cx="200" cy="135" r="3" fill="#c4a060" stroke="#a08040" strokeWidth="0.5" />
    <circle cx="200" cy="135" r="1.2" fill="#ffdd66" />
    <circle cx="200" cy="135" r="4" fill="#ffdd44" opacity="0.15" className={styles.lanternFlicker} />
    {/* Table warm glow from candle */}
    <circle cx="200" cy="135" r="20" fill="url(#lampPool)" />
    {/* Stools */}
    {[
      { x: 200, y: 108 }, { x: 200, y: 162 },
      { x: 155, y: 135 }, { x: 245, y: 135 },
    ].map((s, i) => (
      <g key={`stool-${i}`}>
        <circle cx={s.x} cy={s.y} r="6" fill="#a08050" stroke="#7a5a30" strokeWidth="0.8" />
        <circle cx={s.x} cy={s.y} r="4" fill="#b89060" />
      </g>
    ))}

    {/* ===== DESK AREA (top-right) ===== */}
    <rect x="310" y="30" width="50" height="24" rx="1" fill="#a08050" stroke="#7a5a30" strokeWidth="1" filter="url(#shadow)" />
    {/* Scroll/paper */}
    <rect x="316" y="33" width="18" height="14" rx="1" fill="#f0e4c8" stroke="#c4a882" strokeWidth="0.5" />
    <line x1="319" y1="37" x2="330" y2="37" stroke="#8d6e63" strokeWidth="0.5" opacity="0.4" />
    <line x1="319" y1="40" x2="332" y2="40" stroke="#8d6e63" strokeWidth="0.5" opacity="0.4" />
    <line x1="319" y1="43" x2="328" y2="43" stroke="#8d6e63" strokeWidth="0.5" opacity="0.4" />
    {/* Ink pot */}
    <circle cx="340" cy="38" r="2.5" fill="#2a1a0a" stroke="#1a0a00" strokeWidth="0.4" />
    {/* Quill */}
    <line x1="342" y1="36" x2="350" y2="28" stroke="#6d4c2a" strokeWidth="0.8" />
    {/* Desk candle */}
    <circle cx="352" cy="36" r="1.5" fill="#ffdd66" />
    <circle cx="352" cy="36" r="5" fill="#ffdd44" opacity="0.1" className={styles.lanternFlicker} />
    {/* Chair */}
    <rect x="320" y="56" width="12" height="12" rx="2" fill="#a08050" stroke="#7a5a30" strokeWidth="0.8" />

    {/* ===== BOOKSHELF (right wall) ===== */}
    <rect x="350" y="110" width="16" height="50" fill="#8a6a3a" stroke="#6a4a2a" strokeWidth="1" />
    {/* Shelf dividers */}
    <line x1="350" y1="122" x2="366" y2="122" stroke="#6a4a2a" strokeWidth="0.8" />
    <line x1="350" y1="135" x2="366" y2="135" stroke="#6a4a2a" strokeWidth="0.8" />
    <line x1="350" y1="148" x2="366" y2="148" stroke="#6a4a2a" strokeWidth="0.8" />
    {/* Book spines */}
    {[112, 114, 116, 118, 120].map((y, i) => (
      <rect key={`b1-${i}`} x="352" y={y} width="3" height="9" fill={['#cc4444', '#4488cc', '#44aa66', '#cc8844', '#8844aa'][i]} opacity="0.8" />
    ))}
    {[124, 126, 128, 130, 132].map((y, i) => (
      <rect key={`b2-${i}`} x="352" y={y} width="3" height="9" fill={['#4466aa', '#aa6644', '#66aa44', '#aa4466', '#6644aa'][i]} opacity="0.8" />
    ))}
    {[137, 139, 141, 144].map((y, i) => (
      <rect key={`b3-${i}`} x="352" y={y} width="3" height="9" fill={['#886644', '#448866', '#664488', '#aa8844'][i]} opacity="0.8" />
    ))}

    {/* ===== BARRELS & STORAGE (bottom-left) ===== */}
    {/* Large barrel */}
    <circle cx="55" cy="190" r="10" fill="#9a7a4a" stroke="#6a4a2a" strokeWidth="1" />
    <circle cx="55" cy="190" r="7" fill="#8a6a3a" />
    <line x1="45" y1="190" x2="65" y2="190" stroke="#5a3a1a" strokeWidth="0.6" />
    {/* Small barrel */}
    <circle cx="75" cy="195" r="7" fill="#9a7a4a" stroke="#6a4a2a" strokeWidth="0.8" />
    <circle cx="75" cy="195" r="5" fill="#8a6a3a" />
    {/* Crates */}
    <rect x="38" y="205" width="14" height="12" fill="#a08040" stroke="#705020" strokeWidth="0.8" />
    <line x1="40" y1="205" x2="40" y2="217" stroke="#705020" strokeWidth="0.4" />
    <line x1="50" y1="205" x2="50" y2="217" stroke="#705020" strokeWidth="0.4" />
    <line x1="38" y1="211" x2="52" y2="211" stroke="#705020" strokeWidth="0.4" />
    {/* Sack */}
    <ellipse cx="68" cy="212" rx="8" ry="6" fill="#d4c4a4" stroke="#b0a080" strokeWidth="0.8" />
    <path d="M 63 208 Q 68 205, 73 208" fill="none" stroke="#b0a080" strokeWidth="0.8" />

    {/* ===== BED/CUSHION AREA (bottom-right) ===== */}
    <rect x="305" y="175" width="55" height="35" rx="4" fill="#b8705a" stroke="#986048" strokeWidth="1" />
    {/* Blanket */}
    <rect x="308" y="178" width="49" height="29" rx="3" fill="#cc8870" />
    <rect x="308" y="178" width="49" height="10" rx="3" fill="#d4a090" /> {/* fold */}
    {/* Pillow */}
    <ellipse cx="332" cy="182" rx="12" ry="6" fill="#e8d8c0" stroke="#c4b8a0" strokeWidth="0.5" />
    {/* Paw prints on blanket */}
    <circle cx="325" cy="195" r="1" fill="#a06048" opacity="0.3" />
    <circle cx="340" cy="198" r="1" fill="#a06048" opacity="0.3" />
  </g>
);
