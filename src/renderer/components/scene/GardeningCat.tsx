import React from 'react';
import styles from './scene.module.css';

interface GardeningCatProps {
  x?: number;
  y?: number;
}

/**
 * Cat gardening/watering plants - always present decorative cat.
 * Calico cat with a safari hat tending to bonsai and flowers.
 */
export const GardeningCat: React.FC<GardeningCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.gardeningCat}>
      {/* Shadow */}
      <ellipse cx="30" cy="82" rx="20" ry="4" fill="#37474f" opacity="0.2" />

      {/* Plant pot with bonsai */}
      <g>
        <path d="M 48 60 L 44 80 L 60 80 L 56 60 Z" fill="#a1887f" stroke="#6d4c41" strokeWidth="1" />
        {/* Soil */}
        <ellipse cx="52" cy="60" rx="5" ry="2" fill="#5d4037" />
        {/* Bonsai trunk */}
        <path d="M 52 60 Q 50 50, 54 42 Q 56 38, 52 35" fill="none" stroke="#6d4c41" strokeWidth="2" strokeLinecap="round" />
        {/* Bonsai foliage */}
        <circle cx="52" cy="34" r="6" fill="#66bb6a" stroke="#43a047" strokeWidth="0.5" />
        <circle cx="47" cy="38" r="4" fill="#81c784" stroke="#43a047" strokeWidth="0.5" />
        <circle cx="57" cy="37" r="4.5" fill="#a5d6a7" stroke="#43a047" strokeWidth="0.5" />
      </g>

      {/* Flower pot */}
      <g>
        <path d="M 0 68 L -2 80 L 10 80 L 8 68 Z" fill="#ffab91" stroke="#e64a19" strokeWidth="0.8" />
        {/* Flower */}
        <line x1="4" y1="68" x2="4" y2="55" stroke="#66bb6a" strokeWidth="1.5" />
        <g className={styles.flowerSway}>
          <circle cx="4" cy="52" r="3" fill="#ffd54f" />
          <circle cx="1" cy="50" r="2.5" fill="#fff176" />
          <circle cx="7" cy="50" r="2.5" fill="#fff176" />
          <circle cx="4" cy="48" r="2.5" fill="#fff176" />
          <circle cx="2" cy="53" r="2.5" fill="#fff176" />
          <circle cx="6" cy="53" r="2.5" fill="#fff176" />
          <circle cx="4" cy="51" r="1.5" fill="#ff8f00" />
        </g>
      </g>

      {/* Watering can */}
      <g className={styles.wateringMotion}>
        <rect x="32" y="48" width="10" height="8" rx="2" fill="#78909c" stroke="#546e7a" strokeWidth="0.8" />
        <path d="M 42 50 L 48 46" stroke="#78909c" strokeWidth="2" strokeLinecap="round" />
        {/* Water drops */}
        <g className={styles.waterDrops}>
          <circle cx="48" cy="48" r="0.8" fill="#4fc3f7" opacity="0.7" />
          <circle cx="49" cy="50" r="0.6" fill="#4fc3f7" opacity="0.5" />
          <circle cx="47" cy="51" r="0.7" fill="#4fc3f7" opacity="0.6" />
        </g>
      </g>

      {/* Cat body */}
      <ellipse cx="22" cy="65" rx="13" ry="11" fill="#fafafa" stroke="#5d4037" strokeWidth="1.5" />
      {/* Calico patches */}
      <ellipse cx="18" cy="62" rx="5" ry="4" fill="#ff9800" opacity="0.6" />
      <ellipse cx="28" cy="68" rx="4" ry="3" fill="#424242" opacity="0.3" />

      {/* Cat head */}
      <circle cx="22" cy="44" r="12" fill="#fafafa" stroke="#5d4037" strokeWidth="1.5" />
      {/* Calico head patch */}
      <path d="M 16 36 Q 20 34, 22 38 Q 18 40, 16 36" fill="#ff9800" opacity="0.6" />

      {/* Safari hat */}
      <ellipse cx="22" cy="35" rx="13" ry="3" fill="#8d6e63" stroke="#5d4037" strokeWidth="0.8" />
      <ellipse cx="22" cy="33" rx="8" ry="4.5" fill="#a1887f" stroke="#5d4037" strokeWidth="0.8" />

      {/* Ears (poking through hat) */}
      <polygon points="14,34 11,27 17,33" fill="#fafafa" stroke="#5d4037" strokeWidth="1" />
      <polygon points="30,34 33,27 27,33" fill="#fafafa" stroke="#5d4037" strokeWidth="1" />

      {/* Eyes (cheerful) */}
      <ellipse cx="17" cy="44" rx="2.5" ry="3" fill="#424242" />
      <ellipse cx="27" cy="44" rx="2.5" ry="3" fill="#424242" />
      <circle cx="18" cy="43" r="0.8" fill="white" />
      <circle cx="28" cy="43" r="0.8" fill="white" />

      {/* Rosy cheeks */}
      <circle cx="14" cy="47" r="2" fill="#ffab91" opacity="0.4" />
      <circle cx="30" cy="47" r="2" fill="#ffab91" opacity="0.4" />

      {/* Nose & mouth */}
      <ellipse cx="22" cy="48" rx="1.2" ry="0.8" fill="#ffab91" />
      <path d="M 20 49 Q 22 50.5, 24 49" fill="none" stroke="#5d4037" strokeWidth="0.6" />

      {/* Paw reaching for watering can */}
      <ellipse cx="33" cy="54" rx="4" ry="3" fill="#fafafa" stroke="#5d4037" strokeWidth="0.8" />

      {/* Tail */}
      <path
        d="M 10 72 Q 2 64, 5 55"
        fill="none"
        stroke="#fafafa"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Level badge */}
      <g transform="translate(52, 25)">
        <rect x="-14" y="-8" width="28" height="14" rx="3" fill="#fff8e1" stroke="#8d6e63" strokeWidth="0.8" />
        <text x="0" y="3" textAnchor="middle" fontSize="6" fill="#5d4037" fontWeight="bold">
          LV. 701
        </text>
      </g>
    </g>
  );
};
