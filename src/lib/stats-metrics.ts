import type { ModuleId, UserProgress } from "@/types";
import { retentionPercent } from "@/lib/sm2";
import { dayStudied, loadStudyStats, todayKey } from "@/lib/study-stats";

export const IELTS_EXAM_DATE = new Date("2027-06-01T00:00:00");
export const SAT_EXAM_DATE = new Date("2027-08-01T00:00:00");

export interface HeatmapDay {
  date: string;
  studied: boolean;
  isFuture: boolean;
}

/** GitHub-style grid: columns = weeks (oldest → newest), each column Sun→Sat. */
export function buildHeatmapWeeks(weekCount = 12): HeatmapDay[][] {
  const stats = loadStudyStats();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(today);
  const start = new Date(end);
  start.setDate(start.getDate() - weekCount * 7 + 1);
  while (start.getDay() !== 0) {
    start.setDate(start.getDate() - 1);
  }

  const weeks: HeatmapDay[][] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const week: HeatmapDay[] = [];
    for (let row = 0; row < 7; row++) {
      const d = new Date(cursor);
      d.setDate(cursor.getDate() + row);
      const key = todayKey(d);
      const isFuture = d > end;
      week.push({
        date: key,
        isFuture,
        studied: !isFuture && dayStudied(key, stats),
      });
    }
    weeks.push(week);
    cursor.setDate(cursor.getDate() + 7);
  }

  return weeks;
}

export interface WeekdayQuestionCount {
  label: string;
  count: number;
  date: string;
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

const WEEKDAY_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_LABELS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function getThisWeekQuestionCounts(
  locale: "en" | "ru" = "en"
): WeekdayQuestionCount[] {
  const stats = loadStudyStats();
  const monday = getMonday(new Date());
  const labels = locale === "ru" ? WEEKDAY_LABELS_RU : WEEKDAY_LABELS_EN;

  return labels.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = todayKey(d);
    return {
      label,
      count: stats.questionsByDay[key] ?? 0,
      date: key,
    };
  });
}

export function getModuleRetention(
  progress: UserProgress,
  moduleId: ModuleId
): number {
  const cards = Object.values(progress.cards).filter((c) => c.moduleId === moduleId);
  return retentionPercent(cards);
}

export function daysUntilExam(target: Date, from = new Date()): number {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  const end = new Date(target);
  end.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / 86_400_000));
}

export function maxWeekQuestionCount(days: WeekdayQuestionCount[]): number {
  return Math.max(1, ...days.map((d) => d.count));
}
