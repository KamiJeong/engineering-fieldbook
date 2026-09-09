---
type: Glossary Term
title: 'RTO: Recovery Time Objective'
description: An objective for the permitted time from service interruption to restoration.
concept_id: rto
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
  source_concept_id: rto
  source_fingerprint: sha256:be4c5f38eecc81966ffc7b25dcaae3c5499a9286381e5e332b4a787478f5d6ec
  target_fingerprint: sha256:148bf3fbb9d2a1b11b1d9217b27439ef0e28ed644d5561a4b3017b8dd01c5321
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# RTO: Recovery Time Objective

## Summary

RTO (Recovery Time Objective) is the maximum acceptable time from service interruption to recovery. The organization also defines what counts as restored service according to its business needs.[^dr]

## External facts

RTO states how long service unavailability is acceptable. It differs from RPO, which describes the time window of acceptable data loss.[^dr]

## Design example

Suppose service stops at 14:00 with a 60-minute RTO. The agreed restoration criteria must be met by 15:00. If DB startup is followed by connection cutover and user-function checks, include that time too. This explains a target, not a recovery-test result.

## Usage and distinctions

DB startup alone does not establish user-service recovery. Measure the full detection, decision, restoration, and cutover timeline, and check data and user functions.

## Operational checks

- [ ] Is the total time from interruption to agreed recovery completion within the objective?

## Evidence and limits

This definition provides a basis for measuring recovery time. Establish actual time for a specific configuration through separate tests and observations.

## Related knowledge

- [RPO: Recovery Point Objective](rpo.md)
- [RDS backups: recoverable points and restoration procedures](../../knowledge/en/data/aws-rds-backup.md)

[한국어 원문](../ko/rto.md)

## Sources

[^dr]: [Business Continuity Plan: Recovery objectives (RTO and RPO)](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html)
