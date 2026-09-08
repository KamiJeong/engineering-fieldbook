---
type: Glossary Term
title: 'CIDR: IP 주소 범위와 prefix'
description: Classless Inter-Domain Routing 표기로 네트워크 주소 범위를 표현한다.
concept_id: cidr
language: ko
tags:
- network
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2027-09-08T05:01:30Z'
freshness:
  mode: current
  volatility: low
  review_days: 365
  reason: 용어 정의 중심이며 연결한 서비스 구현의 상세 사양은 제외한다.
sources:
- id: vpc-cidr
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html
  title: VPC CIDR blocks
---

# CIDR: IP 주소 범위와 prefix

## 요약

Classless Inter-Domain Routing 표기로 네트워크 주소 범위를 표현한다.

## 외부 사실

- CIDR는 주소와 prefix 길이로 범위를 나타낸다. AWS VPC와 Subnet의 IP 범위 설정에 사용한다.[^vpc-cidr]

## 적용과 혼동 방지

- 주소 범위 계획과 인터넷 접근 설정을 구분한다. 연결할 네트워크들의 범위가 중복되는지 먼저 비교한다.

## 설계 예시

10.40.0.0/16 안에 10.40.1.0/24를 배치할 수 있다. 이는 주소 범위 예시이며 그대로 사용할 운영 주소 할당은 아니다.

## 운영 확인

- [ ] 확장·다른 VPC·온프레미스 연결을 고려한 주소 공간이 있는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다.

## 관련 지식

- [Amazon VPC: 주소 공간과 연결 경계](../../knowledge/ko/cloud/aws-vpc.md)
- [Public / Private Subnet: 라우팅으로 구분하기](../../knowledge/ko/cloud/aws-subnets.md)
- [Route Table: 목적지와 다음 경로](../../knowledge/ko/cloud/aws-route-table.md)

[English](../en/cidr.md)

## 출처

[^vpc-cidr]: [VPC CIDR blocks](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html)
