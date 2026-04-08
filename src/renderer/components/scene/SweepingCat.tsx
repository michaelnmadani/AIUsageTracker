import React from 'react';
import styles from './scene.module.css';

interface SweepingCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style orange tabby with red bandana and apron, sweeping.
 */
export const SweepingCat: React.FC<SweepingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.sweepingCat}>
      {/* Ground shadow */}
      <ellipse cx="26" cy="96" rx="20" ry="4" fill="#3a2a1a" opacity="0.18" />

      {/* Dust particles */}
      <g className={styles.dustParticles}>
        <circle cx="54" cy="78" r="1.2" fill="#d4c4a4" opacity="0.5" />
        <circle cx="59" cy="72" r="1.5" fill="#d4c4a4" opacity="0.4" />
        <circle cx="51" cy="68" r="1" fill="#d4c4a4" opacity="0.55" />
        <circle cx="57" cy="82" r="1.2" fill="#d4c4a4" opacity="0.3" />
      </g>

      {/* Broom */}
      <g className={styles.sweepMotion}>
        <line x1="42" y1="42" x2="56" y2="80" stroke="#8d6e50" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 50 76 Q 56 74, 62 78 Q 60 86, 50 84 Z" fill="#d4a060" stroke="#b08040" strokeWidth="0.8" />
        <line x1="52" y1="77" x2="51" y2="83" stroke="#c09040" strokeWidth="0.5" />
        <line x1="54" y1="76" x2="54" y2="84" stroke="#c09040" strokeWidth="0.5" />
        <line x1="56" y1="76" x2="57" y2="84" stroke="#c09040" strokeWidth="0.5" />
        <line x1="58" y1="77" x2="59" y2="83" stroke="#c09040" strokeWidth="0.5" />
        <rect x="50" y="75" width="10" height="2" rx="0.5" fill="#6d5030" stroke="#5a4020" strokeWidth="0.3" />
      </g>

      {/* Tail */}
      <path d="M 8 82 Q 0 66, 5 52 Q 7 44, 12 42" fill="none" stroke="url(#furOrange)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 8 82 Q 0 66, 5 52 Q 7 44, 12 42" fill="none" stroke="#a06820" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
      {/* Tail stripes */}
      <path d="M 4 62 Q 6 60, 8 62" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.35" />
      <path d="M 3 55 Q 5 53, 7 55" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.35" />

      {/* Legs */}
      <path d="M 16 78 L 15 88 Q 15 92, 12 92 L 12 93 Q 12 95, 18 95 Q 20 95, 20 92 L 20 88 L 19 78" fill="url(#furOrange)" stroke="#a06820" strokeWidth="0.7" />
      <path d="M 26 78 L 25 88 Q 25 92, 22 92 L 22 93 Q 22 95, 28 95 Q 30 95, 30 92 L 30 88 L 29 78" fill="url(#furOrange)" stroke="#a06820" strokeWidth="0.7" />
      {/* Boots */}
      <ellipse cx="16" cy="94" rx="5" ry="2.5" fill="#8b4513" stroke="#6d3410" strokeWidth="0.5" />
      <ellipse cx="28" cy="94" rx="5" ry="2.5" fill="#8b4513" stroke="#6d3410" strokeWidth="0.5" />
      {/* Boot tops */}
      <rect x="13" y="86" width="6" height="6" rx="2" fill="white" stroke="#e0d0c0" strokeWidth="0.3" />
      <rect x="23" y="86" width="6" height="6" rx="2" fill="white" stroke="#e0d0c0" strokeWidth="0.3" />

      {/* Body */}
      <path d="M 9 52 Q 7 58, 8 68 Q 9 78, 13 80 Q 22 84, 31 80 Q 35 78, 36 68 Q 37 58, 35 52 Q 29 48, 22 48 Q 15 48, 9 52 Z" fill="url(#furOrange)" stroke="#a06820" strokeWidth="1" />
      {/* Tabby stripes on body */}
      <path d="M 13 56 Q 22 54, 31 56" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.3" />
      <path d="M 12 62 Q 22 60, 32 62" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.3" />
      <path d="M 13 68 Q 22 66, 31 68" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.3" />
      {/* Body shading */}
      <path d="M 9 52 Q 7 58, 8 68 Q 9 74, 11 78 Q 12 68, 12 56 Q 13 50, 9 52" fill="#a06820" opacity="0.06" />
      {/* Apron */}
      <path d="M 13 55 Q 22 52, 31 55 L 33 80 Q 22 84, 11 80 Z" fill="#fff8f2" stroke="#e0d0c0" strokeWidth="0.7" opacity="0.9" />
      <rect x="18" y="64" width="10" height="7" rx="1.5" fill="#fff0e8" stroke="#e0c8b8" strokeWidth="0.4" />
      <path d="M 11 78 Q 14 76, 17 78 Q 20 76, 23 78 Q 26 76, 29 78 Q 32 76, 33 78" fill="none" stroke="#e0d0c0" strokeWidth="0.7" />

      {/* Head */}
      <circle cx="22" cy="36" r="17" fill="url(#furOrange)" stroke="#a06820" strokeWidth="1" />
      {/* Tabby M on forehead */}
      <path d="M 14 26 L 18 22 L 22 26 L 26 22 L 30 26" fill="none" stroke="#c47020" strokeWidth="1.2" opacity="0.4" />
      {/* Head shading */}
      <path d="M 7 30 Q 5 36, 7 42 Q 10 38, 10 32 Q 8 28, 7 30" fill="#a06820" opacity="0.06" />
      {/* Cheek fur */}
      <path d="M 6 36 Q 3 32, 6 28" fill="none" stroke="#d89040" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M 38 36 Q 41 32, 38 28" fill="none" stroke="#d89040" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* Ears */}
      <path d="M 10,26 Q 6,14 4,6 Q 8,12 18,22" fill="url(#furOrange)" stroke="#a06820" strokeWidth="1" />
      <path d="M 12,24 Q 9,16 8,10 Q 10,14 17,22" fill="#f0b8a0" opacity="0.45" />
      <path d="M 7 10 Q 9 7, 8 5" fill="none" stroke="#d89040" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M 34,26 Q 38,14 40,6 Q 36,12 26,22" fill="url(#furOrange)" stroke="#a06820" strokeWidth="1" />
      <path d="M 32,24 Q 35,16 36,10 Q 34,14 27,22" fill="#f0b8a0" opacity="0.45" />
      <path d="M 37 10 Q 35 7, 36 5" fill="none" stroke="#d89040" strokeWidth="0.8" strokeLinecap="round" />

      {/* Bandana */}
      <path d="M 10 28 Q 22 30, 34 28" fill="none" stroke="#cc3333" strokeWidth="3" strokeLinecap="round" />
      <polygon points="33,28 40,38 37,40" fill="#cc3333" opacity="0.85" />
      <polygon points="34,29 39,36 37,38" fill="#dd5555" opacity="0.4" />
      <circle cx="18" cy="29" r="0.8" fill="#ff8888" opacity="0.5" />
      <circle cx="22" cy="29.5" r="0.8" fill="#ff8888" opacity="0.5" />
      <circle cx="27" cy="29" r="0.8" fill="#ff8888" opacity="0.5" />

      {/* Eyes - determined */}
      <ellipse cx="16" cy="35" rx="3.5" ry="4.2" fill="white" stroke="#8a6840" strokeWidth="0.5" />
      <ellipse cx="16" cy="36" rx="2.8" ry="3.3" fill="url(#irisAmber)" />
      <ellipse cx="16" cy="36.5" rx="1.8" ry="2.2" fill="#3a2a1a" />
      <circle cx="14.5" cy="34.5" r="1.3" fill="white" opacity="0.9" />
      <circle cx="17.5" cy="37" r="0.6" fill="white" opacity="0.5" />
      <path d="M 12.5 31 Q 14.5 30, 17 31.5" fill="none" stroke="#a06820" strokeWidth="1.1" strokeLinecap="round" />

      <ellipse cx="28" cy="35" rx="3.5" ry="4.2" fill="white" stroke="#8a6840" strokeWidth="0.5" />
      <ellipse cx="28" cy="36" rx="2.8" ry="3.3" fill="url(#irisAmber)" />
      <ellipse cx="28" cy="36.5" rx="1.8" ry="2.2" fill="#3a2a1a" />
      <circle cx="26.5" cy="34.5" r="1.3" fill="white" opacity="0.9" />
      <circle cx="29.5" cy="37" r="0.6" fill="white" opacity="0.5" />
      <path d="M 26 31.5 Q 28.5 30, 31.5 31" fill="none" stroke="#a06820" strokeWidth="1.1" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="11" cy="40" rx="3.5" ry="2" fill="url(#blushMark)" />
      <ellipse cx="33" cy="40" rx="3.5" ry="2" fill="url(#blushMark)" />

      {/* Nose & mouth */}
      <path d="M 21 42 L 22 40.5 L 23 42 Z" fill="#e8a898" />
      <path d="M 19 43 Q 22 45, 25 43" fill="none" stroke="#8d6e63" strokeWidth="0.6" />

      {/* Whiskers */}
      <line x1="4" y1="39" x2="13" y2="40" stroke="#c4a060" strokeWidth="0.4" opacity="0.3" />
      <line x1="3" y1="42" x2="13" y2="41.5" stroke="#c4a060" strokeWidth="0.4" opacity="0.3" />
      <line x1="31" y1="40" x2="40" y2="39" stroke="#c4a060" strokeWidth="0.4" opacity="0.3" />
      <line x1="31" y1="41.5" x2="41" y2="42" stroke="#c4a060" strokeWidth="0.4" opacity="0.3" />

      {/* Paw holding broom */}
      <ellipse cx="40" cy="52" rx="5.5" ry="4" fill="url(#furOrange)" stroke="#a06820" strokeWidth="0.8" />
      <circle cx="38" cy="51" r="0.8" fill="#e8b0a0" opacity="0.5" />
      <circle cx="40" cy="50.5" r="0.8" fill="#e8b0a0" opacity="0.5" />
      <circle cx="42" cy="51" r="0.8" fill="#e8b0a0" opacity="0.5" />
    </g>
  );
};
