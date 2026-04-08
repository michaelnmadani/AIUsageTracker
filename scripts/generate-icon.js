#!/usr/bin/env node

/**
 * Generates a simple cat face app icon as a PNG.
 * Run: node scripts/generate-icon.js
 *
 * If you have ImageMagick installed, it also generates .icns:
 *   mkdir -p build && node scripts/generate-icon.js
 *
 * Otherwise, macOS will use a default Electron icon.
 */

const fs = require('fs');
const path = require('path');

// SVG cat face icon (512x512)
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#16213e"/>
    </linearGradient>
  </defs>

  <!-- Background circle -->
  <circle cx="256" cy="256" r="240" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="230" fill="none" stroke="#f59e0b" stroke-width="3" opacity="0.3"/>

  <!-- Cat body -->
  <ellipse cx="256" cy="340" rx="110" ry="85" fill="#ff9800"/>

  <!-- Cat head -->
  <circle cx="256" cy="220" r="100" fill="#ff9800"/>

  <!-- Left ear -->
  <polygon points="175,160 140,60 210,130" fill="#ff9800"/>
  <polygon points="180,155 155,85 205,135" fill="#ffab91"/>

  <!-- Right ear -->
  <polygon points="337,160 372,60 302,130" fill="#ff9800"/>
  <polygon points="332,155 357,85 307,135" fill="#ffab91"/>

  <!-- Eyes -->
  <ellipse cx="215" cy="210" rx="22" ry="26" fill="#424242"/>
  <ellipse cx="297" cy="210" rx="22" ry="26" fill="#424242"/>
  <circle cx="222" cy="200" r="8" fill="white"/>
  <circle cx="304" cy="200" r="8" fill="white"/>

  <!-- Nose -->
  <ellipse cx="256" cy="248" rx="10" ry="7" fill="#ffab91"/>

  <!-- Mouth -->
  <path d="M 240 258 Q 256 275, 272 258" fill="none" stroke="#5d4037" stroke-width="3" stroke-linecap="round"/>

  <!-- Whiskers -->
  <line x1="195" y1="235" x2="130" y2="225" stroke="white" stroke-width="2" opacity="0.6"/>
  <line x1="195" y1="250" x2="130" y2="255" stroke="white" stroke-width="2" opacity="0.6"/>
  <line x1="317" y1="235" x2="382" y2="225" stroke="white" stroke-width="2" opacity="0.6"/>
  <line x1="317" y1="250" x2="382" y2="255" stroke="white" stroke-width="2" opacity="0.6"/>

  <!-- Paws -->
  <ellipse cx="200" cy="400" rx="35" ry="20" fill="#ff9800" stroke="#e65100" stroke-width="1"/>
  <ellipse cx="312" cy="400" rx="35" ry="20" fill="#ff9800" stroke="#e65100" stroke-width="1"/>

  <!-- Token sparkle -->
  <circle cx="380" cy="100" r="15" fill="#f59e0b" opacity="0.8"/>
  <text x="380" y="107" text-anchor="middle" font-size="18" font-weight="bold" fill="white">T</text>
</svg>`;

const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Write SVG
fs.writeFileSync(path.join(buildDir, 'icon.svg'), svg);
console.log('Created build/icon.svg');

// Write a simple HTML file to preview the icon
const preview = `<!DOCTYPE html>
<html><body style="background:#333;display:flex;justify-content:center;align-items:center;height:100vh;margin:0">
<img src="icon.svg" width="256" height="256">
</body></html>`;
fs.writeFileSync(path.join(buildDir, 'preview.html'), preview);
console.log('Created build/preview.html (open in browser to preview)');

console.log('\\nTo create .icns for macOS, install ImageMagick and run:');
console.log('  brew install imagemagick');
console.log('  magick build/icon.svg -resize 1024x1024 build/icon.png');
console.log('  mkdir -p build/icon.iconset');
console.log('  sips -z 16 16     build/icon.png --out build/icon.iconset/icon_16x16.png');
console.log('  sips -z 32 32     build/icon.png --out build/icon.iconset/icon_16x16@2x.png');
console.log('  sips -z 32 32     build/icon.png --out build/icon.iconset/icon_32x32.png');
console.log('  sips -z 64 64     build/icon.png --out build/icon.iconset/icon_32x32@2x.png');
console.log('  sips -z 128 128   build/icon.png --out build/icon.iconset/icon_128x128.png');
console.log('  sips -z 256 256   build/icon.png --out build/icon.iconset/icon_128x128@2x.png');
console.log('  sips -z 256 256   build/icon.png --out build/icon.iconset/icon_256x256.png');
console.log('  sips -z 512 512   build/icon.png --out build/icon.iconset/icon_256x256@2x.png');
console.log('  sips -z 512 512   build/icon.png --out build/icon.iconset/icon_512x512.png');
console.log('  sips -z 1024 1024 build/icon.png --out build/icon.iconset/icon_512x512@2x.png');
console.log('  iconutil -c icns build/icon.iconset -o build/icon.icns');
