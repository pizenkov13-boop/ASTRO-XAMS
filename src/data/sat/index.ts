import type { Question, Unit } from "@/types";

const SAT_TARGET = 1600;

type SatTopic = {
  prefix: string;
  title: string;
  count: number;
  zeroBlurb: string;
};

const SAT_TOPICS: SatTopic[] = [
  {
    prefix: "math-algebra",
    title: "Algebra",
    count: 8,
    zeroBlurb: "Start from zero: variables as empty boxes, then linear equations.",
  },
  {
    prefix: "math-advanced",
    title: "Advanced Math",
    count: 8,
    zeroBlurb: "Quadratics, exponents, and functions — built step by step to 1600.",
  },
  {
    prefix: "math-geometry",
    title: "Geometry",
    count: 8,
    zeroBlurb: "Angles, triangles, circles, and area from scratch.",
  },
  {
    prefix: "math-statistics",
    title: "Statistics",
    count: 8,
    zeroBlurb: "Mean, median, probability, and data — SAT Problem Solving.",
  },
  {
    prefix: "rw-reading",
    title: "Reading",
    count: 8,
    zeroBlurb: "Evidence, main idea, and inference — zero to test-ready.",
  },
  {
    prefix: "rw-writing",
    title: "Writing & Grammar",
    count: 8,
    zeroBlurb: "Standard English conventions and rhetoric for a perfect score path.",
  },
];

function algebraQuestions(lesson: number): Question[] {
  const prompts = [
    {
      prompt: "If x + 5 = 12, what is x?",
      options: ["5", "7", "12", "17"],
      correct: "7",
      explain: "Subtract 5 from both sides: x = 7.",
    },
    {
      prompt: "Solve: 2x = 18",
      options: ["6", "9", "16", "36"],
      correct: "9",
      explain: "Divide both sides by 2.",
    },
    {
      prompt: "Which is equivalent to 3(x + 2)?",
      options: ["3x + 2", "3x + 6", "x + 6", "3x + 5"],
      correct: "3x + 6",
      explain: "Distribute 3 to both terms inside parentheses.",
    },
    {
      prompt: "Line slope if y = -4x + 1?",
      correct: ["-4"],
      explain: "In y = mx + b, m is the slope.",
      fill: true,
    },
    {
      prompt: "System: x + y = 10 and x = 4. Find y.",
      correct: ["6"],
      explain: "Substitute x = 4: 4 + y = 10 → y = 6.",
      fill: true,
    },
    {
      prompt: "Factor x² - 9",
      options: ["(x-3)(x+3)", "(x-9)(x+9)", "x(x-9)", "(x-3)²"],
      correct: "(x-3)(x+3)",
      explain: "Difference of squares: a² - b² = (a-b)(a+b).",
    },
    {
      prompt: "Write the equation of a line with slope 2 through (0, 3).",
      correct: "y = 2x + 3",
      explain: "Use y = mx + b with m = 2 and b = 3.",
      sentence: true,
    },
    {
      prompt: "If 5x - 1 = 24, x = ?",
      options: ["4", "5", "23", "25"],
      correct: "5",
      explain: "Add 1: 5x = 25, divide by 5.",
    },
    {
      prompt: "Simplify: (x²)(x³)",
      options: ["x⁵", "x⁶", "x⁹", "2x⁵"],
      correct: "x⁵",
      explain: "Add exponents when multiplying same base.",
    },
    {
      prompt: "Word problem: 3 notebooks cost $12. One notebook costs $____.",
      correct: ["4"],
      explain: "12 ÷ 3 = 4 dollars each.",
      fill: true,
    },
  ];
  return buildFromBank(prompts, `sat-alg-${lesson}`, lesson);
}

function geometryQuestions(lesson: number): Question[] {
  const prompts = [
    {
      prompt: "Angles on a straight line sum to ___ degrees.",
      correct: ["180"],
      explain: "Straight angle = 180°.",
      fill: true,
    },
    {
      prompt: "Area of rectangle 5 by 8?",
      options: ["13", "26", "40", "80"],
      correct: "40",
      explain: "Area = length × width = 5 × 8.",
    },
    {
      prompt: "Triangle angles sum to ___°.",
      correct: ["180"],
      explain: "Every triangle in Euclidean geometry.",
      fill: true,
    },
    {
      prompt: "Circle radius 3. Circumference ≈ ? (use π≈3.14)",
      options: ["6.28", "9.42", "18.84", "28.26"],
      correct: "18.84",
      explain: "C = 2πr = 2(3.14)(3).",
    },
    {
      prompt: "Right triangle legs 3 and 4. Hypotenuse = ?",
      options: ["5", "6", "7", "12"],
      correct: "5",
      explain: "3-4-5 Pythagorean triple.",
    },
    {
      prompt: "Volume of cube with side 2?",
      options: ["4", "6", "8", "12"],
      correct: "8",
      explain: "V = s³ = 2³ = 8.",
    },
    {
      prompt: "Two parallel lines cut by a transversal: corresponding angles are ___.",
      correct: ["equal", "congruent", "the same"],
      explain: "Corresponding angles are congruent.",
      fill: true,
    },
    {
      prompt: "Describe how to find area of a triangle.",
      correct: "Area equals one half base times height",
      explain: "A = ½bh works for any triangle.",
      sentence: true,
    },
    {
      prompt: "Square diagonal length if side is 1? (SAT likes √2)",
      options: ["1", "√2", "2", "√3"],
      correct: "√2",
      explain: "45-45-90 triangle ratios.",
    },
    {
      prompt: "Cylinder radius 2 height 5. Volume ≈ ? (π≈3.14)",
      options: ["31.4", "62.8", "78.5", "125.6"],
      correct: "62.8",
      explain: "V = πr²h = 3.14×4×5.",
    },
  ];
  return buildFromBank(prompts, `sat-geo-${lesson}`, lesson);
}

