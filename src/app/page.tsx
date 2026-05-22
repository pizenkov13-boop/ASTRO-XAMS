"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Starfield } from "@/components/dashboard/Starfield";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { GalaxyProgress } from "@/components/dashboard/GalaxyProgress";
import { StreakBar } from "@/components/layout/StreakBar";
import { useLocalizedModules } from "@/hooks/useLocalizedModules";
import { useLocale } from "@/lib/i18n/context";
import { grammarUnits } from "@/data/grammar";
import { vocabularyUnits } from "@/data/vocabulary";
import { satUnits } from "@/data/sat";
import { ogeUnits } from "@/data/oge";
import { useStudyTimer } from "@/contexts/StudyTimerContext";
import { useProgress } from "@/hooks/useProgress";
import { countCompletedForModule } from "@/lib/module-prefix";
import { xpToNextLevel } from "@/lib/xp";

const UNIT_COUNTS = {
  grammar: grammarUnits.length,
  vocabulary: vocabularyUnits.length,
  sat: satUnits.length,
  oge: ogeUnits.length,
};

export default function DashboardPage() {
  const { t } = useLocale();
  const modules = useLocalizedModules();
  const { progress, hydrated, levelTitle } = useProgress();
  const { weeklyFormatted } = useStudyTimer();
  const xpInfo = xpToNextLevel(progress.xp);

  const moduleStats = modules.map((m) => {
    const completed = countCompletedForModule(progress.completedUnits, m.id);
    const topic = progress.topicProgress[m.id];
    return {
      module: m,
      completed,
      retention: topic?.retentionPercent ?? 0,
      total: UNIT_COUNTS[m.id],
    };
  });

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-astro-bg">
        <motion.div
          className="h-12 w-12 rounded-full border-2 border-astro-orange border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-astro-bg">
      <Starfield />
      <StreakBar
        streak={progress.streak}
        xp={progress.xp}
        levelTitle={levelTitle}
        dailyCompleted={progress.dailyCompleted}
        dailyGoal={progress.dailyGoal}
      />

      <main className="page-shell relative py-8 sm:py-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-astro-orange via-astro-purple to-astro-cyan bg-clip-text text-transparent">
              {t("dashboard.hero")}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-400">{t("dashboard.subtitle")}</p>
          <div className="mt-6 flex w-full max-w-md flex-col gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
            <span className="rounded-xl border border-astro-purple/40 bg-astro-card px-4 py-3 text-base">
              🛸 {levelTitle}
            </span>
            <span className="rounded-xl border border-astro-orange/40 bg-astro-card px-4 py-3 text-base">
              {t("dashboard.nextLevel", { percent: xpInfo.progress })}
            </span>
            <span className="rounded-xl border border-astro-cyan/40 bg-astro-card px-4 py-3 text-base font-mono">
              {t("dashboard.weeklyStudy", { time: weeklyFormatted })}
            </span>
          </div>
        </motion.section>

        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {moduleStats.map(({ module, retention }) => (
            <GalaxyProgress
              key={module.id}
              label={module.title}
              percent={retention}
              completed={countCompletedForModule(progress.completedUnits, module.id)}
              total={UNIT_COUNTS[module.id]}
            />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {moduleStats.map(({ module, completed, retention }, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              completedUnits={completed}
              retentionPercent={retention}
              index={index}
            />
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 rounded-2xl border border-astro-cyan/20 bg-astro-card/60 p-4 sm:p-6"
        >
          <h3 className="font-display text-lg font-semibold text-astro-cyan">
            {t("dashboard.quickLaunch")}
          </h3>
          <p className="mt-1 text-base text-gray-500">{t("dashboard.quickLaunchHint")}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/modules/grammar"
              className="touch-target-lg flex items-center justify-center rounded-xl bg-gradient-to-r from-astro-orange to-astro-purple px-4 text-base font-semibold text-white shadow-neon hover:opacity-90"
            >
              {t("dashboard.grammarGalaxy")}
            </Link>
            <Link
              href="/modules/oge"
              className="touch-target-lg flex items-center justify-center rounded-xl border border-green-500/50 bg-green-500/10 px-4 text-base font-semibold text-green-400 hover:bg-green-500/20"
            >
              {t("dashboard.ogeMath")} →
            </Link>
            <Link
              href="/vision"
              className="touch-target-lg flex items-center justify-center rounded-xl border border-astro-orange/50 px-4 text-base text-astro-orange hover:bg-astro-orange/10"
            >
              {t("dashboard.visionWall")}
            </Link>
            <Link
              href="/settings"
              className="touch-target-lg flex items-center justify-center rounded-xl border border-gray-600 px-4 text-base text-gray-400 hover:bg-astro-surface"
            >
              {t("dashboard.notifications")}
            </Link>
            <Link
              href="/review"
              className="touch-target-lg flex items-center justify-center rounded-xl border border-astro-purple/50 px-4 text-base text-astro-purple hover:bg-astro-purple/10"
            >
              {t("dashboard.dueReviews")}
            </Link>
            <Link
              href="/stats"
              className="touch-target-lg flex items-center justify-center rounded-xl border border-astro-cyan/50 px-4 text-base text-astro-cyan hover:bg-astro-cyan/10"
            >
              {t("nav.stats")} →
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
