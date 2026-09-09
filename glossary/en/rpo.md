---
type: Glossary Term
title: 'RPO: Recovery Point Objective'
description: An objective expressing tolerable data loss in time.
concept_id: rpo
language: en
tags:
- recovery
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2027-09-09T00:46:30+00:00'
freshness:
  mode: current
  volatility: low
  review_days: 365
  reason: Focuses on terminology, excluding detailed specifications of linked service implementations.
sources:
- id: dr
  resource: https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html
  title: 'Business Continuity Plan: Recovery objectives (RTO and RPO)'
translation:
  source_language: ko
  source_concept_id: rpo
  source_fingerprint: sha256:93ff3e7d59ea3636ad5c3dcd8a154a222405f74e094c1b84eccd588c107c235e
  target_fingerprint: sha256:903e1ba7d8afe2cc29dc57432e85c3c0b242541be5db2246f5caebe4eb82929d
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# RPO: Recovery Point Objective

## Summary

RPO (Recovery Point Objective) expresses acceptable data loss in time. It concerns the gap between service interruption and the most recent point from which data can be recovered.[^dr]

## External facts

RPO is the maximum acceptable gap defined by the organization’s business requirements. It differs from backup retention duration.[^dr]

## Design example

Suppose an outage occurs at 14:00 with a 15-minute RPO. A recovery point at 13:45 or later is needed. If recovery is possible only up to 13:30, the 30-minute gap misses the objective. This explains a target; it is not a measurement.

## Usage and distinctions

Long retention does not establish that the latest recovery point is recent enough. Check the actual restorable time and whether restoration succeeds.

## Operational checks

- [ ] Does a recovery point meeting the objective actually exist and restore successfully?

## Evidence and limits

RPO is an objective, not an automatic service guarantee. Check actual loss and recoverability in the operating environment.

## Related knowledge

- [RTO: Recovery Time Objective](rto.md)
- [RDS backups: recoverable points and restoration procedures](../../knowledge/en/data/aws-rds-backup.md)
- [RDS Multi-AZ: distinguishing instances and clusters](../../knowledge/en/data/aws-rds-multi-az.md)

[한국어 원문](../ko/rpo.md)

## Sources

[^dr]: [Business Continuity Plan: Recovery objectives (RTO and RPO)](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html)
