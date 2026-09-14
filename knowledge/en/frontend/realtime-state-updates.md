---
type: Concept
title: 'Real-time state updates: ingestion and publication'
description: 'Real-time state updates: ingestion and publication'
concept_id: frontend-realtime-state-updates
language: en
status: stable
generated:
  by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: Review React, browser APIs, libraries, and example compatibility.
sources:
- id: store
  resource: https://react.dev/reference/react/useSyncExternalStore
  title: useSyncExternalStore
translation:
  source_language: ko
  source_concept_id: frontend-realtime-state-updates
  source_fingerprint: sha256:bde1c255a826a86128a91a4cbe1e3c1d98cfaf855b5b5b234fd8e1e81444726f
  target_fingerprint: sha256:037077c97e0c896eaf96a742a69023f23e20eab96aa2eb9a865c980f56ebf92f
  synced_at: '2026-09-14T02:23:23+00:00'
  review_status: SYNCED
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Real-time state updates: ingestion and publication

## Situation, goals, and prerequisites

Updating an entire screen for hundreds of metric events per second can slow input and scrolling. Learn to separate ingestion, storage, and publication. Start with [complex state models](complex-state-models.md) and effect setup and cleanup.

## 101 · Understanding

Real-time does not mean zero delay. Current CPU values can discard intermediate samples; outage and recovery history cannot. Coalescing keeps the latest display value. Unlike [backpressure](../../../glossary/en/backpressure.md), it deliberately discards intermediate display values rather than matching production to consumption.

With `useSyncExternalStore`, keep the snapshot reference stable until a change, then replace it with an immutable value. Subscription returns cleanup.[^store]

## 201 · Apply with React

Assume one metric, complete values rather than deltas, and increasing sequence numbers in a session. A mock produces roughly every 5ms and a 100ms window publishes its latest sample. Browser timers do not guarantee exact 200Hz or 10Hz. Run this as `App.tsx`; sequence numbers should skip steps as CPU changes.

```tsx
import { useEffect, useState, useSyncExternalStore } from "react";
type Reading = Readonly<{ seq: number; value: number }>;
export function createLatestStore() {
  let snapshot: Reading = { seq: -1, value: 0 };
  let pending = snapshot;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    ingest(next: Reading) {
      if (!Number.isSafeInteger(next.seq) || next.seq < 0 ||
          !Number.isFinite(next.value) || next.seq <= pending.seq) return;
      pending = { ...next };
      if (timer !== undefined) return;
      timer = setTimeout(() => {
        timer = undefined;
        snapshot = pending;
        listeners.forEach(listener => listener());
      }, 100);
    },
    dispose() {
      clearTimeout(timer);
      timer = undefined;
      pending = snapshot;
    },
  };
}
export default function LatestMetric() {
  const [store] = useState(createLatestStore);
  const reading = useSyncExternalStore(store.subscribe, store.getSnapshot);
  useEffect(() => {
    let seq = store.getSnapshot().seq + 1;
    const producer = setInterval(() => store.ingest({ seq: seq++, value: seq % 100 }), 5);
    return () => { clearInterval(producer); store.dispose(); };
  }, [store]);
  return <p>CPU: {reading.value}% (sequence {reading.seq})</p>;
}
```

## 301 · Judgment under constraints

Only pending and published samples are retained, so memory does not grow with sample count. Multiple IDs require an allowed ID set, deletion, TTL, and a maximum count. Preserve history elsewhere and give charts bounded time windows.

A jump from sequence 12 to 15 is acceptable for complete values, but deltas require recovering 13 and 14. A sequence reset on reconnect needs an epoch or new store. A server cursor contract must cover the gap between snapshot retrieval and stream startup. Continue with [WebSocket/SSE](websocket-sse.md).

This is browser-only. SSR requires a store per request and matching server and hydration `getServerSnapshot` values.[^store] Whole-snapshot subscriptions update all consumers; consider subscriptions by ID or selectors for large screens. Measure received events, publications, React commit duration, last reception, and lag after returning from a background tab separately.

## Check your understanding

Question: can payment events be coalesced? Answer: transaction history needs durable storage, replay, and deduplication. Question: why avoid a new object on each getSnapshot call? Answer: it may appear changed without an update; cache the reference.

## Evidence and limits

These learning examples are grounded in official API documentation. See the [learning guide](index.md) for code checks and untested areas. They are not experiments validating production load, server recovery, or assistive technology compatibility.

[Reading order](index.md) · [한국어](../../ko/frontend/realtime-state-updates.md)

## Sources

[^store]: [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)
