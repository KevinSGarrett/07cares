# Operations

## Environments
- dev: feature integration
- staging: pre-release
- prod: live

## AWS (MVP choice)
- Amplify Hosting for Next.js SSR (fastest path).
- RDS Postgres (db.t4g.micro for dev/stage). Rotate creds via Secrets Manager.
- S3 + CloudFront for assets (if not using Cloudinary for all images).
- EventBridge Scheduler for nightly jobs (or Trigger.dev).
- CloudWatch alarms (5xx spikes, latency, DB CPU).

## Secrets
- Keep secrets in AWS Secrets Manager and GitHub Actions OIDC → role assumption for deploy jobs.

## Monitoring
- Health endpoint `/api/health` returns build SHA and DB ping.
- Uptime checks on all envs.
