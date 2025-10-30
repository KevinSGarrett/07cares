// src/app/api/stripe/webhook/route.ts
import { stripe } from "@/lib/stripe";
import { prisma } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Read signature directly from the incoming request headers
  const sig = req.headers.get("stripe-signature") ?? "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  if (!secret) {
    return new Response("Webhook Error: STRIPE_WEBHOOK_SECRET not configured", { status: 500 });
  }

  // Stripe needs the *raw* request body string to verify the signature
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown signature error";
    return new Response(`Webhook Error: ${msg}`, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as any;
      const campaignId = pi.metadata?.campaignId as string | undefined;
      const donorFromMetadata =
        (pi.metadata?.donorUserId as string | undefined) || undefined;

      if (campaignId) {
        const amountCents = pi.amount_received as number;
        const useBypass = (process.env.AUTH_BYPASS ?? "").toLowerCase() === "true";

        // Resolve donor
        let donorId: string;
        if (donorFromMetadata && !useBypass) {
          donorId = donorFromMetadata;
        } else {
          const fallbackUser = await prisma.user.upsert({
            where: { email: "demo-user@example.com" },
            create: {
              email: "demo-user@example.com",
              clerkId: "demo-user",
              displayName: "Demo User",
            },
            update: {},
          });
          donorId = (fallbackUser as any)?.id ?? "user_demo";
        }

        // Record donation
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
      // no-op for unhandled events
      break;
  }

  return new Response("ok");
}

// Optionally reject non-POST if ever called
export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
