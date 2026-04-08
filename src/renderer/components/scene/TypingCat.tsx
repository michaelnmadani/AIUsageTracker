import React from 'react';
import styles from './scene.module.css';

interface TypingCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style brown cat with bow tie and vest, writing at a desk.
 * Shown when Claude is writing code.
 */
export const TypingCat: React.FC<TypingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.typingCat}>
      {/* Ground shadow */}
      <ellipse cx="35" cy="84" rx="26" ry="5" fill="#3a2a1a" opacity="0.18" />

      {/* Desk (wooden tavern counter) */}
      <rect x="18" y="58" width="44" height="5" rx="1.5" fill="#a07848" stroke="#7a5828" strokeWidth="1" />
      <rect x="20" y="63" width="3.5" height="18" fill="#a07848" stroke="#7a5828" strokeWidth="0.5" />
      <rect x="56" y="63" width="3.5" height="18" fill="#a07848" stroke="#7a5828" strokeWidth="0.5" />
      {/* Desk wood grain */}
      <line x1="22" y1="60" x2="58" y2="60" stroke="#8a6438" strokeWidth="0.3" opacity="0.3" />

      {/* Scroll/parchment */}
      <rect x="30" y="36" width="28" height="22" rx="2" fill="#f0e4c8" stroke="#c4a882" strokeWidth="1" />
      <ellipse cx="44" cy="36" rx="14" ry="2" fill="#e8d8b8" stroke="#c4a882" strokeWidth="0.5" />
      <ellipse cx="44" cy="58" rx="14" ry="1.5" fill="#e8d8b8" stroke="#c4a882" strokeWidth="0.5" />
      {/* Text lines on scroll */}
      <g className={styles.codeLines}>
        <line x1="34" y1="42" x2="46" y2="42" stroke="#8d6e63" strokeWidth="0.8" opacity="0.5" />
        <line x1="34" y1="45.5" x2="52" y2="45.5" stroke="#8d6e63" strokeWidth="0.8" opacity="0.5" />
        <line x1="36" y1="49" x2="50" y2="49" stroke="#8d6e63" strokeWidth="0.8" opacity="0.5" />
        <line x1="34" y1="52.5" x2="44" y2="52.5" stroke="#8d6e63" strokeWidth="0.8" opacity="0.5" />
      </g>

      {/* Quill pen */}
      <line x1="55" y1="42" x2="64" y2="28" stroke="#5a3a1a" strokeWidth="1.2" />
      <path d="M 64 28 Q 66 26, 68 30 Q 66 29, 64 28" fill="#d8c8b0" stroke="#a09080" strokeWidth="0.3" />
      {/* Ink pot */}
      <rect x="25" y="55" width="6" height="5" rx="1.5" fill="#2a1a0a" stroke="#1a0a00" strokeWidth="0.5" />
      <ellipse cx="28" cy="55" rx="3" ry="1" fill="#3a2a1a" />

      {/* Tail (behind body) */}
      <path d="M 5 68 Q -3 56, 0 44 Q 2 38, 6 36" fill="none" stroke="url(#furBrown)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 5 68 Q -3 56, 0 44 Q 2 38, 6 36" fill="none" stroke="#5a3a1a" strokeWidth="0.8" strokeLinecap="round" opacity="0.25" />
      <circle cx="6" cy="35.5" r="3" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="0.4" opacity="0.6" />

      {/* Body with vest */}
      <ellipse cx="18" cy="64" rx="14" ry="12" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="1" />
      {/* Vest - dark wine color */}
      <path d="M 8 56 Q 18 52, 28 56 L 28 72 Q 18 76, 8 72 Z" fill="#6a2838" stroke="#4a1828" strokeWidth="0.6" opacity="0.85" />
      {/* Vest buttons */}
      <circle cx="18" cy="60" r="1" fill="#c4a060" stroke="#a08040" strokeWidth="0.3" />
      <circle cx="18" cy="66" r="1" fill="#c4a060" stroke="#a08040" strokeWidth="0.3" />
      {/* White shirt collar */}
      <path d="M 12 55 L 18 52 L 24 55 L 22 58 L 18 56 L 14 58 Z" fill="#f0e8e0" stroke="#d0c0b0" strokeWidth="0.4" />

      {/* Bow tie */}
      <path d="M 14 55 Q 12 53, 14 51 L 18 53 Z" fill="#cc3333" stroke="#aa2222" strokeWidth="0.3" />
      <path d="M 22 55 Q 24 53, 22 51 L 18 53 Z" fill="#cc3333" stroke="#aa2222" strokeWidth="0.3" />
      <circle cx="18" cy="53" r="1.2" fill="#dd4444" stroke="#aa2222" strokeWidth="0.3" />

      {/* Head (chibi large) */}
      <circle cx="18" cy="36" r="16" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="1" />
      {/* Hair tufts on top */}
      <path d="M 12 22 Q 14 18, 16 22 Q 18 16, 20 22 Q 22 18, 24 22" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="0.5" />
      {/* Side whisker fur */}
      <path d="M 3 36 Q 1 34, 3 32" fill="none" stroke="#7a5838" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M 33 36 Q 35 34, 33 32" fill="none" stroke="#7a5838" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

      {/* Ears */}
      <polygon points="6,26 0,8 16,22" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="1" />
      <polygon points="8,24 4,14 14,23" fill="#e0a898" opacity="0.5" />
      <path d="M 4 14 Q 6 11, 5 9" fill="none" stroke="#7a5838" strokeWidth="0.8" strokeLinecap="round" />
      <polygon points="30,26 36,8 20,22" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="1" />
      <polygon points="28,24 32,14 22,23" fill="#e0a898" opacity="0.5" />
      <path d="M 32 14 Q 30 11, 31 9" fill="none" stroke="#7a5838" strokeWidth="0.8" strokeLinecap="round" />

      {/* Eyes - focused, slightly narrowed anime style */}
      <ellipse cx="12" cy="35" rx="3" ry="3.8" fill="white" stroke="#5a4030" strokeWidth="0.5" />
      <ellipse cx="12" cy="36" rx="2.4" ry="3" fill="url(#irisAmber)" />
      <ellipse cx="12" cy="36.5" rx="1.5" ry="2" fill="#2a1a0a" />
      <circle cx="10.8" cy="34.5" r="1" fill="white" opacity="0.9" />
      <circle cx="13" cy="36.5" r="0.5" fill="white" opacity="0.5" />
      <path d="M 9 32 Q 11 31.5, 14 33" fill="none" stroke="#5a3a1a" strokeWidth="0.6" />

      <ellipse cx="24" cy="35" rx="3" ry="3.8" fill="white" stroke="#5a4030" strokeWidth="0.5" />
      <ellipse cx="24" cy="36" rx="2.4" ry="3" fill="url(#irisAmber)" />
      <ellipse cx="24" cy="36.5" rx="1.5" ry="2" fill="#2a1a0a" />
      <circle cx="22.8" cy="34.5" r="1" fill="white" opacity="0.9" />
      <circle cx="25" cy="36.5" r="0.5" fill="white" opacity="0.5" />
      <path d="M 22 33 Q 25 31.5, 27 32" fill="none" stroke="#5a3a1a" strokeWidth="0.6" />

      {/* Blush marks */}
      <ellipse cx="7" cy="40" rx="3" ry="1.8" fill="url(#blushMark)" />
      <ellipse cx="29" cy="40" rx="3" ry="1.8" fill="url(#blushMark)" />

      {/* Nose & mouth */}
      <path d="M 17 42 L 18 40.5 L 19 42 Z" fill="#d8a090" />
      <path d="M 15.5 43 Q 18 45, 20.5 43" fill="none" stroke="#5a3a1a" strokeWidth="0.6" />

      {/* Whiskers */}
      <line x1="2" y1="39" x2="10" y2="40" stroke="#8a7060" strokeWidth="0.4" opacity="0.35" />
      <line x1="1" y1="42" x2="10" y2="41.5" stroke="#8a7060" strokeWidth="0.4" opacity="0.35" />
      <line x1="26" y1="40" x2="34" y2="39" stroke="#8a7060" strokeWidth="0.4" opacity="0.35" />
      <line x1="26" y1="41.5" x2="35" y2="42" stroke="#8a7060" strokeWidth="0.4" opacity="0.35" />

      {/* Paws on desk */}
      <g className={styles.typingPaws}>
        <ellipse cx="30" cy="58" rx="5" ry="3" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="0.8" />
        <circle cx="28.5" cy="57" r="0.6" fill="#d8a898" opacity="0.5" />
        <circle cx="30.5" cy="56.5" r="0.6" fill="#d8a898" opacity="0.5" />
        <circle cx="32" cy="57" r="0.6" fill="#d8a898" opacity="0.5" />
        <ellipse cx="40" cy="58" rx="5" ry="3" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="0.8" />
        <circle cx="38.5" cy="57" r="0.6" fill="#d8a898" opacity="0.5" />
        <circle cx="40.5" cy="56.5" r="0.6" fill="#d8a898" opacity="0.5" />
        <circle cx="42" cy="57" r="0.6" fill="#d8a898" opacity="0.5" />
      </g>

      {/* Tankard with foam */}
      <rect x="55" y="52" width="8" height="8" rx="1.5" fill="#c4a060" stroke="#a08040" strokeWidth="0.6" />
      <path d="M 63 53.5 Q 66 55.5, 63 59" fill="none" stroke="#a08040" strokeWidth="1" />
      <ellipse cx="59" cy="52" rx="4" ry="1.8" fill="#fff8e0" stroke="#c4a060" strokeWidth="0.3" />
      {/* Steam */}
      <g className={styles.coffeeSteam}>
        <path d="M 57 50 Q 58 47, 57 44" fill="none" stroke="#e8ddd0" strokeWidth="0.6" opacity="0.3" />
        <path d="M 60 50.5 Q 61 47, 60 43" fill="none" stroke="#e8ddd0" strokeWidth="0.6" opacity="0.25" />
      </g>
    </g>
  );
};
