const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|aac|flac)$/i;

export function adlibOrder(filename: string): number {
  const match = filename.match(/adlib\s*\(\s*(\d+)\s*\)/i);
  if (match) return parseInt(match[1], 10);
  const anyNum = filename.match(/(\d+)/);
  return anyNum ? parseInt(anyNum[1], 10) : Number.MAX_SAFE_INTEGER;
}

export function isAdlibAudioFile(filename: string): boolean {
  return AUDIO_EXT.test(filename) && !filename.startsWith(".");
}

export function sortAdlibFiles(files: string[]): string[] {
  return [...files].sort((a, b) => {
    const orderA = adlibOrder(a);
    const orderB = adlibOrder(b);
    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b, undefined, { numeric: true });
  });
}

export function adlibUrl(filename: string): string {
  return `/adlibs/${encodeURIComponent(filename)}`;
}

export function adlibDisplayName(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  const num = base.match(/adlib\s*\(\s*(\d+)\s*\)/i);
  if (num) return `ADLIB ${num[1]}`;
  return base.toUpperCase();
}
