---
type: Concept
title: 'IAM roles: trust policies and temporary session permissions'
description: Distinguish trust-policy and permission-policy questions, and select the relevant ECS application or
  execution role.
concept_id: aws-iam-role
language: en
tags:
- aws
- security
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
- id: iam-role
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html
  title: IAM roles
- id: ecs-roles
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html
  title: IAM roles for Amazon ECS
translation:
  source_language: ko
  source_concept_id: aws-iam-role
  source_fingerprint: sha256:6f59cc20f5554ab869aca6bc1267a814b607c4e7dcde9774608b4bc002009507
  target_fingerprint: sha256:63be69e6bfa6a881a5e2a6aaeffb05e5d25c89bf5e4f3d473de9c2337b99c9a6
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# IAM roles: trust policies and temporary session permissions

## Summary

An application can receive AWS permissions without being given a long-term access key directly. An IAM role is an identity you assume to obtain temporary session credentials. Read who can assume it separately from what actions the session can perform.[^iam-role]

## Learning objectives

Distinguish trust-policy and permission-policy questions, and select the relevant ECS application or execution role.

## Prerequisites

Review authentication versus permissions in [IAM users](aws-iam-user.md). Assuming a role means taking on that role. The ECS example uses a [task](../cloud/aws-ecs.md) as its execution unit.

## 101 · Understand the concept

### External facts

A role is an identity that provides temporary session credentials when assumed rather than ordinary long-term passwords or access keys.[^iam-role]

A trust policy defines principals and conditions for assuming a role; permission policies define session actions. Relevant evaluation rules still determine effective access.[^iam-role]

For ECS, the application task role and task execution role have distinct purposes.[^ecs-roles]

## 201 · Apply the example

### Design example

Suppose a running ECS application cannot read an S3 object. Inspect the application task role and permissions for the target object. If an image cannot be pulled before startup, inspect the task execution role and registry access instead.

Similar-looking permission errors can involve different callers. Identify the failed action and caller before reviewing the policy to avoid granting unnecessarily broad access.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Separate service, deployment, and application roles by purpose and avoid overly broad trust.

- For federation, constrain issuer and audience-related conditions to the actual identity-provider contract.

- Review automatic credential refresh and error handling for expiry or permission changes.

### Operational checks

- [ ] Can the role session behind a request be identified?
- [ ] Have trust scope and required AWS actions been reviewed separately?
- [ ] Does deployment avoid passing unnecessarily broad permissions to the application runtime?

## Check your understanding

**Question:** Does allowing role assumption in a trust policy also allow every AWS action?

**Explanation:** A trust policy concerns who can assume the role. Check session actions against permission policies and the other applicable evaluation rules.

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [IAM users: exceptional use of long-term credentials](aws-iam-user.md)
- [IAM policies: explicit permissions and effective-access evaluation](aws-iam-policy.md)
- [Amazon ECS: orchestrating tasks and services](../cloud/aws-ecs.md)
- [OIDC](../../../glossary/en/oidc.md)

[한국어 원문](../../ko/security/aws-iam-role.md)

## Sources

[^iam-role]: [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
[^ecs-roles]: [IAM roles for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html)
