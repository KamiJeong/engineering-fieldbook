---
type: Concept
title: 'Internet gateways: a target for VPC internet routing'
description: Explain why IGW attachment, routing, addressing, and traffic permissions each matter.
concept_id: aws-internet-gateway
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
- id: igw
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html
  title: Connect to the internet using an internet gateway
- id: subnets
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html
  title: Subnets for your VPC
translation:
  source_language: ko
  source_concept_id: aws-internet-gateway
  source_fingerprint: sha256:a4dd08081ddc4b04ac774f1b992401eeeec236c6b0169b6fdd8e880b87e04eee
  target_fingerprint: sha256:84b752a4420bca5af75101685ffcc95179dcee67d8ad3baeeebe3479cb8c44bd
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Internet gateways: a target for VPC internet routing

## Summary

An internet gateway (IGW) connects a VPC with the internet. Attach it to the VPC and use it as a route target. Internet connectivity depends on addressing and traffic permissions as well as the gateway.[^igw]

## Learning objectives

Explain why IGW attachment, routing, addressing, and traffic permissions each matter.

## Prerequisites

Read [subnets](aws-subnets.md) and [route tables](aws-route-table.md). Ingress means incoming traffic; egress means outgoing traffic.

## 101 · Understand the concept

### External facts

An internet gateway attaches to a VPC and supports IPv4 and IPv6 internet communication.[^igw]

Direct connectivity requires an IGW route and a resource public IPv4 or IPv6 address. For IPv4, the IGW participates in public/private address mapping.[^igw]

A direct route to the IGW is central to the conventional public/private subnet distinction.[^subnets]

## 201 · Apply the example

### Design example

Suppose an EC2 instance has a public IPv4 address but cannot reach the internet. First check that the IGW is attached to its VPC. Then find the IGW route in the table applied to the instance’s subnet.

Without that route, a public address alone does not complete the direct path. After checking addressing and routing, inspect security groups, the subnet network ACL, and the application.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Review IGW attachment separately from routing changes that make a subnet public.

- Distinguish internet egress requirements from externally initiated ingress.

- Trace failures through addressing, routes, SG/NACL rules, and the application.

### Operational checks

- [ ] Is the IGW attached to the correct VPC?
- [ ] Do the resource address and actual subnet route support the required communication?
- [ ] Is unnecessary external ingress prevented?

## Check your understanding

**Question:** Does attaching an IGW to a VPC expose all its servers to the internet?

**Explanation:** Subnet routes, resource addresses, and traffic permissions must also be checked. Attachment alone does not satisfy all the conditions.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [Amazon VPC: address space and connectivity boundaries](aws-vpc.md)
- [Public and private subnets: a routing distinction](aws-subnets.md)
- [Route tables: destinations and next hops](aws-route-table.md)
- [NAT gateways: egress and availability modes](aws-nat-gateway.md)

[한국어 원문](../../ko/cloud/aws-internet-gateway.md)

## Sources

[^igw]: [Connect to the internet using an internet gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)
[^subnets]: [Subnets for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)
