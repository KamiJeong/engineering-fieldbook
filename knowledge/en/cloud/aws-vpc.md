---
type: Concept
title: 'Amazon VPC: address space and connectivity boundaries'
description: Design a logically isolated network within an AWS Region.
concept_id: aws-vpc
language: en
tags:
- aws
- network
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2027-03-07T05:01:30Z'
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
  source_fingerprint: sha256:1ec3f629fe9465e62dd3c0ed7059cea8016d08a3db4d24b143ef07de4800292f
  target_fingerprint: sha256:110c743e4b39fac5f25103b2328a3f016eca16a0e03c44162275943d780871cc
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# Amazon VPC: address space and connectivity boundaries

## Summary

Design a logically isolated network within an AWS Region.

## External facts

- A VPC is a logical network with configurable address ranges, subnets, routing, and connectivity.[^vpc]

- A VPC spans Availability Zones within one Region; a conventional subnet resides in one AZ.[^vpc-basics][^subnets]

- Plan VPC and subnet addressing with CIDR. Review address overlap with networks that must be connected.[^vpc-cidr]

## Selection criteria and recommendations

- Budget IP space for task ENIs, databases, and growth, not just current servers.

- Treat routes, security groups, and IAM as separate boundaries rather than assuming all resources in a VPC are safe.

- Choose environment, account, and Region separation based on required isolation and connectivity costs.

## Design example

Design example: divide 10.40.0.0/16 by AZ and separate application and database subnets. This is illustrative; select ranges after checking the organization’s existing networks.

## Operational checks

- [ ] Have overlap and address-space growth been reviewed?
- [ ] Are DNS resolution and endpoint access paths documented?
- [ ] Can each subnet be mapped to its AZ, route table, and purpose?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

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
