---
type: Concept
title: 'AWS Fargate: ECS의 관리형 실행 용량'
description: Fargate가 맡는 서버 관리와 사용자가 설정할 자원·네트워크·권한을 구분합니다.
concept_id: aws-fargate
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
- id: fargate
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html
  title: AWS Fargate for Amazon ECS
- id: fargate-tasks
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html
  title: Amazon ECS task definitions for Fargate
- id: fargate-network
  resource: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html
  title: Amazon ECS task networking options for Fargate
---

# AWS Fargate: ECS의 관리형 실행 용량

## 요약

AWS Fargate를 ECS와 함께 사용하면 컨테이너를 실행할 서버 군을 직접 관리하는 부담을 줄일 수 있습니다. 사용자는 Task에 필요한 CPU·메모리, 네트워크와 권한을 지정합니다. 서버 관리가 줄어도 애플리케이션의 연결과 데이터 관리는 남습니다.[^fargate]

## 학습 목표

Fargate가 맡는 서버 관리와 사용자가 설정할 자원·네트워크·권한을 구분합니다.

## 선수 지식

[ECS의 Task와 Service](aws-ecs.md), [서브넷](aws-subnets.md), [IAM Role](../security/aws-iam-role.md)을 먼저 확인합니다. ENI는 Task가 네트워크에 연결될 때 사용하는 가상 네트워크 인터페이스입니다.[^fargate-network]

## 101 · 개념 이해

### 외부 사실

이 문서는 ECS에서 사용하는 Fargate를 다룹니다. 서버 군을 직접 구성하지 않고 Task CPU·메모리와 실행 구성을 지정합니다.[^fargate]

Fargate Task는 awsvpc 네트워크 모드를 사용합니다. Task ENI 주소·Subnet·Security Group을 함께 설정합니다.[^fargate-tasks][^fargate-network]

이미지 가져오기·로그·비밀 접근에도 통신 경로가 필요합니다. Private Subnet에서는 NAT 또는 필요한 서비스 Endpoint를 검토합니다.[^fargate-network]

## 201 · 예제에 적용하기

### 설계 예시

Private Subnet의 Task가 시작되지 않는 상황을 가정합니다. 이미지 저장소에 접근할 경로가 있는지, 실행 역할에 이미지 조회 권한이 있는지 차례로 확인합니다. 로그와 비밀 값 조회도 각각 경로와 권한을 확인합니다.

확인 결과는 실패한 단계와 연결해야 합니다. 이미지를 가져오지 못한 상태를 애플리케이션 코드 오류로 단정하면 진단 범위를 잘못 잡게 됩니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 호스트 운영 부담을 줄이려는 팀의 후보로 삼되 필요한 실행 기능·자원 조합의 지원을 확인합니다.

- 컨테이너 내부 파일을 영구 데이터의 유일한 사본으로 두지 않습니다.

- Task 크기·수뿐 아니라 NAT·로그·로드밸런서 비용을 포함합니다.

### 운영 확인

- [ ] 이미지·로그·Secrets Manager 각각의 경로와 권한이 유효한가요?
- [ ] Task 교체 시 진행 중인 요청을 어떻게 종료하나요?
- [ ] 자원 제한에 맞는 애플리케이션 동시성을 측정했나요?

## 이해 확인

**질문:** 서버를 직접 관리하지 않는데도 Task가 외부 서비스에 접근하지 못할 수 있는 이유는 무엇일까요?

**해설:** Task의 주소·서브넷·통신 경로와 실행 또는 애플리케이션 권한은 별도로 설정해야 하기 때문입니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [Amazon ECS: Task와 Service의 오케스트레이션](aws-ecs.md)
- [Public / Private Subnet: 라우팅으로 구분하기](aws-subnets.md)
- [NAT Gateway: egress와 가용성 모드](aws-nat-gateway.md)
- [Secrets Manager: 비밀 조회·회전·소비자 갱신](../security/aws-secrets-manager.md)

[English](../../en/cloud/aws-fargate.md)

## 출처

[^fargate]: [AWS Fargate for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
[^fargate-tasks]: [Amazon ECS task definitions for Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html)
[^fargate-network]: [Amazon ECS task networking options for Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html)
