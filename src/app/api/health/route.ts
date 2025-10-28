// src/app/api/health/route.ts
export const runtime = 'nodejs';         // force Node runtime on Amplify
export const dynamic = 'force-dynamic';  // never prerender; always run on request

function json(status: number, data: unknown) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export async function GET() {
  try {
    return json(200, { ok: true, ts: new Date().toISOString(), runtime: 'node' });
  } catch (err: any) {
    return json(500, { ok: false, error: String(err?.message ?? err) });
  }
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

