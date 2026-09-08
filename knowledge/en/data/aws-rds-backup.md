---
type: Concept
title: 'RDS backups: recoverable points and restoration procedures'
description: Manage recovery through restoration, validation, and cutover rather than backup retention alone.
concept_id: aws-rds-backup
language: en
tags:
- aws
- database
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2027-01-06T05:01:30Z'
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
  source_fingerprint: sha256:c34f51c89d5a9828fb27abc0dbc6c0343334c0fb83651f0395793700754f52ec
  target_fingerprint: sha256:073d91550ee129a79c60aad4b7cec03ba11c08509ad8edfce86941196e24fb8e
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# RDS backups: recoverable points and restoration procedures

## Summary

Manage recovery through restoration, validation, and cutover rather than backup retention alone.

## External facts

- Automated backups support point-in-time recovery within retention. Manual snapshots are separately created recovery points and have different retention behavior when a DB instance is deleted.[^backups]

- DB-instance PITR creates a new instance rather than rewinding the source in place. Review settings such as parameter groups and security groups after restoration.[^pitr]

- LatestRestorableTime identifies the latest available recovery point. Retention duration alone does not establish the data-loss objective.[^pitr]

## Selection criteria and recommendations

- Agree RPO and RTO per workload and measure restoration, integrity checks, connection cutover, and service validation.

- Exercise recovery from an incorrect data change separately from Multi-AZ failover.

- For Region or account loss, design backup copies together with keys, permissions, and the recovery execution location.

## Design example

Hypothetical case: restore a separate DB to a point before a 14:00 mistake. Decide how to preserve or reconcile valid later changes. This is not an executed recovery record.

## Operational checks

- [ ] Are actual retention and the latest restorable time checked?
- [ ] Are retained automated backups, final snapshots, and manual snapshots addressed in deletion policy?
- [ ] Have restored data, settings, performance, and application cutover been validated?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

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
