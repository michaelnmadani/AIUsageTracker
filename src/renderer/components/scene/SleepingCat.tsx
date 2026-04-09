import React from 'react';
import styles from './scene.module.css';

interface SleepingCatProps {
  x?: number;
  y?: number;
}

/**
 * Anime-style cream cat curled up sleeping with nightcap and blanket.
 * Enhanced with cel-shading, ambient occlusion, rim lighting, and volumetric gradients.
 */
export const SleepingCat: React.FC<SleepingCatProps> = ({ x = 0, y = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className={styles.sleepingCat} filter="url(#catsAndSoupStyle)">
      {/* Layered ground shadow */}
      <ellipse cx="30" cy="83" rx="30" ry="6" fill="#3a2a1a" opacity="0.08" />
      <ellipse cx="30" cy="82" rx="24" ry="4.5" fill="#3a2a1a" opacity="0.15" />

      {/* Cushion with tassels */}
      <ellipse cx="30" cy="78" rx="30" ry="11" fill="#c87060" stroke="#a05040" strokeWidth="1" />
      <ellipse cx="30" cy="76" rx="28" ry="9" fill="#d88878" stroke="#b06050" strokeWidth="0.5" />
      {/* Cushion tufting and stitching */}
      <path d="M 10 76 L 20 68 L 30 76 L 20 84 Z" fill="none" stroke="#b06050" strokeWidth="0.4" opacity="0.35" />
      <path d="M 20 76 L 30 68 L 40 76 L 30 84 Z" fill="none" stroke="#b06050" strokeWidth="0.4" opacity="0.35" />
      <path d="M 30 76 L 40 68 L 50 76 L 40 84 Z" fill="none" stroke="#b06050" strokeWidth="0.4" opacity="0.35" />
      {/* Cushion fabric sheen */}
      <ellipse cx="35" cy="72" rx="10" ry="5" fill="#e8a090" opacity="0.1" />
      {/* Tassels */}
      <line x1="2" y1="78" x2="0" y2="82" stroke="#a05040" strokeWidth="1" strokeLinecap="round" />
      <line x1="58" y1="78" x2="60" y2="82" stroke="#a05040" strokeWidth="1" strokeLinecap="round" />
      <line x1="1" y1="78" x2="-2" y2="81" stroke="#a05040" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="59" y1="78" x2="62" y2="81" stroke="#a05040" strokeWidth="0.8" strokeLinecap="round" />

      {/* Blanket */}
      <path d="M 8 50 Q 30 44, 50 52 Q 56 64, 50 76 Q 30 82, 10 76 Q 4 64, 8 50" fill="#8090c8" stroke="#6070a8" strokeWidth="0.8" />
      {/* Blanket fold shadows */}
      <path d="M 8 50 Q 30 54, 50 52" fill="none" stroke="#5060a0" strokeWidth="0.5" opacity="0.3" />
      <path d="M 10 60 Q 28 58, 48 62" fill="none" stroke="#5060a0" strokeWidth="0.4" opacity="0.2" />
      <path d="M 12 70 Q 30 68, 48 72" fill="none" stroke="#5060a0" strokeWidth="0.4" opacity="0.15" />
      {/* Blanket highlight */}
      <path d="M 35 52 Q 48 58, 48 68 Q 46 74, 38 76" fill="#a0b0d8" opacity="0.08" />
      {/* Star pattern with glow */}
      <g opacity="0.3">
        <circle cx="20" cy="57.5" r="3" fill="#c0d0f0" opacity="0.08" />
        <polygon points="20,55 21,57 23,57 21.5,58.5 22,60.5 20,59 18,60.5 18.5,58.5 17,57 19,57" fill="#c0d0f0" />
        <circle cx="38" cy="54" r="3" fill="#c0d0f0" opacity="0.08" />
        <polygon points="38,52 39,54 41,54 39.5,55.5 40,57.5 38,56 36,57.5 36.5,55.5 35,54 37,54" fill="#c0d0f0" />
        <circle cx="42" cy="66" r="3" fill="#c0d0f0" opacity="0.08" />
        <polygon points="42,64 43,66 45,66 43.5,67.5 44,69.5 42,68 40,69.5 40.5,67.5 39,66 41,66" fill="#c0d0f0" />
        <circle cx="15" cy="68" r="3" fill="#c0d0f0" opacity="0.08" />
        <polygon points="15,66 16,68 18,68 16.5,69.5 17,71.5 15,70 13,71.5 13.5,69.5 12,68 14,68" fill="#c0d0f0" />
      </g>
      {/* Blanket top scallop */}
      <path d="M 8 50 Q 11 47, 14 50 Q 17 47, 20 50 Q 23 47, 26 50" fill="none" stroke="#7080b8" strokeWidth="0.8" />

      {/* Curled body under blanket */}
      <ellipse cx="28" cy="58" rx="18" ry="12" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      {/* Body shading */}
      <ellipse cx="24" cy="60" rx="8" ry="6" fill="#c4a888" opacity="0.08" />
      <ellipse cx="20" cy="62" rx="5" ry="4" fill="#c4a888" opacity="0.04" />

      {/* Legs tucked */}
      <ellipse cx="42" cy="72" rx="5" ry="3.5" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.7" />
      <circle cx="40.5" cy="71.5" r="0.7" fill="#e8b0a0" opacity="0.45" />
      <circle cx="42.5" cy="71" r="0.7" fill="#e8b0a0" opacity="0.45" />
      <circle cx="44" cy="71.5" r="0.7" fill="#e8b0a0" opacity="0.45" />
      <ellipse cx="46" cy="74" rx="4.5" ry="3" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.6" />
      <circle cx="44.5" cy="73.5" r="0.6" fill="#e8b0a0" opacity="0.4" />
      <circle cx="46.5" cy="73" r="0.6" fill="#e8b0a0" opacity="0.4" />

      {/* Tail */}
      <path d="M 48 64 Q 56 52, 52 42 Q 48 36, 42 38" fill="none" stroke="url(#furCream)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 48 64 Q 56 52, 52 42 Q 48 36, 42 38" fill="none" stroke="#c4a888" strokeWidth="0.6" strokeLinecap="round" opacity="0.25" />
      <ellipse cx="42" cy="37.5" rx="3.5" ry="3" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.4" opacity="0.7" />
      <path d="M 40 36 Q 42 35, 44 36" fill="none" stroke="#fff5eb" strokeWidth="0.4" opacity="0.25" />

      {/* AO under chin */}
      <ellipse cx="22" cy="60" rx="8" ry="3" fill="url(#aoUnderChin)" />

      {/* Head */}
      <circle cx="22" cy="48" r="16" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      <path d="M 8 42 Q 6 48, 8 54 Q 10 50, 10 44 Q 9 40, 8 42" fill="#c4a888" opacity="0.1" />
      <path d="M 10 58 Q 22 64, 34 58 Q 30 60, 22 60 Q 14 60, 10 58" fill="#c4a888" opacity="0.06" />
      {/* Forehead specular */}
      <ellipse cx="20" cy="42" rx="5" ry="3" fill="url(#specHighlight)" />
      {/* Hair tuft */}
      <path d="M 16 33 Q 18 29, 20 33 Q 22 29, 24 33 Q 26 29, 28 33" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.5" />
      {/* Fur highlights */}
      <path d="M 16 40 Q 20 38, 24 40" fill="none" stroke="#fff8f0" strokeWidth="0.5" opacity="0.2" />

      {/* Ears (relaxed) */}
      <path d="M 10,40 Q 6,32 4,26 Q 8,30 16,38" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      <path d="M 11,39 Q 8,34 7,30 Q 9,32 15,38" fill="#f0b8a8" opacity="0.45" />
      <ellipse cx="12" cy="38" rx="3" ry="2" fill="url(#aoEarBase)" />
      <path d="M 32,40 Q 36,32 38,26 Q 34,30 26,38" fill="url(#furCream)" stroke="#c4a888" strokeWidth="1" />
      <path d="M 31,39 Q 34,34 35,30 Q 33,32 27,38" fill="#f0b8a8" opacity="0.45" />
      <ellipse cx="30" cy="38" rx="3" ry="2" fill="url(#aoEarBase)" />

      {/* Nightcap */}
      <path d="M 10 40 Q 22 30, 34 40" fill="#8090c8" stroke="#6070a8" strokeWidth="0.6" />
      <path d="M 10 40 Q 8 30, 22 20 Q 28 18, 30 22" fill="#8090c8" stroke="#6070a8" strokeWidth="0.6" />
      {/* Nightcap stripes */}
      <path d="M 12 36 Q 16 32, 22 36" fill="none" stroke="#a0b0d8" strokeWidth="1.5" opacity="0.4" />
      <path d="M 11 30 Q 15 26, 20 30" fill="none" stroke="#a0b0d8" strokeWidth="1.5" opacity="0.4" />
      {/* Cap fabric highlight */}
      <path d="M 18 26 Q 22 22, 26 26" fill="#a0b0e0" opacity="0.12" />
      {/* Pom-pom (fluffy) */}
      <circle cx="29" cy="21" r="3.5" fill="#c0d0f0" stroke="#a0b0d0" strokeWidth="0.4" />
      <circle cx="28" cy="20" r="1.2" fill="white" opacity="0.4" />
      <circle cx="30" cy="22" r="0.8" fill="white" opacity="0.2" />
      <circle cx="27.5" cy="22" r="0.6" fill="white" opacity="0.15" />

      {/* Closed eyes with eyelash flourishes */}
      <path d="M 14 48 Q 17 52, 20 48" fill="none" stroke="#8d6e63" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 23 48 Q 26 52, 29 48" fill="none" stroke="#8d6e63" strokeWidth="1.5" strokeLinecap="round" />
      {/* Soft eyelid shadow */}
      <path d="M 14 47 Q 17 46, 20 47" fill="#8d6e63" opacity="0.06" />
      <path d="M 23 47 Q 26 46, 29 47" fill="#8d6e63" opacity="0.06" />
      {/* Eyelash */}
      <path d="M 14 47 Q 15.5 46, 17 47" fill="none" stroke="#8d6e63" strokeWidth="0.6" />
      <path d="M 23 47 Q 24.5 46, 26 47" fill="none" stroke="#8d6e63" strokeWidth="0.6" />
      {/* Lash flourishes at outer corners */}
      <line x1="20" y1="48" x2="21" y2="47" stroke="#8d6e63" strokeWidth="0.4" />
      <line x1="20.5" y1="48.5" x2="21.5" y2="48" stroke="#8d6e63" strokeWidth="0.3" />
      <line x1="29" y1="48" x2="30" y2="47" stroke="#8d6e63" strokeWidth="0.4" />
      <line x1="29.5" y1="48.5" x2="30.5" y2="48" stroke="#8d6e63" strokeWidth="0.3" />
      {/* Lower lash accent */}
      <line x1="20" y1="50" x2="20.5" y2="51" stroke="#8d6e63" strokeWidth="0.4" />
      <line x1="29" y1="50" x2="29.5" y2="51" stroke="#8d6e63" strokeWidth="0.4" />

      {/* Blush */}
      <ellipse cx="12" cy="52" rx="3.5" ry="2" fill="url(#blushMark)" />
      <ellipse cx="31" cy="52" rx="3.5" ry="2" fill="url(#blushMark)" />

      {/* Nose & smile */}
      <path d="M 21 54 L 22 52.5 L 23 54 Z" fill="#e8a898" />
      <path d="M 19.5 55 Q 22 56.5, 24.5 55" fill="none" stroke="#8d6e63" strokeWidth="0.5" />

      {/* Rim lighting */}
      <path d="M 34 40 Q 36 46, 34 54" fill="none" stroke="#fff8e0" strokeWidth="0.8" opacity="0.2" />

      {/* Paw peeking out */}
      <ellipse cx="14" cy="64" rx="5.5" ry="3.5" fill="url(#furCream)" stroke="#c4a888" strokeWidth="0.8" />
      <circle cx="12" cy="63.5" r="0.8" fill="#e8b0a0" opacity="0.5" />
      <circle cx="14" cy="63" r="0.8" fill="#e8b0a0" opacity="0.5" />
      <circle cx="16" cy="63.5" r="0.8" fill="#e8b0a0" opacity="0.5" />

      {/* Zzz bubbles with glow */}
      <g className={styles.zzzBubbles}>
        <circle cx="44" cy="34" r="6" fill="#8090c8" opacity="0.04" />
        <text x="44" y="34" fontSize="10" fill="#8090c8" opacity="0.7" fontWeight="bold" fontFamily="serif">z</text>
        <circle cx="50" cy="25" r="7" fill="#8090c8" opacity="0.03" />
        <text x="50" y="25" fontSize="13" fill="#8090c8" opacity="0.5" fontWeight="bold" fontFamily="serif">z</text>
        <circle cx="57" cy="14" r="8" fill="#8090c8" opacity="0.02" />
        <text x="57" y="14" fontSize="16" fill="#8090c8" opacity="0.3" fontWeight="bold" fontFamily="serif">Z</text>
      </g>
    </g>
  );
};
