import React from 'react';
import styles from './scene.module.css';

interface ReadingCatProps {
  x?: number;
  y?: number;
}

/**
 * Cat reading a book - shown when Claude is analyzing/reading files.
 * Warm gray cat with glasses, sitting at the tavern table with a book.
 */
export const ReadingCat: React.FC<ReadingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.readingCat}>
      {/* Shadow */}
      <ellipse cx="30" cy="78" rx="18" ry="4" fill="#3a2a1a" opacity="0.2" />

      {/* Book */}
      <g className={styles.bookFlip}>
        <rect x="25" y="55" width="30" height="20" rx="2" fill="#e8d5b7" stroke="#a08060" strokeWidth="1" />
        <line x1="40" y1="55" x2="40" y2="75" stroke="#a08060" strokeWidth="0.8" />
        <line x1="28" y1="60" x2="38" y2="60" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="28" y1="63" x2="37" y2="63" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="28" y1="66" x2="38" y2="66" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="28" y1="69" x2="36" y2="69" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="42" y1="60" x2="52" y2="60" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="42" y1="63" x2="53" y2="63" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="42" y1="66" x2="51" y2="66" stroke="#c4a882" strokeWidth="0.5" />
      </g>

      {/* Cat body */}
      <ellipse cx="25" cy="62" rx="14" ry="12" fill="#c8b8a8" stroke="#8d6e63" strokeWidth="1.2" />

      {/* Cat head */}
      <circle cx="25" cy="40" r="13" fill="#c8b8a8" stroke="#8d6e63" strokeWidth="1.2" />

      {/* Ears */}
      <polygon points="15,30 10,19 20,27" fill="#c8b8a8" stroke="#8d6e63" strokeWidth="1.2" />
      <polygon points="16,29 13,23 19,28" fill="#e8b4a0" />
      <polygon points="35,30 40,19 30,27" fill="#c8b8a8" stroke="#8d6e63" strokeWidth="1.2" />
      <polygon points="34,29 37,23 31,28" fill="#e8b4a0" />

      {/* Glasses */}
      <circle cx="20" cy="39" r="5" fill="none" stroke="#6d4c2a" strokeWidth="1" />
      <circle cx="32" cy="39" r="5" fill="none" stroke="#6d4c2a" strokeWidth="1" />
      <line x1="25" y1="39" x2="27" y2="39" stroke="#6d4c2a" strokeWidth="1" />
      <line x1="15" y1="38" x2="12" y2="36" stroke="#6d4c2a" strokeWidth="1" />
      <line x1="37" y1="38" x2="40" y2="36" stroke="#6d4c2a" strokeWidth="1" />

      {/* Eyes behind glasses */}
      <ellipse cx="20" cy="39" rx="1.5" ry="2" fill="#3a2a1a" />
      <ellipse cx="32" cy="39" rx="1.5" ry="2" fill="#3a2a1a" />
      <circle cx="20.5" cy="38" r="0.6" fill="white" />
      <circle cx="32.5" cy="38" r="0.6" fill="white" />

      {/* Rosy cheeks */}
      <circle cx="16" cy="43" r="2" fill="#e8a090" opacity="0.35" />
      <circle cx="36" cy="43" r="2" fill="#e8a090" opacity="0.35" />

      {/* Nose & mouth */}
      <ellipse cx="26" cy="44" rx="1.2" ry="0.8" fill="#e8b4a0" />
      <path d="M 24.5 45 Q 26 46.5, 27.5 45" fill="none" stroke="#8d6e63" strokeWidth="0.6" />

      {/* Paw on book */}
      <ellipse cx="28" cy="58" rx="4" ry="3" fill="#c8b8a8" stroke="#8d6e63" strokeWidth="1" />

      {/* Tail */}
      <path d="M 12 68 Q 3 60, 5 50" fill="none" stroke="#c8b8a8" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 12 68 Q 3 60, 5 50" fill="none" stroke="#8d6e63" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />

      {/* Floating thought bubble */}
      <g className={styles.thoughtBubble}>
        <ellipse cx="48" cy="25" rx="8" ry="6" fill="#fff8f0" stroke="#c4a882" strokeWidth="0.5" opacity="0.85" />
        <text x="48" y="27" textAnchor="middle" fontSize="6" fill="#6d4c2a">...</text>
      </g>
    </g>
  );
};
