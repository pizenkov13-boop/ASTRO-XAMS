"use client";

import { useMemo } from "react";
import { getThisWeekQuestionCounts, maxWeekQuestionCount } from "@/lib/stats-metrics";
import { useLocale } from "@/lib/i18n/context";

export function WeeklyQuestionsChart() {
  const { locale, t } = useLocale();
  const days = useMemo(
    () => getThisWeekQuestionCounts(locale === "ru" ? "ru" : "en"),
    [locale]
  );
  const max = useMemo(() => maxWeekQuestionCount(days), [days]);

  return (
    <section className="rounded-2xl border border-astro-cyan/30 bg-astro-card p-4 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-white">
        {t("stats.weeklyQuestionsTitle")}
      </h2>
      <p className="mt-1 text-sm text-gray-500">{t("stats.weeklyQuestionsHint")}</p>

      <div className="mt-6 flex h-40 items-end justify-between gap-2 sm:gap-3">
        {days.map((day) => {
          const pct = max > 0 ? (day.count / max) * 100 : 0;
          return (
            <div
              key={day.date}
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="font-mono text-xs text-astro-cyan">{day.count}</span>
              <div className="flex w-full max-w-[2.5rem] flex-1 items-end justify-center">
                <div
                  className="w-full min-h-[4px] rounded-t-md bg-gradient-to-t from-astro-purple to-astro-cyan transition-all"
                  style={{ height: `${Math.max(pct, day.count > 0 ? 8 : 4)}%` }}
                  title={`${day.date}: ${day.count}`}
                />
              </div>
              <span className="text-xs text-gray-500">{day.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
