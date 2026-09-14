---
type: Concept
title: '실시간 상태 업데이트: 수신과 화면 반영 분리'
description: '실시간 상태 업데이트: 수신과 화면 반영 분리'
concept_id: frontend-realtime-state-updates
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
- id: store
  resource: https://react.dev/reference/react/useSyncExternalStore
  title: useSyncExternalStore
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# 실시간 상태 업데이트: 수신과 화면 반영 분리

## 상황·학습 목표와 선수 지식

초당 수백 건의 메트릭마다 화면 전체를 갱신하면 입력과 스크롤이 느려질 수 있습니다. 수신·저장·화면 반영 주기를 구분하는 것이 목표입니다. [복잡한 상태 모델](complex-state-models.md)과 effect의 설치·정리를 먼저 이해합니다.

## 101 · 개념 이해

실시간은 지연 0을 의미하지 않습니다. CPU 현재값은 최신 값만 필요하지만 장애 발생·복구 이력은 중간 이벤트를 버리면 안 됩니다. 여러 값을 최신 하나로 합치는 coalescing은 전자에 적용합니다. 생산량을 소비량에 맞추는 [backpressure](../../../glossary/ko/backpressure.md)와 달리 여기서는 표시할 중간 값을 의도적으로 버립니다.

외부 store에 `useSyncExternalStore`로 연결할 때 snapshot은 변경 전까지 같은 참조를 반환하고 변경 시 불변 값으로 교체합니다. subscribe는 구독 해제 함수를 반환합니다.[^store]

## 201 · React 예제에 적용하기

가정: 단일 지표 메시지는 delta가 아닌 완전한 현재값이며 seq는 같은 세션에서 증가합니다. mock은 약 5ms마다 값을 만들고 store는 100ms 창에서 최신 하나를 공개합니다. 브라우저 타이머 지연 때문에 정확한 200Hz·10Hz를 보장하지 않습니다. 아래 `App.tsx`에서 sequence가 여러 단계씩 건너뛰며 CPU가 변하는 것이 기대 결과입니다.

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

## 301 · 조건에 따라 판단하기

pending과 snapshot만 보관하므로 샘플 수에 따라 메모리가 증가하지 않습니다. 여러 ID로 확장하면 허용 ID 집합·삭제·TTL·최대 개수가 필요합니다. 이력은 별도 저장소에서 보존하고 차트에는 제한된 시간 창을 제공합니다.

seq가 12 다음 15여도 완전한 값이면 표시할 수 있지만 delta라면 13·14 누락을 복구해야 합니다. 재접속에서 seq가 초기화되면 epoch 또는 새 store가 필요합니다. snapshot 조회와 스트림 시작 사이 유실은 서버 cursor 계약으로 해결합니다. [WebSocket/SSE](websocket-sse.md)로 이어집니다.

브라우저 전용 예제입니다. SSR은 요청별 store와 서버·hydration 시점에 일치하는 `getServerSnapshot`이 필요합니다.[^store] 전체 snapshot 구독은 소비자를 모두 갱신하므로 대형 화면에는 ID별 구독이나 selector를 검토합니다. 수신 건수·공개 건수·React commit 시간·마지막 수신 시각·백그라운드 복귀 후 지연을 따로 측정합니다.

## 이해 확인

질문: 결제 이벤트도 최신 하나로 합쳐도 됩니까? 해설: 거래 이력에는 영속 저장·재전송·중복 제거가 필요합니다. 질문: 매번 getSnapshot에서 새 객체를 만들면 왜 문제입니까? 해설: 변경이 없어도 다른 snapshot으로 보일 수 있어 참조를 캐시해야 합니다.

## 근거와 한계

공식 API 문서를 근거로 작성한 학습 예제입니다. 코드 검사 범위와 미검증 항목은 [학습 안내](index.md)에 기록합니다. 실제 운영 부하·서버 복구·보조 기술 호환성을 검증한 실험 기록이 아닙니다.

[학습 순서](index.md) · [English](../../en/frontend/realtime-state-updates.md)

## 출처

[^store]: [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)
