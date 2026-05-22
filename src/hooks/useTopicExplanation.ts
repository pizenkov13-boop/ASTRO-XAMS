"use client";

import { useCallback, useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import type { ModuleId } from "@/types";

export function useTopicExplanation() {
  const { locale, t } = useLocale();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = useCallback(
    async (params: {
      topic: string;
      question: string;
      correctAnswer: string;
      moduleId?: ModuleId;
    }) => {
      setLoading(true);
      setError(null);
      setExplanation(null);

      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...params, locale }),
        });
        const data = (await res.json()) as {
          explanation?: string;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error ?? "Failed");
        setExplanation(data.explanation ?? null);
      } catch {
        setError(t("quiz.aiError"));
      } finally {
        setLoading(false);
      }
    },
    [locale, t]
  );

  const reset = useCallback(() => {
    setExplanation(null);
    setError(null);
    setLoading(false);
  }, []);

  return { explanation, loading, error, fetchExplanation, reset };
}
