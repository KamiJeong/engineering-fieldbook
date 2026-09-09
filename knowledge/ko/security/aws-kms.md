---
type: Concept
title: 'AWS KMS: 암호화 키와 복호화 권한'
description: 키 관리와 데이터 복호화 권한을 구분하고, 키 회전과 삭제가 복구에 미치는 영향을 설명합니다.
concept_id: aws-kms
language: ko
tags:
- aws
- security
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2026-12-08T00:46:30+00:00'
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

암호화한 데이터를 다시 읽으려면 필요한 키와 그 키를 사용할 권한이 있어야 합니다. AWS KMS는 암호화와 서명에 사용하는 키를 생성하고 관리하는 서비스입니다. 데이터 보존 계획에는 키의 보존과 접근 권한도 포함해야 합니다.[^kms][^kms-policy]

## 학습 목표

키 관리와 데이터 복호화 권한을 구분하고, 키 회전과 삭제가 복구에 미치는 영향을 설명합니다.

## 선수 지식

암호화는 데이터를 보호된 형태로 바꾸고 복호화는 다시 읽을 수 있게 하는 과정입니다. 권한 평가는 [IAM Policy](aws-iam-policy.md), 비밀번호 저장은 [Secrets Manager](aws-secrets-manager.md)에서 구분합니다.

## 101 · 개념 이해

### 외부 사실

KMS는 암호화·서명에 사용하는 키를 생성·관리·사용하는 서비스입니다. 일반 애플리케이션 password를 저장하는 Secrets Manager와 목적이 다릅니다.[^kms]

Key policy는 키 권한의 핵심입니다. IAM Allow만 추가했다고 키 사용이 허용되는 것은 아니며 key policy의 IAM 위임 설정도 확인합니다.[^kms-policy]

Key material rotation은 기존 데이터를 일괄 재암호화하는 작업과 다릅니다. 키 삭제는 필요한 복호화 능력을 잃게 할 수 있습니다.[^kms-rotation][^kms-delete]

## 201 · 예제에 적용하기

### 설계 예시

암호화된 백업 스냅샷을 별도 환경에서 복원한다고 가정합니다. 데이터 사본이 있는지 확인한 다음, 복구 환경에서 필요한 키를 사용할 수 있는지와 실제 호출 주체에 권한이 있는지 확인합니다.

백업 파일의 존재만으로 복구가 끝나지는 않습니다. 키나 권한이 없어서 복호화할 수 없는 상황도 복구 계획에 포함합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 키 관리 권한과 데이터 복호화 권한의 담당자를 구분합니다.

- 백업 복사·리전/계정 복구 때 데이터뿐 아니라 키와 허용 정책이 살아 있는지 확인합니다.

- 키 삭제 전 의존 데이터를 파악하고 단순 비용 절감 때문에 복구 능력을 제거하지 않습니다.

### 운영 확인

- [ ] 서비스 호출자와 키 사용 주체에 필요한 권한이 있나요?
- [ ] 암호화된 백업을 별도 복구 환경에서 복호화할 수 있나요?
- [ ] 키 회전·비활성화·삭제의 영향을 각각 구분하나요?

## 이해 확인

**질문:** 키를 회전하면 이미 저장된 데이터도 모두 새로 암호화될까요?

**해설:** 키 재료의 회전은 기존 데이터의 일괄 재암호화가 아닙니다. 회전, 비활성화와 삭제를 서로 다른 작업으로 검토합니다.[^kms-rotation]

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

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
