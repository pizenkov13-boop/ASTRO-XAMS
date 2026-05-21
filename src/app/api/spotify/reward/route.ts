import { NextResponse } from "next/server";
import { fetchRandomPreviewTrack } from "@/lib/spotify-server";

export async function GET() {
  try {
    const track = await fetchRandomPreviewTrack();
    return NextResponse.json({ track });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not load Spotify reward" },
      { status: 500 }
    );
  }
}
