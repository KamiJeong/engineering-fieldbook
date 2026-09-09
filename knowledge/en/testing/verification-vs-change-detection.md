---
type: Concept
title: Separating change detection from knowledge verification
description: Uses a Fieldbook experiment to distinguish fingerprints, freshness, and semantic verification.
concept_id: verification-vs-change-detection
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
  resource: ../../../skills/refresh-fieldbook/scripts/fieldbook.py
  title: Checker implementation
- id: experiment
  resource: ../../../experiments/evidence/2026-09-08-fieldbook-audit/result.json
  title: Observed experiment results
stale_after: '2027-01-07T00:46:30+00:00'
translation:
  source_language: ko
  source_concept_id: verification-vs-change-detection
  source_fingerprint: sha256:13dfde137d48495d78d28709015bc0e45f5826581f747b3bfee94398bb262fa3
  target_fingerprint: sha256:386608666d49e5017df9b2217eb17fec96b393ac8d3c301cabaf0460e1d09409
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Separating change detection from knowledge verification

## Summary

A successful document check still leaves factual correctness and translation meaning to review. Change detection finds inputs that differ from the last reviewed version. Knowledge verification compares claims with evidence and applicability.

## Learning objectives

Distinguish hash-based change detection from semantic verification and choose the next review action from a check result.

## Prerequisites

Read [content fingerprints](../../../glossary/en/content-fingerprint.md) first. Here, a CLI is a tool run through terminal commands; a fixture is a set of test files prepared to establish test conditions.

## 101 · Understand the concept

### Facts confirmed from the implementation

Fieldbook compares a content fingerprint with its last reviewed fingerprint. Keeping the body and hash input fields unchanged while updating only verification metadata preserves the translation hash. `stale_after` identifies when to review again; passing that date does not declare the content false.[^checker]

## 201 · Apply the example

### Direct experiment

These observations come from the local experiment recorded on 2026-09-08. Changing Korean in isolated test files produced TRANSLATION_STALE; changing English independently produced CONTENT_DIVERGED. Replacing English with unrelated content and resetting the target fingerprint produced SYNCED.[^experiment]

Read this result as two questions. The check answers whether current inputs match the stored fingerprint. Establishing whether English conveys the Korean meaning requires reading both bodies. The experiment did not measure a hashing defect or a translation-quality score.

## 301 · Make a conditional judgment

### Engineering Recommendation

- Use automated checks to locate review candidates. Do not report SYNCED or exit 0 as completed technical verification.
- During Verify, when content remains correct, preserve the body and `generated`. Record inspected sources and scope instead of merely extending dates.
- Compare assumptions, recommendation strength, and exceptions before recording new translation fingerprints.
- Distinguish fixing one error from passing the whole Audit. Other findings can remain after the target error disappears.

These recommendations apply to this repository’s checker and observations. They are not general conclusions about other systems’ security or performance.

## Check your understanding

**Question:** Is translation review complete if you reset fingerprints to obtain SYNCED without reading the English body?

**Explanation:** Only the match between the fingerprint and current file has been checked. Read and compare both languages for claims, conditions, exceptions, and evidence separately.

## Evidence and Limits

The original experiment covered local files and CLI behavior. It did not measure model translation quality, external URL content changes, or production-service recovery. The review interval is 120 days, with re-review when the checker or policy changes. Record subsequent review in the [document change log](../../../log.md) and preserve historical experiment results.

## Related Knowledge

[Experiment record](../../../experiments/en/2026-09-08-fieldbook-audit.md) · [Maintenance checklist](../../../checklists/en/knowledge-maintenance.md) · [Audit failure response](../../../runbooks/en/fieldbook-audit-failure.md)

[^checker]: [Checker implementation](../../../skills/refresh-fieldbook/scripts/fieldbook.py)
[^experiment]: [Observed results from 11 cases](../../../experiments/evidence/2026-09-08-fieldbook-audit/result.json)

[한국어](../../ko/testing/verification-vs-change-detection.md)
