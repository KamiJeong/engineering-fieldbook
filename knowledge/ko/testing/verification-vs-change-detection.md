---
type: Concept
title: 변경 감지와 지식 검증을 분리하기
description: Fieldbook 실험을 바탕으로 fingerprint, freshness와 의미 검증의 책임을 구분한다.
concept_id: verification-vs-change-detection
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
  review_days: 120
  reason: 저장소 정책·검사 도구 변경 시 즉시 재검증.
sources:
- id: checker
  resource: ../../../skills/refresh-fieldbook/scripts/fieldbook.py
  title: Checker implementation
- id: experiment
  resource: ../../../experiments/evidence/2026-09-08-fieldbook-audit/result.json
  title: Observed experiment results
stale_after: '2027-01-06T04:33:59+00:00'
---

# 변경 감지와 지식 검증을 분리하기

## Summary

변경 감지는 이전 검토본과 달라진 입력을 찾는다. 지식 검증은 주장이 근거·적용 조건과 맞는지 확인한다. 이 둘을 같은 완료 조건으로 사용하면 오래된 사실이나 잘못된 번역을 정상으로 오인할 수 있다.

## 구현으로 확인한 사실

Fieldbook은 [content fingerprint](../../../glossary/ko/content-fingerprint.md)로 마지막 검토본과의 차이를 감지한다. 본문 변경 없이 verification Metadata만 갱신하면 번역 해시는 유지된다. `stale_after`는 검증 필요 시점을 표시하며 내용이 틀렸다는 판정은 아니다.[^checker]

## 직접 수행한 실험

격리 fixture에서 한국어 수정은 TRANSLATION_STALE, 영어 독립 수정은 CONTENT_DIVERGED를 만들었다. 반면 의미가 무관한 영어로 바꾸고 target fingerprint를 다시 설정하면 SYNCED가 나왔다. 이는 해시 구현 오류를 발견한 결과가 아니라 의미 검토가 별도로 필요함을 보인 관측이다.[^experiment]

## Engineering Recommendation

- 자동 검사는 검토 후보를 찾는 데 사용한다. SYNCED나 exit 0을 기술 검증 완료라고 보고하지 않는다.
- Verify-only에서는 본문과 generated를 보존한다. 날짜만 연장하지 않고 확인한 근거와 범위를 남긴다.
- 번역의 조건·권고 강도·예외를 실제로 대조한 후에만 새 fingerprint를 기록한다.
- Runbook 복구는 대상 문제 해결과 전체 Audit을 구분한다. 한 오류를 수정했어도 다른 문제가 남을 수 있다.

이 권고는 이 저장소의 도구와 관측 범위에 적용한다. 다른 시스템의 보안·성능을 일반화하지 않는다.

## Evidence and Limits

실험은 로컬 파일과 CLI를 대상으로 했으며 모델의 번역 품질, 외부 URL 내용 변경, 실제 서비스 장애 복구는 측정하지 않았다. 검증 주기는 초기 120일이며 도구나 정책 변경 시 즉시 재검토한다.

## Related Knowledge

[실험 기록](../../../experiments/ko/2026-09-08-fieldbook-audit.md) · [유지보수 Checklist](../../../checklists/ko/knowledge-maintenance.md) · [Audit 실패 대응](../../../runbooks/ko/fieldbook-audit-failure.md)

[^checker]: [검사 도구 구현](../../../skills/refresh-fieldbook/scripts/fieldbook.py)
[^experiment]: [실제 실행 결과: 11개 case](../../../experiments/evidence/2026-09-08-fieldbook-audit/result.json)

[English](../../en/testing/verification-vs-change-detection.md)
