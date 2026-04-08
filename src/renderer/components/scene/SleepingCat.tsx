import React from 'react';
import styles from './scene.module.css';

interface SleepingCatProps {
  x?: number;
  y?: number;
}

/**
 * Cat sleeping/napping - shown when Claude is idle.
 * Cream-colored cat curled up with Zzz bubbles.
 */
export const SleepingCat: React.FC<SleepingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.sleepingCat}>
      {/* Shadow */}
      <ellipse cx="30" cy="72" rx="22" ry="5" fill="#37474f" opacity="0.15" />

      {/* Cushion */}
      <ellipse cx="30" cy="68" rx="25" ry="8" fill="#ffccbc" stroke="#ff8a65" strokeWidth="1" />
      <ellipse cx="30" cy="66" rx="23" ry="6" fill="#ffe0b2" stroke="#ff8a65" strokeWidth="0.5" />

      {/* Curled up cat body (round ball shape) */}
      <ellipse cx="30" cy="58" rx="18" ry="12" fill="#fff8e1" stroke="#5d4037" strokeWidth="1.5" />

      {/* Tail wrapping around */}
      <path
        d="M 46 60 Q 52 50, 48 45 Q 44 42, 38 45"
        fill="none"
        stroke="#fff8e1"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 46 60 Q 52 50, 48 45 Q 44 42, 38 45"
        fill="none"
        stroke="#5d4037"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Head tucked in */}
      <circle cx="22" cy="52" r="11" fill="#fff8e1" stroke="#5d4037" strokeWidth="1.5" />

      {/* Ears (small, relaxed) */}
      <polygon points="14,44 11,36 18,42" fill="#fff8e1" stroke="#5d4037" strokeWidth="1" />
      <polygon points="15,43 13,39 17,43" fill="#ffab91" />
      <polygon points="30,44 34,36 26,42" fill="#fff8e1" stroke="#5d4037" strokeWidth="1" />
      <polygon points="29,43 32,39 27,43" fill="#ffab91" />

      {/* Closed eyes (happy sleeping lines) */}
      <path d="M 17 52 Q 19 54, 21 52" fill="none" stroke="#5d4037" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 24 52 Q 26 54, 28 52" fill="none" stroke="#5d4037" strokeWidth="1.2" strokeLinecap="round" />

      {/* Nose */}
      <ellipse cx="22" cy="55" rx="1" ry="0.6" fill="#ffab91" />

      {/* Tiny smile */}
      <path d="M 20.5 56 Q 22 57, 23.5 56" fill="none" stroke="#5d4037" strokeWidth="0.5" />

      {/* Zzz bubbles */}
      <g className={styles.zzzBubbles}>
        <text x="40" y="40" fontSize="8" fill="#7986cb" opacity="0.7" fontWeight="bold">z</text>
        <text x="46" y="33" fontSize="10" fill="#7986cb" opacity="0.5" fontWeight="bold">z</text>
        <text x="53" y="24" fontSize="13" fill="#7986cb" opacity="0.3" fontWeight="bold">Z</text>
      </g>

      {/* Paw peeking out */}
      <ellipse cx="15" cy="62" rx="4" ry="2.5" fill="#fff8e1" stroke="#5d4037" strokeWidth="0.8" />
    </g>
  );
};
