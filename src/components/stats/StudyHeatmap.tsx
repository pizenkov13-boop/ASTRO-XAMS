"use client";

import { useMemo } from "react";
import { buildHeatmapWeeks } from "@/lib/stats-metrics";
import { useLocale } from "@/lib/i18n/context";

export function StudyHeatmap() {
  const { t } = useLocale();
  const weeks = useMemo(() => buildHeatmapWeeks(12), []);

  return (
    <section className="rounded-2xl border border-astro-purple/30 bg-astro-card p-4 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-white">{t("stats.heatmapTitle")}</h2>
      <p className="mt-1 text-sm text-gray-500">{t("stats.heatmapHint")}</p>

      <div className="mt-4 overflow-x-auto pb-2">
        <div className="inline-flex min-w-0 gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={day.date}
                  className={`h-3 w-3 rounded-sm sm:h-3.5 sm:w-3.5 ${
                    day.isFuture
                      ? "bg-transparent ring-0"
                      : day.studied
                        ? "bg-green-500 ring-1 ring-green-400/50"
                        : "bg-astro-surface ring-1 ring-white/5"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <span>{t("stats.less")}</span>
        <div className="h-3 w-3 rounded-sm bg-astro-surface ring-1 ring-white/5" />
        <div className="h-3 w-3 rounded-sm bg-green-500" />
        <span>{t("stats.more")}</span>
      </div>
    </section>
  );
}
