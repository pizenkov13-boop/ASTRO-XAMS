"use client";

import Link from "next/link";
import { StreakBar } from "@/components/layout/StreakBar";
import { ExamCountdowns } from "@/components/stats/ExamCountdowns";
import { ModuleRetentionStats } from "@/components/stats/ModuleRetentionStats";
import { StudyHeatmap } from "@/components/stats/StudyHeatmap";
import { WeeklyQuestionsChart } from "@/components/stats/WeeklyQuestionsChart";
import { useProgress } from "@/hooks/useProgress";
import { useLocale } from "@/lib/i18n/context";

export default function StatsPage() {
  const { t } = useLocale();
  const { progress, hydrated, levelTitle } = useProgress();

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
      <main className="page-shell-narrow max-w-4xl">
        <Link
          href="/"
          className="touch-target inline-flex items-center text-base text-astro-purple hover:text-astro-orange"
        >
          {t("common.dashboard")}
        </Link>
        <h1 className="mt-4 font-display text-2xl text-white sm:text-3xl">
          {t("stats.title")}
        </h1>
        <p className="mt-2 text-base text-gray-500">{t("stats.subtitle")}</p>

        <div className="mt-8 space-y-6">
          <ExamCountdowns />
          <StudyHeatmap />
          <WeeklyQuestionsChart />
          <ModuleRetentionStats progress={progress} />
        </div>
      </main>
    </div>
  );
}
