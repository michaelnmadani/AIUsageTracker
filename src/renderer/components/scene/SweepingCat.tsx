import React from 'react';
import styles from './scene.module.css';

interface SweepingCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style orange tabby cat with red bandana and apron, sweeping.
 * Shown when Claude is editing/cleaning code.
 */
export const SweepingCat: React.FC<SweepingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.sweepingCat}>
      {/* Ground shadow */}
      <ellipse cx="28" cy="82" rx="20" ry="4" fill="#3a2a1a" opacity="0.18" />

      {/* Dust particles */}
      <g className={styles.dustParticles}>
        <circle cx="52" cy="72" r="1.2" fill="#d4c4a4" opacity="0.5" />
        <circle cx="57" cy="67" r="1.5" fill="#d4c4a4" opacity="0.4" />
        <circle cx="49" cy="64" r="1" fill="#d4c4a4" opacity="0.55" />
        <circle cx="55" cy="75" r="1.2" fill="#d4c4a4" opacity="0.3" />
      </g>

      {/* Broom */}
      <g className={styles.sweepMotion}>
        <line x1="40" y1="38" x2="54" y2="72" stroke="#8d6e50" strokeWidth="2.5" strokeLinecap="round" />
        {/* Broom bristles - detailed fan shape */}
        <path d="M 48 68 Q 54 66, 60 70 Q 58 78, 48 76 Z" fill="#d4a060" stroke="#b08040" strokeWidth="0.8" />
        <line x1="50" y1="69" x2="49" y2="75" stroke="#c09040" strokeWidth="0.5" />
        <line x1="52" y1="68" x2="52" y2="76" stroke="#c09040" strokeWidth="0.5" />
        <line x1="54" y1="68" x2="55" y2="76" stroke="#c09040" strokeWidth="0.5" />
        <line x1="56" y1="69" x2="57" y2="75" stroke="#c09040" strokeWidth="0.5" />
        {/* Broom binding */}
        <rect x="48" y="67" width="10" height="2" rx="0.5" fill="#6d5030" stroke="#5a4020" strokeWidth="0.3" />
      </g>

      {/* Tail (behind body) */}
      <path d="M 10 74 Q 2 60, 6 48 Q 8 42, 12 40" fill="none" stroke="url(#furOrange)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 10 74 Q 2 60, 6 48 Q 8 42, 12 40" fill="none" stroke="#a06820" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
      {/* Tail stripes */}
      <path d="M 5 58 Q 7 56, 9 58" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.4" />
      <path d="M 4 52 Q 6 50, 8 52" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.4" />

      {/* Body with apron */}
      <ellipse cx="25" cy="66" rx="14" ry="13" fill="url(#furOrange)" stroke="#a06820" strokeWidth="1" />
      {/* Tabby stripes on body */}
      <path d="M 16 58 Q 25 56, 34 58" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.35" />
      <path d="M 15 63 Q 25 61, 35 63" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.35" />
      <path d="M 16 68 Q 25 66, 34 68" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.35" />
      {/* Apron */}
      <path d="M 15 57 Q 25 54, 35 57 L 36 78 Q 25 82, 14 78 Z" fill="#fff8f2" stroke="#e0d0c0" strokeWidth="0.7" opacity="0.9" />
      {/* Apron pocket */}
      <rect x="20" y="64" width="10" height="7" rx="1.5" fill="#fff0e8" stroke="#e0c8b8" strokeWidth="0.4" />
      {/* Apron frill */}
      <path d="M 14 76 Q 17 74, 20 76 Q 23 74, 26 76 Q 29 74, 32 76 Q 35 74, 36 76" fill="none" stroke="#e0d0c0" strokeWidth="0.7" />

      {/* Head (chibi) */}
      <circle cx="25" cy="38" r="16" fill="url(#furOrange)" stroke="#a06820" strokeWidth="1" />
      {/* Tabby M marking on forehead */}
      <path d="M 17 28 L 21 24 L 25 28 L 29 24 L 33 28" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.45" />
      {/* Cheek fur tufts */}
      <path d="M 10 38 Q 8 36, 10 34" fill="none" stroke="#d89040" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M 40 38 Q 42 36, 40 34" fill="none" stroke="#d89040" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

      {/* Ears */}
      <polygon points="13,26 7,8 21,22" fill="url(#furOrange)" stroke="#a06820" strokeWidth="1" />
      <polygon points="14,24 10,14 19,23" fill="#f0b8a0" opacity="0.5" />
      <path d="M 10 14 Q 12 11, 11 9" fill="none" stroke="#d89040" strokeWidth="0.8" strokeLinecap="round" />
      <polygon points="37,26 43,8 29,22" fill="url(#furOrange)" stroke="#a06820" strokeWidth="1" />
      <polygon points="36,24 40,14 31,23" fill="#f0b8a0" opacity="0.5" />
      <path d="M 40 14 Q 38 11, 39 9" fill="none" stroke="#d89040" strokeWidth="0.8" strokeLinecap="round" />

      {/* Bandana - red with pattern */}
      <path d="M 13 30 Q 25 32, 37 30" fill="none" stroke="#cc3333" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="36,30 42,38 39,40" fill="#cc3333" opacity="0.85" />
      <polygon points="37,31 41,37 39,38" fill="#dd5555" opacity="0.4" />
      {/* Bandana dots */}
      <circle cx="20" cy="30.5" r="0.8" fill="#ff8888" opacity="0.5" />
      <circle cx="25" cy="31" r="0.8" fill="#ff8888" opacity="0.5" />
      <circle cx="30" cy="30.5" r="0.8" fill="#ff8888" opacity="0.5" />

      {/* Eyes - determined anime style */}
      <ellipse cx="19" cy="37" rx="3.2" ry="3.8" fill="white" stroke="#8a6840" strokeWidth="0.5" />
      <ellipse cx="19" cy="38" rx="2.5" ry="3" fill="url(#irisAmber)" />
      <ellipse cx="19" cy="38.5" rx="1.6" ry="2" fill="#3a2a1a" />
      <circle cx="17.8" cy="36.5" r="1.1" fill="white" opacity="0.9" />
      <circle cx="20" cy="38.5" r="0.5" fill="white" opacity="0.5" />
      {/* Slight eyebrow angle (determined) */}
      <path d="M 16 33.5 Q 18 32.5, 21 34" fill="none" stroke="#a06820" strokeWidth="0.7" />

      <ellipse cx="31" cy="37" rx="3.2" ry="3.8" fill="white" stroke="#8a6840" strokeWidth="0.5" />
      <ellipse cx="31" cy="38" rx="2.5" ry="3" fill="url(#irisAmber)" />
      <ellipse cx="31" cy="38.5" rx="1.6" ry="2" fill="#3a2a1a" />
      <circle cx="29.8" cy="36.5" r="1.1" fill="white" opacity="0.9" />
      <circle cx="32" cy="38.5" r="0.5" fill="white" opacity="0.5" />
      <path d="M 29 34 Q 32 32.5, 34 33.5" fill="none" stroke="#a06820" strokeWidth="0.7" />

      {/* Blush marks */}
      <ellipse cx="14" cy="42" rx="3" ry="1.8" fill="url(#blushMark)" />
      <ellipse cx="36" cy="42" rx="3" ry="1.8" fill="url(#blushMark)" />

      {/* Nose & mouth */}
      <path d="M 24 43 L 25 41.5 L 26 43 Z" fill="#e8a898" />
      <path d="M 22 44 Q 25 46, 28 44" fill="none" stroke="#8d6e63" strokeWidth="0.6" />

      {/* Whiskers */}
      <line x1="6" y1="40" x2="15" y2="41" stroke="#c4a060" strokeWidth="0.4" opacity="0.35" />
      <line x1="5" y1="43" x2="15" y2="42.5" stroke="#c4a060" strokeWidth="0.4" opacity="0.35" />
      <line x1="35" y1="41" x2="44" y2="40" stroke="#c4a060" strokeWidth="0.4" opacity="0.35" />
      <line x1="35" y1="42.5" x2="45" y2="43" stroke="#c4a060" strokeWidth="0.4" opacity="0.35" />

      {/* Paw holding broom */}
      <ellipse cx="38" cy="50" rx="5" ry="3.5" fill="url(#furOrange)" stroke="#a06820" strokeWidth="0.8" />
      <circle cx="36.5" cy="49" r="0.7" fill="#e8b0a0" opacity="0.5" />
      <circle cx="38.5" cy="48.5" r="0.7" fill="#e8b0a0" opacity="0.5" />
      {/* Other paw */}
      <ellipse cx="26" cy="76" rx="5" ry="3" fill="url(#furOrange)" stroke="#a06820" strokeWidth="0.8" />
    </g>
  );
};
