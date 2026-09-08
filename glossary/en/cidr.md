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
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2027-09-08T05:01:30Z'
freshness:
  mode: current
  volatility: low
  review_days: 365
  reason: Focuses on terminology, excluding detailed specifications of linked service implementations.
sources:
- id: vpc-cidr
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html
  title: VPC CIDR blocks
translation:
  source_language: ko
  source_concept_id: cidr
  source_fingerprint: sha256:23916d94056e3b938f28241c2b889f541bec602dc25f973e017e2cb9e8c8e0cf
  target_fingerprint: sha256:3b1a9995e7ac236016d0fe7d60106d4136c63d2307396ac6190360aa2a082adf
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# CIDR: IP address ranges and prefixes

## Summary

Classless Inter-Domain Routing notation expresses network address ranges.

## External facts

- CIDR expresses a range using an address and prefix length. AWS uses it to configure VPC and subnet address ranges.[^vpc-cidr]

## Usage and distinctions

- Separate address planning from internet access configuration. Compare connected networks for overlapping ranges first.

## Design example

The range 10.40.1.0/24 fits within 10.40.0.0/16. This illustrates address ranges, not an allocation for production use.

## Operational checks

- [ ] Does address planning allow for expansion, other VPCs, and on-premises connectivity?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results.

## Related knowledge

- [Amazon VPC: address space and connectivity boundaries](../../knowledge/en/cloud/aws-vpc.md)
- [Public and private subnets: a routing distinction](../../knowledge/en/cloud/aws-subnets.md)
- [Route tables: destinations and next hops](../../knowledge/en/cloud/aws-route-table.md)

[한국어 원문](../ko/cidr.md)

## Sources

[^vpc-cidr]: [VPC CIDR blocks](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html)
