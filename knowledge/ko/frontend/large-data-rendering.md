---
type: Concept
title: '대량 데이터 렌더링: 전송·계산·DOM 병목 분리'
description: '대량 데이터 렌더링: 전송·계산·DOM 병목 분리'
concept_id: frontend-large-data-rendering
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
- id: deferred
  resource: https://react.dev/reference/react/useDeferredValue
  title: useDeferredValue
- id: virtual
  resource: https://tanstack.com/virtual/latest/docs/api/virtualizer
  title: Virtualizer
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# 대량 데이터 렌더링: 전송·계산·DOM 병목 분리

## 상황·학습 목표와 선수 지식

5만 행을 검색할 때 느리다는 증상만으로 가상화를 선택하면 원인을 놓칠 수 있습니다. 네트워크·JSON 파싱·계산·React render·DOM layout 중 병목을 구분하는 것이 목표입니다. [상태 모델](complex-state-models.md)과 배열 filter·map을 알고 있다고 가정합니다.

## 101 · 개념 이해

페이지네이션은 한 번에 가져오는 데이터 범위를 줄이고, 가상화는 현재 화면 주변 DOM만 만듭니다. 따라서 가상화만으로 다운로드 크기나 전체 정렬 비용은 줄지 않습니다.[^virtual] 메모이제이션은 입력이 같을 때 계산을 재사용하며 입력이 매번 바뀌는 작업의 비용은 남습니다.

`useDeferredValue`는 덜 급한 결과의 갱신을 뒤로 미뤄 입력 반응을 우선할 수 있게 합니다. 고정 시간 debounce도 아니고 Worker도 아니며 네트워크 요청 수를 줄여 주지도 않습니다.[^deferred]

## 201 · React 예제에 적용하기

가정: 5만 개의 짧은 이름이 이미 메모리에 있고 앞 100개만 표시해도 되는 로컬 검색입니다. 이 숫자는 설계용 fixture이며 성능 측정 결과가 아닙니다. App.tsx에서 빠르게 입력하면 입력값은 즉시 바뀌고 결과가 따라오는 동안 Updating results를 표시할 수 있습니다. 빠른 기기에서는 이 표시를 거의 보지 못할 수 있습니다.

```tsx
import { memo, useDeferredValue, useMemo, useState } from "react";
type Row = { id: string; name: string };
const rows: Row[] = Array.from({ length: 50000 }, (_, i) => ({ id: String(i), name: `device-${i}` }));
const Results = memo(function Results({ query }: { query: string }) {
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter(row => row.name.toLowerCase().includes(normalized));
  }, [query]);
  return <>
    <p>{matches.length} matches; first 100 shown</p>
    <ul>{matches.slice(0, 100).map(row => <li key={row.id}>{row.name}</li>)}</ul>
  </>;
});
export default function SearchDemo() {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  return <section aria-label="Device search">
    <label>Search <input value={query} onChange={event => setQuery(event.target.value)} /></label>
    <p role="status">{query !== deferred ? "Updating results…" : "Results up to date"}</p>
    <div aria-busy={query !== deferred}><Results query={deferred} /></div>
  </section>;
}
```

## 301 · 조건에 따라 판단하기

`memo(Results)`는 긴급한 입력 렌더 때 같은 deferred query를 받은 결과 영역의 렌더를 건너뛸 수 있게 합니다. useMemo만 부모에 두고 매 키 입력마다 큰 filter를 실행하면 같은 효과를 기대하기 어렵습니다. 그러나 이 코드의 동기 filter 자체는 실행 도중 중단되지 않습니다. 계산이 긴 작업이면 Worker로 옮기거나 서버에서 필터·정렬합니다.

서버 검색은 `query + sort + tenant + cursor`를 캐시 키로 두고 정렬에 ID 같은 tie-breaker를 추가합니다. 필터가 바뀌면 cursor를 초기화하고 이전 요청은 AbortController로 취소하면서 요청 ID도 비교해 오래된 응답을 무시합니다. 취소만으로 서버 작업이 취소되었다고 보장할 수 없습니다. 전체 결과 수를 모르면 모른다고 표시하고 현재 페이지를 전체 결과처럼 정렬하지 않습니다.

10만 행 전체를 내려받기 전에 응답 바이트·파싱 시간·heap 증가를 확인합니다. 가상화 전후에는 같은 데이터·기기·빌드로 DOM 수·long task·입력 지연·스크롤 중 commit 시간을 비교합니다. [가상 테이블](virtualized-table.md)은 100개 제한 대신 전체 로컬 결과를 스크롤하는 다음 단계입니다.

## 이해 확인

질문: DOM이 30행인데 검색이 느리면 무엇을 봅니까? 해설: 전체 데이터 filter·sort, JSON 파싱, 파생 값 계산을 프로파일링합니다. 질문: useDeferredValue가 서버 검색 요청도 줄입니까? 해설: 아니므로 debounce·캐시·요청 취소를 별도로 설계합니다.

## 근거와 한계

공식 API 문서를 근거로 작성한 학습 예제입니다. 코드 검사 범위와 미검증 항목은 [학습 안내](index.md)에 기록합니다. 실제 운영 부하·서버 복구·보조 기술 호환성을 검증한 실험 기록이 아닙니다.

[학습 순서](index.md) · [English](../../en/frontend/large-data-rendering.md)

## 출처

[^deferred]: [useDeferredValue](https://react.dev/reference/react/useDeferredValue)
[^virtual]: [Virtualizer](https://tanstack.com/virtual/latest/docs/api/virtualizer)
