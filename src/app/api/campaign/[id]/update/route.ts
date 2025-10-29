import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { CampaignUpdateSchema } from "@/schemas/campaign";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const json = await req.json();
  const parsed = CampaignUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.campaign.update({
    where: { id },
    data: parsed.data,
    select: { id: true, slug: true, status: true, coverUrl: true },
  });

  return NextResponse.json({ ok: true, campaign: updated });
}


