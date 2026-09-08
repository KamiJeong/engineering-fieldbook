---
type: Concept
title: 'S3 Lifecycle: 전환과 만료 정책'
description: 객체와 과거 버전의 보존·비용을 규칙으로 관리한다.
concept_id: aws-s3-lifecycle
language: ko
tags:
- aws
- storage
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2027-01-06T05:01:30Z'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: 관리형 서비스의 지원 범위와 운영 동작을 120일 후 재검토한다.
sources:
- id: lifecycle
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html
  title: Managing the lifecycle of objects
- id: expiration
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html
  title: Expiring objects
---

# S3 Lifecycle: 전환과 만료 정책

## 요약

객체와 과거 버전의 보존·비용을 규칙으로 관리한다.

## 외부 사실

- Lifecycle 규칙은 storage class 전환과 expiration을 정의하며 기존 객체에도 적용된다.[^lifecycle]

- Versioning 활성 bucket의 현재 객체 만료는 일반적으로 delete marker를 만들며, 과거 버전 삭제는 noncurrent expiration 규칙과 구분한다.[^expiration]

- 전환 요청·최소 보관 기간 관련 비용이 있을 수 있다. 일반 목적 bucket의 bucket policy deny로 Lifecycle 동작을 막을 수 있다고 가정하지 않는다.[^lifecycle]

## 선택 기준과 권고

- 접근 빈도·복구 지연 허용·보존 요구를 먼저 정하고 전환 시점을 선택한다.

- 넓은 prefix 규칙을 적용하기 전에 기존 객체·과거 버전의 대상 범위를 확인한다.

- 비용 감소 목표와 실수 삭제 복구 목표가 충돌하지 않게 Versioning 정책과 함께 검토한다.

## 설계 예시

설계 예: 로그는 일정 기간 후 전환하고 나중에 만료한다. 기간을 그대로 복사하지 말고 실제 조사에 필요한 로그 기간과 복구 요청 빈도로 정한다.

## 운영 확인

- [ ] 현재·과거 버전·delete marker의 처리 규칙이 구분돼 있는가?
- [ ] 전환 대상 class의 검색 지연과 최소 보관 조건을 확인했는가?
- [ ] 규칙 변경 전 대상 객체 목록과 복원 가능성을 확인했는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [Amazon S3: 객체 저장과 접근 설계](aws-s3.md)
- [S3 Versioning: 덮어쓰기와 삭제 복구](aws-s3-versioning.md)
- [RPO: 복구 시점 목표](../../../glossary/ko/rpo.md)

[English](../../en/cloud/aws-s3-lifecycle.md)

## 출처

[^lifecycle]: [Managing the lifecycle of objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
[^expiration]: [Expiring objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html)
