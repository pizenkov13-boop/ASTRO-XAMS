"use client";

import type { UserProgress } from "@/types";
import { isDue } from "@/lib/sm2";

const SETTINGS_KEY = "astro-xams-notifications-v1";

export interface NotificationSettings {
  enabled: boolean;
  dueReminders: boolean;
  dailyReminder: boolean;
  dailyTime: string; // HH:mm
  lastDueNotifyAt: string | null;
  lastDailyNotifyDate: string | null;
}

export const defaultNotificationSettings = (): NotificationSettings => ({
  enabled: false,
  dueReminders: true,
  dailyReminder: true,
  dailyTime: "09:00",
  lastDueNotifyAt: null,
  lastDailyNotifyDate: null,
});

export function loadNotificationSettings(): NotificationSettings {
  if (typeof window === "undefined") return defaultNotificationSettings();
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultNotificationSettings();
    return { ...defaultNotificationSettings(), ...JSON.parse(raw) };
  } catch {
    return defaultNotificationSettings();
  }
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function countDueCards(progress: UserProgress, now = Date.now()): number {
  return Object.values(progress.cards).filter((c) => isDue(c, now)).length;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export function canUseNotifications(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

async function showNotification(title: string, body: string, tag: string) {
  if (!canUseNotifications() || Notification.permission !== "granted") return;
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg) {
        await reg.showNotification(title, {
          body,
          tag,
          icon: "/favicon.ico",
        });
        return;
      }
    }
    new Notification(title, {
      body,
      tag,
      icon: "/favicon.ico",
    });
  } catch {
    /* ignore */
  }
}

export function maybeNotifyDueCards(
  progress: UserProgress,
  settings: NotificationSettings
): NotificationSettings {
  if (!settings.enabled || !settings.dueReminders) return settings;
  if (Notification.permission !== "granted") return settings;

  const due = countDueCards(progress);
  if (due === 0) return settings;

  const now = Date.now();
  const last = settings.lastDueNotifyAt
    ? new Date(settings.lastDueNotifyAt).getTime()
    : 0;
  const fourHours = 4 * 60 * 60 * 1000;
  if (now - last < fourHours) return settings;

  void showNotification(
    "ASTRO'XAMS — Reviews due",
    `${due} card${due === 1 ? "" : "s"} ready. Knock them out before you forget.`,
    "astro-due-review"
  );

  return { ...settings, lastDueNotifyAt: new Date().toISOString() };
}

export function maybeNotifyDailyReminder(
  settings: NotificationSettings
): NotificationSettings {
  if (!settings.enabled || !settings.dailyReminder) return settings;
  if (Notification.permission !== "granted") return settings;

  const today = new Date().toISOString().slice(0, 10);
  if (settings.lastDailyNotifyDate === today) return settings;

  const [hh, mm] = settings.dailyTime.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hh, mm ?? 0, 0, 0);

  const diffMs = now.getTime() - target.getTime();
  if (diffMs < 0 || diffMs > 5 * 60 * 1000) return settings;

  void showNotification(
    "ASTRO'XAMS — Daily orbit",
    "Time to study. Grammar, words, SAT — pick one and move.",
    "astro-daily"
  );

  return { ...settings, lastDailyNotifyDate: today };
}
