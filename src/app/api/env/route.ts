// src/app/api/env/route.ts
import { NextResponse } from "next/server";
import { getEnvSnapshot } from "@/server/env.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const env = await getEnvSnapshot();
  return NextResponse.json({ ok: true, env });
}
