import React from 'react';
import styles from './scene.module.css';

interface TypingCatProps {
  x?: number;
  y?: number;
}

/**
 * Cat typing at a desk - shown when Claude is writing code.
 * Brown cat at the tavern counter with a scroll and quill.
 */
export const TypingCat: React.FC<TypingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.typingCat}>
      {/* Shadow */}
      <ellipse cx="35" cy="82" rx="25" ry="5" fill="#3a2a1a" opacity="0.2" />

      {/* Desk (wooden tavern counter piece) */}
      <rect x="20" y="58" width="40" height="4" rx="1" fill="#a07848" stroke="#7a5828" strokeWidth="1" />
      <rect x="22" y="62" width="3" height="18" fill="#a07848" stroke="#7a5828" strokeWidth="0.5" />
      <rect x="55" y="62" width="3" height="18" fill="#a07848" stroke="#7a5828" strokeWidth="0.5" />

      {/* Scroll/parchment instead of monitor */}
      <rect x="30" y="38" width="26" height="20" rx="2" fill="#f0e4c8" stroke="#c4a882" strokeWidth="1" />
      {/* Scroll roll tops */}
      <ellipse cx="43" cy="38" rx="13" ry="1.5" fill="#e8d8b8" stroke="#c4a882" strokeWidth="0.5" />
      {/* Text lines on scroll */}
      <g className={styles.codeLines}>
        <line x1="34" y1="43" x2="44" y2="43" stroke="#8d6e63" strokeWidth="0.8" opacity="0.6" />
        <line x1="34" y1="46" x2="50" y2="46" stroke="#8d6e63" strokeWidth="0.8" opacity="0.6" />
        <line x1="36" y1="49" x2="48" y2="49" stroke="#8d6e63" strokeWidth="0.8" opacity="0.6" />
        <line x1="34" y1="52" x2="42" y2="52" stroke="#8d6e63" strokeWidth="0.8" opacity="0.6" />
      </g>

      {/* Quill pen */}
      <line x1="52" y1="42" x2="60" y2="30" stroke="#6d4c2a" strokeWidth="1" />
      <path d="M 60 30 Q 62 28, 64 32 Q 62 31, 60 30" fill="#c8b8a8" />

      {/* Ink pot */}
      <rect x="26" y="56" width="5" height="4" rx="1" fill="#3a2a1a" stroke="#2a1a0a" strokeWidth="0.5" />

      {/* Cat body */}
      <ellipse cx="18" cy="60" rx="12" ry="10" fill="#8b6842" stroke="#6d4c2a" strokeWidth="1.2" />

      {/* Cat head */}
      <circle cx="18" cy="42" r="12" fill="#8b6842" stroke="#6d4c2a" strokeWidth="1.2" />

      {/* Ears */}
      <polygon points="9,33 5,22 14,30" fill="#8b6842" stroke="#6d4c2a" strokeWidth="1.2" />
      <polygon points="10,32 7,26 13,31" fill="#e8b4a0" />
      <polygon points="27,33 31,22 22,30" fill="#8b6842" stroke="#6d4c2a" strokeWidth="1.2" />
      <polygon points="26,32 29,26 23,31" fill="#e8b4a0" />

      {/* Eyes (focused, slightly narrowed) */}
      <ellipse cx="13" cy="41" rx="2" ry="2.5" fill="#d4c4a4" />
      <ellipse cx="13" cy="41" rx="1.2" ry="2" fill="#3a2a1a" />
      <ellipse cx="23" cy="41" rx="2" ry="2.5" fill="#d4c4a4" />
      <ellipse cx="23" cy="41" rx="1.2" ry="2" fill="#3a2a1a" />
      <circle cx="13.5" cy="40" r="0.6" fill="white" />
      <circle cx="23.5" cy="40" r="0.6" fill="white" />

      {/* Rosy cheeks */}
      <circle cx="10" cy="45" r="2" fill="#e8a090" opacity="0.35" />
      <circle cx="26" cy="45" r="2" fill="#e8a090" opacity="0.35" />

      {/* Nose & mouth */}
      <ellipse cx="18" cy="46" rx="1.2" ry="0.8" fill="#e8b4a0" />
      <path d="M 16.5 47 Q 18 48, 19.5 47" fill="none" stroke="#6d4c2a" strokeWidth="0.5" />

      {/* Paws on desk */}
      <g className={styles.typingPaws}>
        <ellipse cx="30" cy="58" rx="4" ry="2.5" fill="#8b6842" stroke="#6d4c2a" strokeWidth="0.8" />
        <ellipse cx="38" cy="58" rx="4" ry="2.5" fill="#8b6842" stroke="#6d4c2a" strokeWidth="0.8" />
      </g>

      {/* Tail */}
      <path d="M 7 65 Q -2 55, 2 45" fill="none" stroke="#8b6842" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 7 65 Q -2 55, 2 45" fill="none" stroke="#6d4c2a" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />

      {/* Tankard (instead of coffee mug) */}
      <rect x="54" y="53" width="7" height="7" rx="1" fill="#c4a060" stroke="#a08040" strokeWidth="0.5" />
      <path d="M 61 54 Q 64 55.5, 61 59" fill="none" stroke="#a08040" strokeWidth="0.8" />
      {/* Foam on top */}
      <ellipse cx="57.5" cy="53" rx="3.5" ry="1.5" fill="#fff8e0" stroke="#c4a060" strokeWidth="0.3" />
      {/* Steam */}
      <g className={styles.coffeeSteam}>
        <path d="M 56 51 Q 57 49, 56 47" fill="none" stroke="#e8ddd0" strokeWidth="0.5" opacity="0.3" />
        <path d="M 58 52 Q 59 49, 58 46" fill="none" stroke="#e8ddd0" strokeWidth="0.5" opacity="0.3" />
      </g>
    </g>
  );
};
