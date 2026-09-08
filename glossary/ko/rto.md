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

# RTO: 복구 시간 목표

## 요약

서비스 중단부터 서비스 복구까지 허용하는 시간 목표.

## 외부 사실

- RTO는 조직이 정한 서비스 중단부터 복원까지의 최대 허용 시간이다.[^dr]

## 적용과 혼동 방지

- DB 기동만으로 완료를 판정하지 않는다. 연결 전환·데이터 검증·사용자 기능 확인을 복구 완료 조건에 포함한다.

## 설계 예시

가정: 14:00 중단에 RTO 60분이면 15:00까지 정해진 서비스 복구 조건을 충족해야 한다. 이는 실제 복구 시험 결과가 아니다.

## 운영 확인

- [ ] 감지·판단·복원·전환을 포함한 전체 시간이 목표 안에 드는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다.

## 관련 지식

- [RPO: 복구 시점 목표](rpo.md)
- [RDS Backup: 복원 가능한 시점과 복구 절차](../../knowledge/ko/data/aws-rds-backup.md)

[English](../en/rto.md)

## 출처

[^dr]: [Business Continuity Plan: Recovery objectives (RTO and RPO)](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html)
