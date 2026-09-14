---
type: Glossary Term
title: 'Backpressure: 생산 속도와 소비 속도 조절'
description: 'Backpressure: 생산 속도와 소비 속도 조절'
concept_id: backpressure
language: ko
status: stable
generated:
  by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: 관련 브라우저 API와 예제 연결을 재검토합니다.
sources:
- id: source
  resource: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
  title: API reference
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Backpressure: 생산 속도와 소비 속도 조절

소비자가 처리할 수 있는 만큼 생산자가 보내도록 제어하는 방식입니다. 예를 들어 처리 대기 큐가 상한에 닿으면 생산을 늦추거나 추가 수신을 요청하지 않습니다. 최신 CPU 값 하나만 남기는 coalescing은 표시 중간값을 버리는 전략이며 생산 속도를 제어하는 backpressure 자체는 아닙니다. 브라우저 WebSocket API는 수신 backpressure를 제공하지 않습니다.[^source]

[React 상세 예제](../../knowledge/ko/frontend/realtime-state-updates.md) · [Glossary](index.md)

[^source]: [API reference](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
