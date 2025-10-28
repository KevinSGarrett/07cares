// src/app/c/[slug]/page.tsx
import { prisma } from "@/server/db"; // If path alias "@" isn't configured, change to: import { prisma } from "../../../../server/db";

export const dynamic = "force-dynamic";

export default async function CampaignPage({
  // In Next.js 16 App Router, `params` is a Promise in RSC — you must await it.
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Invalid campaign</h1>
        <p>Missing slug.</p>
      </main>
    );
  }

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
  });

  if (!campaign) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Campaign not found</h1>
        <p>Slug: {slug}</p>
      </main>
    );
  }

  // Optional aggregate of donations (if Donation exists)
  let totalCents = 0;
  try {
    const agg = await prisma.donation.aggregate({
      where: { campaignId: campaign.id },
      _sum: { amountCents: true },
    });
    totalCents = agg._sum.amountCents ?? 0;
  } catch {
    // Donation model may not exist yet — ignore
  }

  const goalCents = (campaign as any).goalCents ?? 0;

  return (
    <main style={{ padding: 24 }}>
      <h1>{campaign.title}</h1>
      <p>
        Goal: ${(goalCents / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </p>
      <p>
        Raised: ${(totalCents / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </p>
      <p>
        Location: {campaign.city}, {campaign.state}
      </p>
    </main>
  );
}
