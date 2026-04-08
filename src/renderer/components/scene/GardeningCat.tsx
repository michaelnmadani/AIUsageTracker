import React from 'react';
import styles from './scene.module.css';

interface GardeningCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style calico cat with straw hat and garden apron, watering plants.
 * Always-present decorative cat tending to plants.
 */
export const GardeningCat: React.FC<GardeningCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.gardeningCat}>
      {/* Ground shadow */}
      <ellipse cx="28" cy="84" rx="22" ry="4" fill="#3a2a1a" opacity="0.18" />

      {/* Plant pot with herb bush */}
      <g>
        <path d="M 50 60 L 46 82 L 62 82 L 58 60 Z" fill="#a08060" stroke="#7a5a3a" strokeWidth="1" />
        <ellipse cx="54" cy="60" rx="6" ry="2.5" fill="#5a4030" />
        {/* Bush with leaf detail */}
        <path d="M 54 60 Q 52 50, 55 42 Q 57 38, 54 34" fill="none" stroke="#5a7a30" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="54" cy="33" rx="7" ry="6" fill="#5a9a3a" stroke="#4a7a2a" strokeWidth="0.5" />
        <ellipse cx="48" cy="38" rx="5" ry="4" fill="#6aaa4a" stroke="#4a7a2a" strokeWidth="0.5" />
        <ellipse cx="60" cy="37" rx="5.5" ry="4.5" fill="#7aba5a" stroke="#4a7a2a" strokeWidth="0.5" />
        {/* Leaf veins */}
        <line x1="54" y1="30" x2="54" y2="36" stroke="#4a8a2a" strokeWidth="0.4" opacity="0.5" />
        <line x1="48" y1="36" x2="48" y2="40" stroke="#4a8a2a" strokeWidth="0.4" opacity="0.5" />
      </g>

      {/* Flower pot with detailed flowers */}
      <g>
        <path d="M -2 68 L -4 82 L 10 82 L 8 68 Z" fill="#c88060" stroke="#a06040" strokeWidth="0.8" />
        <ellipse cx="3" cy="68" rx="6" ry="2" fill="#5a4030" />
        <line x1="3" y1="68" x2="3" y2="52" stroke="#5a8a3a" strokeWidth="1.8" />
        <g className={styles.flowerSway}>
          {/* Detailed flower with layers */}
          <circle cx="3" cy="49" r="4" fill="#e8a050" stroke="#d09040" strokeWidth="0.3" />
          <ellipse cx="0" cy="47" rx="2.5" ry="3" fill="#f0c060" transform="rotate(-30 0 47)" />
          <ellipse cx="6" cy="47" rx="2.5" ry="3" fill="#f0c060" transform="rotate(30 6 47)" />
          <ellipse cx="3" cy="44.5" rx="2.5" ry="3" fill="#f0c060" />
          <ellipse cx="0.5" cy="51" rx="2.5" ry="3" fill="#f0c060" transform="rotate(20 0.5 51)" />
          <ellipse cx="5.5" cy="51" rx="2.5" ry="3" fill="#f0c060" transform="rotate(-20 5.5 51)" />
          {/* Flower center */}
          <circle cx="3" cy="49" r="2" fill="#d48020" />
          <circle cx="2.5" cy="48.5" r="0.5" fill="#e8a040" opacity="0.6" />
        </g>
        {/* Small leaf */}
        <ellipse cx="-1" cy="58" rx="3" ry="1.5" fill="#6aaa4a" transform="rotate(-20 -1 58)" />
        <ellipse cx="7" cy="60" rx="3" ry="1.5" fill="#6aaa4a" transform="rotate(15 7 60)" />
      </g>

      {/* Watering can */}
      <g className={styles.wateringMotion}>
        <rect x="34" y="48" width="12" height="10" rx="2.5" fill="#8a9aaa" stroke="#6a7a8a" strokeWidth="0.8" />
        {/* Spout */}
        <path d="M 46 50 L 54 44" stroke="#8a9aaa" strokeWidth="2.5" strokeLinecap="round" />
        {/* Spout rose (sprinkler end) */}
        <ellipse cx="55" cy="43" rx="3" ry="2" fill="#7a8a9a" stroke="#6a7a8a" strokeWidth="0.4" />
        {/* Handle */}
        <path d="M 36 48 Q 34 42, 40 42 Q 46 42, 44 48" fill="none" stroke="#7a8a9a" strokeWidth="1.5" />
        {/* Water drops */}
        <g className={styles.waterDrops}>
          <circle cx="54" cy="46" r="1" fill="#88ccee" opacity="0.7" />
          <circle cx="56" cy="48" r="0.8" fill="#88ccee" opacity="0.55" />
          <circle cx="52" cy="49" r="0.9" fill="#88ccee" opacity="0.6" />
        </g>
      </g>

      {/* Tail (behind body) */}
      <path d="M 8 76 Q 0 62, 4 50 Q 6 44, 10 42" fill="none" stroke="url(#furCalico)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 8 76 Q 0 62, 4 50 Q 6 44, 10 42" fill="none" stroke="#a08868" strokeWidth="0.8" strokeLinecap="round" opacity="0.25" />
      {/* Calico tail patches */}
      <circle cx="4" cy="56" r="3" fill="#e8a050" opacity="0.4" />
      <circle cx="6" cy="48" r="2.5" fill="#6d5040" opacity="0.2" />

      {/* Body with garden apron */}
      <ellipse cx="24" cy="68" rx="15" ry="13" fill="url(#furCalico)" stroke="#a08868" strokeWidth="1" />
      {/* Calico patches on body */}
      <ellipse cx="18" cy="64" rx="6" ry="5" fill="#e8a050" opacity="0.4" />
      <ellipse cx="30" cy="70" rx="5" ry="4" fill="#6d5040" opacity="0.2" />
      {/* Garden apron - green with floral trim */}
      <path d="M 14 58 Q 24 55, 34 58 L 36 80 Q 24 84, 12 80 Z" fill="#88b868" stroke="#68a048" strokeWidth="0.7" opacity="0.9" />
      {/* Apron pocket with flower */}
      <rect x="19" y="66" width="10" height="7" rx="1.5" fill="#98c878" stroke="#78a858" strokeWidth="0.4" />
      {/* Tiny flower on pocket */}
      <circle cx="24" cy="69" r="2" fill="#f0c080" />
      <circle cx="24" cy="69" r="1" fill="#e8a050" />
      {/* Apron frill */}
      <path d="M 12 78 Q 16 76, 20 78 Q 24 76, 28 78 Q 32 76, 36 78" fill="none" stroke="#78a858" strokeWidth="0.6" />

      {/* Head (chibi) */}
      <circle cx="24" cy="40" r="16" fill="url(#furCalico)" stroke="#a08868" strokeWidth="1" />
      {/* Calico head patches */}
      <path d="M 16 32 Q 20 29, 24 34 Q 20 36, 16 32" fill="#e8a050" opacity="0.45" />
      <path d="M 30 36 Q 34 34, 32 30" fill="#6d5040" opacity="0.18" />
      {/* Hair tufts */}
      <path d="M 18 26 Q 20 22, 22 26 Q 24 22, 26 26 Q 28 22, 30 26" fill="url(#furCalico)" stroke="#a08868" strokeWidth="0.5" />

      {/* Straw hat - detailed with weave pattern */}
      <ellipse cx="24" cy="30" rx="16" ry="4" fill="#d4b070" stroke="#a08050" strokeWidth="0.8" />
      <ellipse cx="24" cy="28" rx="10" ry="6" fill="#e0c080" stroke="#a08050" strokeWidth="0.8" />
      {/* Hat ribbon - pink bow */}
      <ellipse cx="24" cy="30" rx="11" ry="1.5" fill="#e07080" opacity="0.6" />
      {/* Ribbon bow */}
      <path d="M 34 29 Q 38 27, 36 31 Q 34 29, 34 29" fill="#e07080" stroke="#c06070" strokeWidth="0.3" />
      <path d="M 34 29 Q 38 31, 36 27 Q 34 29, 34 29" fill="#d06070" stroke="#c06070" strokeWidth="0.3" />
      {/* Hat weave lines */}
      <path d="M 16 27 Q 20 25, 24 27 Q 28 25, 32 27" fill="none" stroke="#b09050" strokeWidth="0.4" opacity="0.4" />

      {/* Ears (poking through hat) */}
      <polygon points="14,30 9,18 20,28" fill="url(#furCalico)" stroke="#a08868" strokeWidth="1" />
      <polygon points="15,29 11,22 19,28" fill="#f0b8a8" opacity="0.5" />
      <polygon points="34,30 39,18 28,28" fill="url(#furCalico)" stroke="#a08868" strokeWidth="1" />
      <polygon points="33,29 37,22 29,28" fill="#f0b8a8" opacity="0.5" />

      {/* Eyes - cheerful anime style */}
      <ellipse cx="18" cy="40" rx="3.5" ry="4.2" fill="white" stroke="#8a7858" strokeWidth="0.5" />
      <ellipse cx="18" cy="41" rx="2.8" ry="3.3" fill="url(#irisBlue)" />
      <ellipse cx="18" cy="41.5" rx="1.8" ry="2.2" fill="#2a3a4a" />
      <circle cx="16.8" cy="39.5" r="1.2" fill="white" opacity="0.9" />
      <circle cx="19" cy="41.5" r="0.5" fill="white" opacity="0.5" />
      <path d="M 14.5 37 Q 16 36, 18 36.5" fill="none" stroke="#a08868" strokeWidth="0.5" />

      <ellipse cx="30" cy="40" rx="3.5" ry="4.2" fill="white" stroke="#8a7858" strokeWidth="0.5" />
      <ellipse cx="30" cy="41" rx="2.8" ry="3.3" fill="url(#irisBlue)" />
      <ellipse cx="30" cy="41.5" rx="1.8" ry="2.2" fill="#2a3a4a" />
      <circle cx="28.8" cy="39.5" r="1.2" fill="white" opacity="0.9" />
      <circle cx="31" cy="41.5" r="0.5" fill="white" opacity="0.5" />
      <path d="M 28" y1="36.5" x2="30" y2="36" fill="none" stroke="#a08868" strokeWidth="0.5" />

      {/* Blush marks */}
      <ellipse cx="13" cy="45" rx="3.5" ry="2" fill="url(#blushMark)" />
      <ellipse cx="35" cy="45" rx="3.5" ry="2" fill="url(#blushMark)" />

      {/* Nose & mouth */}
      <path d="M 23 46 L 24 44.5 L 25 46 Z" fill="#e8a898" />
      <path d="M 21 47 Q 24 49, 27 47" fill="none" stroke="#8d6e63" strokeWidth="0.6" />
      {/* Open happy mouth */}
      <path d="M 22 47.5 Q 24 50, 26 47.5" fill="#f0c0b0" stroke="#8d6e63" strokeWidth="0.3" />

      {/* Whiskers */}
      <line x1="5" y1="43" x2="14" y2="44" stroke="#b09878" strokeWidth="0.4" opacity="0.35" />
      <line x1="4" y1="46" x2="14" y2="45.5" stroke="#b09878" strokeWidth="0.4" opacity="0.35" />
      <line x1="34" y1="44" x2="43" y2="43" stroke="#b09878" strokeWidth="0.4" opacity="0.35" />
      <line x1="34" y1="45.5" x2="44" y2="46" stroke="#b09878" strokeWidth="0.4" opacity="0.35" />

      {/* Paw reaching for watering can */}
      <ellipse cx="36" cy="56" rx="5" ry="3.5" fill="url(#furCalico)" stroke="#a08868" strokeWidth="0.8" />
      <circle cx="34.5" cy="55" r="0.7" fill="#e8b0a0" opacity="0.5" />
      <circle cx="36.5" cy="54.5" r="0.7" fill="#e8b0a0" opacity="0.5" />
      <circle cx="38" cy="55" r="0.7" fill="#e8b0a0" opacity="0.5" />
    </g>
  );
};
