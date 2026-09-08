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
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2027-03-07T05:01:30Z'
freshness:
  mode: current
  volatility: low
  review_days: 180
  reason: Focuses on terminology, excluding detailed specifications of linked service implementations.
sources:
- id: az
  resource: https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html
  title: AWS Availability Zones
translation:
  source_language: ko
  source_concept_id: availability-zone
  source_fingerprint: sha256:418a020ec70507deef71a2ba8e9cb3429f2a09f999fbabc94aa6f68926ac6a65
  target_fingerprint: sha256:50afe8696204d18224d20fa39e4a97f8adc807c4b360ca110ecb3c01d807bbac
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# Availability Zone (AZ)

## Summary

A term for fault isolation and placement within an AWS Region.

## External facts

- An AZ is an infrastructure isolation unit within a Region. Placement across AZs provides a basis for fault isolation.[^az]

- Use AZ IDs to identify the same physical AZ across accounts. Do not assume an AZ name alone establishes that identity.[^az]

## Usage and distinctions

- Verify multi-AZ placement and application recovery capability separately.

## Design example

Two servers in one AZ do not establish resilience to an AZ failure merely by being two servers.

## Operational checks

- [ ] Do remaining capacity and data paths work when one AZ is unavailable?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results.

## Related knowledge

- [Amazon VPC: address space and connectivity boundaries](../../knowledge/en/cloud/aws-vpc.md)
- [Public and private subnets: a routing distinction](../../knowledge/en/cloud/aws-subnets.md)
- [RDS Multi-AZ: distinguishing instances and clusters](../../knowledge/en/data/aws-rds-multi-az.md)

[한국어 원문](../ko/availability-zone.md)

## Sources

[^az]: [AWS Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)
