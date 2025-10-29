# Operations

## Environments
- dev: feature integration
- staging: pre-release (Amplify)
- prod: live

## AWS Infrastructure

### Staging Environment
- **Amplify App ID**: `d3ru1wmw4mnh7w`
- **Amplify URL**: https://main.d3ru1wmw4mnh7w.amplifyapp.com
- **Branch**: `main`
- **Region**: `us-east-1`

### RDS Database
- **Instance Identifier**: `database-1`
- **Host**: `database-1.ca9os6a00y5u.us-east-1.rds.amazonaws.com`
- **Port**: `5432`
- **Database**: `caresdb`
- **Instance Type**: `db.t4g.micro`
- **Engine**: PostgreSQL

### GitHub Actions OIDC Configuration
Required repository secrets (configured in GitHub Settings → Secrets):
- `AWS_OIDC_ROLE_ARN`: ARN of IAM role for OIDC assumption
- `AWS_REGION`: `us-east-1`
- `AMPLIFY_APP_ID`: `d3ru1wmw4mnh7w`
- `AMPLIFY_BRANCH`: `main`

### Secrets Manager Configuration
All secrets are stored in AWS Secrets Manager:
- `07cares_DATABASE_URL`: RDS PostgreSQL connection string
- `07cares_ClerkPublishableKey`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `07cares_ClerkSecretKey`: `CLERK_SECRET_KEY`
- `07cares_StripeSecretKey`: `STRIPE_SECRET_KEY`

Note: The application no longer ships with any database URL fallback. Staging/production require Secrets Manager or the `DATABASE_URL` env var to be set at runtime.

## Deployment

### Amplify Environment Variables
Configure in AWS Amplify Console:
```
DATABASE_URL → AWS Secrets Manager: 07cares_DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY → AWS Secrets Manager: 07cares_ClerkPublishableKey
CLERK_SECRET_KEY → AWS Secrets Manager: 07cares_ClerkSecretKey
STRIPE_SECRET_KEY → AWS Secrets Manager: 07cares_StripeSecretKey
AWS_REGION → us-east-1
```

### GitHub Actions Deployment
The deploy workflow (`.github/workflows/deploy.yml`) uses OIDC to assume AWS role and trigger Amplify jobs:
1. Validates required secrets exist
2. Assumes AWS OIDC role via `configure-aws-credentials@v4`
3. Waits for existing Amplify jobs to complete
4. Starts new `RELEASE` job in Amplify
5. Polls job status until completion

## Monitoring

### Health Endpoint
- **URL**: https://main.d3ru1wmw4mnh7w.amplifyapp.com/api/health
- **Response**: JSON with `ok`, `db` status, `timestamp`, `runtime`, `env`, `build` SHA
- **Methods**: `GET`, `HEAD`, `OPTIONS`

### CloudWatch Alarms

#### Infrastructure as Code
CloudWatch alarms are defined in CDK (`infra/lib/monitoring-stack.ts`):
- **Stack**: `07cares-monitoring`
- **Deploy**: `cd infra && cdk deploy`

Optional weekly snapshot policy:
- Enable by setting `enableWeeklySnapshot=true` and provide `dbInstanceArn` (e.g., `arn:aws:rds:us-east-1:<account-id>:db:database-1`).
- Creates Backup Vault and a weekly plan (Sundays 06:00 UTC) retaining 5 weeks.

#### Alarms

1. **HTTP 5xx Spike Alarm**
   - **Name**: `07cares-http-5xx-spike`
   - **Metric**: Amplify `Http5xxErrorRate`
   - **Threshold**: >10 errors in 5 minutes
   - **Action**: SNS notification

2. **Latency Alarm**
   - **Name**: `07cares-p95-latency`
   - **Metric**: Amplify `BackendLatencyP95`
   - **Threshold**: >3000ms for 2 consecutive periods (10 minutes)
   - **Action**: SNS notification

3. **RDS CPU Alarm**
   - **Name**: `07cares-rds-cpu-high`
   - **Metric**: RDS `CPUUtilization` for `database-1`
   - **Threshold**: >70% for 5 minutes
   - **Action**: SNS notification

#### Alarm ARNs (post-deploy)
```
arn:aws:cloudwatch:us-east-1:<account-id>:alarm:07cares-http-5xx-spike
arn:aws:cloudwatch:us-east-1:<account-id>:alarm:07cares-p95-latency
arn:aws:cloudwatch:us-east-1:<account-id>:alarm:07cares-rds-cpu-high
```

### Uptime Checks
Configure synthetic checks for:
- `/api/health` (every 5 minutes)
- Home page (every 1 minute)

## Best Practices
1. Never commit secrets; use Secrets Manager for sensitive values
2. Use OIDC for CI/CD (no long-lived AWS credentials)
3. Monitor alarms daily; respond to alerts within 1 hour
4. Review CloudWatch logs weekly for anomalies
5. Rotate database credentials quarterly

## API and Feature Flags

### API Routes
- `POST /api/donate/create-intent`: Creates a Stripe PaymentIntent; metadata includes `campaignId`.
- `POST /api/stripe/webhook`: Receives Stripe events. `payment_intent.succeeded` records a `Donation` with fallback donor when bypassing auth.
- `POST /api/stripe/connect/onboard`: Creates a Connect Express account and returns onboarding link (behind feature flags/secrets).
- `POST /api/stripe/payouts/schedule`: Schedules payouts (stub) — returns 404 unless `PAYOUTS_SCHEDULER_ENABLED=true`.
- `GET /api/campaign/[slug]/debug`: Returns campaign and aggregate donations for debugging.
- `GET /api/health`: System health check.

### Feature Flags and Env
- `AUTH_BYPASS` (server): When `true`, webhook uses a demo user and sets `hideName=true` for donations.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`: Required to enable Stripe endpoints.
- Connect onboarding requires `NEXT_PUBLIC_APP_URL` to build return/refresh URLs.
- `STRIPE_CONNECT_ENABLED` (server): When `true`, enables Connect Express onboarding endpoint.
- `PAYOUTS_SCHEDULER_ENABLED` (server): Reserved flag; when `true`, enables the payout scheduler (stub for now).

### Data Model (Prisma)
New entities added to support Sections 12/14/24:
- `RewardTier`, `RewardClaim` (campaign perks and claims)
- `Team`, `TeamMember` (team fundraising)
- `ReferralLink` (attribution)
- `Payout`, `Ledger` (funds flow tracking)
- `CampaignMedia`, `CampaignUpdate` (content)

Alarm ARNs:
- arn:aws:cloudwatch:us-east-1:029530099913:alarm:07cares-http-5xx-spike
- arn:aws:cloudwatch:us-east-1:029530099913:alarm:07cares-p95-latency
- arn:aws:cloudwatch:us-east-1:029530099913:alarm:07cares-rds-cpu-high

![Deploy (Amplify) success](docs/screenshots/deploy-green.png)


![Deploy (Amplify) success](docs/screenshots/deploy-green.png)

