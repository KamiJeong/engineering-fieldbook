---
type: Concept
title: 'IAM User: 장기 자격 증명의 예외적 사용'
description: IAM User와 root·Role을 구분하고 필요한 경우에만 장기 자격 증명을 관리한다.
concept_id: aws-iam-user
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
- id: iam-user
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html
  title: IAM users
- id: iam-practices
  resource: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
  title: Security best practices in IAM
---

# IAM User: 장기 자격 증명의 예외적 사용

## 요약

IAM User와 root·Role을 구분하고 필요한 경우에만 장기 자격 증명을 관리한다.

## 외부 사실

- IAM User는 AWS 계정 안의 identity이며 계정 root와 다르다. Administrator 권한이 있는 User도 root 자체는 아니다.[^iam-user]

- User는 password나 access key 같은 자격 증명을 가질 수 있다. 인증 수단과 어떤 작업을 허용하는지는 별도 문제다.[^iam-user]

- AWS는 사람에게 federation과 임시 자격 증명을, workload에는 Role을 우선 사용하도록 권고한다. IAM User는 이를 지원하지 않는 구체적인 예외에 검토한다.[^iam-practices]

## 선택 기준과 권고

- 예외 User마다 필요한 이유·소유자·용도·폐기 조건을 기록한다.

- Access key를 코드·이미지·문서에 넣지 않고 사용처와 교체 절차를 추적한다.

- Console 접근을 유지하는 계정의 MFA와 불필요한 자격 증명 제거를 확인한다.

## 설계 예시

장기 key만 지원하는 외부 도구라면 도구 전용 User를 검토한다. 사람의 관리자 key를 공유하지 않고 필요한 리소스·작업만 허용하는 별도 정책을 설계한다.

## 운영 확인

- [ ] Role이나 federation으로 대체할 수 없는 이유가 있는가?
- [ ] 사용 중인 key와 미사용 key를 구분할 수 있는가?
- [ ] 퇴사·서비스 종료 시 회수와 의존 서비스 확인 절차가 있는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [IAM Role: 신뢰 정책과 임시 세션 권한](aws-iam-role.md)
- [IAM Policy: 명시적 허용과 유효 권한 평가](aws-iam-policy.md)
- [OIDC](../../../glossary/ko/oidc.md)

[English](../../en/security/aws-iam-user.md)

## 출처

[^iam-user]: [IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)
[^iam-practices]: [Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
