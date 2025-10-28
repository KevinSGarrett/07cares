// src/app/api/db/ping/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getDbUrl } from "@/lib/getDbUrl";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const url = await getDbUrl();
    const prisma = new PrismaClient({ datasources: { db: { url } } });
    await prisma.$queryRawUnsafe("SELECT 1");
    return NextResponse.json({ ok: true, db: "up" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, db: "error", error: String(err?.message || err) }, { status: 500 });
  }
}
