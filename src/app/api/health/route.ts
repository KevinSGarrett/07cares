// src/app/api/health/route.ts
import { getDbUrl } from "@/lib/getDbUrl";

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

async function checkDatabase(): Promise<{ ok: boolean; error?: string }> {
  try {
    const url = await getDbUrl();
    (globalThis as any).process = (globalThis as any).process || {};
    process.env.DATABASE_URL = url;

    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.$queryRawUnsafe("SELECT 1");
    await prisma.$disconnect();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: String(err?.message ?? err) };
  }
}

export async function GET() {
  try {
    const dbCheck = await checkDatabase();
    const buildSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.AMPLIFY_GIT_COMMIT_SHA || 'unknown';
    const env = process.env.NODE_ENV || 'unknown';
    
    return json(200, { 
      ok: true, 
      db: dbCheck.ok ? 'up' : 'down',
      timestamp: new Date().toISOString(),
      runtime: 'node',
      env,
      build: buildSha,
      ...(dbCheck.error && { dbError: dbCheck.error })
    });
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

