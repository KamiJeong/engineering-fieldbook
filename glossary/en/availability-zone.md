---
type: Glossary Term
title: Availability Zone (AZ)
description: A term for fault isolation and placement within an AWS Region.
concept_id: availability-zone
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
stale_after: '2027-03-08T00:46:30+00:00'
freshness:
  mode: current
  volatility: low
  review_days: 180
  reason: Focuses on terminology, excluding detailed specifications of linked service implementations.
sources:
- id: az
  resource: https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html
  title: AWS Availability Zones
- id: az-ids
  resource: https://docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html
  title: AZ IDs
translation:
  source_language: ko
  source_concept_id: availability-zone
  source_fingerprint: sha256:8ee2ce924a05873777d4f69e041892e52393529b3edb173eb24db1188115d7b9
  target_fingerprint: sha256:0accba5d5f0990a4be9ede1e0d08990b1a72b3d48082f1229901fce2eb72b92c
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Availability Zone (AZ)

## Summary

An Availability Zone (AZ) is a placement unit designed to isolate infrastructure failures within an AWS Region. Placing resources in multiple AZs supports designs that prepare for an AZ failure.[^az]

## External facts

Use an AZ ID to identify the same physical AZ across accounts. In some older Regions and accounts, a name such as `us-east-1a` can refer to different locations. This does not mean names are mapped differently in every Region.[^az-ids]

## Design example

Suppose two servers are in the same AZ. Both can be affected if that AZ becomes unavailable, so server count alone does not establish AZ resilience. Even with placement in different AZs, check remaining throughput and data paths.

## Usage and distinctions

Multi-AZ placement is a foundation for recovery design. Actual application failover and request handling need separate verification.

## Operational checks

- [ ] Do remaining capacity and data paths work when one AZ is unavailable?

## Evidence and limits

This entry explains terminology and placement principles. It does not guarantee recovery success or time for a specific application.

## Related knowledge

- [Amazon VPC: address space and connectivity boundaries](../../knowledge/en/cloud/aws-vpc.md)
- [Public and private subnets: a routing distinction](../../knowledge/en/cloud/aws-subnets.md)
- [RDS Multi-AZ: distinguishing instances and clusters](../../knowledge/en/data/aws-rds-multi-az.md)

[한국어 원문](../ko/availability-zone.md)

## Sources

[^az]: [AWS Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)
[^az-ids]: [AZ IDs](https://docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html)
