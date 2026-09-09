---
type: Concept
title: 'IAM User: 장기 자격 증명의 예외적 사용'
description: Root·IAM User·Role을 구분하고, 장기 자격 증명이 필요한 예외의 조건을 설명합니다.
concept_id: aws-iam-user
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
- id: iam-user
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html
  title: IAM users
- id: iam-practices
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
  title: Security best practices in IAM
---

# IAM User: 장기 자격 증명의 예외적 사용

## 요약

AWS에서는 요청을 보낸 주체가 누구인지 확인하는 인증과, 어떤 작업을 허용할지 정하는 권한 평가를 구분합니다. IAM User는 계정 안에 만드는 주체입니다. 사람과 애플리케이션 모두 임시 자격 증명 사용을 우선 검토하고, 장기 자격 증명이 필요한 예외를 따로 관리합니다.[^iam-user][^iam-practices]

## 학습 목표

Root·IAM User·Role을 구분하고, 장기 자격 증명이 필요한 예외의 조건을 설명합니다.

## 선수 지식

AWS 계정과 그 계정 안의 사용자를 구분하고 시작합니다. Federation은 외부 신원 제공자의 인증을 연계하는 방식입니다. 임시 권한은 [IAM Role](aws-iam-role.md)에서 이어서 읽습니다.

## 101 · 개념 이해

### 외부 사실

IAM User는 AWS 계정 안의 identity이며 계정 root와 다릅니다. Administrator 권한이 있는 User도 root 자체는 아닙니다.[^iam-user]

User는 비밀번호나 access key 같은 자격 증명을 가질 수 있습니다. 인증 수단과 어떤 작업을 허용하는지는 별도 문제입니다.[^iam-user]

AWS는 사람에게 federation과 임시 자격 증명을, workload에는 Role을 우선 사용하도록 권고합니다. IAM User는 이를 지원하지 않는 구체적인 예외에 검토합니다.[^iam-practices]

## 201 · 예제에 적용하기

### 설계 예시

외부 도구가 장기 access key만 지원한다고 가정합니다. 먼저 Role이나 인증 연계로 대체할 수 없는 이유를 확인합니다. 예외가 필요하다면 사람의 관리자 키를 공유하지 않고 도구 전용 User와 필요한 작업·리소스 범위를 검토합니다.

소유자, 키 사용처, 교체 절차와 폐기 조건을 남겨야 이후 회수 때 의존 서비스를 확인할 수 있습니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 예외 User마다 필요한 이유·소유자·용도·폐기 조건을 기록합니다.

- Access key를 코드·이미지·문서에 넣지 않고 사용처와 교체 절차를 추적합니다.

- Console 접근을 유지하는 계정의 MFA와 불필요한 자격 증명 제거를 확인합니다.

### 운영 확인

- [ ] Role이나 federation으로 대체할 수 없는 이유가 있나요?
- [ ] 사용 중인 key와 미사용 key를 구분할 수 있나요?
- [ ] 퇴사·서비스 종료 시 회수와 의존 서비스 확인 절차가 있나요?

## 이해 확인

**질문:** 관리자 권한이 있는 IAM User는 계정 root와 같은 사용자일까요?

**해설:** 서로 다른 주체입니다. 관리자 권한과 계정 root의 신원은 구분해야 합니다.[^iam-user]

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [IAM Role: 신뢰 정책과 임시 세션 권한](aws-iam-role.md)
- [IAM Policy: 명시적 허용과 유효 권한 평가](aws-iam-policy.md)
- [OIDC](../../../glossary/ko/oidc.md)

[English](../../en/security/aws-iam-user.md)

## 출처

[^iam-user]: [IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)
[^iam-practices]: [Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
