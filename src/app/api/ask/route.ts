import Anthropic from "@anthropic-ai/sdk";
import { localAnswer, systemPrompt } from "@/lib/knowledge";

// Set ASK_MODEL to switch models, e.g. a cheaper one for a busy site.
const MODEL = process.env.ASK_MODEL ?? "claude-opus-5-5";
// Models that support routing a declined request to a fallback model.
const SUPPORTS_FALLBACK = /^claude-(opus-5|fable-5-1|sonnet-5-5)/.test(MODEL);

// Limits that keep a public endpoint from running up a bill.
const MAX_QUESTION_CHARS = 400;
const MAX_TURN_CHARS = 2000;
const MAX_TURNS = 8;
const MAX_REQUESTS = 12;
const WINDOW_MS = 10 * 60 * 1000;

type Turn = { role: "user" | "assistant"; content: string };

const hits = new Map<string, { count: number; resetAt: number }>();

// Best-effort limit per visitor. It resets when the server restarts.
function overLimit(visitor: string) {
  const now = Date.now();
  const entry = hits.get(visitor);
  if (!entry || now > entry.resetAt) {
    hits.set(visitor, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function isTurn(value: unknown): value is Turn {
  if (typeof value !== "object" || value === null) return false;
  const turn = value as Record<string, unknown>;
  return (turn.role === "user" || turn.role === "assistant") && typeof turn.content === "string";
}

const plain = (text: string, mode: "ai" | "basic", status = 200) =>
  new Response(text, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "x-ask-mode": mode, "cache-control": "no-store" },
  });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return plain("That request didn't make sense to me.", "basic", 400);
  }

  const turns = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(turns) || turns.length === 0 || !turns.every(isTurn)) {
    return plain("That request didn't make sense to me.", "basic", 400);
  }
  const messages = turns.slice(-MAX_TURNS).filter((turn) => turn.content.trim());
  const last = messages.at(-1);
  if (!last || last.role !== "user") {
    return plain("Ask me a question about Nithish.", "basic", 400);
  }
  if (last.content.length > MAX_QUESTION_CHARS || messages.some((turn) => turn.content.length > MAX_TURN_CHARS)) {
    return plain(`Please keep questions under ${MAX_QUESTION_CHARS} characters.`, "basic", 400);
  }
  // The first turn sent to the model has to be the visitor's.
  while (messages[0].role !== "user") messages.shift();

  const visitor = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (overLimit(visitor)) {
    return plain("That's a lot of questions in a short time. Give it a few minutes, or message Nithish directly.", "basic", 429);
  }

  // No key configured: answer the common questions from the page's own data.
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return plain(localAnswer(last.content), "basic");
  }

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      try {
        const reply = client.beta.messages.stream(
          {
            model: MODEL,
            // Short answers by design; this also caps what one question can cost.
            max_tokens: 2000,
            output_config: { effort: "low" },
            system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
            messages,
            ...(SUPPORTS_FALLBACK ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
          },
          { signal: request.signal },
        );

        for await (const event of reply) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
            sent = true;
          }
        }

        const final = await reply.finalMessage();
        if (final.stop_reason === "refusal" && !sent) {
          controller.enqueue(
            encoder.encode("I can't help with that one. Try asking about Nithish's studies, projects or freelance work."),
          );
        }
      } catch (error) {
        if (error instanceof Anthropic.RateLimitError) {
          console.error("Ask Nithish: rate limited by the API");
        } else if (error instanceof Anthropic.AuthenticationError) {
          console.error("Ask Nithish: the API key was rejected");
        } else if (error instanceof Anthropic.APIError) {
          console.error(`Ask Nithish: API error ${error.status}`, error.message);
        } else {
          console.error("Ask Nithish: request failed", error);
        }
        // Still give the visitor something useful if nothing was shown yet.
        if (!sent) controller.enqueue(encoder.encode(localAnswer(last.content)));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "x-ask-mode": "ai", "cache-control": "no-store" },
  });
}
