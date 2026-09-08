---
type: Concept
title: 'S3 Versioning: recovering from overwrites and deletes'
description: Understand retained versions, recovery, and permanent deletion.
concept_id: aws-s3-versioning
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
- id: versioning
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html
  title: Using versioning in S3 buckets
- id: version-delete
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html
  title: Deleting object versions from a versioning-enabled bucket
translation:
  source_language: ko
  source_concept_id: aws-s3-versioning
  source_fingerprint: sha256:d992c6950e775cf1d8a7712ab5def36e5ef3de8d403f505ac8869bd54a0eef3b
  target_fingerprint: sha256:1853d88c5fede8736ed0a45e3d4a94abd5ae5394ae5a86e6ab2438fd858ff58d
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# S3 Versioning: recovering from overwrites and deletes

## Summary

Understand retained versions, recovery, and permanent deletion.

## External facts

- With Versioning enabled, a write to the same key creates a new version. An ordinary delete adds a delete marker, while deletion targeting a version ID can permanently remove that version.[^versioning][^version-delete]

- An enabled bucket can be suspended but cannot return to the unversioned state. Suspension does not mean deleting historical versions.[^versioning]

- Storage charges apply to complete object versions, not merely a user-visible diff between versions.[^versioning]

## Selection criteria and recommendations

- Validate version listing, reading a specific version, and restoring previous content for important objects.

- Constrain permanent-deletion permissions and noncurrent expiration according to retention objectives.

- Do not equate Versioning alone with separate-account/Region recovery copies or immutable retention.

## Design example

A current-key lookup can fail while previous versions still exist. Inspect versions before recovery; do not bulk-delete history while troubleshooting.

## Operational checks

- [ ] Can delete markers and previous versions be distinguished after an accidental delete?
- [ ] Are retained-version counts, sizes, and expiration policies managed?
- [ ] Who can permanently delete a specific version?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [Amazon S3: object storage and access design](aws-s3.md)
- [S3 Lifecycle: transition and expiration policies](aws-s3-lifecycle.md)
- [IAM policies: explicit permissions and effective-access evaluation](../security/aws-iam-policy.md)
- [AWS KMS: encryption keys and decryption permissions](../security/aws-kms.md)

[한국어 원문](../../ko/cloud/aws-s3-versioning.md)

## Sources

[^versioning]: [Using versioning in S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
[^version-delete]: [Deleting object versions from a versioning-enabled bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html)
