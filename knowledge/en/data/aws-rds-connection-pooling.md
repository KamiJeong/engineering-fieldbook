---
type: Concept
title: 'Connection pooling: PostgreSQL budgets and RDS Proxy'
description: Control application concurrency separately from physical database connections.
concept_id: aws-rds-connection-pooling
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
stale_after: '2026-12-07T05:01:30Z'
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
  source_fingerprint: sha256:c1057fa61d0f65d732db9a1c56abe588f018fc44df1dd4c62a3af4e040e79fcb
  target_fingerprint: sha256:fc077ff49e56ce530ee4ed20414bf4445c97574a1d8ac91a069d89fb0268f9ab
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# Connection pooling: PostgreSQL budgets and RDS Proxy

## Summary

Control application concurrency separately from physical database connections.

## External facts

- A connection pool reuses connections to reduce setup and authentication overhead. RDS Proxy manages connections in front of the DB and reuses them between transactions when safe.[^proxy]

- Session state can cause pinning when reuse is unsafe. Client connections to a proxy and physical DB connections are not the same count.[^proxy]

- Even with RDS Proxy, applications must handle failures and cancellation during transactions.[^proxy]

## Selection criteria and recommendations

- Budget process count × per-process pool limit plus batch, administrative, and overlapping deployment capacity.

- Coordinate pool-wait timeouts, query timeouts, and retry limits; avoid unbounded waits and retries.

- Decide between application pooling and a proxy based on whether the goal is setup efficiency or handling rapid scaling.

## Design example

Hypothetical budget: 20 processes × pool 10 + 50 other connections = 250. A DB budget of 300 fits steady state, but overlapping deployment with 40 processes reaches 450. These are planning figures, not measurements.

## Operational checks

- [ ] Is the DB connection budget exceeded during maximum scale or rolling deployment?
- [ ] Are pool waits, physical connections, pinning, and long transactions observed?
- [ ] Have stale-connection disposal and retries been tested after failures?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [RDS for PostgreSQL: responsibility boundaries for a managed database](aws-rds-postgresql.md)
- [RDS Multi-AZ: distinguishing instances and clusters](aws-rds-multi-az.md)
- [AWS Lambda: event-driven function execution](../cloud/aws-lambda.md)
- [Amazon ECS: orchestrating tasks and services](../cloud/aws-ecs.md)

[한국어 원문](../../ko/data/aws-rds-connection-pooling.md)

## Sources

[^proxy]: [How RDS Proxy works](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.howitworks.html)
