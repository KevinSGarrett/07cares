import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const Body = z.object({ amount: z.number().int().min(500), campaignId: z.string() });

export async function POST(req: Request) {
  const json = await req.json();
  const { amount, campaignId } = Body.parse(json);
  // Test-mode: allow E2E to bypass real Stripe dependency
  if (process.env.E2E_MOCK_STRIPE === "1" || process.env.E2E_MOCK_STRIPE === "true") {
    return NextResponse.json({ clientSecret: `pi_test_${campaignId}_${amount}_secret` });
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { campaignId },
  });
  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
