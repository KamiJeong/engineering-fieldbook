---
type: Glossary Term
title: Reasoning effort
description: Reasoning effort, its relationship to time and usage, and distinctions
  from model choice and Ultra.
concept_id: reasoning-effort
language: en
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
  reason: Model support and product controls change frequently; recheck official documentation
    monthly.
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
translation:
  source_language: ko
  source_concept_id: reasoning-effort
  source_fingerprint: sha256:6e52b9edd7cb1e764b8726dda2d5ffb225377307d00d7c8c5d94100f1ef0ebe6
  target_fingerprint: sha256:faea6980a61fee20187be78475ad065f3bdcec0669ab930a010df73e40836c9e
  synced_at: '2026-09-10T13:55:38+09:00'
  review_status: SYNCED
---

# Reasoning effort

## Term and aliases

Reasoning effort, effort, and the Korean term 추론 강도 describe a setting that guides how much a model thinks before producing an answer.

## Definition

Reasoning effort adjusts the work devoted to analysis and planning. Higher settings can help difficult problems but can increase time and token use. The model adapts reasoning to task difficulty even at one setting. Effort does not guarantee a fixed accuracy level or waiting time.[^reasoning]

The GPT-6 Astra API supports `low`, `medium`, `high`, `xhigh`, and `max`. Check support for each model; Astra does not support `none`.[^astra]

## Understand through an example

**Assumptions:** Use the same material for a short summary and a report comparing conflicting evidence. Check whether `low` meets the summary's completion criteria, and compare `medium` with `high` for the report. This is a hypothetical selection example, not a measured result.

Judge omissions, factual errors, rework, and completion time rather than length. Supply missing information before raising effort.

## Avoid confusion

- **It is separate from model choice.** Choosing Astra or Sol and choosing effort are different decisions.
- **It is different from output length.** Internal reasoning tokens are billed as API output tokens, so a short answer is not always inexpensive.[^reasoning]
- **It differs from Ultra.** Product Max uses more reasoning for one task; Ultra divides work among subagents. Ultra is not an Astra API effort value.[^work][^astra]
- **Interface labels can differ.** Official product documentation distinguishes Light in desktop, Work, and IDE from Low in the CLI. Check account and client options.[^work]

## Related knowledge

[GPT-6 Astra usage and comparison](../../knowledge/en/ai-engineering/gpt-6-astra.md) · [Glossary](index.md) · [한국어](../ko/reasoning-effort.md)

## Sources

[^reasoning]: [OpenAI — Reasoning models](https://developers.openai.com/api/docs/guides/reasoning)
[^astra]: [OpenAI — GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)
[^work]: [OpenAI — Models](https://learn.chatgpt.com/docs/models)
