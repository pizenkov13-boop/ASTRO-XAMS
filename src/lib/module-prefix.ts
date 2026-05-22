import type { ModuleId } from "@/types";

/** Prefix used in completedUnits ids per module. */
export function completedUnitPrefix(moduleId: ModuleId): string {
  switch (moduleId) {
    case "grammar":
      return "grammar";
    case "vocabulary":
      return "vocab";
    case "sat":
      return "sat";
    case "oge":
      return "oge";
  }
}

export function countCompletedForModule(
  completedUnits: string[],
  moduleId: ModuleId
): number {
  const prefix = completedUnitPrefix(moduleId);
  return completedUnits.filter((id) => id.startsWith(prefix)).length;
}
