---
type: Concept
title: 'WebSocket과 SSE: 연결·재접속·복구 계약'
description: 'WebSocket과 SSE: 연결·재접속·복구 계약'
concept_id: frontend-websocket-sse
language: ko
status: stable
generated:
  by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: React·브라우저 API·라이브러리 변경과 예제 호환성을 재검토합니다.
sources:
- id: sse
  resource: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
  title: Using server-sent events
- id: ws
  resource: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
  title: WebSocket
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# WebSocket과 SSE: 연결·재접속·복구 계약

## 상황·학습 목표와 선수 지식

운영 화면에 새 상태를 전달할 때 통신 방식만 선택하면 끝나지 않습니다. 연결이 끊겼을 때 재시도와 데이터 복구를 분리해서 설명하는 것이 목표입니다. [실시간 상태 업데이트](realtime-state-updates.md), HTTP 요청·응답, React effect를 선수 지식으로 둡니다.

## 101 · 개념 이해

SSE(Server-Sent Events)는 HTTP 응답 스트림으로 서버에서 브라우저에 텍스트 이벤트를 보냅니다. EventSource는 기본 재접속을 제공하며 id와 재접속 시 Last-Event-ID를 사용할 수 있습니다. 서버의 보관·재전송 구현까지 자동 제공하지는 않습니다.[^sse] WebSocket은 양방향 메시지 교환에 적합하지만 브라우저 WebSocket API가 자동 재접속이나 수신 backpressure를 제공하지는 않습니다.[^ws]

| 조건 | 출발점 | 별도 설계 |
| --- | --- | --- |
| 수십 초 지연 허용, 낮은 빈도 | HTTP polling | 중복 요청·캐시·백오프 |
| 알림·상태를 서버에서 전달 | SSE, 명령은 HTTP | cursor·인증·proxy buffering |
| 협업 편집·양방향 빈번한 메시지 | WebSocket | 재접속·ack·흐름 제어 |

## 201 · React 예제에 적용하기

가정: 같은 출처의 SSE endpoint가 JSON 완전값을 보냅니다. seq는 재접속 후에도 같은 지표에서 계속 증가하며 클라이언트 필터 때문에 번호가 건너뛰어도 됩니다. SSE 기본 실행 경로는 `/api/metrics/events`입니다. WebSocket은 `<FeedPanel mode="ws" url="wss://your-host.example/metrics" />`처럼 실제 개발 서버 주소로 바꿉니다. 서버가 없으면 connecting/reconnecting 등 연결 상태만 표시됩니다.

SSE 응답은 `Content-Type: text/event-stream`이고 아래 프레임 뒤 빈 줄을 보내며 flush해야 합니다.

```text
id: 42
data: {"seq":42,"value":63}

```

이 예제는 이름 없는 message 이벤트를 사용합니다. `event: metric`을 추가한 서버라면 `addEventListener("metric", ...)`를 사용해야 합니다. 올바른 프레임은 마지막 값 63을 표시하고, 동일 seq는 무시하며, 잘못된 JSON은 invalid를 표시합니다.

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

## 301 · 조건에 따라 판단하기

WebSocket은 최초 연결 후 최대 다섯 번 재시도하며 지수 백오프와 jitter로 동시 접속을 분산합니다. 예제의 재시도 예산은 effect 수명 전체에 적용되고 onopen에서 초기화하지 않습니다. 실무에서는 일정 시간 정상 통신 후 예산을 회복하는 정책을 검토합니다. 4401·4403은 이 예제가 정한 애플리케이션 코드이며 표준 인증 코드는 아닙니다. SSE는 EventSource 자체 재접속만 사용하여 이중 연결을 만들지 않습니다.

실제 delta 복구는 `snapshot + cursor C → C 이후 재전송 → 중복 제거 → live` 순서로 계약합니다. cursor 보관 기한이 지났다면 reset 신호를 받고 새 snapshot으로 교체합니다. 삭제도 version을 가진 이벤트로 전달하고 서버 재시작은 epoch로 구분합니다. 이 예제는 완전값이므로 delta 복구·heartbeat·서버 구현을 포함하지 않습니다.

브라우저 기본 EventSource에는 임의 Authorization 헤더 설정 옵션이 없습니다. 같은 출처 cookie 또는 별도 인증 스트리밍 클라이언트를 검토하고 긴 수명의 토큰을 URL에 넣지 않습니다. 서버는 세션·tenant별 구독 권한을 검사하고 proxy buffering·idle timeout·heartbeat와 HTTP/1 연결 수 제한을 점검합니다.[^sse] WebSocket 송신은 bufferedAmount와 큐 상한, 수신은 집계·샘플링·서버 속도 제한을 설계합니다.[^ws] 큰 프레임은 코드가 거부하기 전에 이미 수신될 수 있으므로 서버 한도도 필요합니다.

## 이해 확인

질문: SSE가 재접속되면 유실 이벤트도 자동 복구됩니까? 해설: 아닙니다. 서버가 Last-Event-ID에 해당하는 이력을 보관하고 재전송해야 합니다. 질문: 언마운트 후에도 재접속 타이머가 남으면? 해설: 불필요한 연결이 생기므로 close와 타이머 취소, active 가드를 함께 사용합니다.

## 근거와 한계

공식 API 문서를 근거로 작성한 학습 예제입니다. 코드 검사 범위와 미검증 항목은 [학습 안내](index.md)에 기록합니다. 실제 운영 부하·서버 복구·보조 기술 호환성을 검증한 실험 기록이 아닙니다.

[학습 순서](index.md) · [English](../../en/frontend/websocket-sse.md)

## 출처

[^sse]: [Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
[^ws]: [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
