"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question, QuestionType, ReviewQuality, Unit, UserProgress } from "@/types";
import type { QuizResult } from "@/types/quiz";
import { playRandomAdlib, playCelebration, preloadAdlibs } from "@/lib/adlibs";
import { createCard, reviewCard } from "@/lib/sm2";
import { sortQuestionsForSession } from "@/lib/quiz-order";
import { useStudyTimer } from "@/contexts/StudyTimerContext";
import { useTopicExplanation } from "@/hooks/useTopicExplanation";
import { useLocale } from "@/lib/i18n/context";
import { recordQuestionAnswered } from "@/lib/study-stats";
import { localizeQuizExplanation, localizeQuizPrompt } from "@/lib/i18n/quiz-prompts";
import type { TranslationKey } from "@/lib/i18n/translations";
import { AstroIcon } from "@/components/icons/AstroIcons";
import { QuizEffects } from "./QuizEffects";
import { RatingButtons } from "./RatingButtons";
import { TopicExplanation } from "./TopicExplanation";

const MIN_QUESTIONS = 10;
const STREAK_CELEBRATION = 5;

function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/,/g, ".")
    .replace(/\s+/g, "")
    .replace(/[.!?]+$/, "");
}

const CONTRACTION_EXPANSIONS: [RegExp, string][] = [
  [/\bdon't\b/g, "do not"],
  [/\bdoesn't\b/g, "does not"],
  [/\bdidn't\b/g, "did not"],
  [/\bcan't\b/g, "cannot"],
  [/\bwon't\b/g, "will not"],
  [/\bhaven't\b/g, "have not"],
  [/\bhasn't\b/g, "has not"],
  [/\bwouldn't\b/g, "would not"],
  [/\bshouldn't\b/g, "should not"],
  [/\bthey're\b/g, "they are"],
  [/\byou're\b/g, "you are"],
  [/\bi'm\b/g, "i am"],
  [/\bwe're\b/g, "we are"],
  [/\bhe's\b/g, "he is"],
  [/\bshe's\b/g, "she is"],
  [/\bit's\b/g, "it is"],
];

function normalizeSentence(s: string): string {
  let x = s.trim().toLowerCase();
  for (const [re, rep] of CONTRACTION_EXPANSIONS) {
    x = x.replace(re, rep);
  }
  return x
    .replace(/['']/g, "'")
    .replace(/[.!?;,]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sentenceUsesPromptWord(prompt: string, userInput: string): boolean {
  const match = prompt.match(/using "([^"]+)"/i);
  if (!match) return false;
  const word = match[1];
  return new RegExp(`\\b${escapeRegExp(word)}\\b`, "i").test(userInput.trim());
}

function checkAnswer(question: Question, userInput: string): boolean {
  const trimmed = userInput.trim();
  if (!trimmed) return false;

  if (question.type === "sentence_construction") {
    const targets = Array.isArray(question.correctAnswer)
      ? question.correctAnswer
      : [question.correctAnswer];

    if (
      targets.some((t) => normalizeSentence(trimmed) === normalizeSentence(t))
    ) {
      return true;
    }

    return sentenceUsesPromptWord(question.prompt, trimmed);
  }

  const normalized = normalizeAnswer(trimmed);
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

function isCorrectOption(opt: string, q: Question): boolean {
  const c = q.correctAnswer;
  if (Array.isArray(c)) return c.includes(opt);
  return c === opt;
}

const QUESTION_TYPE_KEYS: Record<QuestionType, TranslationKey> = {
  multiple_choice: "quiz.type.multipleChoice",
  fill_blank: "quiz.type.fillBlank",
  sentence_construction: "quiz.type.sentenceConstruction",
};

const RATING_LABEL_KEYS: Record<ReviewQuality, TranslationKey> = {
  wrong: "quiz.rating.wrong",
  hard: "quiz.rating.hard",
  good: "quiz.rating.good",
  easy: "quiz.rating.easy",
};

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
  const { t, locale } = useLocale();
  const { refresh: refreshStudyTimer } = useStudyTimer();

  /** Freeze question order for the session so progress updates do not reshuffle mid-quiz. */
  const [questions] = useState(() => {
    const pool = [...unit.questions];
    while (pool.length < MIN_QUESTIONS) {
      pool.push(...unit.questions);
    }
    const sliced = pool.slice(0, Math.max(MIN_QUESTIONS, unit.questions.length));
    return sortQuestionsForSession(sliced, unit, progress);
  });
  const prevTimeLeftRef = useRef(questions[0]?.timeLimitSec ?? 30);

  const [explainOpen, setExplainOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const allowTimeoutRef = useRef(false);
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
  const [hasPickedChoice, setHasPickedChoice] = useState(false);
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
  const questionId = q?.id ?? "";
  const questionLimit = q?.timeLimitSec ?? 30;

  useEffect(() => {
    void preloadAdlibs();
  }, []);

  // Reset timer + input before paint; arm timeout only after countdown actually started
  useLayoutEffect(() => {
    if (!q) return;

    allowTimeoutRef.current = false;
    prevTimeLeftRef.current = questionLimit;
    setTimeLeft(questionLimit);

    let focusFrame = 0;
    if (!answered && (q.type === "fill_blank" || q.type === "sentence_construction")) {
      setInput("");
      focusFrame = window.requestAnimationFrame(() => {
        const el =
          q.type === "fill_blank" ? inputRef.current : textareaRef.current;
        el?.focus({ preventScroll: true });
      });
    }

    const armTimer = window.setTimeout(() => {
      if (!answered) allowTimeoutRef.current = true;
    }, 400);

    return () => {
      if (focusFrame) window.cancelAnimationFrame(focusFrame);
      window.clearTimeout(armTimer);
    };
  }, [questionId, questionLimit, answered, q?.type]);

  useEffect(() => {
    if (!q || answered) return;

    const intervalId = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [questionId, answered]);

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
    (timedOut = false, choiceOverride?: string) => {
      if (answered) return;

      const picked =
        q.type === "multiple_choice" ? (choiceOverride ?? selected ?? "") : input;

      if (q.type === "multiple_choice" && choiceOverride !== undefined) {
        setSelected(choiceOverride);
        setHasPickedChoice(true);
      }

      setAnswered(true);
      recordQuestionAnswered();
      refreshStudyTimer();

      const correct =
        !timedOut &&
        (q.type === "multiple_choice"
          ? isCorrectOption(picked, q)
          : checkAnswer(q, picked));

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
      refreshStudyTimer,
    ]
  );

  useEffect(() => {
    const timedOut =
      timeLeft === 0 &&
      prevTimeLeftRef.current > 0 &&
      allowTimeoutRef.current &&
      !answered;

    prevTimeLeftRef.current = timeLeft;

    if (!q || !timedOut) return;
    handleSubmit(true);
  }, [timeLeft, answered, handleSubmit, questionId, q]);

  const handleMcChoice = (opt: string) => {
    if (answered) return;
    handleSubmit(false, opt);
  };

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
      moduleId: unit.moduleId,
    });
  };

  const goNext = () => {
    const nextIndex = index + 1;
    const isLast = nextIndex >= questions.length;
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
    const nextQ = questions[nextIndex];
    setIndex(nextIndex);
    setInput("");
    setSelected(null);
    setAnswered(false);
    setHasPickedChoice(false);
    setWasCorrect(false);
    setRated(false);
    setRating(null);
    setPendingCardId(null);
    setExplainOpen(false);
    setTimeLeft(nextQ.timeLimitSec);
    allowTimeoutRef.current = false;
    prevTimeLeftRef.current = nextQ.timeLimitSec;
    resetAi();
  };

  if (!q) {
    return (
      <p className="text-center text-gray-500">{t("common.loading")}</p>
    );
  }

  const timerPct =
    q.timeLimitSec > 0 ? (timeLeft / q.timeLimitSec) * 100 : 0;
  const scoreSoFar = Math.round((correctCount / questions.length) * 100);
  const showMcFeedback = answered && hasPickedChoice;
  const displayPrompt = localizeQuizPrompt(q.prompt, locale);
  const displayExplanation = q.explanation
    ? localizeQuizExplanation(q.explanation, locale)
    : undefined;
  const ratingLabel = rating ? t(RATING_LABEL_KEYS[rating]) : "";

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-x-hidden">
      <QuizEffects flash={flash} shake={shake} wild={wild} adlibLabel={adlibLabel} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-base">
        <span className="text-gray-500">
          {t("quiz.question", { current: index + 1, total: questions.length })}
        </span>
        <div className="flex gap-3 font-mono">
          <span className="text-astro-cyan">{scoreSoFar}%</span>
          <span className="inline-flex items-center gap-1 text-astro-orange">
            <AstroIcon name="streak-flame" pulse className="h-4 w-4" />
            {sessionStreak}
          </span>
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
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-10 rounded-2xl border border-astro-purple/30 bg-astro-card p-4 sm:p-6"
          style={{ pointerEvents: "auto" }}
        >
          <p className="text-base uppercase tracking-wider text-astro-purple">
            {t(QUESTION_TYPE_KEYS[q.type])}
          </p>
          <h2 className="mt-2 font-display text-lg leading-snug text-white sm:text-xl">
            {displayPrompt}
          </h2>

          {q.type === "multiple_choice" && q.options && (
            <ul className="mt-6 space-y-3">
              {q.options.map((opt) => {
                const isCorrect = isCorrectOption(opt, q);
                const isPicked = selected === opt;
                return (
                  <li key={opt}>
                    <button
                      type="button"
                      disabled={answered}
                      onClick={() => handleMcChoice(opt)}
                      className={`btn-quiz ${
                        showMcFeedback && isCorrect
                          ? "border-green-500 bg-green-500/20"
                          : showMcFeedback && isPicked && !isCorrect
                            ? "border-red-500 bg-red-500/20"
                            : !answered && isPicked
                              ? "border-astro-orange bg-astro-orange/20"
                              : "border-astro-surface hover:border-astro-purple/50"
                      }`}
                    >
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {q.type === "fill_blank" && (
            <div className="relative z-30 mt-6" style={{ pointerEvents: "auto" }}>
              <input
                ref={inputRef}
                type="text"
                inputMode="text"
                enterKeyHint="done"
                className="input-mobile pointer-events-auto relative z-30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !answered && input.trim()) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                disabled={answered}
                autoFocus
                tabIndex={0}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder={t("quiz.placeholder")}
                aria-label={t("quiz.placeholder")}
              />
            </div>
          )}

          {q.type === "sentence_construction" && (
            <div className="relative z-30 mt-6" style={{ pointerEvents: "auto" }}>
              <textarea
                ref={textareaRef}
                className="input-mobile pointer-events-auto relative z-30 min-h-[120px] resize-y"
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={answered}
                autoFocus
                tabIndex={0}
                autoComplete="off"
                placeholder={t("quiz.placeholder")}
                aria-label={t("quiz.placeholder")}
              />
            </div>
          )}

          {answered && !wasCorrect && (
            <TopicExplanation
              staticExplanation={displayExplanation}
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
              {t("quiz.scheduled", { rating: ratingLabel })}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {!answered && q.type !== "multiple_choice" ? (
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="btn-primary w-full sm:w-auto"
              >
                {t("quiz.submit")}
              </button>
            ) : !answered && q.type === "multiple_choice" ? (
              <p className="text-sm text-gray-500">{t("quiz.pickAnswer")}</p>
            ) : (
              <button
                type="button"
                disabled={!canProceed}
                onClick={goNext}
                className="btn-secondary w-full sm:w-auto"
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
