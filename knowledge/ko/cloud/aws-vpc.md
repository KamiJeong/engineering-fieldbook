---
type: Concept
title: 'Amazon VPC: 주소 공간과 연결 경계'
description: VPC·서브넷·가용 영역의 관계를 설명하고, 주소 계획과 접근 제어를 구분합니다.
concept_id: aws-vpc
language: ko
tags:
- aws
- network
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2027-03-08T00:46:30+00:00'
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

서버와 데이터베이스가 통신하려면 사용할 주소 범위와 연결 경로가 필요합니다. Amazon VPC는 AWS 안에서 이 네트워크를 논리적으로 구분해 구성하는 단위입니다. VPC 안에 서브넷을 나누고 각 용도에 맞는 경로를 설정합니다.[^vpc]

## 학습 목표

VPC·서브넷·가용 영역의 관계를 설명하고, 주소 계획과 접근 제어를 구분합니다.

## 선수 지식

IP 주소는 네트워크에서 통신 대상을 식별하는 주소입니다. 주소 범위 표기인 [CIDR](../../../glossary/ko/cidr.md)와 배치 단위인 [가용 영역](../../../glossary/ko/availability-zone.md)을 먼저 읽습니다.

## 101 · 개념 이해

### 외부 사실

VPC는 IP 범위·Subnet·라우팅·연결 옵션을 구성하는 논리 네트워크입니다.[^vpc]

VPC는 한 리전의 AZ들에 걸치며, 일반 Subnet은 한 AZ 안에 존재합니다.[^vpc-basics][^subnets]

VPC와 Subnet의 주소는 CIDR로 계획합니다. 연결할 다른 네트워크와의 주소 중복은 연결 설계에서 검토해야 합니다.[^vpc-cidr]

## 201 · 예제에 적용하기

### 설계 예시

주소 범위가 10.40.0.0/16인 VPC를 가정합니다. 먼저 가용 영역별로 필요한 주소 블록을 나누고, 애플리케이션과 DB를 배치할 서브넷의 역할을 정합니다. 다음으로 연결할 다른 네트워크와 주소가 겹치는지, 확장할 여유가 있는지 확인합니다.

이 주소는 설명용입니다. 주소 범위를 나누었다고 통신 허용까지 완료되는 것은 아니므로 경로와 보안 그룹도 따로 확인합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 현재 서버 수만이 아니라 Task ENI·DB·확장 시 필요한 IP 여유를 계산합니다.

- VPC를 만들었다고 내부 모든 자원이 안전하다고 가정하지 말고 Route·SG·IAM 경계를 분리합니다.

- 운영/개발·계정·리전 분리는 필요한 격리와 연결 비용을 기준으로 결정합니다.

### 운영 확인

- [ ] CIDR 중복과 확장 여유를 검토했나요?
- [ ] DNS 해석과 Endpoint 접근 경로를 문서화했나요?
- [ ] 각 Subnet의 AZ·Route Table·역할을 찾을 수 있나요?

## 이해 확인

**질문:** VPC를 만들면 그 안의 모든 자원이 자동으로 안전해질까요?

**해설:** 주소 공간의 구분과 실제 접근 제어는 다릅니다. 라우팅, 보안 그룹, IAM 권한을 각각 검토해야 합니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

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
