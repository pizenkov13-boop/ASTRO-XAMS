"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Unit } from "@/types";
import type { QuizResult } from "@/types/quiz";
import { QuizSession } from "@/components/quiz/QuizSession";
import { StreakBar } from "@/components/layout/StreakBar";
import { SpotifyReward } from "@/components/spotify/SpotifyReward";
import { useProgress } from "@/hooks/useProgress";
import { saveProgress } from "@/lib/storage";

interface UnitQuizShellProps {
  unit: Unit;
  backHref: string;
  backLabel?: string;
}

export function UnitQuizShell({
  unit,
  backHref,
  backLabel = "← All units",
}: UnitQuizShellProps) {
  const router = useRouter();
  const { progress, setProgress, hydrated, levelTitle, onCorrectAnswer, onUnitComplete } =
    useProgress();
  const [showReward, setShowReward] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  if (!hydrated) return null;

  const handleComplete = (result: QuizResult) => {
    onUnitComplete(unit.id);
    if (result.scorePercent >= 80) {
      setQuizResult(result);
      setShowReward(true);
    } else {
      router.push(backHref);
    }
  };

  const closeReward = () => {
    setShowReward(false);
    router.push(backHref);
  };

  return (
    <div className="min-h-screen bg-astro-bg">
      <StreakBar
        streak={progress.streak}
        xp={progress.xp}
        levelTitle={levelTitle}
        dailyCompleted={progress.dailyCompleted}
        dailyGoal={progress.dailyGoal}
      />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href={backHref} className="text-sm text-astro-purple hover:text-astro-orange">
          {backLabel}
        </Link>
        <h1 className="mt-4 font-display text-2xl text-white">{unit.title}</h1>
        <p className="mb-8 text-sm text-gray-500">{unit.description}</p>
        <QuizSession
          unit={unit}
          progress={progress}
          onProgressUpdate={(p) => {
            setProgress(p);
            saveProgress(p);
          }}
          onCorrect={onCorrectAnswer}
          onComplete={handleComplete}
        />
      </main>
      {quizResult && (
        <SpotifyReward
          open={showReward}
          scorePercent={quizResult.scorePercent}
          onClose={closeReward}
        />
      )}
    </div>
  );
}
