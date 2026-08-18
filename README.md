# Command Centre

A desktop command centre for your PC, built with Electron + React. One window that
answers "what's going on right now": the time, the weather, what's on your plate,
what your network is doing, what Claude has cost you, and what your printers are up to.

The shell is a J.A.R.V.I.S.-style HUD — arc-reactor cyan on near-black, bracketed
panels, tracked mono labels, a left rail, a header readout and a bottom dock.

## Panels

| Panel | Source | Notes |
| --- | --- | --- |
| Time &amp; date | Local clock | 12/24-hour, optional seconds, ISO week number |
| Weather now | [Open-Meteo](https://open-meteo.com) | No API key needed |
| 7-day forecast | Open-Meteo | Highs/lows, rain probability, wind |
| To do | Local `todos.json` | Priorities, due dates, completion history |
| Network | OS interface counters | Live up/down throughput plus a Cloudflare bandwidth test |
| Important mail | Gmail API (read-only) | Merges both Google accounts, per-account search query |
| Upcoming | Google Calendar API (read-only) | Merges every selected calendar across accounts |
| Claude usage | `~/.claude` transcripts + Anthropic Admin API | Pro/Max and pay-as-you-go API, on separate tabs |
| 3D printers | Bambu Lab MQTT + Elegoo SDCP/Moonraker | Progress, ETA, temperatures, filament |

Every network call happens in the main process. The renderer only talks to the
preload bridge, with `contextIsolation` on and `nodeIntegration` off.

## See-through window

The window is frameless and composited straight onto your desktop — panels, the rail
and the dock are all alpha fills, so the wallpaper reads through the whole app.

* **Settings → Glass** has the controls: a see-through toggle, a live **panel opacity**
  slider (5–95%), and a switch for the HUD grid drawn over the desktop.
* Transparency is fixed when the window is created, so toggling it offers a restart.
  Opacity and the grid apply immediately.
* Frameless means no title bar: drag the header or the left rail to move the window.
  The header and dock carry their own scrim so the clock and buttons stay readable over
  a bright wallpaper.
* Platform notes: Electron documents transparent windows as not reliably resizable, so
  if dragging an edge misbehaves, turn transparency off in Settings → Glass. On Linux a
  compositing window manager is required, otherwise the transparent areas paint black.
  Clicks are not passed through to whatever is behind the window.

## Look and motion

The theme lives entirely in `src/renderer/styles/global.css` — one block of tokens
(`--hud`, `--amber`, `--line`, `--glass`, …) drives every panel, so retinting the whole
app is a handful of variables. `--glass` is the fill alpha every surface shares, which
is what the opacity slider writes at runtime.

Motion is deliberately small and cheap: a drifting background grid, a scan bar that
crosses the window every nine seconds, panels that boot in staggered, a light sweep
across each card, list rows that cascade, and a head glyph that flares whenever fresh
telemetry lands on that panel. The Claude dial and printer dials are ticked
arc-reactor rings whose reticle spins faster while a job is actually running.

Everything animates `transform` and `opacity` only, so the compositor does the work
rather than the CPU, and the whole motion layer is switched off under
`prefers-reduced-motion`. No game engine or WebGL involved — plain CSS and inline SVG.

## Running it

```bash
npm install
npm run dev            # Vite dev server + Electron with hot reload
npm start              # run the last build
npm run typecheck      # tsc --noEmit
```

Packaging (electron-builder, output in `out/`):

```bash
npm run package:win    # NSIS installer + portable exe
npm run package:linux  # AppImage + deb
npm run package:mac    # universal dmg
```

## Configuration

Everything is configured in-app under **Settings**. Nothing is hard-coded and no
credentials live in the repo.

* Settings are stored in `<userData>/command-centre.json`.
* Secrets (Google client secret, refresh tokens, Anthropic admin key, Bambu access
  codes) are stored separately in `<userData>/secrets.bin`, encrypted with Electron's
  `safeStorage` where the OS provides a keychain. They are never exposed to the
  renderer — it only learns whether a secret is set.

### Google accounts (mail + calendar)

1. In the [Google Cloud console](https://console.cloud.google.com), create a project
   and enable the **Gmail API** and **Google Calendar API**.
2. Create an OAuth client of type **Desktop app**. Add your own address as a test user
   on the consent screen.
3. Paste the client ID and secret into **Settings → Google**, then press
   **Connect account** once per Google account.

Sign-in runs in your normal browser and lands back on a loopback redirect
(`http://127.0.0.1:<random port>`) using PKCE. Only read-only scopes are requested:
`gmail.readonly`, `calendar.readonly`, `openid`, `email`.

The per-account "important mail" search is a plain Gmail query, so you can tune it —
the default is:

```
in:inbox is:unread (is:important OR is:starred) newer_than:14d
```

### Claude usage

Two tabs, because subscription and API usage are billed and reported differently:

* **Pro / Max** — reconstructed from the Claude Code transcripts under `~/.claude`
  (plus Claude Desktop agent sessions on macOS). Shows the rolling session window,
  today's tokens, a 24-hour histogram, per-model split and the busiest projects.
  Anthropic doesn't publish plan limits as token numbers, so the progress bar is
  measured against a budget you set in Settings.
* **API** — real spend from the [Usage &amp; Cost Admin API](https://platform.claude.com/docs/en/manage-claude/usage-cost-api):
  `/v1/organizations/usage_report/messages` grouped by model, and
  `/v1/organizations/cost_report` grouped by description, over the last 30 days.
  This needs an **Admin API key** (`sk-ant-admin01-…`) from the Claude Console.
  Individual accounts without an organisation can't create one; the panel says so
  rather than inventing numbers.

Cost figures on the Pro/Max tab are an *equivalent* — what the same tokens would cost
at published API rates — since subscription usage isn't billed per token.

### Bambu Lab

Turn on **LAN Only Mode** on the printer, then copy its IP address, serial number and
access code from the printer's network settings. Command Centre subscribes to the
printer's own MQTT feed over TLS on port 8883 (user `bblp`, password = access code)
and issues a `pushall` on connect. Nothing goes through Bambu Cloud.

### Elegoo

* **SDCP** (Centauri Carbon, Saturn, Mars): discovered with a UDP `M99999` probe on
  port 3000, then queried over the websocket on port 3030.
* **Moonraker** (Neptune 4 and other Klipper machines): polled over HTTP on port 7125.

## Layout of the source

```
src/
  shared/types.ts        types shared across the process boundary
  main/
    index.ts             window, tray, IPC surface
    hub.ts               polls every source, caches results, broadcasts changes
    store.ts             config + encrypted secrets + todos on disk
    parser.ts            ~/.claude transcript parser
    watcher.ts           chokidar watcher over the transcripts
    services/            weather, network, google/, claude, printers/
  preload/index.ts       the only bridge the renderer sees
  renderer/
    App.tsx              panel grid
    panels/              one file per panel, plus the settings sheet
    components/          Panel shell, weather glyphs, progress ring
    hooks/useDashboard   single subscription to the main process
```

## Refresh cadence

| Channel | Interval |
| --- | --- |
| Network | 1s sample |
| Printers | 20s (Bambu also pushes on change) |
| Claude | 60s, plus on any transcript write |
| Mail | 2 min |
| Calendar | 5 min |
| Weather | 10 min |
