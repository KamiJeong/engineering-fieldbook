---
type: Concept
title: 'RDS Backup: 복원 가능한 시점과 복구 절차'
description: 보관된 백업이 아니라 복원·검증·전환까지 포함한 복구 능력을 관리한다.
concept_id: aws-rds-backup
language: ko
tags:
- aws
- database
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2027-01-06T05:01:30Z'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: 관리형 서비스의 지원 범위와 운영 동작을 120일 후 재검토한다.
sources:
- id: backups
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html
  title: Working with automated backups
- id: pitr
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html
  title: Restoring a DB instance to a specified time
---

# RDS Backup: 복원 가능한 시점과 복구 절차

## 요약

보관된 백업이 아니라 복원·검증·전환까지 포함한 복구 능력을 관리한다.

## 외부 사실

- RDS 자동 백업은 보존 기간 내 시점 복구를 지원한다. 수동 snapshot은 별도 생성하는 복구 지점이며, DB 인스턴스 삭제 시 자동 백업과 보존 동작이 다르다.[^backups]

- DB instance의 PITR은 원본을 제자리에서 되돌리지 않고 새 DB 인스턴스를 만든다. 복원 뒤 parameter group·SG 등 설정도 확인해야 한다.[^pitr]

- LatestRestorableTime은 실제 최신 복구 가능 시각을 확인하는 항목이다. 백업 보존 기간만으로 데이터 손실 목표 충족을 판단하지 않는다.[^pitr]

## 선택 기준과 권고

- 업무별 RPO와 RTO를 합의하고 복원→무결성 확인→접속 전환→서비스 확인까지 시간을 측정한다.

- 잘못된 변경 복구는 Multi-AZ 전환과 다른 시나리오로 훈련한다.

- 리전·계정 상실 시나리오가 필요하면 복사본·암호화 키·권한·복구 실행 위치를 함께 설계한다.

## 설계 예시

가정: 14:00의 오작업 전 시점으로 별도 DB를 복원한다. 14:00 이후 정상 변경을 어떻게 보존·조정할지까지 결정해야 하며, 이 예시는 실행한 복구 기록이 아니다.

## 운영 확인

- [ ] 실제 보존 기간과 최신 복원 가능 시각을 확인하는가?
- [ ] 삭제 시 자동 백업 보존·최종 snapshot·수동 snapshot 정책을 명시했는가?
- [ ] 복원된 DB의 데이터·설정·성능과 애플리케이션 전환을 검증했는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [RDS for PostgreSQL: 관리형 DB의 책임 경계](aws-rds-postgresql.md)
- [RDS Multi-AZ: instance와 cluster 구분](aws-rds-multi-az.md)
- [AWS KMS: 암호화 키와 복호화 권한](../security/aws-kms.md)
- [RPO: 복구 시점 목표](../../../glossary/ko/rpo.md)
- [RTO: 복구 시간 목표](../../../glossary/ko/rto.md)

[English](../../en/data/aws-rds-backup.md)

## 출처

[^backups]: [Working with automated backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html)
[^pitr]: [Restoring a DB instance to a specified time](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html)
