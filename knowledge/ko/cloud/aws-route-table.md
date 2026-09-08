---
type: Concept
title: 'Route Table: 목적지와 다음 경로'
description: Subnet에 적용되는 실제 경로와 우선순위를 이해한다.
concept_id: aws-route-table
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
- id: routes
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/RouteTables.html
  title: Configure route tables
- id: route-priority
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html
  title: Route priority
---

# Route Table: 목적지와 다음 경로

## 요약

Subnet에 적용되는 실제 경로와 우선순위를 이해한다.

## 외부 사실

- Route는 목적지 범위와 target으로 구성된다. 명시적으로 연결하지 않은 Subnet은 main Route Table을 사용한다.[^routes]

- 일반적으로 가장 구체적인 prefix가 우선한다. IPv4와 IPv6 경로는 독립적으로 평가하며 동일 목적지 등의 경우 추가 우선순위 규칙이 있다.[^route-priority]

- VPC local 경로와 인터넷·NAT·다른 네트워크로 향하는 경로는 서로 다른 목적지 처리에 사용된다.[^routes]

## 선택 기준과 권고

- 운영 Subnet은 연결 관계를 명시해 main table 변경의 영향을 쉽게 검토한다.

- 왕복 경로를 함께 검토한다. 라우팅은 통신 허용이나 애플리케이션 응답을 보장하지 않는다.

- 더 구체적인 Endpoint·사설 연결 경로가 default route를 우회하는지 확인한다.

## 설계 예시

계산 예: 목적지가 10.50.1.4이면 10.50.0.0/16 경로가 0.0.0.0/0보다 구체적이다. 두 경로가 존재할 때 default route만 보고 장애를 판단하지 않는다.

## 운영 확인

- [ ] 의도한 table이 실제로 Subnet에 연결돼 있는가?
- [ ] 삭제되거나 사용할 수 없는 target으로 가는 경로가 있는가?
- [ ] IPv6 사용 시 별도 경로와 접근 제어를 검토했는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

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
