---
type: Concept
title: 'IAM policies: explicit permissions and effective-access evaluation'
description: Read policy actions, resources, and conditions, and explain why both permitted and denied requests
  need checking.
concept_id: aws-iam-policy
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
- id: iam-policy
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html
  title: Policies and permissions in IAM
- id: iam-evaluation
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
  title: Policy evaluation logic
translation:
  source_language: ko
  source_concept_id: aws-iam-policy
  source_fingerprint: sha256:aaa7fddda63ecc0a10519389af8a138d1c1bb0165dc2e7fdbe3dd2aa53802c5a
  target_fingerprint: sha256:cdee67f1c63584b7bcaff76c120861d873d844a191e1722bd1021b450211f9fd
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# IAM policies: explicit permissions and effective-access evaluation

## Summary

IAM policies express permissions applied to requests. Start by identifying who requests which action on which resource. An Allow in one policy can still be constrained by other applicable limits or an explicit Deny.[^iam-policy][^iam-evaluation]

## Learning objectives

Read policy actions, resources, and conditions, and explain why both permitted and denied requests need checking.

## Prerequisites

Read [IAM users](aws-iam-user.md) and [IAM roles](aws-iam-role.md). A principal is the requesting identity; an ARN names an AWS resource. JSON represents structured data as fields and values.

## 101 · Understand the concept

### External facts

Most IAM policies use JSON. Distinguish identity-based policies attached to users or roles from resource-based policies attached to resources. Effect specifies allow or deny, Action the operation, Resource the target, and Condition the applicability criteria. Principal identifies the requester where the policy type uses it.[^iam-policy]

An applicable explicit Deny overrides an Allow. Evaluate identity/resource policy relationships and cross-account access in context.[^iam-evaluation]

A permissions boundary limits what identity-based policies can grant to a user or role. Do not generalize that limit to every resource-based grant. An SCP (Service Control Policy) limits permissions in organizational accounts. These limiting policies do not grant action permissions themselves.[^iam-policy]

## 201 · Apply the example

### Design example

Suppose an application should read objects under an S3 prefix. List bucket listing and object reading as separate actions. Check the required APIs and resource ARN scopes, then test requests that should succeed and those that should be denied.

This is not a complete deployable policy. On AccessDenied, collect the actual caller, action, resource, conditions, and applicable policies before broadening permissions.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Constrain resources, actions, and conditions to the task; document reasons for wildcards.

- Collect the actual principal, action, resource, and context before granting broad access to resolve AccessDenied.

- Test requests that must be denied as well as those that must succeed.

### Operational checks

- [ ] Do the policy identity and target resource match the actual request?
- [ ] Have trust, resource, organization, and KMS key policies been checked where applicable?
- [ ] Are list, read, write, and delete permissions distinguished?

## Check your understanding

**Question:** Does adding a permissions boundary or SCP grant the required action permissions?

**Explanation:** These policies limit maximum permissions and do not grant actions themselves. Evaluate granting policies together with applicable restrictions.[^iam-policy]

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [IAM roles: trust policies and temporary session permissions](aws-iam-role.md)
- [IAM users: exceptional use of long-term credentials](aws-iam-user.md)
- [Amazon S3: object storage and access design](../cloud/aws-s3.md)
- [AWS KMS: encryption keys and decryption permissions](aws-kms.md)

[한국어 원문](../../ko/security/aws-iam-policy.md)

## Sources

[^iam-policy]: [Policies and permissions in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
[^iam-evaluation]: [Policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
