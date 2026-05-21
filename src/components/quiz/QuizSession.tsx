"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question, ReviewQuality, Unit, UserProgress } from "@/types";
import type { QuizResult } from "@/types/quiz";
import { playRandomAdlib, playCelebration, preloadAdlibs } from "@/lib/adlibs";
import { createCard, reviewCard } from "@/lib/sm2";
import { sortQuestionsForSession } from "@/lib/quiz-order";
import { useTopicExplanation } from "@/hooks/useTopicExplanation";
import { useLocale } from "@/lib/i18n/context";
import { QuizEffects } from "./QuizEffects";
import { RatingButtons } from "./RatingButtons";
import { TopicExplanation } from "./TopicExplanation";

const MIN_QUESTIONS = 10;
const STREAK_CELEBRATION = 5;

function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/[.!?]+$/, "");
}

function checkAnswer(question: Question, userInput: string): boolean {
  const normalized = normalizeAnswer(userInput);
  const correct = question.correctAnswer;
  if (Array.isArray(correct)) {
    return correct.some((c) => normalizeAnswer(c) === normalized);
  }
  return normalizeAnswer(correct) === normalized;
}

function formatCorrectAnswer(q: Question): string {
  const c = q.correctAnswer;
  return Array.isArray(c) ? c[0] : c;
}

interface QuizSessionProps {
  unit: Unit;
  progress: UserProgress;
  onProgressUpdate: (p: UserProgress) => void;
  onComplete: (result: QuizResult) => void;
  onCorrect?: () => void;
}

