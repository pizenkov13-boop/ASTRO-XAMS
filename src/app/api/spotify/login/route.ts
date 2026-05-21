import { NextRequest, NextResponse } from "next/server";
import { createPkcePair } from "@/lib/spotify-pkce";

const SCOPES = "streaming user-read-email user-read-private";

export async function GET(req: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri =
    process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
    `${req.nextUrl.origin}/api/spotify/callback`;

  if (!clientId) {
    return NextResponse.json({ error: "Spotify client ID missing" }, { status: 500 });
  }

  const { codeVerifier, codeChallenge } = await createPkcePair();
  const state = crypto.randomUUID();

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(authUrl.toString());
  res.cookies.set("spotify_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  res.cookies.set("spotify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return res;
}
