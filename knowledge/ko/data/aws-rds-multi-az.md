---
type: Concept
title: 'RDS Multi-AZ: instance와 cluster 구분'
description: 단일 standby 구성과 reader가 있는 cluster를 구분하고, 가용성과 읽기 확장을 따로 판단합니다.
concept_id: aws-rds-multi-az
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
- id: multi-instance
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html
  title: Multi-AZ DB instance deployments
- id: multi-cluster
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html
  title: Multi-AZ DB cluster deployments
---

# RDS Multi-AZ: instance와 cluster 구분

## 요약

DB 장애에 대비해 다른 가용 영역에 복제본을 두는 것이 RDS Multi-AZ 배포의 기본 생각입니다. 다만 DB instance와 DB cluster는 복제 구성과 읽기 처리 방식이 다릅니다. Multi-AZ라는 이름 뒤의 배포 유형까지 확인해야 합니다.[^multi-instance][^multi-cluster]

## 학습 목표

단일 standby 구성과 reader가 있는 cluster를 구분하고, 가용성과 읽기 확장을 따로 판단합니다.

## 선수 지식

[RDS for PostgreSQL](aws-rds-postgresql.md)과 [가용 영역](../../../glossary/ko/availability-zone.md)을 읽습니다. Failover는 장애 때 다른 DB로 역할을 전환하는 것이고, standby는 전환을 위해 대기하는 복제본입니다.

## 101 · 개념 이해

### 외부 사실

Multi-AZ DB instance는 다른 AZ에 동기 복제 standby 하나를 유지합니다. 이 standby는 애플리케이션 읽기 트래픽을 처리하지 않습니다.[^multi-instance]

Multi-AZ DB cluster는 같은 리전의 세 AZ에 writer 하나와 읽기 가능한 reader 둘을 두는 반동기 구성입니다. 지원은 엔진·버전·리전에 따라 확인합니다.[^multi-cluster]

RDS Multi-AZ cluster는 Aurora와 다릅니다. 읽기 replica 지연도 관측 대상입니다.[^multi-cluster]

## 201 · 예제에 적용하기

### 설계 예시

읽기 요청이 많아 대기 중인 DB로 부하를 보내려는 상황입니다. 먼저 배포 유형을 확인합니다. Single-standby Multi-AZ DB instance라면 standby가 애플리케이션 읽기를 처리하지 않으므로 그 계획을 적용할 수 없습니다.

읽기 처리가 필요하면 지원되는 Multi-AZ DB cluster나 read replica를 비교합니다. 읽기 지연 허용과 장애 전환 뒤 사용자 요청의 회복도 별도로 검증합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 가용성 필요와 읽기 확장 필요를 구분해 구성 유형을 결정합니다.

- Failover 중 끊긴 연결·실패한 트랜잭션·재시도 안전성을 애플리케이션 수준에서 검증합니다.

- 복제는 잘못된 데이터 변경도 전파할 수 있으므로 백업과 리전 재해복구를 별도 설계합니다.

### 운영 확인

- [ ] 문서·IaC에서 instance/cluster 유형이 명확한가요?
- [ ] writer/reader endpoint 사용과 읽기 최신성 요구가 일치하나요?
- [ ] Failover 후 실제 사용자 요청의 회복 시간을 측정했나요?

## 이해 확인

**질문:** Multi-AZ 복제가 있으면 잘못 변경한 데이터의 복구를 위한 백업은 필요 없을까요?

**해설:** 잘못된 변경도 복제될 수 있습니다. 장애 전환과 과거 시점 복구는 다른 시나리오이므로 백업 복구를 별도로 설계합니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [RDS Backup: 복원 가능한 시점과 복구 절차](aws-rds-backup.md)
- [Connection Pool: PostgreSQL 연결 예산과 RDS Proxy](aws-rds-connection-pooling.md)
- [Availability Zone (AZ): 가용 영역](../../../glossary/ko/availability-zone.md)
- [RTO: 복구 시간 목표](../../../glossary/ko/rto.md)

[English](../../en/data/aws-rds-multi-az.md)

## 출처

[^multi-instance]: [Multi-AZ DB instance deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html)
[^multi-cluster]: [Multi-AZ DB cluster deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html)
