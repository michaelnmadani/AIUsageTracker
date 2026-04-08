import React from 'react';
import styles from './scene.module.css';

interface CookingCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style cream cat with chef hat and apron, stirring a pot.
 */
export const CookingCat: React.FC<CookingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.cookingCat}>
      {/* Ground shadow */}
      <ellipse cx="22" cy="96" rx="18" ry="4" fill="#3a2a1a" opacity="0.18" />

      {/* Steam from pot */}
      <g className={styles.steam}>
        <circle cx="50" cy="42" r="2.5" fill="#e8ddd0" opacity="0.3" />
        <circle cx="54" cy="34" r="3" fill="#e8ddd0" opacity="0.22" />
        <circle cx="47" cy="28" r="2" fill="#e8ddd0" opacity="0.18" />
      </g>

      {/* Tail (behind body, fluffy) */}
      <path d="M 3 80 Q -10 64, -5 48 Q -2 40, 3 37" fill="none" stroke="url(#furCream)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 3 80 Q -10 64, -5 48 Q -2 40, 3 37" fill="none" stroke="#c4a888" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
      <ellipse cx="3" cy="36" rx="3.5" ry="3" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.4" opacity="0.7" />

      {/* Legs */}
      {/* Left leg */}
      <path d="M 13 76 L 12 88 Q 12 92, 9 92 L 9 93 Q 9 95, 15 95 Q 17 95, 17 92 L 17 88 L 16 76" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.7" />
      {/* Right leg */}
      <path d="M 23 76 L 22 88 Q 22 92, 19 92 L 19 93 Q 19 95, 25 95 Q 27 95, 27 92 L 27 88 L 26 76" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.7" />
      {/* Shoes */}
      <ellipse cx="13" cy="94" rx="5" ry="2.5" fill="#8b5e3c" stroke="#6d4228" strokeWidth="0.5" />
      <ellipse cx="25" cy="94" rx="5" ry="2.5" fill="#8b5e3c" stroke="#6d4228" strokeWidth="0.5" />
      {/* Shoe bows */}
      <circle cx="13" cy="93" r="1" fill="#ff8888" />
      <circle cx="25" cy="93" r="1" fill="#ff8888" />
      {/* Socks */}
      <rect x="11" y="86" width="6" height="6" rx="2" fill="white" stroke="#e0d0c0" strokeWidth="0.3" />
      <rect x="21" y="86" width="6" height="6" rx="2" fill="white" stroke="#e0d0c0" strokeWidth="0.3" />

      {/* Body / dress shape */}
      <path d="M 6 52 Q 4 58, 5 66 Q 6 76, 10 78 Q 20 82, 30 78 Q 34 76, 35 66 Q 36 58, 34 52 Q 28 48, 20 48 Q 12 48, 6 52 Z" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      {/* Body shading (left side) */}
      <path d="M 6 52 Q 4 58, 5 66 Q 6 72, 8 76 Q 10 68, 10 56 Q 12 50, 6 52" fill="#c4a888" opacity="0.08" />

      {/* Apron over dress */}
      <path d="M 10 53 Q 20 50, 30 53 L 32 78 Q 20 82, 8 78 Z" fill="#fff8f2" stroke="#e0d0c0" strokeWidth="0.8" />
      {/* Apron waist bow */}
      <path d="M 11 55 Q 7 53, 5 55 Q 7 57, 11 55" fill="#ff8888" stroke="#e06060" strokeWidth="0.4" />
      <path d="M 29 55 Q 33 53, 35 55 Q 33 57, 29 55" fill="#ff8888" stroke="#e06060" strokeWidth="0.4" />
      <circle cx="20" cy="55" r="1.8" fill="#ff8888" stroke="#e06060" strokeWidth="0.3" />
      {/* Apron heart pocket */}
      <path d="M 18 63 Q 16 61, 18 59 Q 20 57, 22 59 Q 24 61, 22 63 L 20 66 Z" fill="#ffcccc" stroke="#e0a0a0" strokeWidth="0.4" />
      {/* Apron lace trim at bottom */}
      <path d="M 8 76 Q 10 74, 13 76 Q 15 74, 18 76 Q 20 74, 23 76 Q 25 74, 28 76 Q 30 74, 32 76" fill="none" stroke="#e8ddd0" strokeWidth="1" />
      {/* Apron fold lines */}
      <path d="M 14 58 L 13 72" fill="none" stroke="#e0d0c0" strokeWidth="0.3" opacity="0.5" />
      <path d="M 26 58 L 27 72" fill="none" stroke="#e0d0c0" strokeWidth="0.3" opacity="0.5" />

      {/* Head (large chibi) */}
      <circle cx="20" cy="36" r="17" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      {/* Head shading */}
      <path d="M 5 30 Q 3 36, 5 42 Q 8 38, 8 32 Q 6 28, 5 30" fill="#c4a888" opacity="0.06" />

      {/* Hair tufts - styled bangs */}
      <path d="M 12 20 Q 14 15, 17 20 Q 18 14, 20 19 Q 22 14, 23 20 Q 26 15, 28 20" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.6" />
      {/* Side hair wisps */}
      <path d="M 4 32 Q 2 28, 4 25" fill="none" stroke="#e8d8c0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 36 32 Q 38 28, 36 25" fill="none" stroke="#e8d8c0" strokeWidth="1.5" strokeLinecap="round" />

      {/* Ears */}
      <path d="M 6,27 Q 2,18 0,10 Q 4,14 14,24" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      <path d="M 8,25 Q 5,18 4,14 Q 6,16 13,24" fill="#f0b8a8" opacity="0.55" />
      <path d="M 34,27 Q 38,18 40,10 Q 36,14 26,24" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      <path d="M 32,25 Q 35,18 36,14 Q 34,16 27,24" fill="#f0b8a8" opacity="0.55" />

      {/* Chef hat */}
      <ellipse cx="20" cy="22" rx="13" ry="3.5" fill="#fff8f0" stroke="#d4c4b0" strokeWidth="0.6" />
      <path d="M 9 22 Q 9 14, 14 10 Q 18 6, 20 6 Q 22 6, 26 10 Q 31 14, 31 22" fill="#fff8f0" stroke="#d4c4b0" strokeWidth="0.5" />
      {/* Hat poof detail */}
      <path d="M 14 10 Q 17 5, 20 8 Q 23 5, 26 10" fill="#fff8f0" stroke="#e8ddd0" strokeWidth="0.4" />
      <rect x="9" y="20" width="22" height="3" rx="1" fill="#ff8888" opacity="0.35" />

      {/* Eyes - large anime style with upper lid weight */}
      <ellipse cx="13" cy="35" rx="4" ry="5" fill="white" stroke="#8a7060" strokeWidth="0.5" />
      <ellipse cx="13" cy="36" rx="3.2" ry="4" fill="url(#irisAmber)" />
      <ellipse cx="13" cy="37" rx="2" ry="2.5" fill="#2a1a0a" />
      <circle cx="11.2" cy="34" r="1.4" fill="white" opacity="0.9" />
      <circle cx="14.5" cy="37" r="0.7" fill="white" opacity="0.5" />
      {/* Upper eyelid (thick) */}
      <path d="M 9 31.5 Q 11 30, 13 30.5 Q 15 31, 17 31.5" fill="none" stroke="#5a4030" strokeWidth="1.2" strokeLinecap="round" />
      {/* Lower lash */}
      <path d="M 10 39.5 Q 13 40.5, 16 39.5" fill="none" stroke="#8a7060" strokeWidth="0.3" />

      <ellipse cx="27" cy="35" rx="4" ry="5" fill="white" stroke="#8a7060" strokeWidth="0.5" />
      <ellipse cx="27" cy="36" rx="3.2" ry="4" fill="url(#irisAmber)" />
      <ellipse cx="27" cy="37" rx="2" ry="2.5" fill="#2a1a0a" />
      <circle cx="25.2" cy="34" r="1.4" fill="white" opacity="0.9" />
      <circle cx="28.5" cy="37" r="0.7" fill="white" opacity="0.5" />
      <path d="M 23 31.5 Q 25 30, 27 30.5 Q 29 31, 31 31.5" fill="none" stroke="#5a4030" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 24 39.5 Q 27 40.5, 30 39.5" fill="none" stroke="#8a7060" strokeWidth="0.3" />

      {/* Blush marks */}
      <ellipse cx="8" cy="41" rx="3.5" ry="2" fill="url(#blushMark)" />
      <ellipse cx="32" cy="41" rx="3.5" ry="2" fill="url(#blushMark)" />

      {/* Nose */}
      <path d="M 19 43 L 20 41.5 L 21 43 Z" fill="#e8a898" />
      {/* Mouth */}
      <path d="M 17 44 Q 20 46.5, 23 44" fill="none" stroke="#8d6e63" strokeWidth="0.7" />

      {/* Whiskers */}
      <line x1="4" y1="41" x2="13" y2="42" stroke="#c4a888" strokeWidth="0.4" opacity="0.35" />
      <line x1="3" y1="44" x2="13" y2="43.5" stroke="#c4a888" strokeWidth="0.4" opacity="0.35" />
      <line x1="27" y1="42" x2="36" y2="41" stroke="#c4a888" strokeWidth="0.4" opacity="0.35" />
      <line x1="27" y1="43.5" x2="37" y2="44" stroke="#c4a888" strokeWidth="0.4" opacity="0.35" />

      {/* Arm/paw with ladle */}
      <g className={styles.stirring}>
        <line x1="34" y1="56" x2="52" y2="48" stroke="#8d6e63" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="54" cy="47" rx="4.5" ry="2.5" fill="#8a8a8a" stroke="#6a6a6a" strokeWidth="0.6" />
        <ellipse cx="35" cy="56" rx="5.5" ry="4" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.8" />
        <circle cx="33" cy="55" r="0.9" fill="#e8b0a0" opacity="0.5" />
        <circle cx="35" cy="54" r="0.9" fill="#e8b0a0" opacity="0.5" />
        <circle cx="37" cy="55" r="0.9" fill="#e8b0a0" opacity="0.5" />
      </g>
    </g>
  );
};
