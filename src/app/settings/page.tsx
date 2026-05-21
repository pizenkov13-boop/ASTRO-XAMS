"use client";

import Link from "next/link";
import { StreakBar } from "@/components/layout/StreakBar";
import { NotificationSettingsPanel } from "@/components/settings/NotificationSettings";
import { useProgress } from "@/hooks/useProgress";

export default function SettingsPage() {
  const { progress, hydrated, levelTitle } = useProgress();

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-astro-bg">
      <StreakBar
        streak={progress.streak}
        xp={progress.xp}
        levelTitle={levelTitle}
        dailyCompleted={progress.dailyCompleted}
        dailyGoal={progress.dailyGoal}
      />
      <main className="mx-auto max-w-lg px-4 py-8">
        <Link href="/" className="text-sm text-astro-purple hover:text-astro-orange">
          ← Dashboard
        </Link>
        <h1 className="mt-4 font-display text-2xl font-bold text-white">Settings</h1>
        <div className="mt-6">
          <NotificationSettingsPanel />
        </div>
      </main>
    </div>
  );
}
