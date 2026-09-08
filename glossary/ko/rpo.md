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
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2027-09-08T05:01:30Z'
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

복구할 데이터의 허용 손실을 시간으로 표현하는 목표.

## 외부 사실

- RPO는 서비스 중단 전 마지막 복구 지점까지 허용할 수 있는 시간 간격이다.[^dr]

## 적용과 혼동 방지

- 백업 보존 일수와 RPO를 구분하고, 실제 복구 가능한 시점을 관측한다.

## 설계 예시

가정: 14:00 장애에 RPO 15분이면 13:45 이후의 복구 지점이 필요하다. 이는 목표 예시이며 측정 결과가 아니다.

## 운영 확인

- [ ] 목표를 충족하는 복구 지점이 실제로 존재하고 복원 가능한가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다.

## 관련 지식

- [RTO: 복구 시간 목표](rto.md)
- [RDS Backup: 복원 가능한 시점과 복구 절차](../../knowledge/ko/data/aws-rds-backup.md)
- [RDS Multi-AZ: instance와 cluster 구분](../../knowledge/ko/data/aws-rds-multi-az.md)

[English](../en/rpo.md)

## 출처

[^dr]: [Business Continuity Plan: Recovery objectives (RTO and RPO)](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html)
