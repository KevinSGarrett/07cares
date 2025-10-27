### /api/health (Next.js Route Handler)

```ts
import { prisma } from "@/server/db";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return new Response(JSON.stringify({ ok: true, ts: Date.now(), sha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || "dev" }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
}
```
