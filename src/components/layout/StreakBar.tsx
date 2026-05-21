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
    <header className="sticky top-0 z-50 border-b border-astro-purple/30 bg-astro-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Link href="/">
            <motion.span
              className="font-display text-lg font-bold tracking-wider text-astro-orange"
              animate={{ textShadow: ["0 0 8px #ff6b2c", "0 0 16px #a855f7", "0 0 8px #ff6b2c"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ASTRO&apos;XAMS
            </motion.span>
          </Link>
          <MainNav />
          <div className="flex items-center gap-2 rounded-full border border-astro-orange/50 bg-astro-card px-3 py-1">
            <span className="text-lg">🔥</span>
            <span className="font-display text-sm font-semibold text-astro-orange">
              {streak}
            </span>
            <span className="text-xs text-gray-400">{t("streak.label")}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-xs text-gray-500">{t("streak.level")}</p>
            <p className="font-display font-semibold text-astro-purple">{levelTitle}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">{t("streak.xp")}</p>
            <p className="font-mono font-semibold text-astro-cyan">{xp.toLocaleString()}</p>
          </div>
          <div className="min-w-[140px]">
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>{t("streak.dailyGoal")}</span>
              <span>
                {dailyCompleted}/{dailyGoal}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-astro-surface">
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
