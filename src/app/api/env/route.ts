// src/app/api/env/route.ts
import { NextResponse } from "next/server";
import { getDbUrl } from "@/lib/getDbUrl";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  let dbHost = "";
  try {
    const url = await getDbUrl();
    dbHost = (url.split("@")[1] || "").split("/")[0] || "";
  } catch {}

  const env = {
    AUTH_BYPASS: process.env.AUTH_BYPASS || "",
    DATABASE_URL_SET: !!process.env.DATABASE_URL,
    DB_HOST: dbHost,
  };
  return NextResponse.json({ ok: true, env }, { status: 200 });
}
