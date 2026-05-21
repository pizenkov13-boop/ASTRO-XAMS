"use client";

import { loadProgress } from "@/lib/storage";
import { loadNotificationSettings } from "@/lib/notifications";

const SW_PATH = "/sw.js";

export function isServiceWorkerSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.register(SW_PATH, {
      scope: "/",
    });

    await syncStateToServiceWorker(registration);
    postToWorker(registration, { type: "SCHEDULE_CHECKS" });

    if ("periodicSync" in registration) {
      try {
        await (
          registration as ServiceWorkerRegistration & {
            periodicSync: { register: (tag: string, opts: { minInterval: number }) => Promise<void> };
          }
        ).periodicSync.register("astro-notify", {
          minInterval: 60 * 60 * 1000,
        });
      } catch {
        /* periodicSync requires permission; interval polling is fallback */
      }
    }

    return registration;
  } catch {
    return null;
  }
}

function postToWorker(
  registration: ServiceWorkerRegistration,
  message: Record<string, unknown>
) {
  const worker =
    registration.active ??
    registration.waiting ??
    registration.installing;
  worker?.postMessage(message);
}

export async function syncStateToServiceWorker(
  registration?: ServiceWorkerRegistration | null
): Promise<void> {
  if (!isServiceWorkerSupported()) return;

  const reg =
    registration ?? (await navigator.serviceWorker.getRegistration());

  const payload = {
    settings: loadNotificationSettings(),
    progress: loadProgress(),
    syncedAt: Date.now(),
  };

  if (reg?.active) {
    postToWorker(reg, { type: "SYNC_STATE", payload });
    return;
  }

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SYNC_STATE",
      payload,
    });
  }
}
