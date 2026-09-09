---
type: Glossary Term
title: 'Content fingerprint: 내용 지문'
description: 마지막 검토본과의 변경을 감지하기 위해 선택한 내용을 요약한 해시.
concept_id: content-fingerprint
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
  resource: ../../skills/refresh-fieldbook/scripts/fieldbook.py
  title: Fieldbook checker
- id: translation
  resource: ../../policies/translation.md
  title: Translation policy
stale_after: '2027-01-07T00:46:30+00:00'
---

# Content fingerprint: 내용 지문

## 정의와 별칭

내용 지문(content fingerprint)은 마지막 검토본에서 내용이 바뀌었는지 찾기 위한 해시입니다. 이 저장소는 선택한 메타데이터와 본문을 정규화한 뒤 `sha256:` 접두사의 해시를 계산합니다.[^checker]

한국어와 영어의 해시를 서로 비교하지 않습니다. 각 문서의 현재 해시를 그 문서의 마지막 검토 시점 해시와 비교합니다. `verified`, `generated`, `stale_after`는 입력에서 제외됩니다.[^translation]

## 예제로 이해하기

한국어 본문이 바뀌면 저장된 한국어 지문과 달라져 번역 검토 후보가 됩니다. 본문을 그대로 두고 검증 시각만 바꾸는 경우에는 번역 지문이 유지됩니다. 어떤 필드가 해시 입력에 포함되는지 확인하면 두 결과의 차이를 설명할 수 있습니다.[^checker]

## 혼동 방지

해시는 의미가 맞는지, 출처가 현재도 유효한지, 누가 검토했는지 증명하지 않습니다. 여기서는 전자서명이나 신뢰 점수로 사용하지 않습니다.

## 관련 지식

[변경 감지와 검증의 차이](../../knowledge/ko/testing/verification-vs-change-detection.md)

[English](../en/content-fingerprint.md)

## 출처

[^checker]: [Fieldbook checker](../../skills/refresh-fieldbook/scripts/fieldbook.py)
[^translation]: [Translation policy](../../policies/translation.md)
