---
type: Glossary Term
title: 'Content fingerprint: 내용 지문'
description: 마지막 검토본과의 변경을 감지하기 위해 선택한 내용을 요약한 해시.
concept_id: content-fingerprint
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
  resource: ../../skills/refresh-fieldbook/scripts/fieldbook.py
  title: Fieldbook checker
- id: translation
  resource: ../../policies/translation.md
  title: Translation policy
stale_after: '2027-01-06T04:33:59+00:00'
---

# Content fingerprint / 내용 지문

## 정의와 별칭

이 저장소에서 fingerprint는 선택한 Metadata와 본문을 정규화한 뒤 계산한 `sha256:` 접두사 해시다. 내용 지문 또는 콘텐츠 fingerprint라고 부른다.[^checker]

같은 문서의 현재 해시를 마지막 검토 시점의 해시와 비교한다. 한국어와 영어 해시가 서로 같은지를 비교하지 않는다. `verified`, `generated`, `stale_after`는 입력에서 제외된다.[^translation]

## 혼동 방지

해시는 의미가 맞는지, 출처가 현재도 유효한지, 누가 검토했는지 증명하지 않는다. 여기서는 전자서명이나 신뢰 점수로 사용하지 않는다.

## Related Knowledge

[변경 감지와 검증의 차이](../../knowledge/ko/testing/verification-vs-change-detection.md)

[^checker]: [fingerprint 구현](../../skills/refresh-fieldbook/scripts/fieldbook.py)
[^translation]: [입력 필드와 동기화 계약](../../policies/translation.md)

[English](../en/content-fingerprint.md)
