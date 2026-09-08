---
type: Checklist
title: Knowledge authoring, refresh, and weekly review checklist
description: Completion criteria for preserving evidence, history, translation meaning,
  and discoverability during maintenance.
concept_id: knowledge-maintenance
language: en
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 90
  reason: Re-verify when repository policy or the checker changes.
sources:
- id: maintenance
  resource: ../../policies/maintenance.md
  title: Knowledge maintenance policy
stale_after: '2026-12-07T04:30:37+00:00'
translation:
  source_language: ko
  source_concept_id: knowledge-maintenance
  source_fingerprint: sha256:cca20cd8cbf4c4b95255ed33678c3e1a7cf6fceaf2ea0fff1a95af26002d2721
  target_fingerprint: sha256:ee546f52f71fdaea23cf535df84271cefdc7589110c1b4ccde34863c2df84e6f
  synced_at: '2026-09-08T04:30:37+00:00'
  review_status: SYNCED
---

# Knowledge maintenance checklist

## Purpose

Check the steps that are easy to miss during authoring, Verify/Refresh, and weekly review. Empty boxes make this a reusable checklist; they do not represent unfinished work in the current execution.

## When to Use

Use after document creation or a meaningful change, and every Tuesday. Weekly triage identifies review candidates; it does not change each document's review_days to seven. Once a month, examine unfinished translations, review time, and recurring findings to adjust the workload.

## Checks

- [ ] Search existing concept IDs, aliases, and glossary entries — editor / establish one owning location without duplication.
- [ ] Identify claim types and scope — editor / distinguish external facts, recommendations, experiments, and historical records.
- [ ] Inspect evidence — verifier / record the source actually read or execution evidence; leave inaccessible material unverified.
- [ ] Preserve Verify-only content — editor / no body or generated diff; update verification events and freshness only as needed.
- [ ] Preserve history — editor / retain ADR and experiment results; link new records for subsequent judgments.
- [ ] Compare translation meaning — reviewer / match assumptions, recommendation strength, exceptions, and sources before updating fingerprints; retain review flags for uncertainty.
- [ ] Check discovery — editor / connect both language indexes and related knowledge.
- [ ] Run automated Audit — editor / inspect exit codes and findings without confusing them with external verification.
- [ ] Record reasons — editor / log meaningful changes and verification events.
- [ ] Review Git changes — editor / inspect diffs, secrets, and unintended files before committing.

## Completion Criteria

The scope and evidence must be traceable, and translation state must be reported honestly. Record each unresolved item with its target, reason, and next action. Changing dates or hashes merely to suppress warnings does not count as completion. Use the [runbook](../../runbooks/en/fieldbook-audit-failure.md) to classify failures.

## Evidence

Observations from this execution are in the [experiment record](../../experiments/en/2026-09-08-fieldbook-audit.md) and root log. This checklist defines the method; individual results are recorded separately. The [concept entry](../../knowledge/en/testing/verification-vs-change-detection.md) explains why automated checks and semantic verification are separate.[^maintenance]

[^maintenance]: [Authoring, verification, source, and log policy](../../policies/maintenance.md)

[한국어](../ko/knowledge-maintenance.md)
