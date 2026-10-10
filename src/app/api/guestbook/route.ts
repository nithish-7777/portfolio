import { connection } from "next/server";
import { approvedNotes, configured, submitNote } from "@/lib/guestbook";

const MAX_NAME = 40;
const MAX_MESSAGE = 240;
const MAX_PER_HOUR = 3;

const hits = new Map<string, { count: number; resetAt: number }>();

// Best-effort limit per visitor. It resets when the server restarts.
function overLimit(visitor: string) {
  const now = Date.now();
  const entry = hits.get(visitor);
  if (!entry || now > entry.resetAt) {
    hits.set(visitor, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_HOUR;
}

// Collapse whitespace and drop control characters.
const tidy = (value: unknown) =>
  typeof value === "string"
    ? value
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

export async function GET() {
  await connection();
  if (!configured) return Response.json({ open: false, notes: [] });
  try {
    return Response.json({ open: true, notes: await approvedNotes() }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("Guestbook: could not load notes", error);
    return Response.json({ open: false, notes: [] });
  }
}

export async function POST(request: Request) {
  if (!configured) return Response.json({ error: "The guestbook isn't open yet." }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "That didn't come through properly. Please try again." }, { status: 400 });
  }

  // Hidden field that people never see; automated spam tends to fill it in.
  if (tidy(body.website)) return Response.json({ ok: true });

  const name = tidy(body.name);
  const message = tidy(body.message);
  if (!name || !message) return Response.json({ error: "Add your name and a note." }, { status: 400 });
  if (name.length > MAX_NAME || message.length > MAX_MESSAGE) {
    return Response.json({ error: `Keep the name under ${MAX_NAME} and the note under ${MAX_MESSAGE} characters.` }, { status: 400 });
  }
  if (/https?:\/\/|www\./i.test(`${name} ${message}`)) {
    return Response.json({ error: "Links aren't allowed in notes." }, { status: 400 });
  }

  const visitor = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (overLimit(visitor)) {
    return Response.json({ error: "You've left a few notes already. Try again in an hour." }, { status: 429 });
  }

  try {
    await submitNote(name, message);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Guestbook: could not save a note", error);
    return Response.json({ error: "Couldn't save your note just now. Please try again." }, { status: 502 });
  }
}
