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
  source_concept_id: rto
  source_fingerprint: sha256:32b6b4f42bf496d0fd377f1178d5712723792805ff80c19f4b06e386fb7ac683
  target_fingerprint: sha256:a3704e3397cde43e881be0b6e990de59119659bc4e900b18c692befc13d89922
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# RTO: Recovery Time Objective

## Summary

An objective for the permitted time from service interruption to restoration.

## External facts

- RTO is the organization’s maximum permitted time from service interruption to restoration.[^dr]

## Usage and distinctions

- Do not equate DB startup with completion. Include connection cutover, data checks, and user-function checks in recovery acceptance.

## Design example

Illustration: an interruption at 14:00 with a 60-minute RTO requires the agreed service-restoration criteria by 15:00. This is not a recovery-test result.

## Operational checks

- [ ] Does the complete timeline, including detection, decisions, restoration, and cutover, meet the target?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results.

## Related knowledge

- [RPO: Recovery Point Objective](rpo.md)
- [RDS backups: recoverable points and restoration procedures](../../knowledge/en/data/aws-rds-backup.md)

[한국어 원문](../ko/rto.md)

## Sources

[^dr]: [Business Continuity Plan: Recovery objectives (RTO and RPO)](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html)
