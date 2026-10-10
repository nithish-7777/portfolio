import { timingSafeEqual } from "node:crypto";

// Guestbook storage. Notes wait in a pending list until the owner approves
// them. In production the lists live in Upstash Redis (the Vercel Marketplace
// integration sets the KV_REST_API_* variables). In development, with no
// database configured, they are held in memory so the feature can be tried out.

export type Note = { id: string; name: string; message: string; at: string };

// Vercel lets you add a custom prefix when connecting the database (for example
// STORAGE_KV_REST_API_URL), so match on the ending of the variable name.
const env = (...endings: string[]) => {
  for (const ending of endings) {
    const name = Object.keys(process.env).find((key) => key === ending || key.endsWith(`_${ending}`));
    if (name && process.env[name]) return process.env[name];
  }
  return undefined;
};
const REDIS_URL = env("KV_REST_API_URL", "UPSTASH_REDIS_REST_URL");
const REDIS_TOKEN = env("KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN");
const ADMIN_KEY = process.env.GUESTBOOK_ADMIN_KEY ?? (process.env.NODE_ENV === "development" ? "dev" : "");

const PENDING = "guestbook:pending";
const APPROVED = "guestbook:approved";
const MAX_PENDING = 200;
const MAX_SHOWN = 60;

const useMemory = !REDIS_URL && process.env.NODE_ENV === "development";
const memory: Record<string, string[]> = { [PENDING]: [], [APPROVED]: [] };

/** True when there is somewhere to keep notes and a key to approve them with. */
export const configured = Boolean((REDIS_URL && REDIS_TOKEN && ADMIN_KEY) || useMemory);

async function redis<T>(command: (string | number)[]): Promise<T> {
  const response = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { authorization: `Bearer ${REDIS_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Guestbook store answered ${response.status}`);
  return ((await response.json()) as { result: T }).result;
}

async function read(list: string, count: number): Promise<Note[]> {
  const raw = useMemory ? memory[list].slice(0, count) : await redis<string[]>(["LRANGE", list, 0, count - 1]);
  return raw.map((entry) => JSON.parse(entry) as Note);
}

async function push(list: string, note: Note, cap: number) {
  const value = JSON.stringify(note);
  if (useMemory) {
    memory[list] = [value, ...memory[list]].slice(0, cap);
    return;
  }
  await redis(["LPUSH", list, value]);
  await redis(["LTRIM", list, 0, cap - 1]);
}

async function remove(list: string, note: Note) {
  const value = JSON.stringify(note);
  if (useMemory) memory[list] = memory[list].filter((entry) => entry !== value);
  else await redis(["LREM", list, 1, value]);
}

export const approvedNotes = () => read(APPROVED, MAX_SHOWN);
export const pendingNotes = () => read(PENDING, MAX_PENDING);

export async function submitNote(name: string, message: string) {
  await push(PENDING, { id: crypto.randomUUID(), name, message, at: new Date().toISOString() }, MAX_PENDING);
}

/** Approves or rejects a waiting note, or deletes one that is already showing. */
export async function moderate(id: string, action: "approve" | "reject" | "delete") {
  const list = action === "delete" ? APPROVED : PENDING;
  const note = (await read(list, MAX_PENDING)).find((entry) => entry.id === id);
  if (!note) return false;
  await remove(list, note);
  if (action === "approve") await push(APPROVED, note, MAX_SHOWN);
  return true;
}

export function isAdmin(key: string | null) {
  if (!key || !ADMIN_KEY) return false;
  const given = Buffer.from(key);
  const expected = Buffer.from(ADMIN_KEY);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
