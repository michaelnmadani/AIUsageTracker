import React from 'react';
import styles from './scene.module.css';

interface ReadingCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style gray cat with glasses and cardigan, reading a book.
 * Enhanced with cel-shading, ambient occlusion, rim lighting, and volumetric gradients.
 */
export const ReadingCat: React.FC<ReadingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.readingCat} filter="url(#catsAndSoupStyle)">
      {/* Layered ground shadow */}
      <ellipse cx="28" cy="97" rx="24" ry="5" fill="#3a2a1a" opacity="0.08" />
      <ellipse cx="28" cy="96" rx="18" ry="3.5" fill="#3a2a1a" opacity="0.2" />

      {/* Book */}
      <g className={styles.bookFlip}>
        <rect x="26" y="58" width="32" height="22" rx="2" fill="#e8d5b7" stroke="#a08060" strokeWidth="1" />
        {/* Page depth gradient */}
        <rect x="42" y="58" width="1.5" height="22" fill="#c4a882" opacity="0.3" />
        <line x1="42" y1="58" x2="42" y2="80" stroke="#a08060" strokeWidth="1" />
        {/* Text lines */}
        <line x1="29" y1="63" x2="39" y2="63" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="29" y1="66" x2="38" y2="66" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="29" y1="69" x2="39" y2="69" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="29" y1="72" x2="37" y2="72" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="45" y1="63" x2="55" y2="63" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="45" y1="66" x2="56" y2="66" stroke="#c4a882" strokeWidth="0.5" />
        <line x1="45" y1="69" x2="54" y2="69" stroke="#c4a882" strokeWidth="0.5" />
        {/* Bookmark with fabric folds */}
        <path d="M 54 58 L 54 52 L 56 54 L 58 52 L 58 58" fill="#cc4444" stroke="#aa3333" strokeWidth="0.3" />
        <line x1="55" y1="53" x2="56" y2="57" stroke="#aa3333" strokeWidth="0.3" opacity="0.3" />
      </g>

      {/* Tail */}
      <path d="M 8 82 Q -2 66, 2 50 Q 4 44, 8 42" fill="none" stroke="url(#furGray)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 8 82 Q -2 66, 2 50 Q 4 44, 8 42" fill="none" stroke="#7a6a5a" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
      <ellipse cx="8" cy="41" rx="3.5" ry="3" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="0.4" opacity="0.6" />
      <path d="M 6 39 Q 8 38, 10 40" fill="none" stroke="#d8d0c8" strokeWidth="0.4" opacity="0.25" />

      {/* Legs */}
      <path d="M 17 78 L 16 88 Q 16 92, 13 92 L 13 93 Q 13 95, 19 95 Q 21 95, 21 92 L 21 88 L 20 78" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="0.7" />
      <path d="M 27 78 L 26 88 Q 26 92, 23 92 L 23 93 Q 23 95, 29 95 Q 31 95, 31 92 L 31 88 L 30 78" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="0.7" />
      {/* Leg shading */}
      <path d="M 17 78 L 16 88 Q 16 89, 17 88 L 18 78" fill="#7a6a5a" opacity="0.08" />
      <path d="M 27 78 L 26 88 Q 26 89, 27 88 L 28 78" fill="#7a6a5a" opacity="0.08" />
      {/* Shoes */}
      <ellipse cx="17" cy="94" rx="5" ry="2.5" fill="#6d4c2a" stroke="#4a3018" strokeWidth="0.5" />
      <ellipse cx="29" cy="94" rx="5" ry="2.5" fill="#6d4c2a" stroke="#4a3018" strokeWidth="0.5" />
      <ellipse cx="16" cy="93.5" rx="2.5" ry="1" fill="#8a6440" opacity="0.3" />
      <ellipse cx="28" cy="93.5" rx="2.5" ry="1" fill="#8a6440" opacity="0.3" />
      {/* Socks */}
      <rect x="15" y="86" width="6" height="6" rx="2" fill="#e8ddd0" stroke="#d0c0b0" strokeWidth="0.3" />
      <rect x="25" y="86" width="6" height="6" rx="2" fill="#e8ddd0" stroke="#d0c0b0" strokeWidth="0.3" />

      {/* Body with cardigan */}
      <path d="M 10 52 Q 8 58, 9 68 Q 10 78, 14 80 Q 23 84, 32 80 Q 36 78, 37 68 Q 38 58, 36 52 Q 30 48, 23 48 Q 16 48, 10 52 Z" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="1" />
      {/* Body shading — deep */}
      <path d="M 10 52 Q 8 58, 9 68 Q 10 74, 12 78 Q 14 68, 14 56 Q 14 50, 10 52" fill="#7a6a5a" opacity="0.1" />
      {/* Body mid shadow */}
      <path d="M 12 54 Q 11 60, 12 68 Q 13 72, 16 74 Q 16 66, 16 58 Q 15 52, 12 54" fill="#7a6a5a" opacity="0.05" />
      {/* Cardigan */}
      <path d="M 14 54 Q 23 51, 32 54 L 32 76 Q 23 80, 14 76 Z" fill="#8b6848" stroke="#6d4c2a" strokeWidth="0.6" opacity="0.85" />
      {/* Cardigan fabric folds */}
      <path d="M 19 54 L 18 62" fill="none" stroke="#5a3a1a" strokeWidth="0.4" opacity="0.3" />
      <path d="M 27 54 L 28 62" fill="none" stroke="#5a3a1a" strokeWidth="0.4" opacity="0.3" />
      <path d="M 16 64 L 15 72" fill="none" stroke="#5a3a1a" strokeWidth="0.3" opacity="0.2" />
      <path d="M 30 64 L 31 72" fill="none" stroke="#5a3a1a" strokeWidth="0.3" opacity="0.2" />
      {/* Cardigan fabric sheen */}
      <path d="M 28 56 Q 32 62, 30 72" fill="#c4a078" opacity="0.1" />
      {/* Buttons */}
      <circle cx="23" cy="58" r="1.2" fill="#c4a060" stroke="#a08040" strokeWidth="0.3" />
      <circle cx="23" cy="64" r="1.2" fill="#c4a060" stroke="#a08040" strokeWidth="0.3" />
      <circle cx="23" cy="70" r="1.2" fill="#c4a060" stroke="#a08040" strokeWidth="0.3" />
      {/* White collar */}
      <path d="M 18 53 Q 23 51, 28 53 L 26 57 Q 23 55, 20 57 Z" fill="#f0e8e0" stroke="#d0c0b0" strokeWidth="0.4" />

      {/* Ambient occlusion under chin */}
      <ellipse cx="23" cy="50" rx="10" ry="4" fill="url(#aoUnderChin)" />

      {/* Head */}
      <circle cx="23" cy="36" r="17" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="1" />
      <path d="M 8 30 Q 6 36, 8 42 Q 10 38, 10 32 Q 9 28, 8 30" fill="#7a6a5a" opacity="0.1" />
      <path d="M 10 46 Q 23 52, 36 46 Q 32 48, 23 48 Q 14 48, 10 46" fill="#7a6a5a" opacity="0.06" />
      {/* Forehead specular */}
      <ellipse cx="21" cy="30" rx="5" ry="3" fill="url(#specHighlight)" />

      {/* Fur highlight strands */}
      <path d="M 16 28 Q 20 26, 24 28" fill="none" stroke="#e8e0d8" strokeWidth="0.6" opacity="0.2" />
      <path d="M 12 34 Q 14 32, 16 34" fill="none" stroke="#e8e0d8" strokeWidth="0.5" opacity="0.15" />

      {/* Hair */}
      <path d="M 14 20 Q 16 15, 19 20 Q 20 14, 23 19 Q 26 14, 27 20 Q 29 15, 32 20" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="0.6" />
      <path d="M 7 32 Q 4 28, 6 24" fill="none" stroke="#9a8a7a" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 39 32 Q 42 28, 40 24" fill="none" stroke="#9a8a7a" strokeWidth="1.8" strokeLinecap="round" />

      {/* Ears with tufts */}
      <path d="M 11,26 Q 7,16 5,8 Q 9,14 19,23" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="1" />
      <path d="M 13,24 Q 10,17 9,12 Q 11,15 18,23" fill="#e8b0a0" opacity="0.45" />
      <ellipse cx="14" cy="24" rx="3" ry="2" fill="url(#aoEarBase)" />
      <path d="M 8 12 Q 10 9, 9 7" fill="none" stroke="#9a8a7a" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M 35,26 Q 39,16 41,8 Q 37,14 27,23" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="1" />
      <path d="M 33,24 Q 36,17 37,12 Q 35,15 28,23" fill="#e8b0a0" opacity="0.45" />
      <ellipse cx="32" cy="24" rx="3" ry="2" fill="url(#aoEarBase)" />
      <path d="M 38 12 Q 36 9, 37 7" fill="none" stroke="#9a8a7a" strokeWidth="0.8" strokeLinecap="round" />

      {/* Glasses */}
      <circle cx="17" cy="35" r="6" fill="none" stroke="#4a2a1a" strokeWidth="1.3" />
      <circle cx="31" cy="35" r="6" fill="none" stroke="#4a2a1a" strokeWidth="1.3" />
      <line x1="23" y1="34.5" x2="25" y2="34.5" stroke="#4a2a1a" strokeWidth="1" />
      <line x1="11" y1="34" x2="8" y2="31" stroke="#4a2a1a" strokeWidth="0.8" />
      <line x1="37" y1="34" x2="40" y2="31" stroke="#4a2a1a" strokeWidth="0.8" />
      {/* Lens reflections */}
      <path d="M 14 32 Q 15.5 31, 17 32" fill="none" stroke="white" strokeWidth="0.6" opacity="0.35" />
      <path d="M 28 32 Q 29.5 31, 31 32" fill="none" stroke="white" strokeWidth="0.6" opacity="0.35" />
      <path d="M 19 36 Q 20 37, 19 38" fill="none" stroke="white" strokeWidth="0.4" opacity="0.15" />
      <path d="M 33 36 Q 34 37, 33 38" fill="none" stroke="white" strokeWidth="0.4" opacity="0.15" />

      {/* Eyes behind glasses */}
      <ellipse cx="17" cy="35" rx="3" ry="3.8" fill="white" />
      <path d="M 14 32.5 Q 17 31.5, 20 32.5" fill="#4a3020" opacity="0.06" />
      <ellipse cx="17" cy="35.5" rx="2.6" ry="3.2" fill="#4a8840" opacity="0.15" />
      <ellipse cx="17" cy="36" rx="2.4" ry="3" fill="url(#irisGreen)" />
      <ellipse cx="17" cy="36.5" rx="1.5" ry="2" fill="#2a2a2a" />
      <circle cx="15.5" cy="34.5" r="1.2" fill="white" opacity="0.85" />
      <circle cx="18.5" cy="37" r="0.5" fill="white" opacity="0.5" />
      <circle cx="18" cy="38" r="0.3" fill="white" opacity="0.3" />
      <path d="M 13 31 Q 15.5 30, 18 31" fill="none" stroke="#4a3020" strokeWidth="1" strokeLinecap="round" />

      <ellipse cx="31" cy="35" rx="3" ry="3.8" fill="white" />
      <path d="M 28 32.5 Q 31 31.5, 34 32.5" fill="#4a3020" opacity="0.06" />
      <ellipse cx="31" cy="35.5" rx="2.6" ry="3.2" fill="#4a8840" opacity="0.15" />
      <ellipse cx="31" cy="36" rx="2.4" ry="3" fill="url(#irisGreen)" />
      <ellipse cx="31" cy="36.5" rx="1.5" ry="2" fill="#2a2a2a" />
      <circle cx="29.5" cy="34.5" r="1.2" fill="white" opacity="0.85" />
      <circle cx="32.5" cy="37" r="0.5" fill="white" opacity="0.5" />
      <circle cx="32" cy="38" r="0.3" fill="white" opacity="0.3" />
      <path d="M 27 31 Q 29.5 30, 32 31" fill="none" stroke="#4a3020" strokeWidth="1" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="11" cy="40" rx="3.5" ry="2" fill="url(#blushMark)" />
      <ellipse cx="37" cy="40" rx="3.5" ry="2" fill="url(#blushMark)" />

      {/* Nose & mouth */}
      <path d="M 23 42 L 24 40.5 L 25 42 Z" fill="#d8a090" />
      <path d="M 20.5 43 Q 24 45.5, 27.5 43" fill="none" stroke="#7a6a5a" strokeWidth="0.6" />

      {/* Whiskers */}
      <line x1="5" y1="40" x2="14" y2="41" stroke="#9a8a7a" strokeWidth="0.4" opacity="0.3" />
      <line x1="4" y1="43" x2="14" y2="42" stroke="#9a8a7a" strokeWidth="0.4" opacity="0.3" />
      <line x1="34" y1="41" x2="43" y2="40" stroke="#9a8a7a" strokeWidth="0.4" opacity="0.3" />
      <line x1="34" y1="42" x2="44" y2="43" stroke="#9a8a7a" strokeWidth="0.4" opacity="0.3" />

      {/* Rim lighting */}
      <path d="M 36 28 Q 38 34, 36 42" fill="none" stroke="#fff8e0" strokeWidth="0.8" opacity="0.2" />
      <path d="M 35 52 Q 37 62, 35 72" fill="none" stroke="#fff8e0" strokeWidth="0.6" opacity="0.15" />

      {/* Paw on book */}
      <ellipse cx="32" cy="60" rx="5.5" ry="3.5" fill="url(#furGray)" stroke="#7a6a5a" strokeWidth="0.8" />
      <circle cx="30" cy="59" r="0.8" fill="#d8a898" opacity="0.5" />
      <circle cx="32" cy="58.5" r="0.8" fill="#d8a898" opacity="0.5" />
      <circle cx="34" cy="59" r="0.8" fill="#d8a898" opacity="0.5" />

      {/* Thought bubble with glow */}
      <g className={styles.thoughtBubble}>
        {/* Glow behind bubble */}
        <ellipse cx="52" cy="18" rx="11" ry="9" fill="#fff8f0" opacity="0.15" />
        <ellipse cx="52" cy="18" rx="9" ry="7" fill="#fff8f0" stroke="#c4a882" strokeWidth="0.5" opacity="0.85" />
        <text x="52" y="20" textAnchor="middle" fontSize="6" fill="#6d4c2a" opacity="0.7">?!</text>
        <circle cx="46" cy="26" r="1.5" fill="#fff8f0" opacity="0.6" />
        <circle cx="44" cy="29" r="1" fill="#fff8f0" opacity="0.4" />
      </g>
    </g>
  );
};
