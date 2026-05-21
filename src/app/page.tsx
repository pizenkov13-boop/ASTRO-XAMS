"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Starfield } from "@/components/dashboard/Starfield";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { GalaxyProgress } from "@/components/dashboard/GalaxyProgress";
import { StreakBar } from "@/components/layout/StreakBar";
import { MODULES } from "@/data/modules";
import { grammarUnits } from "@/data/grammar";
import { vocabularyUnits } from "@/data/vocabulary";
import { satUnits } from "@/data/sat";
import { useProgress } from "@/hooks/useProgress";
import { xpToNextLevel } from "@/lib/xp";

const UNIT_COUNTS = {
  grammar: grammarUnits.length,
  vocabulary: vocabularyUnits.length,
  sat: satUnits.length,
};

export default function DashboardPage() {
  const { progress, hydrated, levelTitle } = useProgress();
  const xpInfo = xpToNextLevel(progress.xp);

  const moduleStats = MODULES.map((m) => {
    const completed = progress.completedUnits.filter((id) =>
      id.startsWith(m.id === "grammar" ? "grammar" : m.id === "vocabulary" ? "vocab" : "sat")
    ).length;
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

      <main className="relative mx-auto max-w-6xl px-4 py-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-astro-orange via-astro-purple to-astro-cyan bg-clip-text text-transparent">
              Launch Your Learning Orbit
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Three modules. SM-2 spaced repetition. 10+ questions per session.
            Random ad-libs on every correct answer.
          </p>
          <div className="mt-6 inline-flex flex-wrap justify-center gap-3">
            <span className="rounded-lg border border-astro-purple/40 bg-astro-card px-4 py-2 text-sm">
              🛸 {levelTitle}
            </span>
            <span className="rounded-lg border border-astro-orange/40 bg-astro-card px-4 py-2 text-sm">
              Next level: {xpInfo.progress}%
            </span>
          </div>
        </motion.section>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {moduleStats.map(({ module, retention }) => (
            <GalaxyProgress
              key={module.id}
              label={module.title}
              percent={retention}
              completed={
                progress.completedUnits.filter((u) =>
                  u.startsWith(
                    module.id === "grammar"
                      ? "grammar"
                      : module.id === "vocabulary"
                        ? "vocab"
                        : "sat"
                  )
                ).length
              }
              total={UNIT_COUNTS[module.id]}
            />
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          className="mt-12 rounded-2xl border border-astro-cyan/20 bg-astro-card/60 p-6"
        >
          <h3 className="font-display text-lg font-semibold text-astro-cyan">
            Quick launch
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Jump into due reviews or start the next unit
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/modules/grammar"
              className="rounded-lg bg-gradient-to-r from-astro-orange to-astro-purple px-4 py-2 text-sm font-semibold text-white shadow-neon hover:opacity-90"
            >
              Grammar galaxy →
            </Link>
            <Link
              href="/vision"
              className="rounded-lg border border-astro-orange/50 px-4 py-2 text-sm text-astro-orange hover:bg-astro-orange/10"
            >
              Vision wall
            </Link>
            <Link
              href="/settings"
              className="rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-400 hover:bg-astro-surface"
            >
              Notifications
            </Link>
            <Link
              href="/review"
              className="rounded-lg border border-astro-purple/50 px-4 py-2 text-sm text-astro-purple hover:bg-astro-purple/10"
            >
              Due reviews
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
