import { describe, expect, it } from "vitest";
import { CreateIntentBody } from "@/schemas/donate";

describe("CreateIntentBody", () => {
  it("accepts valid payload", () => {
    const ok = CreateIntentBody.safeParse({ amount: 500, campaignId: "abc" });
    expect(ok.success).toBe(true);
  });
  it("rejects small amounts", () => {
    const bad = CreateIntentBody.safeParse({ amount: 100, campaignId: "abc" });
    expect(bad.success).toBe(false);
  });
});

import { describe, it, expect } from "vitest";
import { CreateIntentBody } from "@/schemas/donate";

describe("CreateIntentBody", () => {
  it("accepts valid payload", () => {
    expect(CreateIntentBody.safeParse({ amount: 500, campaignId: "abc" }).success).toBe(true);
  });
  it("rejects amount < 500", () => {
    expect(CreateIntentBody.safeParse({ amount: 499, campaignId: "abc" }).success).toBe(false);
  });
});
