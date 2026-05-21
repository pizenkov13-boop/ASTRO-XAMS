import { readdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import {
  adlibDisplayName,
  adlibUrl,
  isAdlibAudioFile,
  sortAdlibFiles,
} from "@/lib/adlib-files";

export const dynamic = "force-dynamic";

export async function GET() {
  const dir = join(process.cwd(), "public", "adlibs");

  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter(isAdlibAudioFile);

    const sorted = sortAdlibFiles(files);

    const tracks = sorted.map((filename, index) => ({
      id: `adlib-${index}-${filename}`,
      name: adlibDisplayName(filename),
      artist: "",
      file: adlibUrl(filename),
      filename,
    }));

    return NextResponse.json({ tracks, count: tracks.length });
  } catch (err) {
    console.error("Adlibs scan failed:", err);
    return NextResponse.json({ tracks: [], count: 0 });
  }
}
