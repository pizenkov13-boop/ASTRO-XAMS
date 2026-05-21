```
     _        ____ _____  ____   __   __    _    ____  __  __ 
    / \      / ___|_   _|/ ___|  \ \ / /   / \  / ___||  \/  |
   / _ \     \___ \ | |  \___ \   \ V /   / _ \ \___ \| |\/| |
  / ___ \     ___) || |   ___) |   | |   / ___ \ ___) | |  | |
 /_/   \_\   |____/ |_|  |____/    |_|  /_/   \_\____/|_|  |_|

  █████╗ ███████╗████████╗██████╗  ██████╗   ██╗  ██╗ █████╗ ███╗   ███╗███████╗
 ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗  ╚██╗██╔╝██╔══██╗████╗ ████║██╔════╝
 ███████║███████╗   ██║   ██████╔╝██║   ██║   ╚███╔╝ ███████║██╔████╔██║███████╗
 ██╔══██║╚════██║   ██║   ██╔══██╗██║   ██║   ██╔██╗ ██╔══██║██║╚██╔╝██║╚════██║
 ██║  ██║███████║   ██║   ██║  ██║╚██████╔╝  ██╔╝ ██╗██║  ██║██║ ╚═╝ ██║███████║
 ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
```

<h1 align="center">ASTRO'XAMS</h1>

<p align="center">
  <strong>AI-powered English learning app with spaced repetition, Travis Scott ad-libs, and Spotify rewards</strong>
</p>

<p align="center">
  <em>"Do it for life."</em> — Travis Scott
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#screenshots">Screenshots</a> ·
  <a href="#about">About</a>
</p>

---

## Overview

**ASTRO'XAMS** is a space-themed learning platform built for serious English mastery — grammar, high-frequency vocabulary, and SAT prep in one orbit. Progress is driven by the **SM-2 spaced repetition** algorithm, timed quizzes, XP levels, and rewards that actually feel good when you score 80%+ on a unit.

Study hard. Stack streaks. Unlock the vision board. *Do it for life.*

---

## Features

| Module | What's inside |
|--------|----------------|
| **Grammar** | **115 units** — *Essential Grammar in Use* (A1–B1), 10+ questions per session |
| **Vocabulary** | **4000 Essential English Words** — Book 1, all 30 chapters with real word lists |
| **SAT Prep** | Math (Algebra, Advanced Math, Geometry, Statistics) + Reading & Writing — zero → 1600 trajectory |

### Learning engine

- **SM-2 spaced repetition** — review intervals 1 → 3 → 7 → 14 → 30 → 60 days; Easy ×2.5, Hard ×1.2, wrong resets to 1 day
- **Due-first study queue** — `/review` and module lists prioritize cards that need repetition
- **Timed quizzes** — multiple choice, fill-in-the-blank, sentence construction
- **Hard / Good / Easy** rating after every correct answer

### AI & rewards

- **Groq AI tutor** (`llama-3.3-70b`) — ELI5 explanations after wrong answers, with a memory trick (RU/EN UI)
- **Spotify rewards** — score ≥80% on a unit → random **Travis Scott** or **Playboi Carti** preview track
- **Travis Scott ad-libs** — random clips from `public/adlibs/` on every correct answer; celebration burst at 5-streak

### Vision board

- Fullscreen **Vision** mosaic at `/vision` — cinematic grid, lightbox with swipe navigation
- Hero: *"Did you forget? Do it for life."*
- Live stats: streak, grammar progress, SAT trajectory, words learned

### More

- **RU / EN** language toggle (UI + localized AI explanations; quiz content stays in English)
- **Browser notifications** + service worker for due-card and daily reminders
- **Mobile-first** — hamburger nav, 60px quiz targets, 2-column vision grid on phones

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **AI** | [Groq API](https://groq.com/) — `llama-3.3-70b-versatile` |
| **Music** | [Spotify Web API](https://developer.spotify.com/) — previews + optional Web Playback SDK |
| **Audio** | [Howler.js](https://howlerjs.com/) — ad-lib playback |
| **Storage** | `localStorage` — progress, SM-2 cards, XP, locale |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Environment

Copy `.env.example` to `.env.local`:

```env
GROQ_API_KEY=your_groq_key
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
```

Add the redirect URI in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Tip:** If your folder path contains an apostrophe (`ASTRO'XAMS`), run commands from that directory in your terminal, or map a drive: `subst X: "c:\ASTRO'XAMS"` then `cd X:\`.

### Build

```bash
npm run build
npm start
```

### Optional assets

| Folder | Purpose |
|--------|---------|
| `public/adlibs/` | MP3 ad-libs — e.g. `adlib (1).mp3` … (auto-discovered) |
| `public/images/vision/` | Vision board photos — e.g. `img (1).jpg` … (no labels on tiles) |

---

## Screenshots

> Placeholder — add your own captures after running the app.

| Dashboard | Quiz | Vision |
|:---------:|:----:|:------:|
| ![Dashboard placeholder](https://via.placeholder.com/400x240/0a0a12/a855f7?text=Dashboard) | ![Quiz placeholder](https://via.placeholder.com/400x240/0a0a12/ff6b2c?text=Quiz+Session) | ![Vision placeholder](https://via.placeholder.com/400x240/0a0a12/22d3ee?text=Vision+Board) |

| Review queue | Spotify reward | Settings |
|:------------:|:--------------:|:--------:|
| ![Review placeholder](https://via.placeholder.com/400x240/0a0a12/a855f7?text=Study+Queue) | ![Spotify placeholder](https://via.placeholder.com/400x240/0a0a12/ff6b2c?text=Spotify+Reward) | ![Settings placeholder](https://via.placeholder.com/400x240/0a0a12/22d3ee?text=Settings) |

Replace placeholders with real screenshots in `docs/screenshots/` when ready.

---

## Project Structure

```
src/
├── app/              # Pages & API routes (explain, spotify, vision)
├── components/       # UI, quiz, dashboard, vision, layout
├── data/             # Grammar, vocabulary, SAT content
├── hooks/            # useProgress, useLocalizedModules
├── lib/              # SM-2, XP, i18n, notifications, Spotify
public/
├── adlibs/           # Reward sound clips
└── images/vision/    # Vision board images
```

---

## About

Built by a student aiming for **Stanford**, **USC**, **UCLA**, **Berkeley**, **Duke**, and **UMiami** — turning daily English practice into something you actually want to open.

The name says it all: study like the stakes are orbital, because they are.

<p align="center">
  <strong>Did you forget?</strong><br />
  <strong>Do it for life.</strong><br />
  <em>— Travis Scott</em>
</p>

---

## License

Educational project. Ensure textbook excerpts, audio, and third-party APIs comply with your local copyright and terms of service.
