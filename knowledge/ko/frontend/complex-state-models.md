---
type: Concept
title: '복잡한 상태 모델: 소유권과 전이'
description: '복잡한 상태 모델: 소유권과 전이'
concept_id: frontend-complex-state-models
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
- id: structure
  resource: https://react.dev/learn/choosing-the-state-structure
  title: Choosing the State Structure
- id: reducer
  resource: https://react.dev/reference/react/useReducer
  title: useReducer
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# 복잡한 상태 모델: 소유권과 전이

## 상황·학습 목표와 선수 지식

선택한 장비와 편집창, 저장 중 표시가 서로 어긋나는 상황을 다룹니다. 학습 목표는 데이터 소유권을 정하고 불가능한 상태 조합을 없애는 것입니다. JavaScript 객체·TypeScript union·React state와 이벤트 처리를 안다고 가정합니다. [학습 안내](index.md)에서 전체 흐름을 확인합니다.

## 101 · 개념 이해

서버 상태는 서버가 권위 있는 장비 정보이며, UI 상태는 선택·열린 패널·입력 초안입니다. URL 상태는 공유할 필터·시간 범위입니다. 선택한 장비 객체를 다시 저장하면 원본 갱신 때 복사본이 낡으므로 ID만 저장하고 원본에서 찾습니다. 중복·파생 상태를 줄이는 방식은 React의 상태 구조 안내와 연결됩니다.[^structure]

`isEditing`, `isSaving`, `hasError` 세 boolean은 8개 조합을 만들지만 이 예제에 필요한 단계는 네 가지입니다. 판별 가능한 union은 각 단계에 필요한 필드를 함께 둡니다. reducer는 순수한 전이 함수이며 요청 같은 부수 효과는 이벤트 핸들러 등 외부에 둡니다.[^reducer]

## 201 · React 예제에 적용하기

가정: 장비 한 개의 이름만 편집하며 저장 중에는 편집 시작과 취소를 막습니다. 아래 코드는 API 없는 로컬 mock입니다. `App.tsx`에서 Edit → 이름 입력 → Save를 누르면 이름이 바뀌고 편집창이 닫힙니다. `Promise.resolve`를 거부하는 Promise로 바꾸면 초안을 보존한 오류 상태와 재시도를 확인할 수 있습니다.

```tsx
import { useReducer } from "react";
type Editor =
  | { phase: "closed" }
  | { phase: "editing"; draft: string }
  | { phase: "saving"; draft: string; requestId: string }
  | { phase: "failed"; draft: string; message: string };
type State = { name: string; editor: Editor };
type Action =
  | { type: "edit" } | { type: "cancel" }
  | { type: "change"; value: string }
  | { type: "save"; requestId: string }
  | { type: "saved"; requestId: string; name: string }
  | { type: "failed"; requestId: string; message: string };
export const initial: State = { name: "API", editor: { phase: "closed" } };
export function reducer(s: State, a: Action): State {
  const e = s.editor;
  switch (a.type) {
    case "edit": return e.phase === "saving" ? s
      : { ...s, editor: { phase: "editing", draft: s.name } };
    case "change": return e.phase === "editing" || e.phase === "failed"
      ? { ...s, editor: { phase: "editing", draft: a.value } } : s;
    case "save": return (e.phase === "editing" || e.phase === "failed") && e.draft.trim()
      ? { ...s, editor: { phase: "saving", draft: e.draft, requestId: a.requestId } } : s;
    case "saved": return e.phase === "saving" && e.requestId === a.requestId
      ? { name: a.name, editor: { phase: "closed" } } : s;
    case "failed": return e.phase === "saving" && e.requestId === a.requestId
      ? { ...s, editor: { phase: "failed", draft: e.draft, message: a.message } } : s;
    case "cancel": return e.phase === "saving" ? s : { ...s, editor: { phase: "closed" } };
  }
}
export default function EditorDemo() {
  const [state, dispatch] = useReducer(reducer, initial);
  const e = state.editor;
  async function save() {
    if ((e.phase !== "editing" && e.phase !== "failed") || !e.draft.trim()) return;
    const requestId = crypto.randomUUID();
    dispatch({ type: "save", requestId });
    try {
      const name = await Promise.resolve(e.draft); // Local mock, no API.
      dispatch({ type: "saved", requestId, name });
    } catch {
      dispatch({ type: "failed", requestId, message: "Save failed" });
    }
  }
  return <section aria-label="Name editor">
    <p>{state.name}</p>
    <button disabled={e.phase === "saving"} onClick={() => dispatch({ type: "edit" })}>Edit</button>
    {e.phase !== "closed" && <>
      <input aria-label="Name" value={e.draft} disabled={e.phase === "saving"}
        onChange={event => dispatch({ type: "change", value: event.target.value })} />
      <button disabled={e.phase === "saving" || !e.draft.trim()} onClick={save}>Save</button>
      <button disabled={e.phase === "saving"} onClick={() => dispatch({ type: "cancel" })}>Cancel</button>
      {e.phase === "failed" && <p role="alert">{e.message}</p>}
    </>}
  </section>;
}
```

## 301 · 조건에 따라 판단하기

`requestId`는 이전 응답이 현재 편집 상태를 덮지 못하게 합니다. API에 연결할 때는 같은 작업의 중복 실행을 막는 idempotency key와 version 또는 ETag 기반 충돌 검출을 별도로 설계합니다. 클라이언트 응답 무시는 서버 쓰기를 취소하지 않습니다. 저장 중 취소를 허용하려면 서버 작업과 로컬 편집의 수명을 분리합니다.

여러 장비는 `entities: Record<ID, Device>`와 `selectedId`로 정규화합니다. 공유 서버 캐시는 Query 계열 도구를 검토하고 화면 내부 전이는 reducer로 시작합니다. 연결·편집·선택을 하나의 거대한 enum에 넣으면 조합이 폭증하므로 독립 영역으로 나눕니다. 병렬 상태·타임아웃·재시도 전이가 복잡해지면 상태 머신 도구를 비교합니다. 낙관적 수정 중 실시간 이벤트가 오면 서버 version을 기준으로 확정값과 미확정 초안을 구분하고 충돌 UI를 제공합니다.

## 이해 확인

질문: 저장 A 다음 B가 시작되었는데 A가 늦게 응답하면 어떻게 합니까? 해설: 현재 saving의 requestId와 다르면 무시합니다. 서버 충돌은 별도 version 계약으로 처리합니다. 질문: selectedName도 저장해야 합니까? 해설: entities와 selectedId에서 계산할 수 있으므로 중복 저장하지 않습니다.

## 근거와 한계

공식 API 문서를 근거로 작성한 학습 예제입니다. 코드 검사 범위와 미검증 항목은 [학습 안내](index.md)에 기록합니다. 실제 운영 부하·서버 복구·보조 기술 호환성을 검증한 실험 기록이 아닙니다.

[학습 순서](index.md) · [English](../../en/frontend/complex-state-models.md)

## 출처

[^structure]: [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
[^reducer]: [useReducer](https://react.dev/reference/react/useReducer)
