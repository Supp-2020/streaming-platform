# Kinora: streaming platform demo

Next.js (App Router) + TypeScript + Tailwind v4 + **Video.js 8** (HLS built in via VHS).
UI follows the "Kinora" design canvas (dark theme, amber `#F0A04B` accent, Inter + Schibsted Grotesk).

## Setup

```powershell
npm install
npm run dev      # http://localhost:3000  (redirects to /browse)
npm run build    # production build
npm run lint
```

Requires Node 20+ (built with Node 22).

## Routes

| Route | What |
|---|---|
| `/browse` | Hero, Continue Watching (progress bars), carousels, Top-10 rank. `?list=1` shows My List |
| `/title/[id]` | Details, seasons/episodes, My List toggle |
| `/watch/[id]` | Video.js player (`id` is an episode id, e.g. `test-pattern-s1e1`) |

## Stack and where things live

- `src/components/player/VideoPlayer.tsx`: Video.js wrapper (client only)
- `src/components/player/WatchClient.tsx`: wires player to saved progress, autoplay, next episode
- `src/lib/catalog.ts`: mock catalog, test streams, intro/credits markers
- `src/lib/store.ts`: Zustand (persisted to localStorage): watch progress, My List, autoplay setting
- TanStack Query is installed and provided in `src/app/providers.tsx`, ready for when the catalog moves to an API

## Implemented (MVP)

Video.js core controls (play/pause, seek bar with buffered range, volume/mute, fullscreen, PiP, speed 0.5-2x, ±10s skip buttons, time display, auto-hide controls, big play button, buffering spinner) plus:

- HLS adaptive streaming, quality menu (`videojs-contrib-quality-menu`)
- Resume from last position; Continue Watching row
- Skip Intro button (timestamp markers), Next Episode countdown with autoplay toggle
- Keyboard shortcuts: Space/K, J/L ±10s, arrows (seek/volume), M, F, C, 0-9
- Media Session API (media keys, lock screen)
- Error recovery: retry with backoff (3 attempts)
- Search (debounced, instant results), My List, title pages, responsive layout

## Not built yet (suggested next)

Thumbnail sprite previews, chapters, audio and subtitle panel, subtitle styling, "Are you still watching?", stats overlay, touch gestures (`videojs-mobile-ui`), profiles/Kids, live/multiview, ads (`videojs-contrib-ads`), Playwright tests, Sentry, backend (FFmpeg/HLS pipeline, signed URLs, auth, DB).

## Content and legal notes

Streams are public test streams (Mux, Bitmovin/Blender Sintel, Unified Streaming Tears of Steel, Apple bipbop). Verify each stream's availability and terms before relying on it. Artwork is generated from colors. There is no DRM; "Disable download" only deters casual copying.
