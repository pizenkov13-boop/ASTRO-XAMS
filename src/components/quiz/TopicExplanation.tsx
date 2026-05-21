"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/context";

interface TopicExplanationProps {
  staticExplanation?: string;
  aiExplanation: string | null;
  loading: boolean;
  error: string | null;
  showAi: boolean;
  onExplain?: () => void;
}

export function TopicExplanation({
  staticExplanation,
  aiExplanation,
  loading,
  error,
  showAi,
  onExplain,
}: TopicExplanationProps) {
  const { t } = useLocale();

  return (
    <div className="mt-4 space-y-3">
      {staticExplanation && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {staticExplanation}
        </p>
      )}

      {onExplain && !showAi && !loading && (
        <button
          type="button"
          onClick={onExplain}
          className="touch-target-lg w-full rounded-xl border border-astro-purple/50 bg-astro-purple/20 px-4 text-base font-semibold text-astro-purple transition hover:border-astro-orange hover:text-astro-orange sm:w-auto"
        >
          {t("quiz.explainAi")}
        </button>
      )}

      {(showAi || loading || error) && (
        <div className="rounded-lg border border-astro-purple/40 bg-astro-purple/10 p-3">
          <p className="text-base font-semibold uppercase tracking-wider text-astro-purple">
            {t("quiz.aiTutor")}
          </p>
          {loading && (
            <p className="mt-2 text-base text-gray-400 animate-pulse">
              {t("quiz.aiThinking")}
            </p>
          )}
          {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
          {aiExplanation && !loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 whitespace-pre-line text-base leading-relaxed text-gray-200"
            >
              {aiExplanation}
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
}
