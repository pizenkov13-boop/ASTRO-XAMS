"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Unit, UserProgress } from "@/types";
import { useLocale } from "@/lib/i18n/context";
import { getUnitBucket } from "@/lib/review-queue";

interface UnitListProps {
  units: Unit[];
  basePath: string;
  completedIds: string[];
  progress: UserProgress;
}

const BUCKET_STYLES = {
  due: "border-astro-orange/50 ring-1 ring-astro-orange/30",
  new: "border-astro-cyan/30",
  later: "border-astro-purple/20",
};

export function UnitList({ units, basePath, completedIds, progress }: UnitListProps) {
  const { t } = useLocale();

  const bucketLabels = {
    due: { text: t("unit.due"), className: "text-astro-orange" },
    new: { text: t("unit.new"), className: "text-astro-cyan" },
    later: { text: "", className: "" },
  };

  return (
    <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {units.map((unit, i) => {
        const done = completedIds.includes(unit.id);
        const bucket = getUnitBucket(unit, progress);
        const label = bucketLabels[bucket];

        return (
          <motion.li
            key={unit.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.5) }}
          >
            <Link
              href={`${basePath}/${unit.id}`}
              className={`block rounded-xl border p-4 transition hover:border-astro-orange/50 ${
                done
                  ? "border-astro-cyan/30 bg-astro-cyan/5"
                  : `bg-astro-card ${BUCKET_STYLES[bucket]}`
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-astro-purple">
                  {unit.level} · {t("unit.questions", { count: unit.questions.length })}
                </span>
                {label.text && (
                  <span className={`text-[10px] font-bold uppercase ${label.className}`}>
                    {label.text}
                  </span>
                )}
              </div>
              <p className="mt-1 font-medium text-white">{unit.title}</p>
              {done && (
                <span className="mt-2 inline-block text-xs text-astro-cyan">
                  {t("unit.completed")}
                </span>
              )}
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}
