---
type: Concept
title: 'IAM Policy: 명시적 허용과 유효 권한 평가'
description: 한 정책의 Allow 대신 요청에 적용되는 모든 권한 경계를 검토한다.
concept_id: aws-iam-policy
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
- id: iam-policy
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html
  title: Policies and permissions in IAM
- id: iam-evaluation
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
  title: Policy evaluation logic
---

# IAM Policy: 명시적 허용과 유효 권한 평가

## 요약

한 정책의 Allow 대신 요청에 적용되는 모든 권한 경계를 검토한다.

## 외부 사실

- 대부분의 IAM 정책은 JSON이며 identity 기반과 resource 기반 정책 등을 구분한다. 주요 요소는 Effect·Action·Resource·Condition이고 Principal은 정책 종류에 따라 사용한다.[^iam-policy]

- 적용 가능한 명시적 Deny는 Allow보다 우선한다. 같은 계정의 identity/resource 정책 관계와 cross-account 권한은 문맥에 맞게 평가한다.[^iam-evaluation]

- Permissions boundary·SCP 같은 제한 정책 자체가 작업 권한을 부여하는 것은 아니다.[^iam-policy]

## 선택 기준과 권고

- 리소스·작업·조건을 업무에 맞춰 좁히고 wildcard의 이유를 기록한다.

- AccessDenied를 해결할 때 모든 권한을 주기 전에 실제 principal·action·resource·context를 수집한다.

- 허용해야 할 요청뿐 아니라 거부해야 할 요청도 검증한다.

## 설계 예시

설계 예: 특정 S3 prefix의 객체 읽기는 bucket 목록 조회와 다른 권한 요구다. 리소스 ARN 범위와 필요한 API를 각각 나열하며 이 문장을 배포 가능한 완성 정책으로 취급하지 않는다.

## 운영 확인

- [ ] 정책을 읽는 identity와 대상 resource가 실제 요청과 일치하는가?
- [ ] Trust·resource policy·조직 정책·KMS key policy를 필요한 범위에서 확인했는가?
- [ ] List·Read·Write·Delete 권한을 구분했는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [IAM Role: 신뢰 정책과 임시 세션 권한](aws-iam-role.md)
- [IAM User: 장기 자격 증명의 예외적 사용](aws-iam-user.md)
- [Amazon S3: 객체 저장과 접근 설계](../cloud/aws-s3.md)
- [AWS KMS: 암호화 키와 복호화 권한](aws-kms.md)

[English](../../en/security/aws-iam-policy.md)

## 출처

[^iam-policy]: [Policies and permissions in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
[^iam-evaluation]: [Policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
