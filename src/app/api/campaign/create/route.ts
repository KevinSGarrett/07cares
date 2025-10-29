import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { CampaignBasicsSchema } from "@/schemas/campaign";
import { slugify } from "@/lib/slugify";

async function generateUniqueSlug(title: string) {
  const base = slugify(title);
  let candidate = base;
  let i = 1;
  // Ensure uniqueness by appending -2, -3, ... if necessary
  // Limit attempts to a reasonable number to avoid runaway loops
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.campaign.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    i += 1;
    candidate = `${base}-${i}`;
  }
}

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = CampaignBasicsSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }
  const { title, city, state, goalDollars, startDate, endDate } = parsed.data;

  // Organizer: in BYPASS mode, use seed organizer or create a local stub
  // Later: when Clerk is enabled, derive organizer from the authenticated user
  const BYPASS = process.env.AUTH_BYPASS !== "false";

  let organizerId: string | null = null;
  if (BYPASS) {
    const fallbackEmail = "organizer@example.com";
    let organizer = await prisma.user.findUnique({ where: { email: fallbackEmail } });
    if (!organizer) {
      organizer = await prisma.user.create({
        data: {
          email: fallbackEmail,
          clerkId: "bypass-organizer",
          displayName: "Bypass Organizer",
        },
      });
    }
    organizerId = organizer.id;
  }

  const slug = await generateUniqueSlug(title);
  const goalCents = Math.round(goalDollars * 100);

  const created = await prisma.campaign.create({
    data: {
      slug,
      title,
      city,
      state,
      goalCents,
      coverUrl: "",
      status: "draft",
      isAon: false,
      startDate,
      endDate,
      organizerId: organizerId!,
    },
    select: { id: true, slug: true, status: true },
  });

  return NextResponse.json({ ok: true, campaign: created });
}


