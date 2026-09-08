---
type: Concept
title: 'RDS Multi-AZ: distinguishing instances and clusters'
description: Distinguish high-availability deployment types and their read-serving capabilities.
concept_id: aws-rds-multi-az
language: en
tags:
- aws
- database
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2027-01-06T05:01:30Z'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: Review managed-service capabilities and operational behavior after 120 days.
sources:
- id: multi-instance
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html
  title: Multi-AZ DB instance deployments
- id: multi-cluster
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html
  title: Multi-AZ DB cluster deployments
translation:
  source_language: ko
  source_concept_id: aws-rds-multi-az
  source_fingerprint: sha256:ce820646764a7f5b4f494dd0f8a854f9b8a461e5b22b8f63acab10ec38a7be67
  target_fingerprint: sha256:23b4e88176da9f1183f650774b7e66982959cd66ddec7a818e912e379a553881
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# RDS Multi-AZ: distinguishing instances and clusters

## Summary

Distinguish high-availability deployment types and their read-serving capabilities.

## External facts

- A Multi-AZ DB instance maintains one synchronous standby in another AZ. That standby does not serve application reads.[^multi-instance]

- A Multi-AZ DB cluster uses one writer and two readable replicas across three AZs in one Region with semisynchronous replication. Check engine, version, and Region support.[^multi-cluster]

- RDS Multi-AZ clusters are not Aurora clusters. Reader replication lag remains an operational concern.[^multi-cluster]

## Selection criteria and recommendations

- Choose the deployment type by separating availability requirements from read scaling.

- Validate interrupted connections, failed transactions, and safe retries during failover at the application level.

- Replication can propagate incorrect changes; design backup recovery and regional disaster recovery separately.

## Design example

A design that sends read load to a single-standby DB instance cannot use that standby. Compare a supported cluster or read replica when readers are needed.

## Operational checks

- [ ] Is the instance/cluster type explicit in documents and infrastructure definitions?
- [ ] Do endpoint choices match read-freshness requirements?
- [ ] Has recovery time been measured from real application requests after failover?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [RDS backups: recoverable points and restoration procedures](aws-rds-backup.md)
- [Connection pooling: PostgreSQL budgets and RDS Proxy](aws-rds-connection-pooling.md)
- [Availability Zone (AZ)](../../../glossary/en/availability-zone.md)
- [RTO: Recovery Time Objective](../../../glossary/en/rto.md)

[한국어 원문](../../ko/data/aws-rds-multi-az.md)

## Sources

[^multi-instance]: [Multi-AZ DB instance deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html)
[^multi-cluster]: [Multi-AZ DB cluster deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html)
