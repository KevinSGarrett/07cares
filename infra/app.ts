#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MonitoringStack } from "./lib/monitoring-stack";

const app = new cdk.App();

// Environment configuration
const stagingEnv: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || "us-east-1",
};

// Monitoring stack for CloudWatch alarms
const monitoringStack = new MonitoringStack(app, "07cares-monitoring", {
  env: stagingEnv,
  description: "CloudWatch alarms for Amplify, RDS, and application health",
});

app.synth();

