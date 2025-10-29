# Daily Log — 2025-10-29 — assistant

## What I did
- Added unit tests: env parsing defaults; getDbUrl precedence (env -> secret -> fallback).
- Added integration tests for Stripe webhook route (success + invalid signature).
- Added Playwright config and smoke + axe a11y tests for '/', '/c/example-campaign', '/portal'.
- Expanded Vitest coverage scope to include src/env.ts and src/lib/getDbUrl.ts.
- Updated docs/QA_TEST_STRATEGY.md with test IDs, coverage map, and run commands.

## Issues
- Webhook route depends on next/headers, Stripe SDK, and Prisma.
- E2E donate flow not feasible without UI + keys in CI.

## Solutions
- Mocked next/headers, @/lib/stripe, and @/server/db in integration tests.
- Focused E2E on smoke + a11y for stable SSR pages; excluded full donate flow for now.

## Decisions -> ADRs
- None required today (testing-only changes). If we later add a mocked donate flow for E2E, propose an ADR on test toggles.

## TODO / Next
- Consider adding a test toggle for donate happy path (mock PI) to cover checkout in CI.
- Add axe coverage for any new routes as they land (Admin when enabled).

## Hand-offs
- If CI flakes on Playwright webServer startup, set E2E_START_COMMAND to 'pnpm build && pnpm start' in the CI job.

