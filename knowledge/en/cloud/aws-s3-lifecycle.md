---
type: Concept
title: 'S3 Lifecycle: transition and expiration policies'
description: Manage retention and cost for objects and historical versions through rules.
concept_id: aws-s3-lifecycle
language: en
tags:
- aws
- storage
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
- id: lifecycle
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html
  title: Managing the lifecycle of objects
- id: expiration
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html
  title: Expiring objects
translation:
  source_language: ko
  source_concept_id: aws-s3-lifecycle
  source_fingerprint: sha256:9a2c0d9adc47809e641c568bc4929dec55d34f6fb4de24d9603ef8c4ad60bcd2
  target_fingerprint: sha256:357c9d812c0107b02642fbad2b32f334a291962b152ff4396b8679f7651e4711
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# S3 Lifecycle: transition and expiration policies

## Summary

Manage retention and cost for objects and historical versions through rules.

## External facts

- Lifecycle rules define storage-class transitions and expiration and also apply to existing objects.[^lifecycle]

- Expiration of a current object in a versioning-enabled bucket generally creates a delete marker; deletion of older versions uses separate noncurrent-expiration rules.[^expiration]

- Transitions and minimum-storage-duration rules can affect costs. For general-purpose buckets, do not assume a bucket-policy deny prevents Lifecycle actions.[^lifecycle]

## Selection criteria and recommendations

- Choose transition timing after establishing access frequency, acceptable retrieval delay, and retention requirements.

- Inspect affected existing objects and historical versions before applying broad prefix rules.

- Review Versioning together with Lifecycle so cost reduction does not undermine deletion recovery.

## Design example

Design example: transition logs after one period and expire them later. Choose periods from investigation needs and retrieval frequency rather than copying arbitrary durations.

## Operational checks

- [ ] Are current versions, noncurrent versions, and delete markers handled distinctly?
- [ ] Have retrieval delay and minimum-storage conditions been checked for target classes?
- [ ] Were affected objects and recoverability checked before changing rules?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [Amazon S3: object storage and access design](aws-s3.md)
- [S3 Versioning: recovering from overwrites and deletes](aws-s3-versioning.md)
- [RPO: Recovery Point Objective](../../../glossary/en/rpo.md)

[한국어 원문](../../ko/cloud/aws-s3-lifecycle.md)

## Sources

[^lifecycle]: [Managing the lifecycle of objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
[^expiration]: [Expiring objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html)
