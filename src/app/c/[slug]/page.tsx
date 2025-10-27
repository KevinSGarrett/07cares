import { prisma } from "@/server/db";
import Image from "next/image";
import Link from "next/link";

export default async function CampaignPage({ params }: { params: { slug: string } }) {
  const campaign = await prisma.campaign.findUnique({ where: { slug: params.slug } });
  if (!campaign) return <div className="p-8">Not found</div>;

  const agg = await prisma.donation.aggregate({
    where: { campaignId: campaign.id },
    _sum: { amountCents: true },
  });
  const raised = agg._sum.amountCents || 0;
  const pct = Math.min(100, Math.round(raised * 100 / campaign.goalCents));

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold">{campaign.title}</h1>
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100">
        <Image src={campaign.coverUrl} alt={campaign.title} fill className="object-cover" />
      </div>
      <div className="rounded-md border p-4">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-700">
          <span>Goal: ${(campaign.goalCents/100).toLocaleString()}</span>
          <span>{pct}% funded</span>
        </div>
        <div className="h-3 w-full rounded bg-gray-200">
          <div className="h-full rounded bg-gray-800" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-4 flex gap-3">
          <Link href={`/c/${params.slug}/donate`} className="rounded bg-black px-4 py-2 text-white">Donate</Link>
          <span className="text-sm text-gray-600">Raised ${(raised/100).toLocaleString()}</span>
        </div>
      </div>
    </main>
  );
}
