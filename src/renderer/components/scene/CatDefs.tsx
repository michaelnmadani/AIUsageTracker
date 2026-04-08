import React from 'react';

/**
 * Shared SVG <defs> for all cat components.
 * Provides reusable gradients, patterns, and filters for anime-style rendering.
 */
export const CatDefs: React.FC = () => (
  <defs>
    {/* === Fur color gradients === */}
    <radialGradient id="furCream" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stopColor="#fff5eb" />
      <stop offset="100%" stopColor="#f0dcc8" />
    </radialGradient>
    <radialGradient id="furGray" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stopColor="#d8d0c8" />
      <stop offset="100%" stopColor="#a89a90" />
    </radialGradient>
    <radialGradient id="furOrange" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stopColor="#f8c070" />
      <stop offset="100%" stopColor="#d89040" />
    </radialGradient>
    <radialGradient id="furBrown" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stopColor="#a88060" />
      <stop offset="100%" stopColor="#7a5838" />
    </radialGradient>
    <radialGradient id="furCalico" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stopColor="#fff0e8" />
      <stop offset="100%" stopColor="#e8d8c8" />
    </radialGradient>

    {/* === Eye highlight gradient === */}
    <radialGradient id="eyeHighlight" cx="35%" cy="30%" r="50%">
      <stop offset="0%" stopColor="white" stopOpacity="0.9" />
      <stop offset="100%" stopColor="white" stopOpacity="0" />
    </radialGradient>

    {/* === Blush gradient === */}
    <radialGradient id="blushMark" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ff8888" stopOpacity="0.5" />
      <stop offset="70%" stopColor="#ff8888" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#ff8888" stopOpacity="0" />
    </radialGradient>

    {/* === Apron fabric pattern === */}
    <pattern id="apronLace" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.5" fill="white" opacity="0.3" />
    </pattern>

    {/* === Cat shadow filter === */}
    <filter id="catShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
      <feOffset dx="0" dy="2" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.15" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* === Warm glow for props (candles, fire, etc.) === */}
    <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ffdd88" stopOpacity="0.4" />
      <stop offset="100%" stopColor="#ffdd88" stopOpacity="0" />
    </radialGradient>

    {/* === Iris gradients per eye color === */}
    <radialGradient id="irisAmber" cx="45%" cy="40%" r="50%">
      <stop offset="0%" stopColor="#e8c060" />
      <stop offset="100%" stopColor="#a08030" />
    </radialGradient>
    <radialGradient id="irisGreen" cx="45%" cy="40%" r="50%">
      <stop offset="0%" stopColor="#80c878" />
      <stop offset="100%" stopColor="#4a8840" />
    </radialGradient>
    <radialGradient id="irisBlue" cx="45%" cy="40%" r="50%">
      <stop offset="0%" stopColor="#78b8e8" />
      <stop offset="100%" stopColor="#4080b0" />
    </radialGradient>
  </defs>
);
