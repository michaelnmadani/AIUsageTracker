import React from 'react';
import styles from './scene.module.css';

interface CookingCatProps {
  x?: number;
  y?: number;
}

/**
 * Cat stirring a pot - shown when Claude is processing/generating.
 * White cat with chef hat, stirring a blue cauldron.
 */
export const CookingCat: React.FC<CookingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.cookingCat}>
      {/* Cauldron/Pot */}
      <ellipse cx="45" cy="78" rx="22" ry="6" fill="#37474f" opacity="0.3" />
      <path
        d="M 25 55 Q 23 72, 30 75 Q 45 80, 60 75 Q 67 72, 65 55 Z"
        fill="#00838f"
        stroke="#006064"
        strokeWidth="1.5"
      />
      {/* Pot liquid */}
      <ellipse cx="45" cy="56" rx="19" ry="5" fill="#ffcc02" opacity="0.8" />
      {/* Pot rim */}
      <ellipse cx="45" cy="55" rx="20" ry="5" fill="none" stroke="#006064" strokeWidth="2" />

      {/* Steam particles */}
      <g className={styles.steam}>
        <circle cx="38" cy="42" r="2" fill="white" opacity="0.4" />
        <circle cx="45" cy="38" r="2.5" fill="white" opacity="0.3" />
        <circle cx="52" cy="44" r="2" fill="white" opacity="0.35" />
      </g>

      {/* Cat body */}
      <ellipse cx="15" cy="62" rx="13" ry="11" fill="#fafafa" stroke="#5d4037" strokeWidth="1.5" />

      {/* Cat head */}
      <circle cx="15" cy="42" r="12" fill="#fafafa" stroke="#5d4037" strokeWidth="1.5" />

      {/* Ears */}
      <polygon points="6,33 2,23 11,30" fill="#fafafa" stroke="#5d4037" strokeWidth="1.5" />
      <polygon points="7,32 4,26 10,31" fill="#ffab91" />
      <polygon points="24,33 28,23 19,30" fill="#fafafa" stroke="#5d4037" strokeWidth="1.5" />
      <polygon points="23,32 26,26 20,31" fill="#ffab91" />

      {/* Chef hat */}
      <ellipse cx="15" cy="31" rx="9" ry="2.5" fill="white" stroke="#bdbdbd" strokeWidth="0.5" />
      <rect x="8" y="24" width="14" height="8" rx="5" fill="white" stroke="#bdbdbd" strokeWidth="0.5" />

      {/* Eyes (focused, looking at pot) */}
      <ellipse cx="10" cy="41" rx="2" ry="2.5" fill="#424242" />
      <ellipse cx="20" cy="41" rx="2" ry="2.5" fill="#424242" />
      <circle cx="11" cy="40" r="0.8" fill="white" />
      <circle cx="21" cy="40" r="0.8" fill="white" />

      {/* Nose & mouth */}
      <ellipse cx="15" cy="45" rx="1.2" ry="0.8" fill="#ffab91" />
      <path d="M 13.5 46 Q 15 47.5, 16.5 46" fill="none" stroke="#5d4037" strokeWidth="0.6" />

      {/* Paw holding spoon */}
      <g className={styles.stirring}>
        <line x1="25" y1="55" x2="45" y2="52" stroke="#8d6e63" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="25" cy="56" rx="4" ry="3" fill="#fafafa" stroke="#5d4037" strokeWidth="1" />
      </g>

      {/* Tail */}
      <path
        d="M 3 65 Q -5 55, 0 48"
        fill="none"
        stroke="#fafafa"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Level badge */}
      <g transform="translate(55, 75)">
        <rect x="-12" y="-8" width="24" height="14" rx="3" fill="#fff8e1" stroke="#8d6e63" strokeWidth="0.8" />
        <text x="0" y="3" textAnchor="middle" fontSize="7" fill="#5d4037" fontWeight="bold">
          LV.1
        </text>
      </g>
    </g>
  );
};
