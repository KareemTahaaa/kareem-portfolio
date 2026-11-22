import Anthropic from "@anthropic-ai/sdk";
import { localAnswer, systemPrompt } from "@/lib/bot";

export const dynamic = "force-dynamic";

const MAX_TURNS = 12;        // most recent messages sent to the model
const MAX_CHARS = 600;       // per message
const RATE_LIMIT = 20;       // requests per IP...
const RATE_WINDOW = 10 * 60_000; // ...per 10 minutes (per server instance)

type ChatMessage = { role: "user" | "assistant"; content: string };

const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function textStream(text: string, mode: "local" | "ai"): Response {
  return new Response(text, {
    headers: { "content-type": "text/plain; charset=utf-8", "x-bot-mode": mode },
  });
}

function cleanMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const msgs = input
    .filter(
      (m): m is ChatMessage =>
        !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim() !== "",
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS);
  // The conversation must start with a user turn and end with one.
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return null;
  return msgs;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Send JSON with a messages array.", { status: 400 });
  }
  const messages = cleanMessages((body as { messages?: unknown })?.messages);
  if (!messages) return new Response("The last message must be a question.", { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (rateLimited(ip)) {
    return new Response("Too many questions in a short time. Wait a few minutes and try again.", { status: 429 });
  }

  const question = messages[messages.length - 1].content;

  // No key configured: answer from the built-in knowledge base.
  if (!process.env.ANTHROPIC_API_KEY) return textStream(localAnswer(question), "local");

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      try {
        const response = client.beta.messages.stream({
          model: "claude-opus-5-5",
          max_tokens: 4000,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          output_config: { effort: "low" },
          system: [{ type: "text", text: systemPrompt(), cache_control: { type: "ephemeral" } }],
          messages,
        });
        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            sent = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await response.finalMessage();
        if (final.stop_reason === "refusal" && !sent) {
          controller.enqueue(encoder.encode(localAnswer(question)));
        }
      } catch (err) {
        console.error("Kareem bot AI error:", err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
        if (!sent) controller.enqueue(encoder.encode(localAnswer(question)));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "x-bot-mode": "ai", "cache-control": "no-store" },
  });
}
