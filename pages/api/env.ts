// pages/api/env.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  let dbHost = "";
  try {
    const raw = process.env.DATABASE_URL || "";
    dbHost = (raw.split("@")[1] || "").split("/")[0] || "";
  } catch {}
  res.status(200).json({
    ok: true,
    env: {
      AUTH_BYPASS: String(process.env.AUTH_BYPASS ?? ""),
      DATABASE_URL_SET: Boolean(process.env.DATABASE_URL),
      DB_HOST: dbHost,
    },
  });
}
