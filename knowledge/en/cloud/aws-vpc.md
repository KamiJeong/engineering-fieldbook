---
type: Concept
title: 'Amazon VPC: address space and connectivity boundaries'
description: Explain the relationship between VPCs, subnets, and Availability Zones, and separate address planning
  from access control.
concept_id: aws-vpc
language: en
tags:
- aws
- network
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2027-03-08T00:46:30+00:00'
freshness:
  mode: current
  volatility: low
  review_days: 180
  reason: Networking principles are relatively stable, but AWS connectivity options need periodic review.
sources:
- id: vpc
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/configure-your-vpc.html
  title: Your VPC
- id: vpc-basics
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-subnet-basics.html
  title: VPC basics
- id: subnets
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html
  title: Subnets for your VPC
- id: vpc-cidr
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html
  title: VPC CIDR blocks
translation:
  source_language: ko
  source_concept_id: aws-vpc
  source_fingerprint: sha256:d4347a7bee4caa460c449b1a7ce836e64f16c0989ec690051f95dab9070f6ae8
  target_fingerprint: sha256:41c0a32f7104a54fbfa1001150c5e68d96c50e8c8b6c7369cdea543e476f1c07
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Amazon VPC: address space and connectivity boundaries

## Summary

Servers and databases need address ranges and paths to communicate. Amazon VPC provides a logically separate network within AWS. You divide it into subnets and configure routes for their purposes.[^vpc]

## Learning objectives

Explain the relationship between VPCs, subnets, and Availability Zones, and separate address planning from access control.

## Prerequisites

An IP address identifies a communication destination on a network. Start with [CIDR](../../../glossary/en/cidr.md) for address ranges and [Availability Zones](../../../glossary/en/availability-zone.md) for placement.

## 101 · Understand the concept

### External facts

A VPC is a logical network with configurable address ranges, subnets, routing, and connectivity.[^vpc]

A VPC spans Availability Zones within one Region; a conventional subnet resides in one AZ.[^vpc-basics][^subnets]

Plan VPC and subnet addressing with CIDR. Review address overlap with networks that must be connected.[^vpc-cidr]

## 201 · Apply the example

### Design example

Suppose a VPC has the range 10.40.0.0/16. First divide the required address blocks by Availability Zone and assign purposes to application and DB subnets. Then check for overlap with connected networks and room for growth.

The range is illustrative. Dividing address space does not finish traffic authorization; review routes and security groups separately.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Budget IP space for task ENIs, databases, and growth, not just current servers.

- Treat routes, security groups, and IAM as separate boundaries rather than assuming all resources in a VPC are safe.

- Choose environment, account, and Region separation based on required isolation and connectivity costs.

### Operational checks

- [ ] Have overlap and address-space growth been reviewed?
- [ ] Are DNS resolution and endpoint access paths documented?
- [ ] Can each subnet be mapped to its AZ, route table, and purpose?

## Check your understanding

**Question:** Does creating a VPC automatically make every resource inside it safe?

**Explanation:** Address-space separation and access control are different. Review routing, security groups, and IAM permissions separately.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [Public and private subnets: a routing distinction](aws-subnets.md)
- [Route tables: destinations and next hops](aws-route-table.md)
- [Security groups: resource traffic permissions](aws-security-group.md)
- [CIDR: IP address ranges and prefixes](../../../glossary/en/cidr.md)
- [Availability Zone (AZ)](../../../glossary/en/availability-zone.md)

[한국어 원문](../../ko/cloud/aws-vpc.md)

## Sources

[^vpc]: [Your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/configure-your-vpc.html)
[^vpc-basics]: [VPC basics](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-subnet-basics.html)
[^subnets]: [Subnets for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)
[^vpc-cidr]: [VPC CIDR blocks](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html)
