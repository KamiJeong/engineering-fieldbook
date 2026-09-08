---
type: Concept
title: 'Internet gateways: a target for VPC internet routing'
description: Understand IGW attachment, routing, addressing, and traffic permissions together.
concept_id: aws-internet-gateway
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
- id: igw
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html
  title: Connect to the internet using an internet gateway
- id: subnets
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html
  title: Subnets for your VPC
translation:
  source_language: ko
  source_concept_id: aws-internet-gateway
  source_fingerprint: sha256:ca944361eb4dd54ae763a9a80bd0dffdb4a18195b34b2116b38537178d9a8834
  target_fingerprint: sha256:227d3bf78f9a78f30a9ab6a556bff1ed912aaf225b120f580eab438eca3f22a1
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# Internet gateways: a target for VPC internet routing

## Summary

Understand IGW attachment, routing, addressing, and traffic permissions together.

## External facts

- An internet gateway attaches to a VPC and supports IPv4 and IPv6 internet communication.[^igw]

- Direct connectivity requires an IGW route and a resource public IPv4 or IPv6 address. For IPv4, the IGW participates in public/private address mapping.[^igw]

- A direct route to the IGW is central to the conventional public/private subnet distinction.[^subnets]

## Selection criteria and recommendations

- Review IGW attachment separately from routing changes that make a subnet public.

- Distinguish internet egress requirements from externally initiated ingress.

- Trace failures through addressing, routes, SG/NACL rules, and the application.

## Design example

A public IPv4 address without an IGW route in the associated table does not complete a direct internet path. Check addressing and routing before changing security groups.

## Operational checks

- [ ] Is the IGW attached to the correct VPC?
- [ ] Do the resource address and actual subnet route support the required communication?
- [ ] Is unnecessary external ingress prevented?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [Amazon VPC: address space and connectivity boundaries](aws-vpc.md)
- [Public and private subnets: a routing distinction](aws-subnets.md)
- [Route tables: destinations and next hops](aws-route-table.md)
- [NAT gateways: egress and availability modes](aws-nat-gateway.md)

[한국어 원문](../../ko/cloud/aws-internet-gateway.md)

## Sources

[^igw]: [Connect to the internet using an internet gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)
[^subnets]: [Subnets for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)
