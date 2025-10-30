// src/server/env.server.ts
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const APP_ID   = process.env.AMPLIFY_APP_ID  || "d3ru1wmw4mnh7w";
const BRANCH   = process.env.AMPLIFY_BRANCH  || "main";
const REGION   = process.env.AWS_REGION      || "us-east-1";
const SSM_PATH = `/amplify/${APP_ID}/${BRANCH}`;

let cachedDbUrl: string | null = null;

/**
 * Resolve DATABASE_URL:
 * 1) Prefer process.env.DATABASE_URL (works locally & any host that injects it)
 * 2) Fallback to SSM Parameter Store /amplify/<app>/<branch>/DATABASE_URL
 */
export async function getDatabaseUrl(): Promise<string> {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  if (cachedDbUrl) return cachedDbUrl;

  const ssm = new SSMClient({ region: REGION });
  const paramName = `${SSM_PATH}/DATABASE_URL`;
  const res = await ssm.send(new GetParameterCommand({
    Name: paramName,
    WithDecryption: true,
  }));

  const v = res.Parameter?.Value?.trim();
  if (!v) {
    throw new Error(`SSM parameter missing/empty: ${paramName}`);
  }

  cachedDbUrl = v;
  return v;
}

export async function getEnvSnapshot() {
  // Helpful for /api/env
  let dbUrlSet = Boolean(process.env.DATABASE_URL);
  let dbHost = "";

  try {
    const url = await getDatabaseUrl(); // will read env or SSM
    dbUrlSet = true;
    // attempt to extract host for debugging (works for postgresql://user:pass@host:port/db?sslmode=...)
    const afterAt = url.split("@")[1] || "";
    dbHost = afterAt.split("/")[0] || "";
  } catch {
    // leave defaults
  }

  return {
    AUTH_BYPASS: String(process.env.AUTH_BYPASS ?? ""),
    DATABASE_URL_SET: dbUrlSet,
    DB_HOST: dbHost,
  };
}
