---
type: Runbook
title: Fieldbook Audit 실패 대응
description: 로컬 Fieldbook 검사 실패를 분류하고 원인을 수정한 뒤 다시 검증하는 절차.
concept_id: fieldbook-audit-failure
language: ko
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
- by: codex/gpt-6
  at: '2026-09-08T04:33:59+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 90
  reason: 저장소 정책·검사 도구 변경 시 즉시 재검증.
sources:
- id: result
  resource: ../../experiments/evidence/2026-09-08-fieldbook-audit/result.json
  title: Local fault injection results
- id: checker
  resource: ../../skills/refresh-fieldbook/scripts/fieldbook.py
  title: CLI implementation
stale_after: '2026-12-07T04:33:59+00:00'
---

# Runbook: Fieldbook Audit 실패 대응

## Trigger and Symptoms

문서 작성·Refresh·주간 점검에서 CLI가 exit 1/2를 반환하거나 traceback으로 정상 보고서를 만들지 못한다. EXTERNAL_UNCHECKED만 있는 exit 0은 외부 확인이 남아 있다는 뜻이다.

## Scope and Environment

이 저장소의 로컬 파일과 Python 검사 도구가 대상이다. 실제 API/AWS/DB 장애 대응 절차가 아니다. 검증 환경은 Linux x86_64, Python 3.12.3, PyYAML 6.0.1이다.

## Owner and Escalation

담당자는 현재 문서 편집자다. 출처 충돌·영어 의미·과거 기록 정정이 모호하면 저장소 소유자에게 대상 문서와 근거를 제시한다. 미리 정해진 Pager나 외부 서비스 담당자를 가정하지 않는다.

## Prerequisites and Access

저장소 root에서 실행한다. Python과 PyYAML, 로컬 파일 읽기 권한이 필요하다. 편집 전 Git 상태와 자신의 변경 범위를 확인한다. RTK가 없는 환경에서는 `rtk proxy`를 뺀 동일 Python 명령을 사용한다.

## Diagnosis

```bash
rtk git status --short
rtk proxy python3 skills/refresh-fieldbook/scripts/fieldbook.py audit --json
```

- exit 2: stderr에서 잘못된 root/인자/시간 형식을 확인한다. PyYAML 누락이면 설치 안내를 따른다. Dependency 복구는 이번 실험에서 주입·검증하지 않았다.
- exit 1: code와 path를 읽고 아래 표로 분류한다.
- traceback 또는 JSON 부재: 정상 Audit으로 취급하지 않는다. Python·PyYAML 버전과 stderr를 보존하고 검사 도구 문제로 조사한다.

## Mitigation and Recovery

| 신호 | 조치 |
| --- | --- |
| PARSE_ERROR / OKF_TYPE | 해당 문서의 YAML 중복·구분자·필수 type을 수정하고 validate |
| BROKEN_LINK | 목표 파일이 이동했는지 확인해 상대 경로를 수정. 존재하지 않는 지식은 유효한 Scope index로 안내 |
| MISSING_TRANSLATION | 원문을 확인하고 대응 영어 문서를 작성하거나 미완료 항목으로 남김 |
| TRANSLATION_STALE / CONTENT_DIVERGED | 두 언어의 주장·전제·예외를 대조. 의미 확인 후에만 fingerprint 갱신 |
| STALE / UNVERIFIED | authoritative source나 로컬 근거를 실제로 확인하는 Verify 수행. TTL만 연장하지 않음 |

## Rollback and Stop Conditions

다른 편집자의 변경과 자신의 변경이 섞여 있으면 자동 복원을 중단한다. 실제 저장소에서는 해당 변경의 diff를 확인하고 자신의 잘못된 hunk만 수정한다. 일괄 reset/restore나 파일 삭제를 복구 기본값으로 사용하지 않는다.

실험의 원본 bytes 복원은 일회용 fixture에서만 수행했다. 역사적 결과·ADR을 최신 사실로 덮어쓰지 않는다. 근거가 없으면 해결되지 않은 상태를 명시한다.

## Validation

수정한 범위의 하위 검사를 먼저 실행하고 전체 Audit을 다시 실행한다. 해당 code가 사라졌는지와 다른 문제가 남는지를 따로 확인한다. 도구를 변경했다면 기존 unittest를 실행한다. 외부 링크 접속과 의미 검토는 수동으로 마무리한다.

## Last Operational Verification

`2026-09-08T04:24:48+00:00`에 Agent가 로컬 CLI에 잘못된 root, YAML, 번역, 링크와 기한 변형을 주입했다. 깨진 링크를 fixture에서 복구한 후 exit 0을 관찰했다.[^result] stable은 이 로컬 범위에 한정되며 Cloud 서비스 복구나 Dependency 재설치를 검증했다는 뜻이 아니다. 원본 결과와 한계는 [실험 기록](../../experiments/ko/2026-09-08-fieldbook-audit.md)에 있다.

## Follow-up

의미 있는 정정·검증은 log에 대상·이유·범위·번역 결과를 기록한다. 절차 변경이나 도구 변경 시 즉시 재검증하며 기본 주기는 90일이다.

[^result]: [로컬 오류 주입·복구 결과](../../experiments/evidence/2026-09-08-fieldbook-audit/result.json)

[English](../en/fieldbook-audit-failure.md)
