---
type: Concept
title: 'Internet Gateway: VPC 인터넷 연결의 경로 대상'
description: IGW 연결·라우팅·주소·접근 허용 조건을 함께 이해한다.
concept_id: aws-internet-gateway
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
- id: igw
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html
  title: Connect to the internet using an internet gateway
- id: subnets
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html
  title: Subnets for your VPC
---

# Internet Gateway: VPC 인터넷 연결의 경로 대상

## 요약

IGW 연결·라우팅·주소·접근 허용 조건을 함께 이해한다.

## 외부 사실

- IGW는 VPC에 연결하는 인터넷 통신 구성 요소이며 IPv4와 IPv6를 지원한다.[^igw]

- 직접 연결에는 IGW 방향의 route와 리소스의 공인 IPv4 또는 IPv6 주소가 필요하다. IPv4의 경우 IGW가 공인/사설 주소 매핑에 관여한다.[^igw]

- 일반 Public/Private Subnet 구분에서 IGW로 직접 향하는 route 유무가 핵심이다.[^subnets]

## 선택 기준과 권고

- IGW를 붙이는 작업과 Subnet을 공개하는 경로 변경을 별도 검토한다.

- 인터넷 egress와 외부에서 시작하는 ingress의 필요를 구분한다.

- 연결 장애를 주소 → Route → SG/NACL → 애플리케이션 순으로 추적한다.

## 설계 예시

공인 IPv4가 있어도 연결된 Route Table에 IGW 경로가 없으면 직접 인터넷 통신 경로가 완성되지 않는다. SG를 열기 전에 주소와 경로를 확인한다.

## 운영 확인

- [ ] IGW가 올바른 VPC에 붙어 있는가?
- [ ] 리소스 주소와 실제 Subnet route가 요구 통신을 지원하는가?
- [ ] 불필요한 외부 ingress를 허용하지 않았는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [Amazon VPC: 주소 공간과 연결 경계](aws-vpc.md)
- [Public / Private Subnet: 라우팅으로 구분하기](aws-subnets.md)
- [Route Table: 목적지와 다음 경로](aws-route-table.md)
- [NAT Gateway: egress와 가용성 모드](aws-nat-gateway.md)

[English](../../en/cloud/aws-internet-gateway.md)

## 출처

[^igw]: [Connect to the internet using an internet gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)
[^subnets]: [Subnets for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)
