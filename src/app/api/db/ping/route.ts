// src/app/api/db/ping/route.ts
import { NextResponse } from "next/server";
import { getDbUrl } from "@/lib/getDbUrl";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const url = await getDbUrl();
    // Ensure Prisma sees DATABASE_URL before client load
    (globalThis as any).process = (globalThis as any).process || {};
    process.env.DATABASE_URL = url;

    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.$queryRawUnsafe("SELECT 1");
    return NextResponse.json({ ok: true, db: "up" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, db: "error", error: String(err?.message || err) }, { status: 500 });
  }
}
