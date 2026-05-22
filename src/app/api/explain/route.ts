import { NextRequest, NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: {
    topic?: string;
    question?: string;
    correctAnswer?: string;
    locale?: string;
    moduleId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const topic = body.topic?.trim() || "English grammar";
  const question = body.question?.trim() || "";
  const correctAnswer = body.correctAnswer?.trim() || "";

  const userContent = [
    `Topic: ${topic}`,
    question ? `Question: ${question}` : "",
    correctAnswer ? `Correct answer: ${correctAnswer}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const locale = body.locale === "ru" ? "ru" : "en";
  const isOgeMath = body.moduleId === "oge";

  const systemPrompt = isOgeMath
    ? locale === "ru"
      ? `Ты репетитор математики для ОГЭ (9 класс). Правила:
- Объясни, какую формулу использовать (арифметическая или геометрическая прогрессия, сумма Sₙ, n-й член aₙ).
- Покажи подстановку чисел из задачи в 2–3 коротких шага.
- Весь ответ ТОЛЬКО на русском. Без markdown и списков.
- Максимум 4 коротких предложения.
- На новой строке: «Фишка:» — одна подсказка, как не перепутать с другой прогрессией.`
      : `You are an OGE math tutor (grade 9). Rules:
- Name the formula (arithmetic/geometric progression, Sₙ or aₙ).
- Show substitution in 2–3 short steps.
- Max 4 short sentences. Plain text only.
- New line: "Trick:" — one tip to avoid mixing progression types.`
    : locale === "ru"
      ? `Ты дружелюбный репетитор английского. Правила:
- Объясняй тему так, будто ученику 5 лет. Очень простые слова. Весь ответ ТОЛЬКО на русском языке.
- Максимум 3 коротких предложения в объяснении.
- Приведи один смешной пример из жизни.
- На новой строке напиши «Фишка:» и одну простую подсказку, как запомнить правило.
- Без списков. Без markdown. Только обычный текст.`
      : `You are a friendly English tutor. Rules:
- Explain the topic like the learner is 5 years old. Use very simple words.
- Maximum 3 short sentences for the explanation.
- Include one funny real-life example.
- Then on a new line write "Trick:" followed by 1 simple memory trick to never forget this rule.
- No bullet points. No markdown. Plain text only.`;

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.8,
        max_tokens: 180,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq error:", errText);
      return NextResponse.json(
        { error: "Failed to generate explanation" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const fallback =
      locale === "ru"
        ? "Представь космическое правило: мы следуем шаблону, чтобы все понимали друг друга!"
        : "Think of it like a space rule: we follow the pattern so everyone understands us!";

    const explanation = data.choices?.[0]?.message?.content?.trim() || fallback;

    return NextResponse.json({ explanation });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Explanation service unavailable" },
      { status: 500 }
    );
  }
}
