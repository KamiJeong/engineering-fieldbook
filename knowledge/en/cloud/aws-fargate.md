---
type: Concept
title: 'AWS Fargate: managed capacity for ECS'
description: Separate server management handled by Fargate from the resources, networking, and permissions you configure.
concept_id: aws-fargate
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
- id: fargate
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html
  title: AWS Fargate for Amazon ECS
- id: fargate-tasks
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html
  title: Amazon ECS task definitions for Fargate
- id: fargate-network
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html
  title: Amazon ECS task networking options for Fargate
translation:
  source_language: ko
  source_concept_id: aws-fargate
  source_fingerprint: sha256:10ad6e5f568798a62c7358724706bc1a4ce9985aa0c4c1770838b5c368d727f8
  target_fingerprint: sha256:ef0c24e4d66732b848518bf53254b1474f98efae3d20baa866908668319038f2
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# AWS Fargate: managed capacity for ECS

## Summary

Using AWS Fargate with ECS reduces the work of managing the server fleet that runs containers. You specify task CPU, memory, networking, and permissions. Less server management still leaves application connectivity and data management to address.[^fargate]

## Learning objectives

Separate server management handled by Fargate from the resources, networking, and permissions you configure.

## Prerequisites

Review [ECS tasks and services](aws-ecs.md), [subnets](aws-subnets.md), and [IAM roles](../security/aws-iam-role.md). An ENI is the virtual network interface used to connect a task to the network.[^fargate-network]

## 101 · Understand the concept

### External facts

This entry covers Fargate with ECS: specify task CPU, memory, and execution settings without provisioning a server fleet.[^fargate]

Fargate tasks use awsvpc networking. Configure the task ENI addressing, subnet, and security groups together.[^fargate-tasks][^fargate-network]

Image pulls, logging, and secret access also need connectivity. Review NAT or the required service endpoints for private subnets.[^fargate-network]

## 201 · Apply the example

### Design example

Suppose a task in a private subnet fails to start. Check the path to its image registry, then the execution role permission to retrieve the image. Check connectivity and permissions for logs and secrets separately.

Connect each observation to the failing stage. Treating a failed image pull as an application-code error sends diagnosis in the wrong direction.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Consider it for reducing host operations, but verify required runtime features and resource combinations.

- Do not keep the only persistent copy of business data inside a container.

- Include NAT, logs, and load balancing alongside task sizing and count in cost reviews.

### Operational checks

- [ ] Are paths and permissions valid for images, logs, and Secrets Manager separately?
- [ ] How are in-flight requests handled during task replacement?
- [ ] Has application concurrency been measured against resource limits?

## Check your understanding

**Question:** Why can a task fail to reach another service even when you do not manage its server?

**Explanation:** Task addressing, subnets, network paths, and execution or application permissions still require separate configuration.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [Amazon ECS: orchestrating tasks and services](aws-ecs.md)
- [Public and private subnets: a routing distinction](aws-subnets.md)
- [NAT gateways: egress and availability modes](aws-nat-gateway.md)
- [Secrets Manager: retrieval, rotation, and consumer refresh](../security/aws-secrets-manager.md)

[한국어 원문](../../ko/cloud/aws-fargate.md)

## Sources

[^fargate]: [AWS Fargate for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
[^fargate-tasks]: [Amazon ECS task definitions for Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html)
[^fargate-network]: [Amazon ECS task networking options for Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html)
