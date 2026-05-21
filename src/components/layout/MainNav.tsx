"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/context";
import { LanguageToggle } from "./LanguageToggle";
import type { TranslationKey } from "@/lib/i18n/translations";

const LINKS: {
  href: string;
  labelKey: TranslationKey;
  icon: string;
  shortLabel: string;
}[] = [
  { href: "/", labelKey: "nav.home", icon: "⌂", shortLabel: "Home" },
  { href: "/vision", labelKey: "nav.vision", icon: "◎", shortLabel: "Vision" },
  { href: "/review", labelKey: "nav.review", icon: "↻", shortLabel: "Review" },
  { href: "/settings", labelKey: "nav.settings", icon: "⚙", shortLabel: "Settings" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function MainNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const linkClass = (active: boolean, compact = false) =>
    [
      "flex items-center justify-center rounded-xl font-display font-bold transition touch-manipulation",
      compact
        ? "h-11 w-11 min-h-[44px] min-w-[44px] text-lg"
        : "min-h-[52px] w-full gap-3 px-4 text-base tracking-wide",
      active
        ? "bg-gradient-to-r from-astro-orange to-astro-purple text-white shadow-neon"
        : "text-gray-400 hover:bg-astro-surface hover:text-white",
    ].join(" ");

  return (
    <>
      {/* Icon-only quick nav: 390px–767px */}
      <div className="hidden min-[390px]:flex md:hidden items-center gap-1 rounded-full border border-astro-purple/30 bg-astro-surface/80 p-1">
        {LINKS.map(({ href, labelKey, icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={t(labelKey)}
              title={t(labelKey)}
              className={linkClass(active, true)}
            >
              <span aria-hidden>{icon}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop: text labels + language */}
      <div className="hidden md:flex items-center gap-2">
        <nav className="flex items-center gap-1 rounded-full border border-astro-purple/30 bg-astro-surface/80 p-1">
          {LINKS.map(({ href, labelKey }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3 py-2 font-display text-xs font-bold tracking-widest transition min-h-[44px] flex items-center ${
                  active
                    ? "bg-gradient-to-r from-astro-orange to-astro-purple text-white shadow-neon"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
        <LanguageToggle />
      </div>

      {/* Mobile hamburger: &lt; 768px (and primary nav on &lt; 390px) */}
      <div className="flex md:hidden items-center gap-2">
        <LanguageToggle />
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-astro-purple/40 bg-astro-surface text-white touch-manipulation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t("nav.menuClose") : t("nav.menuOpen")}
        >
          <span className="sr-only">
            {menuOpen ? t("nav.menuClose") : t("nav.menu")}
          </span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            {menuOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/70 md:hidden touch-manipulation"
              aria-label={t("nav.menuClose")}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 z-[61] flex h-full w-[min(100%,20rem)] flex-col gap-2 border-l border-astro-purple/30 bg-astro-bg p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden"
            >
              <p className="mb-4 font-display text-base font-bold text-astro-orange">
                ASTRO&apos;XAMS
              </p>
              {LINKS.map(({ href, labelKey, icon }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={linkClass(active)}
                  >
                    <span className="text-xl" aria-hidden>
                      {icon}
                    </span>
                    <span>{t(labelKey)}</span>
                  </Link>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
