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
  reason: 용어 정의 중심이며 연결한 서비스 구현의 상세 사양은 제외한다.
sources:
- id: az
  resource: https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html
  title: AWS Availability Zones
- id: az-ids
  resource: https://docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html
  title: AZ IDs
---

# Availability Zone (AZ): 가용 영역

## 요약

가용 영역(Availability Zone, AZ)은 AWS 리전 안에서 인프라의 장애를 분리하도록 구성한 배치 단위입니다. 여러 AZ에 자원을 배치하면 한 AZ의 장애에 대비하는 설계를 할 수 있습니다.[^az]

## 외부 사실

계정 간 같은 물리적 AZ를 확인하려면 AZ ID를 사용합니다. 일부 기존 리전·계정에서는 `us-east-1a` 같은 이름이 다른 위치를 가리킬 수 있습니다. 모든 리전에서 이름의 매핑이 다르다는 뜻은 아닙니다.[^az-ids]

## 설계 예시

서버 두 대가 같은 AZ에 있다고 가정합니다. 그 AZ를 사용할 수 없을 때 두 서버 모두 영향을 받을 수 있으므로 대수만으로 AZ 장애 대응을 설명할 수 없습니다. 다른 AZ에 배치한 경우에도 남은 처리량과 데이터 경로를 확인해야 합니다.

## 적용과 혼동 방지

Multi-AZ 배치는 복구 설계의 기반입니다. 애플리케이션이 실제로 전환하고 요청을 처리할 수 있는지는 별도 검증이 필요합니다.

## 운영 확인

- [ ] AZ 하나를 사용할 수 없을 때 남은 용량과 데이터 경로가 유효한가요?

## 근거와 한계

용어와 배치 원리를 설명합니다. 특정 애플리케이션의 복구 성공이나 복구 시간을 보장하지 않습니다.

## 관련 지식

- [Amazon VPC: 주소 공간과 연결 경계](../../knowledge/ko/cloud/aws-vpc.md)
- [Public / Private Subnet: 라우팅으로 구분하기](../../knowledge/ko/cloud/aws-subnets.md)
- [RDS Multi-AZ: instance와 cluster 구분](../../knowledge/ko/data/aws-rds-multi-az.md)

[English](../en/availability-zone.md)

## 출처

[^az]: [AWS Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)
[^az-ids]: [AZ IDs](https://docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html)
