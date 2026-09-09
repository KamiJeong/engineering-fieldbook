---
type: Concept
title: 'S3 Versioning: recovering from overwrites and deletes'
description: Distinguish delete markers from permanent version deletion and explain how to inspect previous versions.
concept_id: aws-s3-versioning
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
- id: versioning
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html
  title: Using versioning in S3 buckets
- id: version-delete
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html
  title: Deleting object versions from a versioning-enabled bucket
translation:
  source_language: ko
  source_concept_id: aws-s3-versioning
  source_fingerprint: sha256:1e76e1cf1920c287b79341bb4c4b57877f11c4210d36de08b9dfcddf76a93156
  target_fingerprint: sha256:8ad3e2cb04b21c3fcc150c311c25c9829b08a6305ac5a715e6be4e05d3ab24c7
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# S3 Versioning: recovering from overwrites and deletes

## Summary

After an overwrite or accidental deletion, you may need an object’s previous content. S3 Versioning retains multiple versions of objects within a bucket. Check both whether a previous version remains and whether it can actually be restored.[^versioning]

## Learning objectives

Distinguish delete markers from permanent version deletion and explain how to inspect previous versions.

## Prerequisites

Read [S3 buckets and keys](aws-s3.md). A version ID identifies a specific version; a delete marker becomes the current version after an ordinary delete.[^versioning]

## 101 · Understand the concept

### External facts

With Versioning enabled, a write to the same key creates a new version. An ordinary delete adds a delete marker, while deletion targeting a version ID can permanently remove that version.[^versioning][^version-delete]

An enabled bucket can be suspended but cannot return to the unversioned state. Suspension does not mean deleting historical versions.[^versioning]

Storage charges apply to complete object versions, not merely a user-visible diff between versions.[^versioning]

## 201 · Apply the example

### Design example

Suppose a current-key lookup fails after an ordinary delete in a versioning-enabled bucket. First inspect the version list to distinguish the delete marker from previous versions. If the required content remains, read that version and check the restoration procedure.

Bulk-deleting versions during troubleshooting can remove the recovery points you intended to retain. Identify the version each operation targets first.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Validate version listing, reading a specific version, and restoring previous content for important objects.

- Constrain permanent-deletion permissions and noncurrent expiration according to retention objectives.

- Do not equate Versioning alone with separate-account/Region recovery copies or immutable retention.

### Operational checks

- [ ] Can delete markers and previous versions be distinguished after an accidental delete?
- [ ] Are retained-version counts, sizes, and expiration policies managed?
- [ ] Who can permanently delete a specific version?

## Check your understanding

**Question:** Does suspending Versioning delete already stored versions?

**Explanation:** Suspension does not delete historical versions. Check permanent-deletion permissions and Lifecycle noncurrent-version expiration separately.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [Amazon S3: object storage and access design](aws-s3.md)
- [S3 Lifecycle: transition and expiration policies](aws-s3-lifecycle.md)
- [IAM policies: explicit permissions and effective-access evaluation](../security/aws-iam-policy.md)
- [AWS KMS: encryption keys and decryption permissions](../security/aws-kms.md)

[한국어 원문](../../ko/cloud/aws-s3-versioning.md)

## Sources

[^versioning]: [Using versioning in S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
[^version-delete]: [Deleting object versions from a versioning-enabled bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html)
