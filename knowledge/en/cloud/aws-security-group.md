---
type: Concept
title: 'Security groups: resource traffic permissions'
description: Separate reachability from traffic permission and explain how permissions from multiple security groups
  combine.
concept_id: aws-security-group
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
- id: sg
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html
  title: Control traffic to your AWS resources using security groups
- id: sg-rules
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html
  title: Security group rules
- id: sg-tracking
  resource: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-connection-tracking.html
  title: Amazon EC2 security group connection tracking
translation:
  source_language: ko
  source_concept_id: aws-security-group
  source_fingerprint: sha256:d60e8aa6ccf9c294f77c6d1dfb1741efc5a4ee7757efa98236838ac5cc891d82
  target_fingerprint: sha256:7e7855030020082b87beb0919891d3b0cb09f6860026c8a2dba2295fb59c119b
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Security groups: resource traffic permissions

## Summary

A network path does not mean every connection should be allowed. A security group (SG) defines permitted traffic for associated resources. Rules specify the protocol, port, and source or destination.[^sg]

## Learning objectives

Separate reachability from traffic permission and explain how permissions from multiple security groups combine.

## Prerequisites

Read [subnets](aws-subnets.md) and [route tables](aws-route-table.md). A port identifies a service for communication on a server; this example uses TCP 5432 for the DB.

## 101 · Understand the concept

### External facts

A security group controls traffic for associated resources, using protocol, port, and source or destination rules.[^sg]

Security groups provide allow rules only. Multiple groups aggregate permissions; a restrictive group does not cancel another group’s allow rule.[^sg-rules]

Security groups track connection state and permit responses for ordinary allowed connections. Check connection-tracking behavior when changing rules for existing connections.[^sg-tracking]

## 201 · Apply the example

### Design example

Suppose database ingress TCP 5432 allows the application security group as its source. First check the resources associated with both groups. Then check routing and whether the database is listening on that port.

The reference does not grant DB login permissions. When connections fail, investigate network permissions separately from database authentication.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Consider separate application and database groups, allowing the required database port from the application group.

- Locate the blocked boundary rather than opening every port to the internet for diagnosis.

- Do not use security groups as substitutes for HTTP attack inspection or IAM permissions.

### Operational checks

- [ ] Do rule purposes match the resources actually associated?
- [ ] Has the combined permission set across all groups been reviewed?
- [ ] Have routes, network ACLs, and listening ports been checked alongside SG rules?

## Check your understanding

**Question:** Can adding a restrictive SG cancel permissions from a broadly permissive SG?

**Explanation:** Permissions from multiple SGs are combined. Review the actual allowing rules; adding a restrictive group does not cancel another group’s allowance.[^sg-rules]

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [Public and private subnets: a routing distinction](aws-subnets.md)
- [Route tables: destinations and next hops](aws-route-table.md)
- [RDS for PostgreSQL: responsibility boundaries for a managed database](../data/aws-rds-postgresql.md)
- [AWS WAF: web request inspection and false-positive control](../security/aws-waf.md)

[한국어 원문](../../ko/cloud/aws-security-group.md)

## Sources

[^sg]: [Control traffic to your AWS resources using security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html)
[^sg-rules]: [Security group rules](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html)
[^sg-tracking]: [Amazon EC2 security group connection tracking](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-connection-tracking.html)
