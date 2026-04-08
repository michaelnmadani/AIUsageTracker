import React from 'react';
import styles from './scene.module.css';

interface TypingCatProps {
  x?: number;
  y?: number;
}

/**
 * Cat typing at a desk - shown when Claude is writing code.
 * Brown cat at a small wooden desk with a glowing monitor.
 */
export const TypingCat: React.FC<TypingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.typingCat}>
      {/* Shadow */}
      <ellipse cx="35" cy="82" rx="25" ry="5" fill="#37474f" opacity="0.2" />

      {/* Desk */}
      <rect x="20" y="58" width="40" height="4" rx="1" fill="#8d6e63" stroke="#5d4037" strokeWidth="1" />
      {/* Desk legs */}
      <rect x="22" y="62" width="3" height="18" fill="#8d6e63" stroke="#5d4037" strokeWidth="0.5" />
      <rect x="55" y="62" width="3" height="18" fill="#8d6e63" stroke="#5d4037" strokeWidth="0.5" />

      {/* Monitor */}
      <rect x="32" y="38" width="22" height="18" rx="2" fill="#263238" stroke="#455a64" strokeWidth="1.5" />
      {/* Screen glow */}
      <rect x="34" y="40" width="18" height="14" rx="1" fill="#1a237e" opacity="0.8" />
      {/* Code lines on screen */}
      <g className={styles.codeLines}>
        <line x1="36" y1="43" x2="46" y2="43" stroke="#4fc3f7" strokeWidth="0.8" opacity="0.8" />
        <line x1="36" y1="46" x2="49" y2="46" stroke="#81c784" strokeWidth="0.8" opacity="0.8" />
        <line x1="38" y1="49" x2="48" y2="49" stroke="#ffcc02" strokeWidth="0.8" opacity="0.8" />
        <line x1="36" y1="52" x2="44" y2="52" stroke="#ce93d8" strokeWidth="0.8" opacity="0.8" />
      </g>
      {/* Monitor stand */}
      <rect x="40" y="56" width="6" height="3" fill="#455a64" />

      {/* Keyboard */}
      <rect x="28" y="58" width="20" height="3" rx="1" fill="#37474f" stroke="#263238" strokeWidth="0.5" />

      {/* Cat body */}
      <ellipse cx="18" cy="60" rx="12" ry="10" fill="#795548" stroke="#5d4037" strokeWidth="1.5" />

      {/* Cat head */}
      <circle cx="18" cy="42" r="12" fill="#795548" stroke="#5d4037" strokeWidth="1.5" />

      {/* Ears */}
      <polygon points="9,33 5,22 14,30" fill="#795548" stroke="#5d4037" strokeWidth="1.5" />
      <polygon points="10,32 7,26 13,31" fill="#ffab91" />
      <polygon points="27,33 31,22 22,30" fill="#795548" stroke="#5d4037" strokeWidth="1.5" />
      <polygon points="26,32 29,26 23,31" fill="#ffab91" />

      {/* Eyes (focused, slightly narrowed) */}
      <ellipse cx="13" cy="41" rx="2" ry="2.5" fill="#e8f5e9" />
      <ellipse cx="13" cy="41" rx="1.2" ry="2" fill="#424242" />
      <ellipse cx="23" cy="41" rx="2" ry="2.5" fill="#e8f5e9" />
      <ellipse cx="23" cy="41" rx="1.2" ry="2" fill="#424242" />
      <circle cx="13.5" cy="40" r="0.6" fill="white" />
      <circle cx="23.5" cy="40" r="0.6" fill="white" />

      {/* Monitor light reflection on face */}
      <circle cx="18" cy="40" r="10" fill="#1a237e" opacity="0.05" />

      {/* Nose & mouth */}
      <ellipse cx="18" cy="46" rx="1.2" ry="0.8" fill="#ffab91" />
      <path d="M 16.5 47 Q 18 48, 19.5 47" fill="none" stroke="#5d4037" strokeWidth="0.5" />

      {/* Paws on keyboard */}
      <g className={styles.typingPaws}>
        <ellipse cx="30" cy="58" rx="4" ry="2.5" fill="#795548" stroke="#5d4037" strokeWidth="0.8" />
        <ellipse cx="38" cy="58" rx="4" ry="2.5" fill="#795548" stroke="#5d4037" strokeWidth="0.8" />
      </g>

      {/* Tail */}
      <path
        d="M 7 65 Q -2 55, 2 45"
        fill="none"
        stroke="#795548"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Coffee mug */}
      <rect x="54" y="53" width="6" height="6" rx="1" fill="#e0e0e0" stroke="#bdbdbd" strokeWidth="0.5" />
      <path d="M 60 54 Q 63 55, 60 58" fill="none" stroke="#bdbdbd" strokeWidth="0.8" />
      {/* Coffee steam */}
      <g className={styles.coffeeSteam}>
        <path d="M 56 51 Q 57 49, 56 47" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
        <path d="M 58 52 Q 59 49, 58 46" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
      </g>
    </g>
  );
};
