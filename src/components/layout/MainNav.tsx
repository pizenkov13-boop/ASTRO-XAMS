"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/context";
import { LanguageToggle } from "./LanguageToggle";
import type { TranslationKey } from "@/lib/i18n/translations";

const LINKS: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/vision", labelKey: "nav.vision" },
  { href: "/review", labelKey: "nav.review" },
  { href: "/settings", labelKey: "nav.settings" },
];

export function MainNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-full border border-astro-purple/30 bg-astro-surface/80 p-1">
      {LINKS.map(({ href, labelKey }) => {
        const label = t(labelKey);
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-full px-3 py-1 font-display text-xs font-bold tracking-widest transition ${
              active
                ? "bg-gradient-to-r from-astro-orange to-astro-purple text-white shadow-neon"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
      </div>
      <LanguageToggle />
    </nav>
  );
}
