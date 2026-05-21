"use client";

import { motion } from "framer-motion";
import type { VisionStats } from "@/lib/vision-stats";
import { SAT_TARGET_SCORE } from "@/lib/vision-stats";
import { useLocale } from "@/lib/i18n/context";

interface VisionHeroStatsProps {
  stats: VisionStats;
}

export function VisionHeroStats({ stats }: VisionHeroStatsProps) {
  const { t } = useLocale();
  const items = [
    {
      label: t("vision.stats.streak"),
      value: `${stats.streak}`,
      unit: t("vision.stats.days"),
      pct: undefined,
      accent: "text-astro-orange",
    },
    {
      label: t("vision.stats.grammar"),
      value: `${stats.grammarCompleted}`,
      unit: `/ ${stats.grammarTotal}`,
      pct: stats.grammarPercent,
      accent: "text-white",
    },
    {
      label: t("vision.stats.sat"),
      value: `${stats.estimatedSatScore}`,
      unit: `→ ${SAT_TARGET_SCORE}`,
      pct: stats.satPercent,
      accent: "text-astro-cyan",
    },
    {
      label: t("vision.stats.words"),
      value: `${stats.wordsLearned.toLocaleString()}`,
      unit: `/ ${stats.wordsTotal.toLocaleString()}`,
      pct: Math.round((stats.wordsLearned / stats.wordsTotal) * 100),
      accent: "text-astro-purple",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-2 gap-3 px-2 md:grid-cols-4 md:gap-4"
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/10 bg-black/60 px-4 py-5 backdrop-blur-md"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            {item.label}
          </p>
          <p className={`mt-2 font-display text-2xl font-black md:text-3xl ${item.accent}`}>
            {item.value}
            <span className="text-base font-semibold text-gray-500">{item.unit}</span>
          </p>
          {item.pct !== undefined && (
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-astro-orange to-astro-purple"
                initial={{ width: 0 }}
                animate={{ width: `${item.pct}%` }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.9 }}
              />
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}
