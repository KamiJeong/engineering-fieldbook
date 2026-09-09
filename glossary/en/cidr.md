---
type: Glossary Term
title: 'CIDR: IP address ranges and prefixes'
description: Classless Inter-Domain Routing notation expresses network address ranges.
concept_id: cidr
language: en
tags:
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
stale_after: '2027-09-09T00:46:30+00:00'
freshness:
  mode: current
  volatility: low
  review_days: 365
  reason: Focuses on terminology, excluding detailed specifications of linked service implementations.
sources:
- id: vpc-cidr
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html
  title: VPC CIDR blocks
- id: cidr-rfc
  resource: https://www.rfc-editor.org/rfc/rfc4632.html
  title: 'RFC 4632, section 3.1: Basic Concept and Prefix Notation'
translation:
  source_language: ko
  source_concept_id: cidr
  source_fingerprint: sha256:4d617d9a6f941f810409e316b3edb82b9b25c0c7d13c6f3fa65165388cd45bf7
  target_fingerprint: sha256:31d5d9d61610b445f4f04ab35454cdeea87c0dae58c66cbc2e9d2068fb1df352
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# CIDR: IP address ranges and prefixes

## Summary

CIDR (Classless Inter-Domain Routing) expresses an IP address range using an address and a prefix length. In `10.40.1.0/24`, `/24` means the first 24 bits form the network portion.[^cidr-rfc]

## External facts

An IPv4 address has 32 bits. A `/24` range contains 256 addresses represented by the remaining 8 bits. This differs from the number of addresses assignable to actual services. AWS also uses CIDR to configure VPC and subnet address ranges.[^cidr-rfc][^vpc-cidr]

## Design example

`10.40.1.0/24` fits within `10.40.0.0/16`. For IPv4, `/24` describes a smaller range than `/16`. This illustrates containment, not a production address allocation.

## Usage and distinctions

Selecting address ranges and allowing internet communication are different tasks. Before connecting other VPCs or on-premises networks, check overlap and room for growth.

## Operational checks

- [ ] Have you checked overlap with connected networks and room for expansion?

## Evidence and limits

This entry explains IPv4 prefix notation and range containment. Check assignable AWS addresses and service-specific limits for the target configuration.

## Related knowledge

- [Amazon VPC: address space and connectivity boundaries](../../knowledge/en/cloud/aws-vpc.md)
- [Public and private subnets: a routing distinction](../../knowledge/en/cloud/aws-subnets.md)
- [Route tables: destinations and next hops](../../knowledge/en/cloud/aws-route-table.md)

[한국어 원문](../ko/cidr.md)

## Sources

[^vpc-cidr]: [VPC CIDR blocks](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html)
[^cidr-rfc]: [RFC 4632, section 3.1: Basic Concept and Prefix Notation](https://www.rfc-editor.org/rfc/rfc4632.html)
