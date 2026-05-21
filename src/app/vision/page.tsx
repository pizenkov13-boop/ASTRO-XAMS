"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { StreakBar } from "@/components/layout/StreakBar";
import { VisionMosaic } from "@/components/vision/VisionMosaic";
import { VisionHeroStats } from "@/components/vision/VisionHeroStats";
import { useProgress } from "@/hooks/useProgress";
import { getVisionStats } from "@/lib/vision-stats";
import { useLocale } from "@/lib/i18n/context";

export default function VisionPage() {
  const { t } = useLocale();
  const { progress, hydrated, levelTitle } = useProgress();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <motion.div
          className="h-10 w-10 rounded-full border-2 border-astro-orange border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const stats = getVisionStats(progress);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_75%)]" />

      <StreakBar
        streak={progress.streak}
        xp={progress.xp}
        levelTitle={levelTitle}
        dailyCompleted={progress.dailyCompleted}
        dailyGoal={progress.dailyGoal}
      />

      <header className="relative z-10 px-4 pb-8 pt-8 text-center sm:pt-10 md:pt-14">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-600/90"
        >
          {t("vision.noExcuses")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-6xl font-display text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-[0.95] tracking-tight"
        >
          <span className="block text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            {t("vision.line1")}
          </span>
          <span className="mt-2 block bg-gradient-to-r from-astro-orange via-red-500 to-astro-purple bg-clip-text text-transparent">
            {t("vision.line2")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-6 font-display text-sm tracking-[0.35em] text-gray-500 md:text-base"
        >
          {t("vision.quote")}
        </motion.p>

        <VisionHeroStats stats={stats} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mx-auto mt-10 max-w-lg px-2 text-base leading-relaxed text-gray-600"
        >
          {t("vision.tileHint")}
        </motion.p>
      </header>

      <div className="relative z-10">
        <VisionMosaic />
      </div>

      <footer className="relative z-10 border-t border-white/5 bg-black py-12 text-center">
        <p className="font-display text-lg tracking-wide text-gray-400">
          {t("vision.footer")}
        </p>
        <Link
          href="/"
          className="touch-target-lg mt-5 inline-flex items-center justify-center border border-astro-orange/60 px-8 py-4 font-display text-base font-bold tracking-[0.2em] text-astro-orange transition hover:bg-astro-orange hover:text-black"
        >
          {t("vision.cta")}
        </Link>
      </footer>
    </div>
  );
}
