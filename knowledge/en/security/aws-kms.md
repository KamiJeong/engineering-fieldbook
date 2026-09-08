---
type: Concept
title: 'AWS KMS: encryption keys and decryption permissions'
description: Design encryption together with key access, retention, and deletion responsibilities.
concept_id: aws-kms
language: en
tags:
- aws
- security
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2026-12-07T05:01:30Z'
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
  source_fingerprint: sha256:121db190c66a73c9fe9e8b190027fd1cb84d3ccf6ecf32528c5d62c685a81ce3
  target_fingerprint: sha256:ce476ae9d8310161708a0d7977a297f6260869d463022a16f7a56e465da8fff3
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# AWS KMS: encryption keys and decryption permissions

## Summary

Design encryption together with key access, retention, and deletion responsibilities.

## External facts

- KMS creates, manages, and uses keys for encryption and signing. Its purpose differs from storing application passwords in Secrets Manager.[^kms]

- The key policy is central to key access. An IAM Allow alone may not enable use; check whether the key policy enables IAM delegation.[^kms-policy]

- Key-material rotation is not bulk re-encryption of existing data. Deleting a key can remove required decryption capability.[^kms-rotation][^kms-delete]

## Selection criteria and recommendations

- Separate key-administration ownership from data-decryption permissions.

- For backup copies and Region/account recovery, verify surviving keys and permissions as well as data.

- Identify dependent data before key deletion; do not remove recovery capability solely to reduce cost.

## Design example

Retaining a backup snapshot is insufficient if its data cannot be decrypted with available keys and permissions. Include key access in recovery validation.

## Operational checks

- [ ] Do the service caller and key-using principal have the required permissions?
- [ ] Can encrypted backups be decrypted in the recovery environment?
- [ ] Are rotation, disabling, and deletion impacts understood separately?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

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
