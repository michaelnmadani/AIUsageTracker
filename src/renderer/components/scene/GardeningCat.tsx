import React from 'react';
import styles from './scene.module.css';

interface GardeningCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style calico cat with straw hat and garden apron, watering plants.
 */
export const GardeningCat: React.FC<GardeningCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.gardeningCat}>
      {/* Ground shadow */}
      <ellipse cx="26" cy="96" rx="22" ry="4" fill="#3a2a1a" opacity="0.18" />

      {/* Plant pot with herb bush */}
      <g>
        <path d="M 52 64 L 48 88 L 64 88 L 60 64 Z" fill="#a08060" stroke="#7a5a3a" strokeWidth="1" />
        <ellipse cx="56" cy="64" rx="6" ry="2.5" fill="#5a4030" />
        <path d="M 56 64 Q 54 52, 57 44 Q 59 40, 56 36" fill="none" stroke="#5a7a30" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="56" cy="35" rx="7" ry="6" fill="#5a9a3a" stroke="#4a7a2a" strokeWidth="0.5" />
        <ellipse cx="50" cy="40" rx="5" ry="4" fill="#6aaa4a" stroke="#4a7a2a" strokeWidth="0.5" />
        <ellipse cx="62" cy="39" rx="5.5" ry="4.5" fill="#7aba5a" stroke="#4a7a2a" strokeWidth="0.5" />
        <line x1="56" y1="32" x2="56" y2="38" stroke="#4a8a2a" strokeWidth="0.4" opacity="0.5" />
        <line x1="50" y1="38" x2="50" y2="42" stroke="#4a8a2a" strokeWidth="0.4" opacity="0.5" />
      </g>

      {/* Flower pot */}
      <g>
        <path d="M -2 72 L -4 88 L 10 88 L 8 72 Z" fill="#c88060" stroke="#a06040" strokeWidth="0.8" />
        <ellipse cx="3" cy="72" rx="6" ry="2" fill="#5a4030" />
        <line x1="3" y1="72" x2="3" y2="54" stroke="#5a8a3a" strokeWidth="1.8" />
        <g className={styles.flowerSway}>
          <ellipse cx="0" cy="49" rx="2.8" ry="3.5" fill="#f0c060" transform="rotate(-30 0 49)" />
          <ellipse cx="6" cy="49" rx="2.8" ry="3.5" fill="#f0c060" transform="rotate(30 6 49)" />
          <ellipse cx="3" cy="46" rx="2.8" ry="3.5" fill="#f0c060" />
          <ellipse cx="0.5" cy="53" rx="2.8" ry="3.5" fill="#f0c060" transform="rotate(20 0.5 53)" />
          <ellipse cx="5.5" cy="53" rx="2.8" ry="3.5" fill="#f0c060" transform="rotate(-20 5.5 53)" />
          <circle cx="3" cy="50" r="2.5" fill="#d48020" />
          <circle cx="2.5" cy="49.5" r="0.8" fill="#e8a040" opacity="0.6" />
        </g>
        <ellipse cx="-1" cy="62" rx="3" ry="1.5" fill="#6aaa4a" transform="rotate(-20 -1 62)" />
        <ellipse cx="7" cy="64" rx="3" ry="1.5" fill="#6aaa4a" transform="rotate(15 7 64)" />
      </g>

      {/* Watering can */}
      <g className={styles.wateringMotion}>
        <rect x="36" y="50" width="12" height="10" rx="2.5" fill="#8a9aaa" stroke="#6a7a8a" strokeWidth="0.8" />
        <path d="M 48 52 L 56 46" stroke="#8a9aaa" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="57" cy="45" rx="3" ry="2" fill="#7a8a9a" stroke="#6a7a8a" strokeWidth="0.4" />
        <path d="M 38 50 Q 36 44, 42 44 Q 48 44, 46 50" fill="none" stroke="#7a8a9a" strokeWidth="1.5" />
        <g className={styles.waterDrops}>
          <circle cx="56" cy="48" r="1" fill="#88ccee" opacity="0.7" />
          <circle cx="58" cy="50" r="0.8" fill="#88ccee" opacity="0.55" />
          <circle cx="54" cy="51" r="0.9" fill="#88ccee" opacity="0.6" />
        </g>
      </g>

      {/* Tail */}
      <path d="M 6 82 Q -2 66, 2 52 Q 4 46, 9 44" fill="none" stroke="url(#furCalico)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 6 82 Q -2 66, 2 52 Q 4 46, 9 44" fill="none" stroke="#a08868" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
      {/* Calico tail patches */}
      <circle cx="2" cy="60" r="3" fill="#e8a050" opacity="0.35" />
      <circle cx="5" cy="50" r="2.5" fill="#6d5040" opacity="0.15" />

      {/* Legs */}
      <path d="M 15 78 L 14 88 Q 14 92, 11 92 L 11 93 Q 11 95, 17 95 Q 19 95, 19 92 L 19 88 L 18 78" fill="url(#furCalico)" stroke="#a08868" strokeWidth="0.7" />
      <path d="M 25 78 L 24 88 Q 24 92, 21 92 L 21 93 Q 21 95, 27 95 Q 29 95, 29 92 L 29 88 L 28 78" fill="url(#furCalico)" stroke="#a08868" strokeWidth="0.7" />
      {/* Shoes - garden clogs */}
      <ellipse cx="15" cy="94" rx="5" ry="2.5" fill="#6a8a4a" stroke="#4a6a2a" strokeWidth="0.5" />
      <ellipse cx="27" cy="94" rx="5" ry="2.5" fill="#6a8a4a" stroke="#4a6a2a" strokeWidth="0.5" />
      {/* Socks with lace tops */}
      <rect x="12" y="86" width="6" height="6" rx="2" fill="white" stroke="#e0d0c0" strokeWidth="0.3" />
      <rect x="22" y="86" width="6" height="6" rx="2" fill="white" stroke="#e0d0c0" strokeWidth="0.3" />
      <path d="M 12 86 Q 13 85, 14 86 Q 15 85, 16 86 Q 17 85, 18 86" fill="none" stroke="#e0d0c0" strokeWidth="0.4" />
      <path d="M 22 86 Q 23 85, 24 86 Q 25 85, 26 86 Q 27 85, 28 86" fill="none" stroke="#e0d0c0" strokeWidth="0.4" />

      {/* Body */}
      <path d="M 8 52 Q 6 58, 7 68 Q 8 78, 12 80 Q 21 84, 30 80 Q 34 78, 35 68 Q 36 58, 34 52 Q 28 48, 21 48 Q 14 48, 8 52 Z" fill="url(#furCalico)" stroke="#a08868" strokeWidth="1" />
      {/* Calico patches */}
      <ellipse cx="15" cy="62" rx="6" ry="5" fill="#e8a050" opacity="0.35" />
      <ellipse cx="28" cy="70" rx="5" ry="4" fill="#6d5040" opacity="0.15" />
      <path d="M 8 52 Q 6 58, 7 68 Q 8 74, 10 78 Q 12 68, 12 56 Q 12 50, 8 52" fill="#a08868" opacity="0.06" />
      {/* Garden apron */}
      <path d="M 12 56 Q 21 53, 30 56 L 32 80 Q 21 84, 10 80 Z" fill="#88b868" stroke="#68a048" strokeWidth="0.7" opacity="0.9" />
      <rect x="17" y="66" width="10" height="7" rx="1.5" fill="#98c878" stroke="#78a858" strokeWidth="0.4" />
      {/* Flower on pocket */}
      <circle cx="22" cy="69" r="2.2" fill="#f0c080" />
      <circle cx="22" cy="69" r="1.2" fill="#e8a050" />
      {/* Apron lace */}
      <path d="M 10 78 Q 13 76, 16 78 Q 19 76, 22 78 Q 25 76, 28 78 Q 31 76, 32 78" fill="none" stroke="#78a858" strokeWidth="0.7" />
      {/* Fold lines */}
      <path d="M 16 58 L 15 74" fill="none" stroke="#68a048" strokeWidth="0.3" opacity="0.4" />
      <path d="M 26 58 L 27 74" fill="none" stroke="#68a048" strokeWidth="0.3" opacity="0.4" />

      {/* Head */}
      <circle cx="21" cy="36" r="17" fill="url(#furCalico)" stroke="#a08868" strokeWidth="1" />
      <path d="M 13 30 Q 17 27, 21 32 Q 17 34, 13 30" fill="#e8a050" opacity="0.4" />
      <path d="M 28 34 Q 32 32, 30 28" fill="#6d5040" opacity="0.15" />
      <path d="M 6 30 Q 4 36, 6 42 Q 8 38, 8 32 Q 7 28, 6 30" fill="#a08868" opacity="0.06" />

      {/* Hair tufts */}
      <path d="M 13 20 Q 15 14, 18 20 Q 19 13, 21 18 Q 23 13, 25 20 Q 27 14, 29 20" fill="url(#furCalico)" stroke="#a08868" strokeWidth="0.5" />

      {/* Straw hat */}
      <ellipse cx="21" cy="28" rx="17" ry="4.5" fill="#d4b070" stroke="#a08050" strokeWidth="0.8" />
      <ellipse cx="21" cy="26" rx="11" ry="7" fill="#e0c080" stroke="#a08050" strokeWidth="0.8" />
      <ellipse cx="21" cy="28" rx="12" ry="1.8" fill="#e07080" opacity="0.55" />
      {/* Ribbon bow */}
      <path d="M 32 27 Q 36 25, 34 29 Q 32 27, 32 27" fill="#e07080" stroke="#c06070" strokeWidth="0.3" />
      <path d="M 32 27 Q 36 29, 34 25 Q 32 27, 32 27" fill="#d06070" stroke="#c06070" strokeWidth="0.3" />
      {/* Hat weave */}
      <path d="M 12 25 Q 16 23, 21 25 Q 26 23, 30 25" fill="none" stroke="#b09050" strokeWidth="0.4" opacity="0.4" />

      {/* Ears */}
      <path d="M 11,28 Q 7,18 5,10 Q 9,16 17,26" fill="url(#furCalico)" stroke="#a08868" strokeWidth="1" />
      <path d="M 12,27 Q 9,20 8,14 Q 10,18 16,26" fill="#f0b8a8" opacity="0.45" />
      <path d="M 31,28 Q 35,18 37,10 Q 33,16 25,26" fill="url(#furCalico)" stroke="#a08868" strokeWidth="1" />
      <path d="M 30,27 Q 33,20 34,14 Q 32,18 26,26" fill="#f0b8a8" opacity="0.45" />

      {/* Eyes - cheerful */}
      <ellipse cx="15" cy="36" rx="3.8" ry="4.5" fill="white" stroke="#8a7858" strokeWidth="0.5" />
      <ellipse cx="15" cy="37" rx="3" ry="3.6" fill="url(#irisBlue)" />
      <ellipse cx="15" cy="37.5" rx="2" ry="2.4" fill="#2a3a4a" />
      <circle cx="13.5" cy="35.5" r="1.3" fill="white" opacity="0.9" />
      <circle cx="16.5" cy="38" r="0.6" fill="white" opacity="0.5" />
      <path d="M 11 32 Q 13.5 31, 16 32" fill="none" stroke="#a08868" strokeWidth="1" strokeLinecap="round" />

      <ellipse cx="27" cy="36" rx="3.8" ry="4.5" fill="white" stroke="#8a7858" strokeWidth="0.5" />
      <ellipse cx="27" cy="37" rx="3" ry="3.6" fill="url(#irisBlue)" />
      <ellipse cx="27" cy="37.5" rx="2" ry="2.4" fill="#2a3a4a" />
      <circle cx="25.5" cy="35.5" r="1.3" fill="white" opacity="0.9" />
      <circle cx="28.5" cy="38" r="0.6" fill="white" opacity="0.5" />
      <path d="M 24 32 Q 26.5 31, 29 32" fill="none" stroke="#a08868" strokeWidth="1" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="10" cy="41" rx="3.5" ry="2.2" fill="url(#blushMark)" />
      <ellipse cx="32" cy="41" rx="3.5" ry="2.2" fill="url(#blushMark)" />

      {/* Nose & mouth */}
      <path d="M 20 43 L 21 41.5 L 22 43 Z" fill="#e8a898" />
      <path d="M 18 44 Q 21 46.5, 24 44" fill="none" stroke="#8d6e63" strokeWidth="0.6" />
      <path d="M 19 44.5 Q 21 47, 23 44.5" fill="#f0c0b0" stroke="#8d6e63" strokeWidth="0.3" />

      {/* Whiskers */}
      <line x1="3" y1="40" x2="12" y2="41" stroke="#b09878" strokeWidth="0.4" opacity="0.3" />
      <line x1="2" y1="43" x2="12" y2="42" stroke="#b09878" strokeWidth="0.4" opacity="0.3" />
      <line x1="30" y1="41" x2="39" y2="40" stroke="#b09878" strokeWidth="0.4" opacity="0.3" />
      <line x1="30" y1="42" x2="40" y2="43" stroke="#b09878" strokeWidth="0.4" opacity="0.3" />

      {/* Paw reaching for watering can */}
      <ellipse cx="36" cy="58" rx="5.5" ry="3.5" fill="url(#furCalico)" stroke="#a08868" strokeWidth="0.8" />
      <circle cx="34" cy="57" r="0.8" fill="#e8b0a0" opacity="0.5" />
      <circle cx="36" cy="56.5" r="0.8" fill="#e8b0a0" opacity="0.5" />
      <circle cx="38" cy="57" r="0.8" fill="#e8b0a0" opacity="0.5" />
    </g>
  );
};
