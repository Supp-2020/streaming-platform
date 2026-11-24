# Kinora

A Netflix-style streaming platform demo built with **Next.js**, **TypeScript**, **Tailwind CSS** and **Video.js**.

It plays real HLS video streams in a custom-themed player and includes the surrounding app: browsing, search, My List, profiles and settings. It is a front-end demo with no backend, so all data is mock data and everything you do is saved only in your browser.

## Features

- **Player (Video.js):** HLS adaptive streaming, quality menu, speed control, ±10s skip, picture-in-picture, keyboard shortcuts, resume where you left off, Skip Intro, next-episode countdown with autoplay, subtitles and Media Session (media keys)
- **Browse:** home with featured title, Continue Watching, carousels, Series / Films / Documentaries pages, title details with episodes
- **Search:** instant results with type filters and sorting
- **My List:** add, remove, edit mode and undo
- **Sign in and profiles:** a sign-in page (UI only, no authentication) and a "Who's watching?" profile picker
- **Settings:** account, profiles, playback, subtitles, devices and parental controls, plus a profile dropdown in the header

## Getting started

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The app starts at the sign-in page.

Other commands:

```bash
npm run build   # static export to ./out
npm run lint
```

## Project structure

| Path | What it is |
|---|---|
| `src/app/` | Pages (signin, profiles, browse, search, my-list, settings, title, watch) |
| `src/components/player/` | Video.js player and watch page wiring |
| `src/lib/catalog.ts` | Mock catalog and public test streams |
| `src/lib/store.ts` | Saved state (Zustand, stored in the browser) |

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the static site and publishes it to GitHub Pages on every push to `main`. The base path in `next.config.ts` must match the repository name (`/streaming-platform`).

## Notes

- Videos are public test streams (Big Buck Bunny, Elephants Dream, Tears of Steel from Blender, plus Mux and Apple samples). Third-party hosts can go offline.
- There is no DRM, authentication or server. Parental controls and the PIN are demo-only and not enforced.
