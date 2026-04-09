import React from 'react';

/**
 * Shared SVG <defs> for all cat components.
 * Provides reusable gradients, patterns, and filters for anime-style rendering.
 * Enhanced with cel-shading filters, volumetric gradients, and ambient occlusion
 * for a "Cats & Soup" style visual upgrade.
 */
export const CatDefs: React.FC = () => (
  <defs>
    {/* === Fur color gradients (5-stop volumetric) === */}
    <radialGradient id="furCream" cx="45%" cy="35%" r="65%" fx="40%" fy="30%">
      <stop offset="0%" stopColor="#fffaf0" />
      <stop offset="30%" stopColor="#fff5eb" />
      <stop offset="65%" stopColor="#f0dcc8" />
      <stop offset="85%" stopColor="#dcc4a8" />
      <stop offset="100%" stopColor="#c8a888" />
    </radialGradient>
    <radialGradient id="furGray" cx="45%" cy="35%" r="65%" fx="40%" fy="30%">
      <stop offset="0%" stopColor="#e8e0d8" />
      <stop offset="30%" stopColor="#d8d0c8" />
      <stop offset="65%" stopColor="#a89a90" />
      <stop offset="85%" stopColor="#8a7a6a" />
      <stop offset="100%" stopColor="#6a5a4a" />
    </radialGradient>
    <radialGradient id="furOrange" cx="45%" cy="35%" r="65%" fx="40%" fy="30%">
      <stop offset="0%" stopColor="#ffd890" />
      <stop offset="30%" stopColor="#f8c070" />
      <stop offset="65%" stopColor="#d89040" />
      <stop offset="85%" stopColor="#c07828" />
      <stop offset="100%" stopColor="#a06020" />
    </radialGradient>
    <radialGradient id="furBrown" cx="45%" cy="35%" r="65%" fx="40%" fy="30%">
      <stop offset="0%" stopColor="#c8a078" />
      <stop offset="30%" stopColor="#a88060" />
      <stop offset="65%" stopColor="#7a5838" />
      <stop offset="85%" stopColor="#5a3a20" />
      <stop offset="100%" stopColor="#402810" />
    </radialGradient>
    <radialGradient id="furCalico" cx="45%" cy="35%" r="65%" fx="40%" fy="30%">
      <stop offset="0%" stopColor="#fff8f0" />
      <stop offset="30%" stopColor="#fff0e8" />
      <stop offset="65%" stopColor="#e8d8c8" />
      <stop offset="85%" stopColor="#d0c0a8" />
      <stop offset="100%" stopColor="#b8a890" />
    </radialGradient>

    {/* === Eye highlight gradient === */}
    <radialGradient id="eyeHighlight" cx="35%" cy="30%" r="50%">
      <stop offset="0%" stopColor="white" stopOpacity="0.9" />
      <stop offset="100%" stopColor="white" stopOpacity="0" />
    </radialGradient>

    {/* === Blush gradient (warmer, more saturated) === */}
    <radialGradient id="blushMark" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ff7777" stopOpacity="0.55" />
      <stop offset="40%" stopColor="#ff8888" stopOpacity="0.35" />
      <stop offset="70%" stopColor="#ff9999" stopOpacity="0.15" />
      <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
    </radialGradient>

    {/* === Apron fabric pattern === */}
    <pattern id="apronLace" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.5" fill="white" opacity="0.3" />
    </pattern>

    {/* === Iris gradients (4-stop with depth) === */}
    <radialGradient id="irisAmber" cx="40%" cy="35%" r="55%" fx="35%" fy="30%">
      <stop offset="0%" stopColor="#f0d870" />
      <stop offset="25%" stopColor="#e8c060" />
      <stop offset="65%" stopColor="#b89030" />
      <stop offset="100%" stopColor="#806020" />
    </radialGradient>
    <radialGradient id="irisGreen" cx="40%" cy="35%" r="55%" fx="35%" fy="30%">
      <stop offset="0%" stopColor="#a0e898" />
      <stop offset="25%" stopColor="#80c878" />
      <stop offset="65%" stopColor="#4a8840" />
      <stop offset="100%" stopColor="#306028" />
    </radialGradient>
    <radialGradient id="irisBlue" cx="40%" cy="35%" r="55%" fx="35%" fy="30%">
      <stop offset="0%" stopColor="#a0d8f8" />
      <stop offset="25%" stopColor="#78b8e8" />
      <stop offset="65%" stopColor="#4080b0" />
      <stop offset="100%" stopColor="#285878" />
    </radialGradient>

    {/* === Warm glow for props === */}
    <radialGradient id="catWarmGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ffdd88" stopOpacity="0.4" />
      <stop offset="100%" stopColor="#ffdd88" stopOpacity="0" />
    </radialGradient>

    {/* === Ambient Occlusion Gradients === */}
    <radialGradient id="aoUnderChin" cx="50%" cy="20%" r="60%">
      <stop offset="0%" stopColor="#000000" stopOpacity="0.12" />
      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="aoEarBase" cx="50%" cy="80%" r="50%">
      <stop offset="0%" stopColor="#000000" stopOpacity="0.08" />
      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
    </radialGradient>

    {/* === Specular highlight gradient === */}
    <radialGradient id="specHighlight" cx="40%" cy="30%" r="35%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
      <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
    </radialGradient>

    {/* === Cats & Soup Master Filter (cel-shading + warm tint + soft glow) === */}
    <filter id="catsAndSoupStyle" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
      {/* Soft posterization for cel-shade feel */}
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="soft" />
      <feComponentTransfer in="soft" result="poster">
        <feFuncR type="discrete" tableValues="0.12 0.30 0.50 0.68 0.82 0.95" />
        <feFuncG type="discrete" tableValues="0.12 0.30 0.50 0.68 0.82 0.95" />
        <feFuncB type="discrete" tableValues="0.12 0.30 0.50 0.68 0.82 0.95" />
      </feComponentTransfer>
      {/* Blend poster with original for soft cel look */}
      <feBlend in="poster" in2="SourceGraphic" mode="normal" result="celBlend" />
      {/* Warm tint overlay */}
      <feColorMatrix in="celBlend" type="matrix" result="warmed"
        values="1.05 0.02 0.0  0 0.02
                0.0  1.02 0.01 0 0.01
                0.0  0.0  0.95 0 0.0
                0    0    0    1 0" />
      {/* Soft outer glow (subsurface scattering look) */}
      <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="glowAlpha" />
      <feFlood floodColor="#fff0dd" floodOpacity="0.15" result="glowColor" />
      <feComposite in="glowColor" in2="glowAlpha" operator="in" result="softGlow" />
      {/* Compose glow behind warmed graphic */}
      <feMerge>
        <feMergeNode in="softGlow" />
        <feMergeNode in="warmed" />
      </feMerge>
    </filter>

    {/* === Rim Light Filter === */}
    <filter id="rimLight" x="-15%" y="-15%" width="130%" height="130%">
      <feMorphology operator="dilate" radius="1" in="SourceAlpha" result="expanded" />
      <feGaussianBlur in="expanded" stdDeviation="1.5" result="blurredEdge" />
      <feFlood floodColor="#fff8e0" floodOpacity="0.4" result="lightColor" />
      <feComposite in="lightColor" in2="blurredEdge" operator="in" result="rimGlow" />
      <feComposite in="rimGlow" in2="SourceAlpha" operator="out" result="rimOnly" />
      <feMerge>
        <feMergeNode in="rimOnly" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* === Enhanced 3D Drop Shadow === */}
    <filter id="catShadow3D" x="-20%" y="-15%" width="140%" height="145%">
      {/* Contact shadow (close, sharp) */}
      <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="sharpShadow" />
      <feOffset in="sharpShadow" dx="0" dy="1.5" result="sharpOffset" />
      <feComponentTransfer in="sharpOffset" result="sharpFaded">
        <feFuncA type="linear" slope="0.2" />
      </feComponentTransfer>
      {/* Ambient shadow (wider, softer) */}
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="softShadow" />
      <feOffset in="softShadow" dx="0" dy="3" result="softOffset" />
      <feComponentTransfer in="softOffset" result="softFaded">
        <feFuncA type="linear" slope="0.1" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode in="softFaded" />
        <feMergeNode in="sharpFaded" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* === Legacy catShadow (kept for backward compatibility) === */}
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
  </defs>
);
