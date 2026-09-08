---
type: Concept
title: 'NAT gateways: egress and availability modes'
description: Distinguish connectivity types from zonal and regional availability modes.
concept_id: aws-nat-gateway
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
stale_after: '2026-12-07T05:01:30Z'
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
  source_fingerprint: sha256:20ca0b0b83dccb3cb62d5e7c923c49c95620bbe75caa46a00a48a6c1d667225e
  target_fingerprint: sha256:c04fb911054bed1790859d4b290409de2472d5da7e3d0ea2f006fb260e9ce92f
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# NAT gateways: egress and availability modes

## Summary

Distinguish connectivity types from zonal and regional availability modes.

## External facts

- Public NAT enables private resources’ IPv4 internet connections. Zonal public NAT uses a public subnet, EIP, and IGW path. Private NAT connects private networks and cannot provide internet egress through an IGW.[^nat]

- Regional NAT is also available. It requires no hosting public subnet; automatic mode expands to workload AZs, while manual mode leaves AZ management to the user.[^regional-nat]

- Regional NAT does not support private NAT. Public/private connectivity and zonal/regional availability are different classifications.[^regional-nat]

## Selection criteria and recommendations

- For zonal NAT, assess per-AZ egress and failure dependencies. For regional NAT, check support, address-management mode, and cost.

- Compare service endpoints with NAT traversal for eligible traffic, including cost and operational complexity.

- Do not assume NAT fulfills every firewall requirement.

## Design example

Zonal example: application AZ-A → NAT-A → IGW. For regional NAT, review its separate route table and address-management mode rather than assuming a copy of the zonal design.

## Operational checks

- [ ] Are the NAT connectivity type and availability mode known?
- [ ] Have actual egress paths and public source addresses been checked per AZ?
- [ ] Are throughput, connection failures, processed data, and transfer costs observed?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [Public and private subnets: a routing distinction](aws-subnets.md)
- [Route tables: destinations and next hops](aws-route-table.md)
- [Internet gateways: a target for VPC internet routing](aws-internet-gateway.md)
- [AWS Fargate: managed capacity for ECS](aws-fargate.md)

[한국어 원문](../../ko/cloud/aws-nat-gateway.md)

## Sources

[^nat]: [NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)
[^regional-nat]: [Regional NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html)
