import { NextRequest, NextResponse } from "next/server";
import { exchangeAuthCode } from "@/lib/spotify-server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const redirectUri =
    process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
    `${req.nextUrl.origin}/api/spotify/callback`;

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/?spotify=error", req.nextUrl.origin)
    );
  }

  const codeVerifier = req.cookies.get("spotify_code_verifier")?.value;
  if (!codeVerifier) {
    return NextResponse.redirect(
      new URL("/?spotify=missing_verifier", req.nextUrl.origin)
    );
  }

  try {
    const tokens = await exchangeAuthCode(code, redirectUri, codeVerifier);
    const landing = new URL("/", req.nextUrl.origin);
    landing.searchParams.set("spotify", "connected");

    const res = NextResponse.redirect(landing.toString());
    res.cookies.delete("spotify_code_verifier");
    res.cookies.delete("spotify_auth_state");

    // Pass tokens to client via short-lived cookie for sessionStorage handoff
    res.cookies.set("spotify_handoff", JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60,
      path: "/",
    });

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(
      new URL("/?spotify=exchange_failed", req.nextUrl.origin)
    );
  }
}
