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
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2027-09-09T00:46:30+00:00'
freshness:
  mode: current
  volatility: low
  review_days: 365
  reason: 용어 정의 중심이며 연결한 서비스 구현의 상세 사양은 제외한다.
sources:
- id: vpc-cidr
  resource: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html
  title: VPC CIDR blocks
- id: cidr-rfc
  resource: https://www.rfc-editor.org/rfc/rfc4632.html
  title: 'RFC 4632, section 3.1: Basic Concept and Prefix Notation'
---

# CIDR: IP 주소 범위와 prefix

## 요약

CIDR(Classless Inter-Domain Routing)는 IP 주소 범위를 주소와 접두사 길이(prefix length)로 표현하는 방식입니다. 예를 들어 `10.40.1.0/24`에서 `/24`는 앞의 24비트를 네트워크 부분으로 사용한다는 뜻입니다.[^cidr-rfc]

## 외부 사실

IPv4 주소는 32비트입니다. `/24` 범위에는 나머지 8비트로 표현할 수 있는 256개 주소가 있습니다. 이는 실제 서비스에 할당 가능한 주소 수와는 다릅니다. AWS VPC와 서브넷의 주소 범위도 CIDR로 설정합니다.[^cidr-rfc][^vpc-cidr]

## 설계 예시

`10.40.0.0/16` 안에는 `10.40.1.0/24`를 배치할 수 있습니다. 같은 IPv4에서 `/24`는 `/16`보다 더 작은 범위입니다. 이 예제는 포함 관계를 설명하며 운영 주소 할당을 제안하지 않습니다.

## 적용과 혼동 방지

주소 범위를 정하는 작업과 인터넷 통신을 허용하는 작업은 다릅니다. 다른 VPC나 사내 네트워크와 연결할 계획이라면 주소 중복과 확장 여유를 먼저 확인합니다.

## 운영 확인

- [ ] 연결할 네트워크와 주소 범위가 겹치지 않는지, 확장할 여유가 있는지 확인했나요?

## 근거와 한계

여기서는 IPv4 접두사 표기와 범위 포함 관계를 설명합니다. AWS의 실제 할당 가능 주소와 서비스별 제한은 대상 구성에서 확인합니다.

## 관련 지식

- [Amazon VPC: 주소 공간과 연결 경계](../../knowledge/ko/cloud/aws-vpc.md)
- [Public / Private Subnet: 라우팅으로 구분하기](../../knowledge/ko/cloud/aws-subnets.md)
- [Route Table: 목적지와 다음 경로](../../knowledge/ko/cloud/aws-route-table.md)

[English](../en/cidr.md)

## 출처

[^vpc-cidr]: [VPC CIDR blocks](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html)
[^cidr-rfc]: [RFC 4632, section 3.1: Basic Concept and Prefix Notation](https://www.rfc-editor.org/rfc/rfc4632.html)
