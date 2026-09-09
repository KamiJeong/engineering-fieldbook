---
type: Concept
title: 'Amazon EC2: 가상 서버와 운영 책임'
description: 인스턴스·AMI·인스턴스 유형을 구분하고, 서버 교체 때 확인할 항목을 설명합니다.
concept_id: aws-ec2
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
- id: ec2
  resource: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html
  title: What is Amazon EC2?
- id: shared
  resource: https://aws.amazon.com/compliance/shared-responsibility-model/
  title: AWS Shared Responsibility Model
---

# Amazon EC2: 가상 서버와 운영 책임

## 요약

웹 애플리케이션을 실행하려면 프로그램이 동작할 서버가 필요합니다. Amazon EC2는 AWS에서 가상 서버를 실행하는 서비스이며, 이 서버를 인스턴스(instance)라고 부릅니다. 운영체제와 자원 구성을 선택할 수 있는 만큼 사용자가 관리할 범위도 이해해야 합니다.[^ec2][^shared]

## 학습 목표

인스턴스·AMI·인스턴스 유형을 구분하고, 서버 교체 때 확인할 항목을 설명합니다.

## 선수 지식

프로그램을 실행하는 컴퓨터와 운영체제(OS)의 관계를 알고 있으면 좋습니다. 네트워크 접근 설정이 낯설다면 [VPC](aws-vpc.md)와 [보안 그룹](aws-security-group.md)을 함께 읽습니다.

## 101 · 개념 이해

### 외부 사실

EC2 인스턴스는 가상 서버입니다. AMI(Amazon Machine Image)는 운영체제와 필요한 소프트웨어를 포함한 시작 이미지입니다. 인스턴스 유형(instance type)은 CPU·메모리·네트워크 등의 자원 구성을 정합니다.[^ec2]

EBS는 데이터를 지속적으로 보관하는 저장 볼륨입니다. Instance store는 임시 데이터를 위한 저장소입니다. 데이터 보존은 저장장치 종류와 삭제 설정을 구분해야 합니다.[^ec2]

직접 관리하는 EC2에서는 인스턴스 운영체제의 업데이트와 보안 패치, 설치한 애플리케이션과 접근 설정이 고객의 책임입니다.[^shared]

## 201 · 예제에 적용하기

### 설계 예시

API 서버 두 대 중 한 대를 교체하는 상황을 가정합니다. 먼저 남은 한 대가 받아야 할 요청량을 정합니다. 다음으로 그 요청량에서 응답 시간과 오류를 측정하고, 새 서버에 설정과 데이터를 복원하는 절차를 확인합니다.

이 예제의 판단 기준은 서버 대수가 아니라 교체 중 요구 처리량을 유지하고 복구할 수 있는지입니다. 실제 측정 결과는 별도로 기록해야 합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 호스트 제어가 필요한 이유를 적고, 컨테이너만 필요하다면 ECS/Fargate와 운영 부담을 비교합니다.

- 이미지·설정·교체 절차를 함께 관리해 단일 서버의 수동 변경에 의존하지 않습니다.

- 비용 비교에 볼륨·스냅샷·공인 주소·전송과 운영 시간을 포함합니다.

### 운영 확인

- [ ] 인스턴스 교체 후 서비스와 데이터를 복원할 수 있나요?
- [ ] 패치 담당자·유지보수 창·애플리케이션 health check가 있나요?
- [ ] CPU 외 메모리·디스크·네트워크 병목도 관측하나요?

## 이해 확인

**질문:** 서버 두 대가 실행 중이라는 사실만으로 교체 중에도 서비스가 정상이라고 판단할 수 있을까요?

**해설:** 남은 서버의 처리량, 애플리케이션 상태, 데이터 복원과 접속 전환을 확인해야 합니다. 두 대라는 수는 이 조건들을 증명하지 않습니다.

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [Amazon ECS: Task와 Service의 오케스트레이션](aws-ecs.md)
- [AWS Fargate: ECS의 관리형 실행 용량](aws-fargate.md)
- [Security Group: 리소스 통신 허용 규칙](aws-security-group.md)
- [IAM Role: 신뢰 정책과 임시 세션 권한](../security/aws-iam-role.md)

[English](../../en/cloud/aws-ec2.md)

## 출처

[^ec2]: [What is Amazon EC2?](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)
[^shared]: [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
