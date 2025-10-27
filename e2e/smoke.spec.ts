import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

test("home page renders H1", async ({ page }) => {
  await page.goto(BASE + "/");
  await expect(page.getByRole("heading", { name: "07.Cares", level: 1 })).toBeVisible();
});

test("health endpoint returns ok", async ({ request }) => {
  const res = await request.get(BASE + "/api/health");
  expect(res.status()).toBe(200);
  const data = await res.json();
  expect(data?.ok).toBe(true);
});
