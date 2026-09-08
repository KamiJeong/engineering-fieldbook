---
type: Concept
title: 'Amazon ECS: orchestrating tasks and services'
description: A service for defining, deploying, and maintaining container workloads.
concept_id: aws-ecs
language: en
tags:
- aws
- compute
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
- id: ecs
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html
  title: What is Amazon ECS?
- id: ecs-roles
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html
  title: IAM roles for Amazon ECS
translation:
  source_language: ko
  source_concept_id: aws-ecs
  source_fingerprint: sha256:5bc8124ccfc1731e7287d1b774febbe34f72966f314d6d24db5bbc4f6c04d1cb
  target_fingerprint: sha256:fe05271a5439cee700b55687e32148eb9ca283586f00e6be2507fdef0bca4de3
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# Amazon ECS: orchestrating tasks and services

## Summary

A service for defining, deploying, and maintaining container workloads.

## External facts

- ECS orchestrates containers. EC2 and Fargate are capacity choices; current options also include Managed Instances and external servers.[^ecs]

- A task definition describes execution; a task is an execution unit. A service manages long-running tasks and deployment.[^ecs]

- Separate the task role for application AWS API calls from the task execution role for setup such as image pulls and configured logging or secret injection.[^ecs-roles]

## Selection criteria and recommendations

- Consider a service for a persistent API and a standalone task for work that finishes and exits.

- Judge deployment success by readiness, traffic, and errors, not task startup alone.

- Review task scaling separately from underlying capacity scaling.

## Design example

A desired count of two tasks still requires capacity testing during failures and deployments; it is not an availability guarantee.

## Operational checks

- [ ] Are task-definition revisions and image identities traceable?
- [ ] Can stop reasons, permissions, and health checks explain failed deployments?
- [ ] Are application and execution permissions separated?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [Amazon EC2: virtual servers and operational responsibility](aws-ec2.md)
- [AWS Fargate: managed capacity for ECS](aws-fargate.md)
- [IAM roles: trust policies and temporary session permissions](../security/aws-iam-role.md)
- [Secrets Manager: retrieval, rotation, and consumer refresh](../security/aws-secrets-manager.md)

[한국어 원문](../../ko/cloud/aws-ecs.md)

## Sources

[^ecs]: [What is Amazon ECS?](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)
[^ecs-roles]: [IAM roles for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html)
