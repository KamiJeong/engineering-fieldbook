---
type: Glossary Term
title: 'RPO: 복구 시점 목표'
description: 복구할 데이터의 허용 손실을 시간으로 표현하는 목표.
concept_id: rpo
language: ko
tags:
- recovery
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2027-09-09T00:46:30+00:00'
freshness:
  mode: current
  volatility: low
  review_days: 365
  reason: 용어 정의 중심이며 연결한 서비스 구현의 상세 사양은 제외한다.
sources:
- id: dr
  resource: https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html
  title: 'Business Continuity Plan: Recovery objectives (RTO and RPO)'
---

# RPO: 복구 시점 목표

## 요약

RPO(Recovery Point Objective, 복구 시점 목표)는 허용할 수 있는 데이터 손실을 시간으로 표현한 목표입니다. 서비스가 중단된 시점과 마지막으로 복구할 수 있는 데이터 시점 사이의 간격을 기준으로 합니다.[^dr]

## 외부 사실

RPO는 조직이 업무 요구에 따라 정하는 최대 허용 간격입니다. 백업을 보관하는 기간과는 구분합니다.[^dr]

## 설계 예시

14:00에 장애가 발생하고 RPO가 15분이라고 가정합니다. 13:45 또는 그 이후의 복구 지점이 필요합니다. 13:30까지만 복구할 수 있다면 30분 차이이므로 목표를 충족하지 못합니다. 실제 측정 결과가 아닌 목표 해석 예시입니다.

## 적용과 혼동 방지

백업을 오래 보관해도 최신 복구 지점이 충분히 최근이라는 뜻은 아닙니다. 실제 복원 가능한 시각과 복원 성공 여부를 확인합니다.

## 운영 확인

- [ ] 목표를 충족하는 복구 지점이 실제로 존재하고 복원 가능한가요?

## 근거와 한계

RPO는 목표이며 서비스가 자동으로 제공하는 보장이 아닙니다. 실제 손실과 복구 가능 범위는 운영 환경에서 확인합니다.

## 관련 지식

- [RTO: 복구 시간 목표](rto.md)
- [RDS Backup: 복원 가능한 시점과 복구 절차](../../knowledge/ko/data/aws-rds-backup.md)
- [RDS Multi-AZ: instance와 cluster 구분](../../knowledge/ko/data/aws-rds-multi-az.md)

[English](../en/rpo.md)

## 출처

[^dr]: [Business Continuity Plan: Recovery objectives (RTO and RPO)](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html)
