---
type: Concept
title: 'Amazon EC2: 가상 서버와 운영 책임'
description: OS와 인스턴스 구성을 직접 제어하는 컴퓨팅 선택지.
concept_id: aws-ec2
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
- id: ec2
  resource: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html
  title: What is Amazon EC2?
- id: shared
  resource: https://aws.amazon.com/compliance/shared-responsibility-model/
  title: AWS Shared Responsibility Model
---

# Amazon EC2: 가상 서버와 운영 책임

## 요약

OS와 인스턴스 구성을 직접 제어하는 컴퓨팅 선택지.

## 외부 사실

- EC2 인스턴스는 가상 서버다. AMI는 시작 이미지이고 인스턴스 타입은 CPU·메모리·네트워크 등의 자원 구성을 정한다.[^ec2]

- EBS는 지속 저장 볼륨이고 instance store는 임시 저장소다. 데이터 보존은 저장장치 종류와 삭제 설정을 구분해야 한다.[^ec2]

- 직접 관리하는 EC2에서는 guest OS 패치, 설치한 애플리케이션과 접근 설정이 고객의 책임이다.[^shared]

## 선택 기준과 권고

- 호스트 제어가 필요한 이유를 적고, 컨테이너만 필요하다면 ECS/Fargate와 운영 부담을 비교한다.

- 이미지·설정·교체 절차를 함께 관리해 단일 서버의 수동 변경에 의존하지 않는다.

- 비용 비교에 볼륨·스냅샷·공인 주소·전송과 운영 시간을 포함한다.

## 설계 예시

API 서버가 두 대여도 한 대를 교체하는 동안 요구 처리량을 충족하는지 시험해야 한다. 서버 수만으로 복구를 증명하지 않는다.

## 운영 확인

- [ ] 인스턴스 교체 후 서비스와 데이터를 복원할 수 있는가?
- [ ] 패치 담당자·유지보수 창·애플리케이션 health check가 있는가?
- [ ] CPU 외 메모리·디스크·네트워크 병목도 관측하는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [Amazon ECS: Task와 Service의 오케스트레이션](aws-ecs.md)
- [AWS Fargate: ECS의 관리형 실행 용량](aws-fargate.md)
- [Security Group: 리소스 통신 허용 규칙](aws-security-group.md)
- [IAM Role: 신뢰 정책과 임시 세션 권한](../security/aws-iam-role.md)

[English](../../en/cloud/aws-ec2.md)

## 출처

[^ec2]: [What is Amazon EC2?](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)
[^shared]: [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
