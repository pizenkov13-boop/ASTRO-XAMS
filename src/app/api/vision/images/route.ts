import { readdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import {
  isVisionImageFile,
  sortVisionImageFiles,
  visionImageUrl,
  labelFromFilename,
} from "@/lib/vision-images";

export const dynamic = "force-dynamic";

export async function GET() {
  const dir = join(process.cwd(), "public", "images", "vision");

  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter(isVisionImageFile);

    const sorted = sortVisionImageFiles(files);

    const images = sorted.map((filename, index) => ({
      id: `vision-${index}-${filename}`,
      filename,
      url: visionImageUrl(filename),
      label: labelFromFilename(filename),
    }));

    return NextResponse.json({ images, count: images.length });
  } catch (err) {
    console.error("Vision images scan failed:", err);
    return NextResponse.json({ images: [], count: 0 });
  }
}
