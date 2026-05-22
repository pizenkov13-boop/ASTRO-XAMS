/* ASTRO'XAMS notification service worker */
const CACHE = "astro-xams-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;

  if (data.type === "SYNC_STATE") {
    event.waitUntil(persistState(data.payload));
  }

  if (data.type === "SCHEDULE_CHECKS") {
    event.waitUntil(scheduleChecks());
  }
});

async function persistState(payload) {
  const cache = await caches.open(CACHE);
  await cache.put(
    new Request("/__astro_sw_state__"),
    new Response(JSON.stringify(payload ?? {}), {
      headers: { "Content-Type": "application/json" },
    })
  );
}

async function readState() {
  try {
    const cache = await caches.open(CACHE);
    const res = await cache.match("/__astro_sw_state__");
    if (!res) return null;
    return res.json();
  } catch {
    return null;
  }
}

function parseTime(hhmm) {
  const [hh, mm] = (hhmm || "09:00").split(":").map(Number);
  return { hh: hh || 9, mm: mm || 0 };
}

/** SM-2 cards use nextReview (epoch ms), not dueAt. */
function isDue(card, now) {
  if (!card || card.nextReview == null) return false;
  return Number(card.nextReview) <= now;
}

function countDueCards(progress, now = Date.now()) {
  if (!progress?.cards) return 0;
  return Object.values(progress.cards).filter((c) => isDue(c, now)).length;
}

function notifyStrings(state) {
  const n = state?.notify;
  if (n?.dueTitle) return n;
  return {
    dueTitle: "ASTRO'XAMS — Reviews due",
    dueBody: "{count} card ready. Knock them out before you forget.",
    dueBodyPlural: "{count} cards ready. Knock them out before you forget.",
    dailyTitle: "ASTRO'XAMS — Daily orbit",
    dailyBody: "Time to study. Grammar, words, SAT — pick one and move.",
  };
}

async function maybeNotifyDue(settings, progress, now, strings) {
  if (!settings?.enabled || !settings.dueReminders) return settings;

  const due = countDueCards(progress, now);
  if (due === 0) return settings;

  const last = settings.lastDueNotifyAt
    ? new Date(settings.lastDueNotifyAt).getTime()
    : 0;
  const fourHours = 4 * 60 * 60 * 1000;
  if (now - last < fourHours) return settings;

  const bodyTemplate = due === 1 ? strings.dueBody : strings.dueBodyPlural;
  const body = bodyTemplate.replace("{count}", String(due));

  await self.registration.showNotification(strings.dueTitle, {
    body,
    tag: "astro-due-review",
    icon: "/favicon.ico",
  });

  return { ...settings, lastDueNotifyAt: new Date(now).toISOString() };
}

async function maybeNotifyDaily(settings, now, strings) {
  if (!settings?.enabled || !settings.dailyReminder) return settings;

  const today = new Date(now).toISOString().slice(0, 10);
  if (settings.lastDailyNotifyDate === today) return settings;

  const { hh, mm } = parseTime(settings.dailyTime);
  const target = new Date(now);
  target.setHours(hh, mm, 0, 0);

  const diffMs = now - target.getTime();
  if (diffMs < 0 || diffMs > 5 * 60 * 1000) return settings;

  await self.registration.showNotification(strings.dailyTitle, {
    body: strings.dailyBody,
    tag: "astro-daily",
    icon: "/favicon.ico",
  });

  return { ...settings, lastDailyNotifyDate: today };
}

async function runChecks() {
  const state = await readState();
  if (!state) return;

  const now = Date.now();
  let settings = state.settings ?? {};
  const progress = state.progress ?? { cards: {} };
  const strings = notifyStrings(state);

  settings = await maybeNotifyDue(settings, progress, now, strings);
  settings = await maybeNotifyDaily(settings, now, strings);

  await persistState({ ...state, settings, lastCheckAt: now });
}

async function scheduleChecks() {
  await runChecks();
  const interval = setInterval(() => {
    runChecks();
  }, 60_000);
  self.__astroCheckInterval = interval;
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("/");
    })
  );
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "astro-notify") {
    event.waitUntil(runChecks());
  }
});
