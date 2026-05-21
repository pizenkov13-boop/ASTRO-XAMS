export const LEVEL_TITLES = [
  { min: 0, title: "Space Cadet" },
  { min: 500, title: "Orbit Rookie" },
  { min: 1500, title: "Nebula Scout" },
  { min: 3500, title: "Cosmic Scholar" },
  { min: 7000, title: "Galaxy Ace" },
  { min: 12000, title: "Supernova" },
  { min: 20000, title: "Black Hole Brain" },
  { min: 35000, title: "Quasar King" },
  { min: 55000, title: "Universe Master" },
  { min: 80000, title: "SAT God" },
] as const;

export function getLevelFromXp(xp: number): number {
  let level = 0;
  for (let i = 0; i < LEVEL_TITLES.length; i++) {
    if (xp >= LEVEL_TITLES[i].min) level = i;
  }
  return level;
}

const LEVEL_TITLE_KEYS = [
  "level.spaceCadet",
  "level.orbitRookie",
  "level.nebulaScout",
  "level.cosmicScholar",
  "level.galaxyAce",
  "level.supernova",
  "level.blackHoleBrain",
  "level.quasarKing",
  "level.universeMaster",
  "level.satGod",
] as const;

export function getLevelTitle(
  xp: number,
  t?: (key: (typeof LEVEL_TITLE_KEYS)[number]) => string
): string {
  const level = getLevelFromXp(xp);
  if (t) return t(LEVEL_TITLE_KEYS[level]);
  return LEVEL_TITLES[level].title;
}

export function xpToNextLevel(xp: number): { current: number; next: number; progress: number } {
  const level = getLevelFromXp(xp);
  const currentMin = LEVEL_TITLES[level].min;
  const nextMin =
    level < LEVEL_TITLES.length - 1
      ? LEVEL_TITLES[level + 1].min
      : LEVEL_TITLES[level].min + 10000;
  const progress =
    nextMin === currentMin
      ? 100
      : Math.round(((xp - currentMin) / (nextMin - currentMin)) * 100);
  return { current: currentMin, next: nextMin, progress: Math.min(100, progress) };
}
