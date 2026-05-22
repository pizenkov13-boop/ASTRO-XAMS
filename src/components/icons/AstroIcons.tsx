"use client";

import { useId, type ReactNode } from "react";
import type { AstroIconId } from "./astro-icon-types";

export type { AstroIconId, ModuleIconId, NavIconId } from "./astro-icon-types";

const NEON = {
  orange: "#ff6b00",
  purple: "#7c3aed",
  cyan: "#06b6d4",
  red: "#ef4444",
  pink: "#ec4899",
  blue: "#3b82f6",
} as const;

interface IconProps {
  uid: string;
  className?: string;
}

function SvgRoot({
  className,
  children,
  viewBox = "0 0 48 48",
}: {
  className?: string;
  children: ReactNode;
  viewBox?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

function GrammarIcon({ uid, className }: IconProps) {
  const g = `g-${uid}`;
  return (
    <SvgRoot className={className}>
      <defs>
        <linearGradient id={`${g}-book`} x1="8" y1="8" x2="40" y2="40">
          <stop offset="0%" stopColor={NEON.purple} />
          <stop offset="50%" stopColor={NEON.blue} />
          <stop offset="100%" stopColor={NEON.cyan} />
        </linearGradient>
        <linearGradient id={`${g}-glow`} x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor={NEON.cyan} stopOpacity="0.9" />
          <stop offset="100%" stopColor={NEON.purple} stopOpacity="0.4" />
        </linearGradient>
        <filter id={`${g}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="38" cy="10" r="2" fill={NEON.cyan} opacity="0.9" filter={`url(#${g}-blur)`} />
      <path
        d="M10 8l3 1.5v28L10 36V8z"
        fill={`url(#${g}-book)`}
        stroke={NEON.cyan}
        strokeWidth="0.75"
        opacity="0.85"
      />
      <path
        d="M38 8l-3 1.5v28l3 1.5V8z"
        fill={`url(#${g}-book)`}
        stroke={NEON.purple}
        strokeWidth="0.75"
      />
      <path d="M13 12h22M13 17h18M13 22h20M13 27h16" stroke={NEON.cyan} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path
        d="M24 8v28"
        stroke={NEON.purple}
        strokeWidth="0.5"
        opacity="0.6"
      />
      <path
        d="M6 14l2 1 2-2 2 3 2-1"
        stroke={NEON.cyan}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${g}-blur)`}
      />
      <path
        d="M42 32l1.5 2.5 2.5-3 1.5 4"
        stroke={NEON.purple}
        strokeWidth="1"
        strokeLinecap="round"
        filter={`url(#${g}-blur)`}
      />
      <circle cx="8" cy="38" r="1.5" fill={`url(#${g}-glow)`} />
      <circle cx="40" cy="6" r="1" fill={NEON.orange} opacity="0.8" />
    </SvgRoot>
  );
}

function VocabularyIcon({ uid, className }: IconProps) {
  const g = `v-${uid}`;
  return (
    <SvgRoot className={className}>
      <defs>
        <linearGradient id={`${g}-bubble`} x1="6" y1="6" x2="42" y2="38">
          <stop offset="0%" stopColor={NEON.orange} />
          <stop offset="100%" stopColor="#ff8f4d" />
        </linearGradient>
        <filter id={`${g}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={NEON.orange} floodOpacity="0.7" />
        </filter>
      </defs>
      <path
        d="M8 10c0-4 4-7 16-7s16 3 16 7v10c0 4-4 7-16 7c-3 0-5.5.5-8 2l-4 3v-5c-2.5-2-4-4.5-4-7V10z"
        fill={`url(#${g}-bubble)`}
        stroke={NEON.orange}
        strokeWidth="1.25"
        filter={`url(#${g}-glow)`}
      />
      <text
        x="24"
        y="22"
        textAnchor="middle"
        fill="#0a0a12"
        fontSize="11"
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
      >
        ABC
      </text>
      <path d="M14 32l-3 4v-4h3z" fill={NEON.orange} opacity="0.9" />
    </SvgRoot>
  );
}

function SatIcon({ uid, className }: IconProps) {
  const g = `s-${uid}`;
  return (
    <SvgRoot className={className}>
      <defs>
        <linearGradient id={`${g}-rocket`} x1="20" y1="4" x2="36" y2="36">
          <stop offset="0%" stopColor={NEON.orange} />
          <stop offset="100%" stopColor={NEON.red} />
        </linearGradient>
        <radialGradient id={`${g}-target`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={NEON.red} />
          <stop offset="70%" stopColor={NEON.orange} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id={`${g}-fire`}>
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor={NEON.orange} floodOpacity="0.8" />
        </filter>
      </defs>
      <circle cx="12" cy="28" r="9" fill={`url(#${g}-target)`} opacity="0.35" />
      <circle cx="12" cy="28" r="7" stroke={NEON.red} strokeWidth="1.2" opacity="0.9" />
      <circle cx="12" cy="28" r="4.5" stroke={NEON.orange} strokeWidth="1" />
      <circle cx="12" cy="28" r="1.8" fill={NEON.red} />
      <path
        d="M28 8l6 14-4 2-2 8-4-2-2-8-4-2 6-14z"
        fill={`url(#${g}-rocket)`}
        stroke={NEON.orange}
        strokeWidth="0.75"
        filter={`url(#${g}-fire)`}
      />
      <path d="M26 22l-2 6 2-1 2 1-2-6z" fill={NEON.cyan} opacity="0.8" />
      <path
        d="M24 34c0 2 1.5 4 4 5 2.5 1 5-1 5-3"
        stroke={NEON.orange}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M22 36c-1 2-0.5 4 1.5 5"
        stroke={NEON.red}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </SvgRoot>
  );
}

function OgeIcon({ uid, className }: IconProps) {
  const g = `o-${uid}`;
  return (
    <SvgRoot className={className}>
      <defs>
        <linearGradient id={`${g}-frame`} x1="4" y1="4" x2="44" y2="44">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor={NEON.cyan} />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="36" height="36" rx="8" stroke={`url(#${g}-frame)`} strokeWidth="1.5" fill="#12121f" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fill={NEON.cyan}
        fontSize="20"
        fontWeight="700"
        fontFamily="serif"
      >
        ∑
      </text>
      <path d="M10 14h8M30 34h8" stroke={NEON.cyan} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </SvgRoot>
  );
}

function VisionNavIcon({ uid, className }: IconProps) {
  const g = `nv-${uid}`;
  return (
    <SvgRoot className={className} viewBox="0 0 24 24">
      <defs>
        <radialGradient id={`${g}-galaxy`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={NEON.purple} />
          <stop offset="40%" stopColor={NEON.cyan} />
          <stop offset="100%" stopColor="#0a0a12" />
        </radialGradient>
        <linearGradient id={`${g}-lid`} x1="4" y1="4" x2="20" y2="14">
          <stop offset="0%" stopColor={NEON.cyan} />
          <stop offset="100%" stopColor={NEON.purple} />
        </linearGradient>
      </defs>
      <path
        d="M12 5c-5 0-9 3.5-9 7.5S7 20 12 20s9-3.5 9-7.5S17 5 12 5z"
        stroke={`url(#${g}-lid)`}
        strokeWidth="1.4"
        fill="#12121f"
      />
      <ellipse cx="12" cy="12.5" rx="5.5" ry="4" fill={`url(#${g}-galaxy)`} />
      <circle cx="10" cy="11" r="0.6" fill="white" opacity="0.9" />
      <circle cx="14" cy="13" r="0.4" fill={NEON.cyan} opacity="0.8" />
      <circle cx="12.5" cy="14" r="0.3" fill={NEON.orange} />
      <path
        d="M12 5.5c2-1.5 5-1 6.5 1M12 5.5c-2-1.5-5-1-6.5 1"
        stroke={NEON.purple}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.7"
      />
    </SvgRoot>
  );
}

function ReviewNavIcon({ uid, className }: IconProps) {
  const g = `nr-${uid}`;
  return (
    <SvgRoot className={className} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={`${g}-brain`} x1="6" y1="4" x2="18" y2="20">
          <stop offset="0%" stopColor={NEON.purple} />
          <stop offset="100%" stopColor={NEON.pink} />
        </linearGradient>
        <filter id={`${g}-bolt`}>
          <feDropShadow dx="0" dy="0" stdDeviation="0.8" floodColor={NEON.cyan} floodOpacity="1" />
        </filter>
      </defs>
      <path
        d="M12 4c-3 0-5 2-5 5 0 1.5.5 2.8 1.5 3.8-.8 1-1.2 2.2-1 3.5.3 2 2 3.2 4.5 3.2s4.2-1.2 4.5-3.2c.2-1.3-.2-2.5-1-3.5 1-1 1.5-2.3 1.5-3.8 0-3-2-5-5-5z"
        fill={`url(#${g}-brain)`}
        stroke={NEON.purple}
        strokeWidth="0.8"
        opacity="0.95"
      />
      <path
        d="M10 9c1-1 2-1 2 0M14 9c-1-1-2-1-2 0"
        stroke="#0a0a12"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M16 3l-2 5h2l-2 5"
        stroke={NEON.cyan}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${g}-bolt)`}
      />
    </SvgRoot>
  );
}

function SettingsNavIcon({ uid, className }: IconProps) {
  const g = `ns-${uid}`;
  return (
    <SvgRoot className={className} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={`${g}-gear`} x1="4" y1="4" x2="20" y2="20">
          <stop offset="0%" stopColor={NEON.cyan} />
          <stop offset="50%" stopColor={NEON.purple} />
          <stop offset="100%" stopColor={NEON.orange} />
        </linearGradient>
        <filter id={`${g}-glow`}>
          <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor={NEON.purple} floodOpacity="0.85" />
        </filter>
      </defs>
      <circle cx="12" cy="12" r="3" fill="#0a0a12" stroke={NEON.cyan} strokeWidth="1" />
      <path
        d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M5.6 18.4l1.6-1.6M16.8 7.2l1.6-1.6"
        stroke={`url(#${g}-gear)`}
        strokeWidth="1.6"
        strokeLinecap="round"
        filter={`url(#${g}-glow)`}
      />
      <circle
        cx="12"
        cy="12"
        r="6.5"
        stroke={NEON.purple}
        strokeWidth="0.6"
        strokeDasharray="3 2"
        opacity="0.5"
      />
    </SvgRoot>
  );
}

function HomeNavIcon({ uid, className }: IconProps) {
  const g = `nh-${uid}`;
  return (
    <SvgRoot className={className} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={`${g}-orbit`} x1="2" y1="12" x2="22" y2="12">
          <stop offset="0%" stopColor={NEON.orange} />
          <stop offset="100%" stopColor={NEON.purple} />
        </linearGradient>
      </defs>
      <ellipse cx="12" cy="14" rx="9" ry="3" stroke={`url(#${g}-orbit)`} strokeWidth="1" opacity="0.6" transform="rotate(-12 12 14)" />
      <circle cx="12" cy="10" r="4" fill={NEON.purple} stroke={NEON.cyan} strokeWidth="0.8" />
      <circle cx="10" cy="9" r="0.8" fill={NEON.cyan} opacity="0.9" />
      <path d="M8 16 L12 12 L16 16 L12 20 Z" fill={NEON.orange} opacity="0.35" />
    </SvgRoot>
  );
}

function StatsNavIcon({ uid, className }: IconProps) {
  const g = `nst-${uid}`;
  return (
    <SvgRoot className={className} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={`${g}-bars`} x1="4" y1="20" x2="20" y2="4">
          <stop offset="0%" stopColor={NEON.cyan} />
          <stop offset="100%" stopColor={NEON.purple} />
        </linearGradient>
      </defs>
      <rect x="4" y="14" width="4" height="6" rx="1" fill={`url(#${g}-bars)`} opacity="0.7" />
      <rect x="10" y="10" width="4" height="10" rx="1" fill={`url(#${g}-bars)`} />
      <rect x="16" y="6" width="4" height="14" rx="1" fill={NEON.orange} opacity="0.9" />
      <path d="M3 20h18" stroke={NEON.purple} strokeWidth="0.8" opacity="0.5" />
    </SvgRoot>
  );
}

function StreakFlameIcon({ uid, className }: IconProps) {
  const g = `fl-${uid}`;
  return (
    <SvgRoot className={className} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={`${g}-flame`} x1="12" y1="2" x2="12" y2="22">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="35%" stopColor={NEON.orange} />
          <stop offset="100%" stopColor={NEON.red} />
        </linearGradient>
        <filter id={`${g}-glow`}>
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor={NEON.orange} floodOpacity="0.9" />
        </filter>
      </defs>
      <path
        d="M12 3c-2 3-5 4-5 8a5 5 0 0010 0c0-4-3-5-5-8zm0 18c1.5-2 4-3.5 4-6a4 4 0 00-8 0c0 2.5 2.5 4 4 6z"
        fill={`url(#${g}-flame)`}
        filter={`url(#${g}-glow)`}
      />
      <path
        d="M12 10c-.8 1.5-2 2.2-2 4a2 2 0 004 0c0-1.8-1.2-2.5-2-4z"
        fill="#fde047"
        opacity="0.85"
      />
    </SvgRoot>
  );
}

function XpGemIcon({ uid, className }: IconProps) {
  const g = `xp-${uid}`;
  return (
    <SvgRoot className={className} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={`${g}-facets`} x1="4" y1="4" x2="20" y2="20">
          <stop offset="0%" stopColor={NEON.cyan} />
          <stop offset="50%" stopColor={NEON.purple} />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
        <linearGradient id={`${g}-shine`} x1="8" y1="4" x2="16" y2="12">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id={`${g}-spark`}>
          <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor={NEON.cyan} floodOpacity="0.8" />
        </filter>
      </defs>
      <path
        d="M12 3L4 9l8 12 8-12-8-6zm0 3.5L16.5 9 12 19 7.5 9 12 6.5z"
        fill={`url(#${g}-facets)`}
        stroke={NEON.cyan}
        strokeWidth="0.6"
        filter={`url(#${g}-spark)`}
      />
      <path d="M12 6.5v12.5M7.5 9h9M4 9h16" stroke={NEON.purple} strokeWidth="0.4" opacity="0.5" />
      <path d="M9 7l3-2 3 2-1.5 4H10.5L9 7z" fill={`url(#${g}-shine)`} opacity="0.6" />
    </SvgRoot>
  );
}

const ICON_MAP: Record<
  AstroIconId,
  (props: IconProps) => ReactNode
> = {
  grammar: GrammarIcon,
  vocabulary: VocabularyIcon,
  sat: SatIcon,
  oge: OgeIcon,
  home: HomeNavIcon,
  vision: VisionNavIcon,
  review: ReviewNavIcon,
  stats: StatsNavIcon,
  settings: SettingsNavIcon,
  "streak-flame": StreakFlameIcon,
  "xp-gem": XpGemIcon,
};

export interface AstroIconProps {
  name: AstroIconId;
  className?: string;
  /** Subtle pulse for streak flame */
  pulse?: boolean;
}

export function AstroIcon({ name, className = "h-6 w-6 shrink-0", pulse }: AstroIconProps) {
  const uid = useId();
  const Icon = ICON_MAP[name];
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        pulse ? "astro-icon-flame-pulse" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon uid={uid} className="h-full w-full" />
    </span>
  );
}
