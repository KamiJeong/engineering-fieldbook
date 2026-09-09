---
type: Concept
title: 'S3 Lifecycle: transition and expiration policies'
description: Distinguish transition from expiration and assess effects on existing objects and noncurrent versions.
concept_id: aws-s3-lifecycle
language: en
tags:
- aws
- storage
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
- id: lifecycle
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html
  title: Managing the lifecycle of objects
- id: expiration
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html
  title: Expiring objects
translation:
  source_language: ko
  source_concept_id: aws-s3-lifecycle
  source_fingerprint: sha256:45bbb4a3749dc78621118d36871f0666e580446b3f43ceb5ea44989eaa47490e
  target_fingerprint: sha256:0c38608f73071bf74d40c8c2267f71e887c3184462485b22f7b73ce288a01458
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# S3 Lifecycle: transition and expiration policies

## Summary

Rules can determine how long to retain accumulating objects and when to move them to another storage class. In S3 Lifecycle, transitions change storage class and expiration applies expiration handling. The outcome depends on version-retention state.[^lifecycle][^expiration]

## Learning objectives

Distinguish transition from expiration and assess effects on existing objects and noncurrent versions.

## Prerequisites

Read [S3](aws-s3.md) and [Versioning](aws-s3-versioning.md). Storage classes differ in access characteristics and cost; a noncurrent version is a version other than the current one.

## 101 · Understand the concept

### External facts

Lifecycle rules define storage-class transitions and expiration and also apply to existing objects.[^lifecycle]

Expiration of a current object in a versioning-enabled bucket generally creates a delete marker; deletion of older versions uses separate noncurrent-expiration rules.[^expiration]

Transitions and minimum-storage-duration rules can affect costs. For general-purpose buckets, do not assume a bucket-policy deny prevents Lifecycle actions.[^lifecycle]

## 201 · Apply the example

### Design example

Suppose logs move to another storage class after one period and expire later. First define the investigation retention period and acceptable retrieval delay. Then inspect the existing objects and noncurrent versions that match the rule.

Check that the rule affects only intended targets while meeting retention needs. Choose periods from actual requirements rather than copying an example duration.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Choose transition timing after establishing access frequency, acceptable retrieval delay, and retention requirements.

- Inspect affected existing objects and historical versions before applying broad prefix rules.

- Review Versioning together with Lifecycle so cost reduction does not undermine deletion recovery.

### Operational checks

- [ ] Are current versions, noncurrent versions, and delete markers handled distinctly?
- [ ] Have retrieval delay and minimum-storage conditions been checked for target classes?
- [ ] Were affected objects and recoverability checked before changing rules?

## Check your understanding

**Question:** Does adding a rule today leave previously stored objects unaffected?

**Explanation:** Lifecycle rules also apply to existing objects. Check affected scope and recoverability before applying them.[^lifecycle]

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [Amazon S3: object storage and access design](aws-s3.md)
- [S3 Versioning: recovering from overwrites and deletes](aws-s3-versioning.md)
- [RPO: Recovery Point Objective](../../../glossary/en/rpo.md)

[한국어 원문](../../ko/cloud/aws-s3-lifecycle.md)

## Sources

[^lifecycle]: [Managing the lifecycle of objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
[^expiration]: [Expiring objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html)
