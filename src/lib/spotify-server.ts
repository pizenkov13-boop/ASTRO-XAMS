const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getClientCredentialsToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials not configured");
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("Spotify token request failed");

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.token;
}

export interface SpotifyRewardTrack {
  id: string;
  name: string;
  artist: string;
  previewUrl: string | null;
  uri: string;
  imageUrl: string | null;
  externalUrl: string;
}

const REWARD_ARTISTS = ["Travis Scott", "Playboi Carti"] as const;

const MAX_PREVIEW_RETRIES = 5;

function toRewardTrack(track: {
  id: string;
  name: string;
  uri: string;
  preview_url: string | null;
  external_urls?: { spotify?: string };
  album?: { images?: { url: string }[] };
  artists?: { name: string }[];
}): SpotifyRewardTrack {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists?.map((a) => a.name).join(", ") ?? "Unknown",
    previewUrl: track.preview_url,
    uri: track.uri,
    imageUrl: track.album?.images?.[0]?.url ?? null,
    externalUrl: track.external_urls?.spotify ?? "https://open.spotify.com",
  };
}

async function searchArtistTracks(
  token: string,
  artist: (typeof REWARD_ARTISTS)[number],
  offset: number
) {
  const url = new URL(`${API_BASE}/search`);
  url.searchParams.set("q", `artist:${artist}`);
  url.searchParams.set("type", "track");
  url.searchParams.set("limit", "50");
  url.searchParams.set("offset", String(offset));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Spotify search failed");

  const data = (await res.json()) as {
    tracks?: {
      items?: Array<{
        id: string;
        name: string;
        uri: string;
        preview_url: string | null;
        external_urls?: { spotify?: string };
        album?: { images?: { url: string }[] };
        artists?: { name: string }[];
      }>;
    };
  };

  return data.tracks?.items ?? [];
}

export async function fetchRandomPreviewTrack(): Promise<SpotifyRewardTrack> {
  const token = await getClientCredentialsToken();

  for (let attempt = 0; attempt < MAX_PREVIEW_RETRIES; attempt++) {
    const artist =
      REWARD_ARTISTS[Math.floor(Math.random() * REWARD_ARTISTS.length)];
    const offset = Math.floor(Math.random() * 25) + attempt * 3;
    const items = await searchArtistTracks(token, artist, offset % 50);

    const withPreview = items.filter((t) => t.preview_url);
    const byArtist = withPreview.filter((t) => {
      const names = (t.artists ?? []).map((a) => a.name.toLowerCase()).join(" ");
      return names.includes("travis scott") || names.includes("playboi carti");
    });
    const pool = byArtist.length > 0 ? byArtist : withPreview;
    if (pool.length === 0) continue;

    const track = pool[Math.floor(Math.random() * pool.length)];
    if (track.preview_url) return toRewardTrack(track);
  }

  throw new Error("No preview tracks found after 5 attempts");
}

export async function exchangeAuthCode(
  code: string,
  redirectUri: string,
  codeVerifier: string
) {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: body.toString(),
  });

  if (!res.ok) throw new Error("Token exchange failed");
  return res.json() as Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  }>;
}
