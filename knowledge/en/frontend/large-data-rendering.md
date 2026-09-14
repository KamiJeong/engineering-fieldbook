---
type: Concept
title: 'Large-data rendering: transfer, computation, and DOM costs'
description: 'Large-data rendering: transfer, computation, and DOM costs'
concept_id: frontend-large-data-rendering
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
- id: deferred
  resource: https://react.dev/reference/react/useDeferredValue
  title: useDeferredValue
- id: virtual
  resource: https://tanstack.com/virtual/latest/docs/api/virtualizer
  title: Virtualizer
translation:
  source_language: ko
  source_concept_id: frontend-large-data-rendering
  source_fingerprint: sha256:4b0ce9dc32b446da16f79542c30547a36897c435cbdf1b33ba90de7fbc61534b
  target_fingerprint: sha256:ebc039b1074bb6b6c79f6320c2bfaf368f26a40d46a0bb287772a6e1458d3683
  synced_at: '2026-09-14T02:23:23+00:00'
  review_status: SYNCED
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Large-data rendering: transfer, computation, and DOM costs

## Situation, goals, and prerequisites

Choosing virtualization simply because searching 50,000 rows is slow can miss the cause. Learn to separate network, JSON parsing, computation, React render, and DOM layout costs. Assume [state models](complex-state-models.md) and array filter and map.

## 101 · Understanding

Pagination reduces data fetched at once; virtualization creates DOM around the viewport. Virtualization alone does not reduce download size or full-data sorting cost.[^virtual] Memoization reuses calculations for unchanged inputs; work remains when inputs change.

`useDeferredValue` can prioritize input by deferring less urgent results. It is neither a fixed debounce nor a Worker and does not reduce network requests.[^deferred]

## 201 · Apply with React

Assume 50,000 short names already in memory, with only the first 100 matches needed. This is a design fixture, not a performance measurement. Type quickly in App.tsx: input changes immediately and Updating results may appear while results catch up. A fast device may barely show it.

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

## 301 · Judgment under constraints

`memo(Results)` can skip the results render during urgent input updates when the deferred query is unchanged. Putting useMemo in the parent while still filtering on every keystroke does not provide the same behavior. The synchronous filter cannot be interrupted mid-execution. Move long computations to a Worker or filter and sort on the server.

Use `query + sort + tenant + cursor` as a server-search cache key and include a stable sort tie-breaker such as ID. Reset the cursor on filter changes. Abort older requests with AbortController and compare request IDs to ignore stale responses. Cancellation does not guarantee server work stops. Show an unknown total honestly and do not present sorting one page as sorting all results.

Before downloading 100,000 rows, measure response bytes, parsing time, and heap growth. Compare DOM counts, long tasks, input latency, and scroll commit duration with identical data, device, and build. Continue to [virtualized tables](virtualized-table.md) to scroll all local results instead of a 100-item preview.

## Check your understanding

Question: only 30 rows are mounted, but search is slow. What next? Answer: profile full-data filtering, sorting, JSON parsing, and derived calculations. Question: does useDeferredValue reduce server requests? Answer: no; design debounce, caching, and cancellation separately.

## Evidence and limits

These learning examples are grounded in official API documentation. See the [learning guide](index.md) for code checks and untested areas. They are not experiments validating production load, server recovery, or assistive technology compatibility.

[Reading order](index.md) · [한국어](../../ko/frontend/large-data-rendering.md)

## Sources

[^deferred]: [useDeferredValue](https://react.dev/reference/react/useDeferredValue)
[^virtual]: [Virtualizer](https://tanstack.com/virtual/latest/docs/api/virtualizer)
