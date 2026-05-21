import type { Question, Unit } from "@/types";
import { getUnitWords } from "./words";

const BOOK1_STORY_TITLES = [
  "The Lion and the Rabbit",
  "The Laboratory",
  "The Report",
  "The Dog's Bell",
  "The Jackal and the Sun Child",
  "The Friendly Ghost",
  "The Best Prince",
  "How the Sun and the Moon Were Made",
  "The Starfish",
  "The First Peacock",
  "Princess Rose and the Creature",
  "The Crazy Artist",
  "The Farmer and the Cats",
  "A Magical Book",
  "The Big Race",
  "Adams County's Gold",
  "The Race for Water",
  "The Little Red Chicken",
  "Shipwrecked",
  "The Seven Cities of Gold",
  "Katy",
  "A Better Reward",
  "The Camp",
  "A Strong Friendship",
  "Joe's Pond",
  "Archie and His Donkey",
  "The Spider and the Bird",
  "The Party",
  "How the World Got Light",
  "Cats and Secrets",
] as const;

function buildVocabQuestions(unitNum: number): Question[] {
  const words = getUnitWords(unitNum);
  const types: Array<Question["type"]> = [
    "multiple_choice",
    "fill_blank",
    "sentence_construction",
    "multiple_choice",
    "fill_blank",
    "multiple_choice",
    "fill_blank",
    "sentence_construction",
    "multiple_choice",
    "fill_blank",
  ];

  return types.map((type, q) => {
    const w = words[q % words.length];
    const id = `vocab-u${unitNum}-q${q + 1}`;

    if (type === "multiple_choice") {
      const wrong = ["to ignore", "to destroy", "to forget", "to refuse"].filter(
        (x) => !w.definition.includes(x.slice(3))
      );
      return {
        id,
        type,
        prompt: `What does "${w.word}" mean?`,
        options: [w.definition, wrong[0], wrong[1], wrong[2]],
        correctAnswer: w.definition,
        explanation: `"${w.word}": ${w.definition}`,
        timeLimitSec: 25,
      };
    }

    if (type === "fill_blank") {
      return {
        id,
        type,
        prompt: `Complete with "${w.word}": "The story will _____ our understanding."`,
        correctAnswer: [w.word],
        explanation: `"${w.word}" fits: ${w.definition}`,
        timeLimitSec: 30,
      };
    }

    return {
      id,
      type,
      prompt: `Write one sentence using "${w.word}" correctly.`,
      correctAnswer: `I understand the word ${w.word}.`,
      explanation: `A clear sentence shows you know: ${w.definition}`,
      timeLimitSec: 45,
    };
  });
}

/** Book 1: 30 chapters, 10 vocabulary questions each */
export const vocabularyUnits: Unit[] = Array.from({ length: 30 }, (_, i) => {
  const n = i + 1;
  const words = getUnitWords(n);
  return {
    id: `vocab-unit-${n}`,
    moduleId: "vocabulary" as const,
    number: n,
    title: `Unit ${n}: ${BOOK1_STORY_TITLES[n - 1] ?? "Book 1"}`,
    level: "A2 – B1",
    description: `4000 Essential English Words — Book 1, Unit ${n} (${words.length} words)`,
    questions: buildVocabQuestions(n),
  };
});
