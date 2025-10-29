import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/server/db";
import { env } from "@/env";

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
      const donorFromMetadata = (pi.metadata?.donorUserId as string | undefined) || undefined;
      if (campaignId) {
        const amountCents = pi.amount_received as number;
        const useBypass = (process.env.AUTH_BYPASS ?? "").toLowerCase() === "true";
        let donorId: string;
        if (donorFromMetadata && !useBypass) {
          donorId = donorFromMetadata;
        } else {
          const fallbackUser = await prisma.user.upsert({
            where: { email: "demo-user@example.com" },
            create: { email: "demo-user@example.com", clerkId: "demo-user", displayName: "Demo User" },
            update: {},
          });
          donorId = (fallbackUser as any)?.id ?? "user_demo";
        }
        await prisma.donation.create({
          data: {
            campaignId,
            donorId,
            amountCents,
            tipCents: 0,
            intentId: pi.id,
            hideName: useBypass ? true : undefined,
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
