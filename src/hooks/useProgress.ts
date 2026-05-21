"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserProgress } from "@/types";
import {
  defaultProgress,
  loadProgress,
  saveProgress,
  updateDailyStreak,
} from "@/lib/storage";
import { XP_PER_CORRECT, XP_PER_UNIT_COMPLETE } from "@/types";
import { getLevelTitle } from "@/lib/xp";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveProgress(progress);
  }, [progress, hydrated]);

  const addXp = useCallback((amount: number) => {
    setProgress((p) => {
      const updated = updateDailyStreak({
        ...p,
        xp: p.xp + amount,
        dailyCompleted: p.dailyCompleted + 1,
      });
      return updated;
    });
  }, []);

  const onCorrectAnswer = useCallback(() => {
    addXp(XP_PER_CORRECT);
  }, [addXp]);

  const onUnitComplete = useCallback((unitId: string) => {
    setProgress((p) => {
      if (p.completedUnits.includes(unitId)) return p;
      return updateDailyStreak({
        ...p,
        xp: p.xp + XP_PER_UNIT_COMPLETE,
        dailyCompleted: p.dailyCompleted + 1,
        completedUnits: [...p.completedUnits, unitId],
      });
    });
  }, []);

  const setDailyGoal = useCallback((goal: number) => {
    setProgress((p) => ({ ...p, dailyGoal: goal }));
  }, []);

  return {
    progress,
    setProgress,
    hydrated,
    addXp,
    onCorrectAnswer,
    onUnitComplete,
    setDailyGoal,
    levelTitle: getLevelTitle(progress.xp),
  };
}
