import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await prisma.campaign.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  if (!existing.coverUrl) {
    return NextResponse.json(
      { ok: false, error: "Cover image required before publishing" },
      { status: 400 }
    );
  }

  const updated = await prisma.campaign.update({
    where: { id },
    data: { status: "live" },
    select: { id: true, slug: true, status: true },
  });
  return NextResponse.json({ ok: true, campaign: updated });
}


