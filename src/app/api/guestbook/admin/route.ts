import { approvedNotes, configured, isAdmin, moderate, pendingNotes } from "@/lib/guestbook";

const denied = () => Response.json({ error: "Wrong key." }, { status: 401 });

export async function GET(request: Request) {
  if (!configured || !isAdmin(request.headers.get("x-admin-key"))) return denied();
  try {
    const [pending, approved] = await Promise.all([pendingNotes(), approvedNotes()]);
    return Response.json({ pending, approved }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("Guestbook admin: could not load notes", error);
    return Response.json({ error: "Couldn't reach the guestbook storage." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  if (!configured || !isAdmin(request.headers.get("x-admin-key"))) return denied();
  const body = (await request.json().catch(() => null)) as { id?: unknown; action?: unknown } | null;
  const action = body?.action;
  if (typeof body?.id !== "string" || (action !== "approve" && action !== "reject" && action !== "delete")) {
    return Response.json({ error: "Unknown request." }, { status: 400 });
  }
  try {
    return Response.json({ ok: await moderate(body.id, action) });
  } catch (error) {
    console.error("Guestbook admin: could not update a note", error);
    return Response.json({ error: "Couldn't reach the guestbook storage." }, { status: 502 });
  }
}
