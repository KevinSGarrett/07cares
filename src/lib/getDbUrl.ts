// src/lib/getDbUrl.ts
let cached: string | null = null;

// FINAL STAGING FALLBACK ? remove when Amplify SSR runtime env is enabled
const STAGING_FALLBACK_DBURL =
  "postgresql://cares_app:Strong!Passw0rd@database-1.ca9os6a00y5u.us-east-1.rds.amazonaws.com:5432/caresdb?sslmode=require";

export async function getDbUrl(): Promise<string> {
  if (cached) return cached;

  // 1) If DATABASE_URL exists, use it
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0) {
    cached = process.env.DATABASE_URL;
    return cached;
  }

  // 2) Try Secrets Manager
  try {
    const { SecretsManagerClient, GetSecretValueCommand } = await import("@aws-sdk/client-secrets-manager");
    const client = new SecretsManagerClient({ region: process.env.AWS_REGION || "us-east-1" });
    const out = await client.send(new GetSecretValueCommand({ SecretId: "07cares_DATABASE_URL" }));
    if (out.SecretString && out.SecretString.trim().length > 0) {
      cached = out.SecretString;
      return cached;
    }
  } catch {
    // swallow and try final fallback
  }

  // 3) FINAL fallback (staging-only) so SSR works without IAM creds
  if (STAGING_FALLBACK_DBURL) {
    cached = STAGING_FALLBACK_DBURL;
    return cached;
  }

  throw new Error("DATABASE_URL not available (env/secret/fallback all missing)");
}
