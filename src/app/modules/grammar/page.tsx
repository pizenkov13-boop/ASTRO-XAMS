"use client";

import Link from "next/link";
import { grammarUnits } from "@/data/grammar";
import { UnitList } from "@/components/modules/UnitList";
import { StreakBar } from "@/components/layout/StreakBar";
import { useProgress } from "@/hooks/useProgress";
import { useLocale } from "@/lib/i18n/context";
import { sortUnitsForStudy } from "@/lib/review-queue";
import { useMemo } from "react";

export default function GrammarModulePage() {
  const { t } = useLocale();
  const { progress, hydrated, levelTitle } = useProgress();

  const sortedUnits = useMemo(
    () => sortUnitsForStudy(grammarUnits, progress),
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
          {t("common.dashboard")}
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold text-white">
          {t("grammar.pageTitle")}
        </h1>
        <p className="text-gray-400">
          {t("grammar.pageSubtitle", { count: grammarUnits.length })}
        </p>
        <UnitList
          units={sortedUnits}
          basePath="/modules/grammar"
          completedIds={progress.completedUnits}
          progress={progress}
        />
      </main>
    </div>
  );
}
