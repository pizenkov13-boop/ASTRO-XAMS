import type { ReviewQuality, SM2Card } from "@/types";
import { REVIEW_INTERVALS } from "@/types";

const DEFAULT_EASINESS = 2.5;
const MIN_EASINESS = 1.3;

function daysToMs(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}

function getBaseInterval(repetitions: number): number {
  const idx = Math.min(repetitions, REVIEW_INTERVALS.length - 1);
  return REVIEW_INTERVALS[idx];
}

export function createCard(
  id: string,
  unitId: string,
  moduleId: SM2Card["moduleId"]
): SM2Card {
  return {
    id,
    unitId,
    moduleId,
    easiness: DEFAULT_EASINESS,
    interval: 1,
    repetitions: 0,
    nextReview: Date.now(),
  };
}

export function isDue(card: SM2Card, now = Date.now()): boolean {
  return card.nextReview <= now;
}

export function reviewCard(card: SM2Card, quality: ReviewQuality): SM2Card {
  const now = Date.now();
  let { easiness, interval, repetitions } = card;

  if (quality === "wrong") {
    repetitions = 0;
    interval = 1;
    return {
      ...card,
      easiness: Math.max(MIN_EASINESS, easiness - 0.2),
      interval,
      repetitions,
      nextReview: now + daysToMs(1),
      lastReviewed: now,
    };
  }

  repetitions += 1;

  if (quality === "hard") {
    interval = Math.max(1, Math.round(interval * 1.2));
    easiness = Math.max(MIN_EASINESS, easiness - 0.15);
  } else if (quality === "easy") {
    interval = Math.max(1, Math.round(interval * 2.5));
    easiness = Math.min(3, easiness + 0.15);
  } else {
    interval = getBaseInterval(repetitions);
  }

  return {
    ...card,
    easiness,
    interval,
    repetitions,
    nextReview: now + daysToMs(interval),
    lastReviewed: now,
  };
}

export function retentionPercent(cards: SM2Card[]): number {
  if (cards.length === 0) return 0;
  const now = Date.now();
  const retained = cards.filter(
    (c) => c.repetitions > 0 && c.nextReview > now
  ).length;
  return Math.round((retained / cards.length) * 100);
}
