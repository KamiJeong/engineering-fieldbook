---
type: Concept
title: 'IAM users: exceptional use of long-term credentials'
description: Distinguish IAM users from root and roles, managing long-term credentials only where required.
concept_id: aws-iam-user
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
- id: iam-user
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html
  title: IAM users
- id: iam-practices
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
  title: Security best practices in IAM
translation:
  source_language: ko
  source_concept_id: aws-iam-user
  source_fingerprint: sha256:d08d7362727ed995e9f9c8781a1fb2824fa0258f92a045d8aaf6223aab04a3f9
  target_fingerprint: sha256:ca8ac02460ab693be067b9ff936c2a4fa563e9a3a3af9b15bf5a445b36334ad0
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# IAM users: exceptional use of long-term credentials

## Summary

Distinguish IAM users from root and roles, managing long-term credentials only where required.

## External facts

- An IAM user is an identity within an AWS account, distinct from the account root. An administrator user is still not the root user.[^iam-user]

- A user can have credentials such as a password or access keys. Authentication mechanisms and permission to perform actions are separate concerns.[^iam-user]

- AWS recommends federated temporary access for people and roles for workloads. Consider IAM users for specific exceptions that cannot support these approaches.[^iam-practices]

## Selection criteria and recommendations

- Record the need, owner, purpose, and retirement conditions for every exception user.

- Keep access keys out of code, images, and documents; track consumers and replacement procedures.

- Review MFA for identities retaining console access and remove unnecessary credentials.

## Design example

For an external tool that only supports long-term keys, consider a dedicated user. Do not share a person’s administrator key; design permissions for the required resources and actions.

## Operational checks

- [ ] Is there a reason roles or federation cannot replace this user?
- [ ] Can active and unused keys be distinguished?
- [ ] Is revocation coordinated with dependent services when a person leaves or a service retires?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [IAM roles: trust policies and temporary session permissions](aws-iam-role.md)
- [IAM policies: explicit permissions and effective-access evaluation](aws-iam-policy.md)
- [OIDC](../../../glossary/en/oidc.md)

[한국어 원문](../../ko/security/aws-iam-user.md)

## Sources

[^iam-user]: [IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)
[^iam-practices]: [Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
