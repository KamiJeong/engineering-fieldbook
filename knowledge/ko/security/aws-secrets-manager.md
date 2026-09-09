---
type: Concept
title: 'Secrets Manager: 비밀 조회·회전·소비자 갱신'
description: 저장·회전·소비자 갱신을 구분하고, 실행 중인 애플리케이션의 새 값 반영을 확인합니다.
concept_id: aws-secrets-manager
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
- id: secrets
  resource: https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html
  title: What is AWS Secrets Manager?
- id: secret-rotation
  resource: https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html
  title: Rotate AWS Secrets Manager secrets
- id: ecs-secret
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html
  title: Pass Secrets Manager secrets through Amazon ECS environment variables
---

# Secrets Manager: 비밀 조회·회전·소비자 갱신

## 요약

DB 비밀번호나 API 키를 코드에 직접 넣으면 변경과 접근 관리가 어려워집니다. Secrets Manager는 이런 비밀 값을 저장하고 조회·회전하도록 돕습니다. 비밀 값을 바꾼 뒤 실제 애플리케이션이 새 값을 사용하는지까지 확인해야 합니다.[^secrets][^secret-rotation]

## 학습 목표

저장·회전·소비자 갱신을 구분하고, 실행 중인 애플리케이션의 새 값 반영을 확인합니다.

## 선수 지식

[IAM Role](aws-iam-role.md)과 [ECS](../cloud/aws-ecs.md)를 읽습니다. 회전(rotation)은 저장된 비밀 값과 대상 서비스의 자격 증명을 갱신하는 과정입니다.[^secret-rotation]

## 101 · 개념 이해

### 외부 사실

Secrets Manager는 DB 자격 증명·API key 등 비밀의 저장·조회·회전을 돕습니다. AWS workload 자격 증명은 Role 사용을 우선 검토합니다.[^secrets]

Rotation은 저장된 secret과 대상 DB/서비스의 자격 증명을 함께 갱신하는 과정입니다. 관리형 회전과 Lambda 기반 회전 등 지원 방식은 대상에 따라 다릅니다.[^secret-rotation]

ECS 환경 변수로 주입한 secret은 회전만으로 실행 중 컨테이너에 자동 반영되지 않습니다. 새 Task 실행 등 소비자 갱신이 필요합니다.[^ecs-secret]

## 201 · 예제에 적용하기

### 설계 예시

DB 비밀번호를 ECS 환경 변수로 주입한 Task가 있다고 가정합니다. 비밀번호를 회전한 뒤에도 기존 Task의 환경 변수는 자동으로 바뀌지 않습니다. 예전 값으로 DB에 다시 접속하면 인증이 실패할 수 있습니다.

새 Task 실행 등 값의 반영 절차, 기존 연결 풀의 갱신, 실제 쿼리 성공을 함께 확인합니다. 비밀 값을 로그에 출력해 확인하는 방식은 피합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 런타임 조회·캐시·시작 시 주입 중 소비 방식을 명시하고 갱신 실패를 설계합니다.

- 로그·오류 메시지·진단 덤프에 비밀 값을 남기지 않도록 확인합니다.

- 회전 성공 지표에 대상 서비스 인증과 실제 애플리케이션 요청을 포함합니다.

### 운영 확인

- [ ] 누가 어떤 secret을 읽을 수 있나요?
- [ ] 캐시와 실행 중 프로세스는 새 값을 언제 반영하나요?
- [ ] 회전 실패 시 어떤 값과 상태를 기준으로 복구하나요?

## 이해 확인

**질문:** Secrets Manager에 새 값이 저장되었으면 회전 검증이 끝난 것일까요?

**해설:** 대상 서비스의 인증과 소비자의 새 값 반영까지 확인해야 합니다. 저장 성공만으로 실행 중 애플리케이션의 성공을 판단하지 않습니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [IAM Role: 신뢰 정책과 임시 세션 권한](aws-iam-role.md)
- [AWS KMS: 암호화 키와 복호화 권한](aws-kms.md)
- [Amazon ECS: Task와 Service의 오케스트레이션](../cloud/aws-ecs.md)
- [RDS for PostgreSQL: 관리형 DB의 책임 경계](../data/aws-rds-postgresql.md)

[English](../../en/security/aws-secrets-manager.md)

## 출처

[^secrets]: [What is AWS Secrets Manager?](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)
[^secret-rotation]: [Rotate AWS Secrets Manager secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html)
[^ecs-secret]: [Pass Secrets Manager secrets through Amazon ECS environment variables](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html)
