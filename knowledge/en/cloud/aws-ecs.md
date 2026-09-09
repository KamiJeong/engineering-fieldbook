---
type: Concept
title: 'Amazon ECS: orchestrating tasks and services'
description: Distinguish task definitions, tasks, and services, and evaluate task count separately from deployment
  success.
concept_id: aws-ecs
language: en
tags:
- aws
- compute
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
- id: ecs
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html
  title: What is Amazon ECS?
- id: ecs-roles
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html
  title: IAM roles for Amazon ECS
translation:
  source_language: ko
  source_concept_id: aws-ecs
  source_fingerprint: sha256:917fa63206b2edd692278b25ca121fa9110aad2297d75803226b0df8e2068346
  target_fingerprint: sha256:ba4248112d0e2b762f7378e5254ed116ef6b496f256f13c1227737b206b9b269
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Amazon ECS: orchestrating tasks and services

## Summary

A containerized application still needs decisions about where to run, how many copies to maintain, and how to replace them. Amazon ECS manages execution and deployment. A task definition describes what to run; a task is an execution unit created from that definition.[^ecs]

## Learning objectives

Distinguish task definitions, tasks, and services, and evaluate task count separately from deployment success.

## Prerequisites

Start with a container image as a packaged application for deployment. Compare server responsibilities in [EC2](aws-ec2.md) and an alternative capacity choice in [Fargate](aws-fargate.md).

## 101 · Understand the concept

### External facts

ECS orchestrates containers. EC2 and Fargate are capacity choices; current options also include Managed Instances and external servers.[^ecs]

A task definition describes execution; a task is an execution unit. A service manages long-running tasks and deployment.[^ecs]

Separate the task role for application AWS API calls from the task execution role for setup such as image pulls and configured logging or secret injection.[^ecs-roles]

## 201 · Apply the example

### Design example

Suppose a service maintains two tasks for an API that continuously accepts requests. When a new task starts, first check that it is ready to receive requests. Then check actual traffic delivery and errors.

A desired count of two is a starting configuration. Sustaining the required throughput during failures or deployment needs separate load testing.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Consider a service for a persistent API and a standalone task for work that finishes and exits.

- Judge deployment success by readiness, traffic, and errors, not task startup alone.

- Review task scaling separately from underlying capacity scaling.

### Operational checks

- [ ] Are task-definition revisions and image identities traceable?
- [ ] Can stop reasons, permissions, and health checks explain failed deployments?
- [ ] Are application and execution permissions separated?

## Check your understanding

**Question:** What else should you inspect if a new task starts but user requests fail?

**Explanation:** Inspect readiness and health checks, actual traffic, errors, and stop reasons. Task startup and successful user requests are different observations.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [Amazon EC2: virtual servers and operational responsibility](aws-ec2.md)
- [AWS Fargate: managed capacity for ECS](aws-fargate.md)
- [IAM roles: trust policies and temporary session permissions](../security/aws-iam-role.md)
- [Secrets Manager: retrieval, rotation, and consumer refresh](../security/aws-secrets-manager.md)

[한국어 원문](../../ko/cloud/aws-ecs.md)

## Sources

[^ecs]: [What is Amazon ECS?](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)
[^ecs-roles]: [IAM roles for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html)
