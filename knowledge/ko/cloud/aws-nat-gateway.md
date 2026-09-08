---
type: Concept
title: 'NAT Gateway: egress와 가용성 모드'
description: 주소 변환의 연결 유형과 zonal/regional 모드를 구분한다.
concept_id: aws-nat-gateway
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
stale_after: '2026-12-07T05:01:30Z'
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

주소 변환의 연결 유형과 zonal/regional 모드를 구분한다.

## 외부 사실

- Public NAT는 Private 자원의 IPv4 인터넷 연결에 사용한다. Zonal Public NAT는 Public Subnet·EIP·IGW 경로를 사용한다. Private NAT는 다른 사설 네트워크 연결용이며 IGW 인터넷 출구로 사용할 수 없다.[^nat]

- 현재 Regional NAT도 있다. 호스팅용 Public Subnet 없이 구성하며 automatic 모드에서는 workload가 있는 AZ로 확장한다. Manual 모드의 AZ 관리는 사용자 책임이다.[^regional-nat]

- Regional NAT는 Private NAT를 지원하지 않는다. public/private 연결 유형과 zonal/regional 가용성 모드는 같은 분류가 아니다.[^regional-nat]

## 선택 기준과 권고

- Zonal 사용 시 AZ별 egress 경로와 특정 AZ 장애 의존성을 평가한다. Regional은 지원 범위·주소 관리 모드·비용을 확인한다.

- 서비스 Endpoint로 처리 가능한 트래픽은 NAT 경유와 비용·운영 복잡도를 비교한다.

- NAT가 방화벽의 전체 역할을 수행한다고 가정하지 않는다.

## 설계 예시

Zonal 예: 애플리케이션 AZ-A → NAT-A → IGW. Regional 도입 시 NAT-A를 그대로 복제하는 설계를 가정하지 말고 Regional의 별도 route table과 주소 관리 모드를 검토한다.

## 운영 확인

- [ ] 현재 NAT의 연결 유형과 availability mode를 알고 있는가?
- [ ] 각 AZ에서 실제로 사용하는 경로와 공인 출발지 주소를 확인했는가?
- [ ] 처리량·연결 실패·처리 데이터와 전송 비용을 관측하는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [Public / Private Subnet: 라우팅으로 구분하기](aws-subnets.md)
- [Route Table: 목적지와 다음 경로](aws-route-table.md)
- [Internet Gateway: VPC 인터넷 연결의 경로 대상](aws-internet-gateway.md)
- [AWS Fargate: ECS의 관리형 실행 용량](aws-fargate.md)

[English](../../en/cloud/aws-nat-gateway.md)

## 출처

[^nat]: [NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)
[^regional-nat]: [Regional NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html)
