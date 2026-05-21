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

  const cardClass =
    "block w-full min-h-[56px] rounded-xl border bg-astro-card px-5 py-4 text-base font-medium text-white transition touch-manipulation active:scale-[0.99]";

  return (
    <div className="min-h-screen overflow-x-hidden bg-astro-bg">
      <StreakBar
        streak={progress.streak}
        xp={progress.xp}
        levelTitle={levelTitle}
        dailyCompleted={progress.dailyCompleted}
        dailyGoal={progress.dailyGoal}
      />
      <main className="page-shell-narrow">
        <Link
          href="/"
          className="touch-target inline-flex items-center text-base text-astro-purple"
        >
          {t("common.dashboard")}
        </Link>
        <h1 className="mt-4 font-display text-2xl text-white sm:text-3xl">
          {t("review.title")}
        </h1>
        <p className="text-base text-gray-400">{t("review.subtitle")}</p>

        {sorted.length === 0 ? (
          <p className="mt-8 w-full rounded-xl border border-astro-purple/30 bg-astro-card p-6 text-base text-gray-400">
            {t("review.empty")}
          </p>
        ) : (
          <div className="mt-8 w-full space-y-8">
            {due.length > 0 && (
              <section className="w-full">
                <h2 className="font-display text-lg text-astro-orange">
                  {t("review.dueNow", { count: due.length })}
                </h2>
                <ul className="mt-3 flex w-full flex-col gap-3">
                  {due.map((u) => (
                    <li key={u.id} className="w-full">
                      <Link
                        href={`${modulePath(u.moduleId)}/${u.id}`}
                        className={`${cardClass} border-astro-orange/40 hover:border-astro-orange`}
                      >
                        {u.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {fresh.length > 0 && (
              <section className="w-full">
                <h2 className="font-display text-lg text-astro-cyan">
                  {t("review.newMaterial", { count: fresh.length })}
                </h2>
                <ul className="mt-3 flex w-full flex-col gap-3">
                  {fresh.map((u) => (
                    <li key={u.id} className="w-full">
                      <Link
                        href={`${modulePath(u.moduleId)}/${u.id}`}
                        className={`${cardClass} border-astro-cyan/30 hover:border-astro-cyan`}
                      >
                        {u.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {due.length === 0 && fresh.length === 0 && (
              <p className="w-full rounded-xl border border-astro-purple/30 bg-astro-card p-6 text-base text-gray-400">
                {t("review.caughtUp")}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
