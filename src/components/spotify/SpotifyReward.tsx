"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { SPOTIFY_EXPIRES_KEY, SPOTIFY_TOKEN_KEY } from "@/lib/spotify-pkce";
import { useLocale } from "@/lib/i18n/context";

interface RewardTrack {
  id: string;
  name: string;
  artist: string;
  previewUrl: string | null;
  uri: string;
  imageUrl: string | null;
  externalUrl: string;
}

interface SpotifyRewardProps {
  open: boolean;
  scorePercent: number;
  onClose: () => void;
}

declare global {
  interface Window {
    Spotify?: {
      Player: new (opts: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => SpotifyPlayerInstance;
    };
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

interface SpotifyPlayerInstance {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, cb: (state: { device_id?: string }) => void) => void;
  play: (opts: { uris: string[] }) => Promise<void>;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = sessionStorage.getItem(SPOTIFY_TOKEN_KEY);
  const expires = sessionStorage.getItem(SPOTIFY_EXPIRES_KEY);
  if (!token || !expires) return null;
  if (Date.now() > Number(expires)) return null;
  return token;
}

export function SpotifyReward({ open, scorePercent, onClose }: SpotifyRewardProps) {
  const { t } = useLocale();
  const [track, setTrack] = useState<RewardTrack | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [playbackMode, setPlaybackMode] = useState<"preview" | "sdk" | null>(null);
  const playerRef = useRef<SpotifyPlayerInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playPreview = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.volume = 0.85;
    void audio.play();
    setPlaybackMode("preview");
  }, []);

  const initSdkPlayer = useCallback(async (token: string, uri: string) => {
    if (!window.Spotify) return false;
    try {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      const player = new window.Spotify.Player({
        name: "ASTRO'XAMS Reward",
        getOAuthToken: (cb) => cb(token),
        volume: 0.85,
      });
      playerRef.current = player;
      await player.connect();
      await player.play({ uris: [uri] });
      setPlaybackMode("sdk");
      return true;
    } catch {
      return false;
    }
  }, []);

  const loadAndPlay = useCallback(async () => {
    setLoading(true);
    setError(null);
    const maxRetries = 5;
    try {
      let reward: RewardTrack | null = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const res = await fetch("/api/spotify/reward");
        const data = (await res.json()) as {
          track?: RewardTrack;
          error?: string;
        };
        if (!res.ok || !data.track) throw new Error(data.error ?? "Failed");
        if (data.track.previewUrl) {
          reward = data.track;
          break;
        }
        reward = data.track;
      }

      if (!reward) throw new Error("No track returned");
      setTrack(reward);

      const userToken = getStoredToken();
      if (userToken && sdkReady) {
        const sdkOk = await initSdkPlayer(userToken, reward.uri);
        if (sdkOk) return;
      }

      if (reward.previewUrl) {
        playPreview(reward.previewUrl);
      } else {
        setError(t("spotify.noPreview"));
      }
    } catch {
      setError(t("spotify.error"));
    } finally {
      setLoading(false);
    }
  }, [initSdkPlayer, playPreview, sdkReady, t]);

  useEffect(() => {
    if (open && scorePercent >= 80) {
      void loadAndPlay();
    }
    return () => {
      audioRef.current?.pause();
      playerRef.current?.disconnect();
    };
  }, [open, scorePercent, loadAndPlay]);

  if (scorePercent < 80) return null;

  return (
    <>
      <Script
        src="https://sdk.scdn.co/spotify-player.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.onSpotifyWebPlaybackSDKReady = () => setSdkReady(true);
          if (window.Spotify) setSdkReady(true);
        }}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-md w-full rounded-2xl border border-astro-cyan/40 bg-astro-card p-6 shadow-neon-strong"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <p className="font-display text-lg text-astro-cyan">{t("spotify.rewardTitle")}</p>
              <p className="mt-1 text-sm text-gray-400">
                {t("spotify.rewardBody", { percent: scorePercent })}
              </p>

              {loading && (
                <p className="mt-4 text-sm text-gray-500">{t("spotify.loading")}</p>
              )}

              {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

              {track && !loading && (
                <div className="mt-4 flex gap-4 items-center">
                  {track.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={track.imageUrl}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-white">{track.name}</p>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                    {playbackMode === "sdk" && (
                      <p className="text-xs text-astro-orange mt-1">{t("spotify.sdk")}</p>
                    )}
                    {playbackMode === "preview" && (
                      <p className="text-xs text-astro-purple mt-1">{t("spotify.preview")}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href="/api/spotify/login"
                  className="text-xs text-astro-purple underline"
                >
                  {t("spotify.connect")}
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-auto rounded-lg bg-astro-orange px-4 py-2 text-sm font-semibold text-white"
                >
                  {t("spotify.continue")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
