---
type: Concept
title: 'AWS WAF: web request inspection and false-positive control'
description: Separate observation from blocking and explain criteria for checking a new rule’s false positives.
concept_id: aws-waf
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
- id: waf
  resource: https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html
  title: What is AWS WAF?
- id: waf-testing
  resource: https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html
  title: Testing and tuning your AWS WAF protections
translation:
  source_language: ko
  source_concept_id: aws-waf
  source_fingerprint: sha256:a1381c2236cbe2f4b08e090e8e45a2bb1035d5f8f37c5a0334e83e187b043b66
  target_fingerprint: sha256:9bc51d41d4afbaf11678dc598b51c6f6e5b795327a92fc17e2ef01497f7c387c
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# AWS WAF: web request inspection and false-positive control

## Summary

A web application receives both legitimate traffic and requests it should block. AWS WAF inspects HTTP and HTTPS requests for supported resources. Check false positives that block legitimate requests as well as attack detection.[^waf][^waf-testing]

## Learning objectives

Separate observation from blocking and explain criteria for checking a new rule’s false positives.

## Prerequisites

Understand how an HTTP request reaches a web application. [Security groups](../cloud/aws-security-group.md) allow network traffic; distinguish them from WAF request inspection.

## 101 · Understand the concept

### External facts

WAF inspects HTTP/HTTPS requests for supported resources such as CloudFront, ALB, and API Gateway REST APIs; it is not attached uniformly to every network resource.[^waf]

A web ACL groups rules and default behavior. Current documentation also calls it a protection pack (web ACL). Actions include Allow, Block, and Count for observation.[^waf]

AWS recommends testing changes and observing production traffic in Count mode before enforcement.[^waf-testing]

## 201 · Apply the example

### Design example

Suppose you want to introduce a rule. Test it in a testing environment first, then observe matches in Count mode on production traffic. Check whether legitimate login, upload, and webhook requests match and why.

After review, apply Block selectively and observe errors and support reports. Define rollback rules and decision criteria in advance.

## 301 · Make a conditional judgment

### Selection criteria and recommendations

- Check critical login, upload, and webhook requests for false positives, including with managed rules.

- Review whether direct origin access can bypass the protected path.

- Do not treat WAF as a replacement for application authentication, authorization, input validation, or security groups.

### Operational checks

- [ ] Is the web ACL associated with the intended resource and scope?
- [ ] Are blocks, counts, and effects on legitimate traffic observed per rule?
- [ ] Are rollback rules and decision metrics defined for urgent false-positive response?

## Check your understanding

**Question:** Can you skip legitimate-request testing for a managed rule?

**Explanation:** Application requests can still match it. Test managed rules and observe them in Count mode before enforcing them.[^waf-testing]

## Evidence and limits

Examples explain concepts and support design exercises; they are not AWS execution results. Before applying recommendations, check support for the target Region, engine, and execution mode, along with quotas and prices. Source-comparison scope and translation review are recorded in the [document change log](../../../log.md).

## Related knowledge

- [Security groups: resource traffic permissions](../cloud/aws-security-group.md)
- [IAM policies: explicit permissions and effective-access evaluation](aws-iam-policy.md)
- [Internet gateways: a target for VPC internet routing](../cloud/aws-internet-gateway.md)

[한국어 원문](../../ko/security/aws-waf.md)

## Sources

[^waf]: [What is AWS WAF?](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html)
[^waf-testing]: [Testing and tuning your AWS WAF protections](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html)
