import React from 'react';
import styles from './scene.module.css';

interface CookingCatProps {
  x?: number;
  y?: number;
}

/**
 * Cat stirring a pot - shown when Claude is processing/generating.
 * White cat with chef hat, stirring near the tavern cauldron.
 */
export const CookingCat: React.FC<CookingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.cookingCat}>
      {/* Shadow */}
      <ellipse cx="20" cy="78" rx="16" ry="4" fill="#3a2a1a" opacity="0.2" />

      {/* Steam particles (rising from nearby cauldron) */}
      <g className={styles.steam}>
        <circle cx="45" cy="42" r="2" fill="#e8ddd0" opacity="0.3" />
        <circle cx="50" cy="36" r="2.5" fill="#e8ddd0" opacity="0.25" />
        <circle cx="42" cy="32" r="2" fill="#e8ddd0" opacity="0.2" />
      </g>

      {/* Cat body */}
      <ellipse cx="18" cy="62" rx="14" ry="12" fill="#faf0e6" stroke="#8d6e63" strokeWidth="1.2" />

      {/* Cat head */}
      <circle cx="18" cy="42" r="13" fill="#faf0e6" stroke="#8d6e63" strokeWidth="1.2" />

      {/* Ears */}
      <polygon points="8,32 3,21 14,29" fill="#faf0e6" stroke="#8d6e63" strokeWidth="1.2" />
      <polygon points="9,31 5,25 13,30" fill="#e8b4a0" />
      <polygon points="28,32 33,21 23,29" fill="#faf0e6" stroke="#8d6e63" strokeWidth="1.2" />
      <polygon points="27,31 31,25 24,30" fill="#e8b4a0" />

      {/* Chef hat */}
      <ellipse cx="18" cy="30" rx="10" ry="2.5" fill="#fff8f0" stroke="#d4c4b0" strokeWidth="0.5" />
      <rect x="10" y="22" width="16" height="9" rx="6" fill="#fff8f0" stroke="#d4c4b0" strokeWidth="0.5" />

      {/* Eyes (focused, looking at cauldron) */}
      <ellipse cx="13" cy="41" rx="2.2" ry="2.8" fill="#3a2a1a" />
      <ellipse cx="23" cy="41" rx="2.2" ry="2.8" fill="#3a2a1a" />
      <circle cx="14" cy="40" r="0.9" fill="white" />
      <circle cx="24" cy="40" r="0.9" fill="white" />

      {/* Rosy cheeks */}
      <circle cx="9" cy="45" r="2.5" fill="#e8a090" opacity="0.35" />
      <circle cx="27" cy="45" r="2.5" fill="#e8a090" opacity="0.35" />

      {/* Nose & mouth */}
      <ellipse cx="18" cy="46" rx="1.3" ry="0.9" fill="#e8b4a0" />
      <path d="M 16.3 47 Q 18 48.5, 19.7 47" fill="none" stroke="#8d6e63" strokeWidth="0.6" />

      {/* Paw holding ladle */}
      <g className={styles.stirring}>
        <line x1="30" y1="55" x2="48" y2="50" stroke="#8d6e63" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="30" cy="56" rx="4.5" ry="3.5" fill="#faf0e6" stroke="#8d6e63" strokeWidth="1" />
      </g>

      {/* Tail */}
      <path
        d="M 5 68 Q -4 58, 0 48"
        fill="none"
        stroke="#faf0e6"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 5 68 Q -4 58, 0 48"
        fill="none"
        stroke="#8d6e63"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.3"
      />


    </g>
  );
};
