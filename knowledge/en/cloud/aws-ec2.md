---
type: Concept
title: 'Amazon EC2: virtual servers and operational responsibility'
description: Distinguish instances, AMIs, and instance types, and explain what to check when replacing a server.
concept_id: aws-ec2
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
- id: ec2
  resource: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html
  title: What is Amazon EC2?
- id: shared
  resource: https://aws.amazon.com/compliance/shared-responsibility-model/
  title: AWS Shared Responsibility Model
translation:
  source_language: ko
  source_concept_id: aws-ec2
  source_fingerprint: sha256:fa1f965b526d8dfa2ec3cd3efcde395ae8243220b720fdedb6e8dc8a36f4eab2
  target_fingerprint: sha256:3014e89fe1645f970aae409d08570eaee78993e7eeb6f0e76db3753ebe56d248
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Amazon EC2: virtual servers and operational responsibility

## Summary

A web application needs a server on which to run. Amazon EC2 runs virtual servers in AWS; each server is called an instance. Choosing its operating system and resources also means understanding what you must manage.[^ec2][^shared]

## Learning objectives

Distinguish instances, AMIs, and instance types, and explain what to check when replacing a server.

## Prerequisites

Understand how an operating system (OS) runs programs on a computer. Read [VPC](aws-vpc.md) and [security groups](aws-security-group.md) alongside this entry if network access configuration is unfamiliar.

## 101 · Understand the concept

### External facts

An EC2 instance is a virtual server. An AMI (Amazon Machine Image) supplies a starting image containing the operating system and required software. The instance type determines CPU, memory, networking, and other resources.[^ec2]

EBS provides persistent volumes; instance store provides temporary storage. Data retention depends on storage type and deletion settings.[^ec2]

For self-managed EC2, the customer owns guest OS patching, installed applications, and access configuration.[^shared]

## 201 · Apply the example

### Design example

Suppose one of two API servers is being replaced. First establish the request volume the remaining server must handle. Then measure response times and errors at that volume, and check the procedure for restoring configuration and data on the new server.

The criterion is whether the service can sustain the required load and recover during replacement. Server count alone does not answer that question. Record actual measurements separately.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Document why host-level control is required; if containers suffice, compare the operating burden with ECS/Fargate.

- Manage images, configuration, and replacement procedures together to avoid relying on manual changes to one server.

- Include volumes, snapshots, public addressing, transfer, and operating effort in cost comparisons.

### Operational checks

- [ ] Can the service and data be restored after replacing an instance?
- [ ] Are patch ownership, maintenance windows, and application health checks defined?
- [ ] Are memory, disk, and network bottlenecks monitored alongside CPU?

## Check your understanding

**Question:** Does having two running servers establish that the service will work normally during replacement?

**Explanation:** Check remaining capacity, application health, data restoration, and connection cutover. A count of two does not establish those conditions.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [Amazon ECS: orchestrating tasks and services](aws-ecs.md)
- [AWS Fargate: managed capacity for ECS](aws-fargate.md)
- [Security groups: resource traffic permissions](aws-security-group.md)
- [IAM roles: trust policies and temporary session permissions](../security/aws-iam-role.md)

[한국어 원문](../../ko/cloud/aws-ec2.md)

## Sources

[^ec2]: [What is Amazon EC2?](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)
[^shared]: [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
