/** src/app/c/[slug]/page.tsx */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getDbUrl } from "@/lib/getDbUrl";
import { DonateWidget } from "./DonateWidget";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // soft fallback so the page doesn?t 500 while wiring is finishing
  const fallback = {
    title: "Example Campaign",
    city: "Austin",
    state: "TX",
    goalCents: 500000,
    totalCents: 7500,
  };

  try {
    // Make Prisma see a DATABASE_URL at runtime (env or secret or fallback)
    const url = await getDbUrl();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).process = (globalThis as any).process || {};
    process.env.DATABASE_URL = url;

    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const campaign = await prisma.campaign.findUnique({ where: { slug } });
    if (!campaign) {
      return (
        <main style={{ padding: 24 }}>
          <h1>Campaign not found</h1>
          <p>Slug: {slug}</p>
        </main>
      );
    }

    const agg = await prisma.donation.aggregate({
      where: { campaignId: campaign.id },
      _sum: { amountCents: true },
    });

    const totalCents = agg._sum.amountCents ?? 0;
    const goalCents =
      (campaign as any).goalCents ?? (campaign as any).goal ?? 0;

    return (
      <main style={{ padding: 24, display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {campaign.coverUrl ? (
            <img
              src={campaign.coverUrl}
              alt="Campaign cover"
              style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 8 }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 200,
                borderRadius: 8,
                background:
                  "linear-gradient(135deg, rgba(203,213,225,1) 0%, rgba(226,232,240,1) 100%)",
              }}
            />
          )}
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>{campaign.title}</h1>
          <p>
            Goal: $
            {(goalCents / 100).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
          <p>
            Raised: $
            {(totalCents / 100).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
          <p>
            Location: {campaign.city}, {campaign.state}
          </p>
        </div>

        <section style={{ maxWidth: 520 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>Support this campaign</h2>
          <DonateWidget campaignId={campaign.id} />
        </section>
      </main>
    );
  } catch {
    // Graceful fallback (no 500s)
    return (
      <main style={{ padding: 24 }}>
        <h1>{fallback.title}</h1>
        <p>
          Goal: $
          {(fallback.goalCents / 100).toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </p>
        <p>
          Raised: $
          {(fallback.totalCents / 100).toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </p>
        <p>
          Location: {fallback.city}, {fallback.state}
        </p>
      </main>
    );
  }
}
