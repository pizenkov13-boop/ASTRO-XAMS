"use client";

import { useEffect } from "react";
import {
  SPOTIFY_EXPIRES_KEY,
  SPOTIFY_REFRESH_KEY,
  SPOTIFY_TOKEN_KEY,
} from "@/lib/spotify-pkce";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

/** Moves Spotify OAuth tokens from callback cookie into sessionStorage for Web Playback SDK. */
export function SpotifyTokenHandoff() {
  useEffect(() => {
    const raw = getCookie("spotify_handoff");
    if (!raw) return;

    try {
      const data = JSON.parse(raw) as {
        access_token: string;
        refresh_token?: string;
        expires_in: number;
      };
      sessionStorage.setItem(SPOTIFY_TOKEN_KEY, data.access_token);
      if (data.refresh_token) {
        sessionStorage.setItem(SPOTIFY_REFRESH_KEY, data.refresh_token);
      }
      sessionStorage.setItem(
        SPOTIFY_EXPIRES_KEY,
        String(Date.now() + data.expires_in * 1000)
      );
    } catch {
      /* ignore */
    }
    clearCookie("spotify_handoff");
  }, []);

  return null;
}
