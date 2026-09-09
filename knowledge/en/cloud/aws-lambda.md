---
type: Concept
title: 'AWS Lambda: event-driven function execution'
description: Explain invocation time and state constraints, and define handling criteria for repeated delivery of
  an event.
concept_id: aws-lambda
language: en
tags:
- aws
- compute
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
- id: lambda-vpc-access
  resource: https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html
  title: Giving Lambda functions access to resources in an Amazon VPC
translation:
  source_language: ko
  source_concept_id: aws-lambda
  source_fingerprint: sha256:ce0990157870f96900d0034908661a25b0509d0a7794f459c73bb87cad9ab32f
  target_fingerprint: sha256:c513aa6ab94f78aa2c440a337c1c39f7b3c012997dc807fd439fba8219d14953
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# AWS Lambda: event-driven function execution

## Summary

An event-driven function can run code when something happens, such as a file upload. With AWS Lambda Functions, you write the function to invoke and let the service manage its execution environment. This entry covers conventional invocations; MicroVMs, Managed Instances, and long-running workflows are separate scopes.[^lambda][^compute-guide]

## Learning objectives

Explain invocation time and state constraints, and define handling criteria for repeated delivery of an event.

## Prerequisites

Understand function invocation and external API requests. Review [connection pooling](../data/aws-rds-connection-pooling.md) for DB access and [subnets](aws-subnets.md) for private networking.

## 101 · Understand the concept

### External facts

This entry focuses on conventional Lambda Functions, distinguishing them from current alternatives such as MicroVMs and Managed Instances.[^lambda][^compute-guide]

The current timeout limit for a conventional invocation is 900 seconds. Correctness must not depend on state surviving between invocations, even if environments are reused.[^lambda-limits][^lambda]

Attaching a conventional VPC-connected function to a public subnet does not itself provide a public IP or internet access.[^lambda-vpc][^lambda-vpc-access]

## 201 · Apply the example

### Design example

Suppose a function processes an uploaded file. First check the conditions under which its upload event can be delivered again. Then consider using the event identifier and processing state to distinguish completed requests.

The result to check is whether repeated execution avoids unwanted side effects. Safety when two invocations update state concurrently still needs verification against the actual store’s atomic update behavior.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Consider it for short event handling; compare execution models first for long-running processes or sessions.

- Review retries and duplicate-delivery behavior per event source and make repeated processing safe.[^lambda-practices]

- Set concurrency and queuing so function scaling does not overwhelm database connections or external API limits.

### Operational checks

- [ ] Are timeouts, errors, throttling, concurrency, and dependency latency observed?
- [ ] Have internal database and external API paths been tested separately?
- [ ] Have duplicate side effects under retries been tested?

## Check your understanding

**Question:** Does one successful invocation finish retry testing?

**Explanation:** Check repeated and concurrent processing of the same event, as well as retries after failure. One successful invocation does not demonstrate the absence of duplicate side effects.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

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

[^lambda-vpc-access]: [Giving Lambda functions access to resources in an Amazon VPC](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html)
