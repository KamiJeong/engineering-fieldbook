---
type: Concept
title: 'WebSocket and SSE: connection, retry, and recovery'
description: 'WebSocket and SSE: connection, retry, and recovery'
concept_id: frontend-websocket-sse
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
- id: sse
  resource: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
  title: Using server-sent events
- id: ws
  resource: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
  title: WebSocket
translation:
  source_language: ko
  source_concept_id: frontend-websocket-sse
  source_fingerprint: sha256:d74fd6d1c9e14f696b80a13fadcc14efcd819babd3447d07f1abdd2d64f6670a
  target_fingerprint: sha256:7b953c085d9b41e225b1d7d76875b7336613195721ddd835eacdd55a43d1a79a
  synced_at: '2026-09-14T02:23:23+00:00'
  review_status: SYNCED
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# WebSocket and SSE: connection, retry, and recovery

## Situation, goals, and prerequisites

Sending updates to an operations screen requires more than choosing a transport. Learn to separate connection retry from data recovery. Prerequisites are [real-time state updates](realtime-state-updates.md), HTTP requests and responses, and React effects.

## 101 · Understanding

SSE (Server-Sent Events) sends text events from server to browser over an HTTP response stream. EventSource offers reconnection and supports event IDs and Last-Event-ID on reconnect; server retention and replay still need implementation.[^sse] WebSocket supports bidirectional messaging, but the browser API provides neither automatic reconnection nor receive backpressure.[^ws]

| Condition | Starting point | Separate design |
| --- | --- | --- |
| Tens of seconds of delay acceptable, low frequency | HTTP polling | Duplicate requests, caching, backoff |
| Server notifications and status | SSE with HTTP commands | Cursor, authentication, proxy buffering |
| Frequent bidirectional collaboration | WebSocket | Reconnect, acknowledgments, flow control |

## 201 · Apply with React

Assume a same-origin SSE endpoint sends complete JSON values. Sequence numbers continue increasing for this metric across reconnects; client filtering may leave gaps. The default endpoint is `/api/metrics/events`. For WebSocket, use `<FeedPanel mode="ws" url="wss://your-host.example/metrics" />` with your development server URL. Without a server, only connection states such as connecting or reconnecting appear.

The SSE response needs `Content-Type: text/event-stream`, a blank line after this frame, and a flush.

```text
id: 42
data: {"seq":42,"value":63}

```

The example uses unnamed message events. If the server adds `event: metric`, use `addEventListener("metric", ...)`. A valid frame shows 63 as the last value; an equal sequence is ignored and malformed JSON shows invalid.

```tsx
import { useEffect, useState } from "react";
type Feed = { status: "connecting" | "open" | "reconnecting" | "closed" | "invalid";
  value: number | null; seq: number };
export function parseMetric(raw: unknown): { value: number; seq: number } | null {
  if (typeof raw !== "string" || raw.length > 4096) return null;
  try {
    const x: unknown = JSON.parse(raw);
    if (typeof x !== "object" || x === null || !("seq" in x) || !("value" in x)) return null;
    if (typeof x.seq !== "number" || !Number.isSafeInteger(x.seq) || x.seq < 0 ||
        typeof x.value !== "number" || !Number.isFinite(x.value)) return null;
    return { seq: x.seq, value: x.value };
  } catch { return null; }
}
export default function FeedPanel({ url = "/api/metrics/events", mode = "sse" }:
  { url?: string; mode?: "sse" | "ws" }) {
  const [feed, setFeed] = useState<Feed>({ status: "connecting", value: null, seq: -1 });
  useEffect(() => {
    let active = true;
    let socket: WebSocket | undefined;
    let events: EventSource | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let failures = 0;
    const status = (next: Feed["status"]) => {
      if (active) setFeed(old => ({ ...old, status: next }));
    };
    const receive = (raw: unknown) => {
      if (!active) return;
      const next = parseMetric(raw);
      if (!next) { status("invalid"); return; }
      setFeed(old => next.seq > old.seq ? { ...next, status: "open" } : old);
    };
    setFeed({ status: "connecting", value: null, seq: -1 });
    if (mode === "sse") {
      events = new EventSource(url);
      events.onopen = () => status("open");
      events.onmessage = event => receive(event.data);
      events.onerror = () => status(events?.readyState === EventSource.CLOSED
        ? "closed" : "reconnecting");
    } else {
      const connect = () => {
        if (!active) return;
        socket = new WebSocket(url);
        socket.onopen = () => status("open");
        socket.onmessage = event => receive(event.data);
        socket.onclose = event => {
          if (!active) return;
          // Application contract: 4401/4403 mean authentication/authorization failure.
          if ([1000, 4401, 4403].includes(event.code) || failures >= 5) {
            status("closed"); return;
          }
          const delay = Math.min(30000, 1000 * 2 ** failures++) * (0.5 + Math.random() * 0.5);
          status("reconnecting");
          retryTimer = setTimeout(connect, delay);
        };
        socket.onerror = () => status("reconnecting");
      };
      connect();
    }
    return () => {
      active = false;
      clearTimeout(retryTimer);
      events?.close();
      socket?.close();
    };
  }, [url, mode]);
  return <section aria-label="Metric feed">
    <p role="status">Connection: {feed.status}</p>
    <p>Last known value: {feed.value ?? "No data"}; sequence: {feed.seq}</p>
  </section>;
}
```

## 301 · Judgment under constraints

WebSocket retries at most five times after the initial connection. Exponential backoff and jitter spread reconnects. The budget spans the effect lifetime and does not reset on open; consider restoring it after sustained healthy traffic in production. Codes 4401 and 4403 are this example’s application contract, not standard authentication codes. SSE uses EventSource’s own reconnection to avoid duplicate connections.

For deltas, specify `snapshot + cursor C → replay after C → deduplicate → live`. An expired cursor requires a reset signal and replacement snapshot. Version deletions too, and distinguish server restarts with epochs. This complete-value example does not implement delta recovery, heartbeats, or a server.

Native EventSource has no arbitrary Authorization header option. Consider same-origin cookies or a separately authenticated streaming client; avoid long-lived URL tokens. Servers must authorize sessions and tenant subscriptions and check proxy buffering, idle timeouts, heartbeats, and HTTP/1 connection limits.[^sse] For WebSocket, design bounded send queues using bufferedAmount and receive aggregation, sampling, or server rate limits.[^ws] Frames may already be received before this code rejects them, so enforce server limits too.

## Check your understanding

Question: does SSE reconnection automatically restore missing data? Answer: only if the server retains and replays history for Last-Event-ID. Question: what if reconnect timers survive unmounting? Answer: they create unwanted connections; close the transport, cancel timers, and guard callbacks with active.

## Evidence and limits

These learning examples are grounded in official API documentation. See the [learning guide](index.md) for code checks and untested areas. They are not experiments validating production load, server recovery, or assistive technology compatibility.

[Reading order](index.md) · [한국어](../../ko/frontend/websocket-sse.md)

## Sources

[^sse]: [Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
[^ws]: [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
