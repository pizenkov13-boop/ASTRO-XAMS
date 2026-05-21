import type { UserProgress } from "@/types";
import { grammarUnits } from "@/data/grammar";
import { vocabularyUnits } from "@/data/vocabulary";
import { satUnits } from "@/data/sat";

export const SAT_TARGET_SCORE = 1600;
export const GRAMMAR_UNIT_TOTAL = 115;
export const WORDS_BOOK_TOTAL = 4000;
export const VOCAB_UNIT_TOTAL = vocabularyUnits.length;

export interface VisionStats {
  streak: number;
  grammarCompleted: number;
  grammarTotal: number;
  grammarPercent: number;
  satCompleted: number;
  satTotal: number;
  satPercent: number;
  estimatedSatScore: number;
  wordsLearned: number;
  wordsTotal: number;
  vocabUnitsCompleted: number;
}

export function getVisionStats(progress: UserProgress): VisionStats {
  const completed = progress.completedUnits;
  const grammarCompleted = completed.filter((id) => id.startsWith("grammar")).length;
  const vocabUnitsCompleted = completed.filter((id) => id.startsWith("vocab")).length;
  const satCompleted = completed.filter((id) => id.startsWith("sat")).length;
  const satTotal = satUnits.length;
  const satPercent =
    satTotal === 0 ? 0 : Math.round((satCompleted / satTotal) * 100);

  const wordsLearned = Math.min(
    WORDS_BOOK_TOTAL,
    Math.round((vocabUnitsCompleted / Math.max(VOCAB_UNIT_TOTAL, 1)) * WORDS_BOOK_TOTAL)
  );

  return {
    streak: progress.streak,
    grammarCompleted,
    grammarTotal: GRAMMAR_UNIT_TOTAL,
    grammarPercent: Math.round(
      (grammarCompleted / GRAMMAR_UNIT_TOTAL) * 100
    ),
    satCompleted,
    satTotal,
    satPercent,
    estimatedSatScore: Math.min(
      SAT_TARGET_SCORE,
      Math.round((satCompleted / Math.max(satTotal, 1)) * SAT_TARGET_SCORE)
    ),
    wordsLearned,
    wordsTotal: WORDS_BOOK_TOTAL,
    vocabUnitsCompleted,
  };
}
