---
type: Concept
title: 'AWS WAF: 웹 요청 검사와 오탐 제어'
description: 보호 대상에 들어오는 HTTP 요청을 규칙으로 검사하고 단계적으로 적용한다.
concept_id: aws-waf
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
- id: waf
  resource: https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html
  title: What is AWS WAF?
- id: waf-testing
  resource: https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html
  title: Testing and tuning your AWS WAF protections
---

# AWS WAF: 웹 요청 검사와 오탐 제어

## 요약

보호 대상에 들어오는 HTTP 요청을 규칙으로 검사하고 단계적으로 적용한다.

## 외부 사실

- WAF는 HTTP/HTTPS 요청을 검사한다. 지원 대상에는 CloudFront, ALB, API Gateway REST API 등이 있으며 모든 네트워크 자원에 동일하게 붙는 것은 아니다.[^waf]

- Web ACL은 규칙과 기본 동작을 묶는다. 요청을 Allow/Block하거나 Count로 관측하는 동작 등을 사용할 수 있다.[^waf]

- AWS는 테스트 환경 검증과 실제 트래픽의 Count 관측을 거친 규칙 적용을 권고한다.[^waf-testing]

## 선택 기준과 권고

- 관리형 규칙도 정상 요청을 막을 수 있으므로 로그인·업로드·Webhook 등 핵심 요청별로 확인한다.

- 보호 경로를 우회해 origin에 직접 접근할 수 있는지도 검토한다.

- WAF를 애플리케이션 인증·인가·입력 검증·SG의 대체물로 사용하지 않는다.

## 설계 예시

새 공격 규칙을 먼저 Count로 관측한 뒤 정상 요청과 매칭 이유를 검토한다. 확인 후 제한적으로 Block을 적용하고 오류율·문의량을 함께 본다.

## 운영 확인

- [ ] Web ACL이 의도한 리소스·scope에 연결돼 있는가?
- [ ] 규칙별 차단·Count·정상 트래픽 영향을 관측하는가?
- [ ] 긴급 오탐 대응 시 되돌릴 규칙과 판단 지표가 있는가?

## 근거와 한계

2026-09-08에 아래 공식 출처와 기술적 주장을 Agent가 대조했다. 권고는 적용 조건을 따져야 하는 설계 판단이며, 예시는 AWS 실행·개인 실험 결과가 아니다. 실제 적용 전 대상 리전·엔진·실행 모드의 지원 범위와 필요한 할당량·가격을 다시 확인한다.

## 관련 지식

- [Security Group: 리소스 통신 허용 규칙](../cloud/aws-security-group.md)
- [IAM Policy: 명시적 허용과 유효 권한 평가](aws-iam-policy.md)
- [Internet Gateway: VPC 인터넷 연결의 경로 대상](../cloud/aws-internet-gateway.md)

[English](../../en/security/aws-waf.md)

## 출처

[^waf]: [What is AWS WAF?](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html)
[^waf-testing]: [Testing and tuning your AWS WAF protections](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html)
