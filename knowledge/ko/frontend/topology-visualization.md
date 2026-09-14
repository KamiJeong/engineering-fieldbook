---
type: Concept
title: 'Topology visualization: 관계와 배치 분리'
description: 'Topology visualization: 관계와 배치 분리'
concept_id: frontend-topology-visualization
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
- id: flow
  resource: https://reactflow.dev/learn
  title: React Flow quick start
- id: api
  resource: https://reactflow.dev/api-reference/react-flow
  title: ReactFlow component
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Topology visualization: 관계와 배치 분리

## 상황·학습 목표와 선수 지식

장애가 난 서비스가 어떤 다른 서비스에 연결되는지 목록만으로 파악하기 어려울 때 토폴로지 그림을 사용합니다. 관계 데이터와 화면 좌표를 구분하고 선택·필터·접근성까지 설명하는 것이 목표입니다. [상태 모델](complex-state-models.md), [실시간 반영](realtime-state-updates.md), [토폴로지 용어](../../../glossary/ko/topology.md)를 먼저 읽습니다.

## 101 · 개념 이해

노드(node)는 서비스나 장비이고 엣지(edge)는 호출·의존·네트워크 연결 같은 관계입니다. 엣지가 있다는 것만으로 실제 트래픽이나 장애 원인이 증명되지는 않습니다. 먼저 관계의 의미와 방향을 정합니다. 이 예제의 source → target은 호출자 → 호출 대상입니다.

React Flow는 nodes·edges·뷰포트와 상호작용을 제공하며 스타일시트와 높이가 있는 부모 컨테이너가 필요합니다.[^flow] 관계를 읽기 쉽게 좌표로 바꾸는 자동 layout은 별도 알고리즘 선택입니다. 계층형 배치·힘 기반 배치·사용자 수동 좌표는 서로 다른 읽기 목적에 적합합니다.

## 201 · React 예제에 적용하기

가정: Web → API → Database 호출 관계이고 API는 down입니다. 좌표는 예제에서 고정하며 실제 서비스 탐지 결과가 아닙니다. 별도 프로젝트에 `npm install @xyflow/react@12` 후 App.tsx에 넣습니다. API 노드는 down 텍스트와 점선 테두리로 표시되어 색상만 보지 않아도 상태를 구분합니다. 노드나 아래 표의 버튼을 선택하면 같은 selectedId가 반영됩니다.

읽기 전용 토폴로지이므로 드래그와 새 연결을 비활성화합니다. React Flow의 제어 props와 선택 callback을 사용하고[^api], 표에서도 동일 관계와 선택 수단을 제공합니다.

```tsx
import { useMemo, useState } from "react";
import { ReactFlow, Background, Controls, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
type Service = { id: string; name: string; health: "ok" | "down"; x: number; y: number };
const services: Service[] = [
  { id: "web", name: "Web", health: "ok", x: 0, y: 60 },
  { id: "api", name: "API", health: "down", x: 230, y: 60 },
  { id: "db", name: "Database", health: "ok", x: 460, y: 60 },
];
const links: Edge[] = [
  { id: "web-api", source: "web", target: "api", label: "HTTP" },
  { id: "api-db", source: "api", target: "db", label: "SQL" },
];
export default function TopologyDemo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const nodes = useMemo<Node[]>(() => services.map(service => ({
    id: service.id, position: { x: service.x, y: service.y },
    data: { label: `${service.name} — ${service.health}` },
    style: { border: service.health === "down" ? "3px dashed #b91c1c" : "1px solid #475569" },
    selected: service.id === selectedId,
  })), [selectedId]);
  return <section aria-label="Service topology">
    <div style={{ height: 320, width: "100%" }}>
      <ReactFlow nodes={nodes} edges={links} fitView nodesDraggable={false}
        nodesConnectable={false} onNodeClick={(_, node) => setSelectedId(node.id)}
        onPaneClick={() => setSelectedId(null)}>
        <Background /><Controls showInteractive={false} />
      </ReactFlow>
    </div>
    <p role="status">Selected: {selectedId ?? "none"}</p>
    <table>
      <caption>Equivalent service relationships</caption>
      <thead><tr><th scope="col">Service</th><th scope="col">Health</th>
        <th scope="col">Calls</th></tr></thead>
      <tbody>{services.map(service => <tr key={service.id}>
        <td><button aria-pressed={selectedId === service.id}
          onClick={() => setSelectedId(service.id)}>{service.name}</button></td>
        <td>{service.health}</td>
        <td>{links.filter(link => link.source === service.id).map(link => link.target).join(", ") || "None"}</td>
      </tr>)}</tbody>
    </table>
  </section>;
}
```

## 301 · 조건에 따라 판단하기

실시간 health 변경 때 모든 좌표를 다시 계산하면 사용자가 추적하던 노드가 이동합니다. entities의 health와 positions를 분리하고 관계 추가·삭제 또는 명시적 재배치 때만 layout을 실행합니다. 큰 배치는 Worker에서 계산하고 topology revision이 바뀌면 오래된 결과를 버립니다. 사용자가 옮긴 좌표를 보존할지 서버 배치를 적용할지도 계약합니다.

큰 그래프는 수치만 보고 라이브러리를 바꾸기 전에 서비스 그룹 접기·선택 노드의 N-hop 이웃·검색·엣지 종류 필터로 읽는 범위를 줄입니다. 숨겨진 이웃 수를 표시해 관계가 없다고 오해하지 않게 합니다. 노드 수뿐 아니라 엣지 수·라벨·업데이트 빈도·layout 시간도 측정하고, 필요하면 Canvas/WebGL 렌더러를 비교합니다. 브라우저에서 모든 노드가 빠르다는 고정 한계 수치는 제시하지 않습니다.

서버는 권한 없는 노드와 연결도 제외해야 합니다. 숨긴 노드 이름이 엣지 label이나 검색 결과에 남는지 확인합니다. 자동 fitView는 초기 표시·사용자 요청에 사용하고 갱신마다 확대·이동 상태를 초기화하지 않습니다. 모바일 pan/zoom·키보드 선택·화면 낭독기는 실제 검증 대상입니다.

## 이해 확인

질문: API가 down이고 DB와 연결되어 있으면 DB가 원인입니까? 해설: 관계는 조사 경로일 뿐 원인 증거가 아닙니다. 메트릭·로그·추적을 함께 확인합니다. 질문: health 이벤트마다 layout을 실행하면? 해설: 불필요한 계산과 노드 이동이 발생하므로 구조 변화와 상태 변화를 분리합니다.

## 근거와 한계

공식 API 문서를 근거로 작성한 학습 예제입니다. 코드 검사 범위와 미검증 항목은 [학습 안내](index.md)에 기록합니다. 실제 운영 부하·서버 복구·보조 기술 호환성을 검증한 실험 기록이 아닙니다.

[학습 순서](index.md) · [English](../../en/frontend/topology-visualization.md)

## 출처

[^flow]: [React Flow quick start](https://reactflow.dev/learn)
[^api]: [ReactFlow component](https://reactflow.dev/api-reference/react-flow)
