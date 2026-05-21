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

  let body: { topic?: string; question?: string; correctAnswer?: string };
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

  const systemPrompt = `You are a friendly English tutor. Rules:
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
    const explanation =
      data.choices?.[0]?.message?.content?.trim() ||
      "Think of it like a space rule: we follow the pattern so everyone understands us!";

    return NextResponse.json({ explanation });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Explanation service unavailable" },
      { status: 500 }
    );
  }
}
