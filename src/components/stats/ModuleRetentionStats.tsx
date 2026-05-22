"use client";

import type { UserProgress } from "@/types";
import { getModuleRetention } from "@/lib/stats-metrics";
import { useLocale } from "@/lib/i18n/context";

interface ModuleRetentionStatsProps {
  progress: UserProgress;
}

export function ModuleRetentionStats({ progress }: ModuleRetentionStatsProps) {
  const { t } = useLocale();

  const modules = [
    { id: "grammar" as const, label: t("stats.moduleGrammar") },
    { id: "vocabulary" as const, label: t("stats.moduleVocabulary") },
    { id: "sat" as const, label: t("stats.moduleSat") },
    { id: "oge" as const, label: t("stats.moduleOge") },
  ];

  return (
    <section className="rounded-2xl border border-astro-orange/30 bg-astro-card p-4 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-white">
        {t("stats.retentionTitle")}
      </h2>
      <p className="mt-1 text-sm text-gray-500">{t("stats.retentionHint")}</p>

      <ul className="mt-6 space-y-4">
        {modules.map((m) => {
          const percent = getModuleRetention(progress, m.id);
          return (
            <li key={m.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-300">{m.label}</span>
                <span className="font-mono text-astro-orange">{percent}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-astro-surface">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-astro-orange to-astro-purple"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
