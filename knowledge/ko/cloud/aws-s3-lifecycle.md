---
type: Concept
title: 'S3 Lifecycle: 전환과 만료 정책'
description: 전환과 만료를 구분하고, 기존 객체와 과거 버전까지 규칙의 영향을 확인합니다.
concept_id: aws-s3-lifecycle
language: ko
tags:
- aws
- storage
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2027-01-07T00:46:30+00:00'
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

계속 쌓이는 객체를 얼마나 보관하고 언제 다른 저장 등급으로 옮길지 규칙으로 정할 수 있습니다. S3 Lifecycle의 전환(transition)은 저장 등급 변경, 만료(expiration)는 객체 만료 처리를 뜻합니다. 버전 보존 여부에 따라 만료의 결과가 달라집니다.[^lifecycle][^expiration]

## 학습 목표

전환과 만료를 구분하고, 기존 객체와 과거 버전까지 규칙의 영향을 확인합니다.

## 선수 지식

[S3](aws-s3.md)와 [Versioning](aws-s3-versioning.md)을 읽습니다. Storage class는 접근 특성과 비용 등이 다른 저장 등급이며, noncurrent version은 현재 버전이 아닌 과거 버전입니다.

## 101 · 개념 이해

### 외부 사실

Lifecycle 규칙은 storage class 전환과 expiration을 정의하며 기존 객체에도 적용됩니다.[^lifecycle]

Versioning 활성 bucket의 현재 객체 만료는 일반적으로 delete marker를 만들며, 과거 버전 삭제는 noncurrent expiration 규칙과 구분합니다.[^expiration]

전환 요청·최소 보관 기간 관련 비용이 있을 수 있습니다. 일반 목적 bucket의 bucket policy deny로 Lifecycle 동작을 막을 수 있다고 가정하지 않습니다.[^lifecycle]

## 201 · 예제에 적용하기

### 설계 예시

로그를 일정 기간 뒤 다른 저장 등급으로 옮기고 이후 만료시키는 정책을 가정합니다. 먼저 조사에 필요한 로그 기간과 다시 읽을 때 허용할 지연을 정합니다. 다음으로 규칙에 해당하는 기존 객체와 과거 버전 목록을 확인합니다.

확인할 결과는 보존 요구를 지키면서 의도한 대상에만 규칙이 적용되는지입니다. 예제의 기간을 복사하기보다 실제 요구로 기간을 정해야 합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 접근 빈도·복구 지연 허용·보존 요구를 먼저 정하고 전환 시점을 선택합니다.

- 넓은 prefix 규칙을 적용하기 전에 기존 객체·과거 버전의 대상 범위를 확인합니다.

- 비용 감소 목표와 실수 삭제 복구 목표가 충돌하지 않게 Versioning 정책과 함께 검토합니다.

### 운영 확인

- [ ] 현재·과거 버전·delete marker의 처리 규칙이 구분돼 있나요?
- [ ] 전환 대상 class의 검색 지연과 최소 보관 조건을 확인했나요?
- [ ] 규칙 변경 전 대상 객체 목록과 복원 가능성을 확인했나요?

## 이해 확인

**질문:** 오늘 규칙을 추가했으므로 이전에 저장한 객체는 영향을 받지 않을까요?

**해설:** Lifecycle 규칙은 기존 객체에도 적용됩니다. 적용 전에 대상 범위와 복원 가능성을 확인해야 합니다.[^lifecycle]

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [Amazon S3: 객체 저장과 접근 설계](aws-s3.md)
- [S3 Versioning: 덮어쓰기와 삭제 복구](aws-s3-versioning.md)
- [RPO: 복구 시점 목표](../../../glossary/ko/rpo.md)

[English](../../en/cloud/aws-s3-lifecycle.md)

## 출처

[^lifecycle]: [Managing the lifecycle of objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
[^expiration]: [Expiring objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html)
