---
type: Concept
title: 'Security groups: resource traffic permissions'
description: Permit resource ingress and egress separately from network routing.
concept_id: aws-security-group
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
  source_fingerprint: sha256:4b2653ae442eae08080e288bd8a2580ea5c7b3cc2fc74cee841fe25d3ab67ddf
  target_fingerprint: sha256:8e5af2bc8eebc51b983bbda7e68395fee2ec4342723d1f409f25c8e8ec360269
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# Security groups: resource traffic permissions

## Summary

Permit resource ingress and egress separately from network routing.

## External facts

- A security group controls traffic for associated resources, using protocol, port, and source or destination rules.[^sg]

- Security groups provide allow rules only. Multiple groups aggregate permissions; a restrictive group does not cancel another group’s allow rule.[^sg-rules]

- Security groups track connection state and permit responses for ordinary allowed connections. Check connection-tracking behavior when changing rules for existing connections.[^sg-tracking]

## Selection criteria and recommendations

- Consider separate application and database groups, allowing the required database port from the application group.

- Locate the blocked boundary rather than opening every port to the internet for diagnosis.

- Do not use security groups as substitutes for HTTP attack inspection or IAM permissions.

## Design example

Conceptual example: set the source of database ingress TCP 5432 to the application SG. This reference neither creates a network route nor grants database login permissions.

## Operational checks

- [ ] Do rule purposes match the resources actually associated?
- [ ] Has the combined permission set across all groups been reviewed?
- [ ] Have routes, network ACLs, and listening ports been checked alongside SG rules?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

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
