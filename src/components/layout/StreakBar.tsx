"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AstroIcon } from "@/components/icons/AstroIcons";
import { useStudyTimer } from "@/contexts/StudyTimerContext";
import { useLocale } from "@/lib/i18n/context";
import { MainNav } from "./MainNav";

interface StreakBarProps {
  streak: number;
  xp: number;
  levelTitle: string;
  dailyCompleted: number;
  dailyGoal: number;
}

function StatDivider() {
  return <span className="hidden shrink-0 text-gray-600 lg:inline" aria-hidden>|</span>;
}

export function StreakBar({
  streak,
  xp,
  levelTitle,
  dailyCompleted,
  dailyGoal,
}: StreakBarProps) {
  const { t, locale } = useLocale();
  const { todayFormatted } = useStudyTimer();
  const dailyPct = Math.min(100, Math.round((dailyCompleted / dailyGoal) * 100));
  const isRu = locale === "ru";

  const statText = isRu ? "text-[11px] leading-tight" : "text-xs leading-tight";
  const statLabel = isRu ? "text-[10px] leading-none" : "text-[10px] leading-none";
  const levelMaxW = isRu
    ? "max-w-[5.5rem] xl:max-w-[7rem] 2xl:max-w-[9.5rem]"
    : "max-w-[6.5rem] xl:max-w-[8.5rem] 2xl:max-w-[11rem]";

  const streakChip = (
    <div
      className={`flex shrink-0 items-center gap-1 rounded-full border border-astro-orange/50 bg-astro-card px-2 py-1 ${statText}`}
    >
      <AstroIcon name="streak-flame" pulse className="h-5 w-5" />
      <span className="font-display font-semibold text-astro-orange">{streak}</span>
      <span className={`hidden text-gray-400 2xl:inline ${statLabel}`}>{t("streak.label")}</span>
    </div>
  );

  const timerChip = (
    <div
      className={`shrink-0 whitespace-nowrap rounded-full border border-astro-cyan/40 bg-astro-card px-2 py-1 font-mono font-semibold text-astro-cyan ${statText}`}
    >
      {t("timer.today", { time: todayFormatted })}
    </div>
  );

  const levelBlock = (
    <div className={`flex min-w-0 items-baseline gap-1 ${statText}`}>
      <span className={`shrink-0 text-gray-500 ${statLabel}`}>{t("streak.level")}</span>
      <span
        className={`truncate font-display font-semibold text-astro-purple ${levelMaxW}`}
        title={levelTitle}
      >
        {levelTitle}
      </span>
    </div>
  );

  const xpBlock = (
    <div className={`flex shrink-0 items-center gap-1 whitespace-nowrap ${statText}`}>
      <AstroIcon name="xp-gem" className="h-4 w-4" />
      <span className={`text-gray-500 ${statLabel}`}>{t("streak.xp")}</span>
      <span className="font-mono font-semibold text-astro-cyan">{xp.toLocaleString()}</span>
    </div>
  );

  const dailyBlock = (
    <div className={`flex w-[4.5rem] shrink-0 flex-col gap-0.5 sm:w-[5.5rem] ${statText}`}>
      <div className="flex justify-between font-mono text-[10px] text-gray-500">
        <span className={statLabel}>{t("streak.dailyGoalShort")}</span>
        <span>
          {dailyCompleted}/{dailyGoal}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-astro-surface">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-astro-orange to-astro-purple"
          initial={{ width: 0 }}
          animate={{ width: `${dailyPct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-astro-purple/30 bg-astro-bg/95 backdrop-blur-md pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto w-full max-w-[90rem] px-3 py-2 sm:px-4 lg:py-2.5">
        {/* Desktop / large tablet: single row */}
        <div className="hidden min-w-0 items-center gap-2 lg:flex lg:gap-2.5">
          <Link href="/" className="shrink-0 touch-manipulation">
            <motion.span
              className={`font-display font-bold tracking-wider text-astro-orange ${
                isRu ? "text-sm" : "text-base"
              }`}
              animate={{
                textShadow: ["0 0 8px #ff6b2c", "0 0 16px #a855f7", "0 0 8px #ff6b2c"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ASTRO&apos;XAMS
            </motion.span>
          </Link>

          <div className="flex min-w-0 flex-1 justify-center overflow-hidden px-1">
            <MainNav />
          </div>

          <div
            className={`flex min-w-0 shrink-0 items-center gap-1.5 whitespace-nowrap xl:gap-2 ${statText}`}
          >
            {streakChip}
            <StatDivider />
            {timerChip}
            <StatDivider />
            {levelBlock}
            <StatDivider />
            {xpBlock}
            <StatDivider />
            {dailyBlock}
          </div>
        </div>

        {/* Mobile / tablet: logo row + stats row */}
        <div className="flex min-w-0 flex-col gap-2 lg:hidden">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <Link href="/" className="shrink-0 touch-manipulation">
              <span className="font-display text-base font-bold tracking-wider text-astro-orange">
                ASTRO&apos;XAMS
              </span>
            </Link>
            <MainNav />
            <div className="hidden min-[390px]:flex shrink-0 items-center gap-2">
              {streakChip}
            </div>
          </div>

          <div
            className={`grid min-w-0 gap-2 ${isRu ? "text-xs" : "text-sm"} ${
              isRu ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-4"
            }`}
          >
            <div className="min-[390px]:hidden">{streakChip}</div>
            <div className="min-w-0 sm:col-span-1">{timerChip}</div>
            <div className="min-w-0 sm:col-span-1">{levelBlock}</div>
            <div className="whitespace-nowrap">{xpBlock}</div>
            <div className="col-span-2 min-w-0 sm:col-span-2">{dailyBlock}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
