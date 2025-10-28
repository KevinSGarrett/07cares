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
