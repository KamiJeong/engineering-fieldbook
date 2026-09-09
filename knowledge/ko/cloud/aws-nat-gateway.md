---
type: Concept
title: 'NAT Gateway: egress와 가용성 모드'
description: 연결 유형과 가용성 모드를 구분하고, 애플리케이션이 의존하는 출구 경로를 설명합니다.
concept_id: aws-nat-gateway
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
stale_after: '2026-12-08T00:46:30+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 90
  reason: 실행 옵션·권한 또는 서비스 동작 변화가 설계에 미치는 영향이 커 90일 후 재검토한다.
sources:
- id: nat
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html
  title: NAT gateways
- id: regional-nat
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html
  title: Regional NAT gateways
---

# NAT Gateway: egress와 가용성 모드

## 요약

사설 네트워크의 애플리케이션도 외부 API를 호출할 수 있어야 하는 경우가 있습니다. NAT는 통신 과정에서 주소를 변환하는 방식입니다. AWS NAT Gateway에서는 인터넷 연결용 Public과 사설 네트워크 연결용 Private을 구분하고, 별도로 Zonal·Regional 가용성 모드를 선택합니다.[^nat][^regional-nat]

## 학습 목표

연결 유형과 가용성 모드를 구분하고, 애플리케이션이 의존하는 출구 경로를 설명합니다.

## 선수 지식

[서브넷](aws-subnets.md), [IGW](aws-internet-gateway.md), [가용 영역](../../../glossary/ko/availability-zone.md)을 읽습니다. EIP는 AWS에서 할당받는 고정 공인 IPv4 주소입니다.[^nat]

## 101 · 개념 이해

### 외부 사실

Public NAT는 Private 자원의 IPv4 인터넷 연결에 사용합니다. Zonal Public NAT는 Public Subnet·EIP·IGW 경로를 사용합니다. Private NAT는 다른 사설 네트워크 연결용이며 IGW 인터넷 출구로 사용할 수 없습니다.[^nat]

현재 Regional NAT도 있습니다. 호스팅용 Public Subnet 없이 구성하며 automatic 모드에서는 workload가 있는 AZ로 확장합니다. Manual 모드의 AZ 관리는 사용자 책임입니다.[^regional-nat]

Regional NAT는 Private NAT를 지원하지 않습니다. public/private 연결 유형과 zonal/regional 가용성 모드는 같은 분류가 아닙니다.[^regional-nat]

## 201 · 예제에 적용하기

### 설계 예시

Zonal Public NAT 예제로 애플리케이션 AZ-A → NAT-A → IGW 경로를 따라갑니다. 다른 AZ의 애플리케이션도 NAT-A를 쓰는지 확인하면 어느 경로가 AZ-A에 의존하는지 알 수 있습니다.

Regional을 검토할 때는 같은 구성을 복제하지 않고 별도 라우팅 테이블과 주소 관리 모드를 확인합니다. Automatic과 Manual에서 AZ 확장의 담당자가 달라지므로 지원 범위와 비용도 함께 비교합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- Zonal 사용 시 AZ별 egress 경로와 특정 AZ 장애 의존성을 평가합니다. Regional은 지원 범위·주소 관리 모드·비용을 확인합니다.

- 서비스 Endpoint로 처리 가능한 트래픽은 NAT 경유와 비용·운영 복잡도를 비교합니다.

- NAT가 방화벽의 전체 역할을 수행한다고 가정하지 않습니다.

### 운영 확인

- [ ] 현재 NAT의 연결 유형과 availability mode를 알고 있나요?
- [ ] 각 AZ에서 실제로 사용하는 경로와 공인 출발지 주소를 확인했나요?
- [ ] 처리량·연결 실패·처리 데이터와 전송 비용을 관측하나요?

## 이해 확인

**질문:** Regional이라는 말이 Private NAT도 지원한다는 뜻일까요?

**해설:** 아닙니다. Regional은 가용성 모드이고 Public·Private은 연결 유형입니다. 현재 Regional NAT는 Private NAT를 지원하지 않습니다.[^regional-nat]

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [Public / Private Subnet: 라우팅으로 구분하기](aws-subnets.md)
- [Route Table: 목적지와 다음 경로](aws-route-table.md)
- [Internet Gateway: VPC 인터넷 연결의 경로 대상](aws-internet-gateway.md)
- [AWS Fargate: ECS의 관리형 실행 용량](aws-fargate.md)

[English](../../en/cloud/aws-nat-gateway.md)

## 출처

[^nat]: [NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)
[^regional-nat]: [Regional NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html)
