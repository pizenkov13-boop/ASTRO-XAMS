import type { Question, Unit, UserProgress } from "@/types";
import { isDue } from "@/lib/sm2";

/** Due cards first, then never-seen questions, then the rest. */
export function sortQuestionsForSession(
  questions: Question[],
  unit: Unit,
  progress: UserProgress,
  now = Date.now()
): Question[] {
  const rank = (q: Question): number => {
    const cardId = `${unit.id}-${q.id}`;
    const card = progress.cards[cardId];
    if (card && isDue(card, now)) return 0;
    if (!card || card.repetitions === 0) return 1;
    return 2;
  };

  return [...questions].sort((a, b) => rank(a) - rank(b));
}
