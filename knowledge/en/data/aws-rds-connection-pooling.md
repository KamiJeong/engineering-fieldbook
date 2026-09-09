---
type: Concept
title: 'Connection pooling: PostgreSQL budgets and RDS Proxy'
description: Explain connection reuse and calculate steady-state and deployment connection limits against a budget.
concept_id: aws-rds-connection-pooling
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
stale_after: '2026-12-08T00:46:30+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 90
  reason: Review after 90 days because execution options, access controls, or service behavior can materially affect
    design.
sources:
- id: proxy
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.howitworks.html
  title: How RDS Proxy works
translation:
  source_language: ko
  source_concept_id: aws-rds-connection-pooling
  source_fingerprint: sha256:f0ae2f671a414974f7b81e102878e68f49277eb6eb6eb4e97a2fcf23fa833909
  target_fingerprint: sha256:c51b5b2f92fa04e4e90a27da7b2fbd0b3c79fdc9577d9883c11df9924ab95a01
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Connection pooling: PostgreSQL budgets and RDS Proxy

## Summary

Opening a DB connection for every request repeats setup and authentication. A connection pool keeps connections for reuse. Manage application connection counts separately from physical DB connections behind a proxy.[^proxy]

## Learning objectives

Explain connection reuse and calculate steady-state and deployment connection limits against a budget.

## Prerequisites

Read [RDS for PostgreSQL](aws-rds-postgresql.md). A process is a running program unit; the pool limit here means the maximum connections maintained by one process.

## 101 · Understand the concept

### External facts

A connection pool reuses connections to reduce setup and authentication overhead. RDS Proxy manages connections in front of the DB and reuses them between transactions when safe.[^proxy]

Session state can cause pinning when reuse is unsafe. Client connections to a proxy and physical DB connections are not the same count.[^proxy]

Even with RDS Proxy, applications must handle failures and cancellation during transactions.[^proxy]

## 201 · Apply the example

### Design example

These are planning figures, not measurements. Suppose 20 processes use at most 10 connections each, with 50 more for batch, administration, and other work. The maximum is 20 × 10 + 50 = 250.

If old and new processes overlap during deployment, 40 processes need 40 × 10 + 50 = 450. A DB budget of 300 fits steady state but is exceeded during deployment.

This is an upper-bound example for direct application-to-DB connections. With RDS Proxy, separately observe client connections, physical DB connections, and pinning that keeps a session on a specific connection.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Budget process count × per-process pool limit plus batch, administrative, and overlapping deployment capacity.

- Coordinate pool-wait timeouts, query timeouts, and retry limits; avoid unbounded waits and retries.

- Decide between application pooling and a proxy based on whether the goal is setup efficiency or handling rapid scaling.

### Operational checks

- [ ] Is the DB connection budget exceeded during maximum scale or rolling deployment?
- [ ] Are pool waits, physical connections, pinning, and long transactions observed?
- [ ] Have stale-connection disposal and retries been tested after failures?

## Check your understanding

**Question:** If per-process pool size stays constant but process count doubles, does the DB connection budget remain unchanged?

**Explanation:** In the direct-connection example, each process contributes its limit, so recalculate the budget. Include overlapping deployment processes and batch or administrative connections.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [RDS for PostgreSQL: responsibility boundaries for a managed database](aws-rds-postgresql.md)
- [RDS Multi-AZ: distinguishing instances and clusters](aws-rds-multi-az.md)
- [AWS Lambda: event-driven function execution](../cloud/aws-lambda.md)
- [Amazon ECS: orchestrating tasks and services](../cloud/aws-ecs.md)

[한국어 원문](../../ko/data/aws-rds-connection-pooling.md)

## Sources

[^proxy]: [How RDS Proxy works](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.howitworks.html)
