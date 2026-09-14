---
type: Concept
title: 'Virtualized table: 행 수와 DOM 수 분리'
description: 'Virtualized table: 행 수와 DOM 수 분리'
concept_id: frontend-virtualized-table
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
- id: virtual
  resource: https://tanstack.com/virtual/latest/docs/api/virtualizer
  title: Virtualizer
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Virtualized table: 행 수와 DOM 수 분리

## 상황·학습 목표와 선수 지식

행 5만 개가 있어도 화면에 10개 정도만 보인다면 주변 행만 DOM으로 만드는 방식을 고려합니다. 목표는 가상화의 높이 계산과 안정적인 행 ID, 접근성 한계를 설명하는 것입니다. [대량 데이터 렌더링](large-data-rendering.md)과 [가상화 용어](../../../glossary/ko/ui-virtualization.md)를 먼저 읽습니다.

## 101 · 개념 이해

가상화는 보이는 범위와 앞뒤 여유 행인 overscan만 렌더링합니다. 나머지 영역은 빈 공간으로 전체 스크롤 높이를 유지합니다. TanStack Virtual은 count·scroll element·크기 추정·item key로 이 범위를 계산합니다.[^virtual] 테이블의 정렬·필터·선택 모델과 가상화는 별개이며 필요하면 TanStack Table 같은 도구와 조합합니다.

고정 높이 36px, 뷰포트 360px이면 본문 약 10행과 overscan 최대 12행이 출발점입니다. 실제 수는 헤더·caption·경계와 측정 방식에 따라 달라집니다. 데이터 5만 개 자체는 여전히 메모리에 있습니다.

## 201 · React 예제에 적용하기

가정: 이름은 한 줄이고 각 본문 행은 36px이며 편집 컨트롤이 없는 읽기 전용 표입니다. 별도 React 프로젝트에서 `npm install @tanstack/react-virtual@3` 후 App.tsx에 붙입니다. CPU 순서 버튼을 누르면 전체 로컬 데이터를 정렬하고 처음으로 이동합니다. 스크롤해도 DOM의 본문 행은 전체 5만 개보다 훨씬 적어야 합니다.

이 예제는 기본 HTML table에 위아래 spacer 행을 넣습니다. caption과 헤더가 스크롤 요소 안에 있어 가상 범위 계산에 작은 높이 오차가 생길 수 있으며 이 짧은 헤더는 overscan이 완충합니다. 헤더가 크거나 여러 줄이면 본문 시작 위치를 측정해 scrollMargin으로 보정하거나 고정 헤더와 스크롤 본문을 분리합니다.

```tsx
import { useCallback, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
type Row = { id: string; name: string; cpu: number };
const data: Row[] = Array.from({ length: 50000 }, (_, i) => ({
  id: `device-${i}`, name: `Device ${i}`, cpu: i % 100,
}));
export default function DeviceTable() {
  const parent = useRef<HTMLDivElement>(null);
  const [descending, setDescending] = useState(false);
  const rows = useMemo(() => [...data].sort((a, b) =>
    (descending ? b.cpu - a.cpu : a.cpu - b.cpu) || a.id.localeCompare(b.id)), [descending]);
  const getItemKey = useCallback((index: number) => rows[index].id, [rows]);
  const virtual = useVirtualizer({
    count: rows.length, getScrollElement: () => parent.current,
    estimateSize: () => 36, getItemKey, overscan: 6,
  });
  const items = virtual.getVirtualItems();
  const top = items[0]?.start ?? 0;
  const bottom = items.length ? virtual.getTotalSize() - items[items.length - 1].end : 0;
  return <section>
    <button onClick={() => { setDescending(v => !v); virtual.scrollToOffset(0); }}>
      CPU order: {descending ? "descending" : "ascending"}
    </button>
    <div ref={parent} tabIndex={0} role="region" aria-label="Scrollable device table"
      style={{ height: 360, overflow: "auto" }}>
      <table aria-rowcount={rows.length + 1} style={{ width: "100%", tableLayout: "fixed",
        borderCollapse: "collapse" }}>
        <caption>Devices — 50,000 rows</caption>
        <thead><tr aria-rowindex={1}>
          <th scope="col">Name</th>
          <th scope="col" aria-sort={descending ? "descending" : "ascending"}>CPU %</th>
        </tr></thead>
        <tbody>
          {top > 0 && <tr aria-hidden="true"><td colSpan={2} style={{ height: top, padding: 0 }} /></tr>}
          {items.map(item => {
            const row = rows[item.index];
            return <tr key={item.key} aria-rowindex={item.index + 2} style={{ height: 36 }}>
              <td style={{ padding: "0 8px", whiteSpace: "nowrap", overflow: "hidden",
                textOverflow: "ellipsis" }}>{row.name}</td>
              <td style={{ padding: "0 8px" }}>{row.cpu}</td>
            </tr>;
          })}
          {bottom > 0 && <tr aria-hidden="true"><td colSpan={2} style={{ height: bottom, padding: 0 }} /></tr>}
        </tbody>
      </table>
    </div>
  </section>;
}
```

## 301 · 조건에 따라 판단하기

key를 배열 index로 두면 정렬 후 다른 장비가 이전 행 상태를 이어받을 수 있습니다. item key와 선택·편집 초안은 장비 ID로 관리합니다. 화면 밖 행이 언마운트되므로 그 내부에 중요한 편집 상태를 두지 않습니다. 실시간 정렬 값이 바뀔 때마다 행을 이동시키면 읽는 위치를 잃으므로 정렬 갱신 버튼 또는 일시 고정 정책을 제공합니다.

가변 높이는 data-index와 measureElement를 연결해 실제 크기를 측정하고 이미지 로딩·폰트 변경 후 재측정을 확인합니다.[^virtual] 열이 수백 개라면 행 가상화만으로 충분하지 않아 열 가상화·고정 열을 함께 설계합니다.

aria-rowcount와 aria-rowindex는 전체 크기와 위치를 전달하지만 미탑재 행을 읽을 수 있게 만들지는 않습니다. 키보드 스크롤·확대·스크린리더를 실제로 확인하고 페이지형 표·전체 내보내기를 대안으로 제공합니다. 브라우저 찾기는 미탑재 행을 찾지 못하므로 전체 데이터 검색을 따로 제공합니다. 편집형 grid의 방향키·포커스 복원은 이 예제의 범위 밖입니다.

## 이해 확인

질문: 가상화 후 정렬이 여전히 느린 이유는 무엇입니까? 해설: 전체 배열 sort 비용은 줄지 않았기 때문입니다. 질문: 확대 시 글자가 줄바꿈되어 높이가 달라지면? 해설: 고정 높이 가정을 재검토하고 동적 측정을 적용하거나 페이지형 표를 제공합니다.

## 근거와 한계

공식 API 문서를 근거로 작성한 학습 예제입니다. 코드 검사 범위와 미검증 항목은 [학습 안내](index.md)에 기록합니다. 실제 운영 부하·서버 복구·보조 기술 호환성을 검증한 실험 기록이 아닙니다.

[학습 순서](index.md) · [English](../../en/frontend/virtualized-table.md)

## 출처

[^virtual]: [Virtualizer](https://tanstack.com/virtual/latest/docs/api/virtualizer)
