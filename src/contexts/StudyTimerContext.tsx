"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { formatStudyDuration } from "@/lib/format-duration";
import {
  addStudySeconds,
  getTodayStudySeconds,
  getWeeklyStudySeconds,
} from "@/lib/study-stats";
import { isStudyRoute } from "@/lib/study-timer-paths";

interface StudyTimerContextValue {
  todaySeconds: number;
  weeklySeconds: number;
  todayFormatted: string;
  weeklyFormatted: string;
  isTracking: boolean;
  refresh: () => void;
}

const StudyTimerContext = createContext<StudyTimerContextValue | null>(null);

const FLUSH_INTERVAL_MS = 5_000;

export function StudyTimerProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tracking = isStudyRoute(pathname ?? "");
  const [todaySeconds, setTodaySeconds] = useState(0);
  const [weeklySeconds, setWeeklySeconds] = useState(0);
  const pendingRef = useRef(0);
  const lastFlushRef = useRef(Date.now());

  const refresh = useCallback(() => {
    setTodaySeconds(getTodayStudySeconds());
    setWeeklySeconds(getWeeklyStudySeconds(7));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!tracking) {
      if (pendingRef.current > 0) {
        addStudySeconds(pendingRef.current);
        pendingRef.current = 0;
        refresh();
      }
      return;
    }

    lastFlushRef.current = Date.now();

    const tick = () => {
      if (document.visibilityState !== "visible") return;
      pendingRef.current += 1;
      setTodaySeconds(getTodayStudySeconds() + pendingRef.current);
      setWeeklySeconds(getWeeklyStudySeconds(7));

      const now = Date.now();
      if (now - lastFlushRef.current >= FLUSH_INTERVAL_MS) {
        addStudySeconds(pendingRef.current);
        pendingRef.current = 0;
        lastFlushRef.current = now;
        refresh();
      }
    };

    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearInterval(id);
      if (pendingRef.current > 0) {
        addStudySeconds(pendingRef.current);
        pendingRef.current = 0;
      }
      refresh();
    };
  }, [tracking, refresh]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden" && pendingRef.current > 0) {
        addStudySeconds(pendingRef.current);
        pendingRef.current = 0;
        refresh();
      }
    };
    const onUnload = () => {
      if (pendingRef.current > 0) {
        addStudySeconds(pendingRef.current);
        pendingRef.current = 0;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [refresh]);

  const value = useMemo(
    () => ({
      todaySeconds,
      weeklySeconds,
      todayFormatted: formatStudyDuration(todaySeconds),
      weeklyFormatted: formatStudyDuration(weeklySeconds),
      isTracking: tracking,
      refresh,
    }),
    [todaySeconds, weeklySeconds, tracking, refresh]
  );

  return (
    <StudyTimerContext.Provider value={value}>{children}</StudyTimerContext.Provider>
  );
}

export function useStudyTimer() {
  const ctx = useContext(StudyTimerContext);
  if (!ctx) {
    throw new Error("useStudyTimer must be used within StudyTimerProvider");
  }
  return ctx;
}
