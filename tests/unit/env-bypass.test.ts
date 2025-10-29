// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function setRequiredEnv(overrides: Record<string, string> = {}) {
  const base: Record<string, string> = {
    DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
    CLERK_SECRET_KEY: "sk_clerk_test",
    STRIPE_SECRET_KEY: "sk_test_123",
    STRIPE_WEBHOOK_SECRET: "whsec_test_123",
    CLOUDINARY_API_KEY: "key",
    CLOUDINARY_API_SECRET: "secret",
    MUX_TOKEN_ID: "mux_id",
    MUX_TOKEN_SECRET: "mux_secret",
    TYPESENSE_API_KEY: "xyz",
    TYPESENSE_HOST: "localhost",
    TYPESENSE_PROTOCOL: "http",
    TYPESENSE_PORT: "8108",
    PUSHER_APP_ID: "app",
    PUSHER_SECRET: "secret",
    POSTMARK_SERVER_TOKEN: "token",
    TWILIO_ACCOUNT_SID: "sid",
    TWILIO_AUTH_TOKEN: "auth",
    TWILIO_MESSAGING_SERVICE_SID: "svc",
    GROWTHBOOK_API_HOST: "https://growthbook.example.com",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_clerk_test",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_123",
    NEXT_PUBLIC_PUSHER_KEY: "key",
    NEXT_PUBLIC_PUSHER_CLUSTER: "us3",
    NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY: "gb_key",
  };
  Object.assign(process.env, base, overrides);
}

describe("env AUTH_BYPASS flag", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("defaults to false when unset", async () => {
    setRequiredEnv({});
    const { env } = await import("../../src/env");
    expect(env.AUTH_BYPASS).toBe(false);
  });

  it("parses true when set", async () => {
    setRequiredEnv({ AUTH_BYPASS: "true" });
    const { env } = await import("../../src/env");
    expect(env.AUTH_BYPASS).toBe(true);
  });
});


