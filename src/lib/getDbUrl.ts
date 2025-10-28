// src/lib/getDbUrl.ts
let cached: string | null = null;

export async function getDbUrl(): Promise<string> {
  if (cached) return cached;

  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0) {
    cached = process.env.DATABASE_URL;
    return cached;
  }

  const { SecretsManagerClient, GetSecretValueCommand } = await import("@aws-sdk/client-secrets-manager");
  const client = new SecretsManagerClient({ region: process.env.AWS_REGION || "us-east-1" });
  const out = await client.send(new GetSecretValueCommand({ SecretId: "07cares_DATABASE_URL" }));
  if (!out.SecretString) throw new Error("DATABASE_URL secret missing");
  cached = out.SecretString;
  return cached;
}
