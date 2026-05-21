"use client";

import { useEffect, useState } from "react";
import {
  canUseNotifications,
  defaultNotificationSettings,
  loadNotificationSettings,
  requestNotificationPermission,
  saveNotificationSettings,
  type NotificationSettings,
} from "@/lib/notifications";
import { registerServiceWorker, syncStateToServiceWorker } from "@/lib/service-worker";

export function NotificationSettingsPanel() {
  const [settings, setSettings] = useState<NotificationSettings>(
    defaultNotificationSettings
  );
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSettings(loadNotificationSettings());
    setSupported(canUseNotifications());
    if (canUseNotifications()) {
      setPermission(Notification.permission);
    }
  }, []);

  const update = (patch: Partial<NotificationSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveNotificationSettings(next);
    void syncStateToServiceWorker();
  };

  const enableNotifications = async () => {
    const perm = await requestNotificationPermission();
    setPermission(perm);
    if (perm === "granted") {
      update({ enabled: true });
      const reg = await registerServiceWorker();
      await syncStateToServiceWorker(reg);
    }
  };

  if (!supported) {
    return (
      <p className="text-sm text-gray-500">
        Browser notifications are not supported in this environment.
      </p>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-astro-purple/30 bg-astro-card p-5">
      <h3 className="font-display text-lg font-semibold text-white">Notifications</h3>
      <p className="text-sm text-gray-500">
        Get reminded when SM-2 cards are due and at your daily study time.
      </p>

      {permission === "denied" && (
        <p className="text-sm text-red-400">
          Notifications are blocked. Enable them in your browser site settings.
        </p>
      )}

      {permission !== "granted" ? (
        <button
          type="button"
          onClick={() => void enableNotifications()}
          className="rounded-lg bg-astro-orange px-4 py-2 text-sm font-semibold text-black"
        >
          Enable notifications
        </button>
      ) : (
        <>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => update({ enabled: e.target.checked })}
              className="accent-astro-orange"
            />
            <span>Notifications on</span>
          </label>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={settings.dueReminders}
              disabled={!settings.enabled}
              onChange={(e) => update({ dueReminders: e.target.checked })}
              className="accent-astro-orange"
            />
            <span>Remind when review cards are due</span>
          </label>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={settings.dailyReminder}
              disabled={!settings.enabled}
              onChange={(e) => update({ dailyReminder: e.target.checked })}
              className="accent-astro-orange"
            />
            <span>Daily study reminder</span>
          </label>

          <div>
            <label className="text-xs text-gray-500">Daily reminder time</label>
            <input
              type="time"
              value={settings.dailyTime}
              disabled={!settings.enabled || !settings.dailyReminder}
              onChange={(e) => update({ dailyTime: e.target.value })}
              className="mt-1 block rounded-lg border border-astro-surface bg-astro-bg px-3 py-2 text-white"
            />
          </div>
        </>
      )}
    </div>
  );
}
