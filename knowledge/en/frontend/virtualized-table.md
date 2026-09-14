---
type: Concept
title: 'Virtualized table: separate row count from DOM count'
description: 'Virtualized table: separate row count from DOM count'
concept_id: frontend-virtualized-table
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
- id: virtual
  resource: https://tanstack.com/virtual/latest/docs/api/virtualizer
  title: Virtualizer
translation:
  source_language: ko
  source_concept_id: frontend-virtualized-table
  source_fingerprint: sha256:d3d100990f0832777c6438b40ed84a8437a42e9ec5cfc32f8410f1bd4ba8eec2
  target_fingerprint: sha256:73e244b4cedc4f951c7459f8e1f92af080c11d1ce3010ff34d29afe381f2a424
  synced_at: '2026-09-14T02:23:23+00:00'
  review_status: SYNCED
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Virtualized table: separate row count from DOM count

## Situation, goals, and prerequisites

With 50,000 rows but only about ten visible, consider mounting only nearby rows. Learn height accounting, stable row IDs, and accessibility limits. Read [large-data rendering](large-data-rendering.md) and [UI virtualization](../../../glossary/en/ui-virtualization.md) first.

## 101 · Understanding

Virtualization renders the visible range plus overscan rows on each side. Spacer areas maintain total scroll height. TanStack Virtual calculates the range from count, scroll element, size estimate, and item keys.[^virtual] Sorting, filtering, and selection are separate table models; combine a tool such as TanStack Table if needed.

With 36px rows and a 360px viewport, about ten body rows plus up to twelve overscan rows are a starting estimate. Headers, captions, boundaries, and measurement affect the actual count. All 50,000 data objects still remain in memory.

## 201 · Apply with React

Assume single-line names, 36px body rows, and a read-only table without editing controls. Install `npm install @tanstack/react-virtual@3` in a separate React project and paste into App.tsx. The CPU order button sorts all local data and returns to the start. Scrolling should mount far fewer body rows than 50,000.

The example uses a native table with top and bottom spacer rows. Caption and header height inside the scroll element introduce a small offset in range calculation; overscan buffers this short header. For large or multiline headers, measure the body start and correct with scrollMargin, or separate a fixed header from the scrolling body.

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

## 301 · Judgment under constraints

Index keys can transfer old row state to another device after sorting. Key items, selection, and drafts by device ID. Offscreen rows unmount, so keep important editing state outside them. Resorting on every live metric can disorient readers; provide a refresh-sort button or temporary freeze policy.

For variable heights, connect data-index and measureElement, and check remeasurement after image or font changes.[^virtual] Hundreds of columns may need column virtualization and pinned-column design too.

aria-rowcount and aria-rowindex communicate total size and position but do not make unmounted rows readable. Test keyboard scrolling, zoom, and screen readers and provide a paginated table or full export. Browser find cannot find unmounted rows; offer full-data search. Arrow-key navigation and focus restoration for editable grids are outside this example.

## Check your understanding

Question: why can sorting remain slow after virtualization? Answer: sorting the full array still costs the same. Question: what if zoom causes wrapping and changes row height? Answer: revisit fixed sizing, use dynamic measurement, or offer a paginated table.

## Evidence and limits

These learning examples are grounded in official API documentation. See the [learning guide](index.md) for code checks and untested areas. They are not experiments validating production load, server recovery, or assistive technology compatibility.

[Reading order](index.md) · [한국어](../../ko/frontend/virtualized-table.md)

## Sources

[^virtual]: [Virtualizer](https://tanstack.com/virtual/latest/docs/api/virtualizer)
