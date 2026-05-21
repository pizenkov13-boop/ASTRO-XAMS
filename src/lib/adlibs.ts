"use client";

import { Howl } from "howler";
import type { AdlibTrack } from "@/types";

const FALLBACK_TRACK: AdlibTrack = {
  id: "fallback",
  name: "ADLIB",
  artist: "",
  file: "",
};

let catalog: AdlibTrack[] = [];
const sounds = new Map<string, Howl>();
let loadPromise: Promise<void> | null = null;

async function fetchCatalog(): Promise<AdlibTrack[]> {
  const res = await fetch("/api/adlibs", { cache: "no-store" });
  const data = (await res.json()) as { tracks?: AdlibTrack[] };
  return data.tracks ?? [];
}

function buildHowl(track: AdlibTrack, volume = 0.85): Howl {
  return new Howl({
    src: [track.file],
    volume,
    html5: true,
  });
}

/** Preload all adlibs from public/adlibs/ (call once on app/quiz mount). */
export async function preloadAdlibs(): Promise<number> {
  if (catalog.length > 0) return catalog.length;
  if (loadPromise) {
    await loadPromise;
    return catalog.length;
  }

  loadPromise = (async () => {
    const tracks = await fetchCatalog();
    catalog = tracks;
    sounds.clear();
    for (const track of tracks) {
      sounds.set(track.id, buildHowl(track));
    }
  })();

  await loadPromise;
  return catalog.length;
}

function pickRandom(excludeId?: string): AdlibTrack | null {
  if (catalog.length === 0) return null;
  const pool =
    excludeId && catalog.length > 1
      ? catalog.filter((t) => t.id !== excludeId)
      : catalog;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Play a random clip from public/adlibs/. Returns track metadata for UI. */
export async function playRandomAdlib(): Promise<AdlibTrack> {
  await preloadAdlibs();
  const track = pickRandom();
  if (!track) return FALLBACK_TRACK;

  sounds.get(track.id)?.play();
  return track;
}

/** Streak celebration — another random clip, louder. */
export async function playCelebration(): Promise<void> {
  await preloadAdlibs();
  const track = pickRandom();
  if (!track) return;

  let howl = sounds.get(track.id);
  if (!howl) {
    howl = buildHowl(track, 1);
    sounds.set(track.id, howl);
  }
  howl.volume(1);
  howl.play();
}

export function getAdlibCatalog(): AdlibTrack[] {
  return catalog;
}
