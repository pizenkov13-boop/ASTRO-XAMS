const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|svg)$/i;

/** Extract number from "img (12).jpg" for natural ordering */
export function visionImageOrder(filename: string): number {
  const match = filename.match(/img\s*\(\s*(\d+)\s*\)/i);
  if (match) return parseInt(match[1], 10);
  const anyNum = filename.match(/(\d+)/);
  return anyNum ? parseInt(anyNum[1], 10) : Number.MAX_SAFE_INTEGER;
}

export function isVisionImageFile(filename: string): boolean {
  return IMAGE_EXT.test(filename) && !filename.startsWith(".");
}

export function sortVisionImageFiles(files: string[]): string[] {
  return [...files].sort((a, b) => {
    const orderA = visionImageOrder(a);
    const orderB = visionImageOrder(b);
    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b, undefined, { numeric: true });
  });
}

export function visionImageUrl(filename: string): string {
  return `/images/vision/${encodeURIComponent(filename)}`;
}

/** Mosaic tile sizes — 2 cols mobile, 4 cols md+ */
export const MOSAIC_SPAN_PATTERNS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
];

export function mosaicClassForIndex(index: number): string {
  return MOSAIC_SPAN_PATTERNS[index % MOSAIC_SPAN_PATTERNS.length];
}
