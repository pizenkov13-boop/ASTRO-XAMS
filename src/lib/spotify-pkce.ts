function randomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => chars[v % chars.length]).join("");
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createPkcePair(): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> {
  const codeVerifier = randomString(64);
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const codeChallenge = base64UrlEncode(digest);
  return { codeVerifier, codeChallenge };
}

export const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
].join(" ");

export const SPOTIFY_TOKEN_KEY = "astro-spotify-token";
export const SPOTIFY_REFRESH_KEY = "astro-spotify-refresh";
export const SPOTIFY_EXPIRES_KEY = "astro-spotify-expires";
