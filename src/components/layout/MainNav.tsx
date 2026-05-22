"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AstroIcon } from "@/components/icons/AstroIcons";
import type { NavIconId } from "@/components/icons/astro-icon-types";
import { useLocale } from "@/lib/i18n/context";
import { LanguageToggle } from "./LanguageToggle";
import type { TranslationKey } from "@/lib/i18n/translations";

const LINKS: {
  href: string;
  labelKey: TranslationKey;
  icon: NavIconId;
  shortLabel: string;
}[] = [
  { href: "/", labelKey: "nav.home", icon: "home", shortLabel: "Home" },
  { href: "/vision", labelKey: "nav.vision", icon: "vision", shortLabel: "Vision" },
  { href: "/review", labelKey: "nav.review", icon: "review", shortLabel: "Review" },
  { href: "/stats", labelKey: "nav.stats", icon: "stats", shortLabel: "Stats" },
  { href: "/settings", labelKey: "nav.settings", icon: "settings", shortLabel: "Settings" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function MainNav() {
  const pathname = usePathname();
  const { t, locale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const isRu = locale === "ru";

  const desktopNavLink = (active: boolean) =>
    [
      "flex min-h-[40px] items-center rounded-full font-display font-bold transition",
      isRu ? "px-2 py-1.5 text-[10px] tracking-wide" : "px-2.5 py-1.5 text-[11px] tracking-wider",
      active
        ? "bg-gradient-to-r from-astro-orange to-astro-purple text-white shadow-neon"
        : "text-gray-400 hover:text-white",
    ].join(" ");

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
      {/* Icon-only quick nav: 390px–1023px */}
      <div className="hidden min-[390px]:flex lg:hidden items-center gap-1 rounded-full border border-astro-purple/30 bg-astro-surface/80 p-1">
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
              <AstroIcon name={icon} className="h-6 w-6" />
            </Link>
          );
        })}
      </div>

      {/* Desktop: text labels + language */}
      <div className="hidden min-w-0 shrink-0 items-center gap-1.5 lg:flex lg:gap-2">
        <nav className="flex min-w-0 max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-astro-purple/30 bg-astro-surface/80 p-0.5 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LINKS.map(({ href, labelKey }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`shrink-0 whitespace-nowrap ${desktopNavLink(active)}`}
              >
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
        <LanguageToggle compact={isRu} />
      </div>

      {/* Mobile hamburger: &lt; 768px (and primary nav on &lt; 390px) */}
      <div className="flex lg:hidden items-center gap-2">
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
                    <AstroIcon name={icon} className="h-7 w-7 shrink-0" />
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
