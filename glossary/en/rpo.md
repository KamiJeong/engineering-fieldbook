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
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2027-09-08T05:01:30Z'
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
  source_fingerprint: sha256:4a2ad73334d3db4e4c459964bc547273e7bc71475129296a093c1237b9ade4ab
  target_fingerprint: sha256:ee38214cf142f0036127d66bad2a94293f728e51981d926e03fbf2fd0af78484
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# RPO: Recovery Point Objective

## Summary

An objective expressing tolerable data loss in time.

## External facts

- RPO sets the acceptable gap between the last recovery point and service interruption.[^dr]

## Usage and distinctions

- Distinguish backup retention from RPO and observe the actual recoverable point.

## Design example

Illustration: an outage at 14:00 with a 15-minute RPO needs a recovery point at 13:45 or later. This is a target example, not a measurement.

## Operational checks

- [ ] Does a recovery point meeting the objective actually exist and restore successfully?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results.

## Related knowledge

- [RTO: Recovery Time Objective](rto.md)
- [RDS backups: recoverable points and restoration procedures](../../knowledge/en/data/aws-rds-backup.md)
- [RDS Multi-AZ: distinguishing instances and clusters](../../knowledge/en/data/aws-rds-multi-az.md)

[한국어 원문](../ko/rpo.md)

## Sources

[^dr]: [Business Continuity Plan: Recovery objectives (RTO and RPO)](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html)
