---
type: Concept
title: 'RDS Multi-AZ: distinguishing instances and clusters'
description: Distinguish a single standby from a cluster with readers, and evaluate availability separately from
  read scaling.
concept_id: aws-rds-multi-az
language: en
tags:
- aws
- database
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2027-01-07T00:46:30+00:00'
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
  source_fingerprint: sha256:288182037b13105989fcb2c5e24c5f108523c392b1fb5ad2e87f587890d96b9d
  target_fingerprint: sha256:e13cff693f1a3c1f745984038e0d3ea864ee99e12afaa0946a7208509ace61a0
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# RDS Multi-AZ: distinguishing instances and clusters

## Summary

An RDS Multi-AZ deployment places replicas in other Availability Zones to prepare for DB failure. DB instance and DB cluster deployments differ in replication and read-serving behavior. Check the deployment type behind the Multi-AZ name.[^multi-instance][^multi-cluster]

## Learning objectives

Distinguish a single standby from a cluster with readers, and evaluate availability separately from read scaling.

## Prerequisites

Read [RDS for PostgreSQL](aws-rds-postgresql.md) and [Availability Zones](../../../glossary/en/availability-zone.md). Failover transfers a role to another DB after failure; a standby is a replica waiting for that transition.

## 101 · Understand the concept

### External facts

A Multi-AZ DB instance maintains one synchronous standby in another AZ. That standby does not serve application reads.[^multi-instance]

A Multi-AZ DB cluster uses one writer and two readable replicas across three AZs in one Region with semisynchronous replication. Check engine, version, and Region support.[^multi-cluster]

RDS Multi-AZ clusters are not Aurora clusters. Reader replication lag remains an operational concern.[^multi-cluster]

## 201 · Apply the example

### Design example

Suppose you want to send growing read traffic to a waiting DB. First inspect the deployment type. A single-standby Multi-AZ DB instance cannot use its standby for application reads, so that plan does not apply.

Compare a supported Multi-AZ DB cluster or read replica if read capacity is needed. Separately verify acceptable read lag and recovery of user requests after failover.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Choose the deployment type by separating availability requirements from read scaling.

- Validate interrupted connections, failed transactions, and safe retries during failover at the application level.

- Replication can propagate incorrect changes; design backup recovery and regional disaster recovery separately.

### Operational checks

- [ ] Is the instance/cluster type explicit in documents and infrastructure definitions?
- [ ] Do endpoint choices match read-freshness requirements?
- [ ] Has recovery time been measured from real application requests after failover?

## Check your understanding

**Question:** Does Multi-AZ replication remove the need for backups to recover incorrect data changes?

**Explanation:** Incorrect changes can also replicate. Failover and recovery to a past point are different scenarios, so design backup recovery separately.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [RDS backups: recoverable points and restoration procedures](aws-rds-backup.md)
- [Connection pooling: PostgreSQL budgets and RDS Proxy](aws-rds-connection-pooling.md)
- [Availability Zone (AZ)](../../../glossary/en/availability-zone.md)
- [RTO: Recovery Time Objective](../../../glossary/en/rto.md)

[한국어 원문](../../ko/data/aws-rds-multi-az.md)

## Sources

[^multi-instance]: [Multi-AZ DB instance deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html)
[^multi-cluster]: [Multi-AZ DB cluster deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html)