function genericSatQuestions(
  unitId: string,
  section: string,
  lesson: number,
  isMath: boolean
): Question[] {
  return Array.from({ length: 10 }, (_, q) => {
    const qi = q + 1;
    const tier = Math.floor((lesson - 1) / 2);
    if (q % 3 === 0) {
      return {
        id: `${unitId}-q${qi}`,
        type: "multiple_choice" as const,
        prompt: isMath
          ? `[${section} · L${lesson}] Level ${tier}: If 3x + 12 = 27, x = ?`
          : `[${section} · L${lesson}] Which choice best supports the claim with evidence?`,
        options: isMath ? ["3", "5", "9", "15"] : ["A", "B", "C", "D"],
        correctAnswer: isMath ? "5" : "B",
        explanation: isMath
          ? "3x = 15 → x = 5. Path to 1600: master linear equations first."
          : "SAT Reading rewards direct textual evidence.",
        timeLimitSec: 50,
      };
    }
    if (q % 3 === 1) {
      return {
        id: `${unitId}-q${qi}`,
        type: "fill_blank" as const,
        prompt: isMath
          ? `Target ${SAT_TARGET}: Percent increase from 40 to 50 is _____%.`
          : `Fix the transition: "However," usually needs a _____ before it when it starts a clause.`,
        correctAnswer: isMath ? ["25"] : ["comma"],
        explanation: isMath
          ? "(50-40)/40 = 25% increase."
          : "Introductory however often takes a comma after.",
        timeLimitSec: 45,
      };
    }
    return {
      id: `${unitId}-q${qi}`,
      type: "sentence_construction" as const,
      prompt: isMath
        ? `Explain in one sentence what slope means on a graph.`
        : `Combine two ideas into one clear SAT-style sentence.`,
      correctAnswer: isMath
        ? "Slope is how steep a line is"
        : "The data shows a clear improvement over time.",
      explanation: `Zero-to-${SAT_TARGET} track — ${section} lesson ${lesson}.`,
      timeLimitSec: 60,
    };
  });
}

type PromptBank = {
  prompt: string;
  options?: string[];
  correct: string | string[];
  explain: string;
  fill?: boolean;
  sentence?: boolean;
};

function buildFromBank(
  bank: PromptBank[],
  prefix: string,
  lesson: number
): Question[] {
  const types: Question["type"][] = [
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

  return types.map((type, i) => {
    const p = bank[i % bank.length];
    const id = `${prefix}-q${i + 1}`;
    if (type === "multiple_choice" && p.options) {
      return {
        id,
        type,
        prompt: `[Lesson ${lesson}] ${p.prompt}`,
        options: p.options,
        correctAnswer: p.correct as string,
        explanation: p.explain,
        timeLimitSec: 45,
      };
    }
    if (type === "fill_blank") {
      return {
        id,
        type: "fill_blank",
        prompt: `[Lesson ${lesson}] ${p.prompt}`,
        correctAnswer: Array.isArray(p.correct) ? p.correct : [p.correct as string],
        explanation: p.explain,
        timeLimitSec: 40,
      };
    }
    return {
      id,
      type: "sentence_construction",
      prompt: `[Lesson ${lesson}] ${p.prompt}`,
      correctAnswer: Array.isArray(p.correct) ? p.correct[0] : (p.correct as string),
      explanation: p.explain,
      timeLimitSec: 55,
    };
  });
}

export const satUnits: Unit[] = SAT_TOPICS.flatMap((topic) =>
  Array.from({ length: topic.count }, (_, i) => {
    const lesson = i + 1;
    const id = `sat-${topic.prefix}-${lesson}`;
    let questions: Question[];

    if (topic.prefix === "math-algebra") {
      questions = algebraQuestions(lesson);
    } else if (topic.prefix === "math-geometry") {
      questions = geometryQuestions(lesson);
    } else {
      questions = genericSatQuestions(
        id,
        topic.title,
        lesson,
        topic.prefix.startsWith("math")
      );
    }

    return {
      id,
      moduleId: "sat" as const,
      number:
        SAT_TOPICS.indexOf(topic) * topic.count + lesson,
      title: `${topic.title} · Lesson ${lesson}`,
      level: `→ ${SAT_TARGET}`,
      description: `${topic.zeroBlurb}`,
      questions,
    };
  })
);
