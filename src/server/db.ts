// src/server/db.ts
import { PrismaClient } from "@prisma/client";

// Prevent multiple PrismaClient instances during dev HMR
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? new PrismaClient({ log: ["error", "warn"] });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
