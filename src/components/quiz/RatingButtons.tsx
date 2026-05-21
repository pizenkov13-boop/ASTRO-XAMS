"use client";

import { useLocale } from "@/lib/i18n/context";
import type { ReviewQuality } from "@/types";

interface RatingButtonsProps {
  onRate: (quality: ReviewQuality) => void;
  disabled?: boolean;
  selected?: ReviewQuality | null;
}

export function RatingButtons({ onRate, disabled, selected }: RatingButtonsProps) {
  const { t } = useLocale();
  const buttons: { quality: ReviewQuality; label: string; hint: string; color: string }[] = [
    {
      quality: "hard",
      label: t("quiz.rating.hard"),
      hint: t("quiz.rating.hardHint"),
      color: "border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10",
    },
    {
      quality: "good",
      label: t("quiz.rating.good"),
      hint: t("quiz.rating.goodHint"),
      color: "border-astro-cyan/50 text-astro-cyan hover:bg-astro-cyan/10",
    },
    {
      quality: "easy",
      label: t("quiz.rating.easy"),
      hint: t("quiz.rating.easyHint"),
      color: "border-astro-orange/50 text-astro-orange hover:bg-astro-orange/10",
    },
  ];

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs text-gray-500">{t("quiz.ratingPrompt")}</p>
      <div className="flex flex-wrap gap-2">
        {buttons.map((b) => (
          <button
            key={b.quality}
            type="button"
            disabled={disabled}
            onClick={() => onRate(b.quality)}
            className={`flex-1 min-w-[90px] rounded-lg border px-3 py-2 text-sm font-semibold transition ${b.color} ${
              selected === b.quality ? "ring-2 ring-white/30" : ""
            }`}
          >
            {b.label}
            <span className="mt-0.5 block text-[10px] font-normal opacity-70">{b.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
