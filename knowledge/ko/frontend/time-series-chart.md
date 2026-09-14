---
type: Concept
title: 'Time-series chart: 시간·결측·집계의 의미'
description: 'Time-series chart: 시간·결측·집계의 의미'
concept_id: frontend-time-series-chart
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
- id: svg
  resource: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/polyline
  title: SVG polyline
- id: line
  resource: https://recharts.github.io/en-US/api/Line/
  title: Recharts Line
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Time-series chart: 시간·결측·집계의 의미

## 상황·학습 목표와 선수 지식

CPU 추이를 그렸는데 관측이 끊긴 구간까지 선이 이어지면 정상 운영으로 오해할 수 있습니다. 시간축·단위·결측·중복·집계의 의미를 유지하는 것이 목표입니다. [실시간 반영](realtime-state-updates.md)과 [대량 렌더링](large-data-rendering.md), epoch millisecond와 배열 처리를 선수 지식으로 둡니다.

## 101 · 개념 이해

시계열은 `(측정 시각, 값)`의 순서 있는 데이터입니다. 수신 시각과 측정 시각을 구분하고 서버에서는 UTC 시각을 전달한 뒤 표시 시간대를 명시합니다. 초와 millisecond 혼동은 축을 잘못 만듭니다. CPU 0은 실제 측정값이고 null은 결측입니다. 누적 counter는 현재값 자체보다 reset을 고려한 변화율을 그려야 합니다.

SVG polyline은 지정한 점을 직선으로 연결합니다.[^svg] 따라서 결측 구간을 끊는 것은 데이터 준비 단계의 책임입니다. Recharts 같은 React 차트 도구를 쓰더라도 null 연결 옵션과 축·단위·애니메이션 정책을 확인해야 합니다.[^line]

## 201 · React 예제에 적용하기

가정: 한 CPU 지표의 1분 범위, 0~100%, 예상 간격 10초이며 15초보다 긴 간격은 단절로 봅니다. 중복 시각은 입력 배열에서 마지막 값이 이깁니다. 운영에서 version이 있다면 배열 순서 대신 version을 비교합니다. 예제는 라이브러리 없이 React와 SVG만 사용하며 App.tsx에서 실행합니다.

20초의 null과 40→60초의 긴 간격에 선이 없어야 합니다. 단독 60초 샘플은 점으로 남습니다. 입력 순서가 뒤집혀도 시간순으로 표시하고 범위 밖 데이터는 제외합니다. 값 없는 범위와 잘못된 시간 범위를 별도로 안내합니다.

