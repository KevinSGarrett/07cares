# Infrastructure as Code

This directory contains AWS CDK infrastructure for CloudWatch alarms and monitoring.

## Prerequisites

1. AWS CLI configured with credentials
2. CDK bootstrap: `cdk bootstrap aws://unknown-account/us-east-1`
3. Install dependencies: `pnpm install` (from project root)

## Deploying the Monitoring Stack

```bash
cd infra
pnpm install
pnpm run deploy
```

## Configuration

Edit `app.ts` to configure:
- Amplify App ID
- RDS DB Instance Identifier
- Notification email for alarms

## Stack Resources

- **3 CloudWatch Alarms**:
  - HTTP 5xx error rate spike
  - p95 latency threshold
  - RDS CPU utilization
  
- **1 SNS Topic** (optional):
  - For alarm notifications

## Cleanup

```bash
cdk destroy
```

