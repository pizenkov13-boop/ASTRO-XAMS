"use client";

const STORAGE_KEY = "astro-xams-study-stats-v1";

export interface StudyStats {
  version: number;
  /** Total study seconds per calendar day (YYYY-MM-DD). */
  studySecondsByDay: Record<string, number>;
  /** Questions answered per calendar day (YYYY-MM-DD). */
  questionsByDay: Record<string, number>;
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function defaultStudyStats(): StudyStats {
  return {
    version: 1,
    studySecondsByDay: {},
    questionsByDay: {},
  };
}

export function loadStudyStats(): StudyStats {
  if (typeof window === "undefined") return defaultStudyStats();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStudyStats();
    const parsed = JSON.parse(raw) as StudyStats;
    return {
      ...defaultStudyStats(),
      ...parsed,
      studySecondsByDay: parsed.studySecondsByDay ?? {},
      questionsByDay: parsed.questionsByDay ?? {},
    };
  } catch {
    return defaultStudyStats();
  }
}

export function saveStudyStats(stats: StudyStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function addStudySeconds(seconds: number, dateKey = todayKey()): StudyStats {
  if (seconds <= 0) return loadStudyStats();
  const stats = loadStudyStats();
  const prev = stats.studySecondsByDay[dateKey] ?? 0;
  stats.studySecondsByDay[dateKey] = prev + seconds;
  saveStudyStats(stats);
  return stats;
}

export function recordQuestionAnswered(dateKey = todayKey()): StudyStats {
  const stats = loadStudyStats();
  stats.questionsByDay[dateKey] = (stats.questionsByDay[dateKey] ?? 0) + 1;
  saveStudyStats(stats);
  return stats;
}

export function getTodayStudySeconds(dateKey = todayKey()): number {
  return loadStudyStats().studySecondsByDay[dateKey] ?? 0;
}

export function getWeeklyStudySeconds(days = 7, endDate = new Date()): number {
  const stats = loadStudyStats();
  let total = 0;
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i++) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    total += stats.studySecondsByDay[todayKey(d)] ?? 0;
  }
  return total;
}

export function dayStudied(dateKey: string, stats = loadStudyStats()): boolean {
  return (
    (stats.studySecondsByDay[dateKey] ?? 0) > 0 ||
    (stats.questionsByDay[dateKey] ?? 0) > 0
  );
}
