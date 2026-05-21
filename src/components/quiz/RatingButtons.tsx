"use client";

import type { ReviewQuality } from "@/types";

interface RatingButtonsProps {
  onRate: (quality: ReviewQuality) => void;
  disabled?: boolean;
  selected?: ReviewQuality | null;
}

export function RatingButtons({ onRate, disabled, selected }: RatingButtonsProps) {
  const buttons: { quality: ReviewQuality; label: string; hint: string; color: string }[] = [
    { quality: "hard", label: "Hard", hint: "×1.2 interval", color: "border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10" },
    { quality: "good", label: "Good", hint: "SM-2 ladder", color: "border-astro-cyan/50 text-astro-cyan hover:bg-astro-cyan/10" },
    { quality: "easy", label: "Easy", hint: "×2.5 interval", color: "border-astro-orange/50 text-astro-orange hover:bg-astro-orange/10" },
  ];

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs text-gray-500">How well did you know this? (SM-2)</p>
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
