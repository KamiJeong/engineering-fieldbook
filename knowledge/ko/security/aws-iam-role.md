---
type: Concept
title: 'IAM Role: 신뢰 정책과 임시 세션 권한'
description: 누가 Role을 맡을 수 있는지와 맡은 뒤 무엇을 할 수 있는지를 분리한다.
concept_id: aws-iam-role
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
- id: iam-role
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html
  title: IAM roles
- id: ecs-roles
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html
  title: IAM roles for Amazon ECS
---

# IAM Role: 신뢰 정책과 임시 세션 권한

## 요약

누가 Role을 맡을 수 있는지와 맡은 뒤 무엇을 할 수 있는지를 분리한다.

## 외부 사실

- Role은 일반적인 장기 password/access key 대신 assume 후 임시 세션 자격 증명을 제공하는 identity다.[^iam-role]

- Trust policy는 Role을 맡을 principal과 조건을 정의하고 permissions policy는 세션의 작업 권한을 정의한다. 실제 허용에는 관련 평가 규칙이 적용된다.[^iam-role]

- ECS에서 애플리케이션 task role과 task execution role은 용도가 다르다.[^ecs-roles]

## 선택 기준과 권고

- 서비스·배포·애플리케이션 목적에 맞는 Role을 분리하고 넓은 trust를 피한다.

- 외부 identity 연동 시 issuer와 대상 조건을 실제 identity provider 계약에 맞춰 제한한다.

- 자격 증명의 자동 갱신 경로와 만료·권한 변경 때의 오류 처리도 검토한다.

## 설계 예시

ECS 애플리케이션이 S3를 읽는다면 task role의 권한을 확인한다. 이미지 pull이 실패했다면 같은 정책을 확대하기 전에 실행 역할과 레지스트리 접근을 구분한다.

## 운영 확인

- [ ] 현재 요청이 어떤 Role session에서 실행됐는지 확인할 수 있는가?
- [ ] Trust 허용 범위와 실제 필요한 AWS 작업이 별도로 검토됐는가?
- [ ] 배포 주체가 애플리케이션 런타임보다 불필요하게 넓은 권한을 넘기지 않는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [IAM User: 장기 자격 증명의 예외적 사용](aws-iam-user.md)
- [IAM Policy: 명시적 허용과 유효 권한 평가](aws-iam-policy.md)
- [Amazon ECS: Task와 Service의 오케스트레이션](../cloud/aws-ecs.md)
- [OIDC](../../../glossary/ko/oidc.md)

[English](../../en/security/aws-iam-role.md)

## 출처

[^iam-role]: [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
[^ecs-roles]: [IAM roles for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html)
