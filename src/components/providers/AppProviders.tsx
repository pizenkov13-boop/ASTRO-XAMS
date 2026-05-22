"use client";

import { AstroChat } from "@/components/chat/AstroChat";
import { StudyTimerProvider } from "@/contexts/StudyTimerContext";
import { LocaleProvider } from "@/lib/i18n/context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <StudyTimerProvider>
        {children}
        <AstroChat />
      </StudyTimerProvider>
    </LocaleProvider>
  );
}
