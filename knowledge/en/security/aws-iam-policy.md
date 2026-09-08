---
type: Concept
title: 'IAM policies: explicit permissions and effective-access evaluation'
description: Review all applicable permission boundaries rather than a single policy’s Allow.
concept_id: aws-iam-policy
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
- id: iam-policy
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html
  title: Policies and permissions in IAM
- id: iam-evaluation
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
  title: Policy evaluation logic
translation:
  source_language: ko
  source_concept_id: aws-iam-policy
  source_fingerprint: sha256:311acb7d7c025240fd3409a268fe50de005681b8fb2868f5234727703876e864
  target_fingerprint: sha256:83cf136a214feb9b91fb1fb49b2b903d62e2b480c5dd434bd12ad01c513ad29d
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# IAM policies: explicit permissions and effective-access evaluation

## Summary

Review all applicable permission boundaries rather than a single policy’s Allow.

## External facts

- Most IAM policies are JSON. Distinguish identity-based and resource-based policies. Key elements include Effect, Action, Resource, and Condition; Principal usage depends on policy type.[^iam-policy]

- An applicable explicit Deny overrides an Allow. Evaluate identity/resource policy relationships and cross-account access in context.[^iam-evaluation]

- Limiting policies such as permission boundaries and SCPs do not themselves grant action permissions.[^iam-policy]

## Selection criteria and recommendations

- Constrain resources, actions, and conditions to the task; document reasons for wildcards.

- Collect the actual principal, action, resource, and context before granting broad access to resolve AccessDenied.

- Test requests that must be denied as well as those that must succeed.

## Design example

Design example: reading objects under an S3 prefix has different permission requirements from listing the bucket. Enumerate resource ARN scopes and APIs separately; this is not a deployable complete policy.

## Operational checks

- [ ] Do the policy identity and target resource match the actual request?
- [ ] Have trust, resource, organization, and KMS key policies been checked where applicable?
- [ ] Are list, read, write, and delete permissions distinguished?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [IAM roles: trust policies and temporary session permissions](aws-iam-role.md)
- [IAM users: exceptional use of long-term credentials](aws-iam-user.md)
- [Amazon S3: object storage and access design](../cloud/aws-s3.md)
- [AWS KMS: encryption keys and decryption permissions](aws-kms.md)

[한국어 원문](../../ko/security/aws-iam-policy.md)

## Sources

[^iam-policy]: [Policies and permissions in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
[^iam-evaluation]: [Policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
