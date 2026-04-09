import React from 'react';
import styles from './scene.module.css';

interface TypingCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style brown cat with bow tie and vest, writing at a desk.
 * Enhanced with cel-shading, ambient occlusion, rim lighting, and volumetric gradients.
 */
export const TypingCat: React.FC<TypingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.typingCat} filter="url(#catsAndSoupStyle)">
      {/* Layered ground shadow */}
      <ellipse cx="32" cy="97" rx="32" ry="6" fill="#3a2a1a" opacity="0.08" />
      <ellipse cx="32" cy="96" rx="24" ry="4" fill="#3a2a1a" opacity="0.18" />

      {/* Desk */}
      <rect x="18" y="62" width="44" height="5" rx="1.5" fill="#a07848" stroke="#7a5828" strokeWidth="1" />
      {/* Wood grain on desk */}
      <path d="M 22 63 Q 35 62.5, 48 63.5" fill="none" stroke="#8a6438" strokeWidth="0.3" opacity="0.3" />
      <path d="M 20 64.5 Q 40 64, 60 65" fill="none" stroke="#8a6438" strokeWidth="0.3" opacity="0.2" />
      <rect x="20" y="67" width="3.5" height="20" fill="#a07848" stroke="#7a5828" strokeWidth="0.5" />
      <rect x="56" y="67" width="3.5" height="20" fill="#a07848" stroke="#7a5828" strokeWidth="0.5" />
      <line x1="22" y1="64" x2="58" y2="64" stroke="#8a6438" strokeWidth="0.3" opacity="0.3" />

      {/* Scroll */}
      <rect x="30" y="38" width="28" height="24" rx="2" fill="#f0e4c8" stroke="#c4a882" strokeWidth="1" />
      {/* Aged paper texture (simulated) */}
      <rect x="32" y="40" width="24" height="20" fill="#e8d8b0" opacity="0.15" />
      <ellipse cx="44" cy="38" rx="14" ry="2" fill="#e8d8b8" stroke="#c4a882" strokeWidth="0.5" />
      <ellipse cx="44" cy="62" rx="14" ry="1.5" fill="#e8d8b8" stroke="#c4a882" strokeWidth="0.5" />
      <g className={styles.codeLines}>
        <line x1="34" y1="44" x2="48" y2="44" stroke="#8d6e63" strokeWidth="0.8" opacity="0.5" />
        <line x1="34" y1="48" x2="54" y2="48" stroke="#8d6e63" strokeWidth="0.8" opacity="0.5" />
        <line x1="36" y1="52" x2="52" y2="52" stroke="#8d6e63" strokeWidth="0.8" opacity="0.5" />
        <line x1="34" y1="56" x2="46" y2="56" stroke="#8d6e63" strokeWidth="0.8" opacity="0.5" />
      </g>

      {/* Quill with feather barb detail */}
      <line x1="56" y1="44" x2="66" y2="28" stroke="#5a3a1a" strokeWidth="1.2" />
      <path d="M 66 28 Q 68 26, 70 30 Q 68 29, 66 28" fill="#d8c8b0" stroke="#a09080" strokeWidth="0.3" />
      <path d="M 64 32 Q 66 30, 68 32" fill="none" stroke="#c8b8a0" strokeWidth="0.3" opacity="0.4" />
      <path d="M 62 36 Q 64 34, 66 36" fill="none" stroke="#c8b8a0" strokeWidth="0.3" opacity="0.3" />
      {/* Ink pot with gloss */}
      <rect x="25" y="59" width="6" height="5" rx="1.5" fill="#2a1a0a" stroke="#1a0a00" strokeWidth="0.5" />
      <ellipse cx="28" cy="59" rx="3" ry="1" fill="#3a2a1a" />
      <ellipse cx="27" cy="59.5" rx="1" ry="0.5" fill="#4a3a2a" opacity="0.5" />

      {/* Tail */}
      <path d="M 3 76 Q -5 60, -1 46 Q 1 40, 5 38" fill="none" stroke="url(#furBrown)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 3 76 Q -5 60, -1 46 Q 1 40, 5 38" fill="none" stroke="#5a3a1a" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
      <ellipse cx="5" cy="37.5" rx="3.5" ry="3" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="0.4" opacity="0.6" />
      <path d="M 3 36 Q 5 35, 7 36" fill="none" stroke="#c8a078" strokeWidth="0.4" opacity="0.25" />

      {/* Legs */}
      <path d="M 12 78 L 11 88 Q 11 92, 8 92 L 8 93 Q 8 95, 14 95 Q 16 95, 16 92 L 16 88 L 15 78" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="0.7" />
      <path d="M 22 78 L 21 88 Q 21 92, 18 92 L 18 93 Q 18 95, 24 95 Q 26 95, 26 92 L 26 88 L 25 78" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="0.7" />
      <path d="M 12 78 L 11 88 Q 11 89, 12 88 L 13 78" fill="#5a3a1a" opacity="0.08" />
      <path d="M 22 78 L 21 88 Q 21 89, 22 88 L 23 78" fill="#5a3a1a" opacity="0.08" />
      {/* Shoes */}
      <ellipse cx="12" cy="94" rx="5" ry="2.5" fill="#3a2a1a" stroke="#2a1a0a" strokeWidth="0.5" />
      <ellipse cx="24" cy="94" rx="5" ry="2.5" fill="#3a2a1a" stroke="#2a1a0a" strokeWidth="0.5" />
      <ellipse cx="11" cy="93.5" rx="2" ry="0.8" fill="#5a4a3a" opacity="0.3" />
      <ellipse cx="23" cy="93.5" rx="2" ry="0.8" fill="#5a4a3a" opacity="0.3" />
      {/* Socks */}
      <rect x="9" y="86" width="6" height="6" rx="2" fill="#e8ddd0" stroke="#d0c0b0" strokeWidth="0.3" />
      <rect x="19" y="86" width="6" height="6" rx="2" fill="#e8ddd0" stroke="#d0c0b0" strokeWidth="0.3" />

      {/* Body with vest */}
      <path d="M 5 52 Q 3 58, 4 68 Q 5 78, 9 80 Q 18 84, 27 80 Q 31 78, 32 68 Q 33 58, 31 52 Q 25 48, 18 48 Q 11 48, 5 52 Z" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="1" />
      <path d="M 5 52 Q 3 58, 4 68 Q 5 74, 7 78 Q 8 68, 8 56 Q 9 50, 5 52" fill="#5a3a1a" opacity="0.1" />
      <path d="M 7 54 Q 6 60, 7 68 Q 8 72, 10 74 Q 10 66, 10 58 Q 10 52, 7 54" fill="#5a3a1a" opacity="0.05" />
      {/* Body highlight */}
      <path d="M 27 54 Q 31 60, 30 68 Q 29 72, 25 76 Q 27 68, 27 58 Z" fill="#c8a078" opacity="0.08" />
      {/* Vest */}
      <path d="M 9 54 Q 18 51, 27 54 L 27 76 Q 18 80, 9 76 Z" fill="#6a2838" stroke="#4a1828" strokeWidth="0.6" opacity="0.85" />
      {/* Vest satin sheen */}
      <path d="M 22 56 Q 26 62, 25 72" fill="#8a4858" opacity="0.12" />
      {/* Vest fold lines */}
      <path d="M 15 54 L 14 68" fill="none" stroke="#4a1020" strokeWidth="0.3" opacity="0.3" />
      <path d="M 21 54 L 22 68" fill="none" stroke="#4a1020" strokeWidth="0.3" opacity="0.3" />
      <path d="M 12 62 L 11 72" fill="none" stroke="#4a1020" strokeWidth="0.2" opacity="0.2" />
      {/* Vest buttons */}
      <circle cx="18" cy="60" r="1.2" fill="#c4a060" stroke="#a08040" strokeWidth="0.3" />
      <circle cx="18" cy="67" r="1.2" fill="#c4a060" stroke="#a08040" strokeWidth="0.3" />
      {/* Shirt collar */}
      <path d="M 12 53 L 18 50 L 24 53 L 22 57 L 18 55 L 14 57 Z" fill="#f0e8e0" stroke="#d0c0b0" strokeWidth="0.4" />
      {/* Bow tie with 3D shadow */}
      <ellipse cx="18" cy="53" rx="5" ry="1.5" fill="#8a2222" opacity="0.1" />
      <path d="M 14 54 Q 12 52, 14 50 L 18 52 Z" fill="#cc3333" stroke="#aa2222" strokeWidth="0.3" />
      <path d="M 22 54 Q 24 52, 22 50 L 18 52 Z" fill="#cc3333" stroke="#aa2222" strokeWidth="0.3" />
      <circle cx="18" cy="52" r="1.4" fill="#dd4444" stroke="#aa2222" strokeWidth="0.3" />

      {/* AO under chin */}
      <ellipse cx="18" cy="50" rx="10" ry="4" fill="url(#aoUnderChin)" />

      {/* Head */}
      <circle cx="18" cy="36" r="17" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="1" />
      <path d="M 3 30 Q 1 36, 3 42 Q 6 38, 6 32 Q 4 28, 3 30" fill="#5a3a1a" opacity="0.1" />
      <path d="M 5 46 Q 18 52, 31 46 Q 27 48, 18 48 Q 9 48, 5 46" fill="#5a3a1a" opacity="0.06" />
      {/* Forehead specular */}
      <ellipse cx="16" cy="30" rx="5" ry="3" fill="url(#specHighlight)" />
      {/* Hair */}
      <path d="M 8 20 Q 10 14, 14 20 Q 16 12, 18 18 Q 20 12, 22 20 Q 24 14, 28 20" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="0.6" />
      <path d="M 2 34 Q -1 30, 1 26" fill="none" stroke="#7a5838" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M 34 34 Q 37 30, 35 26" fill="none" stroke="#7a5838" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Fur highlights */}
      <path d="M 12 28 Q 16 26, 20 28" fill="none" stroke="#c8a078" strokeWidth="0.6" opacity="0.2" />

      {/* Ears */}
      <path d="M 5,26 Q 1,14 -1,6 Q 3,12 15,22" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="1" />
      <path d="M 7,24 Q 4,16 3,10 Q 5,14 13,22" fill="#e0a898" opacity="0.45" />
      <ellipse cx="9" cy="24" rx="3" ry="2" fill="url(#aoEarBase)" />
      <path d="M 2 10 Q 4 7, 3 5" fill="none" stroke="#7a5838" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M 31,26 Q 35,14 37,6 Q 33,12 21,22" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="1" />
      <path d="M 29,24 Q 32,16 33,10 Q 31,14 23,22" fill="#e0a898" opacity="0.45" />
      <ellipse cx="27" cy="24" rx="3" ry="2" fill="url(#aoEarBase)" />
      <path d="M 34 10 Q 32 7, 33 5" fill="none" stroke="#7a5838" strokeWidth="0.8" strokeLinecap="round" />

      {/* Eyes */}
      <ellipse cx="12" cy="35" rx="3.5" ry="4.2" fill="white" stroke="#5a4030" strokeWidth="0.5" />
      <path d="M 8.5 32 Q 12 31, 15.5 32" fill="#5a4030" opacity="0.06" />
      <ellipse cx="12" cy="35.5" rx="3" ry="3.5" fill="#b89030" opacity="0.15" />
      <ellipse cx="12" cy="36" rx="2.8" ry="3.3" fill="url(#irisAmber)" />
      <ellipse cx="12" cy="36.5" rx="1.8" ry="2.2" fill="#2a1a0a" />
      <circle cx="10.5" cy="34.5" r="1.2" fill="white" opacity="0.9" />
      <circle cx="13.5" cy="37" r="0.6" fill="white" opacity="0.5" />
      <circle cx="13" cy="38" r="0.3" fill="white" opacity="0.3" />
      <path d="M 8.5 31 Q 10.5 30, 13 31.5" fill="none" stroke="#5a3a1a" strokeWidth="1.1" strokeLinecap="round" />

      <ellipse cx="24" cy="35" rx="3.5" ry="4.2" fill="white" stroke="#5a4030" strokeWidth="0.5" />
      <path d="M 20.5 32 Q 24 31, 27.5 32" fill="#5a4030" opacity="0.06" />
      <ellipse cx="24" cy="35.5" rx="3" ry="3.5" fill="#b89030" opacity="0.15" />
      <ellipse cx="24" cy="36" rx="2.8" ry="3.3" fill="url(#irisAmber)" />
      <ellipse cx="24" cy="36.5" rx="1.8" ry="2.2" fill="#2a1a0a" />
      <circle cx="22.5" cy="34.5" r="1.2" fill="white" opacity="0.9" />
      <circle cx="25.5" cy="37" r="0.6" fill="white" opacity="0.5" />
      <circle cx="25" cy="38" r="0.3" fill="white" opacity="0.3" />
      <path d="M 21.5 31.5 Q 24 30, 27 31" fill="none" stroke="#5a3a1a" strokeWidth="1.1" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="7" cy="40" rx="3.5" ry="2" fill="url(#blushMark)" />
      <ellipse cx="29" cy="40" rx="3.5" ry="2" fill="url(#blushMark)" />

      {/* Nose & mouth */}
      <path d="M 17 42 L 18 40.5 L 19 42 Z" fill="#d8a090" />
      <path d="M 15.5 43 Q 18 45, 20.5 43" fill="none" stroke="#5a3a1a" strokeWidth="0.6" />

      {/* Whiskers */}
      <line x1="1" y1="39" x2="10" y2="40" stroke="#8a7060" strokeWidth="0.4" opacity="0.3" />
      <line x1="0" y1="42" x2="10" y2="41" stroke="#8a7060" strokeWidth="0.4" opacity="0.3" />
      <line x1="26" y1="40" x2="35" y2="39" stroke="#8a7060" strokeWidth="0.4" opacity="0.3" />
      <line x1="26" y1="41" x2="36" y2="42" stroke="#8a7060" strokeWidth="0.4" opacity="0.3" />

      {/* Rim lighting */}
      <path d="M 32 28 Q 34 34, 32 42" fill="none" stroke="#fff8e0" strokeWidth="0.8" opacity="0.2" />
      <path d="M 30 52 Q 32 62, 30 72" fill="none" stroke="#fff8e0" strokeWidth="0.6" opacity="0.15" />

      {/* Paws on desk */}
      <g className={styles.typingPaws}>
        <ellipse cx="30" cy="62" rx="5.5" ry="3.5" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="0.8" />
        <circle cx="28.5" cy="61" r="0.7" fill="#d8a898" opacity="0.5" />
        <circle cx="30.5" cy="60.5" r="0.7" fill="#d8a898" opacity="0.5" />
        <circle cx="32.5" cy="61" r="0.7" fill="#d8a898" opacity="0.5" />
        <ellipse cx="42" cy="62" rx="5.5" ry="3.5" fill="url(#furBrown)" stroke="#5a3a1a" strokeWidth="0.8" />
        <circle cx="40" cy="61" r="0.7" fill="#d8a898" opacity="0.5" />
        <circle cx="42" cy="60.5" r="0.7" fill="#d8a898" opacity="0.5" />
        <circle cx="44" cy="61" r="0.7" fill="#d8a898" opacity="0.5" />
      </g>

      {/* Tankard with metallic rim */}
      <rect x="57" y="56" width="8" height="8" rx="1.5" fill="#c4a060" stroke="#a08040" strokeWidth="0.6" />
      {/* Metallic rim highlight */}
      <line x1="57" y1="56.5" x2="65" y2="56.5" stroke="#e8d090" strokeWidth="0.5" opacity="0.4" />
      <path d="M 65 57.5 Q 68 59.5, 65 63" fill="none" stroke="#a08040" strokeWidth="1" />
      <ellipse cx="61" cy="56" rx="4" ry="1.8" fill="#fff8e0" stroke="#c4a060" strokeWidth="0.3" />
      <g className={styles.coffeeSteam}>
        <path d="M 59 54 Q 60 51, 59 48" fill="none" stroke="#e8ddd0" strokeWidth="0.6" opacity="0.3" />
        <path d="M 62 54.5 Q 63 51, 62 47" fill="none" stroke="#e8ddd0" strokeWidth="0.6" opacity="0.25" />
      </g>
    </g>
  );
};
