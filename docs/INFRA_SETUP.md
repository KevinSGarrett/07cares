# Infrastructure Setup Summary

This document outlines the staging infrastructure setup for 07cares on AWS Amplify with OIDC-based deployments and CloudWatch monitoring.

## Completed Work

### 1. Enhanced Health Endpoint
**File**: `src/app/api/health/route.ts`

The health endpoint now includes:
- Database connectivity check (via Prisma)
- Build SHA tracking (from Amplify environment)
- Environment information
- Structured JSON response for monitoring systems

**Endpoint**: https://main.d3ru1wmw4mnh7w.amplifyapp.com/api/health

### 2. GitHub Actions Deployment Workflow
**File**: `.github/workflows/deploy.yml`

The workflow is already configured and uses:
- OIDC authentication via `aws-actions/configure-aws-credentials@v4`
- Repository secrets:
  - `AWS_OIDC_ROLE_ARN`
  - `AWS_REGION` (us-east-1)
  - `AMPLIFY_APP_ID` (d3ru1wmw4mnh7w)
  - `AMPLIFY_BRANCH` (main)

### 3. AWS CDK Infrastructure for Monitoring
**Directory**: `infra/`

Created CDK stack for CloudWatch alarms:
- HTTP 5xx Spike Alarm (Amplify metrics)
- p95 Latency Alarm (Amplify metrics)
- RDS CPU High Alarm (RDS metrics)

**To deploy**:
```bash
cd infra
pnpm install
pnpm run deploy
```

### 4. Updated Documentation
**File**: `docs/OPERATIONS.md`

Documented:
- Staging environment URLs and ARNs
- GitHub Actions OIDC configuration
- Secrets Manager mapping
- CloudWatch alarm specifications
- Deployment procedures

## Next Steps

### Required: Configure AWS Secrets
Set up the following in AWS Secrets Manager (us-east-1):
1. `07cares_DATABASE_URL` - PostgreSQL connection string
2. `07cares_ClerkPublishableKey` - Clerk publishable key
3. `07cares_ClerkSecretKey` - Clerk secret key
4. `07cares_StripeSecretKey` - Stripe secret key

### Required: Configure Amplify Environment Variables
Map secrets in AWS Amplify Console:
```
DATABASE_URL → AWS Secrets Manager: 07cares_DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY → AWS Secrets Manager: 07cares_ClerkPublishableKey
CLERK_SECRET_KEY → AWS Secrets Manager: 07cares_ClerkSecretKey
STRIPE_SECRET_KEY → AWS Secrets Manager: 07cares_StripeSecretKey
AWS_REGION → us-east-1
```

### Required: Configure GitHub Secrets
Set the following in GitHub Settings → Secrets → Actions:
- `AWS_OIDC_ROLE_ARN` - ARN of IAM role for OIDC
- `AWS_REGION` - us-east-1
- `AMPLIFY_APP_ID` - d3ru1wmw4mnh7w
- `AMPLIFY_BRANCH` - main

### Optional: Deploy CloudWatch Alarms
Deploy the monitoring stack to enable alarms:
```bash
cd infra
pnpm install
pnpm run deploy
```

## Verification

After deployment, verify:
1. Health endpoint: `curl https://main.d3ru1wmw4mnh7w.amplifyapp.com/api/health`
2. Deployment workflow: Check GitHub Actions for successful runs
3. CloudWatch alarms: Verify alarms exist in AWS Console

## Rollback Plan

If staging fails:
1. Check logs in Amplify Console
2. Verify secrets in Secrets Manager
3. Check IAM role permissions for OIDC
4. Review workflow logs in GitHub Actions

## Support

For issues:
- Amplify logs: AWS Amplify Console → App → Job logs
- CloudWatch logs: AWS Console → CloudWatch → Logs
- Health checks: `/api/health` endpoint response

