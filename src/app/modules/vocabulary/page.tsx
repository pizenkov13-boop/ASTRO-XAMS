"use client";

import Link from "next/link";
import { useMemo } from "react";
import { vocabularyUnits } from "@/data/vocabulary";
import { UnitList } from "@/components/modules/UnitList";
import { StreakBar } from "@/components/layout/StreakBar";
import { useProgress } from "@/hooks/useProgress";
import { sortUnitsForStudy } from "@/lib/review-queue";

export default function VocabularyModulePage() {
  const { progress, hydrated, levelTitle } = useProgress();
  const sortedUnits = useMemo(
    () => sortUnitsForStudy(vocabularyUnits, progress),
    [progress]
  );

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-astro-bg">
      <StreakBar
        streak={progress.streak}
        xp={progress.xp}
        levelTitle={levelTitle}
        dailyCompleted={progress.dailyCompleted}
        dailyGoal={progress.dailyGoal}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link href="/" className="text-sm text-astro-purple hover:text-astro-orange">
          ← Dashboard
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold text-white">
          4000 Essential English Words — Book 1
        </h1>
        <p className="text-gray-400">{vocabularyUnits.length} units · Due first, then new</p>
        <UnitList
          units={sortedUnits}
          basePath="/modules/vocabulary"
          completedIds={progress.completedUnits}
          progress={progress}
        />
      </main>
    </div>
  );
}
