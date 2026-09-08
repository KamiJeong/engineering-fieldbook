---
type: Concept
title: 'Amazon VPC: 주소 공간과 연결 경계'
description: AWS 리전 안에서 논리적으로 격리된 네트워크를 설계한다.
concept_id: aws-vpc
language: ko
tags:
- aws
- network
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2027-03-07T05:01:30Z'
freshness:
  mode: current
  volatility: low
  review_days: 180
  reason: 네트워크 기초 원리는 비교적 안정적이나 AWS의 연결 옵션 변화는 재확인한다.
sources:
- id: vpc
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/configure-your-vpc.html
  title: Your VPC
- id: vpc-basics
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-subnet-basics.html
  title: VPC basics
- id: subnets
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html
  title: Subnets for your VPC
- id: vpc-cidr
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html
  title: VPC CIDR blocks
---

# Amazon VPC: 주소 공간과 연결 경계

## 요약

AWS 리전 안에서 논리적으로 격리된 네트워크를 설계한다.

## 외부 사실

- VPC는 IP 범위·Subnet·라우팅·연결 옵션을 구성하는 논리 네트워크다.[^vpc]

- VPC는 한 리전의 AZ들에 걸치며, 일반 Subnet은 한 AZ 안에 존재한다.[^vpc-basics][^subnets]

- VPC와 Subnet의 주소는 CIDR로 계획한다. 연결할 다른 네트워크와의 주소 중복은 연결 설계에서 검토해야 한다.[^vpc-cidr]

## 선택 기준과 권고

- 현재 서버 수만이 아니라 Task ENI·DB·확장 시 필요한 IP 여유를 계산한다.

- VPC를 만들었다고 내부 모든 자원이 안전하다고 가정하지 말고 Route·SG·IAM 경계를 분리한다.

- 운영/개발·계정·리전 분리는 필요한 격리와 연결 비용을 기준으로 결정한다.

## 설계 예시

설계 예: VPC 10.40.0.0/16 안에 AZ별 주소 블록을 나누고 애플리케이션·DB Subnet을 분리한다. 이 범위는 예시이며 조직의 기존 네트워크와 대조한 뒤 선택한다.

## 운영 확인

- [ ] CIDR 중복과 확장 여유를 검토했는가?
- [ ] DNS 해석과 Endpoint 접근 경로를 문서화했는가?
- [ ] 각 Subnet의 AZ·Route Table·역할을 찾을 수 있는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [Public / Private Subnet: 라우팅으로 구분하기](aws-subnets.md)
- [Route Table: 목적지와 다음 경로](aws-route-table.md)
- [Security Group: 리소스 통신 허용 규칙](aws-security-group.md)
- [CIDR: IP 주소 범위와 prefix](../../../glossary/ko/cidr.md)
- [Availability Zone (AZ): 가용 영역](../../../glossary/ko/availability-zone.md)

[English](../../en/cloud/aws-vpc.md)

## 출처

[^vpc]: [Your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/configure-your-vpc.html)
[^vpc-basics]: [VPC basics](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-subnet-basics.html)
[^subnets]: [Subnets for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)
[^vpc-cidr]: [VPC CIDR blocks](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html)
