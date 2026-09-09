---
type: Concept
title: 변경 감지와 지식 검증을 분리하기
description: Fieldbook 실험을 바탕으로 fingerprint, freshness와 의미 검증의 책임을 구분한다.
concept_id: verification-vs-change-detection
language: ko
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
- by: codex/gpt-6
  at: '2026-09-08T04:33:59+00:00'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: 저장소 정책·검사 도구 변경 시 즉시 재검증.
sources:
- id: checker
  resource: ../../../skills/refresh-fieldbook/scripts/fieldbook.py
  title: Checker implementation
- id: experiment
  resource: ../../../experiments/evidence/2026-09-08-fieldbook-audit/result.json
  title: Observed experiment results
stale_after: '2027-01-07T00:46:30+00:00'
---

# 변경 감지와 지식 검증을 분리하기

## Summary

문서 검사에서 정상 결과가 나와도 설명이 사실과 맞는지, 번역이 같은 의미인지는 따로 확인해야 합니다. 변경 감지는 마지막 검토본에서 달라진 입력을 찾는 작업입니다. 지식 검증은 주장을 근거와 적용 조건에 대조하는 작업입니다.

## 학습 목표

해시 기반 변경 감지와 의미 검증을 구분하고, 검사 결과를 보고 다음 검토 작업을 선택합니다.

## 선수 지식

[내용 지문](../../../glossary/ko/content-fingerprint.md)을 먼저 읽습니다. 여기서 CLI는 터미널 명령으로 실행하는 도구이고, fixture는 검사 조건을 만들기 위해 준비한 테스트용 파일입니다.

## 101 · 개념 이해

### 구현으로 확인한 사실

Fieldbook은 내용 지문을 마지막 검토 시점의 지문과 비교합니다. 본문과 해시 입력 필드를 그대로 두고 검증 메타데이터만 갱신하면 번역 해시는 유지됩니다. `stale_after`는 재검토할 시점이며, 날짜가 지났다는 이유만으로 내용이 거짓이라고 판단하지 않습니다.[^checker]

## 201 · 예제에 적용하기

### 직접 수행한 실험

다음은 2026-09-08에 기록된 로컬 실험의 관측입니다. 격리된 테스트 파일에서 한국어를 수정하면 TRANSLATION_STALE, 영어만 수정하면 CONTENT_DIVERGED가 나왔습니다. 영어 본문을 무관한 내용으로 바꾸고 대상 지문까지 다시 설정한 경우에는 SYNCED가 나왔습니다.[^experiment]

이 결과를 읽을 때는 두 질문을 나눕니다. “현재 입력이 저장된 지문과 일치하는가?”에는 검사 결과로 답할 수 있습니다. “영어가 한국어의 의미를 전달하는가?”에는 두 본문을 읽고 답해야 합니다. 이 실험은 해시 결함이나 번역 품질 점수를 측정한 것이 아닙니다.

## 301 · 조건에 따라 판단하기

### Engineering Recommendation

- 자동 검사는 검토할 문서를 찾는 데 사용합니다. SYNCED나 exit 0을 기술 검증 완료로 보고하지 않습니다.
- 내용이 맞아 검증만 수행하는 Verify에서는 본문과 `generated`를 보존합니다. 확인한 출처와 범위를 기록하고 날짜만 연장하지 않습니다.
- 번역의 전제·권고 강도·예외를 실제로 대조한 뒤 새 지문을 기록합니다.
- 한 오류를 해결한 결과와 전체 Audit 통과를 구분합니다. 대상 오류가 사라져도 다른 문제가 남을 수 있습니다.

이 권고는 이 저장소의 검사 도구와 관측 범위에 적용합니다. 다른 시스템의 보안이나 성능에 대한 일반적인 결론은 아닙니다.

## 이해 확인

**질문:** 영어 본문을 읽지 않고 지문만 다시 기록해 SYNCED가 나왔다면 번역 검토를 마친 것일까요?

**해설:** 지문과 현재 파일이 일치한다는 조건만 확인한 것입니다. 두 언어의 주장·조건·예외·근거가 같은지는 별도로 읽고 비교해야 합니다.

## Evidence and Limits

원 실험은 로컬 파일과 CLI 동작을 대상으로 했습니다. 모델의 번역 품질, 외부 URL 내용 변경, 실제 서비스 장애 복구는 측정하지 않았습니다. 검토 주기는 120일이며 검사 도구나 정책이 바뀌면 다시 확인합니다. 후속 검토는 [문서 변경 이력](../../../log.md)에 기록하고 과거 실험 결과는 보존합니다.

## Related Knowledge

[실험 기록](../../../experiments/ko/2026-09-08-fieldbook-audit.md) · [유지보수 체크리스트](../../../checklists/ko/knowledge-maintenance.md) · [Audit 실패 대응](../../../runbooks/ko/fieldbook-audit-failure.md)

[^checker]: [검사 도구 구현](../../../skills/refresh-fieldbook/scripts/fieldbook.py)
[^experiment]: [실제 실행 결과: 11개 case](../../../experiments/evidence/2026-09-08-fieldbook-audit/result.json)

[English](../../en/testing/verification-vs-change-detection.md)
