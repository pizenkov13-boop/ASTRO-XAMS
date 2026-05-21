"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/vision", label: "VISION" },
  { href: "/review", label: "REVIEW" },
  { href: "/settings", label: "SETTINGS" },
] as const;

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-full border border-astro-purple/30 bg-astro-surface/80 p-1">
      {LINKS.map(({ href, label }) => {
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
    </nav>
  );
}
