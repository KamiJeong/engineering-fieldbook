---
type: Glossary Term
title: Content fingerprint
description: A hash of selected content used to detect changes from the last reviewed version.
concept_id: content-fingerprint
language: en
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
- by: codex/gpt-6
  at: '2026-09-08T04:33:59+00:00'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: Re-verify when repository policy or the checker changes.
sources:
- id: checker
  resource: ../../skills/refresh-fieldbook/scripts/fieldbook.py
  title: Fieldbook checker
- id: translation
  resource: ../../policies/translation.md
  title: Translation policy
stale_after: '2027-01-07T00:46:30+00:00'
translation:
  source_language: ko
  source_concept_id: content-fingerprint
  source_fingerprint: sha256:39d9f497e61ccfcb7b673594b3e2727b018b6a69e39661ba4f7d52b62b4c4f35
  target_fingerprint: sha256:024f5f81830dacd10f37ff5a093bcc334005e72c8ad5689e363a88de8171edfb
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Content fingerprint

## Definition and aliases

A content fingerprint is a hash used to detect changes from the last reviewed version. In this repository, selected metadata and the body are normalized and hashed with a `sha256:` prefix. The Korean term is 내용 지문.[^checker]

Do not compare the Korean hash with the English hash. Compare each document’s current hash with its own last reviewed hash. The input excludes `verified`, `generated`, and `stale_after`.[^translation]

## Understand through an example

Changing the Korean body changes its fingerprint and makes the translation a review candidate. Keeping the body unchanged and updating only verification time preserves the translation fingerprint. The included input fields explain the difference.[^checker]

## Distinctions

A hash does not prove semantic correctness, source freshness, or reviewer identity. This repository does not use it as a digital signature or trust score.

## Related Knowledge

[Change detection versus verification](../../knowledge/en/testing/verification-vs-change-detection.md)

[한국어](../ko/content-fingerprint.md)

## Sources

[^checker]: [Fieldbook checker](../../skills/refresh-fieldbook/scripts/fieldbook.py)
[^translation]: [Translation policy](../../policies/translation.md)
