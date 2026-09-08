---
type: Concept
title: 'Secrets Manager: retrieval, rotation, and consumer refresh'
description: Manage safe consumer updates as well as secret storage.
concept_id: aws-secrets-manager
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
  source_fingerprint: sha256:aaa6644379a4309944b2266533c4557016984ab4caede2fe9d4c5af54092e3e4
  target_fingerprint: sha256:8d32f6817d585244065bae25694b5249cf302976d2a8a3da8da076ee1a0a1077
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# Secrets Manager: retrieval, rotation, and consumer refresh

## Summary

Manage safe consumer updates as well as secret storage.

## External facts

- Secrets Manager supports storing, retrieving, and rotating database credentials, API keys, and other secrets. Prefer roles where suitable for AWS workload credentials.[^secrets]

- Rotation updates both the stored secret and credentials in the target database or service. Supported methods, including managed and Lambda-based rotation, depend on the target.[^secret-rotation]

- Rotating a secret injected into ECS environment variables does not automatically refresh running containers. Consumers need an update such as launching new tasks.[^ecs-secret]

## Selection criteria and recommendations

- Specify runtime retrieval, caching, or startup injection and design for refresh failures.

- Check that logs, error messages, and diagnostic dumps do not expose secret values.

- Include target-service authentication and real application requests in rotation-success checks.

## Design example

After DB-password rotation, an existing task can fail to reconnect using its old environment variable. Review secret rollout, pool refresh, and a real query as one procedure.

## Operational checks

- [ ] Who can read each secret?
- [ ] When do caches and running processes consume updated values?
- [ ] Which values and states guide recovery after a rotation failure?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

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
