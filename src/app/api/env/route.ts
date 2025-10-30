import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const raw = process.env.DATABASE_URL || "";
  let dbHost = "";
  try {
    dbHost = (raw.split("@")[1] || "").split("/")[0] || "";
  } catch {}

  return NextResponse.json({
    ok: true,
    env: {
      AUTH_BYPASS: String(process.env.AUTH_BYPASS ?? ""),
      DATABASE_URL_SET: Boolean(process.env.DATABASE_URL),
      DB_HOST: dbHost,
    },
  });
}
