---
type: Glossary Term
title: OIDC (OpenID Connect)
description: OAuth 2.0 위의 사용자 인증 계층을 설명하는 용어.
concept_id: oidc
language: ko
tags:
- identity
- authentication
status: stable
learning_state: backlog
generated:
  by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T03:00:05Z'
- by: codex/gpt-6
  at: '2026-09-09T00:46:30+00:00'
stale_after: '2027-09-09T00:46:30+00:00'
freshness:
  mode: current
  volatility: low
  review_days: 365
  reason: Core 1.0 용어 정의만 다루며 Provider 동작은 범위 밖.
sources:
- id: oidc-core
  resource: https://openid.net/specs/openid-connect-core-1_0.html
  title: OpenID Connect Core 1.0 incorporating errata set 2
---

# OIDC (OpenID Connect)

## 용어와 별칭

OIDC는 OpenID Connect의 약어입니다. 외부 서비스의 로그인 결과를 이용해 사용자가 누구인지 확인하는 흐름을 이해할 때 필요한 용어입니다.

## 외부 사실: 정의

OpenID Connect 1.0은 OAuth 2.0 위에 인증 계층을 제공합니다. 클라이언트는 인증 서버가 수행한 인증을 바탕으로 사용자의 신원을 확인하고 사용자에 대한 정보를 받을 수 있습니다. 이 정보를 전달하는 이름과 값의 항목을 클레임(claim)이라고 합니다.[^oidc-core]

ID Token은 사용자 인증에 대한 클레임을 담는 토큰이며 JSON Web Token(JWT) 형식으로 표현합니다.[^oidc-core]

## 예제로 이해하기

로그인 결과를 받는 애플리케이션을 가정합니다. 토큰을 누가 발급했는지(`iss`), 어떤 사용자를 나타내는지(`sub`), 어떤 클라이언트를 대상으로 하는지(`aud`)는 서로 다른 질문입니다. 필드가 있다는 사실만으로 검증을 마친 것은 아니며 실제 검증 규칙은 별도로 적용해야 합니다.[^oidc-core]

## 혼동 방지

인증은 누구인지 확인하는 문제이고, 인가는 어떤 작업을 허용할지 정하는 문제입니다. OIDC와 OAuth 2.0을 같은 용어로 사용하지 않습니다. ID Token 설명을 API 접근 권한 설계 전체로 확대하지 않습니다.

## 적용 범위와 검증

Core 1.0의 Introduction과 ID Token 정의·클레임이 범위입니다. 특정 제공자의 설정 절차나 토큰 검증 구현, 실제 운영 동작을 시험한 문서는 아닙니다.

[Security](../../knowledge/ko/security/index.md) · [English](../en/oidc.md)

## 출처

[^oidc-core]: [OpenID Connect Core 1.0 incorporating errata set 2](https://openid.net/specs/openid-connect-core-1_0.html)
