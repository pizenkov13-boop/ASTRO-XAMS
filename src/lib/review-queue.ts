import type { Unit, UserProgress } from "@/types";
import { isDue } from "@/lib/sm2";

export type UnitStudyBucket = "due" | "new" | "later";

export function getUnitBucket(
  unit: Unit,
  progress: UserProgress,
  now = Date.now()
): UnitStudyBucket {
  const cards = Object.values(progress.cards).filter((c) => c.unitId === unit.id);
  if (cards.some((c) => isDue(c, now))) return "due";
  if (cards.length === 0 || cards.every((c) => c.repetitions === 0)) return "new";
  return "later";
}

/** Due cards first, then never-studied units, then the rest. */
export function sortUnitsForStudy(
  units: Unit[],
  progress: UserProgress,
  now = Date.now()
): Unit[] {
  const due: Unit[] = [];
  const fresh: Unit[] = [];
  const later: Unit[] = [];

  for (const unit of units) {
    const bucket = getUnitBucket(unit, progress, now);
    if (bucket === "due") due.push(unit);
    else if (bucket === "new") fresh.push(unit);
    else later.push(unit);
  }

  return [...due, ...fresh, ...later];
}

export function partitionUnitsForStudy(
  units: Unit[],
  progress: UserProgress,
  now = Date.now()
) {
  const sorted = sortUnitsForStudy(units, progress, now);
  const due = sorted.filter((u) => getUnitBucket(u, progress, now) === "due");
  const fresh = sorted.filter((u) => getUnitBucket(u, progress, now) === "new");
  return { sorted, due, fresh };
}
