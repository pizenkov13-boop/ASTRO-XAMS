"use client";

import type { SM2Card, TopicProgress, UserProgress } from "@/types";
import { DAILY_GOAL_DEFAULT } from "@/types";
import { getLevelFromXp } from "./xp";

const STORAGE_KEY = "astro-xams-progress-v1";

export const defaultProgress = (): UserProgress => ({
  version: 1,
  xp: 0,
  level: 0,
  streak: 0,
  lastStudyDate: null,
  dailyGoal: DAILY_GOAL_DEFAULT,
  dailyCompleted: 0,
  cards: {},
  completedUnits: [],
  topicProgress: {},
});

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as UserProgress;
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  const withLevel = {
    ...progress,
    level: getLevelFromXp(progress.xp),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(withLevel));
}

export function updateDailyStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().slice(0, 10);
  if (progress.lastStudyDate === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const streak =
    progress.lastStudyDate === yesterdayStr ? progress.streak + 1 : 1;

  return {
    ...progress,
    streak,
    lastStudyDate: today,
    dailyCompleted: progress.lastStudyDate === today ? progress.dailyCompleted : 0,
  };
}

export function upsertTopicProgress(
  progress: UserProgress,
  topicId: string,
  moduleId: TopicProgress["moduleId"],
  cards: SM2Card[]
): UserProgress {
  const reviewed = cards.filter((c) => c.repetitions > 0).length;
  const retained = cards.filter(
    (c) => c.repetitions > 0 && c.nextReview > Date.now()
  ).length;
  const retentionPercent =
    cards.length === 0 ? 0 : Math.round((retained / cards.length) * 100);

  return {
    ...progress,
    topicProgress: {
      ...progress.topicProgress,
      [topicId]: {
        topicId,
        moduleId,
        totalCards: cards.length,
        reviewedCards: reviewed,
        retentionPercent,
      },
    },
  };
}
