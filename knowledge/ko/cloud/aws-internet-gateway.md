---
type: Concept
title: 'Internet Gateway: VPC 인터넷 연결의 경로 대상'
description: IGW 연결, 경로, 주소, 통신 허용이 각각 필요한 이유를 설명합니다.
concept_id: aws-internet-gateway
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
- id: igw
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html
  title: Connect to the internet using an internet gateway
- id: subnets
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html
  title: Subnets for your VPC
---

# Internet Gateway: VPC 인터넷 연결의 경로 대상

## 요약

인터넷 게이트웨이(IGW)는 VPC와 인터넷이 통신할 수 있도록 연결하는 구성 요소입니다. VPC에 연결하고 라우팅 대상으로 지정해 사용합니다. 인터넷 통신 여부는 IGW뿐 아니라 주소와 접근 허용 설정을 함께 보고 판단합니다.[^igw]

## 학습 목표

IGW 연결, 경로, 주소, 통신 허용이 각각 필요한 이유를 설명합니다.

## 선수 지식

[서브넷](aws-subnets.md)과 [라우팅 테이블](aws-route-table.md)을 읽습니다. Ingress는 외부에서 들어오는 통신, egress는 밖으로 나가는 통신입니다.

## 101 · 개념 이해

### 외부 사실

IGW는 VPC에 연결하는 인터넷 통신 구성 요소이며 IPv4와 IPv6를 지원합니다.[^igw]

직접 연결에는 IGW 방향의 route와 리소스의 공인 IPv4 또는 IPv6 주소가 필요합니다. IPv4의 경우 IGW가 공인/사설 주소 매핑에 관여합니다.[^igw]

일반 Public/Private Subnet 구분에서 IGW로 직접 향하는 route 유무가 핵심입니다.[^subnets]

## 201 · 예제에 적용하기

### 설계 예시

EC2에 공인 IPv4 주소가 있는데 인터넷 연결이 되지 않는다고 가정합니다. 먼저 IGW가 해당 VPC에 연결되어 있는지 확인합니다. 다음으로 인스턴스의 서브넷에 적용된 라우팅 테이블에서 IGW 경로를 찾습니다.

이 경로가 없다면 공인 주소만으로 직접 연결 경로가 완성되지 않습니다. 주소와 경로를 확인한 다음 보안 그룹, 서브넷의 네트워크 ACL, 애플리케이션을 점검합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- IGW를 붙이는 작업과 Subnet을 공개하는 경로 변경을 별도 검토합니다.

- 인터넷 egress와 외부에서 시작하는 ingress의 필요를 구분합니다.

- 연결 장애를 주소 → Route → SG/NACL → 애플리케이션 순으로 추적합니다.

### 운영 확인

- [ ] IGW가 올바른 VPC에 붙어 있나요?
- [ ] 리소스 주소와 실제 Subnet route가 요구 통신을 지원하나요?
- [ ] 불필요한 외부 ingress를 허용하지 않았나요?

## 이해 확인

**질문:** IGW를 VPC에 연결하는 작업만으로 모든 서버를 인터넷에 공개하게 될까요?

**해설:** 서브넷 경로, 리소스 주소와 통신 허용 설정을 함께 확인해야 합니다. IGW 연결만으로 모든 조건이 충족되지는 않습니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [Amazon VPC: 주소 공간과 연결 경계](aws-vpc.md)
- [Public / Private Subnet: 라우팅으로 구분하기](aws-subnets.md)
- [Route Table: 목적지와 다음 경로](aws-route-table.md)
- [NAT Gateway: egress와 가용성 모드](aws-nat-gateway.md)

[English](../../en/cloud/aws-internet-gateway.md)

## 출처

[^igw]: [Connect to the internet using an internet gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)
[^subnets]: [Subnets for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)
