import { NextResponse } from "next/server";
import { env } from "@/env";

export async function POST() {
  const flag = typeof process.env.PAYOUTS_SCHEDULER_ENABLED !== "undefined"
    ? String(process.env.PAYOUTS_SCHEDULER_ENABLED).toLowerCase() === "true"
    : env.PAYOUTS_SCHEDULER_ENABLED;
  if (!flag) {
    return NextResponse.json({ error: "Payouts scheduler disabled" }, { status: 404 });
  }
  // Stub only: in future, enqueue a job to reconcile balances and create payouts
  return NextResponse.json({ ok: true, scheduled: true });
}


