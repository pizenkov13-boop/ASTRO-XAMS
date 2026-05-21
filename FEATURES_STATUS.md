# ASTRO'XAMS — Feature audit

Last updated from codebase review.

## Legend

| Status | Meaning |
|--------|---------|
| ✅ | Implemented and wired |
| 🟡 | Partially implemented |
| ❌ | Not implemented |

---

## 1. Content

| Requirement | Status | Notes |
|-------------|--------|-------|
| Essential Grammar 4th ed. — **115 units × 10 questions** | ✅ | `src/data/grammar/generate.ts` — all unit titles, 10 Q each |
| Question quality (book-faithful) | ✅ | `src/data/grammar/unit-questions.ts` — topic banks, 10 Cambridge-style Q per unit |
| 4000 Essential Words **Book 1 — 30 chapters** | ✅ | 30 units × 20 official target words × 10 Q — `src/data/vocabulary/words.ts` |
| SAT Math: Algebra | ✅ | 8 lessons, dedicated questions |
| SAT Math: Advanced Math | ✅ | 8 lessons |
| SAT Math: **Geometry** | ✅ | 8 lessons (added) |
| SAT Math: Statistics | ✅ | 8 lessons (`math-statistics`) |
| SAT Reading & Writing | ✅ | 8 + 8 lessons |
| Zero → **1600** framing | ✅ | Descriptions + score trajectory in stats |

**Total lessons:** 115 grammar + 30 vocab + 48 SAT = **193 units**

---

## 2. Spaced repetition (SM-2 + Ebbinghaus)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Intervals 1→3→7→14→30→60 days | ✅ | `REVIEW_INTERVALS` + `reviewCard()` |
| Easy ×2.5, Hard ×1.2, Wrong → 1 day | ✅ | `src/lib/sm2.ts` |
| **Due cards first** in study lists | ✅ | `sortUnitsForStudy()` on modules + `/review` |
| **Due cards first in quiz** | ✅ | `sortQuestionsForSession()` |
| Hard / Good / Easy after correct | ✅ | `RatingButtons` in `QuizSession` |
| Wrong → immediate reset | ✅ | Auto `wrong` on incorrect |

---

## 3. Notifications

| Requirement | Status | Notes |
|-------------|--------|-------|
| Browser notifications when cards due | ✅ | `NotificationScheduler` — every 60s, max 1 / 4h |
| Daily reminder at user-set time | ✅ | `Settings` → time picker (`HH:mm`) |
| Permission + enable flow | ✅ | `/settings` |
| **Service worker** (background when tab closed) | ✅ | `public/sw.js` + `ServiceWorkerBootstrap`; syncs progress/settings via cache; periodic sync where supported |

---

## 4. Groq AI tutor

| Requirement | Status | Notes |
|-------------|--------|-------|
| **Explain button** after wrong answer | ✅ | Not auto-fetched on correct |
| Model `llama-3.3-70b-versatile` | ✅ | `/api/explain` |
| ELI5 + funny example + max 3 sentences | ✅ | System prompt |
| **1 trick to never forget** | ✅ | Prompt asks for `Trick:` line |
| `GROQ_API_KEY` from `.env.local` | ✅ | Server-only |

---

## 5. Spotify reward

| Requirement | Status | Notes |
|-------------|--------|-------|
| After unit complete **≥80%** | ✅ | `UnitQuizShell` + `SpotifyReward` |
| **30s preview** | ✅ | Spotify `preview_url` (~30s) |
| Random **Travis Scott / Playboi Carti** | ✅ | `artist:Travis Scott` / `Playboi Carti` search |
| **Retry if no preview** (max 5) | ✅ | Server `fetchRandomPreviewTrack` + client `SpotifyReward` loop |
| `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` | ✅ | + `SPOTIFY_CLIENT_SECRET` for token |

---

## 6. Also built (bonus)

- Vision wall (`/vision`) — dynamic images + stats  
- Adlibs — dynamic `public/adlibs/`  
- XP, streak, daily goal, localStorage progress  
- Dashboard + HOME / VISION / REVIEW / SETTINGS nav  

---

## Optional next upgrades

1. Replace grammar templates with per-unit authored questions (1150 items).  
2. Import full 4000 Book 1 word lists for units 3–30 (currently generated bank).  
3. Service Worker for notifications when the tab is fully closed.  
4. Spotify: fallback message if no `preview_url` on artist tracks.
