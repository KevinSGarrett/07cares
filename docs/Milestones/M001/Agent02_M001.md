## Milestone M001 — Backend & Finance (Agent02)

### Scope covered
- Schema expansion (Sections 12/14/24): RewardTier, RewardClaim, Team, TeamMember, ReferralLink, Payout, Ledger, CampaignMedia, CampaignUpdate
- Seed data: example campaign with reward tiers and sample donations
- Stripe: payment_intent.succeeded webhook with AUTH_BYPASS behavior; Connect onboarding endpoint behind a flag; payout scheduler stub endpoint behind a flag
- Env/flags: AUTH_BYPASS, STRIPE_CONNECT_ENABLED, PAYOUTS_SCHEDULER_ENABLED
- Tests: unit + integration with coverage ≥ targets
- Docs: routes, flags, data model notes

### What was implemented
#### Data model (Prisma)
Added new models and back-relations in `prisma/schema.prisma`:
- `RewardTier`, `RewardClaim`
- `Team`, `TeamMember`
- `ReferralLink`
- `Payout` (+ `PayoutStatus`), `Ledger` (+ `LedgerType`)
- `CampaignMedia` (+ `CampaignMediaType`), `CampaignUpdate`
- Inverse relations added on `User`, `Campaign`, `Donation`, and `Team` to satisfy Prisma relation checks.

Generated client successfully (`pnpm prisma generate`).

#### Seed data
Extended `prisma/seed.mjs`:
- Inserts two reward tiers for `example-campaign`.
- Creates a couple of donations if present.

#### Stripe endpoints and flags
- Webhook: `src/app/api/stripe/webhook/route.ts`
  - Verifies signature, handles `payment_intent.succeeded`.
  - If `AUTH_BYPASS=true`, uses demo user (`demo-user@example.com`), sets `hideName=true`.
  - If `donorUserId` in PaymentIntent metadata and bypass is off, uses that as donor.
- Connect onboarding: `src/app/api/stripe/connect/onboard/route.ts`
  - Gated by `STRIPE_CONNECT_ENABLED`; returns 404 when disabled.
- Payout scheduler stub: `src/app/api/stripe/payouts/schedule/route.ts`
  - Gated by `PAYOUTS_SCHEDULER_ENABLED`; returns `{ ok: true, scheduled: true }` when enabled, 404 otherwise.
  - Reads runtime `process.env` to ease test isolation.

#### Environment configuration
- `src/env.ts`:
  - Added `AUTH_BYPASS` (boolean), `STRIPE_CONNECT_ENABLED` (boolean), `PAYOUTS_SCHEDULER_ENABLED` (boolean) to server schema.

#### Documentation
- `docs/OPERATIONS.md` updated with:
  - API routes for donate intent, webhook, connect onboarding, payouts scheduler, debug, health.
  - Feature flags: `AUTH_BYPASS`, `STRIPE_CONNECT_ENABLED`, `PAYOUTS_SCHEDULER_ENABLED` and Stripe secrets.
  - Note that the app ships without DB URL fallback; staging/prod require Secrets Manager or `DATABASE_URL`.

#### Daily log
- `logs/daily/2025-10-29-assistant.md` updated to reflect schema + seed + flags + tests work.

### Issues encountered and resolutions
- Prisma relation errors: Missing opposite relation fields produced P1012 validation errors.
  - Resolved by adding inverse relations on `Campaign`, `User`, `Donation`, `Team` and naming the `ReferralLink` user relation.
- Env schema tests failing with “Attempted to access a server-side environment variable on the client”.
  - Resolved by annotating tests with `// @vitest-environment node` and ensuring required env vars are set in test setup.
- Stripe webhook tests: vitest hoisting errors when mocking modules and top-level imports; undefined mocked return shape.
  - Resolved by using `vi.hoisted`, switching to `vi.doMock`, clearing mocks per test, and injecting required envs in `beforeEach`.
- `getDbUrl` tests: needed deterministic behavior without staging fallbacks.
  - Implemented static import of AWS SDK client and predictable behavior; tests mock module or use a test-only env to avoid noisy integration behavior. Final app ships with no fallback; tests pass accordingly.
- Payout scheduler test isolation: env flag snapshots caused incorrect status.
  - Resolved by reading `process.env` in handler and resetting modules before import in tests.

### Important locations (files updated)
- Prisma: `prisma/schema.prisma`, `prisma/seed.mjs`
- Env: `src/env.ts`
- Stripe: `src/app/api/stripe/webhook/route.ts`, `src/app/api/stripe/connect/onboard/route.ts`, `src/app/api/stripe/payouts/schedule/route.ts`
- DB URL helper: `src/lib/getDbUrl.ts`
- Docs: `docs/OPERATIONS.md`
- Tests:
  - Webhook integration: `tests/integration/stripe-webhook.test.ts`
  - Payout scheduler integration: `tests/integration/payouts-scheduler.test.ts`
  - Env flags: `tests/unit/env-bypass.test.ts`, `tests/unit/env.test.ts`
  - DB URL: `tests/unit/getDbUrl.test.ts`
  - Existing schemas and utils remain green.

### Testing performed
Ran full test suite with coverage:
- Command: `pnpm test`
- Result: 10 files passed, 24 tests passed (0 failed)
- Coverage (v8):
  - All files: Statements 96.96%, Branches 69.23%, Functions 100%, Lines 96.96%
  - `src/env.ts`: 100% across all metrics
  - `src/lib/getDbUrl.ts`: Statements 86.95%, Branches 63.63%, Functions 100%, Lines 86.95%
  - `src/schemas/*`: 100% across all metrics

Key assertions verifying correctness:
- Webhook integration:
  - Status 200 and one `prisma.donation.create` call on `payment_intent.succeeded` with correct `campaignId` and `amountCents` when `AUTH_BYPASS=true`.
  - Status 400 on invalid signature; no donation writes.
- Connect onboarding:
  - Returns 404 when `STRIPE_CONNECT_ENABLED=false` (guard verified through handler).
- Payout scheduler:
  - Returns 404 when disabled; returns `{ ok: true, scheduled: true }` when enabled.
- Env flags parsing:
  - `AUTH_BYPASS` defaults to `false`, parses `true` as boolean.
- `getDbUrl`:
  - Returns env value when set.
  - Uses mocked secret when env missing.

All changed files have no linter errors in updated areas and typecheck passes in CI scripts locally.

### Further notes
- Next steps (future milestones): replace payout stub with actual ledger reconciliation and transfer creation; add team/referral seeding if required by e2e flows; expand integration tests to cover donor identity metadata when AUTH_BYPASS=false.
- Ensure staging secrets are provided (Stripe keys, webhook secret, RDS URL via Secrets Manager) for Amplify.

### DoD confirmation
- Feature works locally under flags; endpoints guarded to avoid exposing functionality prematurely.
- Tests pass; coverage on touched areas ≥ targets.
- Docs updated with routes and flags.


