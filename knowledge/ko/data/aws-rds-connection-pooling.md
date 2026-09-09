---
type: Concept
title: 'Connection Pool: PostgreSQL 연결 예산과 RDS Proxy'
description: 연결 재사용을 설명하고, 평상시와 배포 중의 최대 연결 수를 계산해 한도와 비교합니다.
concept_id: aws-rds-connection-pooling
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
stale_after: '2026-12-08T00:46:30+00:00'
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

애플리케이션이 DB에 요청을 보낼 때마다 연결을 새로 만들면 연결 준비와 인증을 반복합니다. 연결 풀(connection pool)은 연결을 보관해 다시 사용하는 방식입니다. 애플리케이션의 연결 수와 프록시 뒤 실제 DB 연결 수는 구분해서 관리해야 합니다.[^proxy]

## 학습 목표

연결 재사용을 설명하고, 평상시와 배포 중의 최대 연결 수를 계산해 한도와 비교합니다.

## 선수 지식

[RDS for PostgreSQL](aws-rds-postgresql.md)을 읽습니다. 프로세스는 실행 중인 프로그램 단위이고, 이 문서의 pool 상한은 프로세스 하나가 유지할 최대 연결 수를 뜻합니다.

## 101 · 개념 이해

### 외부 사실

Connection pool은 연결을 재사용해 연결 생성·인증 비용을 줄이는 방식입니다. RDS Proxy는 DB 앞에서 연결을 관리하고 안전한 경우 트랜잭션 단위로 재사용합니다.[^proxy]

세션의 상태 때문에 다른 세션에 연결을 안전하게 재사용하기 어려우면 같은 연결을 유지할 수 있습니다. 이 동작을 pinning이라고 합니다. Proxy 연결 수와 실제 DB 연결 수를 동일시하지 않습니다.[^proxy]

RDS Proxy가 있어도 트랜잭션 중 장애와 취소를 애플리케이션이 처리해야 합니다.[^proxy]

## 201 · 예제에 적용하기

### 설계 예시

다음은 실제 측정값이 아닌 용량 계획 예시입니다. 프로세스 20개가 각각 최대 10개 연결을 사용하고 배치·관리 작업 등에 50개가 필요하다고 가정합니다. 최대 연결 수는 20 × 10 + 50 = 250개입니다.

배포 중 기존 프로세스와 새 프로세스가 함께 실행되어 40개가 되면 40 × 10 + 50 = 450개입니다. DB 연결 예산이 300개라면 평상시에는 맞지만 배포 중에는 초과합니다.

이 계산은 애플리케이션이 DB에 직접 연결하는 경우의 상한 예시입니다. RDS Proxy를 사용한다면 클라이언트와 실제 DB 연결 수, 특정 연결을 계속 사용하는 pinning을 따로 관측해야 합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 프로세스 수 × 프로세스별 pool 상한에 배치·관리·배포 중 중복 용량까지 더해 연결 예산을 계산합니다.

- Pool 대기 timeout·쿼리 timeout·재시도 수를 함께 정하고 무한 대기·재시도를 피합니다.

- 단순 연결 생성 최적화인지 급격한 확장 대응인지 목적을 구분해 애플리케이션 pool과 Proxy 도입을 판단합니다.

### 운영 확인

- [ ] 최대 확장과 rolling 배포 때 DB 연결 예산을 넘나요?
- [ ] pool 대기·실제 연결·pinning·긴 트랜잭션을 관측하나요?
- [ ] 장애 뒤 오래된 연결 폐기와 재시도를 시험했나요?

## 이해 확인

**질문:** 프로세스별 pool 크기를 그대로 두고 프로세스 수만 두 배로 늘리면 DB 연결 예산은 그대로일까요?

**해설:** 직접 연결 예제에서는 프로세스별 상한을 모두 더하므로 예산도 다시 계산해야 합니다. 배포 중 중복 실행과 배치·관리 연결을 포함합니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [RDS for PostgreSQL: 관리형 DB의 책임 경계](aws-rds-postgresql.md)
- [RDS Multi-AZ: instance와 cluster 구분](aws-rds-multi-az.md)
- [AWS Lambda: 이벤트 기반 함수 실행](../cloud/aws-lambda.md)
- [Amazon ECS: Task와 Service의 오케스트레이션](../cloud/aws-ecs.md)

[English](../../en/data/aws-rds-connection-pooling.md)

## 출처

[^proxy]: [How RDS Proxy works](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.howitworks.html)
