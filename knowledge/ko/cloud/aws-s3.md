---
type: Concept
title: 'Amazon S3: 객체 저장과 접근 설계'
description: 버킷·객체·키를 구분하고, 객체 저장과 여러 객체를 함께 갱신하는 처리를 구분합니다.
concept_id: aws-s3
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
- id: s3
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html
  title: What is Amazon S3?
---

# Amazon S3: 객체 저장과 접근 설계

## 요약

업로드 파일이나 배포 파일을 보관할 때 Amazon S3의 객체 저장을 사용할 수 있습니다. 객체(object)는 저장할 데이터와 그에 대한 메타데이터를 담고, 버킷(bucket)은 객체를 담는 공간입니다. 버킷 안에서 객체를 찾는 이름이 키(key)입니다.[^s3]

## 학습 목표

버킷·객체·키를 구분하고, 객체 저장과 여러 객체를 함께 갱신하는 처리를 구분합니다.

## 선수 지식

파일을 저장하고 다시 읽는 동작을 알고 시작합니다. 접근 권한은 [IAM Policy](../security/aws-iam-policy.md), 덮어쓰기 복구는 [Versioning](aws-s3-versioning.md)에서 이어서 읽습니다.

## 101 · 개념 이해

### 외부 사실

여기서는 일반 목적 bucket의 객체 저장을 다룹니다. S3에는 directory·table·vector bucket도 있으며 같은 기능 집합을 가정하지 않습니다.[^s3]

객체는 bucket과 key로 찾습니다. 객체 PUT/DELETE 뒤 읽기와 목록의 일관성 보장은 여러 객체의 애플리케이션 트랜잭션과 다릅니다.[^s3]

접근은 IAM·bucket 정책 등으로 제어하며 Block Public Access는 공개 접근 설정을 제한하는 수단입니다.[^s3]

## 201 · 예제에 적용하기

### 설계 예시

릴리스 파일을 보관한다고 가정합니다. 같은 키를 계속 덮어쓸지, 릴리스 식별자가 들어간 서로 다른 키로 보관할지 비교합니다. 후자를 선택하면 현재 배포할 릴리스를 가리키는 정보도 필요합니다.

파일 저장 성공과 현재 릴리스 정보의 갱신이 함께 완료되는지 따로 설계해야 합니다. 객체의 일관성을 여러 객체에 걸친 애플리케이션 트랜잭션 보장으로 해석하지 않습니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 업로드·배포 아티팩트·백업 사본 등의 소유자와 보존 목적을 먼저 정의합니다.

- 객체 key 규칙과 동시 갱신 충돌 처리 방식을 애플리케이션 계약으로 둡니다.

- 기본은 비공개로 두고 공개 전달이 필요한 경로만 별도 설계합니다.

### 운영 확인

- [ ] Bucket 유형·리전·암호화·권한이 의도와 일치하나요?
- [ ] 업로드 중단·덮어쓰기·삭제의 처리와 복구를 검증하나요?
- [ ] 저장량 외 요청·전송·보존 버전 비용을 추적하나요?

## 이해 확인

**질문:** 객체 하나의 쓰기가 성공했다면 관련 객체를 모두 함께 갱신했다고 볼 수 있을까요?

**해설:** 객체별 쓰기와 여러 객체를 묶는 애플리케이션 처리는 다릅니다. 전체 작업의 완료 조건과 실패 시 처리 방법을 정해야 합니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [S3 Lifecycle: 전환과 만료 정책](aws-s3-lifecycle.md)
- [S3 Versioning: 덮어쓰기와 삭제 복구](aws-s3-versioning.md)
- [IAM Policy: 명시적 허용과 유효 권한 평가](../security/aws-iam-policy.md)
- [AWS KMS: 암호화 키와 복호화 권한](../security/aws-kms.md)

[English](../../en/cloud/aws-s3.md)

## 출처

[^s3]: [What is Amazon S3?](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
