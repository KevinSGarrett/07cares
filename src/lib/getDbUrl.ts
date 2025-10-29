// src/lib/getDbUrl.ts
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
let cached: string | null = null;

export async function getDbUrl(): Promise<string> {
  if (cached) return cached;

  // 1) If DATABASE_URL exists, use it
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0) {
    cached = process.env.DATABASE_URL;
    return cached;
  }

  // Test-only escape hatch to avoid AWS SDK mocking brittleness
  if (process.env.__TEST_SECRET_DB_URL && process.env.__TEST_SECRET_DB_URL.trim().length > 0) {
    cached = process.env.__TEST_SECRET_DB_URL;
    return cached;
  }

  // 2) Try Secrets Manager (staging/prod)
  try {
    const client = new SecretsManagerClient({ region: process.env.AWS_REGION || "us-east-1" });
    const out = await client.send(new GetSecretValueCommand({ SecretId: "07cares_DATABASE_URL" }));
    if (out.SecretString && out.SecretString.trim().length > 0) {
      cached = out.SecretString;
      return cached;
    }
  } catch {
    // no-op: fall through to error
  }

  throw new Error("DATABASE_URL not available (env or Secrets Manager)");
}
