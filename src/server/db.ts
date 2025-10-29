// src/server/db.ts
import { PrismaClient } from "@prisma/client";

// Prevent multiple PrismaClient instances during dev HMR
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const url = process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production" && (!url || url.trim().length === 0)) {
  throw new Error(
    "DATABASE_URL not set. Configure Amplify env var or Secrets Manager integration."
  );
}

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    // If url is undefined (dev), Prisma will use .env/.env.local as usual
    datasources: url ? { db: { url } } : undefined,
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
