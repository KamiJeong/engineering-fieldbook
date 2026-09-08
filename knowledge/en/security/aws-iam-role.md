---
type: Concept
title: 'IAM roles: trust policies and temporary session permissions'
description: Separate who can assume a role from what the resulting session can do.
concept_id: aws-iam-role
language: en
tags:
- aws
- security
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
- id: iam-role
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html
  title: IAM roles
- id: ecs-roles
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html
  title: IAM roles for Amazon ECS
translation:
  source_language: ko
  source_concept_id: aws-iam-role
  source_fingerprint: sha256:115fad24c39925efea2f41c0491ff844d39a971e1d14429903263f389fa9b699
  target_fingerprint: sha256:7b88c7deb41e4eb6909bc790f96568ccb3e538e83988448795b233251a991900
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# IAM roles: trust policies and temporary session permissions

## Summary

Separate who can assume a role from what the resulting session can do.

## External facts

- A role is an identity that provides temporary session credentials when assumed rather than ordinary long-term passwords or access keys.[^iam-role]

- A trust policy defines principals and conditions for assuming a role; permission policies define session actions. Relevant evaluation rules still determine effective access.[^iam-role]

- For ECS, the application task role and task execution role have distinct purposes.[^ecs-roles]

## Selection criteria and recommendations

- Separate service, deployment, and application roles by purpose and avoid overly broad trust.

- For federation, constrain issuer and audience-related conditions to the actual identity-provider contract.

- Review automatic credential refresh and error handling for expiry or permission changes.

## Design example

For an ECS application reading S3, inspect task-role permissions. For an image-pull failure, distinguish execution-role and registry access before expanding that policy.

## Operational checks

- [ ] Can the role session behind a request be identified?
- [ ] Have trust scope and required AWS actions been reviewed separately?
- [ ] Does deployment avoid passing unnecessarily broad permissions to the application runtime?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [IAM users: exceptional use of long-term credentials](aws-iam-user.md)
- [IAM policies: explicit permissions and effective-access evaluation](aws-iam-policy.md)
- [Amazon ECS: orchestrating tasks and services](../cloud/aws-ecs.md)
- [OIDC](../../../glossary/en/oidc.md)

[한국어 원문](../../ko/security/aws-iam-role.md)

## Sources

[^iam-role]: [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
[^ecs-roles]: [IAM roles for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html)
