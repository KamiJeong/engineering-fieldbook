---
type: Concept
title: 'Secrets Manager: 비밀 조회·회전·소비자 갱신'
description: 비밀 값의 저장뿐 아니라 실제 소비자의 안전한 갱신을 관리한다.
concept_id: aws-secrets-manager
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

비밀 값의 저장뿐 아니라 실제 소비자의 안전한 갱신을 관리한다.

## 외부 사실

- Secrets Manager는 DB 자격 증명·API key 등 비밀의 저장·조회·회전을 돕는다. AWS workload 자격 증명은 Role 사용을 우선 검토한다.[^secrets]

- Rotation은 저장된 secret과 대상 DB/서비스의 자격 증명을 함께 갱신하는 과정이다. 관리형 회전과 Lambda 기반 회전 등 지원 방식은 대상에 따라 다르다.[^secret-rotation]

- ECS 환경 변수로 주입한 secret은 회전만으로 실행 중 컨테이너에 자동 반영되지 않는다. 새 Task 실행 등 소비자 갱신이 필요하다.[^ecs-secret]

## 선택 기준과 권고

- 런타임 조회·캐시·시작 시 주입 중 소비 방식을 명시하고 갱신 실패를 설계한다.

- 로그·오류 메시지·진단 덤프에 비밀 값을 남기지 않도록 확인한다.

- 회전 성공 지표에 대상 서비스 인증과 실제 애플리케이션 요청을 포함한다.

## 설계 예시

DB password 회전 후 기존 Task가 예전 환경 변수로 재접속하면 인증이 실패할 수 있다. 새 값 배포·연결 pool 갱신·실제 쿼리 확인을 하나의 절차로 검토한다.

## 운영 확인

- [ ] 누가 어떤 secret을 읽을 수 있는가?
- [ ] 캐시와 실행 중 프로세스는 새 값을 언제 반영하는가?
- [ ] 회전 실패 시 어떤 값과 상태를 기준으로 복구하는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

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
