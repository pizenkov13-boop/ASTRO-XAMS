"use client";

import { useLocale } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/locale";

interface LanguageToggleProps {
  compact?: boolean;
}

export function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { locale, setLocale, t } = useLocale();

  const btn = (lang: Locale, labelKey: "lang.ru" | "lang.en") => (
    <button
      type="button"
      onClick={() => setLocale(lang)}
      className={`rounded-full font-display font-bold transition touch-manipulation ${
        compact
          ? "min-h-[36px] min-w-[36px] px-2 py-1 text-[10px] tracking-wide"
          : "min-h-[44px] min-w-[44px] px-3 py-2 text-base tracking-widest"
      } ${
        locale === lang
          ? "bg-astro-orange text-black shadow-neon"
          : "text-gray-500 hover:text-white"
      }`}
      aria-pressed={locale === lang}
      aria-label={lang === "ru" ? "Русский" : "English"}
    >
      {t(labelKey)}
    </button>
  );

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-astro-purple/30 bg-astro-surface/80 p-0.5"
      role="group"
      aria-label="Language"
    >
      {btn("ru", "lang.ru")}
      {btn("en", "lang.en")}
    </div>
  );
}
