export const dynamic = "force-dynamic";

export async function GET() {
  const body = { ok: true, ts: new Date().toISOString(), runtime: "node" };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function HEAD() { return new Response(null, { status: 200 }); }

// src/app/api/health/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const body = { ok: true, ts: new Date().toISOString(), runtime: "node" };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
