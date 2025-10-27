import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature") as string;
  const rawBody = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as any;
      const campaignId = pi.metadata?.campaignId as string | undefined;
      if (campaignId) {
        const amountCents = pi.amount_received as number;
        const fallbackUser = await prisma.user.upsert({
          where: { email: "anon@example.com" },
          create: { email: "anon@example.com", clerkId: "anon", displayName: "Anonymous" },
          update: {},
        });
        await prisma.donation.create({
          data: {
            campaignId,
            donorId: fallbackUser.id,
            amountCents,
            tipCents: 0,
            intentId: pi.id,
          },
        });
      }
      break;
    }
    default:
      break;
  }
  return new Response("ok");
}