export function QuizSession({
  unit,
  progress,
  onProgressUpdate,
  onComplete,
  onCorrect,
}: QuizSessionProps) {
  const { t } = useLocale();
  const [explainOpen, setExplainOpen] = useState(false);

  const questions = useMemo(() => {
    const pool = [...unit.questions];
    while (pool.length < MIN_QUESTIONS) {
      pool.push(...unit.questions);
    }
    const sliced = pool.slice(0, Math.max(MIN_QUESTIONS, unit.questions.length));
    return sortQuestionsForSession(sliced, unit, progress);
  }, [unit.questions, unit, progress]);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [flash, setFlash] = useState(false);
  const [shake, setShake] = useState(false);
  const [wild, setWild] = useState(false);
  const [adlibLabel, setAdlibLabel] = useState<string | undefined>();
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState<ReviewQuality | null>(null);
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimitSec ?? 30);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);

  const {
    explanation: aiExplanation,
    loading: aiLoading,
    error: aiError,
    fetchExplanation,
    reset: resetAi,
  } = useTopicExplanation();

  const q = questions[index];

  useEffect(() => {
    void preloadAdlibs();
  }, []);

  useEffect(() => {
    if (answered) return;
    setTimeLeft(q.timeLimitSec);
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [index, q.timeLimitSec, answered]);

  const applySm2 = useCallback(
    (quality: ReviewQuality, cardId: string) => {
      let card = progress.cards[cardId];
      if (!card) {
        card = createCard(cardId, unit.id, unit.moduleId);
      }
      const nextProgress = {
        ...progress,
        cards: {
          ...progress.cards,
          [cardId]: reviewCard(card, quality),
        },
      };
      onProgressUpdate(nextProgress);
    },
    [progress, unit.id, unit.moduleId, onProgressUpdate]
  );

  const handleSubmit = useCallback(
    (timedOut = false) => {
      if (answered) return;
      setAnswered(true);

      const userAnswer =
        q.type === "multiple_choice" ? (selected ?? "") : input;
      const correct =
        !timedOut &&
        (q.type === "multiple_choice"
          ? selected === q.correctAnswer
          : checkAnswer(q, userAnswer));

      setWasCorrect(correct);
      const cardId = `${unit.id}-${q.id}`;
      setPendingCardId(cardId);
      setExplainOpen(false);
      resetAi();

      if (correct) {
        setCorrectCount((c) => c + 1);
        setFlash(true);
        setTimeout(() => setFlash(false), 350);

        void playRandomAdlib().then((track) => {
          if (track.file) setAdlibLabel(`${track.name}!`);
          setTimeout(() => setAdlibLabel(undefined), 1200);
        });

        const newStreak = sessionStreak + 1;
        setSessionStreak(newStreak);
        if (newStreak >= STREAK_CELEBRATION && newStreak % STREAK_CELEBRATION === 0) {
          void playCelebration();
          setWild(true);
          setTimeout(() => setWild(false), 2500);
        }
        onCorrect?.();
      } else {
        setSessionStreak(0);
        setShake(true);
        applySm2("wrong", cardId);
        setRated(true);
        setTimeout(() => setShake(false), 400);
      }
    },
    [
      answered,
      q,
      selected,
      input,
      unit,
      sessionStreak,
      resetAi,
      applySm2,
      onCorrect,
    ]
  );

  useEffect(() => {
    if (timeLeft === 0 && !answered) {
      handleSubmit(true);
    }
  }, [timeLeft, answered, handleSubmit]);

  const handleRate = (quality: ReviewQuality) => {
    if (!pendingCardId || rated) return;
    setRating(quality);
    applySm2(quality, pendingCardId);
    setRated(true);
  };

  const canProceed = wasCorrect ? rated : answered;

  const handleExplain = () => {
    setExplainOpen(true);
    void fetchExplanation({
      topic: unit.description || unit.title,
      question: q.prompt,
      correctAnswer: formatCorrectAnswer(q),
    });
  };

  const goNext = () => {
    const isLast = index + 1 >= questions.length;
    if (isLast) {
      const total = questions.length;
      const correct = correctCount;
      onComplete({
        scorePercent: Math.round((correct / total) * 100),
        correct,
        total,
      });
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setSelected(null);
    setAnswered(false);
    setWasCorrect(false);
    setRated(false);
    setRating(null);
    setPendingCardId(null);
    setExplainOpen(false);
    resetAi();
  };

  const timerPct = (timeLeft / q.timeLimitSec) * 100;
  const scoreSoFar = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="relative mx-auto max-w-2xl">
      <QuizEffects flash={flash} shake={shake} wild={wild} adlibLabel={adlibLabel} />

      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {t("quiz.question", { current: index + 1, total: questions.length })}
        </span>
        <div className="flex gap-3 font-mono">
          <span className="text-astro-cyan">{scoreSoFar}%</span>
          <span className="text-astro-orange">🔥 {sessionStreak}</span>
        </div>
      </div>

      <div className="mb-4 h-1 overflow-hidden rounded-full bg-astro-surface">
        <motion.div
          className={`h-full ${timeLeft < 5 ? "bg-red-500" : "bg-astro-cyan"}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-2xl border border-astro-purple/30 bg-astro-card p-6"
        >
          <p className="text-xs uppercase tracking-wider text-astro-purple">
            {q.type.replace(/_/g, " ")}
          </p>
          <h2 className="mt-2 font-display text-xl text-white">{q.prompt}</h2>

          {q.type === "multiple_choice" && q.options && (
            <ul className="mt-6 space-y-2">
              {q.options.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    disabled={answered}
                    onClick={() => setSelected(opt)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                      selected === opt
                        ? "border-astro-orange bg-astro-orange/20"
                        : "border-astro-surface hover:border-astro-purple/50"
                    } ${answered && opt === q.correctAnswer ? "border-green-500/50" : ""}
                    ${answered && selected === opt && opt !== q.correctAnswer ? "border-red-500/50" : ""}`}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {(q.type === "fill_blank" || q.type === "sentence_construction") && (
            <textarea
              className="mt-6 w-full rounded-lg border border-astro-surface bg-astro-bg p-3 text-white focus:border-astro-orange focus:outline-none"
              rows={q.type === "sentence_construction" ? 3 : 1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={answered}
              placeholder={t("quiz.placeholder")}
            />
          )}

          {answered && !wasCorrect && (
            <TopicExplanation
              staticExplanation={q.explanation}
              aiExplanation={aiExplanation}
              loading={aiLoading}
              error={aiError}
              showAi={explainOpen}
              onExplain={handleExplain}
            />
          )}

          {answered && wasCorrect && !rated && (
            <RatingButtons onRate={handleRate} selected={rating} />
          )}

          {answered && wasCorrect && rated && (
            <p className="mt-2 text-xs text-gray-500">
              {t("quiz.scheduled", { rating: rating ?? "" })}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            {!answered ? (
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="rounded-lg bg-gradient-to-r from-astro-orange to-astro-purple px-6 py-2 font-semibold text-white"
              >
                {t("quiz.submit")}
              </button>
            ) : (
              <button
                type="button"
                disabled={!canProceed}
                onClick={goNext}
                className="rounded-lg border border-astro-cyan px-6 py-2 text-astro-cyan disabled:opacity-40"
              >
                {index + 1 >= questions.length ? t("quiz.finish") : t("quiz.next")}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
