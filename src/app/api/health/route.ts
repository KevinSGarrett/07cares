import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Do NOT import any env helpers or services here.
  // Return plain JSON so smoke tests and uptime checks stay green locally.
  return NextResponse.json({
    ok: true,
    service: "07.Cares",
    ts: new Date().toISOString(),
  }, { status: 200 });
}
