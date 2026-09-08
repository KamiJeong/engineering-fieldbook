---
type: Glossary Term
title: 'Availability Zone (AZ): 가용 영역'
description: AWS 리전 안의 장애 격리와 배치 단위를 설명하는 용어.
concept_id: availability-zone
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
stale_after: '2027-03-07T05:01:30Z'
freshness:
  mode: current
  volatility: low
  review_days: 180
  reason: 용어 정의 중심이며 연결한 서비스 구현의 상세 사양은 제외한다.
sources:
- id: az
  resource: https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html
  title: AWS Availability Zones
---

# Availability Zone (AZ): 가용 영역

## 요약

AWS 리전 안의 장애 격리와 배치 단위를 설명하는 용어.

## 외부 사실

- AZ는 한 리전 안에서 인프라를 분리하는 단위다. 서로 다른 AZ 배치는 장애 격리 설계의 기반이다.[^az]

- 계정 간 물리적으로 같은 AZ를 식별할 때 AZ ID를 사용한다. AZ 이름만으로 동일한 위치라고 가정하지 않는다.[^az]

## 적용과 혼동 방지

- Multi-AZ 배치와 애플리케이션의 장애 복구 능력을 별도로 검증한다.

## 설계 예시

서버 두 대가 같은 AZ에 있으면 두 대라는 수만으로 AZ 장애 대응을 설명할 수 없다.

## 운영 확인

- [ ] AZ 하나를 사용할 수 없을 때 남은 용량과 데이터 경로가 유효한가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다.

## 관련 지식

- [Amazon VPC: 주소 공간과 연결 경계](../../knowledge/ko/cloud/aws-vpc.md)
- [Public / Private Subnet: 라우팅으로 구분하기](../../knowledge/ko/cloud/aws-subnets.md)
- [RDS Multi-AZ: instance와 cluster 구분](../../knowledge/ko/data/aws-rds-multi-az.md)

[English](../en/availability-zone.md)

## 출처

[^az]: [AWS Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)
