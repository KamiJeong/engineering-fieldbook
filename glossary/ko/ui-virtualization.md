---
type: Glossary Term
title: 'UI virtualization: 보이는 범위만 렌더링'
description: 'UI virtualization: 보이는 범위만 렌더링'
concept_id: ui-virtualization
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
  resource: https://tanstack.com/virtual/latest/docs/api/virtualizer
  title: API reference
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# UI virtualization: 보이는 범위만 렌더링

전체 목록 중 현재 뷰포트 주변 항목만 DOM으로 만드는 방식이며 windowing이라고도 합니다. 나머지 구간의 공간은 유지하여 긴 목록을 스크롤하게 합니다. 예를 들어 5만 행 중 주변 수십 행만 탑재합니다. 페이지네이션과 달리 이미 가져온 데이터 수나 전체 정렬 비용은 자동으로 줄지 않습니다.[^source]

[React 상세 예제](../../knowledge/ko/frontend/virtualized-table.md) · [Glossary](index.md)

[^source]: [API reference](https://tanstack.com/virtual/latest/docs/api/virtualizer)
