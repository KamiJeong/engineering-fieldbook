---
type: Glossary Term
title: 'RTO: 복구 시간 목표'
description: 서비스 중단부터 서비스 복구까지 허용하는 시간 목표.
concept_id: rto
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

# RTO: 복구 시간 목표

## 요약

RTO(Recovery Time Objective, 복구 시간 목표)는 서비스 중단부터 복구까지 허용하는 최대 시간입니다. 무엇을 복구 완료로 볼지도 조직의 업무 요구에 맞춰 정합니다.[^dr]

## 외부 사실

RTO는 서비스가 사용할 수 없는 시간을 어느 정도까지 허용할지 나타내는 목표입니다. 데이터 손실의 시간 범위를 정하는 RPO와 구분합니다.[^dr]

## 설계 예시

14:00에 서비스가 중단되고 RTO가 60분이라고 가정합니다. 15:00까지 합의한 서비스 복구 조건을 충족해야 합니다. DB 기동 뒤 접속 전환과 사용자 기능 확인이 필요하다면 그 시간도 포함합니다. 실제 복구 시험 결과가 아닌 목표 해석 예시입니다.

## 적용과 혼동 방지

DB가 시작되었다는 사실만으로 사용자 서비스 복구를 판정하지 않습니다. 감지·판단·복원·전환의 전체 시간을 측정하고 데이터와 사용자 기능을 확인합니다.

## 운영 확인

- [ ] 서비스 중단부터 합의한 복구 완료까지의 전체 시간이 목표 안에 드나요?

## 근거와 한계

이 정의는 복구 시간을 측정하는 기준입니다. 특정 구성의 실제 복구 시간은 별도 시험과 관측으로 확인합니다.

## 관련 지식

- [RPO: 복구 시점 목표](rpo.md)
- [RDS Backup: 복원 가능한 시점과 복구 절차](../../knowledge/ko/data/aws-rds-backup.md)

[English](../en/rto.md)

## 출처

[^dr]: [Business Continuity Plan: Recovery objectives (RTO and RPO)](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html)
