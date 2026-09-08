---
type: Concept
title: 'RDS Multi-AZ: instance와 cluster 구분'
description: 고가용성 배포 형태와 읽기 처리 가능 여부를 구분한다.
concept_id: aws-rds-multi-az
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
- id: multi-instance
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html
  title: Multi-AZ DB instance deployments
- id: multi-cluster
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html
  title: Multi-AZ DB cluster deployments
---

# RDS Multi-AZ: instance와 cluster 구분

## 요약

고가용성 배포 형태와 읽기 처리 가능 여부를 구분한다.

## 외부 사실

- Multi-AZ DB instance는 다른 AZ에 동기 복제 standby 하나를 유지한다. 이 standby는 애플리케이션 읽기 트래픽을 처리하지 않는다.[^multi-instance]

- Multi-AZ DB cluster는 같은 리전의 세 AZ에 writer 하나와 읽기 가능한 reader 둘을 두는 반동기 구성이다. 지원은 엔진·버전·리전에 따라 확인한다.[^multi-cluster]

- RDS Multi-AZ cluster는 Aurora와 다르다. 읽기 replica 지연도 관측 대상이다.[^multi-cluster]

## 선택 기준과 권고

- 가용성 필요와 읽기 확장 필요를 구분해 구성 유형을 결정한다.

- Failover 중 끊긴 연결·실패한 트랜잭션·재시도 안전성을 애플리케이션 수준에서 검증한다.

- 복제는 잘못된 데이터 변경도 전파할 수 있으므로 백업과 리전 재해복구를 별도 설계한다.

## 설계 예시

standby 하나를 가진 DB instance에 읽기 부하를 넘기려는 설계는 성립하지 않는다. Reader가 필요하면 해당 구성을 지원하는 cluster 또는 read replica를 별도 비교한다.

## 운영 확인

- [ ] 문서·IaC에서 instance/cluster 유형이 명확한가?
- [ ] writer/reader endpoint 사용과 읽기 최신성 요구가 일치하는가?
- [ ] Failover 후 실제 사용자 요청의 회복 시간을 측정했는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [RDS Backup: 복원 가능한 시점과 복구 절차](aws-rds-backup.md)
- [Connection Pool: PostgreSQL 연결 예산과 RDS Proxy](aws-rds-connection-pooling.md)
- [Availability Zone (AZ): 가용 영역](../../../glossary/ko/availability-zone.md)
- [RTO: 복구 시간 목표](../../../glossary/ko/rto.md)

[English](../../en/data/aws-rds-multi-az.md)

## 출처

[^multi-instance]: [Multi-AZ DB instance deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html)
[^multi-cluster]: [Multi-AZ DB cluster deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html)
