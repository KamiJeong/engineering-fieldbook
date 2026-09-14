---
type: Glossary Term
title: 'Backpressure: matching production and consumption'
description: 'Backpressure: matching production and consumption'
concept_id: backpressure
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
  resource: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
  title: API reference
translation:
  source_language: ko
  source_concept_id: backpressure
  source_fingerprint: sha256:82b92d6fd7b8bff9008242acce1bfbf085672412c7ddc099ea7f6727a64d67b9
  target_fingerprint: sha256:32e15ff2244444d67e4282bd3b41612670cfce5eba0b365c9db4213618a8c68e
  synced_at: '2026-09-14T02:23:23+00:00'
  review_status: SYNCED
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Backpressure: matching production and consumption

A mechanism for making a producer send only what the consumer can handle. For example, slow production or stop requesting input when a queue reaches its limit. Coalescing CPU values discards intermediate display values; it is not itself backpressure on the producer. The browser WebSocket API does not provide receive backpressure.[^source]

[React example](../../knowledge/en/frontend/realtime-state-updates.md) · [Glossary](index.md)

[^source]: [API reference](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
