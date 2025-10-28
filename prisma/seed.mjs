// prisma/seed.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Organizer (adjust/remove if User isn't required in your schema)
  const organizer = await prisma.user.upsert({
    where: { email: "organizer@example.com" },
    create: {
      email: "organizer@example.com",
      clerkId: "seed-organizer",
      displayName: "Demo Organizer",
    },
    update: {},
  });

  // Campaign — note: goalCents (required by your schema)
  const campaign = await prisma.campaign.upsert({
    where: { slug: "example-campaign" },
    update: {},
    create: {
      slug: "example-campaign",
      title: "Example Campaign",
      city: "Austin",
      state: "TX",
      goalCents: 500000, // $5,000 in cents
      coverUrl:
        "https://res.cloudinary.com/demo/image/upload/w_1600,h_900,c_fill/sample.jpg",
      status: "live",
      isAon: false,
      startDate: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      endDate: new Date(Date.now() + 21 * 24 * 3600 * 1000),
      organizerId: organizer.id, // remove if not required
    },
  });

  // Optional donations (only if Donation model exists with these fields)
  await prisma.donation.createMany({
    data: [
      {
        campaignId: campaign.id,
        donorId: organizer.id,
        amountCents: 2500,
        tipCents: 0,
        isAnonymous: false,
        hideName: true,
      },
      {
        campaignId: campaign.id,
        donorId: organizer.id,
        amountCents: 5000,
        tipCents: 0,
        isAnonymous: true,
        hideName: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete:", { campaign: campaign.slug });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
