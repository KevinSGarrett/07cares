# Fundraise Starter — Extended

Pre-wired Next.js (App Router) + TypeScript + Prisma/Postgres + Clerk + Stripe (Payments/Connect) + Cloudinary + Mux + Typesense + Pusher + Postmark + Twilio + GrowthBook + Tailwind **with**:

- Prisma seed script
- Vitest + coverage gate (80% statements)
- Playwright e2e smoke test
- DangerJS PR checks
- semantic-release (auto changelog & GitHub releases)

## Quickstart

```bash
pnpm install
cp .env.example .env.local
pnpm prisma:push
pnpm seed
pnpm dev
```

## Scripts

- `pnpm test` — unit tests with coverage (Vitest)
- `pnpm e2e` — Playwright tests
- `pnpm seed` — seed DB with demo user + example campaign
- `pnpm release` — semantic-release (run in CI)

See `.github/workflows` for CI, E2E, and Release pipelines.
