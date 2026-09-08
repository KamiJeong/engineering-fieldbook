---
type: Concept
title: 'Connection Pool: PostgreSQL 연결 예산과 RDS Proxy'
description: 애플리케이션 동시성과 실제 DB 연결 수를 분리해 제어한다.
concept_id: aws-rds-connection-pooling
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
stale_after: '2026-12-07T05:01:30Z'
freshness:
  mode: current
  volatility: medium
  review_days: 90
  reason: 실행 옵션·권한 또는 서비스 동작 변화가 설계에 미치는 영향이 커 90일 후 재검토한다.
sources:
- id: proxy
  resource: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.howitworks.html
  title: How RDS Proxy works
---

# Connection Pool: PostgreSQL 연결 예산과 RDS Proxy

## 요약

애플리케이션 동시성과 실제 DB 연결 수를 분리해 제어한다.

## 외부 사실

- Connection pool은 연결을 재사용해 연결 생성·인증 비용을 줄이는 방식이다. RDS Proxy는 DB 앞에서 연결을 관리하고 안전한 경우 트랜잭션 단위로 재사용한다.[^proxy]

- 세션 상태 때문에 안전한 재사용이 어려우면 pinning으로 특정 연결을 유지할 수 있다. Proxy 연결 수와 실제 DB 연결 수를 동일시하지 않는다.[^proxy]

- RDS Proxy가 있어도 트랜잭션 중 장애와 취소를 애플리케이션이 처리해야 한다.[^proxy]

## 선택 기준과 권고

- 프로세스 수 × 프로세스별 pool 상한에 배치·관리·배포 중 중복 용량까지 더해 연결 예산을 계산한다.

- Pool 대기 timeout·쿼리 timeout·재시도 수를 함께 정하고 무한 대기·재시도를 피한다.

- 단순 연결 생성 최적화인지 급격한 확장 대응인지 목적을 구분해 애플리케이션 pool과 Proxy 도입을 판단한다.

## 설계 예시

가정 계산: 20 프로세스 × pool 10 + 기타 50 = 250 연결. DB 예산이 300이면 평시에는 맞지만 배포 중 프로세스가 40이면 450으로 초과한다. 실제 측정값이 아닌 용량 계획 예시다.

## 운영 확인

- [ ] 최대 확장과 rolling 배포 때 DB 연결 예산을 넘는가?
- [ ] pool 대기·실제 연결·pinning·긴 트랜잭션을 관측하는가?
- [ ] 장애 뒤 오래된 연결 폐기와 재시도를 시험했는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [RDS for PostgreSQL: 관리형 DB의 책임 경계](aws-rds-postgresql.md)
- [RDS Multi-AZ: instance와 cluster 구분](aws-rds-multi-az.md)
- [AWS Lambda: 이벤트 기반 함수 실행](../cloud/aws-lambda.md)
- [Amazon ECS: Task와 Service의 오케스트레이션](../cloud/aws-ecs.md)

[English](../../en/data/aws-rds-connection-pooling.md)

## 출처

[^proxy]: [How RDS Proxy works](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.howitworks.html)
