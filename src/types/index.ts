export type ModuleId = "grammar" | "vocabulary" | "sat";

export type QuestionType = "multiple_choice" | "fill_blank" | "sentence_construction";

export type ReviewQuality = "wrong" | "hard" | "good" | "easy";

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  timeLimitSec: number;
}

export interface Unit {
  id: string;
  moduleId: ModuleId;
  number: number;
  title: string;
  level?: string;
  description: string;
  questions: Question[];
}

export interface SM2Card {
  id: string;
  unitId: string;
  moduleId: ModuleId;
  easiness: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReviewed?: number;
}

export interface TopicProgress {
  topicId: string;
  moduleId: ModuleId;
  totalCards: number;
  reviewedCards: number;
  retentionPercent: number;
}

export interface UserProgress {
  version: number;
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string | null;
  dailyGoal: number;
  dailyCompleted: number;
  cards: Record<string, SM2Card>;
  completedUnits: string[];
  topicProgress: Record<string, TopicProgress>;
}

export interface AdlibTrack {
  id: string;
  name: string;
  artist: string;
  file: string;
}

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60] as const;

export const XP_PER_CORRECT = 15;
export const XP_PER_UNIT_COMPLETE = 100;
export const DAILY_GOAL_DEFAULT = 20;
