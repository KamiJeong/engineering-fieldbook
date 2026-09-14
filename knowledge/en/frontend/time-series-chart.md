---
type: Concept
title: 'Time-series chart: time, missing data, and aggregation'
description: 'Time-series chart: time, missing data, and aggregation'
concept_id: frontend-time-series-chart
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
- id: svg
  resource: https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/polyline
  title: SVG polyline
- id: line
  resource: https://recharts.github.io/en-US/api/Line/
  title: Recharts Line
translation:
  source_language: ko
  source_concept_id: frontend-time-series-chart
  source_fingerprint: sha256:7d2ee8705d39488e954bbcef07d768f5329d614362882d0a57689f095d6e7d20
  target_fingerprint: sha256:cbfbb45c51280f4ef432907601be4e741632b3e443e4e38b53b4fbbc05e6866c
  synced_at: '2026-09-14T02:23:23+00:00'
  review_status: SYNCED
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Time-series chart: time, missing data, and aggregation

## Situation, goals, and prerequisites

A CPU chart that connects across missing observations can imply healthy operation. Learn to preserve time, units, gaps, duplicates, and aggregation semantics. Prerequisites are [real-time updates](realtime-state-updates.md), [large-data rendering](large-data-rendering.md), epoch milliseconds, and arrays.

## 101 · Understanding

A time series is ordered measurement-time and value data. Distinguish event time from reception time, transmit UTC timestamps, and identify the display timezone. Confusing seconds with milliseconds breaks the axis. Zero CPU is an observation; null is missing. A cumulative counter usually needs a reset-aware rate rather than its raw value.

SVG polyline connects supplied points with straight lines.[^svg] Data preparation must split gaps. With a React chart library such as Recharts, also check null connection options, axes, units, and animation policy.[^line]

## 201 · Apply with React

Assume one CPU metric over one minute, 0–100%, expected every ten seconds, splitting gaps over fifteen seconds. For duplicate timestamps, the last input value wins; production versions should take precedence over array order. The example uses only React and SVG and runs as App.tsx.

There should be no line through the null at twenty seconds or the long forty-to-sixty-second gap. The isolated sixty-second sample remains a dot. Reversed input is sorted and out-of-range samples are excluded. Empty and invalid ranges have distinct messages.

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

## 301 · Judgment under constraints

prepare scans all input, so bound the input itself first. For example, use a ring buffer for the last ten minutes with a maximum sample count. This one-minute fixture does not store an unbounded stream. Separate Live and exploration modes so incoming samples do not move a historical range being inspected.

Instead of drawing a million points over 800px, compare server time buckets, min/max envelopes, and LTTB according to the task. Averages can hide short outage spikes; every-Nth sampling can miss peaks too. Bucket minima/maxima with access to original samples are a starting point for incident analysis. Do not compute threshold alerts from a reduced display line.

Insert late data by event time. Outside the retention window, discard it or update historical aggregates. For multiple metrics, use legends, line patterns, and units rather than color alone; explain the interpretation cost of dual axes with different units. Paginate large table alternatives and measure point count alongside tooltip and zoom costs.

## Check your understanding

Question: why not fill absent responses with zero? Answer: collection failure would look like 0% CPU. Question: is a 40% minute average hiding a 95% maximum acceptable? Answer: averages may serve capacity trends; incident analysis needs peak-preserving aggregation.

## Evidence and limits

These learning examples are grounded in official API documentation. See the [learning guide](index.md) for code checks and untested areas. They are not experiments validating production load, server recovery, or assistive technology compatibility.

[Reading order](index.md) · [한국어](../../ko/frontend/time-series-chart.md)

## Sources

[^svg]: [SVG polyline](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/polyline)
[^line]: [Recharts Line](https://recharts.github.io/en-US/api/Line/)
