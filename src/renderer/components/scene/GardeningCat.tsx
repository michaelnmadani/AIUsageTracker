import React from 'react';
import styles from './scene.module.css';

interface GardeningCatProps {
  x?: number;
  y?: number;
}

/**
 * Cat gardening/watering plants - always present decorative cat.
 * Calico cat with a straw hat tending to plants outside the tavern.
 */
export const GardeningCat: React.FC<GardeningCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.gardeningCat}>
      {/* Shadow */}
      <ellipse cx="30" cy="82" rx="20" ry="4" fill="#3a2a1a" opacity="0.2" />

      {/* Plant pot with herb bush */}
      <g>
        <path d="M 48 60 L 44 80 L 60 80 L 56 60 Z" fill="#a08060" stroke="#7a5a3a" strokeWidth="1" />
        <ellipse cx="52" cy="60" rx="5" ry="2" fill="#5a4030" />
        <path d="M 52 60 Q 50 50, 54 42 Q 56 38, 52 35" fill="none" stroke="#6d5030" strokeWidth="2" strokeLinecap="round" />
        <circle cx="52" cy="34" r="6" fill="#5a8a3a" stroke="#4a7030" strokeWidth="0.5" />
        <circle cx="47" cy="38" r="4" fill="#6a9a4a" stroke="#4a7030" strokeWidth="0.5" />
        <circle cx="57" cy="37" r="4.5" fill="#7aaa5a" stroke="#4a7030" strokeWidth="0.5" />
      </g>

      {/* Flower pot */}
      <g>
        <path d="M 0 68 L -2 80 L 10 80 L 8 68 Z" fill="#c88060" stroke="#a06040" strokeWidth="0.8" />
        <line x1="4" y1="68" x2="4" y2="55" stroke="#5a8a3a" strokeWidth="1.5" />
        <g className={styles.flowerSway}>
          <circle cx="4" cy="52" r="3" fill="#e8a050" />
          <circle cx="1" cy="50" r="2.5" fill="#f0b860" />
          <circle cx="7" cy="50" r="2.5" fill="#f0b860" />
          <circle cx="4" cy="48" r="2.5" fill="#f0b860" />
          <circle cx="2" cy="53" r="2.5" fill="#f0b860" />
          <circle cx="6" cy="53" r="2.5" fill="#f0b860" />
          <circle cx="4" cy="51" r="1.5" fill="#d48020" />
        </g>
      </g>

      {/* Watering can */}
      <g className={styles.wateringMotion}>
        <rect x="32" y="48" width="10" height="8" rx="2" fill="#8a7a6a" stroke="#6a5a4a" strokeWidth="0.8" />
        <path d="M 42 50 L 48 46" stroke="#8a7a6a" strokeWidth="2" strokeLinecap="round" />
        <g className={styles.waterDrops}>
          <circle cx="48" cy="48" r="0.8" fill="#88bbdd" opacity="0.7" />
          <circle cx="49" cy="50" r="0.6" fill="#88bbdd" opacity="0.5" />
          <circle cx="47" cy="51" r="0.7" fill="#88bbdd" opacity="0.6" />
        </g>
      </g>

      {/* Cat body */}
      <ellipse cx="22" cy="65" rx="13" ry="11" fill="#f5f0e8" stroke="#8d6e63" strokeWidth="1.2" />
      {/* Calico patches */}
      <ellipse cx="18" cy="62" rx="5" ry="4" fill="#e8a050" opacity="0.5" />
      <ellipse cx="28" cy="68" rx="4" ry="3" fill="#6d5040" opacity="0.25" />

      {/* Cat head */}
      <circle cx="22" cy="44" r="12" fill="#f5f0e8" stroke="#8d6e63" strokeWidth="1.2" />
      {/* Calico head patch */}
      <path d="M 16 36 Q 20 34, 22 38 Q 18 40, 16 36" fill="#e8a050" opacity="0.5" />

      {/* Straw hat */}
      <ellipse cx="22" cy="35" rx="13" ry="3" fill="#d4b070" stroke="#a08050" strokeWidth="0.8" />
      <ellipse cx="22" cy="33" rx="8" ry="4.5" fill="#e0c080" stroke="#a08050" strokeWidth="0.8" />
      {/* Hat ribbon */}
      <ellipse cx="22" cy="35" rx="9" ry="1.2" fill="#cc6644" opacity="0.6" />

      {/* Ears (poking through hat) */}
      <polygon points="14,34 11,27 17,33" fill="#f5f0e8" stroke="#8d6e63" strokeWidth="1" />
      <polygon points="30,34 33,27 27,33" fill="#f5f0e8" stroke="#8d6e63" strokeWidth="1" />

      {/* Eyes (cheerful) */}
      <ellipse cx="17" cy="44" rx="2.5" ry="3" fill="#3a2a1a" />
      <ellipse cx="27" cy="44" rx="2.5" ry="3" fill="#3a2a1a" />
      <circle cx="18" cy="43" r="0.8" fill="white" />
      <circle cx="28" cy="43" r="0.8" fill="white" />

      {/* Rosy cheeks */}
      <circle cx="14" cy="47" r="2.5" fill="#e8a090" opacity="0.4" />
      <circle cx="30" cy="47" r="2.5" fill="#e8a090" opacity="0.4" />

      {/* Nose & mouth */}
      <ellipse cx="22" cy="48" rx="1.2" ry="0.8" fill="#e8b4a0" />
      <path d="M 20 49 Q 22 50.5, 24 49" fill="none" stroke="#8d6e63" strokeWidth="0.6" />

      {/* Paw reaching for watering can */}
      <ellipse cx="33" cy="54" rx="4" ry="3" fill="#f5f0e8" stroke="#8d6e63" strokeWidth="0.8" />

      {/* Tail */}
      <path d="M 10 72 Q 2 64, 5 55" fill="none" stroke="#f5f0e8" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 10 72 Q 2 64, 5 55" fill="none" stroke="#8d6e63" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />


    </g>
  );
};
