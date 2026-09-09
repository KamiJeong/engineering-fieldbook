---
type: Experiment
title: Fieldbook audit change-detection and recovery experiment
description: Observes detection, verification separation, recovery, and read-only behavior using isolated file mutations.
concept_id: experiment-2026-09-08-fieldbook-audit
language: en
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
freshness:
  mode: historical
sources:
- id: result
  resource: ../evidence/2026-09-08-fieldbook-audit/result.json
  title: Original execution evidence
- id: reproducer
  resource: ../evidence/2026-09-08-fieldbook-audit/reproduce.py
  title: Reproducer
translation:
  source_language: ko
  source_concept_id: experiment-2026-09-08-fieldbook-audit
  source_fingerprint: sha256:a380e8bc6f721e3cf8a310dc9533d7d3225c7212db115ecdc52c50257dc0d668
  target_fingerprint: sha256:004c2029e15c6037a2965d1d98dbfcb96a49fdd3f950182284998cbbb746d6d1
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Experiment: Fieldbook audit change detection and recovery

## Goal

Run the current maintenance checker to establish its behavior and limits. This is a local experiment performed by an agent in this session, not an account of the owner's prior work experience.

## Hypothesis

Verification-only metadata updates preserve translation state. Independent body changes, missing translations, and malformed metadata are detected. Checks do not modify their target files. Resetting hashes cannot guarantee semantic equivalence.

## Environment

- Execution: `2026-09-08T04:24:48+00:00`; Linux x86_64, Python 3.12.3, PyYAML 6.0.1.
- Repository baseline: `8fa8472ebab16911dffaee8a5037bde84094ab3c`.
- Input: the baseline OIDC pair. The result JSON records SHA-256 hashes of the tool, reproducer, and input files.
- Network behavior, cloud regions, and production services are outside the scope.

## Method

The [reproducer](../evidence/2026-09-08-fieldbook-audit/reproduce.py) copies the repository into a temporary directory and creates an independent copy per case. It excludes `.git`, `.venv`, `__pycache__`, and evidence. File hashes are compared before and after each CLI invocation. Cases alter verification metadata, either language, file presence, YAML, a link, the freshness boundary, or the root argument. Link recovery restores the fixture's original bytes and runs the check again.

```bash
rtk proxy python3 experiments/evidence/2026-09-08-fieldbook-audit/reproduce.py
```

Running against the current checkout is a new execution. To reproduce the original observation, use a separate checkout at the baseline commit, copy this record's `reproduce.py` into the same relative location, and run it there. Compare the Python/PyYAML versions and the tool/input hashes in the JSON. Save new output to stdout or a separate file; preserve the existing result.json.

## Result

All 11 cases matched the hypothesized observations. Exit codes 1 and 2 are expected results of injected faults, not failures of the experiment itself. Every check preserved its target's file hashes.[^result]

| Case | Observed exit | Expected observation |
| --- | --- | --- |
| baseline | 0 | SYNCED |
| verification-only | 0 | SYNCED |
| korean-change | 1 | TRANSLATION_STALE |
| english-change | 1 | CONTENT_DIVERGED |
| missing-translation | 1 | MISSING_TRANSLATION |
| invalid-metadata | 1 | PARSE_ERROR |
| broken-link | 1 | BROKEN_LINK |
| stale-boundary | 1 | STALE |
| invalid-root | 2 | CLI input error |
| repair-local-link | 1 | BROKEN_LINK |
| hash-is-not-semantic-review | 0 | SYNCED |

`verification-only` preserved the body and generated metadata. `repair-local-link` went from BROKEN_LINK/exit 1 to exit 0 after restoring the original bytes. The unrelated English body with a reset hash reported SYNCED.

## Problems

The checker does not evaluate technical meaning. No checker crash or failed test assertion occurred in this execution. This experiment does not replace full Audit or external-source review. Partial checks also include documents added to the current checkout. Since evidence is excluded, later documents linking to evidence can produce additional warnings. `passed` means the explicit case conditions hold, not that every warning is absent.

## Lesson

Hash agreement, verification recency, and semantic agreement are different signals. See the [change-detection concept](../../knowledge/en/testing/verification-vs-change-detection.md) and [Audit response runbook](../../runbooks/en/fieldbook-audit-failure.md).

## Next Experiment

When refreshing a real technical entry, measure the time required to compare changed sources and for a human to review translation meaning. That measurement was not performed here.

[^result]: [Original execution evidence](../evidence/2026-09-08-fieldbook-audit/result.json)

[한국어](../ko/2026-09-08-fieldbook-audit.md)
