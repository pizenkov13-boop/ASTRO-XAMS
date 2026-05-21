"use client";

import { useEffect, useRef } from "react";
import { loadProgress } from "@/lib/storage";
import {
  loadNotificationSettings,
  maybeNotifyDailyReminder,
  maybeNotifyDueCards,
  saveNotificationSettings,
} from "@/lib/notifications";
import { syncStateToServiceWorker } from "@/lib/service-worker";

/** Polls for due-card and daily reminders when notifications are enabled. */
export function NotificationScheduler() {
  const settingsRef = useRef(loadNotificationSettings());

  useEffect(() => {
    const tick = () => {
      const progress = loadProgress();
      let settings = settingsRef.current;
      settings = maybeNotifyDueCards(progress, settings);
      settings = maybeNotifyDailyReminder(settings);
      settingsRef.current = settings;
      saveNotificationSettings(settings);
      void syncStateToServiceWorker();
    };

    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return null;
}
