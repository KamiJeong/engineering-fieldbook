---
type: Concept
title: 'Route Table: 목적지와 다음 경로'
description: 목적지와 target을 구분하고, 두 경로 중 더 구체적인 경로를 선택합니다.
concept_id: aws-route-table
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
- id: routes
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/RouteTables.html
  title: Configure route tables
- id: route-priority
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html
  title: Route priority
---

# Route Table: 목적지와 다음 경로

## 요약

통신의 목적지가 정해졌을 때 다음에 어디로 보낼지 알려 주는 규칙 모음이 라우팅 테이블(Route Table)입니다. 각 경로는 목적지 주소 범위와 보낼 대상(target)을 연결합니다. 먼저 서브넷에 실제로 적용되는 테이블을 찾아야 합니다.[^routes]

## 학습 목표

목적지와 target을 구분하고, 두 경로 중 더 구체적인 경로를 선택합니다.

## 선수 지식

[CIDR](../../../glossary/ko/cidr.md)와 [서브넷](aws-subnets.md)을 읽습니다. 기본 경로(default route)는 더 구체적인 일치 경로가 없을 때 사용하는 경로입니다.[^route-priority]

## 101 · 개념 이해

### 외부 사실

Route는 목적지 범위와 target으로 구성됩니다. 명시적으로 연결하지 않은 Subnet은 main Route Table을 사용합니다.[^routes]

일반적으로 가장 구체적인 prefix가 우선합니다. IPv4와 IPv6 경로는 독립적으로 평가하며 동일 목적지 등의 경우 추가 우선순위 규칙이 있습니다.[^route-priority]

VPC local 경로와 인터넷·NAT·다른 네트워크로 향하는 경로는 서로 다른 목적지 처리에 사용됩니다.[^routes]

## 201 · 예제에 적용하기

### 설계 예시

목적지가 10.50.1.4이고 테이블에 10.50.0.0/16과 0.0.0.0/0 경로가 있다고 가정합니다. 첫 범위에는 목적지 주소가 포함됩니다. 두 번째는 모든 IPv4 주소를 포함하므로 첫 범위가 더 구체적입니다.

따라서 이 예제에서는 /16 경로의 target을 따라갑니다. default route만 보면 실제 경로를 놓칠 수 있습니다. 경로 선택 뒤에는 응답 경로와 통신 허용도 확인합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 운영 Subnet은 연결 관계를 명시해 main table 변경의 영향을 쉽게 검토합니다.

- 왕복 경로를 함께 검토합니다. 라우팅은 통신 허용이나 애플리케이션 응답을 보장하지 않습니다.

- 더 구체적인 Endpoint·사설 연결 경로가 default route를 우회하는지 확인합니다.

### 운영 확인

- [ ] 의도한 table이 실제로 Subnet에 연결돼 있나요?
- [ ] 삭제되거나 사용할 수 없는 target으로 가는 경로가 있나요?
- [ ] IPv6 사용 시 별도 경로와 접근 제어를 검토했나요?

## 이해 확인

**질문:** 인터넷 기본 경로가 있어도 일부 목적지의 트래픽이 다른 곳으로 갈 수 있는 이유는 무엇일까요?

**해설:** 일치하는 더 구체적인 경로가 우선할 수 있기 때문입니다. 동일 목적지 경로 간 우선순위와 IPv6 경로는 별도 규칙도 확인해야 합니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [Amazon VPC: 주소 공간과 연결 경계](aws-vpc.md)
- [Public / Private Subnet: 라우팅으로 구분하기](aws-subnets.md)
- [NAT Gateway: egress와 가용성 모드](aws-nat-gateway.md)
- [Internet Gateway: VPC 인터넷 연결의 경로 대상](aws-internet-gateway.md)
- [CIDR: IP 주소 범위와 prefix](../../../glossary/ko/cidr.md)

[English](../../en/cloud/aws-route-table.md)

## 출처

[^routes]: [Configure route tables](https://docs.aws.amazon.com/vpc/latest/userguide/RouteTables.html)
[^route-priority]: [Route priority](https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html)
