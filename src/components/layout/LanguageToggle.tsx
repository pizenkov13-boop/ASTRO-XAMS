"use client";

import { useLocale } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/locale";

export function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  const btn = (lang: Locale, labelKey: "lang.ru" | "lang.en") => (
    <button
      type="button"
      onClick={() => setLocale(lang)}
      className={`rounded-full px-2.5 py-1 font-display text-[10px] font-bold tracking-widest transition ${
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
