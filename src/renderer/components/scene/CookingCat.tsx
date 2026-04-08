import React from 'react';
import styles from './scene.module.css';

interface CookingCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style cream cat with chef hat and apron, stirring a pot.
 * Shown when Claude is processing/generating.
 */
export const CookingCat: React.FC<CookingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.cookingCat}>
      {/* Ground shadow */}
      <ellipse cx="22" cy="82" rx="18" ry="4" fill="#3a2a1a" opacity="0.18" />

      {/* Steam from pot */}
      <g className={styles.steam}>
        <circle cx="48" cy="40" r="2.5" fill="#e8ddd0" opacity="0.3" />
        <circle cx="52" cy="33" r="3" fill="#e8ddd0" opacity="0.22" />
        <circle cx="45" cy="28" r="2" fill="#e8ddd0" opacity="0.18" />
      </g>

      {/* Tail (behind body) */}
      <path d="M 3 72 Q -8 58, -4 44 Q -2 38, 2 36" fill="none" stroke="url(#furCream)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 3 72 Q -8 58, -4 44 Q -2 38, 2 36" fill="none" stroke="#c4a888" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
      {/* Tail tip tuft */}
      <circle cx="2" cy="35" r="3" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.5" opacity="0.7" />

      {/* Body with apron */}
      <ellipse cx="20" cy="64" rx="15" ry="14" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      {/* Apron - white with frilly top */}
      <path d="M 10 54 Q 20 50, 30 54 L 32 78 Q 20 82, 8 78 Z" fill="#fff8f2" stroke="#e0d0c0" strokeWidth="0.8" />
      {/* Apron waist bow */}
      <path d="M 12 56 Q 8 54, 6 56 Q 8 58, 12 56" fill="#ff8888" stroke="#e06060" strokeWidth="0.4" />
      <path d="M 28 56 Q 32 54, 34 56 Q 32 58, 28 56" fill="#ff8888" stroke="#e06060" strokeWidth="0.4" />
      <circle cx="20" cy="56" r="1.5" fill="#ff8888" />
      {/* Apron heart pocket */}
      <path d="M 18 64 Q 16 62, 18 60 Q 20 58, 22 60 Q 24 62, 22 64 L 20 67 Z" fill="#ffcccc" stroke="#e0a0a0" strokeWidth="0.4" />
      {/* Apron frill at bottom */}
      <path d="M 8 76 Q 10 74, 14 76 Q 16 74, 20 76 Q 22 74, 26 76 Q 28 74, 32 76" fill="none" stroke="#e0d0c0" strokeWidth="0.8" />

      {/* Head (larger, chibi proportion) */}
      <circle cx="20" cy="38" r="16" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      {/* Forehead fur tuft */}
      <path d="M 16 23 Q 18 20, 20 23 Q 22 20, 24 23" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.6" />

      {/* Ears - tall with inner detail */}
      <polygon points="6,28 0,12 14,24" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      <polygon points="8,26 4,17 13,25" fill="#f0b8a8" opacity="0.6" />
      <line x1="6" y1="22" x2="10" y2="25" stroke="#e8a898" strokeWidth="0.4" opacity="0.5" />
      <polygon points="34,28 40,12 26,24" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      <polygon points="32,26 36,17 27,25" fill="#f0b8a8" opacity="0.6" />
      <line x1="34" y1="22" x2="30" y2="25" stroke="#e8a898" strokeWidth="0.4" opacity="0.5" />

      {/* Chef hat - detailed with poof and band */}
      <ellipse cx="20" cy="24" rx="12" ry="3" fill="#fff8f0" stroke="#d4c4b0" strokeWidth="0.6" />
      <rect x="10" y="15" width="20" height="10" rx="8" fill="#fff8f0" stroke="#d4c4b0" strokeWidth="0.6" />
      <path d="M 12 16 Q 20 8, 28 16" fill="#fff8f0" stroke="#d4c4b0" strokeWidth="0.5" />
      {/* Hat band */}
      <rect x="10" y="22" width="20" height="2.5" rx="1" fill="#ff8888" opacity="0.4" />

      {/* Eyes - large anime style */}
      <ellipse cx="13" cy="37" rx="3.5" ry="4.5" fill="white" stroke="#8a7060" strokeWidth="0.5" />
      <ellipse cx="13" cy="38" rx="2.8" ry="3.5" fill="url(#irisAmber)" />
      <ellipse cx="13" cy="39" rx="1.8" ry="2.2" fill="#3a2a1a" />
      <circle cx="11.5" cy="36.5" r="1.2" fill="white" opacity="0.9" />
      <circle cx="14" cy="39" r="0.6" fill="white" opacity="0.5" />
      {/* Eyelash */}
      <path d="M 9.5 34 Q 11 33, 13 33.5" fill="none" stroke="#5a4030" strokeWidth="0.6" />

      <ellipse cx="27" cy="37" rx="3.5" ry="4.5" fill="white" stroke="#8a7060" strokeWidth="0.5" />
      <ellipse cx="27" cy="38" rx="2.8" ry="3.5" fill="url(#irisAmber)" />
      <ellipse cx="27" cy="39" rx="1.8" ry="2.2" fill="#3a2a1a" />
      <circle cx="25.5" cy="36.5" r="1.2" fill="white" opacity="0.9" />
      <circle cx="28" cy="39" r="0.6" fill="white" opacity="0.5" />
      <path d="M 23.5 34 Q 25 33, 27 33.5" fill="none" stroke="#5a4030" strokeWidth="0.6" />

      {/* Blush marks */}
      <ellipse cx="9" cy="42" rx="3" ry="2" fill="url(#blushMark)" />
      <ellipse cx="31" cy="42" rx="3" ry="2" fill="url(#blushMark)" />

      {/* Nose - small triangle */}
      <path d="M 19 44 L 20 42.5 L 21 44 Z" fill="#e8a898" />
      {/* Mouth - happy curve */}
      <path d="M 17 45 Q 20 47.5, 23 45" fill="none" stroke="#8d6e63" strokeWidth="0.7" />

      {/* Whiskers */}
      <line x1="5" y1="42" x2="14" y2="43" stroke="#c4a888" strokeWidth="0.4" opacity="0.4" />
      <line x1="4" y1="45" x2="14" y2="44.5" stroke="#c4a888" strokeWidth="0.4" opacity="0.4" />
      <line x1="26" y1="43" x2="35" y2="42" stroke="#c4a888" strokeWidth="0.4" opacity="0.4" />
      <line x1="26" y1="44.5" x2="36" y2="45" stroke="#c4a888" strokeWidth="0.4" opacity="0.4" />

      {/* Arm/paw holding ladle */}
      <g className={styles.stirring}>
        <line x1="32" y1="56" x2="50" y2="48" stroke="#8d6e63" strokeWidth="2.5" strokeLinecap="round" />
        {/* Ladle bowl */}
        <ellipse cx="52" cy="47" rx="4" ry="2.5" fill="#8a8a8a" stroke="#6a6a6a" strokeWidth="0.5" />
        {/* Paw */}
        <ellipse cx="34" cy="56" rx="5" ry="4" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.8" />
        {/* Toe beans */}
        <circle cx="32" cy="55" r="0.8" fill="#e8b0a0" opacity="0.5" />
        <circle cx="34" cy="54" r="0.8" fill="#e8b0a0" opacity="0.5" />
        <circle cx="36" cy="55" r="0.8" fill="#e8b0a0" opacity="0.5" />
      </g>
    </g>
  );
};
