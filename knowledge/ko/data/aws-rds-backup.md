---
type: Concept
title: 'RDS Backup: 복원 가능한 시점과 복구 절차'
description: 백업 보존 기간과 복원 가능 시각을 구분하고, 새 DB 복원 뒤 필요한 확인을 설명합니다.
concept_id: aws-rds-backup
language: ko
tags:
- aws
- database
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2027-01-07T00:46:30+00:00'
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

백업은 데이터를 보관하는 수단이고, 복구는 그 데이터를 이용해 서비스를 다시 사용할 수 있게 만드는 과정입니다. RDS 자동 백업은 보존 기간 안의 시점 복구를 지원합니다. 실제로 복원할 수 있는 시각과 복원 후 전환 절차까지 확인해야 합니다.[^backups][^pitr]

## 학습 목표

백업 보존 기간과 복원 가능 시각을 구분하고, 새 DB 복원 뒤 필요한 확인을 설명합니다.

## 선수 지식

[RDS for PostgreSQL](aws-rds-postgresql.md), 데이터 손실 목표인 [RPO](../../../glossary/ko/rpo.md), 중단 시간 목표인 [RTO](../../../glossary/ko/rto.md)를 읽습니다. PITR은 특정 시점으로 복원하는 기능입니다.

## 101 · 개념 이해

### 외부 사실

RDS 자동 백업은 보존 기간 내 시점 복구를 지원합니다. 수동 snapshot은 별도 생성하는 복구 지점이며, DB 인스턴스 삭제 시 자동 백업과 보존 동작이 다릅니다.[^backups]

DB instance의 PITR은 원본을 제자리에서 되돌리지 않고 새 DB 인스턴스를 만듭니다. 복원 뒤 parameter group·SG 등 설정도 확인해야 합니다.[^pitr]

LatestRestorableTime은 실제 최신 복구 가능 시각을 확인하는 항목입니다. 백업 보존 기간만으로 데이터 손실 목표 충족을 판단하지 않습니다.[^pitr]

## 201 · 예제에 적용하기

### 설계 예시

14:00에 잘못된 데이터 변경이 있었다고 가정합니다. 오류 전의 복원 가능 시점을 고르고 별도 DB 인스턴스를 복원하는 계획을 세웁니다. 그다음 데이터, 파라미터 그룹과 보안 그룹을 확인하고 애플리케이션 접속을 어떻게 전환할지 정합니다.

14:00 이후 정상적으로 입력된 데이터가 있다면 보존하거나 조정할 방법도 필요합니다. 이 예제는 복구 계획이며 실제 실행 시간이나 성공을 기록한 결과가 아닙니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 업무별 RPO와 RTO를 합의하고 복원→무결성 확인→접속 전환→서비스 확인까지 시간을 측정합니다.

- 잘못된 변경 복구는 Multi-AZ 전환과 다른 시나리오로 훈련합니다.

- 리전·계정 상실 시나리오가 필요하면 복사본·암호화 키·권한·복구 실행 위치를 함께 설계합니다.

### 운영 확인

- [ ] 실제 보존 기간과 최신 복원 가능 시각을 확인하나요?
- [ ] 삭제 시 자동 백업 보존·최종 snapshot·수동 snapshot 정책을 명시했나요?
- [ ] 복원된 DB의 데이터·설정·성능과 애플리케이션 전환을 검증했나요?

## 이해 확인

**질문:** 백업을 오래 보관한다는 사실만으로 짧은 RPO를 충족한다고 판단할 수 있을까요?

**해설:** 실제 최신 복원 가능 시각을 확인해야 합니다. 보존 기간은 얼마나 오래된 지점을 남기는지, RPO는 어느 정도의 데이터 손실을 허용하는지에 관한 조건입니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

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
