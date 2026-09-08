---
type: Concept
title: 'Amazon S3: 객체 저장과 접근 설계'
description: 파일시스템 가정 없이 객체 키·접근 권한·보존 정책을 설계한다.
concept_id: aws-s3
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
- id: s3
  resource: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html
  title: What is Amazon S3?
---

# Amazon S3: 객체 저장과 접근 설계

## 요약

파일시스템 가정 없이 객체 키·접근 권한·보존 정책을 설계한다.

## 외부 사실

- 여기서는 일반 목적 bucket의 객체 저장을 다룬다. S3에는 directory·table·vector bucket도 있으며 같은 기능 집합을 가정하지 않는다.[^s3]

- 객체는 bucket과 key로 찾는다. 객체 PUT/DELETE 뒤 읽기와 목록의 일관성 보장은 여러 객체의 애플리케이션 트랜잭션과 다르다.[^s3]

- 접근은 IAM·bucket 정책 등으로 제어하며 Block Public Access는 공개 접근 설정을 제한하는 수단이다.[^s3]

## 선택 기준과 권고

- 업로드·배포 아티팩트·백업 사본 등의 소유자와 보존 목적을 먼저 정의한다.

- 객체 key 규칙과 동시 갱신 충돌 처리 방식을 애플리케이션 계약으로 둔다.

- 기본은 비공개로 두고 공개 전달이 필요한 경로만 별도 설계한다.

## 설계 예시

릴리스 파일을 같은 key에 계속 덮어쓰기보다 릴리스 식별자가 포함된 key로 저장하는 방식을 검토한다. 어떤 key가 현재 배포인지 가리키는 메타데이터의 일관성은 별도로 설계한다.

## 운영 확인

- [ ] Bucket 유형·리전·암호화·권한이 의도와 일치하는가?
- [ ] 업로드 중단·덮어쓰기·삭제의 처리와 복구를 검증하는가?
- [ ] 저장량 외 요청·전송·보존 버전 비용을 추적하는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [S3 Lifecycle: 전환과 만료 정책](aws-s3-lifecycle.md)
- [S3 Versioning: 덮어쓰기와 삭제 복구](aws-s3-versioning.md)
- [IAM Policy: 명시적 허용과 유효 권한 평가](../security/aws-iam-policy.md)
- [AWS KMS: 암호화 키와 복호화 권한](../security/aws-kms.md)

[English](../../en/cloud/aws-s3.md)

## 출처

[^s3]: [What is Amazon S3?](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
