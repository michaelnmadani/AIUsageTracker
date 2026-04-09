import React from 'react';

/**
 * Shared SVG definitions (patterns, gradients, filters) for the top-down room.
 */
export const RoomDefs: React.FC = () => (
  <defs>
    {/* Wood floor plank pattern */}
    <pattern id="floorWood" width="40" height="12" patternUnits="userSpaceOnUse">
      <rect width="40" height="12" fill="#b8935a" />
      <line x1="0" y1="0" x2="40" y2="0" stroke="#a07840" strokeWidth="0.4" />
      <line x1="0" y1="6" x2="40" y2="6" stroke="#a07840" strokeWidth="0.3" />
      <line x1="20" y1="0" x2="20" y2="6" stroke="#a07840" strokeWidth="0.3" />
      <line x1="0" y1="6" x2="0" y2="12" stroke="#a07840" strokeWidth="0.3" />
      <line x1="30" y1="6" x2="30" y2="12" stroke="#a07840" strokeWidth="0.3" />
      {/* Wood grain */}
      <ellipse cx="10" cy="3" rx="3" ry="1" fill="#a88548" opacity="0.3" />
      <ellipse cx="35" cy="9" rx="2" ry="0.8" fill="#a88548" opacity="0.25" />
    </pattern>

    {/* Stone wall pattern */}
    <pattern id="stoneWallPat" width="14" height="10" patternUnits="userSpaceOnUse">
      <rect width="14" height="10" fill="#8a7a6a" />
      <rect x="0.5" y="0.5" width="6" height="4" rx="0.5" fill="#9a8a7a" stroke="#706050" strokeWidth="0.3" />
      <rect x="7" y="0.5" width="6" height="4" rx="0.5" fill="#8a7868" stroke="#706050" strokeWidth="0.3" />
      <rect x="3.5" y="5.5" width="6" height="4" rx="0.5" fill="#9a8878" stroke="#706050" strokeWidth="0.3" />
      <rect x="10" y="5.5" width="3.5" height="4" rx="0.5" fill="#8a7868" stroke="#706050" strokeWidth="0.3" />
      <rect x="0" y="5.5" width="3" height="4" rx="0.5" fill="#9a8a7a" stroke="#706050" strokeWidth="0.3" />
    </pattern>

    {/* Rug pattern */}
    <pattern id="rugPattern" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#8b3a3a" />
      <rect x="1" y="1" width="6" height="6" fill="#a04848" />
      <rect x="2" y="2" width="4" height="4" fill="#8b3a3a" />
      <rect x="3" y="3" width="2" height="2" fill="#c46050" />
    </pattern>

    {/* Warm glow gradient (for fireplace, lamps) */}
    <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ffaa44" stopOpacity="0.5" />
      <stop offset="60%" stopColor="#ff8822" stopOpacity="0.15" />
      <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
    </radialGradient>

    {/* Fire glow */}
    <radialGradient id="fireGlow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ff4400" stopOpacity="0.7" />
      <stop offset="50%" stopColor="#ff6600" stopOpacity="0.3" />
      <stop offset="100%" stopColor="#ff8800" stopOpacity="0" />
    </radialGradient>

    {/* Window light gradient */}
    <linearGradient id="windowLight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#aaddff" stopOpacity="0.4" />
      <stop offset="100%" stopColor="#aaddff" stopOpacity="0" />
    </linearGradient>

    {/* Drop shadow filter */}
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#3a2a1a" floodOpacity="0.25" />
    </filter>

    {/* Soft glow filter */}
    <filter id="softGlow">
      <feGaussianBlur stdDeviation="2" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* Warm lamp light (pooled) */}
    <radialGradient id="lampPool" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ffe8a0" stopOpacity="0.18" />
      <stop offset="60%" stopColor="#ffcc66" stopOpacity="0.06" />
      <stop offset="100%" stopColor="#ffcc66" stopOpacity="0" />
    </radialGradient>

    {/* Table cloth pattern */}
    <pattern id="clothCheck" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill="#e8d8c0" />
      <rect width="3" height="3" fill="#dcc8a8" />
      <rect x="3" y="3" width="3" height="3" fill="#dcc8a8" />
    </pattern>

    {/* Window curtain gradient */}
    <linearGradient id="curtainFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#c08060" stopOpacity="0.7" />
      <stop offset="100%" stopColor="#c08060" stopOpacity="0.3" />
    </linearGradient>

    {/* === Enhanced Room Lighting === */}

    {/* Warm ambient overlay for entire room */}
    <radialGradient id="roomAmbient" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stopColor="#ffcc66" stopOpacity="0.06" />
      <stop offset="50%" stopColor="#ffaa44" stopOpacity="0.03" />
      <stop offset="100%" stopColor="#ff8822" stopOpacity="0" />
    </radialGradient>

    {/* Depth fog gradient for atmospheric perspective */}
    <linearGradient id="depthFog" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#d0c0a0" stopOpacity="0.08" />
      <stop offset="100%" stopColor="#d0c0a0" stopOpacity="0" />
    </linearGradient>

    {/* Enhanced window light (warmer) */}
    <linearGradient id="windowLightWarm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffeedd" stopOpacity="0.3" />
      <stop offset="40%" stopColor="#aaddff" stopOpacity="0.15" />
      <stop offset="100%" stopColor="#aaddff" stopOpacity="0" />
    </linearGradient>

    {/* Corner vignette gradient */}
    <radialGradient id="cornerVignette" cx="50%" cy="50%" r="70%">
      <stop offset="60%" stopColor="#000000" stopOpacity="0" />
      <stop offset="100%" stopColor="#000000" stopOpacity="0.06" />
    </radialGradient>
  </defs>
);
