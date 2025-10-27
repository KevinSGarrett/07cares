import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Adjust fields to your schema!
  const campaign = await prisma.campaign.upsert({
    where: { slug: "example-campaign" },
    update: {},
    create: {
      slug: "example-campaign",
      title: "Help Build 07.Cares",
      goal: 25000,            // if your schema uses Decimal, use new Prisma.Decimal(25000)
      city: "Houston",
      state: "TX",
      // Add any required fields here (ownerId/orgId/etc.)
    },
  });

  // Optional: reward tiers
  // await prisma.rewardTier.createMany({
  //   data: [
  //     { campaignId: campaign.id, name: "$10 Supporter", amount: 10 },
  //     { campaignId: campaign.id, name: "$25 Friend", amount: 25 },
  //   ],
  //   skipDuplicates: true,
  // });

  // Optional: two test donations
  // await prisma.donation.createMany({
  //   data: [
  //     { campaignId: campaign.id, amount: 25, donorName: "Anonymous", hideName: true },
  //     { campaignId: campaign.id, amount: 50, donorName: "Demo User", hideName: false },
  //   ],
  // });

  console.log("Seeded:", campaign.slug);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
