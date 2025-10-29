// src/app/api/campaign/[id]/debug/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDbUrl } from "@/lib/getDbUrl";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const url = await getDbUrl();
    (globalThis as any).process = (globalThis as any).process || {};
    process.env.DATABASE_URL = url;

    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const campaign = await prisma.campaign.findUnique({ where: { id } });
    const agg = campaign
      ? await prisma.donation.aggregate({ where: { campaignId: campaign.id }, _sum: { amountCents: true } })
      : null;

    return NextResponse.json({ ok: true, id, campaign, totalCents: agg?._sum?.amountCents ?? 0 }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, id, error: String(err?.message || err) }, { status: 500 });
  }
}


