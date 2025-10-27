# Agent Playbook

We run 4 agents in parallel. Each agent updates a daily log in `/logs/daily` and follows the DoD.

## A1 — InfraOps (AWS/CDK/CI/CD)
- Owns AWS accounts, IAM roles, VPC, RDS Postgres, S3, CloudFront, Route53, Secrets Manager, EventBridge (cron), CloudWatch.
- Chooses **Amplify Hosting** for Next.js SSR or ECS Fargate if needed later.
- Terraform/CDK stacks; environment promotion (dev → staging → prod).
- CI/CD wiring (GitHub Actions), preview envs on PR.
- Observability: logs/metrics/alarms; uptime probe `/api/health`.

## A2 — Backend & Finance
- Prisma schema (Sections 12/14/24); Stripe integration (Payments, Connect, Identity).
- Webhooks (payment, refund, dispute, connect events).
- Payout scheduler (EventBridge/Trigger.dev), reserves, statements.
- Notifications service (Postmark/Twilio).
- API contracts (`/api/*`), zod validation, error handling.

## A3 — Frontend & UX
- Next.js App Router pages (marketing, campaign, portal, admin shell).
- Forms (zod + react-hook-form), a11y, responsive, perf budgets.
- Media pipeline (Cloudinary, Mux, Sightengine hook), Typesense search UI.
- Team module, DM, Rewards flows, Verification wizard.

## A4 — QA & Docs
- Testing pyramid: unit (Vitest/Jest), API (supertest), e2e (Playwright).
- Accessibility snapshots (axe), Lighthouse budgets.
- KB articles & admin guides; ADRs; changelog/semantic-release (optional).
- Keeps `/logs/daily` and `/docs` up to date; triages issues.
