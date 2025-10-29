// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
  process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";
  process.env.CLERK_SECRET_KEY = "sk";
  process.env.STRIPE_SECRET_KEY = "sk";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec";
  process.env.CLOUDINARY_API_KEY = "key";
  process.env.CLOUDINARY_API_SECRET = "secret";
  process.env.MUX_TOKEN_ID = "mux";
  process.env.MUX_TOKEN_SECRET = "mux";
  process.env.TYPESENSE_API_KEY = "xyz";
  process.env.TYPESENSE_HOST = "localhost";
  process.env.PUSHER_APP_ID = "app";
  process.env.PUSHER_SECRET = "sec";
  process.env.POSTMARK_SERVER_TOKEN = "pm";
  process.env.TWILIO_ACCOUNT_SID = "sid";
  process.env.TWILIO_AUTH_TOKEN = "auth";
  process.env.TWILIO_MESSAGING_SERVICE_SID = "svc";
  process.env.GROWTHBOOK_API_HOST = "https://gb.example.com";
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk";
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk";
  process.env.NEXT_PUBLIC_PUSHER_KEY = "key";
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER = "us3";
  process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY = "gb";
});

describe("Payouts scheduler endpoint", () => {
  it("returns 404 when disabled", async () => {
    process.env.PAYOUTS_SCHEDULER_ENABLED = "false";
    vi.resetModules();
    const mod = await import("@/app/api/stripe/payouts/schedule/route");
    const res = await mod.POST();
    expect(res.status).toBe(404);
  });

  it("returns ok when enabled", async () => {
    process.env.PAYOUTS_SCHEDULER_ENABLED = "true";
    vi.resetModules();
    const mod = await import("@/app/api/stripe/payouts/schedule/route");
    const res = await mod.POST();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, scheduled: true });
  });
});


