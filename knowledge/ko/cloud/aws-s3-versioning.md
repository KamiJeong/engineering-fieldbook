---
type: Concept
title: 'S3 Versioning: 덮어쓰기와 삭제 복구'
description: 객체 버전 보존과 실제 복원·영구 삭제의 차이를 이해한다.
concept_id: aws-s3-versioning
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
- id: versioning
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html
  title: Using versioning in S3 buckets
- id: version-delete
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html
  title: Deleting object versions from a versioning-enabled bucket
---

# S3 Versioning: 덮어쓰기와 삭제 복구

## 요약

객체 버전 보존과 실제 복원·영구 삭제의 차이를 이해한다.

## 외부 사실

- Versioning을 켜면 같은 key의 새 쓰기가 새 version을 만든다. 일반 삭제는 delete marker를 추가하지만 version ID를 지정한 삭제는 해당 버전을 영구 삭제할 수 있다.[^versioning][^version-delete]

- 한번 활성화한 bucket은 unversioned로 돌아가지 않고 suspend할 수 있다. Suspend를 과거 버전 삭제로 해석하지 않는다.[^versioning]

- 저장 비용은 각 버전의 전체 객체에 적용되며 변경분만 저장하는 사용자 관점의 diff 요금이 아니다.[^versioning]

## 선택 기준과 권고

- 중요 객체의 버전 조회·특정 버전 읽기·이전 버전 복원 방법을 함께 검증한다.

- 영구 삭제 권한과 Lifecycle의 과거 버전 만료를 보존 목표에 맞춰 제한한다.

- Versioning만으로 별도 계정·리전의 복구 사본이나 변경 불가능한 보존을 확보했다고 간주하지 않는다.

## 설계 예시

key의 현재 조회가 실패해도 이전 version이 남아 있을 수 있다. version 목록을 확인한 뒤 복원하며, 문제를 해결하려고 과거 version을 일괄 삭제하지 않는다.

## 운영 확인

- [ ] 실수 삭제 뒤 delete marker와 이전 version을 구분할 수 있는가?
- [ ] 보존 버전의 수·크기·만료 정책을 관리하는가?
- [ ] 누가 특정 version을 영구 삭제할 수 있는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [Amazon S3: 객체 저장과 접근 설계](aws-s3.md)
- [S3 Lifecycle: 전환과 만료 정책](aws-s3-lifecycle.md)
- [IAM Policy: 명시적 허용과 유효 권한 평가](../security/aws-iam-policy.md)
- [AWS KMS: 암호화 키와 복호화 권한](../security/aws-kms.md)

[English](../../en/cloud/aws-s3-versioning.md)

## 출처

[^versioning]: [Using versioning in S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
[^version-delete]: [Deleting object versions from a versioning-enabled bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html)
