import React from 'react';
import styles from './scene.module.css';

interface SleepingCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style cream cat curled up sleeping with nightcap and blanket.
 * Shown when Claude is idle.
 */
export const SleepingCat: React.FC<SleepingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.sleepingCat}>
      {/* Ground shadow */}
      <ellipse cx="30" cy="74" rx="24" ry="5" fill="#3a2a1a" opacity="0.15" />

      {/* Cushion - detailed with tassels */}
      <ellipse cx="30" cy="70" rx="28" ry="10" fill="#c87060" stroke="#a05040" strokeWidth="1" />
      <ellipse cx="30" cy="68" rx="26" ry="8" fill="#d88878" stroke="#b06050" strokeWidth="0.5" />
      {/* Cushion pattern - diamond stitching */}
      <path d="M 12 68 L 20 62 L 28 68 L 20 74 Z" fill="none" stroke="#b06050" strokeWidth="0.4" opacity="0.4" />
      <path d="M 22 68 L 30 62 L 38 68 L 30 74 Z" fill="none" stroke="#b06050" strokeWidth="0.4" opacity="0.4" />
      <path d="M 32 68 L 40 62 L 48 68 L 40 74 Z" fill="none" stroke="#b06050" strokeWidth="0.4" opacity="0.4" />
      {/* Tassels at corners */}
      <line x1="4" y1="70" x2="2" y2="74" stroke="#a05040" strokeWidth="1" strokeLinecap="round" />
      <line x1="56" y1="70" x2="58" y2="74" stroke="#a05040" strokeWidth="1" strokeLinecap="round" />

      {/* Blanket draped over body */}
      <path d="M 10 50 Q 30 44, 48 52 Q 52 62, 48 70 Q 30 76, 12 70 Q 6 60, 10 50" fill="#8090c8" stroke="#6070a8" strokeWidth="0.8" />
      {/* Blanket star pattern */}
      <g opacity="0.3">
        <polygon points="20,55 21,57 23,57 21.5,58.5 22,60.5 20,59 18,60.5 18.5,58.5 17,57 19,57" fill="#c0d0f0" />
        <polygon points="35,52 36,54 38,54 36.5,55.5 37,57.5 35,56 33,57.5 33.5,55.5 32,54 34,54" fill="#c0d0f0" />
        <polygon points="40,62 41,64 43,64 41.5,65.5 42,67.5 40,66 38,67.5 38.5,65.5 37,64 39,64" fill="#c0d0f0" />
      </g>
      {/* Blanket edge frill */}
      <path d="M 10 50 Q 12 48, 14 50 Q 16 48, 18 50 Q 20 48, 22 50" fill="none" stroke="#7080b8" strokeWidth="0.6" />

      {/* Curled up cat body peeking from blanket */}
      <ellipse cx="28" cy="56" rx="16" ry="10" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />

      {/* Tail wrapping around (over blanket) */}
      <path d="M 46 60 Q 54 50, 50 42 Q 46 38, 40 40" fill="none" stroke="url(#furCream)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 46 60 Q 54 50, 50 42 Q 46 38, 40 40" fill="none" stroke="#c4a888" strokeWidth="0.6" strokeLinecap="round" opacity="0.3" />
      <circle cx="40" cy="39.5" r="3" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.4" opacity="0.7" />

      {/* Head tucked in */}
      <circle cx="22" cy="48" r="14" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      {/* Hair tuft */}
      <path d="M 18 35 Q 20 32, 22 35 Q 24 32, 26 35" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.5" />

      {/* Ears (relaxed, slightly back) */}
      <polygon points="12,40 7,30 18,38" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      <polygon points="13,39 9,33 17,38" fill="#f0b8a8" opacity="0.5" />
      <polygon points="30,40 36,30 24,38" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      <polygon points="29,39 33,33 25,38" fill="#f0b8a8" opacity="0.5" />

      {/* Nightcap */}
      <path d="M 12 40 Q 22 32, 32 40" fill="#8090c8" stroke="#6070a8" strokeWidth="0.6" />
      <path d="M 12 40 Q 10 30, 22 22 Q 26 20, 28 24" fill="#8090c8" stroke="#6070a8" strokeWidth="0.6" />
      {/* Nightcap stripes */}
      <path d="M 14 36 Q 18 32, 22 36" fill="none" stroke="#a0b0d8" strokeWidth="1.5" opacity="0.4" />
      <path d="M 12 32 Q 16 28, 20 32" fill="none" stroke="#a0b0d8" strokeWidth="1.5" opacity="0.4" />
      {/* Pom-pom */}
      <circle cx="27" cy="23" r="3" fill="#c0d0f0" stroke="#a0b0d0" strokeWidth="0.4" />
      <circle cx="26" cy="22" r="1" fill="white" opacity="0.4" />

      {/* Closed eyes - happy sleeping arcs */}
      <path d="M 15 48 Q 17.5 51, 20 48" fill="none" stroke="#8d6e63" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 23 48 Q 25.5 51, 28 48" fill="none" stroke="#8d6e63" strokeWidth="1.4" strokeLinecap="round" />
      {/* Eyelash detail on closed eyes */}
      <path d="M 15 47.5 Q 16 47, 17 47.5" fill="none" stroke="#8d6e63" strokeWidth="0.5" />
      <path d="M 23 47.5 Q 24 47, 25 47.5" fill="none" stroke="#8d6e63" strokeWidth="0.5" />

      {/* Blush marks */}
      <ellipse cx="14" cy="52" rx="3" ry="1.8" fill="url(#blushMark)" />
      <ellipse cx="30" cy="52" rx="3" ry="1.8" fill="url(#blushMark)" />

      {/* Nose */}
      <path d="M 21 53 L 22 51.5 L 23 53 Z" fill="#e8a898" />
      {/* Tiny peaceful smile */}
      <path d="M 19.5 54 Q 22 55.5, 24.5 54" fill="none" stroke="#8d6e63" strokeWidth="0.5" />

      {/* Paw peeking out from blanket */}
      <ellipse cx="14" cy="60" rx="5" ry="3" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.8" />
      <circle cx="12" cy="59.5" r="0.7" fill="#e8b0a0" opacity="0.5" />
      <circle cx="14" cy="59" r="0.7" fill="#e8b0a0" opacity="0.5" />
      <circle cx="16" cy="59.5" r="0.7" fill="#e8b0a0" opacity="0.5" />

      {/* Zzz bubbles */}
      <g className={styles.zzzBubbles}>
        <text x="42" y="36" fontSize="9" fill="#8090c8" opacity="0.7" fontWeight="bold" fontFamily="serif">z</text>
        <text x="48" y="28" fontSize="11" fill="#8090c8" opacity="0.5" fontWeight="bold" fontFamily="serif">z</text>
        <text x="55" y="18" fontSize="14" fill="#8090c8" opacity="0.3" fontWeight="bold" fontFamily="serif">Z</text>
      </g>
    </g>
  );
};
