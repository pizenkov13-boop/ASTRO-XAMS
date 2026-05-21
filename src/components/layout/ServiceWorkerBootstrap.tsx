"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/service-worker";

/** Registers the notification service worker on app load. */
export function ServiceWorkerBootstrap() {
  useEffect(() => {
    void registerServiceWorker();
  }, []);

  return null;
}
