---
type: Concept
title: 'Amazon ECS: Task와 Service의 오케스트레이션'
description: 컨테이너 실행 정의·배포·원하는 실행 수를 관리하는 서비스.
concept_id: aws-ecs
language: ko
tags:
- aws
- compute
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
- id: ecs
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html
  title: What is Amazon ECS?
- id: ecs-roles
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html
  title: IAM roles for Amazon ECS
---

# Amazon ECS: Task와 Service의 오케스트레이션

## 요약

컨테이너 실행 정의·배포·원하는 실행 수를 관리하는 서비스.

## 외부 사실

- ECS는 컨테이너 오케스트레이터다. EC2와 Fargate는 실행 용량 선택지이며, 현재 Managed Instances와 외부 서버 지원도 존재한다.[^ecs]

- Task definition은 실행 명세, Task는 실행 단위다. Service는 지속 실행할 Task와 배포를 관리한다.[^ecs]

- 애플리케이션 AWS API 호출의 task role과 이미지 가져오기·지정 로그/비밀 주입 등 실행 준비의 task execution role을 구분한다.[^ecs-roles]

## 선택 기준과 권고

- 지속 API는 Service, 완료 후 종료하는 작업은 독립 Task를 출발점으로 검토한다.

- 배포 성공을 Task 시작만으로 판단하지 말고 준비 상태·트래픽·오류율을 확인한다.

- Task 수와 실행 인프라 용량의 확장을 별도로 검토한다.

## 설계 예시

원하는 Task 수가 2일 때 장애·배포 중 처리량은 별도 부하 검증 대상이다. 이 숫자를 고가용성 보장으로 기록하지 않는다.

## 운영 확인

- [ ] Task definition 버전과 이미지 식별자를 추적하는가?
- [ ] 실패한 배포의 종료 사유·권한·health check를 확인할 수 있는가?
- [ ] Task 역할과 실행 역할의 권한을 섞지 않았는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [Amazon EC2: 가상 서버와 운영 책임](aws-ec2.md)
- [AWS Fargate: ECS의 관리형 실행 용량](aws-fargate.md)
- [IAM Role: 신뢰 정책과 임시 세션 권한](../security/aws-iam-role.md)
- [Secrets Manager: 비밀 조회·회전·소비자 갱신](../security/aws-secrets-manager.md)

[English](../../en/cloud/aws-ecs.md)

## 출처

[^ecs]: [What is Amazon ECS?](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)
[^ecs-roles]: [IAM roles for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html)
