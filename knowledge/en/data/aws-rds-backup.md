---
type: Concept
title: 'RDS backups: recoverable points and restoration procedures'
description: Separate backup retention from restorable time and explain checks after restoring a new DB.
concept_id: aws-rds-backup
language: en
tags:
- aws
- database
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2027-01-07T00:46:30+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: Review managed-service capabilities and operational behavior after 120 days.
sources:
- id: backups
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html
  title: Working with automated backups
- id: pitr
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html
  title: Restoring a DB instance to a specified time
translation:
  source_language: ko
  source_concept_id: aws-rds-backup
  source_fingerprint: sha256:98ed773400237c610c06d82acd2c56e19d20f81857e9e80e6ebd564da63c1ada
  target_fingerprint: sha256:566b3c405d814c40e7cd2607e30d8ccd64e12b5842f345f2b230972999eaa1f0
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# RDS backups: recoverable points and restoration procedures

## Summary

Backups retain data; recovery uses it to make a service usable again. RDS automated backups support point-in-time recovery within retention. Check the actual restorable time and the procedure for switching to the restored DB.[^backups][^pitr]

## Learning objectives

Separate backup retention from restorable time and explain checks after restoring a new DB.

## Prerequisites

Read [RDS for PostgreSQL](aws-rds-postgresql.md), [RPO](../../../glossary/en/rpo.md) for data-loss objectives, and [RTO](../../../glossary/en/rto.md) for interruption objectives. PITR restores to a specified point in time.

## 101 · Understand the concept

### External facts

Automated backups support point-in-time recovery within retention. Manual snapshots are separately created recovery points and have different retention behavior when a DB instance is deleted.[^backups]

DB-instance PITR creates a new instance rather than rewinding the source in place. Review settings such as parameter groups and security groups after restoration.[^pitr]

LatestRestorableTime identifies the latest available recovery point. Retention duration alone does not establish the data-loss objective.[^pitr]

## 201 · Apply the example

### Design example

Suppose an incorrect data change occurred at 14:00. Choose an available recovery point before the error and plan restoration to a separate DB instance. Then check data, parameter groups, and security groups, and decide how to switch application connections.

Valid data entered after 14:00 also needs preservation or reconciliation. This is a recovery plan example, not a record of execution time or success.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Agree RPO and RTO per workload and measure restoration, integrity checks, connection cutover, and service validation.

- Exercise recovery from an incorrect data change separately from Multi-AZ failover.

- For Region or account loss, design backup copies together with keys, permissions, and the recovery execution location.

### Operational checks

- [ ] Are actual retention and the latest restorable time checked?
- [ ] Are retained automated backups, final snapshots, and manual snapshots addressed in deletion policy?
- [ ] Have restored data, settings, performance, and application cutover been validated?

## Check your understanding

**Question:** Does long backup retention establish that a short RPO is met?

**Explanation:** Check the actual latest restorable time. Retention concerns how old the retained recovery points can be; RPO concerns acceptable data loss.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [RDS for PostgreSQL: responsibility boundaries for a managed database](aws-rds-postgresql.md)
- [RDS Multi-AZ: distinguishing instances and clusters](aws-rds-multi-az.md)
- [AWS KMS: encryption keys and decryption permissions](../security/aws-kms.md)
- [RPO: Recovery Point Objective](../../../glossary/en/rpo.md)
- [RTO: Recovery Time Objective](../../../glossary/en/rto.md)

[한국어 원문](../../ko/data/aws-rds-backup.md)

## Sources

[^backups]: [Working with automated backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html)
[^pitr]: [Restoring a DB instance to a specified time](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html)
