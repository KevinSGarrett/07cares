import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Fundraise Starter")).toBeVisible();
});

test("campaign page loads with progress module", async ({ page }) => {
  await page.goto("/c/example-campaign");
  await expect(page.getByText(/Goal:/)).toBeVisible();
});
