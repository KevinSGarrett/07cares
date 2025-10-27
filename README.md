# Fundraise Starter (Next.js + TS)

This starter is pre-wired to the stack we planned: Next.js (App Router), Prisma/Postgres, Clerk, Stripe, Cloudinary, Mux, Typesense, Pusher, Postmark, Twilio, GrowthBook, Tailwind.

## Quickstart

```bash
pnpm install
cp .env.example .env.local   # fill keys
pnpm prisma:push
pnpm dev
```

Open http://localhost:3000

## What's included

- App Router layout with Clerk provider
- Public campaign page stub: `/c/[slug]`
- Portal stub: `/portal` (auth protected)
- Admin stub: `/admin` (react-admin mount)
- API routes:
  - `POST /api/donate/create-intent` — Stripe PaymentIntent creator
  - `POST /api/stripe/webhook` — handles payment events
  - `POST /api/stripe/connect/onboard` — Connect Express onboarding link
  - `POST /api/cloudinary/sign` — signed image upload helper
  - `POST /api/dm/send` — Pusher message trigger
  - `POST /api/search/index-campaign` — Typesense upsert example
  - `GET|POST /api/trigger` — Trigger.dev handler entry
- Libs for Stripe, Pusher, Typesense, Cloudinary, Mux, Postmark, Twilio, GrowthBook
- Prisma models: User, Campaign, Donation (extend per spec)

## Next steps

- Expand Prisma schema to match Sections 12/14 (RewardTier, RewardClaim, Team, Payout, Ledger).
- Attach actual donor user ID in `payment_intent.succeeded` handler.
- Implement Connect payout scheduler (Trigger.dev).
- Add media moderation, search facets UI, admin endpoints + RBAC (CASL).
- Wire transactional templates (Postmark) and SMS quiet hours (Twilio).
