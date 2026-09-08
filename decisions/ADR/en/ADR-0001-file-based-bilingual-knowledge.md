---
type: Decision
title: 'ADR-0001: File-based bilingual knowledge architecture'
description: The initial decision for storing, navigating, translating, and maintaining
  the personal Fieldbook.
concept_id: adr-0001-file-based-bilingual-knowledge
language: en
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
freshness:
  mode: historical
sources:
- id: architecture
  resource: ../../../policies/architecture.md
  title: Initial architecture
- id: metadata
  resource: ../../../policies/metadata.md
  title: Metadata contract
translation:
  source_language: ko
  source_concept_id: adr-0001-file-based-bilingual-knowledge
  source_fingerprint: sha256:343c624094bf4c84bc4df43ea34d27710a9046ae953816856ab83af2d4a41d7d
  target_fingerprint: sha256:16d8b62e0ee6eee902d6bacdbd81d8abbb3a45f564da3156d4ce613d5033bcb7
  synced_at: '2026-09-08T04:30:37+00:00'
  review_status: SYNCED
---

# ADR-0001: File-based bilingual knowledge architecture

## Status

Accepted — 2026-09-08. An agent records the decision implemented under the owner's request to build the foundation and proceed with the next steps. This is not a claim of separate human verification of the document.

## Context

The owner needs a long-lived personal engineering knowledge system. Korean is the authoring language, with English expressing the same knowledge. Concepts, experiments, historical decisions, and operational procedures need distinct purposes and progressive discovery. The initial scope excludes web applications and search servers.[^architecture]

The initial implementation baseline is Git commit `8fa8472ebab16911dffaee8a5037bde84094ab3c`.

## Decision

1. Start with Markdown and Git; apply OKF v0.2 to the knowledge payload. Document the boundary between the standard and skill tooling in the metadata policy.[^metadata]
2. Organize knowledge by durable domains rather than products. Keep ADRs, experiments, failures, lessons, checklists, runbooks, and glossary entries in scopes that reflect their purposes.
3. Treat Korean as the source and English as its translation, sharing a stable ID and corresponding path. Distinguish the path-based OKF ID from the repository's `concept_id`.
4. Navigate through indexes. Automated checks identify candidates; evidence guides verification and updates.
5. Preserve historical records and review current knowledge according to its rate of change. Begin with one checker and shared policies.

## Alternatives

| Alternative | Reason for not choosing it |
| --- | --- |
| Two languages in one file | Convenient for short entries, but longer documents may become harder to read and review by language |
| Product-based top-level folders | Product replacement and overlapping domains introduce reclassification work |
| Duplicate technical content by document type | Creates multiple owners and sources for the same knowledge |
| Start with a web app, database, or translation service | Adds components to operate before the initial knowledge volume justifies them |

These comparisons reflect this repository's constraints, not a universal ranking.

## Consequences

The structure is readable in GitHub and text tools. Indexes, links, and English pairs require ongoing maintenance. Hash-based detection does not replace semantic review. Because policies and tooling coexist, distributing a pure OKF bundle requires selecting the payload.

If search or translation maintenance becomes a demonstrated problem, record the evidence in a new ADR. Preserve this record's Context and Decision and supersede it through a successor.

## References

[^architecture]: [Initial architecture and self-review](../../../policies/architecture.md)
[^metadata]: [OKF and repository extension contract](../../../policies/metadata.md)

[한국어](../ko/ADR-0001-file-based-bilingual-knowledge.md)
