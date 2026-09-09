---
type: Concept
title: 'AWS KMS: encryption keys and decryption permissions'
description: Separate key administration from data-decryption permissions and explain recovery implications of rotation
  and deletion.
concept_id: aws-kms
language: en
tags:
- aws
- security
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2026-12-08T00:46:30+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 90
  reason: Review after 90 days because execution options, access controls, or service behavior can materially affect
    design.
sources:
- id: kms
  resource: https://docs.aws.amazon.com/kms/latest/developerguide/overview.html
  title: What is AWS Key Management Service?
- id: kms-policy
  resource: https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html
  title: Key policies in AWS KMS
- id: kms-rotation
  resource: https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html
  title: Rotating AWS KMS keys
- id: kms-delete
  resource: https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html
  title: Deleting AWS KMS keys
translation:
  source_language: ko
  source_concept_id: aws-kms
  source_fingerprint: sha256:87a193b2e5505709349dded825abf8f8ae530eef4ee3b6cca5006b0a879eee1d
  target_fingerprint: sha256:0276eadbd3c06974a66f3fc5e4a77822842061b8e857d9fa2c6c4958c663d432
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# AWS KMS: encryption keys and decryption permissions

## Summary

Reading encrypted data requires the necessary key and permission to use it. AWS KMS creates and manages keys used for encryption and signing. Data-retention plans also need to retain usable keys and access permissions.[^kms][^kms-policy]

## Learning objectives

Separate key administration from data-decryption permissions and explain recovery implications of rotation and deletion.

## Prerequisites

Encryption transforms data into a protected form; decryption makes it readable again. See [IAM policies](aws-iam-policy.md) for access evaluation and [Secrets Manager](aws-secrets-manager.md) for password storage.

## 101 · Understand the concept

### External facts

KMS creates, manages, and uses keys for encryption and signing. Its purpose differs from storing application passwords in Secrets Manager.[^kms]

The key policy is central to key access. An IAM Allow alone may not enable use; check whether the key policy enables IAM delegation.[^kms-policy]

Key-material rotation is not bulk re-encryption of existing data. Deleting a key can remove required decryption capability.[^kms-rotation][^kms-delete]

## 201 · Apply the example

### Design example

Suppose an encrypted backup snapshot is restored in another environment. After checking the data copy, check that the recovery environment can use the necessary key and that the actual caller is permitted to do so.

A backup file alone does not complete recovery. Include the possibility of missing keys or permissions preventing decryption.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Separate key-administration ownership from data-decryption permissions.

- For backup copies and Region/account recovery, verify surviving keys and permissions as well as data.

- Identify dependent data before key deletion; do not remove recovery capability solely to reduce cost.

### Operational checks

- [ ] Do the service caller and key-using principal have the required permissions?
- [ ] Can encrypted backups be decrypted in the recovery environment?
- [ ] Are rotation, disabling, and deletion impacts understood separately?

## Check your understanding

**Question:** Does rotating a key re-encrypt all previously stored data?

**Explanation:** Key-material rotation is not bulk re-encryption of existing data. Review rotation, disabling, and deletion as separate operations.[^kms-rotation]

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [IAM policies: explicit permissions and effective-access evaluation](aws-iam-policy.md)
- [Secrets Manager: retrieval, rotation, and consumer refresh](aws-secrets-manager.md)
- [RDS backups: recoverable points and restoration procedures](../data/aws-rds-backup.md)
- [Amazon S3: object storage and access design](../cloud/aws-s3.md)

[한국어 원문](../../ko/security/aws-kms.md)

## Sources

[^kms]: [What is AWS Key Management Service?](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html)
[^kms-policy]: [Key policies in AWS KMS](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html)
[^kms-rotation]: [Rotating AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html)
[^kms-delete]: [Deleting AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html)
