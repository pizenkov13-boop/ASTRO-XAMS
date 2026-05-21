"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/context";

interface GalaxyProgressProps {
  label: string;
  percent: number;
  completed: number;
  total: number;
}

export function GalaxyProgress({
  label,
  percent,
  completed,
  total,
}: GalaxyProgressProps) {
  const { t } = useLocale();

  return (
    <div className="rounded-xl border border-astro-purple/20 bg-astro-card/80 p-4">
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="font-mono text-astro-cyan">
          {t("galaxy.retention", { percent })}
        </span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full bg-astro-surface">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-astro-purple via-astro-orange to-astro-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-white/80"
            style={{ left: `${(i + 1) * 20}%` }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {t("galaxy.explored", { completed, total })}
      </p>
    </div>
  );
}
