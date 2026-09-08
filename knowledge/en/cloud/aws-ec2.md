---
type: Concept
title: 'Amazon EC2: virtual servers and operational responsibility'
description: A compute option for direct control over the OS and instance configuration.
concept_id: aws-ec2
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
- id: ec2
  resource: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html
  title: What is Amazon EC2?
- id: shared
  resource: https://aws.amazon.com/compliance/shared-responsibility-model/
  title: AWS Shared Responsibility Model
translation:
  source_language: ko
  source_concept_id: aws-ec2
  source_fingerprint: sha256:2d5ef4c1334c131506b3b522076167aecf94df2f21242c74d203ba7b9f7734c1
  target_fingerprint: sha256:6a69520afeea49280929b5f28b74f14a7cbf858f0b5531fae20685abdebdc35f
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# Amazon EC2: virtual servers and operational responsibility

## Summary

A compute option for direct control over the OS and instance configuration.

## External facts

- An EC2 instance is a virtual server. An AMI supplies its starting image; the instance type determines compute, memory, and networking resources.[^ec2]

- EBS provides persistent volumes; instance store provides temporary storage. Data retention depends on storage type and deletion settings.[^ec2]

- For self-managed EC2, the customer owns guest OS patching, installed applications, and access configuration.[^shared]

## Selection criteria and recommendations

- Document why host-level control is required; if containers suffice, compare the operating burden with ECS/Fargate.

- Manage images, configuration, and replacement procedures together to avoid relying on manual changes to one server.

- Include volumes, snapshots, public addressing, transfer, and operating effort in cost comparisons.

## Design example

Even with two API servers, test capacity while one is replaced. Server count alone does not demonstrate recovery.

## Operational checks

- [ ] Can the service and data be restored after replacing an instance?
- [ ] Are patch ownership, maintenance windows, and application health checks defined?
- [ ] Are memory, disk, and network bottlenecks monitored alongside CPU?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [Amazon ECS: orchestrating tasks and services](aws-ecs.md)
- [AWS Fargate: managed capacity for ECS](aws-fargate.md)
- [Security groups: resource traffic permissions](aws-security-group.md)
- [IAM roles: trust policies and temporary session permissions](../security/aws-iam-role.md)

[한국어 원문](../../ko/cloud/aws-ec2.md)

## Sources

[^ec2]: [What is Amazon EC2?](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)
[^shared]: [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
