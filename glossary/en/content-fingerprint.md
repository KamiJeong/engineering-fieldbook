---
type: Glossary Term
title: Content fingerprint
description: A hash of selected content used to detect changes from the last reviewed
  version.
concept_id: content-fingerprint
language: en
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
- by: codex/gpt-6
  at: '2026-09-08T04:33:59+00:00'
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
stale_after: '2027-01-06T04:33:59+00:00'
translation:
  source_language: ko
  source_concept_id: content-fingerprint
  source_fingerprint: sha256:88213c4046cb8429531bb60ae432894b940afad0d14fc6743f7b328d01411516
  target_fingerprint: sha256:195474837de929ddf4948cb4722f5e0d3fe5a64728115fe4f64cf47da576c14c
  synced_at: '2026-09-08T04:30:37+00:00'
  review_status: SYNCED
---

# Content fingerprint

## Definition and aliases

In this repository, a fingerprint is a hash prefixed with `sha256:`, computed from normalized selected metadata and the document body. The Korean term is 내용 지문.[^checker]

Compare each document's current hash with its own last reviewed hash, not the Korean hash with the English hash. The input excludes `verified`, `generated`, and `stale_after`.[^translation]

## Distinctions

A hash does not prove semantic correctness, source freshness, or reviewer identity. This repository does not use it as a digital signature or trust score.

## Related Knowledge

[Change detection versus verification](../../knowledge/en/testing/verification-vs-change-detection.md)

[^checker]: [Fingerprint implementation](../../skills/refresh-fieldbook/scripts/fieldbook.py)
[^translation]: [Input fields and synchronization contract](../../policies/translation.md)

[한국어](../ko/content-fingerprint.md)
