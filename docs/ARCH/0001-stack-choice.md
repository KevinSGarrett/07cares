# ADR 0001 — Stack Choice (2025-10-27)

## Context
We need rapid development with rich plugin ecosystem and strong Stripe/Clerk support.

## Decision
Use Next.js (App Router) + TypeScript + Prisma/Postgres + Stripe/Connect + Clerk + Cloudinary + Mux + Typesense.
Host app on AWS Amplify (MVP). Use Trigger.dev for scheduled jobs. Keep SaaS for media/search to reduce build time.

## Consequences
- Fast integration; low infra lift.
- Can migrate to ECS/Lambda later if needed.
