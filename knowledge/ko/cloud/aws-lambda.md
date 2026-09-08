---
type: Concept
title: 'AWS Lambda: 이벤트 기반 함수 실행'
description: 호출 단위의 실행과 동시성·재시도·외부 의존성을 함께 설계한다.
concept_id: aws-lambda
language: ko
tags:
- aws
- compute
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
- id: lambda
  resource: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
  title: What is AWS Lambda?
- id: lambda-limits
  resource: https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
  title: Lambda quotas
- id: lambda-vpc
  resource: https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc-internet.html
  title: Enable internet access for VPC-connected Lambda functions
- id: lambda-practices
  resource: https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html
  title: Best practices for working with AWS Lambda functions
- id: compute-guide
  resource: https://docs.aws.amazon.com/decision-guides/latest/decision-guides/fargate-or-lambda.html
  title: AWS Fargate or AWS Lambda?
---

# AWS Lambda: 이벤트 기반 함수 실행

## 요약

호출 단위의 실행과 동시성·재시도·외부 의존성을 함께 설계한다.

## 외부 사실

- 일반적인 Lambda Functions를 중심으로 설명한다. 현재 MicroVMs와 Managed Instances 등 다른 실행 선택지는 이 범위와 구분한다.[^lambda][^compute-guide]

- 일반 함수 호출의 timeout 상한은 현재 900초다. 실행 환경이 재사용돼도 호출 간 상태 보존에 의존하지 않는다.[^lambda-limits][^lambda]

- 일반 VPC 연결 함수는 Public Subnet에 연결했다는 이유만으로 공인 IP나 인터넷 접근을 얻지 않는다.[^lambda-vpc]

## 선택 기준과 권고

- 짧은 이벤트 처리에 검토하고, 장시간 프로세스·세션이 핵심이면 실행 모델부터 비교한다.

- 이벤트 소스별 재시도·중복 전달 조건을 확인하고 중복 처리를 안전하게 설계한다.[^lambda-practices]

- 함수 확장이 DB 연결이나 외부 API 허용량을 압도하지 않도록 동시성과 대기열을 정한다.

## 설계 예시

업로드 이벤트의 식별자와 처리 상태를 기록해 중복 여부를 판단한다. 상태 전이의 원자성은 실제 데이터 저장 방식에 맞춰 검증한다.

## 운영 확인

- [ ] timeout·오류·throttling·동시성·의존 서비스 지연을 관측하는가?
- [ ] 내부 DB와 외부 API 경로를 각각 검증했는가?
- [ ] 재시도된 이벤트의 중복 부작용을 검증했는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [AWS Fargate: ECS의 관리형 실행 용량](aws-fargate.md)
- [Connection Pool: PostgreSQL 연결 예산과 RDS Proxy](../data/aws-rds-connection-pooling.md)
- [IAM Role: 신뢰 정책과 임시 세션 권한](../security/aws-iam-role.md)
- [Public / Private Subnet: 라우팅으로 구분하기](aws-subnets.md)

[English](../../en/cloud/aws-lambda.md)

## 출처

[^lambda]: [What is AWS Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
[^lambda-limits]: [Lambda quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)
[^lambda-vpc]: [Enable internet access for VPC-connected Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc-internet.html)
[^lambda-practices]: [Best practices for working with AWS Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
[^compute-guide]: [AWS Fargate or AWS Lambda?](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/fargate-or-lambda.html)
