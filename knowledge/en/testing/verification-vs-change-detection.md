---
type: Concept
title: Separating change detection from knowledge verification
description: Uses a Fieldbook experiment to distinguish fingerprints, freshness, and
  semantic verification.
concept_id: verification-vs-change-detection
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
  resource: ../../../skills/refresh-fieldbook/scripts/fieldbook.py
  title: Checker implementation
- id: experiment
  resource: ../../../experiments/evidence/2026-09-08-fieldbook-audit/result.json
  title: Observed experiment results
stale_after: '2027-01-06T04:33:59+00:00'
translation:
  source_language: ko
  source_concept_id: verification-vs-change-detection
  source_fingerprint: sha256:88ec84200e1b0ccbb8b06f942ca4ae38cf67fed1ed28c902dfee44c76f6cb075
  target_fingerprint: sha256:f29049045002b6b3c859815dc6880219ef292bae909151ca7a9bda4e7087973e
  synced_at: '2026-09-08T04:30:37+00:00'
  review_status: SYNCED
---

# Separating change detection from knowledge verification

## Summary

Change detection identifies inputs that differ from a reviewed version. Knowledge verification checks whether a claim agrees with its evidence and applicability. Using the same completion criterion for both can make outdated facts or incorrect translations appear valid.

## Facts confirmed from the implementation

Fieldbook uses a [content fingerprint](../../../glossary/en/content-fingerprint.md) to detect differences from the last reviewed version. Updating verification metadata without changing the body preserves the translation hash. `stale_after` identifies when review is due; it does not declare the content false.[^checker]

## Direct experiment

In isolated fixtures, a Korean edit produced TRANSLATION_STALE and an independent English edit produced CONTENT_DIVERGED. Replacing the English body with unrelated content and resetting its target fingerprint produced SYNCED. This observation demonstrates the need for separate semantic review; it is not evidence of a hashing defect.[^experiment]

## Engineering Recommendation

- Use automated checks to find review candidates. Do not report SYNCED or exit 0 as completed technical verification.
- Preserve the body and generated metadata during Verify-only work. Record the evidence and scope instead of merely extending dates.
- Compare conditions, recommendation strength, and exceptions before recording new translation fingerprints.
- Distinguish fixing the target problem from passing the full Audit. Other problems can remain after one repair.

These recommendations apply to this repository's checker and observed behavior. They make no broader claims about other systems' security or performance.

## Evidence and Limits

The experiment covered local files and CLI behavior. It did not measure model translation quality, changes to external source content, or recovery of a production service. Begin with a 120-day review period and re-review when the checker or policy changes.

## Related Knowledge

[Experiment record](../../../experiments/en/2026-09-08-fieldbook-audit.md) · [Maintenance checklist](../../../checklists/en/knowledge-maintenance.md) · [Audit failure response](../../../runbooks/en/fieldbook-audit-failure.md)

[^checker]: [Checker implementation](../../../skills/refresh-fieldbook/scripts/fieldbook.py)
[^experiment]: [Observed results from 11 cases](../../../experiments/evidence/2026-09-08-fieldbook-audit/result.json)

[한국어](../../ko/testing/verification-vs-change-detection.md)
