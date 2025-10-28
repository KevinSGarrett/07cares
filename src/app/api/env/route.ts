// src/app/api/env/route.ts
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";`r`nexport const runtime = "nodejs";
export async function GET() {
  const env = {
    AUTH_BYPASS: process.env.AUTH_BYPASS || "",
    DATABASE_URL_SET: !!process.env.DATABASE_URL,
    DB_HOST: (process.env.DATABASE_URL || "").split("@")[1]?.split("/")[0] || "",
  };
  return NextResponse.json({ ok: true, env }, { status: 200 });
}

