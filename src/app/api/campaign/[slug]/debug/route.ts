// src/app/api/campaign/[slug]/debug/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDbUrl } from "@/lib/getDbUrl";

export async function GET(_: Request, ctx: { params: { slug: string } }) {
  const slug = ctx.params.slug;
  try {
    const url = await getDbUrl();
    (globalThis as any).process = (globalThis as any).process || {};
    process.env.DATABASE_URL = url;

    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const campaign = await prisma.campaign.findUnique({ where: { slug } });
    const agg = campaign
      ? await prisma.donation.aggregate({ where: { campaignId: campaign.id }, _sum: { amountCents: true } })
      : null;

    return NextResponse.json({ ok: true, slug, campaign, totalCents: agg?._sum?.amountCents ?? 0 }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, slug, error: String(err?.message || err) }, { status: 500 });
  }
}
