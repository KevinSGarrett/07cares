// @vitest-environment node
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.resetModules();
});

describe("env schema", () => {
  it("parses required server and client vars and applies defaults", async () => {
    process.env.DATABASE_URL = "https://example.com/db";
    process.env.CLERK_SECRET_KEY = "sk_test_clerk";
    process.env.STRIPE_SECRET_KEY = "sk_test_stripe";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    process.env.CLOUDINARY_API_KEY = "cloud_key";
    process.env.CLOUDINARY_API_SECRET = "cloud_secret";
    process.env.MUX_TOKEN_ID = "mux_id";
    process.env.MUX_TOKEN_SECRET = "mux_secret";
    process.env.TYPESENSE_API_KEY = "typesense_key";
    process.env.TYPESENSE_HOST = "localhost";
    // TYPESENSE_PROTOCOL and TYPESENSE_PORT intentionally omitted to test defaults
    process.env.PUSHER_APP_ID = "pusher_app_id";
    process.env.PUSHER_SECRET = "pusher_secret";
    process.env.POSTMARK_SERVER_TOKEN = "postmark_token";
    process.env.TWILIO_ACCOUNT_SID = "twilio_sid";
    process.env.TWILIO_AUTH_TOKEN = "twilio_auth";
    process.env.TWILIO_MESSAGING_SERVICE_SID = "twilio_msg";
    process.env.GROWTHBOOK_API_HOST = "https://api.growthbook.io";

    process.env.NEXT_PUBLIC_APP_URL = "https://app.example.com";
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_clerk";
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_stripe";
    process.env.NEXT_PUBLIC_PUSHER_KEY = "pusher_key";
    process.env.NEXT_PUBLIC_PUSHER_CLUSTER = "us2";
    process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY = "gb_client_key";
    // NEXT_PUBLIC_TURNSTILE_SITE_KEY optional

    const { env } = await import("@/env");
    expect(env.DATABASE_URL).toBe("https://example.com/db");
    expect(env.STRIPE_SECRET_KEY).toBe("sk_test_stripe");
    // Defaults
    expect(env.TYPESENSE_PROTOCOL).toBe("https");
    expect(env.TYPESENSE_PORT).toBe(443);
  });
});


