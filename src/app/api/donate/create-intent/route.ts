import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const Body = z.object({ amount: z.number().int().min(500), campaignId: z.string() });

export async function POST(req: Request) {
  const json = await req.json();
  const { amount, campaignId } = Body.parse(json);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { campaignId },
  });
  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
