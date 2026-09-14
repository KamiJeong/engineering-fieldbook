---
type: Concept
title: 'Complex state models: ownership and transitions'
description: 'Complex state models: ownership and transitions'
concept_id: frontend-complex-state-models
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
- id: structure
  resource: https://react.dev/learn/choosing-the-state-structure
  title: Choosing the State Structure
- id: reducer
  resource: https://react.dev/reference/react/useReducer
  title: useReducer
translation:
  source_language: ko
  source_concept_id: frontend-complex-state-models
  source_fingerprint: sha256:927128c7bd5d0afe1265d27c0abc141ef887455878a28134f55fdef35c7b5517
  target_fingerprint: sha256:04c836ddcac2fb3efe0c7fe0885417a646cc509c09d7fadb80f2d206a99958e1
  synced_at: '2026-09-14T02:23:23+00:00'
  review_status: SYNCED
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Complex state models: ownership and transitions

## Situation, goals, and prerequisites

This chapter addresses disagreement between a selected device, its editor, and saving indicators. Learn to assign ownership and remove impossible combinations. It assumes JavaScript objects, TypeScript unions, and React state and event handling. See the [learning guide](index.md).

## 101 · Understanding

Server state is authoritative device data; UI state includes selection, panels, and drafts. URL state holds shareable filters and time ranges. Store the selected ID and derive its object to avoid stale copies, following React guidance on redundant and derived state.[^structure]

Three booleans for editing, saving, and error allow eight combinations; this example needs four phases. A discriminated union groups each phase with its required fields. A reducer is a pure transition function; effects such as requests belong outside it, for example in event handlers.[^reducer]

## 201 · Apply with React

Assume one editable device name, blocking editing and cancellation while saving. This local mock needs no API. In `App.tsx`, choose Edit, change the name, then Save. The name updates and the editor closes. Replace `Promise.resolve` with a rejecting promise to inspect a retained draft, an error, and retry.

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

## 301 · Judgment under constraints

The request ID prevents an old response from overwriting the current editor. With an API, separately design idempotency keys to prevent repeated operations and versions or ETags to detect conflicts. Ignoring a response does not cancel a server write. Cancellation during saving requires separate lifetimes for server work and local editing.

Normalize multiple devices as `entities: Record<ID, Device>` and `selectedId`. Consider query tools for shared server caches and start with a reducer for local transitions. Keep connectivity, editing, and selection in independent regions to avoid a giant enum. Compare state machine tools when parallel states, timeouts, and retries become complex. If a stream updates an optimistic edit, use server versions to distinguish confirmed data from pending drafts and provide conflict UI.

## Check your understanding

Question: A responds after save B starts. What should happen? Answer: ignore A if its ID differs from the current saving request. Handle server conflicts through a separate version contract. Question: should selectedName be stored? Answer: derive it from entities and selectedId.

## Evidence and limits

These learning examples are grounded in official API documentation. See the [learning guide](index.md) for code checks and untested areas. They are not experiments validating production load, server recovery, or assistive technology compatibility.

[Reading order](index.md) · [한국어](../../ko/frontend/complex-state-models.md)

## Sources

[^structure]: [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
[^reducer]: [useReducer](https://react.dev/reference/react/useReducer)
