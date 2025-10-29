import { describe, expect, it } from "vitest";
import { CampaignBasicsSchema, CampaignUpdateSchema } from "@/schemas/campaign";

describe("CampaignBasicsSchema", () => {
  it("accepts valid basics", () => {
    const parsed = CampaignBasicsSchema.safeParse({
      title: "My Campaign",
      city: "Austin",
      state: "TX",
      goalDollars: 5000,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-02-01"),
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects short title", () => {
    const parsed = CampaignBasicsSchema.safeParse({
      title: "Hi",
      city: "Austin",
      state: "TX",
      goalDollars: 100,
      startDate: new Date(),
      endDate: new Date(),
    });
    expect(parsed.success).toBe(false);
  });
});

describe("CampaignUpdateSchema", () => {
  it("allows partial updates", () => {
    const parsed = CampaignUpdateSchema.safeParse({ coverUrl: "https://example.com/x.jpg" });
    expect(parsed.success).toBe(true);
  });
});


