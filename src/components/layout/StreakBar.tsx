"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/context";
import { MainNav } from "./MainNav";

interface StreakBarProps {
  streak: number;
  xp: number;
  levelTitle: string;
  dailyCompleted: number;
  dailyGoal: number;
}

export function StreakBar({
  streak,
  xp,
  levelTitle,
  dailyCompleted,
  dailyGoal,
}: StreakBarProps) {
  const { t } = useLocale();
  const dailyPct = Math.min(100, Math.round((dailyCompleted / dailyGoal) * 100));

  return (
    <header className="sticky top-0 z-50 border-b border-astro-purple/30 bg-astro-bg/95 backdrop-blur-md pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 sm:justify-start sm:gap-3">
          <Link href="/" className="shrink-0 touch-manipulation">
            <motion.span
              className="font-display text-base font-bold tracking-wider text-astro-orange sm:text-lg"
              animate={{ textShadow: ["0 0 8px #ff6b2c", "0 0 16px #a855f7", "0 0 8px #ff6b2c"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ASTRO&apos;XAMS
            </motion.span>
          </Link>
          <MainNav />
          <div className="hidden min-[390px]:flex sm:flex items-center gap-2 rounded-full border border-astro-orange/50 bg-astro-card px-3 py-1.5 shrink-0">
            <span className="text-lg">🔥</span>
            <span className="font-display text-base font-semibold text-astro-orange">
              {streak}
            </span>
            <span className="hidden text-base text-gray-400 sm:inline">{t("streak.label")}</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 text-base sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-4">
          <div className="min-[390px]:hidden flex items-center gap-2 rounded-lg border border-astro-orange/30 bg-astro-card px-3 py-2">
            <span className="text-lg">🔥</span>
            <span className="font-display font-semibold text-astro-orange">{streak}</span>
          </div>
          <div className="rounded-lg border border-astro-purple/20 bg-astro-card/50 px-3 py-2 sm:border-0 sm:bg-transparent sm:p-0">
            <p className="text-base text-gray-500">{t("streak.level")}</p>
            <p className="font-display text-base font-semibold text-astro-purple truncate">
              {levelTitle}
            </p>
          </div>
          <div className="rounded-lg border border-astro-cyan/20 bg-astro-card/50 px-3 py-2 sm:border-0 sm:bg-transparent sm:p-0">
            <p className="text-base text-gray-500">{t("streak.xp")}</p>
            <p className="font-mono text-base font-semibold text-astro-cyan">
              {xp.toLocaleString()}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 sm:min-w-[140px]">
            <div className="mb-1 flex justify-between text-base text-gray-500">
              <span>{t("streak.dailyGoal")}</span>
              <span>
                {dailyCompleted}/{dailyGoal}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-astro-surface">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-astro-orange to-astro-purple"
                initial={{ width: 0 }}
                animate={{ width: `${dailyPct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
