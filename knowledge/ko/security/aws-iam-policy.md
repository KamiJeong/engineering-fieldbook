---
type: Concept
title: 'IAM Policy: 명시적 허용과 유효 권한 평가'
description: 정책의 작업·리소스·조건을 읽고, 허용과 거부 요청을 각각 확인할 이유를 설명합니다.
concept_id: aws-iam-policy
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
- id: iam-policy
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html
  title: Policies and permissions in IAM
- id: iam-evaluation
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
  title: Policy evaluation logic
---

# IAM Policy: 명시적 허용과 유효 권한 평가

## 요약

IAM 정책은 요청에 어떤 권한을 적용할지 표현합니다. 읽을 때는 누가 어떤 리소스에 어떤 작업을 요청하는지부터 정리합니다. 정책 하나에 Allow가 있어도 함께 적용되는 제한과 명시적 Deny에 따라 실제 결과가 달라질 수 있습니다.[^iam-policy][^iam-evaluation]

## 학습 목표

정책의 작업·리소스·조건을 읽고, 허용과 거부 요청을 각각 확인할 이유를 설명합니다.

## 선수 지식

[IAM User](aws-iam-user.md)와 [IAM Role](aws-iam-role.md)을 읽습니다. Principal은 요청 주체이고, ARN은 AWS 리소스를 식별하는 이름입니다. JSON은 필드와 값으로 구조화한 데이터 표기입니다.

## 101 · 개념 이해

### 외부 사실

대부분의 IAM 정책은 JSON으로 표현합니다. 사용자·역할에 연결하는 자격 증명 기반(identity-based) 정책과 리소스에 연결하는 리소스 기반(resource-based) 정책 등을 구분합니다. Effect는 허용·거부, Action은 작업, Resource는 대상, Condition은 적용 조건입니다. Principal은 정책 종류에 따라 요청 주체를 지정할 때 사용합니다.[^iam-policy]

적용 가능한 명시적 Deny는 Allow보다 우선합니다. 같은 계정의 identity/resource 정책 관계와 cross-account 권한은 문맥에 맞게 평가합니다.[^iam-evaluation]

Permissions boundary는 자격 증명 기반 정책이 사용자·역할에 부여할 수 있는 권한의 상한입니다. 리소스 기반 정책의 허용까지 같은 방식으로 제한한다고 일반화하지 않습니다. SCP(Service Control Policy)는 조직의 계정에 적용하는 권한 제한 정책입니다. 이 제한 정책 자체가 작업 권한을 부여하는 것은 아닙니다.[^iam-policy]

## 201 · 예제에 적용하기

### 설계 예시

S3의 특정 prefix 아래 객체 읽기를 허용하려는 상황을 가정합니다. 먼저 버킷 목록 조회와 객체 읽기를 서로 다른 작업으로 적습니다. 각 작업에 필요한 API와 리소스 ARN 범위를 확인한 뒤, 허용할 요청과 거부할 요청을 나누어 검증합니다.

이 문장은 배포 가능한 완성 정책이 아닙니다. AccessDenied가 발생하면 권한을 넓히기 전에 실제 요청 주체·작업·리소스·조건과 적용 정책을 수집합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 리소스·작업·조건을 업무에 맞춰 좁히고 wildcard의 이유를 기록합니다.

- AccessDenied를 해결할 때 모든 권한을 주기 전에 실제 principal·action·resource·context를 수집합니다.

- 허용해야 할 요청뿐 아니라 거부해야 할 요청도 검증합니다.

### 운영 확인

- [ ] 정책을 읽는 identity와 대상 resource가 실제 요청과 일치하나요?
- [ ] Trust·resource policy·조직 정책·KMS key policy를 필요한 범위에서 확인했나요?
- [ ] List·Read·Write·Delete 권한을 구분했나요?

## 이해 확인

**질문:** Permissions boundary나 SCP만 추가하면 필요한 작업 권한도 생길까요?

**해설:** 이 정책들은 권한의 상한을 제한하며 자체적으로 작업 권한을 부여하지 않습니다. 허용 정책과 적용되는 제한을 함께 평가해야 합니다.[^iam-policy]

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [IAM Role: 신뢰 정책과 임시 세션 권한](aws-iam-role.md)
- [IAM User: 장기 자격 증명의 예외적 사용](aws-iam-user.md)
- [Amazon S3: 객체 저장과 접근 설계](../cloud/aws-s3.md)
- [AWS KMS: 암호화 키와 복호화 권한](aws-kms.md)

[English](../../en/security/aws-iam-policy.md)

## 출처

[^iam-policy]: [Policies and permissions in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
[^iam-evaluation]: [Policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
