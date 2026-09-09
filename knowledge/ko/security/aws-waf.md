---
type: Concept
title: 'AWS WAF: 웹 요청 검사와 오탐 제어'
description: 요청 관측과 차단을 구분하고, 새 규칙의 오탐을 확인할 기준을 설명합니다.
concept_id: aws-waf
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
- id: waf
  resource: https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html
  title: What is AWS WAF?
- id: waf-testing
  resource: https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html
  title: Testing and tuning your AWS WAF protections
---

# AWS WAF: 웹 요청 검사와 오탐 제어

## 요약

웹 애플리케이션에는 정상 사용자 요청과 차단할 요청이 함께 들어올 수 있습니다. AWS WAF는 지원되는 리소스의 HTTP·HTTPS 요청을 규칙으로 검사합니다. 공격 탐지뿐 아니라 정상 요청을 잘못 차단하는 오탐도 확인해야 합니다.[^waf][^waf-testing]

## 학습 목표

요청 관측과 차단을 구분하고, 새 규칙의 오탐을 확인할 기준을 설명합니다.

## 선수 지식

HTTP 요청이 웹 애플리케이션으로 전달되는 흐름을 알고 시작합니다. [보안 그룹](../cloud/aws-security-group.md)은 네트워크 통신 허용을 다루며 WAF의 웹 요청 검사와 구분합니다.

## 101 · 개념 이해

### 외부 사실

WAF는 HTTP/HTTPS 요청을 검사합니다. 지원 대상에는 CloudFront, ALB, API Gateway REST API 등이 있으며 모든 네트워크 자원에 동일하게 붙는 것은 아닙니다.[^waf]

Web ACL은 규칙과 기본 동작을 묶습니다. 현재 공식 문서에서는 protection pack (web ACL)이라는 명칭도 사용합니다. 요청을 Allow/Block하거나 Count로 관측하는 동작 등을 사용할 수 있습니다.[^waf]

AWS는 테스트 환경 검증과 실제 트래픽의 Count 관측을 거친 규칙 적용을 권고합니다.[^waf-testing]

## 201 · 예제에 적용하기

### 설계 예시

새 규칙을 적용하려는 상황입니다. 먼저 테스트 환경에서 확인하고, 실제 트래픽에서는 Count로 매칭되는 요청을 관측합니다. 로그인·업로드·Webhook 같은 정상 요청이 매칭되는지와 그 이유를 확인합니다.

결과를 검토한 뒤 제한적으로 Block을 적용하고 오류율과 문의량을 관측합니다. 되돌릴 규칙과 판단 기준도 미리 정합니다.

## 301 · 조건에 따라 판단하기

### 선택 기준과 권고

- 관리형 규칙도 정상 요청을 막을 수 있으므로 로그인·업로드·Webhook 등 핵심 요청별로 확인합니다.

- 보호 경로를 우회해 origin에 직접 접근할 수 있는지도 검토합니다.

- WAF를 애플리케이션 인증·인가·입력 검증·SG의 대체물로 사용하지 않습니다.

### 운영 확인

- [ ] Web ACL이 의도한 리소스·scope에 연결돼 있나요?
- [ ] 규칙별 차단·Count·정상 트래픽 영향을 관측하나요?
- [ ] 긴급 오탐 대응 시 되돌릴 규칙과 판단 지표가 있나요?

## 이해 확인

**질문:** 관리형 규칙이면 정상 요청 검증을 생략해도 될까요?

**해설:** 애플리케이션의 정상 요청이 규칙에 걸릴 수 있습니다. 관리형 규칙도 테스트와 Count 관측을 거쳐 적용합니다.[^waf-testing]

## 근거와 한계

예제는 개념 설명과 설계 연습이며 AWS에서 실행한 결과가 아닙니다. 권고를 적용할 때는 대상 리전·엔진·실행 모드의 지원 범위, 할당량과 가격을 확인합니다. 출처 대조 범위와 번역 검토는 [문서 변경 이력](../../../log.md)에 기록합니다.

## 관련 지식

- [Security Group: 리소스 통신 허용 규칙](../cloud/aws-security-group.md)
- [IAM Policy: 명시적 허용과 유효 권한 평가](aws-iam-policy.md)
- [Internet Gateway: VPC 인터넷 연결의 경로 대상](../cloud/aws-internet-gateway.md)

[English](../../en/security/aws-waf.md)

## 출처

[^waf]: [What is AWS WAF?](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html)
[^waf-testing]: [Testing and tuning your AWS WAF protections](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html)