```tsx
import { useId } from "react";
export type Sample = { t: number; value: number | null };
export function prepare(input: Sample[], start: number, end: number) {
  const byTime = new Map<number, Sample>();
  for (const sample of input) {
    if (!Number.isFinite(sample.t) || sample.t < start || sample.t > end) continue;
    const value = sample.value !== null && Number.isFinite(sample.value) &&
      sample.value >= 0 && sample.value <= 100 ? sample.value : null;
    byTime.set(sample.t, { t: sample.t, value });
  }
  return [...byTime.values()].sort((a, b) => a.t - b.t);
}
export function CpuChart({ input, start, end }: { input: Sample[]; start: number; end: number }) {
  const titleId = useId();
  const descriptionId = useId();
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) return <p>Invalid time range</p>;
  const points = prepare(input, start, end);
  const segments: Sample[][] = [];
  let segment: Sample[] = [];
  let previous: number | undefined;
  for (const point of points) {
    if (point.value === null || (previous !== undefined && point.t - previous > 15000)) {
      if (segment.length) segments.push(segment);
      segment = [];
    }
    if (point.value !== null) segment.push(point);
    previous = point.t;
  }
  if (segment.length) segments.push(segment);
  const x = (t: number) => 50 + (t - start) / (end - start) * 500;
  const y = (value: number) => 170 - value / 100 * 140;
  const clock = (t: number) => new Date(t).toISOString().slice(11, 19);
  return <figure>
    <svg viewBox="0 0 600 220" role="img" aria-labelledby={`${titleId} ${descriptionId}`}
      style={{ width: "100%", maxWidth: 800 }}>
      <title id={titleId}>CPU utilization (%)</title>
      <desc id={descriptionId}>UTC time axis. Gaps indicate missing data. Range 0 to 100 percent.</desc>
      <path d="M50 30 V170 H550" fill="none" stroke="currentColor" />
      <text x="5" y="35">100%</text><text x="20" y="175">0%</text>
      <text x="50" y="205">{clock(start)} UTC</text>
      <text x="550" y="205" textAnchor="end">{clock(end)} UTC</text>
      {segments.map((part, i) => <g key={i}>
        <polyline fill="none" stroke="currentColor" strokeWidth="2"
          points={part.map(p => `${x(p.t)},${y(p.value!)}`).join(" ")} />
        {part.map(p => <circle key={p.t} cx={x(p.t)} cy={y(p.value!)} r="3" fill="currentColor" />)}
      </g>)}
    </svg>
    {!segments.length && <p>No valid samples in this range</p>}
    <figcaption>CPU samples; missing is not zero.</figcaption>
    <details><summary>View data</summary>
      <table><thead><tr><th scope="col">UTC</th><th scope="col">CPU %</th></tr></thead>
        <tbody>{points.map(p => <tr key={p.t}><td>{clock(p.t)}</td>
          <td>{p.value ?? "Missing"}</td></tr>)}</tbody></table>
    </details>
  </figure>;
}
const start = Date.parse("2026-09-14T00:00:00Z");
export default function ChartDemo() {
  return <CpuChart start={start} end={start + 60000} input={[
    { t: start, value: 20 }, { t: start + 10000, value: 35 },
    { t: start + 20000, value: null }, { t: start + 30000, value: 80 },
    { t: start + 40000, value: 50 }, { t: start + 60000, value: 40 },
  ]} />;
}
```

## 301 · 조건에 따라 판단하기

prepare는 전체 입력을 순회하므로 입력 자체도 미리 제한해야 합니다. 예를 들어 최근 10분만 보관하고 최대 샘플 수를 정한 ring buffer를 사용합니다. 이 예제의 1분 fixture에는 무한 스트림 저장이 없습니다. 과거 구간을 보는 동안 실시간 데이터가 와도 선택 범위를 이동시키지 말고 Live 모드와 탐색 모드를 분리합니다.

화면 폭이 800px인데 100만 점을 그리는 대신 서버에서 시간 bucket을 집계하거나 min/max envelope·LTTB 같은 축소 방법을 목적별로 비교합니다. 평균만 그리면 짧은 장애 spike가 사라질 수 있고 단순 매 N번째 추출도 peak를 놓칩니다. bucket min/max와 원본 조회 경로를 함께 제공하는 것이 장애 분석의 출발점입니다. 축소된 선에서 임계치 알림을 계산하지 않습니다.

지연 도착 데이터는 측정 시각 기준으로 삽입하고 보관 창 밖이면 폐기하거나 과거 집계 저장소에 반영합니다. 여러 지표에 같은 색만 달리 쓰지 말고 범례·선 패턴·단위를 제공하며 서로 다른 단위의 이중 축은 해석 부담을 설명합니다. 대규모 표 대안도 페이지화해야 하며 SVG 점 수와 tooltip·zoom 처리 비용을 함께 측정합니다.

## 이해 확인

질문: 응답 없는 구간을 0으로 채우면 왜 안 됩니까? 해설: 수집 장애가 CPU 0%처럼 보입니다. 질문: 1분 평균 40%가 최대 95%를 숨겨도 괜찮습니까? 해설: 용량 추세에는 평균이 유용할 수 있지만 장애 분석에는 peak 보존 집계가 필요합니다.

## 근거와 한계

공식 API 문서를 근거로 작성한 학습 예제입니다. 코드 검사 범위와 미검증 항목은 [학습 안내](index.md)에 기록합니다. 실제 운영 부하·서버 복구·보조 기술 호환성을 검증한 실험 기록이 아닙니다.

[학습 순서](index.md) · [English](../../en/frontend/time-series-chart.md)

## 출처

[^svg]: [SVG polyline](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/polyline)
[^line]: [Recharts Line](https://recharts.github.io/en-US/api/Line/)
