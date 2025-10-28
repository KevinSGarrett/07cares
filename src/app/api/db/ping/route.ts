// src/app/api/db/ping/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../server/db";

export const dynamic = "force-dynamic";`r`nexport const runtime = "nodejs";

export async function GET() {
  const env = {
    AUTH_BYPASS: process.env.AUTH_BYPASS || "",
    DB_PRESENT: !!process.env.DATABASE_URL,
    DB_HOST: (process.env.DATABASE_URL || "").split("@")[1]?.split("/")[0] || "",
  };

  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    return NextResponse.json({ ok: true, db: "up", env }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, db: "error", error: String(err?.message || err), env },
      { status: 500 }
    );
  }
}

