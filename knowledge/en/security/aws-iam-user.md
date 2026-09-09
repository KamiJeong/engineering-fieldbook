---
type: Concept
title: 'IAM users: exceptional use of long-term credentials'
description: Distinguish root, IAM users, and roles, and explain conditions for long-term credential exceptions.
concept_id: aws-iam-user
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
- id: iam-user
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html
  title: IAM users
- id: iam-practices
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
  title: Security best practices in IAM
translation:
  source_language: ko
  source_concept_id: aws-iam-user
  source_fingerprint: sha256:a5d8b53788dde3e62ec91e10843fcd0455a7d7f2a128f471e09e987a1d8fcb53
  target_fingerprint: sha256:a7581b8d4a721c9a84ee8525857809c8b381c3e6b0bdbc63541e33eba6c869d3
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# IAM users: exceptional use of long-term credentials

## Summary

AWS distinguishes authenticating who made a request from evaluating which actions are permitted. An IAM user is an identity created within an account. Consider temporary credentials first for people and applications, and manage exceptions that require long-term credentials separately.[^iam-user][^iam-practices]

## Learning objectives

Distinguish root, IAM users, and roles, and explain conditions for long-term credential exceptions.

## Prerequisites

Distinguish an AWS account from users within it. Federation connects authentication from an external identity provider. Continue with [IAM roles](aws-iam-role.md) for temporary access.

## 101 · Understand the concept

### External facts

An IAM user is an identity within an AWS account, distinct from the account root. An administrator user is still not the root user.[^iam-user]

A user can have credentials such as a password or access keys. Authentication mechanisms and permission to perform actions are separate concerns.[^iam-user]

AWS recommends federated temporary access for people and roles for workloads. Consider IAM users for specific exceptions that cannot support these approaches.[^iam-practices]

## 201 · Apply the example

### Design example

Suppose an external tool supports only long-term access keys. First establish why roles or federation cannot replace them. If an exception is needed, consider a dedicated user with the required actions and resources instead of sharing a person’s administrator key.

Record ownership, consumers, replacement procedures, and retirement conditions so revocation can account for dependent services.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Record the need, owner, purpose, and retirement conditions for every exception user.

- Keep access keys out of code, images, and documents; track consumers and replacement procedures.

- Review MFA for identities retaining console access and remove unnecessary credentials.

### Operational checks

- [ ] Is there a reason roles or federation cannot replace this user?
- [ ] Can active and unused keys be distinguished?
- [ ] Is revocation coordinated with dependent services when a person leaves or a service retires?

## Check your understanding

**Question:** Is an IAM user with administrator permissions the same identity as the account root user?

**Explanation:** They are different identities. Administrator permissions do not make an IAM user the account root.[^iam-user]

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [IAM roles: trust policies and temporary session permissions](aws-iam-role.md)
- [IAM policies: explicit permissions and effective-access evaluation](aws-iam-policy.md)
- [OIDC](../../../glossary/en/oidc.md)

[한국어 원문](../../ko/security/aws-iam-user.md)

## Sources

[^iam-user]: [IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)
[^iam-practices]: [Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
