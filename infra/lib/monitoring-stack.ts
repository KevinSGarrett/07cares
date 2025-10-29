import * as cdk from "aws-cdk-lib";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as cloudwatch_actions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as sns from "aws-cdk-lib/aws-sns";
import * as backup from "aws-cdk-lib/aws-backup";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";

export interface MonitoringStackProps extends cdk.StackProps {
  /**
   * Amplify App ID (e.g., d3ru1wmw4mnh7w)
   */
  amplifyAppId?: string;

  /**
   * RDS DB Instance Identifier (e.g., database-1)
   */
  dbInstanceId?: string;

  /**
   * Alarm notification email
   */
  notificationEmail?: string;

  /**
   * Optional: Full ARN of the RDS DB instance for backup selection
   * Example: arn:aws:rds:us-east-1:111111111111:db:database-1
   */
  dbInstanceArn?: string;

  /**
   * Enable a weekly snapshot policy via AWS Backup
   */
  enableWeeklySnapshot?: boolean;
}

export class MonitoringStack extends cdk.Stack {
  public readonly alarms: cloudwatch.Alarm[] = [];

  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id, props);

    const {
      amplifyAppId = "d3ru1wmw4mnh7w",
      dbInstanceId = "database-1",
      notificationEmail,
      dbInstanceArn,
      enableWeeklySnapshot = false,
    } = props;

    // SNS topic for alarm notifications
    const alarmTopic = notificationEmail
      ? new sns.Topic(this, "AlarmTopic", {
          displayName: "07cares CloudWatch Alarms",
        })
      : undefined;

    if (alarmTopic && notificationEmail) {
      alarmTopic.addSubscription(
        new subscriptions.EmailSubscription(notificationEmail)
      );
    }

    // noop

    // 1. Amplify HTTP 5xx Error Rate Alarm
    const http5xxAlarm = new cloudwatch.Alarm(this, "AmplifyHTTP5xxAlarm", {
      alarmName: "07cares-http-5xx-spike",
      alarmDescription: "Triggered when Amplify reports HTTP 5xx errors spike",
      metric: new cloudwatch.Metric({
        namespace: "AWS/Amplify",
        metricName: "Http5xxErrorRate",
        dimensionsMap: {
          AppId: amplifyAppId,
        },
        statistic: "Sum",
        period: cdk.Duration.minutes(5),
      }),
      threshold: 10, // More than 10 errors in 5 minutes
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      comparisonOperator:
        cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    });

    if (alarmTopic) {
      http5xxAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));
    }
    this.alarms.push(http5xxAlarm);

    // 2. Amplify p95 Latency Alarm
    const latencyAlarm = new cloudwatch.Alarm(this, "AmplifyLatencyAlarm", {
      alarmName: "07cares-p95-latency",
      alarmDescription: "Triggered when Amplify p95 latency exceeds threshold",
      metric: new cloudwatch.Metric({
        namespace: "AWS/Amplify",
        metricName: "BackendLatencyP95",
        dimensionsMap: {
          AppId: amplifyAppId,
        },
        statistic: "p95",
        period: cdk.Duration.minutes(5),
      }),
      threshold: 3000, // 3 seconds
      evaluationPeriods: 2,
      datapointsToAlarm: 2,
      comparisonOperator:
        cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    });

    if (alarmTopic) {
      latencyAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));
    }
    this.alarms.push(latencyAlarm);

    // 3. RDS CPU Utilization Alarm
    const rdsCpuAlarm = new cloudwatch.Alarm(this, "RDSCpuAlarm", {
      alarmName: "07cares-rds-cpu-high",
      alarmDescription: "Triggered when RDS CPU exceeds 70% for 5 minutes",
      metric: new cloudwatch.Metric({
        namespace: "AWS/RDS",
        metricName: "CPUUtilization",
        dimensionsMap: {
          DBInstanceIdentifier: dbInstanceId,
        },
        statistic: "Average",
        period: cdk.Duration.minutes(5),
      }),
      threshold: 70,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      comparisonOperator:
        cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
    });

    if (alarmTopic) {
      rdsCpuAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alarmTopic));
    }
    this.alarms.push(rdsCpuAlarm);

    // Export alarm ARNs for reference
    this.exportValue(http5xxAlarm.alarmArn, { name: "Http5xxAlarmArn" });
    this.exportValue(latencyAlarm.alarmArn, { name: "LatencyAlarmArn" });
    this.exportValue(rdsCpuAlarm.alarmArn, { name: "RdsCpuAlarmArn" });

    // Optional: Weekly DB snapshot via AWS Backup
    if (enableWeeklySnapshot && dbInstanceArn) {
      const vault = new backup.BackupVault(this, "BackupVault", {
        backupVaultName: "07cares-vault",
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      });

      const plan = new backup.BackupPlan(this, "WeeklyBackupPlan", {
        backupPlanName: "07cares-weekly-rds-snapshot",
        backupVault: vault,
      });

      plan.addRule(
        new backup.BackupPlanRule({
          ruleName: "weekly-snapshot",
          scheduleExpression: cdk.aws_events.Schedule.cron({
            minute: "0",
            hour: "6",
            weekDay: "SUN",
          }),
          deleteAfter: cdk.Duration.days(35), // 5 weeks retention
        })
      );

      plan.addSelection("RdsSelection", {
        resources: [backup.BackupResource.fromArn(dbInstanceArn)],
      });
    }
  }
}

