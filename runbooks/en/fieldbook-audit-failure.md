---
type: Runbook
title: Responding to Fieldbook audit failures
description: A procedure for classifying local Fieldbook check failures, repairing their causes, and validating
  recovery.
concept_id: fieldbook-audit-failure
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
  review_days: 90
  reason: Re-verify when repository policy or the checker changes.
sources:
- id: result
  resource: ../../experiments/evidence/2026-09-08-fieldbook-audit/result.json
  title: Local fault injection results
- id: checker
  resource: ../../skills/refresh-fieldbook/scripts/fieldbook.py
  title: CLI implementation
stale_after: '2026-12-07T04:33:59+00:00'
translation:
  source_language: ko
  source_concept_id: fieldbook-audit-failure
  source_fingerprint: sha256:fad281eb0f06b11290f0f748c37dd10ac7e119e4353c9a389721215291913fdd
  target_fingerprint: sha256:e2b42100be929925f97345a6d92c70639b2e910c530a136874187311f2fd45ca
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# Runbook: Responding to Fieldbook audit failures

## Trigger and Symptoms

A CLI check returns exit 1/2 during authoring, Refresh, or weekly review, or a traceback prevents a normal report. Exit 0 with EXTERNAL_UNCHECKED still requires external review.

## Scope and Environment

The scope is this repository's local files and Python checker, not API, AWS, or database incident response. The verified environment is Linux x86_64, Python 3.12.3, and PyYAML 6.0.1.

## Owner and Escalation

The current document editor owns the response. Bring source conflicts, ambiguous English meaning, or historical corrections to the repository owner with the affected document and evidence. No pager or external service owner is assumed.

## Prerequisites and Access

Run from the repository root with Python, PyYAML, and local read access. Check Git status and identify your edits before changing files. In environments without RTK, run the same Python command without `rtk proxy`.

## Diagnosis

```bash
rtk git status --short
rtk proxy python3 skills/refresh-fieldbook/scripts/fieldbook.py audit --json
```

- Exit 2: inspect stderr for an invalid root, argument, or timestamp. Follow the installation guidance if PyYAML is missing. Dependency recovery was not injected or verified in this experiment.
- Exit 1: use the reported code and path with the table below.
- Traceback or missing JSON: do not treat it as a normal Audit. Preserve stderr and the Python/PyYAML versions and investigate the checker.

## Mitigation and Recovery

| Signal | Action |
| --- | --- |
| PARSE_ERROR / OKF_TYPE | Fix duplicate YAML keys, delimiters, or the required type in the affected document; run validate |
| BROKEN_LINK | Check whether the target moved and correct the relative link. For unwritten knowledge, point to a valid scope index |
| MISSING_TRANSLATION | Inspect the source and write the corresponding English entry, or record the unfinished item |
| TRANSLATION_STALE / CONTENT_DIVERGED | Compare claims, assumptions, and exceptions in both languages; update fingerprints only after semantic review |
| STALE / UNVERIFIED | Perform Verify against authoritative sources or local evidence; do not merely extend the TTL |

## Rollback and Stop Conditions

Stop automatic restoration if your edits are mixed with someone else's work. In the real repository, inspect the diff and repair only your incorrect hunk. Do not use bulk reset/restore or file deletion as the default recovery method.

Restoring original bytes in the experiment was limited to disposable fixtures. Do not rewrite historical results or ADRs to match current facts. If evidence is unavailable, explicitly report the unresolved state.

## Validation

Run the relevant subcheck and then the full Audit. Check both whether the target code disappeared and whether other findings remain. Run the existing unittest suite if the checker changed. Finish external-link and semantic review separately.

## Last Operational Verification

At `2026-09-08T04:24:48+00:00`, an agent injected an invalid root, YAML, translation, link, and freshness mutations into local CLI fixtures. Repairing the broken fixture link returned exit 0.[^result] Stable status is limited to this local scope; it does not claim verification of cloud-service recovery or dependency reinstallation. See the [experiment record](../../experiments/en/2026-09-08-fieldbook-audit.md) for the raw results and limits.

## Follow-up

Record meaningful corrections and verification in log with the target, reason, scope, and translation outcome. Re-verify when the procedure or checker changes; start with a 90-day review period.

[^result]: [Local fault-injection and recovery results](../../experiments/evidence/2026-09-08-fieldbook-audit/result.json)

[한국어](../ko/fieldbook-audit-failure.md)
