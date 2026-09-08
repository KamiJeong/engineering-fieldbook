---
type: Concept
title: 'AWS WAF: web request inspection and false-positive control'
description: Inspect HTTP requests reaching protected resources and roll out rules progressively.
concept_id: aws-waf
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
- id: waf
  resource: https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html
  title: What is AWS WAF?
- id: waf-testing
  resource: https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html
  title: Testing and tuning your AWS WAF protections
translation:
  source_language: ko
  source_concept_id: aws-waf
  source_fingerprint: sha256:0a790710ac8952b8572ae68ef6b2f533e7e054081265189e490e16ccaac2ceac
  target_fingerprint: sha256:d0d912429381d52309c7168ce1c0d89c98817eecc71c3bda348a9efa709bc6a4
  synced_at: '2026-09-08T05:01:30Z'
  review_status: SYNCED
---

# AWS WAF: web request inspection and false-positive control

## Summary

Inspect HTTP requests reaching protected resources and roll out rules progressively.

## External facts

- WAF inspects HTTP/HTTPS requests for supported resources such as CloudFront, ALB, and API Gateway REST APIs; it is not attached uniformly to every network resource.[^waf]

- A web ACL groups rules and default behavior. Actions include Allow, Block, and Count for observation.[^waf]

- AWS recommends testing changes and observing production traffic in Count mode before enforcement.[^waf-testing]

## Selection criteria and recommendations

- Check critical login, upload, and webhook requests for false positives, including with managed rules.

- Review whether direct origin access can bypass the protected path.

- Do not treat WAF as a replacement for application authentication, authorization, input validation, or security groups.

## Design example

Observe a new rule in Count mode, then review legitimate requests and match reasons. Apply Block selectively after review, monitoring errors and support reports.

## Operational checks

- [ ] Is the web ACL associated with the intended resource and scope?
- [ ] Are blocks, counts, and effects on legitimate traffic observed per rule?
- [ ] Are rollback rules and decision metrics defined for urgent false-positive response?

## Evidence and limits

An agent compared the technical claims with the official sources below on 2026-09-08. Recommendations are conditional design judgments; examples are not AWS execution or personal experiment results. Before implementation, recheck support for the target Region, engine, and execution mode, along with relevant quotas and prices.

## Related knowledge

- [Security groups: resource traffic permissions](../cloud/aws-security-group.md)
- [IAM policies: explicit permissions and effective-access evaluation](aws-iam-policy.md)
- [Internet gateways: a target for VPC internet routing](../cloud/aws-internet-gateway.md)

[한국어 원문](../../ko/security/aws-waf.md)

## Sources

[^waf]: [What is AWS WAF?](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html)
[^waf-testing]: [Testing and tuning your AWS WAF protections](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html)
