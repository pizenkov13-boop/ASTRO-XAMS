"use client";

import Link from "next/link";
import { useMemo } from "react";
import { grammarUnits } from "@/data/grammar";
import { vocabularyUnits } from "@/data/vocabulary";
import { satUnits } from "@/data/sat";
import { StreakBar } from "@/components/layout/StreakBar";
import { useProgress } from "@/hooks/useProgress";
import { useLocale } from "@/lib/i18n/context";
import { partitionUnitsForStudy } from "@/lib/review-queue";

export default function ReviewPage() {
  const { t } = useLocale();
  const { progress, hydrated, levelTitle } = useProgress();

  const { due, fresh, sorted } = useMemo(() => {
    const all = [...grammarUnits, ...vocabularyUnits, ...satUnits];
    return partitionUnitsForStudy(all, progress);
  }, [progress]);

  if (!hydrated) return null;

  const modulePath = (moduleId: string) => `/modules/${moduleId}`;

  return (
    <div className="min-h-screen bg-astro-bg">
      <StreakBar
        streak={progress.streak}
        xp={progress.xp}
        levelTitle={levelTitle}
        dailyCompleted={progress.dailyCompleted}
        dailyGoal={progress.dailyGoal}
      />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/" className="text-sm text-astro-purple">
          {t("common.dashboard")}
        </Link>
        <h1 className="mt-4 font-display text-3xl text-white">{t("review.title")}</h1>
        <p className="text-gray-400">{t("review.subtitle")}</p>

        {sorted.length === 0 ? (
          <p className="mt-8 rounded-xl border border-astro-purple/30 bg-astro-card p-6 text-gray-400">
            {t("review.empty")}
          </p>
        ) : (
          <div className="mt-8 space-y-8">
            {due.length > 0 && (
              <section>
                <h2 className="font-display text-lg text-astro-orange">
                  {t("review.dueNow", { count: due.length })}
                </h2>
                <ul className="mt-3 space-y-2">
                  {due.map((u) => (
                    <li key={u.id}>
                      <Link
                        href={`${modulePath(u.moduleId)}/${u.id}`}
                        className="block rounded-lg border border-astro-orange/40 bg-astro-card p-4 hover:border-astro-orange"
                      >
                        {u.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {fresh.length > 0 && (
              <section>
                <h2 className="font-display text-lg text-astro-cyan">
                  {t("review.newMaterial", { count: fresh.length })}
                </h2>
                <ul className="mt-3 space-y-2">
                  {fresh.map((u) => (
                    <li key={u.id}>
                      <Link
                        href={`${modulePath(u.moduleId)}/${u.id}`}
                        className="block rounded-lg border border-astro-cyan/30 bg-astro-card p-4 hover:border-astro-cyan"
                      >
                        {u.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {due.length === 0 && fresh.length === 0 && (
              <p className="rounded-xl border border-astro-purple/30 bg-astro-card p-6 text-gray-400">
                {t("review.caughtUp")}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
