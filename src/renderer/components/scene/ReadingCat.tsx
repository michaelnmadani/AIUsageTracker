import React from 'react';
import styles from './scene.module.css';

interface ReadingCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style gray cat with glasses and cardigan, reading a book.
 * Shown when Claude is analyzing/reading files.
 */
export const ReadingCat: React.FC<ReadingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.readingCat}>
      {/* Ground shadow */}
      <ellipse cx="30" cy="80" rx="20" ry="4" fill="#3a2a1a" opacity="0.18" />

      {/* Book */}
      <g className={styles.bookFlip}>
        <rect x="24" y="54" width="32" height="22" rx="2" fill="#e8d5b7" stroke="#a08060" strokeWidth="1" />
        <line x1="40" y1="54" x2="40" y2="76" stroke="#a08060" strokeWidth="1" />
        {/* Text lines - left page */}
        <line x1="27" y1="59" x2="37" y2="59" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="27" y1="62" x2="36" y2="62" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="27" y1="65" x2="37" y2="65" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="27" y1="68" x2="35" y2="68" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="27" y1="71" x2="37" y2="71" stroke="#c4a882" strokeWidth="0.5" />
        {/* Text lines - right page */}
        <line x1="43" y1="59" x2="53" y2="59" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="43" y1="62" x2="54" y2="62" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="43" y1="65" x2="52" y2="65" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="43" y1="68" x2="53" y2="68" stroke="#c4a882" strokeWidth="0.5" />
        {/* Bookmark ribbon */}
        <path d="M 52 54 L 52 48 L 54 50 L 56 48 L 56 54" fill="#cc4444" stroke="#aa3333" strokeWidth="0.3" />
      </g>

      {/* Tail (behind body) */}
      <path d="M 10 72 Q 0 58, 3 46 Q 5 40, 8 38" fill="none" stroke="url(#furGray)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 10 72 Q 0 58, 3 46 Q 5 40, 8 38" fill="none" stroke="#7a6a5a" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
      <circle cx="8" cy="37" r="3" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="0.4" opacity="0.6" />

      {/* Body with cardigan */}
      <ellipse cx="26" cy="64" rx="15" ry="13" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="1" />
      {/* Cardigan - cozy brown */}
      <path d="M 14 55 Q 26 52, 38 55 L 38 72 Q 26 76, 14 72 Z" fill="#8b6848" stroke="#6d4c2a" strokeWidth="0.6" opacity="0.85" />
      {/* Cardigan buttons */}
      <circle cx="26" cy="58" r="1" fill="#c4a060" stroke="#a08040" strokeWidth="0.3" />
      <circle cx="26" cy="63" r="1" fill="#c4a060" stroke="#a08040" strokeWidth="0.3" />
      <circle cx="26" cy="68" r="1" fill="#c4a060" stroke="#a08040" strokeWidth="0.3" />
      {/* White collar underneath */}
      <path d="M 20 54 Q 26 52, 32 54 L 30 57 Q 26 55, 22 57 Z" fill="#f0e8e0" stroke="#d0c0b0" strokeWidth="0.4" />

      {/* Head (chibi large) */}
      <circle cx="26" cy="36" r="16" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="1" />
      {/* Darker fur tips on top */}
      <path d="M 18 22 Q 22 19, 26 22 Q 30 19, 34 22" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="0.5" />
      {/* Side fur wisps */}
      <path d="M 10 32 Q 8 30, 10 28" fill="none" stroke="#a09088" strokeWidth="1" strokeLinecap="round" />
      <path d="M 42 32 Q 44 30, 42 28" fill="none" stroke="#a09088" strokeWidth="1" strokeLinecap="round" />

      {/* Ears - tall with inner detail and fur tufts */}
      <polygon points="14,26 8,8 22,22" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="1" />
      <polygon points="15,24 11,14 20,23" fill="#e8b0a0" opacity="0.5" />
      <path d="M 12 14 Q 14 12, 13 10" fill="none" stroke="#a09088" strokeWidth="0.8" strokeLinecap="round" />
      <polygon points="38,26 44,8 30,22" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="1" />
      <polygon points="37,24 41,14 32,23" fill="#e8b0a0" opacity="0.5" />
      <path d="M 40 14 Q 38 12, 39 10" fill="none" stroke="#a09088" strokeWidth="0.8" strokeLinecap="round" />

      {/* Glasses - round frames */}
      <circle cx="20" cy="36" r="5.5" fill="none" stroke="#5a3a2a" strokeWidth="1.2" />
      <circle cx="34" cy="36" r="5.5" fill="none" stroke="#5a3a2a" strokeWidth="1.2" />
      <line x1="25.5" y1="35.5" x2="28.5" y2="35.5" stroke="#5a3a2a" strokeWidth="1" />
      <line x1="14.5" y1="35" x2="11" y2="32" stroke="#5a3a2a" strokeWidth="0.8" />
      <line x1="39.5" y1="35" x2="43" y2="32" stroke="#5a3a2a" strokeWidth="0.8" />
      {/* Lens glare */}
      <path d="M 17 33 Q 18 32, 19.5 33" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />
      <path d="M 31 33 Q 32 32, 33.5 33" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />

      {/* Eyes behind glasses - anime style */}
      <ellipse cx="20" cy="36" rx="2.5" ry="3.2" fill="white" />
      <ellipse cx="20" cy="37" rx="2" ry="2.5" fill="url(#irisGreen)" />
      <ellipse cx="20" cy="37.5" rx="1.3" ry="1.6" fill="#2a2a2a" />
      <circle cx="19" cy="35.8" r="0.9" fill="white" opacity="0.85" />
      <circle cx="21" cy="37.5" r="0.4" fill="white" opacity="0.5" />

      <ellipse cx="34" cy="36" rx="2.5" ry="3.2" fill="white" />
      <ellipse cx="34" cy="37" rx="2" ry="2.5" fill="url(#irisGreen)" />
      <ellipse cx="34" cy="37.5" rx="1.3" ry="1.6" fill="#2a2a2a" />
      <circle cx="33" cy="35.8" r="0.9" fill="white" opacity="0.85" />
      <circle cx="35" cy="37.5" r="0.4" fill="white" opacity="0.5" />

      {/* Blush marks */}
      <ellipse cx="14" cy="41" rx="3" ry="1.8" fill="url(#blushMark)" />
      <ellipse cx="40" cy="41" rx="3" ry="1.8" fill="url(#blushMark)" />

      {/* Nose */}
      <path d="M 26 42 L 27 40.5 L 28 42 Z" fill="#d8a090" />
      {/* Mouth - gentle smile */}
      <path d="M 23.5 43 Q 27 45.5, 30.5 43" fill="none" stroke="#7a6a5a" strokeWidth="0.6" />

      {/* Whiskers */}
      <line x1="8" y1="40" x2="16" y2="41" stroke="#9a8a7a" strokeWidth="0.4" opacity="0.35" />
      <line x1="7" y1="43" x2="16" y2="42.5" stroke="#9a8a7a" strokeWidth="0.4" opacity="0.35" />
      <line x1="36" y1="41" x2="44" y2="40" stroke="#9a8a7a" strokeWidth="0.4" opacity="0.35" />
      <line x1="36" y1="42.5" x2="45" y2="43" stroke="#9a8a7a" strokeWidth="0.4" opacity="0.35" />

      {/* Paw on book */}
      <ellipse cx="30" cy="56" rx="5" ry="3.5" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="0.8" />
      <circle cx="28" cy="55" r="0.7" fill="#d8a898" opacity="0.5" />
      <circle cx="30" cy="54.5" r="0.7" fill="#d8a898" opacity="0.5" />
      <circle cx="32" cy="55" r="0.7" fill="#d8a898" opacity="0.5" />

      {/* Thought bubble */}
      <g className={styles.thoughtBubble}>
        <ellipse cx="52" cy="20" rx="9" ry="7" fill="#fff8f0" stroke="#c4a882" strokeWidth="0.5" opacity="0.85" />
        <text x="52" y="22" textAnchor="middle" fontSize="6" fill="#6d4c2a" opacity="0.7">?!</text>
        <circle cx="46" cy="28" r="1.5" fill="#fff8f0" opacity="0.6" />
        <circle cx="44" cy="31" r="1" fill="#fff8f0" opacity="0.4" />
      </g>
    </g>
  );
};
