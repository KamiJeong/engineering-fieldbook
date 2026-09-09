---
type: Concept
title: 'Secrets Manager: retrieval, rotation, and consumer refresh'
description: Distinguish storage, rotation, and consumer refresh, and check new-value adoption by running applications.
concept_id: aws-secrets-manager
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
- id: secrets
  resource: https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html
  title: What is AWS Secrets Manager?
- id: secret-rotation
  resource: https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html
  title: Rotate AWS Secrets Manager secrets
- id: ecs-secret
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html
  title: Pass Secrets Manager secrets through Amazon ECS environment variables
translation:
  source_language: ko
  source_concept_id: aws-secrets-manager
  source_fingerprint: sha256:98aaa1ab7ed6835f76228817ab5793bf9bc5ef00bec65d1a07977910eaff9109
  target_fingerprint: sha256:45016028fbec550e33598995c910820db14c42d6a6545bc3510affe40a7468fc
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Secrets Manager: retrieval, rotation, and consumer refresh

## Summary

Hard-coding DB passwords or API keys makes changes and access management harder. Secrets Manager helps store, retrieve, and rotate these values. After changing a secret, verify that the real application consumes the new value.[^secrets][^secret-rotation]

## Learning objectives

Distinguish storage, rotation, and consumer refresh, and check new-value adoption by running applications.

## Prerequisites

Read [IAM roles](aws-iam-role.md) and [ECS](../cloud/aws-ecs.md). Rotation updates credentials in both the stored secret and the target service.[^secret-rotation]

## 101 · Understand the concept

### External facts

Secrets Manager supports storing, retrieving, and rotating database credentials, API keys, and other secrets. Prefer roles where suitable for AWS workload credentials.[^secrets]

Rotation updates both the stored secret and credentials in the target database or service. Supported methods, including managed and Lambda-based rotation, depend on the target.[^secret-rotation]

Rotating a secret injected into ECS environment variables does not automatically refresh running containers. Consumers need an update such as launching new tasks.[^ecs-secret]

## 201 · Apply the example

### Design example

Suppose an ECS task receives its DB password through an environment variable. Rotation does not automatically change that variable in an existing task. Reconnecting with the old value can fail authentication.

Check value rollout, such as launching a new task, refreshing existing connection pools, and executing a real query. Avoid printing secret values in logs to inspect them.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Specify runtime retrieval, caching, or startup injection and design for refresh failures.

- Check that logs, error messages, and diagnostic dumps do not expose secret values.

- Include target-service authentication and real application requests in rotation-success checks.

### Operational checks

- [ ] Who can read each secret?
- [ ] When do caches and running processes consume updated values?
- [ ] Which values and states guide recovery after a rotation failure?

## Check your understanding

**Question:** Is rotation verification complete once Secrets Manager stores the new value?

**Explanation:** Check target-service authentication and consumer adoption too. Successful storage does not establish that the running application works.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [IAM roles: trust policies and temporary session permissions](aws-iam-role.md)
- [AWS KMS: encryption keys and decryption permissions](aws-kms.md)
- [Amazon ECS: orchestrating tasks and services](../cloud/aws-ecs.md)
- [RDS for PostgreSQL: responsibility boundaries for a managed database](../data/aws-rds-postgresql.md)

[한국어 원문](../../ko/security/aws-secrets-manager.md)

## Sources

[^secrets]: [What is AWS Secrets Manager?](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)
[^secret-rotation]: [Rotate AWS Secrets Manager secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html)
[^ecs-secret]: [Pass Secrets Manager secrets through Amazon ECS environment variables](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html)
