# AI Usage Tracker

A cozy desktop companion for Claude Code. Animated cats keep house in a
rustic-fantasy cottage while you work — they cook, type, sweep, read,
garden and nap depending on what Claude is doing, and the dashboard below
tracks your token usage in real time.

The scene is rendered with PixiJS v8. All artwork (the room and the cats)
is procedural SVG rasterized to textures at runtime — no image assets to
ship.

## Features

- **Live cat scene** — cats switch activities based on Claude Code session
  state (active / idle / celebrating), with walking, particle effects,
  flickering fireplace and lantern light
- **Usage dashboard** — current session tokens, history, per-project and
  per-model breakdowns, parsed from local Claude Code session logs
- **Menu bar tray**, always-on-top mode, and gentle sound effects

## Development

```bash
npm install
npm run dev            # vite dev server + electron with hot reload
```

## Run a production build locally

```bash
npm install
npm run electron:dev   # vite build + electron .
```

## Package the macOS app

```bash
npm run build          # builds renderer + main, then electron-builder --mac
```

The signed-less universal `.dmg` lands in `out/AI Usage Tracker-<version>.dmg`.
App and menu-bar icons live in `build/` (`icon.png`, `tray/`).

## Project layout

```
src/main/       Electron main process (window, tray, IPC, usage parsing)
src/preload/    contextBridge API exposed to the renderer as window.usageAPI
src/renderer/   React app: PixiJS scene + dashboard
  components/scene/pixi/
    layers/RoomSvg.ts        hand-crafted SVG room artwork
    layers/BackgroundLayer.ts room texture + animated fireplace flames
    SvgRasterizer.ts         cat SVGs + SVG -> texture pipeline
    config/SceneConfig.ts    scene layout, cat positions, lighting anchors
  public/sounds/             sound effects (copied into dist/ by vite)
```
