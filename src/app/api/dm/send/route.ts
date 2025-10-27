import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({ threadId: z.string(), text: z.string().min(1).max(2000) });

export async function POST(req: Request) {
  const { threadId, text } = Body.parse(await req.json());
  await pusherServer.trigger(`thread-${threadId}`, "message:new", { text, ts: Date.now() });
  return NextResponse.json({ ok: true });
}
