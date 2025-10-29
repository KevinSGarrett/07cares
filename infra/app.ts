#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MonitoringStack } from './lib/monitoring-stack';

const app = new cdk.App();

// Environment configuration
const stagingEnv: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT ?? '029530099913',
  region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
};

// Deploy real monitoring alarms
new MonitoringStack(app, 'Cares07Monitoring', {
  env: stagingEnv,
  amplifyAppId: 'd3ru1wmw4mnh7w',
  dbInstanceId: 'database-1',
  // enableWeeklySnapshot: true,
  // dbInstanceArn: 'arn:aws:rds:us-east-1:029530099913:db:database-1',
  // notificationEmail: 'ops@example.com',
});

app.synth();
