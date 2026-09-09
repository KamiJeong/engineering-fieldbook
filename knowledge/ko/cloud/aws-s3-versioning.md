---
type: Concept
title: 'S3 Versioning: 덮어쓰기와 삭제 복구'
description: 삭제 표시와 버전 영구 삭제를 구분하고, 이전 버전 확인 절차를 설명합니다.
concept_id: aws-s3-versioning
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
- id: versioning
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html
  title: Using versioning in S3 buckets
- id: version-delete
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html
  title: Deleting object versions from a versioning-enabled bucket
---

# S3 Versioning: 덮어쓰기와 삭제 복구

## 요약

같은 객체를 덮어쓰거나 실수로 삭제했을 때 이전 내용을 찾아야 할 수 있습니다. S3 Versioning은 버킷 안에서 객체의 여러 버전을 보존하는 기능입니다. 이전 버전이 남아 있는지와 실제로 복원할 수 있는지를 함께 확인해야 합니다.[^versioning]

## 학습 목표

삭제 표시와 버전 영구 삭제를 구분하고, 이전 버전 확인 절차를 설명합니다.

## 선수 지식

[S3의 버킷과 키](aws-s3.md)를 읽습니다. 버전 ID는 특정 버전을 식별하며, delete marker는 일반 삭제 때 현재 버전으로 추가되는 삭제 표시입니다.[^versioning]

## 101 · 개념 이해

### 외부 사실

Versioning을 켜면 같은 key의 새 쓰기가 새 version을 만듭니다. 일반 삭제는 delete marker를 추가하지만 version ID를 지정한 삭제는 해당 버전을 영구 삭제할 수 있습니다.[^versioning][^version-delete]

한번 활성화한 bucket은 unversioned로 돌아가지 않고 suspend할 수 있습니다. Suspend를 과거 버전 삭제로 해석하지 않습니다.[^versioning]

저장 비용은 각 버전의 전체 객체에 적용되며 변경분만 저장하는 사용자 관점의 diff 요금이 아닙니다.[^versioning]

## 201 · 예제에 적용하기

### 설계 예시

Versioning이 활성화된 버킷에서 객체를 일반 삭제한 뒤 현재 키 조회가 실패한다고 가정합니다. 먼저 버전 목록에서 삭제 표시와 이전 버전을 구분합니다. 이전 내용이 남아 있다면 필요한 버전을 읽고 복원 절차를 확인합니다.

문제 해결을 위해 버전 목록을 일괄 삭제하면 보존하려던 복구 지점을 잃을 수 있습니다. 어떤 버전을 대상으로 하는 작업인지 먼저 확인합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 중요 객체의 버전 조회·특정 버전 읽기·이전 버전 복원 방법을 함께 검증합니다.

- 영구 삭제 권한과 Lifecycle의 과거 버전 만료를 보존 목표에 맞춰 제한합니다.

- Versioning만으로 별도 계정·리전의 복구 사본이나 변경 불가능한 보존을 확보했다고 간주하지 않습니다.

### 운영 확인

- [ ] 실수 삭제 뒤 delete marker와 이전 version을 구분할 수 있나요?
- [ ] 보존 버전의 수·크기·만료 정책을 관리하나요?
- [ ] 누가 특정 version을 영구 삭제할 수 있나요?

## 이해 확인

**질문:** Versioning을 일시 중지하면 이미 저장된 과거 버전도 삭제될까요?

**해설:** 일시 중지는 과거 버전 삭제가 아닙니다. 영구 삭제 권한과 Lifecycle의 과거 버전 만료 정책을 별도로 확인합니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [Amazon S3: 객체 저장과 접근 설계](aws-s3.md)
- [S3 Lifecycle: 전환과 만료 정책](aws-s3-lifecycle.md)
- [IAM Policy: 명시적 허용과 유효 권한 평가](../security/aws-iam-policy.md)
- [AWS KMS: 암호화 키와 복호화 권한](../security/aws-kms.md)

[English](../../en/cloud/aws-s3-versioning.md)

## 출처

[^versioning]: [Using versioning in S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
[^version-delete]: [Deleting object versions from a versioning-enabled bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html)
