---
type: Concept
title: 'NAT gateways: egress and availability modes'
description: Distinguish connectivity types from availability modes and explain the application’s egress dependencies.
concept_id: aws-nat-gateway
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
stale_after: '2026-12-08T00:46:30+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 90
  reason: Review after 90 days because execution options, access controls, or service behavior can materially affect
    design.
sources:
- id: nat
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html
  title: NAT gateways
- id: regional-nat
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html
  title: Regional NAT gateways
translation:
  source_language: ko
  source_concept_id: aws-nat-gateway
  source_fingerprint: sha256:1b6652744bea10f14b3017eaea8c3d393d6939d41c31e51845b9c0da335ba0d0
  target_fingerprint: sha256:af06c5dcbbf76b36fc0c54ede04f0e518fa5739f0ad5fca52b9bf7545ae3f483
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# NAT gateways: egress and availability modes

## Summary

An application in a private network may need to call an external API. NAT translates addresses during communication. AWS NAT Gateway distinguishes public connectivity for internet access from private connectivity for private networks, separately from zonal and regional availability modes.[^nat][^regional-nat]

## Learning objectives

Distinguish connectivity types from availability modes and explain the application’s egress dependencies.

## Prerequisites

Read [subnets](aws-subnets.md), [IGW](aws-internet-gateway.md), and [Availability Zones](../../../glossary/en/availability-zone.md). An EIP is a static public IPv4 address allocated in AWS.[^nat]

## 101 · Understand the concept

### External facts

Public NAT enables private resources’ IPv4 internet connections. Zonal public NAT uses a public subnet, EIP, and IGW path. Private NAT connects private networks and cannot provide internet egress through an IGW.[^nat]

Regional NAT is also available. It requires no hosting public subnet; automatic mode expands to workload AZs, while manual mode leaves AZ management to the user.[^regional-nat]

Regional NAT does not support private NAT. Public/private connectivity and zonal/regional availability are different classifications.[^regional-nat]

## 201 · Apply the example

### Design example

Follow application AZ-A → NAT-A → IGW in a zonal public NAT example. Check whether applications in other AZs also use NAT-A to identify paths that depend on AZ-A.

When considering regional NAT, inspect its separate route table and address-management mode instead of copying this configuration. Responsibility for AZ expansion differs between automatic and manual modes; compare support and cost too.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- For zonal NAT, assess per-AZ egress and failure dependencies. For regional NAT, check support, address-management mode, and cost.

- Compare service endpoints with NAT traversal for eligible traffic, including cost and operational complexity.

- Do not assume NAT fulfills every firewall requirement.

### Operational checks

- [ ] Are the NAT connectivity type and availability mode known?
- [ ] Have actual egress paths and public source addresses been checked per AZ?
- [ ] Are throughput, connection failures, processed data, and transfer costs observed?

## Check your understanding

**Question:** Does regional availability mean private NAT is also supported?

**Explanation:** No. Regional is an availability mode; public and private describe connectivity. Regional NAT currently does not support private NAT.[^regional-nat]

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [Public and private subnets: a routing distinction](aws-subnets.md)
- [Route tables: destinations and next hops](aws-route-table.md)
- [Internet gateways: a target for VPC internet routing](aws-internet-gateway.md)
- [AWS Fargate: managed capacity for ECS](aws-fargate.md)

[한국어 원문](../../ko/cloud/aws-nat-gateway.md)

## Sources

[^nat]: [NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)
[^regional-nat]: [Regional NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html)
