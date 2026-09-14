---
type: Concept
title: 'Topology visualization: separate relationships from layout'
description: 'Topology visualization: separate relationships from layout'
concept_id: frontend-topology-visualization
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
- id: flow
  resource: https://reactflow.dev/learn
  title: React Flow quick start
- id: api
  resource: https://reactflow.dev/api-reference/react-flow
  title: ReactFlow component
translation:
  source_language: ko
  source_concept_id: frontend-topology-visualization
  source_fingerprint: sha256:4ed66ed3a604613ad8882c50712ada1f647740f03ebe9808cb5649eff59f172f
  target_fingerprint: sha256:b5585cda58e7f1af741da8b2e975a7ff98ba5e4e4fdd69e988714ae441c9b265
  synced_at: '2026-09-14T02:23:23+00:00'
  review_status: SYNCED
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Topology visualization: separate relationships from layout

## Situation, goals, and prerequisites

Use a topology view when a list does not clearly show an unhealthy service’s relationships. Learn to distinguish relationships from coordinates and address selection, filtering, and accessibility. Read [state models](complex-state-models.md), [real-time updates](realtime-state-updates.md), and [topology](../../../glossary/en/topology.md).

## 101 · Understanding

Nodes represent services or devices; edges represent calls, dependencies, or network links. An edge alone proves neither traffic nor fault causation. Define its meaning and direction first. Here source → target means caller → called service.

React Flow supplies nodes, edges, viewport, and interactions and needs its stylesheet and a parent with height.[^flow] Automatic layout is a separate algorithm choice. Hierarchical, force-directed, and manually positioned layouts serve different reading tasks.

## 201 · Apply with React

Assume Web → API → Database calls, with API down. Coordinates are fixed fixtures, not discovered infrastructure. Install `npm install @xyflow/react@12` in a separate project and use App.tsx. API has down text and a dashed border, so status does not depend on color. Selecting a node or table button updates the same selectedId.

Dragging and creating edges are disabled for this read-only view. It uses React Flow control props and selection callbacks[^api] and provides equivalent relationships and selection through a table.

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

## 301 · Judgment under constraints

Recomputing coordinates on every health event moves nodes readers are tracking. Separate entity health from positions and run layout on relationship changes or explicit requests. Compute expensive layout in a Worker and reject stale results when the topology revision changes. Define whether user coordinates or server layout wins.

Before switching renderers for a large graph, reduce the reading scope with collapsed service groups, N-hop neighbors, search, and edge-type filters. Show hidden neighbor counts rather than implying no relationship exists. Measure edges, labels, update frequency, and layout time as well as nodes; compare Canvas/WebGL if needed. No universal fast node-count threshold is claimed.

Servers must exclude unauthorized nodes and relationships. Check edge labels and search results for names of hidden nodes. Use fitView initially or on request, preserving zoom and pan during updates. Mobile pan/zoom, keyboard selection, and screen readers require actual testing.

## Check your understanding

Question: API is down and connected to DB. Is DB the cause? Answer: a relationship suggests an investigation path, not causation; correlate metrics, logs, and traces. Question: why not run layout on every health event? Answer: it causes unnecessary computation and movement; separate structural changes from status changes.

## Evidence and limits

These learning examples are grounded in official API documentation. See the [learning guide](index.md) for code checks and untested areas. They are not experiments validating production load, server recovery, or assistive technology compatibility.

[Reading order](index.md) · [한국어](../../ko/frontend/topology-visualization.md)

## Sources

[^flow]: [React Flow quick start](https://reactflow.dev/learn)
[^api]: [ReactFlow component](https://reactflow.dev/api-reference/react-flow)
