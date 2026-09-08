---
type: Concept
title: 'AWS KMS: 암호화 키와 복호화 권한'
description: 데이터 암호화와 키 접근·보존·삭제의 운영 책임을 함께 설계한다.
concept_id: aws-kms
language: ko
tags:
- aws
- security
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
stale_after: '2026-12-07T05:01:30Z'
freshness:
  mode: current
  volatility: medium
  review_days: 90
  reason: 실행 옵션·권한 또는 서비스 동작 변화가 설계에 미치는 영향이 커 90일 후 재검토한다.
sources:
- id: kms
  resource: https://docs.aws.amazon.com/kms/latest/developerguide/overview.html
  title: What is AWS Key Management Service?
- id: kms-policy
  resource: https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html
  title: Key policies in AWS KMS
- id: kms-rotation
  resource: https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html
  title: Rotating AWS KMS keys
- id: kms-delete
  resource: https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html
  title: Deleting AWS KMS keys
---

# AWS KMS: 암호화 키와 복호화 권한

## 요약

데이터 암호화와 키 접근·보존·삭제의 운영 책임을 함께 설계한다.

## 외부 사실

- KMS는 암호화·서명에 사용하는 키를 생성·관리·사용하는 서비스다. 일반 애플리케이션 password를 저장하는 Secrets Manager와 목적이 다르다.[^kms]

- Key policy는 키 권한의 핵심이다. IAM Allow만 추가했다고 키 사용이 허용되는 것은 아니며 key policy의 IAM 위임 설정도 확인한다.[^kms-policy]

- Key material rotation은 기존 데이터를 일괄 재암호화하는 작업과 다르다. 키 삭제는 필요한 복호화 능력을 잃게 할 수 있다.[^kms-rotation][^kms-delete]

## 선택 기준과 권고

- 키 관리 권한과 데이터 복호화 권한의 담당자를 구분한다.

- 백업 복사·리전/계정 복구 때 데이터뿐 아니라 키와 허용 정책이 살아 있는지 확인한다.

- 키 삭제 전 의존 데이터를 파악하고 단순 비용 절감 때문에 복구 능력을 제거하지 않는다.

## 설계 예시

백업 snapshot이 남아 있어도 해당 데이터를 복호화할 키나 권한이 없으면 복구가 막힐 수 있다. 복구 검증에 키 접근을 포함한다.

## 운영 확인

- [ ] 서비스 호출자와 키 사용 주체에 필요한 권한이 있는가?
- [ ] 암호화된 백업을 별도 복구 환경에서 복호화할 수 있는가?
- [ ] 키 회전·비활성화·삭제의 영향을 각각 구분하는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [IAM Policy: 명시적 허용과 유효 권한 평가](aws-iam-policy.md)
- [Secrets Manager: 비밀 조회·회전·소비자 갱신](aws-secrets-manager.md)
- [RDS Backup: 복원 가능한 시점과 복구 절차](../data/aws-rds-backup.md)
- [Amazon S3: 객체 저장과 접근 설계](../cloud/aws-s3.md)

[English](../../en/security/aws-kms.md)

## 출처

[^kms]: [What is AWS Key Management Service?](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html)
[^kms-policy]: [Key policies in AWS KMS](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html)
[^kms-rotation]: [Rotating AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html)
[^kms-delete]: [Deleting AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html)
