---
type: Concept
title: 'AWS Lambda: event-driven function execution'
description: Design invocation-based execution together with concurrency, retries, and dependencies.
concept_id: aws-lambda
language: en
tags:
- aws
- compute
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
- id: lambda
  resource: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
  title: What is AWS Lambda?
- id: lambda-limits
  resource: https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
  title: Lambda quotas
- id: lambda-vpc
  resource: https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc-internet.html
  title: Enable internet access for VPC-connected Lambda functions
- id: lambda-practices
  resource: https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html
  title: Best practices for working with AWS Lambda functions
- id: compute-guide
  resource: https://docs.aws.amazon.com/decision-guides/latest/decision-guides/fargate-or-lambda.html
  title: AWS Fargate or AWS Lambda?
translation:
  source_language: ko
  source_concept_id: aws-lambda
  source_fingerprint: sha256:432053e9661a59a09108deaa52e10bc3bc670ecf612b88ea2d4dd7313ea890eb
  target_fingerprint: sha256:2f0d61f8b03380d4b0e7626025bb4f0f48d367bece584267b35297b366eb8c7f
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# AWS Lambda: event-driven function execution

## Summary

Design invocation-based execution together with concurrency, retries, and dependencies.

## External facts

- This entry focuses on conventional Lambda Functions, distinguishing them from current alternatives such as MicroVMs and Managed Instances.[^lambda][^compute-guide]

- The current timeout limit for a conventional invocation is 900 seconds. Correctness must not depend on state surviving between invocations, even if environments are reused.[^lambda-limits][^lambda]

- Attaching a conventional VPC-connected function to a public subnet does not itself provide a public IP or internet access.[^lambda-vpc]

## Selection criteria and recommendations

- Consider it for short event handling; compare execution models first for long-running processes or sessions.

- Review retries and duplicate-delivery behavior per event source and make repeated processing safe.[^lambda-practices]

- Set concurrency and queuing so function scaling does not overwhelm database connections or external API limits.

## Design example

Record upload-event identity and processing state to reason about duplicates. Validate transition atomicity for the actual data store.

## Operational checks

- [ ] Are timeouts, errors, throttling, concurrency, and dependency latency observed?
- [ ] Have internal database and external API paths been tested separately?
- [ ] Have duplicate side effects under retries been tested?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [AWS Fargate: managed capacity for ECS](aws-fargate.md)
- [Connection pooling: PostgreSQL budgets and RDS Proxy](../data/aws-rds-connection-pooling.md)
- [IAM roles: trust policies and temporary session permissions](../security/aws-iam-role.md)
- [Public and private subnets: a routing distinction](aws-subnets.md)

[한국어 원문](../../ko/cloud/aws-lambda.md)

## Sources

[^lambda]: [What is AWS Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
[^lambda-limits]: [Lambda quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)
[^lambda-vpc]: [Enable internet access for VPC-connected Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc-internet.html)
[^lambda-practices]: [Best practices for working with AWS Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
[^compute-guide]: [AWS Fargate or AWS Lambda?](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/fargate-or-lambda.html)
