import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectNoSeriousA11yViolations(page: any) {
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) =>
    (v.impact === "serious" || v.impact === "critical")
  );
  if (serious.length) {
    // Attach a readable summary for debugging
    console.error("A11y serious/critical violations:", serious.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })));
  }
  expect(serious, "No serious/critical a11y violations expected").toHaveLength(0);
}

test.describe("Smoke + a11y", () => {
  test("Home loads and passes a11y", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Fundraise Starter/i })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("Campaign page loads and passes a11y", async ({ page }) => {
    await page.goto("/c/example-campaign");
    await expect(page.getByRole("heading", { name: /Campaign/i })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("Portal page loads and passes a11y", async ({ page }) => {
    await page.goto("/portal");
    await expect(page.getByRole("heading")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});


