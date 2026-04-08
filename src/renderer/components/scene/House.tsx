import React from 'react';
import styles from './scene.module.css';

/**
 * SVG house background - cozy isometric-ish house scene with
 * warm lighting, lanterns, wooden furniture, and garden elements.
 * Inspired by the Cats & Soup art style.
 */
export const House: React.FC = () => {
  return (
    <g>
      {/* Sky gradient background */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a237e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1b5e20" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffcc02" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffcc02" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7cb342" />
          <stop offset="100%" stopColor="#558b2f" />
        </linearGradient>
        <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a1887f" />
          <stop offset="100%" stopColor="#8d6e63" />
        </linearGradient>
      </defs>

      {/* Ground/Grass */}
      <rect x="0" y="120" width="400" height="130" fill="url(#grassGrad)" />

      {/* Grass texture tufts */}
      <g opacity="0.4">
        <path d="M 10 150 Q 12 145, 14 150" fill="none" stroke="#9ccc65" strokeWidth="1" />
        <path d="M 50 160 Q 52 155, 54 160" fill="none" stroke="#9ccc65" strokeWidth="1" />
        <path d="M 100 170 Q 102 165, 104 170" fill="none" stroke="#9ccc65" strokeWidth="1" />
        <path d="M 200 155 Q 202 150, 204 155" fill="none" stroke="#9ccc65" strokeWidth="1" />
        <path d="M 300 165 Q 302 160, 304 165" fill="none" stroke="#9ccc65" strokeWidth="1" />
        <path d="M 350 150 Q 352 145, 354 150" fill="none" stroke="#9ccc65" strokeWidth="1" />
        <path d="M 150 175 Q 152 170, 154 175" fill="none" stroke="#9ccc65" strokeWidth="1" />
        <path d="M 250 145 Q 252 140, 254 145" fill="none" stroke="#9ccc65" strokeWidth="1" />
      </g>

      {/* Stone path */}
      <g>
        <ellipse cx="80" cy="180" rx="12" ry="5" fill="#9e9e9e" stroke="#757575" strokeWidth="0.5" />
        <ellipse cx="100" cy="185" rx="10" ry="4" fill="#bdbdbd" stroke="#757575" strokeWidth="0.5" />
        <ellipse cx="120" cy="182" rx="11" ry="4.5" fill="#9e9e9e" stroke="#757575" strokeWidth="0.5" />
        <ellipse cx="145" cy="186" rx="9" ry="4" fill="#bdbdbd" stroke="#757575" strokeWidth="0.5" />
        <ellipse cx="168" cy="183" rx="12" ry="5" fill="#9e9e9e" stroke="#757575" strokeWidth="0.5" />
      </g>

      {/* Wooden fence (background) */}
      <g opacity="0.5">
        {[0, 25, 50, 75, 100, 325, 350, 375].map((x) => (
          <rect key={x} x={x} y="115" width="4" height="18" rx="1" fill="#8d6e63" stroke="#6d4c41" strokeWidth="0.5" />
        ))}
        <rect x="0" y="120" width="110" height="3" rx="1" fill="#a1887f" />
        <rect x="320" y="120" width="80" height="3" rx="1" fill="#a1887f" />
      </g>

      {/* Left decorative bush */}
      <g>
        <circle cx="15" cy="140" r="10" fill="#66bb6a" opacity="0.7" />
        <circle cx="8" cy="145" r="8" fill="#81c784" opacity="0.6" />
        <circle cx="22" cy="143" r="9" fill="#a5d6a7" opacity="0.5" />
      </g>

      {/* Right decorative bush */}
      <g>
        <circle cx="380" cy="138" r="12" fill="#66bb6a" opacity="0.7" />
        <circle cx="372" cy="143" r="9" fill="#81c784" opacity="0.6" />
        <circle cx="388" cy="142" r="8" fill="#a5d6a7" opacity="0.5" />
      </g>

      {/* Lantern posts */}
      <g className={styles.lanternFlicker}>
        {/* Left lantern */}
        <rect x="58" y="115" width="3" height="25" fill="#5d4037" />
        <rect x="54" y="110" width="11" height="8" rx="2" fill="#37474f" stroke="#263238" strokeWidth="0.5" />
        <circle cx="59.5" cy="114" r="8" fill="url(#lanternGlow)" />
        <rect x="56" y="112" width="7" height="4" rx="1" fill="#ffcc02" opacity="0.8" />

        {/* Right lantern */}
        <rect x="338" y="115" width="3" height="25" fill="#5d4037" />
        <rect x="334" y="110" width="11" height="8" rx="2" fill="#37474f" stroke="#263238" strokeWidth="0.5" />
        <circle cx="339.5" cy="114" r="8" fill="url(#lanternGlow)" />
        <rect x="336" y="112" width="7" height="4" rx="1" fill="#ffcc02" opacity="0.8" />
      </g>

      {/* Small wooden stool */}
      <g>
        <ellipse cx="280" cy="170" rx="8" ry="3" fill="#a1887f" stroke="#6d4c41" strokeWidth="0.8" />
        <rect x="274" y="170" width="3" height="8" fill="#8d6e63" />
        <rect x="283" y="170" width="3" height="8" fill="#8d6e63" />
      </g>

      {/* Sack/bag (like in reference) */}
      <g>
        <ellipse cx="360" cy="170" rx="10" ry="8" fill="#d7ccc8" stroke="#a1887f" strokeWidth="1" />
        <path d="M 353 163 Q 360 158, 367 163" fill="none" stroke="#a1887f" strokeWidth="1.5" />
      </g>

      {/* Floating particles/fireflies */}
      <g className={styles.fireflies}>
        <circle cx="50" cy="100" r="1" fill="#ffcc02" opacity="0.6" />
        <circle cx="150" cy="90" r="0.8" fill="#ffcc02" opacity="0.4" />
        <circle cx="250" cy="105" r="1.2" fill="#ffcc02" opacity="0.5" />
        <circle cx="350" cy="95" r="0.8" fill="#ffcc02" opacity="0.3" />
        <circle cx="100" cy="110" r="0.6" fill="#ffcc02" opacity="0.5" />
        <circle cx="300" cy="85" r="1" fill="#ffcc02" opacity="0.4" />
      </g>

      {/* Small wooden sign */}
      <g>
        <rect x="170" y="165" width="4" height="15" fill="#8d6e63" />
        <rect x="160" y="160" width="24" height="10" rx="2" fill="#fff8e1" stroke="#8d6e63" strokeWidth="0.8" />
        <text x="172" y="168" textAnchor="middle" fontSize="5" fill="#5d4037" fontWeight="bold">1</text>
      </g>
    </g>
  );
};
