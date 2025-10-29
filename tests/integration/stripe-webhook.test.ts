// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

// Hoisted fns used inside vi.mock factories
const { donationCreate1, userUpsert1, donationCreate2 } = vi.hoisted(() => {
  return {
    donationCreate1: vi.fn(async () => ({})),
    userUpsert1: vi.fn(async () => ({ id: "user_anon" })),
    donationCreate2: vi.fn(),
  };
});

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
  // Required server env
  process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";
  process.env.CLERK_SECRET_KEY = "sk_clerk";
  process.env.STRIPE_SECRET_KEY = "sk_test";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
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
  // Required client env
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_clerk";
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_stripe";
  process.env.NEXT_PUBLIC_PUSHER_KEY = "key";
  process.env.NEXT_PUBLIC_PUSHER_CLUSTER = "us3";
  process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY = "gb";
});

describe("Stripe webhook route", () => {
  it("handles payment_intent.succeeded and writes a donation", async () => {
    donationCreate1.mockClear();
    userUpsert1.mockClear();
    process.env.AUTH_BYPASS = "true";
    vi.mock("next/headers", () => ({
      headers: () => ({ get: () => "testsig" }),
    }));

    vi.doMock("@/lib/stripe", () => ({
      stripe: {
        webhooks: {
          constructEvent: (_raw: string) => {
            return {
              type: "payment_intent.succeeded",
              data: {
                object: {
                  id: "pi_123",
                  amount_received: 1234,
                  metadata: { campaignId: "camp1" },
                },
              },
            } as any;
          },
        },
      },
    }));

    vi.doMock("@/server/db", () => ({
      prisma: {
        user: { upsert: userUpsert1 },
        donation: { create: donationCreate1 },
      },
    }));

    const mod = await import("@/app/api/stripe/webhook/route");
    const body = JSON.stringify({ any: "payload" });
    const res = await mod.POST(new Request("http://test", { method: "POST", body }));
    const text = await res.text();
    expect({ status: res.status, text }).toEqual({ status: 200, text: "ok" });
    // Upsert may be optimized away in some code paths; donation create is the contract we require
    expect(donationCreate1).toHaveBeenCalledTimes(1);
    const args = donationCreate1.mock.calls[0]![0] as any;
    expect(args.data.campaignId).toBe("camp1");
    expect(args.data.amountCents).toBe(1234);
  });

  it("returns 400 on invalid signature", async () => {
    donationCreate2.mockClear();
    process.env.AUTH_BYPASS = "true";
    vi.mock("next/headers", () => ({
      headers: () => ({ get: () => "bad" }),
    }));

    vi.doMock("@/lib/stripe", () => ({
      stripe: {
        webhooks: {
          constructEvent: () => {
            throw new Error("Invalid signature");
          },
        },
      },
    }));

    // prisma mocked but should not be called
    vi.doMock("@/server/db", () => ({
      prisma: {
        user: { upsert: vi.fn() },
        donation: { create: donationCreate2 },
      },
    }));

    const mod = await import("@/app/api/stripe/webhook/route");
    const res = await mod.POST(new Request("http://test", { method: "POST", body: "{}" }));
    expect(res.status).toBe(400);
    expect(donationCreate2).not.toHaveBeenCalled();
  });
});


