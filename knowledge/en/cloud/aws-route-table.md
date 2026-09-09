---
type: Concept
title: 'Route tables: destinations and next hops'
description: Distinguish destinations from targets and select the more specific of two matching routes.
concept_id: aws-route-table
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
- id: routes
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/RouteTables.html
  title: Configure route tables
- id: route-priority
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html
  title: Route priority
translation:
  source_language: ko
  source_concept_id: aws-route-table
  source_fingerprint: sha256:d8fa88e1975a3dbec1ce52b6e1d787f72882c0fa03904f8d1ff15e5cd0cb08d2
  target_fingerprint: sha256:851c7e1f48f99470c0aea64dd062554dcaf2ae6a4bb3e3f5570855782844bdf9
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Route tables: destinations and next hops

## Summary

A route table is a set of rules for where to send traffic next. Each route connects a destination address range to a target. Start by finding the table actually applied to the subnet.[^routes]

## Learning objectives

Distinguish destinations from targets and select the more specific of two matching routes.

## Prerequisites

Read [CIDR](../../../glossary/en/cidr.md) and [subnets](aws-subnets.md). A default route is used when no more specific route matches.[^route-priority]

## 101 · Understand the concept

### External facts

A route identifies a destination range and target. Subnets without an explicit association use the main route table.[^routes]

The most specific prefix generally wins. IPv4 and IPv6 routing are independent; matching destinations and other cases have additional priority rules.[^route-priority]

Local VPC routes and routes to the internet, NAT, or other networks serve different destination ranges.[^routes]

## 201 · Apply the example

### Design example

Suppose the destination is 10.50.1.4 and the table contains routes for 10.50.0.0/16 and 0.0.0.0/0. The first range includes the destination. The second includes all IPv4 addresses, so the first is more specific.

Follow the /16 route’s target in this example. Looking only at the default route can miss the actual path. Then check the return path and traffic permissions.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Make production subnet associations explicit to clarify the impact of main-table changes.

- Review return paths too; routing does not guarantee traffic permission or application responses.

- Check whether more specific endpoint or private-network routes bypass the default route.

### Operational checks

- [ ] Is the intended table actually associated with the subnet?
- [ ] Do any routes point to deleted or unavailable targets?
- [ ] Have separate IPv6 routes and access controls been reviewed when IPv6 is enabled?

## Check your understanding

**Question:** Why can traffic to some destinations take a different path despite an internet default route?

**Explanation:** A more specific matching route can take priority. Also check additional rules for equal destinations and separate IPv6 routes.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

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
