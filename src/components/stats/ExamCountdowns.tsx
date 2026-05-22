"use client";

import { useMemo } from "react";
import {
  daysUntilExam,
  IELTS_EXAM_DATE,
  SAT_EXAM_DATE,
} from "@/lib/stats-metrics";
import { useLocale } from "@/lib/i18n/context";

export function ExamCountdowns() {
  const { t } = useLocale();

  const ieltsDays = useMemo(() => daysUntilExam(IELTS_EXAM_DATE), []);
  const satDays = useMemo(() => daysUntilExam(SAT_EXAM_DATE), []);

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-astro-purple/40 bg-astro-card p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-astro-purple">
          {t("stats.ieltsLabel")}
        </p>
        <p className="mt-2 font-display text-3xl font-bold text-white">
          {t("stats.daysLeft", { count: ieltsDays })}
        </p>
        <p className="mt-1 text-sm text-gray-500">{t("stats.ieltsDate")}</p>
      </div>
      <div className="rounded-2xl border border-astro-cyan/40 bg-astro-card p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-astro-cyan">
          {t("stats.satLabel")}
        </p>
        <p className="mt-2 font-display text-3xl font-bold text-white">
          {t("stats.daysLeft", { count: satDays })}
        </p>
        <p className="mt-1 text-sm text-gray-500">{t("stats.satDate")}</p>
      </div>
    </section>
  );
}
