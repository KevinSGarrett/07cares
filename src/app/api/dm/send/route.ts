export const dynamic = "force-dynamic";
import { getPusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({ threadId: z.string(), text: z.string().min(1).max(2000) });

const server = getPusherServer();
export async function POST(req: Request) {
  if (!server) { return new Response("pusher disabled at build", { status: 200 }); }
  const { threadId, text } = Body.parse(await req.json());
  await server.trigger(`thread-${threadId}`, "message:new", { text, ts: Date.now() });
  return NextResponse.json({ ok: true });
}



