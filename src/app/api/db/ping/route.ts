// src/app/api/db/ping/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "@/server/env.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let prisma: PrismaClient | null = null;

async function getPrisma(): Promise<PrismaClient> {
  if (prisma) return prisma;
  const dbUrl = await getDatabaseUrl();
  prisma = new PrismaClient({
    datasourceUrl: dbUrl,
  });
  return prisma;
}

export async function GET() {
  try {
    const p = await getPrisma();
    await p.$queryRawUnsafe("SELECT 1"); // cheap ping
    return NextResponse.json({ ok: true, db: "up" });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
