---
type: Concept
title: 'Amazon ECS: Task와 Service의 오케스트레이션'
description: Task definition·Task·Service의 역할을 구분하고, 실행 수와 배포 성공을 따로 판단합니다.
concept_id: aws-ecs
language: ko
tags:
- aws
- compute
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T05:01:30Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2027-01-07T00:46:30+00:00'
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

컨테이너로 묶은 애플리케이션도 어디서 몇 개를 실행하고 어떻게 교체할지 정해야 합니다. Amazon ECS는 이 실행과 배포를 관리하는 서비스입니다. 실행할 내용을 적은 명세가 Task definition이고, 그 명세로 실행한 단위가 Task입니다.[^ecs]

## 학습 목표

Task definition·Task·Service의 역할을 구분하고, 실행 수와 배포 성공을 따로 판단합니다.

## 선수 지식

컨테이너 이미지는 실행할 애플리케이션을 묶은 배포 단위라고 이해하고 시작합니다. 서버의 운영 책임은 [EC2](aws-ec2.md), 실행 용량의 다른 선택지는 [Fargate](aws-fargate.md)에서 비교합니다.

## 101 · 개념 이해

### 외부 사실

ECS는 컨테이너 오케스트레이터입니다. EC2와 Fargate는 실행 용량 선택지이며, 현재 Managed Instances와 외부 서버 지원도 존재합니다.[^ecs]

Task definition은 실행 명세, Task는 실행 단위입니다. Service는 지속 실행할 Task와 배포를 관리합니다.[^ecs]

애플리케이션 AWS API 호출의 task role과 이미지 가져오기·지정 로그/비밀 주입 등 실행 준비의 task execution role을 구분합니다.[^ecs-roles]

## 201 · 예제에 적용하기

### 설계 예시

지속적으로 요청을 받는 API에 Task 두 개를 유지하도록 Service를 구성했다고 가정합니다. 새 버전의 Task가 시작되면 먼저 요청을 받을 준비가 되었는지 확인합니다. 그다음 요청이 실제로 전달되는지와 오류율을 확인합니다.

원하는 Task 수가 2라는 설정은 시작점입니다. 장애나 배포 중에도 필요한 처리량이 나오는지는 별도 부하 검증이 필요합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 지속 API는 Service, 완료 후 종료하는 작업은 독립 Task를 출발점으로 검토합니다.

- 배포 성공을 Task 시작만으로 판단하지 말고 준비 상태·트래픽·오류율을 확인합니다.

- Task 수와 실행 인프라 용량의 확장을 별도로 검토합니다.

### 운영 확인

- [ ] Task definition 버전과 이미지 식별자를 추적하나요?
- [ ] 실패한 배포의 종료 사유·권한·health check를 확인할 수 있나요?
- [ ] Task 역할과 실행 역할의 권한을 섞지 않았나요?

## 이해 확인

**질문:** 새 Task가 시작되었는데 사용자 요청이 실패한다면 어떤 정보를 더 확인할까요?

**해설:** 준비 상태와 상태 점검(health check), 실제 트래픽, 오류 및 종료 사유를 확인합니다. Task 시작과 사용자 요청 성공은 다른 관측입니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [Amazon EC2: 가상 서버와 운영 책임](aws-ec2.md)
- [AWS Fargate: ECS의 관리형 실행 용량](aws-fargate.md)
- [IAM Role: 신뢰 정책과 임시 세션 권한](../security/aws-iam-role.md)
- [Secrets Manager: 비밀 조회·회전·소비자 갱신](../security/aws-secrets-manager.md)

[English](../../en/cloud/aws-ecs.md)

## 출처

[^ecs]: [What is Amazon ECS?](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)
[^ecs-roles]: [IAM roles for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html)
