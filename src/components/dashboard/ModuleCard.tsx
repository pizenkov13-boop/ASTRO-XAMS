"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/context";
import type { ModuleInfo } from "@/data/modules";

interface ModuleCardProps {
  module: ModuleInfo;
  completedUnits: number;
  retentionPercent: number;
  index: number;
}

export function ModuleCard({
  module,
  completedUnits,
  retentionPercent,
  index,
}: ModuleCardProps) {
  const { t } = useLocale();
  const progress = Math.round((completedUnits / module.unitCount) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={module.href}>
        <article className="group relative overflow-hidden rounded-2xl border border-astro-purple/30 bg-astro-card p-5 shadow-neon transition hover:border-astro-orange/60 hover:shadow-neon-strong sm:p-6">
          <div
            className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${module.gradient} opacity-20 blur-2xl transition group-hover:opacity-40`}
          />
          <div className="relative">
            <span className="text-4xl">{module.icon}</span>
            <h2 className="mt-3 font-display text-xl font-bold text-white group-hover:text-astro-orange">
              {module.title}
            </h2>
            <p className="text-sm text-astro-purple">{module.subtitle}</p>
            <p className="mt-2 text-base text-gray-400">{module.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-astro-surface px-2 py-0.5 text-xs text-astro-cyan">
                {module.level}
              </span>
              <span className="rounded-full bg-astro-surface px-2 py-0.5 text-xs text-gray-400">
                {t("module.units", { count: module.unitCount })}
              </span>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-500">{t("module.galaxyProgress")}</span>
                <span className="text-astro-orange">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-astro-surface">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${module.gradient}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {t("module.retentionCompleted", {
                  retention: retentionPercent,
                  completed: completedUnits,
                })}
              </p>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
