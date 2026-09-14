---
type: Concept
title: 'Permission-based UI: authorization and action state'
description: 'Permission-based UI: authorization and action state'
concept_id: frontend-permission-based-ui
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
- id: auth
  resource: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
  title: OWASP Authorization Cheat Sheet
translation:
  source_language: ko
  source_concept_id: frontend-permission-based-ui
  source_fingerprint: sha256:3faad41a81a58ac0eb905d677924deae2f125bf2c3a1a04b9701cae5be375fea
  target_fingerprint: sha256:4e2a1d5c920f1a9454159695bcc2660030b60207c8e89fc071c2a48739c395db
  synced_at: '2026-09-14T02:23:23+00:00'
  review_status: SYNCED
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Permission-based UI: authorization and action state

## Situation, goals, and prerequisites

A restart button may be restricted to operators, yet access can change after login or tenant switching. Learn to distinguish loading, denial, failure, and in-progress states, and explain server authorization versus UI behavior. Start with [complex state models](complex-state-models.md) and HTTP status codes.

## 101 · Understanding

Authentication establishes identity; authorization decides allowed actions on a resource. UI expresses server-decided capabilities. Hiding a button is not server access control: servers must authorize every request and target resource and deny by default.[^auth]

RBAC uses roles such as operator; ABAC evaluates attributes such as tenant, owner, and environment; ReBAC uses resource relationships. Passing a resource-specific canRestart capability avoids coupling components to role-name checks scattered across the UI.

## 201 · Apply with React

Assume a presentation component receives a capability for a particular user, tenant, and device. The App.tsx checkbox is a local mock, not a security mechanism. Checking it reveals Restart; clicking shows Restart accepted. No device is actually restarted. Replace the restart mock with `throw new Error("403")` to inspect capability revocation and button removal.

In production, use an adapter that distinguishes server status codes. The permission result must have been fetched for the current deviceId and must not be reused after a device change.

```tsx
import { useRef, useState } from "react";
type Permission = { phase: "loading" | "error" } |
  { phase: "ready"; tenantId: string; subjectId: string; deviceId: string; canRestart: boolean };
type Props = { tenantId: string; subjectId: string; deviceId: string;
  permission: Permission; restart: () => Promise<void>; onForbidden: () => void };
export function RestartAction({ tenantId, subjectId, deviceId, permission, restart, onForbidden }: Props) {
  const [result, setResult] = useState("Ready");
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const allowed = permission.phase === "ready" && permission.tenantId === tenantId &&
    permission.subjectId === subjectId && permission.deviceId === deviceId && permission.canRestart;
  async function run() {
    if (!allowed || locked.current) return;
    locked.current = true;
    setBusy(true);
    try { await restart(); setResult("Restart accepted"); }
    catch (error) {
      if (error instanceof Error && error.message === "403") {
        onForbidden(); setResult("Permission changed. Refresh access.");
      } else { setResult("Request failed. Check operation status before retrying."); }
    } finally { locked.current = false; setBusy(false); }
  }
  if (permission.phase === "loading") return <p role="status">Checking access…</p>;
  if (permission.phase === "error") return <p role="alert">Access check failed</p>;
  if (!allowed) return <p>No restart permission for this device.</p>;
  return <section aria-label="Device action">
    <button disabled={busy} onClick={run}>Restart {deviceId}</button>
    <p role="status">{busy ? "Sending request…" : result}</p>
  </section>;
}
export default function PermissionDemo() {
  const [canRestart, setCanRestart] = useState(false);
  const tenantId = "demo-tenant", subjectId = "demo-user", deviceId = "api";
  return <>
    <label><input type="checkbox" checked={canRestart}
      onChange={e => setCanRestart(e.target.checked)} />Mock restart permission</label>
    <RestartAction key={`${tenantId}:${subjectId}:${deviceId}:${canRestart}`}
      tenantId={tenantId} subjectId={subjectId} deviceId={deviceId}
      permission={{ phase: "ready", tenantId, subjectId, deviceId, canRestart }}
      restart={async () => { await Promise.resolve(); }}
      onForbidden={() => setCanRestart(false)} />
  </>;
}
```

## 301 · Judgment under constraints

Permission cache keys include at least subject, tenant, resource, and action. Clear old caches and streams on login, logout, and tenant changes. The example key recreates action UI on user, tenant, device, or capability changes, keeping old component results out of the new screen. It does not cancel server work. Do not assume permission before loading finishes. Distinguish 401 reauthentication, 403 refetch or denial, and a network failure to check access.

Hide a feature when its existence should not be disclosed; disable it with a reason when users need to understand access requests or prerequisites. Do not conflate lack of permission with another action in progress. Disabled buttons do not completely prevent duplicate requests, so this example also uses a ref lock. Servers should supply idempotency keys and operation IDs; query operation status before blindly retrying after a timeout.

Restrict sensitive data at server response, search, export, and WebSocket/SSE subscription boundaries. CSS cannot revoke data already sent to a browser. Test direct API calls, another tenant’s IDs, existing tabs after revocation, reloads, and cached results.[^auth]

## Check your understanding

Question: what if someone calls the API directly without a visible button? Answer: the server must authorize and reject it. Question: what if access is revoked just before clicking? Answer: the server rejects even if the UI decision is stale; handle 403 by refetching or revoking the capability.

## Evidence and limits

These learning examples are grounded in official API documentation. See the [learning guide](index.md) for code checks and untested areas. They are not experiments validating production load, server recovery, or assistive technology compatibility.

[Reading order](index.md) · [한국어](../../ko/frontend/permission-based-ui.md)

## Sources

[^auth]: [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
