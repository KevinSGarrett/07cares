# QA & Test Strategy

## Gates
- Typecheck and lint on every PR.
- Unit tests required for new modules; integration tests for APIs; e2e for critical flows.
- Coverage threshold: 80% lines on changed files (enforced later if needed).

## E2E (Playwright)
- Smoke: registration/login, create campaign, donate, receipt, reward claim, payout eligibility.
- Regression packs: checkout edge cases (AoN banner), anonymous vs hidden donor name, team invite flow.

## Accessibility
- axe checks per route; fail PR on critical violations.

### Current axe coverage (Playwright)
- `/` Home: heading `Fundraise Starter`
- `/c/example-campaign`: heading contains `Campaign`
- `/portal`: first heading present

Violations with impact `serious` or `critical` cause test failures.

## Performance
- Lighthouse CI on `/`, `/c/[slug]`, `/portal` with budgets: LCP ≤ 2.5s, CLS ≤ .1, TBT ≤ 200ms.

## Environments
- Dev (shared), Staging (pre-prod), Prod. Feature flags for risky toggles.

---

## Test IDs / Coverage Map

### Unit (Vitest)
- `tests/unit/env.test.ts`
  - Validates required server/client env parsing
  - Asserts defaults: `TYPESENSE_PROTOCOL=https`, `TYPESENSE_PORT=443`
- `tests/unit/getDbUrl.test.ts`
  - Prefers `process.env.DATABASE_URL`
  - Falls back to AWS Secrets Manager when present
  - Uses final staging fallback when neither available

### Integration (Vitest)
- `tests/integration/stripe-webhook.test.ts`
  - Success path: `payment_intent.succeeded` → inserts Donation
  - Error path: invalid signature → 400, no DB writes

### E2E (Playwright)
- `e2e/smoke-a11y.spec.ts`
  - Home smoke + axe
  - Campaign smoke + axe
  - Portal smoke + axe
- `e2e/donate-happy.spec.ts`
  - Creates a PaymentIntent via `/api/donate/create-intent` in mock mode
  - Uses `E2E_MOCK_STRIPE=1` to bypass real Stripe

### How to run
- Unit/integration: `pnpm test`
- E2E: `pnpm e2e` (starts dev server via Playwright webServer)
  - The server is started with `E2E_MOCK_STRIPE=1` and `AUTH_BYPASS=true`

