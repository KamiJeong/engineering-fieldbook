---
type: Concept
title: 'Security Group: 리소스 통신 허용 규칙'
description: 네트워크 도달 경로와 별도로 리소스의 입출력 통신을 허용한다.
concept_id: aws-security-group
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
- id: sg
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html
  title: Control traffic to your AWS resources using security groups
- id: sg-rules
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html
  title: Security group rules
- id: sg-tracking
  resource: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-connection-tracking.html
  title: Amazon EC2 security group connection tracking
---

# Security Group: 리소스 통신 허용 규칙

## 요약

네트워크 도달 경로와 별도로 리소스의 입출력 통신을 허용한다.

## 외부 사실

- SG는 연결된 리소스의 입출력 트래픽을 제어한다. 규칙에는 프로토콜·포트·출발지 또는 목적지가 포함된다.[^sg]

- SG는 allow 규칙만 제공한다. 여러 SG를 붙이면 허용 규칙이 합쳐지며 제한적인 SG가 다른 SG의 허용을 취소하지 않는다.[^sg-rules]

- SG는 연결 상태를 추적하며 일반적인 허용 연결의 응답을 허용한다. 기존 연결에 대한 규칙 변경 효과는 connection tracking 조건을 확인한다.[^sg-tracking]

## 선택 기준과 권고

- 애플리케이션과 DB를 SG로 나누고 필요한 DB 포트만 애플리케이션 SG에서 허용하는 모델을 검토한다.

- 진단을 위해 전체 인터넷에 모든 포트를 여는 대신 요청 흐름의 어느 경계에서 막히는지 찾는다.

- SG는 HTTP 공격 검사나 IAM 권한을 대신하지 않는다.

## 설계 예시

개념 예: DB SG inbound TCP 5432의 source를 애플리케이션 SG로 지정한다. 이 참조는 네트워크 경로를 새로 만들거나 DB 로그인 권한을 부여하지 않는다.

## 운영 확인

- [ ] 규칙의 목적과 실제 연결된 리소스가 일치하는가?
- [ ] 다중 SG의 합쳐진 허용 범위를 검토했는가?
- [ ] SG 변경 외에 Route·NACL·서버 수신 포트도 확인했는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [Public / Private Subnet: 라우팅으로 구분하기](aws-subnets.md)
- [Route Table: 목적지와 다음 경로](aws-route-table.md)
- [RDS for PostgreSQL: 관리형 DB의 책임 경계](../data/aws-rds-postgresql.md)
- [AWS WAF: 웹 요청 검사와 오탐 제어](../security/aws-waf.md)

[English](../../en/cloud/aws-security-group.md)

## 출처

[^sg]: [Control traffic to your AWS resources using security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html)
[^sg-rules]: [Security group rules](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html)
[^sg-tracking]: [Amazon EC2 security group connection tracking](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-connection-tracking.html)
