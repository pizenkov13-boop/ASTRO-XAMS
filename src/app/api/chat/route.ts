import { NextRequest, NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are ASTRO, an AI tutor helping a Russian-speaking student learn English and prepare for SAT and IELTS 7.0. Answer in Russian unless the user writes in English. Be friendly, motivating, explain like the user is a beginner. Use examples and humor.`;

type ApiMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: { messages?: ApiMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const incoming = body.messages;
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  const messages: ApiMessage[] = [];
  for (const m of incoming.slice(-40)) {
    if (
      m &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim()
    ) {
      messages.push({ role: m.role, content: m.content.trim() });
    }
  }

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Last message must be from user" }, { status: 400 });
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.75,
        max_tokens: 1024,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq chat error:", errText);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Извини, не смог ответить. Попробуй ещё раз!";

    return NextResponse.json({ reply });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Chat service unavailable" },
      { status: 500 }
    );
  }
}
