---
type: Concept
title: 'AWS Lambda: 이벤트 기반 함수 실행'
description: 함수 호출의 시간·상태 제약을 설명하고, 같은 이벤트가 다시 전달될 때의 처리 기준을 세웁니다.
concept_id: aws-lambda
language: ko
tags:
- aws
- compute
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
- id: lambda-vpc-access
  resource: https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html
  title: Giving Lambda functions access to resources in an Amazon VPC
---

# AWS Lambda: 이벤트 기반 함수 실행

## 요약

파일 업로드처럼 어떤 일이 발생했을 때 코드를 실행하려면 이벤트 기반 함수를 사용할 수 있습니다. AWS Lambda Functions에서는 호출을 받아 실행할 함수를 작성하고 실행 환경 관리를 서비스에 맡깁니다. 여기서는 일반 함수 호출을 다루며 MicroVMs, Managed Instances와 장기 워크플로는 별도 범위입니다.[^lambda][^compute-guide]

## 학습 목표

함수 호출의 시간·상태 제약을 설명하고, 같은 이벤트가 다시 전달될 때의 처리 기준을 세웁니다.

## 선수 지식

함수 호출과 외부 API 요청의 의미를 알고 시작합니다. DB에 접근한다면 [연결 풀](../data/aws-rds-connection-pooling.md), 사설 네트워크를 사용한다면 [서브넷](aws-subnets.md)을 함께 확인합니다.

## 101 · 개념 이해

### 외부 사실

일반적인 Lambda Functions를 중심으로 설명합니다. 현재 MicroVMs와 Managed Instances 등 다른 실행 선택지는 이 범위와 구분합니다.[^lambda][^compute-guide]

일반 함수 호출의 timeout 상한은 현재 900초입니다. 실행 환경이 재사용돼도 호출 간 상태 보존에 의존하지 않습니다.[^lambda-limits][^lambda]

일반 VPC 연결 함수는 Public Subnet에 연결했다는 이유만으로 공인 IP나 인터넷 접근을 얻지 않습니다.[^lambda-vpc][^lambda-vpc-access]

## 201 · 예제에 적용하기

### 설계 예시

업로드 이벤트를 받아 파일을 처리하는 함수를 가정합니다. 같은 이벤트가 다시 전달될 수 있는 조건을 먼저 확인하고, 이벤트 식별자와 처리 상태를 이용해 이미 처리한 요청을 구분하는 방식을 검토합니다.

확인할 결과는 반복 실행으로 원하지 않는 부작용이 생기지 않는지입니다. 두 호출이 동시에 상태를 바꿀 때도 안전한지는 실제 저장소의 원자적 갱신 방식으로 검증해야 합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 짧은 이벤트 처리에 검토하고, 장시간 프로세스·세션이 핵심이면 실행 모델부터 비교합니다.

- 이벤트 소스별 재시도·중복 전달 조건을 확인하고 중복 처리를 안전하게 설계합니다.[^lambda-practices]

- 함수 확장이 DB 연결이나 외부 API 허용량을 압도하지 않도록 동시성과 대기열을 정합니다.

### 운영 확인

- [ ] timeout·오류·throttling·동시성·의존 서비스 지연을 관측하나요?
- [ ] 내부 DB와 외부 API 경로를 각각 검증했나요?
- [ ] 재시도된 이벤트의 중복 부작용을 검증했나요?

## 이해 확인

**질문:** 한 번의 호출이 성공했다면 재시도에 대한 검증도 끝났다고 볼 수 있을까요?

**해설:** 같은 이벤트의 반복·동시 처리와 실패 후 재시도는 별도로 확인해야 합니다. 단일 호출 성공은 중복 부작용이 없다는 증거가 아닙니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

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

[^lambda-vpc-access]: [Giving Lambda functions access to resources in an Amazon VPC](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html)
