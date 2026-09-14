---
type: Concept
title: 'Permission-based UI: 권한 확인과 작업 상태'
description: 'Permission-based UI: 권한 확인과 작업 상태'
concept_id: frontend-permission-based-ui
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
- id: auth
  resource: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
  title: OWASP Authorization Cheat Sheet
verified:
- by: openai/gpt-6
  at: '2026-09-14T02:23:23+00:00'
stale_after: '2027-01-12T02:23:23+00:00'
---

# Permission-based UI: 권한 확인과 작업 상태

## 상황·학습 목표와 선수 지식

관리자에게만 재시작 버튼을 보여 주고 싶지만, 로그인 후 권한이 바뀌거나 tenant를 전환할 수도 있습니다. 권한 로딩·거부·실패·작업 중 상태를 구분하고 서버 인가와 UI의 역할을 설명하는 것이 목표입니다. [복잡한 상태 모델](complex-state-models.md)과 HTTP status를 먼저 이해합니다.

## 101 · 개념 이해

인증(authentication)은 누구인지 확인하고 인가(authorization)는 특정 리소스에서 무엇을 허용하는지 결정합니다. UI는 서버가 판단한 capability를 사용자에게 표현합니다. 버튼 숨김은 서버 접근 통제가 아니므로 서버는 모든 요청과 대상 리소스의 권한을 검사하고 기본 거부를 적용해야 합니다.[^auth]

역할 기반 RBAC는 운영자 같은 역할을 사용하고, 속성 기반 ABAC는 tenant·소유자·환경 같은 속성을, 관계 기반 ReBAC는 리소스 관계를 판단에 사용합니다. 컴포넌트 곳곳의 `role === "admin"` 대신 리소스별 canRestart 같은 결과를 전달하면 역할 이름과 화면의 결합을 줄일 수 있습니다.

## 201 · React 예제에 적용하기

가정: 예제는 특정 사용자·tenant·장비에 대한 capability를 전달받는 표시 계층입니다. App.tsx의 체크박스는 서버가 아닌 로컬 mock이므로 보안을 제공하지 않습니다. 선택하면 재시작 버튼이 나타나고 누르면 Restart accepted를 표시합니다. 실제 재시작은 실행하지 않습니다. restart mock을 `throw new Error("403")`으로 바꾸면 capability를 철회하고 버튼이 사라지는 경로를 확인할 수 있습니다.

운영에서는 서버가 상태 코드를 구분해 실패를 반환하도록 어댑터를 만듭니다. permission은 현재 deviceId에 대해 조회한 결과여야 하며 장비 변경 시 이전 결과를 재사용하면 안 됩니다.

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

## 301 · 조건에 따라 판단하기

권한 캐시 키는 최소 subject·tenant·resource·action을 포함하고 로그인·로그아웃·tenant 변경 때 이전 캐시와 스트림을 정리합니다. 예제의 key는 사용자·tenant·장비·권한 변경 때 작업 UI를 새로 만들며 오래된 컴포넌트의 결과가 새 화면에 섞이지 않게 합니다. 서버 작업 자체는 취소되지 않습니다. capability 조회가 끝나기 전에는 허용으로 추측하지 않습니다. 401은 재인증, 403은 권한 재조회·거부, 네트워크 실패는 확인 실패로 구분합니다.

허용되지 않은 기능의 존재 자체를 숨겨야 하면 숨김을, 권한 요청이나 준비 조건을 이해해야 하면 비활성화와 이유를 사용합니다. 권한 부족과 다른 작업이 진행 중인 상태를 같은 이유로 표시하지 않습니다. 버튼 비활성화는 중복 요청의 완전한 방지가 아니므로 예제는 ref 잠금도 사용합니다. 서버는 idempotency key와 작업 ID를 제공하고 timeout 뒤 무작정 재전송하기 전에 작업 상태를 조회하도록 합니다.

민감 데이터는 서버 응답·검색·export·WebSocket/SSE 구독 단계에서 제한합니다. 이미 브라우저에 보낸 내용을 CSS로 숨겨 회수할 수는 없습니다. 서버 직접 요청, 다른 tenant의 ID, 권한 철회 후 기존 탭, 페이지 새로고침, 캐시된 결과를 필수 검증 사례로 삼습니다.[^auth]

## 이해 확인

질문: 버튼이 없는데 API를 직접 호출하면 어떻게 됩니까? 해설: 서버가 권한을 검사해 거부해야 합니다. 질문: 클릭 직전에 권한을 잃으면? 해설: UI 판단이 오래되었더라도 서버가 거부하고 화면은 403에 따라 capability를 재조회하거나 철회해야 합니다.

## 근거와 한계

공식 API 문서를 근거로 작성한 학습 예제입니다. 코드 검사 범위와 미검증 항목은 [학습 안내](index.md)에 기록합니다. 실제 운영 부하·서버 복구·보조 기술 호환성을 검증한 실험 기록이 아닙니다.

[학습 순서](index.md) · [English](../../en/frontend/permission-based-ui.md)

## 출처

[^auth]: [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
