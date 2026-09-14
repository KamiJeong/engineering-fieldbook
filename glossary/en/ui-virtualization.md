---
type: Glossary Term
title: 'UI virtualization: render the visible range'
description: 'UI virtualization: render the visible range'
concept_id: ui-virtualization
language: en
status: stable
generated:
  by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: Review related browser APIs and example links.
sources:
- id: source
  resource: https://tanstack.com/virtual/latest/docs/api/virtualizer
  title: API reference
translation:
  source_language: ko
  source_concept_id: ui-virtualization
  source_fingerprint: sha256:5cae3b7d2d3f837c09b210fb335f41246745eed7133d0030477b16b7bf70cfc2
  target_fingerprint: sha256:96bfb71ba2114742abd38afc7c77a678223bcd1556a6aa5adb00ec042f532feb
  synced_at: '2026-09-14T02:23:23+00:00'
  review_status: SYNCED
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# UI virtualization: render the visible range

Also called windowing, UI virtualization mounts DOM only for items around the viewport while retaining space for the rest of a scrollable list. For example, mount dozens of nearby rows out of 50,000. Unlike pagination, it does not automatically reduce fetched data or full-data sorting work.[^source]

[React example](../../knowledge/en/frontend/virtualized-table.md) · [Glossary](index.md)

[^source]: [API reference](https://tanstack.com/virtual/latest/docs/api/virtualizer)
