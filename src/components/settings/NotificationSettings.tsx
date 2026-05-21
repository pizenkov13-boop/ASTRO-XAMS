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
import { useLocale } from "@/lib/i18n/context";

export function NotificationSettingsPanel() {
  const { t } = useLocale();
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
      <p className="w-full text-base text-gray-500">{t("notifications.unsupported")}</p>
    );
  }

  return (
    <div className="w-full space-y-4 rounded-xl border border-astro-purple/30 bg-astro-card p-4 sm:p-5">
      <h3 className="font-display text-lg font-semibold text-white">{t("notifications.title")}</h3>
      <p className="w-full text-base text-gray-500">{t("notifications.hint")}</p>

      {permission === "denied" && (
        <p className="w-full text-base text-red-400">{t("notifications.blocked")}</p>
      )}

      {permission !== "granted" ? (
        <button
          type="button"
          onClick={() => void enableNotifications()}
          className="touch-target-lg w-full rounded-xl bg-astro-orange px-4 text-base font-semibold text-black"
        >
          {t("notifications.enable")}
        </button>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <label className="flex min-h-[52px] w-full cursor-pointer items-center gap-4 text-base">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => update({ enabled: e.target.checked })}
              className="h-5 w-5 shrink-0 accent-astro-orange"
            />
            <span className="flex-1">{t("notifications.on")}</span>
          </label>

          <label className="flex min-h-[52px] w-full cursor-pointer items-center gap-4 text-base">
            <input
              type="checkbox"
              checked={settings.dueReminders}
              disabled={!settings.enabled}
              onChange={(e) => update({ dueReminders: e.target.checked })}
              className="h-5 w-5 shrink-0 accent-astro-orange"
            />
            <span className="flex-1">{t("notifications.dueReminders")}</span>
          </label>

          <label className="flex min-h-[52px] w-full cursor-pointer items-center gap-4 text-base">
            <input
              type="checkbox"
              checked={settings.dailyReminder}
              disabled={!settings.enabled}
              onChange={(e) => update({ dailyReminder: e.target.checked })}
              className="h-5 w-5 shrink-0 accent-astro-orange"
            />
            <span className="flex-1">{t("notifications.dailyReminder")}</span>
          </label>

          <div className="w-full">
            <label className="block text-base text-gray-500">{t("notifications.dailyTime")}</label>
            <input
              type="time"
              value={settings.dailyTime}
              disabled={!settings.enabled || !settings.dailyReminder}
              onChange={(e) => update({ dailyTime: e.target.value })}
              className="input-mobile mt-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}
