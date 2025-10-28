// src/server/db.ts
import { PrismaClient } from "@prisma/client";

// Prevent multiple PrismaClient instances during dev HMR
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * In production (Amplify staging), process.env may be empty on runtime handlers.
 * Provide a safe fallback for the Prisma datasource if DATABASE_URL is missing.
 */
const FALLBACK_RDS_URL =
  "postgresql://cares_app:Strong!Passw0rd@database-1.ca9os6a00y5u.us-east-1.rds.amazonaws.com:5432/caresdb?sslmode=require";

const url =
  process.env.DATABASE_URL ??
  (process.env.NODE_ENV === "production" ? FALLBACK_RDS_URL : undefined);

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
