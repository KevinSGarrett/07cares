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

## Performance
- Lighthouse CI on `/`, `/c/[slug]`, `/portal` with budgets: LCP ≤ 2.5s, CLS ≤ .1, TBT ≤ 200ms.

## Environments
- Dev (shared), Staging (pre-prod), Prod. Feature flags for risky toggles.
