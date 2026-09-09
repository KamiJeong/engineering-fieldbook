---
type: Concept
title: 'Security Group: 리소스 통신 허용 규칙'
description: 도달 경로와 통신 허용을 구분하고, 여러 보안 그룹의 허용 규칙이 합쳐지는 의미를 설명합니다.
concept_id: aws-security-group
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

네트워크 경로가 있어도 모든 통신을 허용할 필요는 없습니다. 보안 그룹(Security Group, SG)은 연결된 리소스에 어떤 통신을 허용할지 정합니다. 규칙에는 통신 방식인 프로토콜, 포트와 출발지 또는 목적지를 지정합니다.[^sg]

## 학습 목표

도달 경로와 통신 허용을 구분하고, 여러 보안 그룹의 허용 규칙이 합쳐지는 의미를 설명합니다.

## 선수 지식

[서브넷](aws-subnets.md)과 [라우팅 테이블](aws-route-table.md)을 읽습니다. 포트는 서버에서 통신할 서비스의 번호이며, 이 예제에서는 DB의 TCP 5432를 사용합니다.

## 101 · 개념 이해

### 외부 사실

SG는 연결된 리소스의 입출력 트래픽을 제어합니다. 규칙에는 프로토콜·포트·출발지 또는 목적지가 포함됩니다.[^sg]

SG는 allow 규칙만 제공합니다. 여러 SG를 붙이면 허용 규칙이 합쳐지며 제한적인 SG가 다른 SG의 허용을 취소하지 않습니다.[^sg-rules]

SG는 연결 상태를 추적하며 일반적인 허용 연결의 응답을 허용합니다. 기존 연결에 대한 규칙 변경 효과는 connection tracking 조건을 확인합니다.[^sg-tracking]

## 201 · 예제에 적용하기

### 설계 예시

애플리케이션이 DB에 연결하도록 DB 보안 그룹의 inbound TCP 5432 출발지에 애플리케이션 보안 그룹을 지정했다고 가정합니다. 먼저 두 그룹에 연결된 실제 리소스를 확인합니다. 다음으로 라우팅과 DB가 해당 포트에서 요청을 받는지 확인합니다.

이 참조가 DB 로그인 권한까지 주는 것은 아닙니다. 연결이 안 된다면 네트워크 허용과 DB 인증을 구분해 조사합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 애플리케이션과 DB를 SG로 나누고 필요한 DB 포트만 애플리케이션 SG에서 허용하는 모델을 검토합니다.

- 진단을 위해 전체 인터넷에 모든 포트를 여는 대신 요청 흐름의 어느 경계에서 막히는지 찾습니다.

- SG는 HTTP 공격 검사나 IAM 권한을 대신하지 않습니다.

### 운영 확인

- [ ] 규칙의 목적과 실제 연결된 리소스가 일치하나요?
- [ ] 다중 SG의 합쳐진 허용 범위를 검토했나요?
- [ ] SG 변경 외에 Route·NACL·서버 수신 포트도 확인했나요?

## 이해 확인

**질문:** 넓게 허용하는 SG에 제한적인 SG를 추가하면 기존 허용을 취소할 수 있을까요?

**해설:** 여러 SG의 허용 규칙은 합쳐집니다. 다른 SG의 허용을 취소하려면 실제 허용 규칙을 검토해야 하며, 제한적인 SG 추가만으로 해결되지 않습니다.[^sg-rules]

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

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
