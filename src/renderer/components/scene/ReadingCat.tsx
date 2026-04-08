import React from 'react';
import styles from './scene.module.css';

interface ReadingCatProps {
  x?: number;
  y?: number;
}

/**
 * Cat reading a book - shown when Claude is analyzing/reading files.
 * Gray cat with glasses, sitting with an open book.
 */
export const ReadingCat: React.FC<ReadingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.readingCat}>
      {/* Shadow */}
      <ellipse cx="30" cy="78" rx="20" ry="5" fill="#37474f" opacity="0.2" />

      {/* Book */}
      <g className={styles.bookFlip}>
        <rect x="25" y="55" width="30" height="20" rx="2" fill="#e8d5b7" stroke="#8d6e63" strokeWidth="1" />
        <line x1="40" y1="55" x2="40" y2="75" stroke="#8d6e63" strokeWidth="0.8" />
        {/* Pages */}
        <line x1="28" y1="60" x2="38" y2="60" stroke="#bcaaa4" strokeWidth="0.5" />
        <line x1="28" y1="63" x2="37" y2="63" stroke="#bcaaa4" strokeWidth="0.5" />
        <line x1="28" y1="66" x2="38" y2="66" stroke="#bcaaa4" strokeWidth="0.5" />
        <line x1="28" y1="69" x2="36" y2="69" stroke="#bcaaa4" strokeWidth="0.5" />
        <line x1="42" y1="60" x2="52" y2="60" stroke="#bcaaa4" strokeWidth="0.5" />
        <line x1="42" y1="63" x2="53" y2="63" stroke="#bcaaa4" strokeWidth="0.5" />
        <line x1="42" y1="66" x2="51" y2="66" stroke="#bcaaa4" strokeWidth="0.5" />
      </g>

      {/* Cat body */}
      <ellipse cx="25" cy="62" rx="14" ry="12" fill="#bdbdbd" stroke="#5d4037" strokeWidth="1.5" />

      {/* Cat head */}
      <circle cx="25" cy="40" r="13" fill="#bdbdbd" stroke="#5d4037" strokeWidth="1.5" />

      {/* Ears */}
      <polygon points="15,30 10,19 20,27" fill="#bdbdbd" stroke="#5d4037" strokeWidth="1.5" />
      <polygon points="16,29 13,23 19,28" fill="#ffab91" />
      <polygon points="35,30 40,19 30,27" fill="#bdbdbd" stroke="#5d4037" strokeWidth="1.5" />
      <polygon points="34,29 37,23 31,28" fill="#ffab91" />

      {/* Glasses */}
      <circle cx="20" cy="39" r="5" fill="none" stroke="#5d4037" strokeWidth="1" />
      <circle cx="32" cy="39" r="5" fill="none" stroke="#5d4037" strokeWidth="1" />
      <line x1="25" y1="39" x2="27" y2="39" stroke="#5d4037" strokeWidth="1" />
      <line x1="15" y1="38" x2="12" y2="36" stroke="#5d4037" strokeWidth="1" />
      <line x1="37" y1="38" x2="40" y2="36" stroke="#5d4037" strokeWidth="1" />

      {/* Eyes behind glasses */}
      <ellipse cx="20" cy="39" rx="1.5" ry="2" fill="#424242" />
      <ellipse cx="32" cy="39" rx="1.5" ry="2" fill="#424242" />
      <circle cx="20.5" cy="38" r="0.6" fill="white" />
      <circle cx="32.5" cy="38" r="0.6" fill="white" />

      {/* Nose & mouth */}
      <ellipse cx="26" cy="44" rx="1.2" ry="0.8" fill="#ffab91" />
      <path d="M 24.5 45 Q 26 46.5, 27.5 45" fill="none" stroke="#5d4037" strokeWidth="0.6" />

      {/* Paw on book */}
      <ellipse cx="28" cy="58" rx="4" ry="3" fill="#bdbdbd" stroke="#5d4037" strokeWidth="1" />

      {/* Tail */}
      <path
        d="M 12 68 Q 3 60, 5 50"
        fill="none"
        stroke="#bdbdbd"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Floating text bubble */}
      <g className={styles.thoughtBubble}>
        <ellipse cx="48" cy="25" rx="8" ry="6" fill="white" stroke="#bdbdbd" strokeWidth="0.5" opacity="0.8" />
        <text x="48" y="27" textAnchor="middle" fontSize="6" fill="#5d4037">...</text>
      </g>
    </g>
  );
};
