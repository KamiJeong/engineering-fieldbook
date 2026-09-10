---
type: Glossary Term
title: '추론 강도: Reasoning effort'
description: 추론 강도의 의미와 시간·사용량의 관계, 모델 선택 및 Ultra와의 차이.
concept_id: reasoning-effort
language: ko
status: stable
generated:
  by: codex/gpt-6-astra
  at: '2026-09-10T13:55:38+09:00'
verified:
- by: codex/gpt-6-astra
  at: '2026-09-10T13:55:38+09:00'
stale_after: '2026-10-10T13:55:38+09:00'
freshness:
  mode: current
  volatility: high
  review_days: 30
  reason: 모델 지원 값과 제품 설정은 변경이 잦아 공식 자료를 월 단위로 재확인합니다.
sources:
- id: astra
  resource: https://developers.openai.com/api/docs/models/gpt-6-astra
  title: OpenAI — GPT-6 Astra
- id: reasoning
  resource: https://developers.openai.com/api/docs/guides/reasoning
  title: OpenAI — Reasoning models
- id: work
  resource: https://learn.chatgpt.com/docs/models
  title: OpenAI — Models
---

# 추론 강도: Reasoning effort

## 용어와 별칭

추론 강도, reasoning effort, effort는 모델이 답을 만들기 전에 얼마나 생각하도록 유도할지 정하는 설정을 뜻합니다.

## 정의

추론 강도는 모델의 분석·계획에 투입할 노력을 조절하는 설정입니다. 높은 설정은 어려운 문제에 도움이 될 수 있지만 시간과 토큰 사용량을 늘릴 수 있습니다. 같은 설정에서도 모델은 작업 난도에 맞춰 추론량을 조절합니다. 고정된 정확도나 대기 시간을 보장하지 않습니다.[^reasoning]

GPT-6 Astra API의 지원 값은 `low`, `medium`, `high`, `xhigh`, `max`입니다. 지원 목록은 모델별로 확인하며, Astra에서는 `none`을 사용할 수 없습니다.[^astra]

## 예제로 이해하기

**가정:** 같은 자료로 짧은 요약과 상충하는 근거의 비교 보고서를 만듭니다. 요약은 `low`에서 완료 기준을 충족하는지 확인하고, 비교 보고서는 `medium`과 `high`를 비교할 수 있습니다. 이는 선택 방법을 설명하는 가상 예제이며 측정 결과가 아닙니다.

결과는 글의 길이보다 누락·사실 오류·재작업·완료 시간을 기준으로 판단합니다. 자료가 빠졌다면 effort를 올리기 전에 자료를 보완합니다.

## 혼동 방지

- **모델과 별개입니다.** Astra와 Sol 중 무엇을 쓰는지와 어느 effort를 쓰는지는 다른 선택입니다.
- **출력 길이와 다릅니다.** 내부 추론 토큰도 API 출력 토큰으로 과금되므로 짧은 답변이 항상 저렴하지는 않습니다.[^reasoning]
- **Ultra와 다릅니다.** 제품의 Max는 한 작업에 더 많은 추론을, Ultra는 하위 에이전트의 작업 분담을 사용합니다. Ultra는 Astra API의 effort 값이 아닙니다.[^work][^astra]
- **화면 이름은 다를 수 있습니다.** 공식 제품 문서는 데스크톱·Work·IDE의 Light와 CLI의 Low를 구분합니다. 계정·클라이언트별 옵션을 확인합니다.[^work]

## 관련 지식

[GPT-6 Astra 활용과 비교](../../knowledge/ko/ai-engineering/gpt-6-astra.md) · [용어집](index.md) · [English](../en/reasoning-effort.md)

## 출처

[^reasoning]: [OpenAI — Reasoning models](https://developers.openai.com/api/docs/guides/reasoning)
[^astra]: [OpenAI — GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)
[^work]: [OpenAI — Models](https://learn.chatgpt.com/docs/models)
