---
type: Concept
title: 'Route tables: destinations and next hops'
description: Understand the routes and priorities actually applied to a subnet.
concept_id: aws-route-table
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
- id: routes
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/RouteTables.html
  title: Configure route tables
- id: route-priority
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html
  title: Route priority
translation:
  source_language: ko
  source_concept_id: aws-route-table
  source_fingerprint: sha256:1f223c1da193d0c0215481bb243fe64419c66d526ec80a21744373a1a43dd5bf
  target_fingerprint: sha256:5ab1502025ceb1b5b48f37587d613d366596cbff5875a8b8249f6b218996c7f1
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# Route tables: destinations and next hops

## Summary

Understand the routes and priorities actually applied to a subnet.

## External facts

- A route identifies a destination range and target. Subnets without an explicit association use the main route table.[^routes]

- The most specific prefix generally wins. IPv4 and IPv6 routing are independent; matching destinations and other cases have additional priority rules.[^route-priority]

- Local VPC routes and routes to the internet, NAT, or other networks serve different destination ranges.[^routes]

## Selection criteria and recommendations

- Make production subnet associations explicit to clarify the impact of main-table changes.

- Review return paths too; routing does not guarantee traffic permission or application responses.

- Check whether more specific endpoint or private-network routes bypass the default route.

## Design example

Worked example: for destination 10.50.1.4, 10.50.0.0/16 is more specific than 0.0.0.0/0. Do not diagnose connectivity from the default route alone when both exist.

## Operational checks

- [ ] Is the intended table actually associated with the subnet?
- [ ] Do any routes point to deleted or unavailable targets?
- [ ] Have separate IPv6 routes and access controls been reviewed when IPv6 is enabled?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [Amazon VPC: address space and connectivity boundaries](aws-vpc.md)
- [Public and private subnets: a routing distinction](aws-subnets.md)
- [NAT gateways: egress and availability modes](aws-nat-gateway.md)
- [Internet gateways: a target for VPC internet routing](aws-internet-gateway.md)
- [CIDR: IP address ranges and prefixes](../../../glossary/en/cidr.md)

[한국어 원문](../../ko/cloud/aws-route-table.md)

## Sources

[^routes]: [Configure route tables](https://docs.aws.amazon.com/vpc/latest/userguide/RouteTables.html)
[^route-priority]: [Route priority](https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html)
