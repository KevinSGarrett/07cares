import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { env } from "@/env";

export async function POST() {
  if (!env.STRIPE_CONNECT_ENABLED) {
    return NextResponse.json({ error: "Connect disabled" }, { status: 404 });
  }
  const account = await stripe.accounts.create({ type: "express", country: "US", business_type: "individual" });
  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/connect/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/connect/return`,
    type: "account_onboarding",
  });
  return NextResponse.json({ url: link.url, accountId: account.id });
}
