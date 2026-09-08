---
type: Checklist
title: Knowledge 작성·갱신·주간 점검 Checklist
description: 문서 갱신에서 근거·역사·번역·탐색을 빠뜨리지 않기 위한 완료 기준.
concept_id: knowledge-maintenance
language: ko
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 90
  reason: 저장소 정책·검사 도구 변경 시 즉시 재검증.
sources:
- id: maintenance
  resource: ../../policies/maintenance.md
  title: Knowledge maintenance policy
stale_after: '2026-12-07T04:30:37+00:00'
---

# Knowledge 유지보수 Checklist

## Purpose

새 문서, Verify/Refresh와 주간 점검에서 빠뜨리기 쉬운 검증을 확인한다. 빈 체크박스는 재사용 양식이며 이번 실행의 미완료 상태를 뜻하지 않는다.

## When to Use

문서 생성·의미 변경 후 또는 매주 화요일에 실행한다. 주간 점검은 검토 대상을 찾는 주기이고 문서별 review_days를 7일로 바꾸지 않는다. 월 1회 미완료 번역 수·검토 시간·반복 경고를 보고 부담을 조정한다.

## Checks

- [ ] 기존 concept_id·별칭·Glossary 검색 — 편집자 / 중복 없는 소유 위치 확인.
- [ ] 주장 종류와 적용 범위 구분 — 편집자 / 외부 사실·권고·실험·역사 구분.
- [ ] 근거 확인 — 검증자 / 실제 읽은 source 또는 실행 evidence 기록. 못 읽은 자료는 미검증으로 표시.
- [ ] Verify-only 보존 — 편집자 / 본문·generated diff 없음, 확인 사건과 freshness만 필요한 만큼 갱신.
- [ ] 역사 보존 — 편집자 / ADR·실험 결과 유지, 후속 판단은 새 기록과 링크.
- [ ] 번역 의미 대조 — 검토자 / 전제·권고 강도·예외·source 일치. 이후 fingerprint 갱신; 불확실하면 검토 상태 유지.
- [ ] 탐색 확인 — 편집자 / ko/en Scope index와 관련 문서 링크 연결.
- [ ] 자동 Audit — 편집자 / exit code 및 발견 사항 확인. 외부 자료 확인과 혼동하지 않음.
- [ ] 변경 이유 기록 — 편집자 / 의미 변화와 Verification만 log에 기록.
- [ ] Git 검토 — 편집자 / diff, 비밀 정보, 의도하지 않은 파일 확인 후 커밋.

## Completion Criteria

대상과 근거가 추적 가능하고 번역 상태가 정직하게 표시되어야 한다. 해결하지 못한 항목은 대상·이유·다음 조치와 함께 남긴다. 경고를 숨기기 위한 날짜·해시 수정은 완료로 인정하지 않는다. 오류 분류는 [Runbook](../../runbooks/ko/fieldbook-audit-failure.md)을 따른다.

## Evidence

이번 실행의 관측은 [실험 기록](../../experiments/ko/2026-09-08-fieldbook-audit.md)과 root log에서 찾는다. Checklist는 방법을 정의하고 실행별 결과는 별도로 기록한다. 자동 검사와 의미 검증을 구분하는 근거는 [Concept](../../knowledge/ko/testing/verification-vs-change-detection.md)에 있다.[^maintenance]

[^maintenance]: [작성·검증·출처·log 정책](../../policies/maintenance.md)

[English](../en/knowledge-maintenance.md)
