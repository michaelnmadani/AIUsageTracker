import React from 'react';

/**
 * Top-down room walls: thick border strips on 3 sides, door opening on bottom.
 * Windows with light shafts, baseboard trim.
 */
export const RoomWalls: React.FC = () => (
  <g>
    {/* === Back wall (top) === */}
    <rect x="18" y="12" width="364" height="15" fill="url(#stoneWallPat)" />
    <rect x="18" y="12" width="364" height="15" fill="#8a7a6a" opacity="0.2" />
    {/* Wall top edge highlight */}
    <line x1="18" y1="12" x2="382" y2="12" stroke="#a09080" strokeWidth="1" />

    {/* === Left wall === */}
    <rect x="18" y="12" width="14" height="218" fill="url(#stoneWallPat)" />
    <rect x="18" y="12" width="14" height="218" fill="#7a6a5a" opacity="0.2" />
    {/* Left wall outer edge */}
    <line x1="18" y1="12" x2="18" y2="230" stroke="#a09080" strokeWidth="1" />

    {/* === Right wall === */}
    <rect x="368" y="12" width="14" height="218" fill="url(#stoneWallPat)" />
    <rect x="368" y="12" width="14" height="218" fill="#7a6a5a" opacity="0.2" />
    {/* Right wall outer edge */}
    <line x1="382" y1="12" x2="382" y2="230" stroke="#a09080" strokeWidth="1" />

    {/* === Bottom wall with door opening === */}
    {/* Left section */}
    <rect x="18" y="222" width="160" height="12" fill="url(#stoneWallPat)" />
    <rect x="18" y="222" width="160" height="12" fill="#8a7a6a" opacity="0.2" />
    {/* Right section */}
    <rect x="238" y="222" width="144" height="12" fill="url(#stoneWallPat)" />
    <rect x="238" y="222" width="144" height="12" fill="#8a7a6a" opacity="0.2" />
    {/* Door frame */}
    <rect x="176" y="222" width="3" height="12" fill="#6a4a2a" />
    <rect x="237" y="222" width="3" height="12" fill="#6a4a2a" />
    {/* Door threshold */}
    <rect x="179" y="225" width="58" height="6" fill="#a08050" stroke="#806838" strokeWidth="0.5" />

    {/* === Baseboard trim (inner edges) === */}
    <line x1="32" y1="27" x2="368" y2="27" stroke="#6a4a2a" strokeWidth="1.5" />
    <line x1="32" y1="27" x2="32" y2="222" stroke="#6a4a2a" strokeWidth="1.5" />
    <line x1="368" y1="27" x2="368" y2="222" stroke="#6a4a2a" strokeWidth="1.5" />
    <line x1="32" y1="222" x2="178" y2="222" stroke="#6a4a2a" strokeWidth="1.5" />
    <line x1="238" y1="222" x2="368" y2="222" stroke="#6a4a2a" strokeWidth="1.5" />

    {/* === Windows (back wall) === */}
    {/* Left window */}
    <rect x="80" y="13" width="28" height="13" fill="#7ab8d8" opacity="0.5" />
    {/* Window glass reflection */}
    <line x1="83" y1="14" x2="88" y2="25" stroke="white" strokeWidth="0.4" opacity="0.12" />
    <rect x="80" y="13" width="28" height="13" fill="none" stroke="#6a4a2a" strokeWidth="1.2" />
    <line x1="94" y1="13" x2="94" y2="26" stroke="#6a4a2a" strokeWidth="0.8" />
    <line x1="80" y1="19.5" x2="108" y2="19.5" stroke="#6a4a2a" strokeWidth="0.8" />
    {/* Window light shaft on floor (warmer) */}
    <rect x="78" y="27" width="32" height="25" fill="url(#windowLightWarm)" opacity="0.35" />
    {/* Warm light splash on wall near window */}
    <ellipse cx="94" cy="20" rx="18" ry="6" fill="#ffddaa" opacity="0.04" />

    {/* Right window */}
    <rect x="292" y="13" width="28" height="13" fill="#7ab8d8" opacity="0.5" />
    <line x1="295" y1="14" x2="300" y2="25" stroke="white" strokeWidth="0.4" opacity="0.12" />
    <rect x="292" y="13" width="28" height="13" fill="none" stroke="#6a4a2a" strokeWidth="1.2" />
    <line x1="306" y1="13" x2="306" y2="26" stroke="#6a4a2a" strokeWidth="0.8" />
    <line x1="292" y1="19.5" x2="320" y2="19.5" stroke="#6a4a2a" strokeWidth="0.8" />
    {/* Window light shaft (warmer) */}
    <rect x="290" y="27" width="32" height="25" fill="url(#windowLightWarm)" opacity="0.35" />
    <ellipse cx="306" cy="20" rx="18" ry="6" fill="#ffddaa" opacity="0.04" />

    {/* === Small window (right wall) === */}
    <rect x="369" y="80" width="12" height="22" fill="#7ab8d8" opacity="0.4" />
    <rect x="369" y="80" width="12" height="22" fill="none" stroke="#6a4a2a" strokeWidth="1" />
    <line x1="375" y1="80" x2="375" y2="102" stroke="#6a4a2a" strokeWidth="0.6" />

    {/* Corner details (stone corner blocks) */}
    <rect x="18" y="12" width="5" height="5" fill="#9a8a7a" stroke="#6a5a4a" strokeWidth="0.5" />
    <rect x="377" y="12" width="5" height="5" fill="#9a8a7a" stroke="#6a5a4a" strokeWidth="0.5" />
    <rect x="18" y="225" width="5" height="5" fill="#9a8a7a" stroke="#6a5a4a" strokeWidth="0.5" />
    <rect x="377" y="225" width="5" height="5" fill="#9a8a7a" stroke="#6a5a4a" strokeWidth="0.5" />
  </g>
);
