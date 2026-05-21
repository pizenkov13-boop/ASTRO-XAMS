# ASTRO'XAMS

Space-themed full-stack learning app: **Essential Grammar in Use** (115 units), **4000 Essential English Words Book 1**, and **SAT Prep** — with SM-2 spaced repetition, timed quizzes, XP levels, and dopamine ad-libs on correct answers.

## Tech stack

- **Next.js 15** + TypeScript (App Router)
- **Tailwind CSS** — dark neon UI (orange / purple)
- **Framer Motion** — animations, streak celebrations
- **Howler.js** — ad-lib audio
- **localStorage** — progress, SM-2 cards, XP (no backend for MVP)

## Environment

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
|----------|---------|
| `GROQ_API_KEY` | AI explanations (`/api/explain`) |
| `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Server-side Spotify API |
| `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI` | OAuth callback (default `http://localhost:3000/api/spotify/callback`) |

In [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), add the redirect URI. For **Web Playback SDK** full tracks, users need **Spotify Premium** and must click “Connect Spotify” after login.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** If your project folder contains an apostrophe (e.g. `ASTRO'XAMS`), run commands from that folder in your terminal. Some automated shells may fail on apostrophe paths.

## Modules

| Module | Content |
|--------|---------|
| Grammar | 115 units (A1–B1), 10 questions each |
| Vocabulary | 30 Book 1 units (expand in `src/data/vocabulary`) |
| SAT | 48 lessons — Math + R/W |

## Features

### Spaced repetition (SM-2 + Ebbinghaus intervals)

- Review ladder: **1 → 3 → 7 → 14 → 30 → 60** days
- **Easy:** interval × 2.5
- **Hard:** interval × 1.2
- **Wrong:** reset to 1 day
- Dashboard shows retention % per module
- `/review` lists due units

### Quizzes

- Minimum **10 questions** per session
- Types: multiple choice, fill in the blank, sentence construction
- Per-question timer
- **Hard / Good / Easy** SM-2 buttons after each correct answer
- **Groq AI** “explain like I’m 5” (max 3 sentences + funny example) on every question
- **80%+ unit score** → random Spotify reward (preview or Web Playback SDK if connected)

### Study queue

- Module lists and `/review` sort **due cards first**, then **new** units

### Vision wall (`/vision`)

- Fullscreen cinematic mosaic — auto-loads every image in `public/images/vision/` (e.g. `img (1).jpg`, `img (2).jpg`, …)
- Hero copy: **“Did you forget? Do it for life.”**
- Live stats under each section: streak, units completed, SAT → 1600 progress

### Ad-lib system (critical)

1. Add MP3s under [`public/adlibs/`](public/adlibs/README.md) — e.g. `adlib (1).mp3` … `adlib (11).mp3` (auto-discovered).
2. On each correct answer: random ad-lib + screen flash.
3. On **5 correct streak**: another random ad-lib at full volume + wild color overlay.
4. On wrong answer: visual shake only (silence).

### XP & levels

Space Cadet → … → **SAT God** (see `src/lib/xp.ts`).

## Project structure

```
src/
  app/                 # Pages (dashboard, modules, review)
  components/          # UI, quiz, dashboard
  data/                # Module content + grammar generator
  hooks/               # useProgress (localStorage)
  lib/                 # SM-2, XP, adlibs, storage
public/adlibs/         # Your MP3 files go here
scripts/               # Optional JSON export for grammar units
```

## Regenerate grammar JSON (optional)

```bash
npm run generate:grammar
```

Writes `src/data/grammar/units.json`. The app loads units from `generate.ts` at runtime by default.

## Customize content

- **Grammar:** `src/data/grammar/generate.ts` (unit titles + question templates)
- **Vocabulary:** `src/data/vocabulary/index.ts`
- **SAT:** `src/data/sat/index.ts`

## License

Educational MVP — ensure textbook/audio content complies with your local copyright rules.
