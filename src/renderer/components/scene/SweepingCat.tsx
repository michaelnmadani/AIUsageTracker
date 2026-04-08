import React from 'react';
import styles from './scene.module.css';

interface SweepingCatProps {
  x?: number;
  y?: number;
}

/**
 * Cat sweeping with a broom - shown when Claude is editing/cleaning code.
 * Orange tabby cat with a broom.
 */
export const SweepingCat: React.FC<SweepingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.sweepingCat}>
      {/* Shadow */}
      <ellipse cx="30" cy="80" rx="18" ry="4" fill="#37474f" opacity="0.2" />

      {/* Dust particles */}
      <g className={styles.dustParticles}>
        <circle cx="50" cy="72" r="1" fill="#d7ccc8" opacity="0.5" />
        <circle cx="55" cy="68" r="1.2" fill="#d7ccc8" opacity="0.4" />
        <circle cx="48" cy="65" r="0.8" fill="#d7ccc8" opacity="0.6" />
        <circle cx="53" cy="74" r="1" fill="#d7ccc8" opacity="0.3" />
      </g>

      {/* Broom */}
      <g className={styles.sweepMotion}>
        <line x1="40" y1="40" x2="52" y2="72" stroke="#8d6e63" strokeWidth="2" strokeLinecap="round" />
        {/* Broom head */}
        <path
          d="M 46 70 Q 52 68, 58 72 Q 55 78, 46 76 Z"
          fill="#f9a825"
          stroke="#f57f17"
          strokeWidth="0.8"
        />
        <line x1="48" y1="71" x2="47" y2="75" stroke="#f57f17" strokeWidth="0.5" />
        <line x1="50" y1="70" x2="50" y2="76" stroke="#f57f17" strokeWidth="0.5" />
        <line x1="52" y1="70" x2="53" y2="76" stroke="#f57f17" strokeWidth="0.5" />
        <line x1="54" y1="71" x2="55" y2="75" stroke="#f57f17" strokeWidth="0.5" />
      </g>

      {/* Cat body */}
      <ellipse cx="25" cy="65" rx="13" ry="11" fill="#ff9800" stroke="#5d4037" strokeWidth="1.5" />
      {/* Tabby stripes */}
      <path d="M 18 58 Q 25 56, 32 58" fill="none" stroke="#e65100" strokeWidth="1" opacity="0.5" />
      <path d="M 17 62 Q 25 60, 33 62" fill="none" stroke="#e65100" strokeWidth="1" opacity="0.5" />

      {/* Cat head */}
      <circle cx="25" cy="44" r="13" fill="#ff9800" stroke="#5d4037" strokeWidth="1.5" />
      {/* Head stripe */}
      <path d="M 25 32 L 23 38 L 25 36 L 27 38 Z" fill="#e65100" opacity="0.5" />

      {/* Ears */}
      <polygon points="15,34 10,23 20,31" fill="#ff9800" stroke="#5d4037" strokeWidth="1.5" />
      <polygon points="16,33 13,27 19,32" fill="#ffab91" />
      <polygon points="35,34 40,23 30,31" fill="#ff9800" stroke="#5d4037" strokeWidth="1.5" />
      <polygon points="34,33 37,27 31,32" fill="#ffab91" />

      {/* Eyes (determined expression) */}
      <ellipse cx="20" cy="43" rx="2.5" ry="2" fill="#424242" />
      <ellipse cx="30" cy="43" rx="2.5" ry="2" fill="#424242" />
      <circle cx="21" cy="42" r="0.8" fill="white" />
      <circle cx="31" cy="42" r="0.8" fill="white" />

      {/* Nose & mouth */}
      <ellipse cx="25" cy="47" rx="1.2" ry="0.8" fill="#ffab91" />
      <path d="M 23 48 Q 25 49, 27 48" fill="none" stroke="#5d4037" strokeWidth="0.6" />

      {/* Paw holding broom */}
      <ellipse cx="38" cy="52" rx="4" ry="3" fill="#ff9800" stroke="#5d4037" strokeWidth="1" />
      <ellipse cx="26" cy="72" rx="5" ry="3" fill="#ff9800" stroke="#5d4037" strokeWidth="1" />

      {/* Tail */}
      <path
        d="M 13 70 Q 5 62, 8 52"
        fill="none"
        stroke="#ff9800"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </g>
  );
};
