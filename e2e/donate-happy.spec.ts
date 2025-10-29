import { test, expect } from "@playwright/test";

test.describe("Donate happy path (mocked)", () => {
  test("create intent returns clientSecret in mock mode", async ({ request }) => {
    const res = await request.post("/api/donate/create-intent", {
      data: { amount: 500, campaignId: "example-campaign" },
      headers: { "content-type": "application/json" },
    });
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.clientSecret).toMatch(/^pi_test_example-campaign_500_secret$/);
  });
});


