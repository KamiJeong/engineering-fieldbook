---
type: Concept
title: 'Amazon S3: object storage and access design'
description: Distinguish buckets, objects, and keys, and separate object storage from updates spanning multiple
  objects.
concept_id: aws-s3
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
- id: s3
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html
  title: What is Amazon S3?
translation:
  source_language: ko
  source_concept_id: aws-s3
  source_fingerprint: sha256:ee2c981fda0ab5b9cc79826e085d5fc37f68ae01792f6cd4888f2643c452db9e
  target_fingerprint: sha256:189ff810d41b42080b772496f58e0b4bbb8bf88171913db1b218b3d166a5b3c6
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Amazon S3: object storage and access design

## Summary

Amazon S3 object storage can hold uploads and release files. An object contains data and its metadata; a bucket contains objects. A key is the name used to find an object within its bucket.[^s3]

## Learning objectives

Distinguish buckets, objects, and keys, and separate object storage from updates spanning multiple objects.

## Prerequisites

Start with storing and reading files. Continue with [IAM policies](../security/aws-iam-policy.md) for access and [Versioning](aws-s3-versioning.md) for overwrite recovery.

## 101 · Understand the concept

### External facts

This entry covers object storage in general-purpose buckets. Directory, table, and vector buckets also exist; do not assume identical feature sets.[^s3]

Objects are addressed by bucket and key. Read/list consistency after object PUT/DELETE is distinct from an application transaction spanning multiple objects.[^s3]

IAM and bucket policies control access; Block Public Access restricts public access configurations.[^s3]

## 201 · Apply the example

### Design example

Suppose you store release files. Compare repeatedly overwriting one key with using distinct keys containing release identifiers. The latter also needs information identifying the release to deploy.

Separately design completion of file storage and the current-release update. Object consistency does not imply an application transaction spanning multiple objects.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Define ownership and retention purposes for uploads, release artifacts, and backup copies.

- Treat key naming and concurrent-update handling as application contracts.

- Keep storage private by default and design only the required public delivery paths.

### Operational checks

- [ ] Do bucket type, Region, encryption, and permissions match the design?
- [ ] Are interrupted uploads, overwrites, deletions, and recovery tested?
- [ ] Are requests, transfer, and retained-version costs tracked alongside stored volume?

## Check your understanding

**Question:** Does a successful write to one object establish that all related objects were updated together?

**Explanation:** Individual object writes and an application operation spanning objects are different. Define completion and failure handling for the whole operation.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [S3 Lifecycle: transition and expiration policies](aws-s3-lifecycle.md)
- [S3 Versioning: recovering from overwrites and deletes](aws-s3-versioning.md)
- [IAM policies: explicit permissions and effective-access evaluation](../security/aws-iam-policy.md)
- [AWS KMS: encryption keys and decryption permissions](../security/aws-kms.md)

[한국어 원문](../../ko/cloud/aws-s3.md)

## Sources

[^s3]: [What is Amazon S3?](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
