---
type: Concept
title: 'IAM Role: 신뢰 정책과 임시 세션 권한'
description: 신뢰 정책과 권한 정책의 질문을 구분하고, ECS의 애플리케이션 역할과 실행 역할을 선택합니다.
concept_id: aws-iam-role
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
- id: iam-role
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html
  title: IAM roles
- id: ecs-roles
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html
  title: IAM roles for Amazon ECS
---

# IAM Role: 신뢰 정책과 임시 세션 권한

## 요약

애플리케이션에 필요한 AWS 권한을 줄 때 장기 access key를 직접 전달하지 않는 방식을 검토할 수 있습니다. IAM 역할(Role)은 맡아서 사용하는 권한의 주체이며, 역할을 맡으면 세션용 임시 자격 증명을 받습니다. 누가 맡을 수 있는지와 어떤 작업을 할 수 있는지를 나누어 읽습니다.[^iam-role]

## 학습 목표

신뢰 정책과 권한 정책의 질문을 구분하고, ECS의 애플리케이션 역할과 실행 역할을 선택합니다.

## 선수 지식

[IAM User](aws-iam-user.md)에서 인증과 권한의 차이를 확인합니다. 역할을 맡는 동작을 assume이라고 부릅니다. ECS 예제의 실행 단위는 [Task](../cloud/aws-ecs.md)입니다.

## 101 · 개념 이해

### 외부 사실

역할(Role)은 일반적인 장기 비밀번호나 access key를 갖는 대신, 역할을 맡은 세션에 임시 자격 증명을 제공합니다.[^iam-role]

신뢰 정책(trust policy)은 누가 어떤 조건으로 역할을 맡을 수 있는지 정의합니다. 권한 정책(permissions policy)은 역할 세션이 수행할 작업의 권한을 정의합니다. 실제 요청의 허용 여부는 함께 적용되는 정책 평가 규칙으로 확인합니다.[^iam-role]

ECS에서 애플리케이션 task role과 task execution role은 용도가 다릅니다.[^ecs-roles]

## 201 · 예제에 적용하기

### 설계 예시

ECS 애플리케이션이 실행 중 S3 객체를 읽지 못한다고 가정합니다. 이때는 애플리케이션의 task role과 대상 S3 권한을 확인합니다. 반면 시작 전에 이미지를 가져오지 못한다면 task execution role과 이미지 저장소 접근을 확인합니다.

같은 권한 오류처럼 보여도 호출 주체가 다릅니다. 실패한 작업과 주체를 확인한 뒤 해당 정책을 검토해야 불필요하게 넓은 권한을 주지 않을 수 있습니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 서비스·배포·애플리케이션 목적에 맞는 Role을 분리하고 넓은 trust를 피합니다.

- 외부 신원 제공자와 연동할 때는 발급자(issuer)와 토큰의 대상(audience) 조건을 실제 제공자의 계약에 맞춰 제한합니다.

- 자격 증명의 자동 갱신 경로와 만료·권한 변경 때의 오류 처리도 검토합니다.

### 운영 확인

- [ ] 현재 요청이 어떤 Role session에서 실행됐는지 확인할 수 있나요?
- [ ] Trust 허용 범위와 실제 필요한 AWS 작업이 별도로 검토됐나요?
- [ ] 배포 주체가 애플리케이션 런타임보다 불필요하게 넓은 권한을 넘기지 않나요?

## 이해 확인

**질문:** 신뢰 정책에서 역할 사용을 허용하면 모든 AWS 작업도 허용될까요?

**해설:** 신뢰 정책은 누가 역할을 맡을 수 있는지를 다룹니다. 맡은 뒤 작업 권한은 권한 정책과 함께 적용되는 평가 규칙으로 확인해야 합니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [IAM User: 장기 자격 증명의 예외적 사용](aws-iam-user.md)
- [IAM Policy: 명시적 허용과 유효 권한 평가](aws-iam-policy.md)
- [Amazon ECS: Task와 Service의 오케스트레이션](../cloud/aws-ecs.md)
- [OIDC](../../../glossary/ko/oidc.md)

[English](../../en/security/aws-iam-role.md)

## 출처

[^iam-role]: [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
[^ecs-roles]: [IAM roles for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html)
