// Thin wrapper around Groq's OpenAI-compatible chat completions API. Server-only.
// This is the foundation the Phase 5 Career Toolkit (CV analysis, resume
// generation, career recommendations) builds on — its own prompts and logic,
// Groq is just the model underneath. Uses plain fetch, no SDK dependency.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function chat(messages: ChatMessage[], opts?: { model?: string; temperature?: number }) {
  const apiKey = process.env["GROQ_API_KEY"];
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured.");

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: opts?.model ?? DEFAULT_MODEL,
      messages,
      temperature: opts?.temperature ?? 0.3,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Groq API error ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  const content = data.choices[0]?.message.content;
  if (!content) throw new Error("Groq API returned an empty response.");
  return content;
}

/**
 * Runs a prompt and parses the reply as JSON matching shape T. Instructs the
 * model to return JSON only; still validates/parses defensively since LLM
 * output is never guaranteed well-formed — callers should further validate
 * the parsed value with a zod schema before persisting or displaying it.
 */
export async function generateJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const content = await chat([
    {
      role: "system",
      content: `${systemPrompt}\n\nRespond with ONLY valid JSON — no prose, no markdown code fences.`,
    },
    { role: "user", content: userPrompt },
  ]);

  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "");

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error("AI response was not valid JSON.");
  }
}

export async function generateText(systemPrompt: string, userPrompt: string): Promise<string> {
  return chat([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);
}
