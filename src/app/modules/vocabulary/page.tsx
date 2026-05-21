"use client";

import Link from "next/link";
import { useMemo } from "react";
import { vocabularyUnits } from "@/data/vocabulary";
import { UnitList } from "@/components/modules/UnitList";
import { StreakBar } from "@/components/layout/StreakBar";
import { useProgress } from "@/hooks/useProgress";
import { useLocale } from "@/lib/i18n/context";
import { sortUnitsForStudy } from "@/lib/review-queue";

export default function VocabularyModulePage() {
  const { t } = useLocale();
  const { progress, hydrated, levelTitle } = useProgress();
  const sortedUnits = useMemo(
    () => sortUnitsForStudy(vocabularyUnits, progress),
    [progress]
  );

  if (!hydrated) return null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-astro-bg">
      <StreakBar
        streak={progress.streak}
        xp={progress.xp}
        levelTitle={levelTitle}
        dailyCompleted={progress.dailyCompleted}
        dailyGoal={progress.dailyGoal}
      />
      <main className="page-shell">
        <Link
          href="/"
          className="touch-target inline-flex text-base text-astro-purple hover:text-astro-orange"
        >
          {t("common.dashboard")}
        </Link>
        <h1 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
          {t("vocabulary.pageTitle")}
        </h1>
        <p className="text-base text-gray-400">
          {t("vocabulary.pageSubtitle", { count: vocabularyUnits.length })}
        </p>
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
