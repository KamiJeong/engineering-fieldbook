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
  at: '2026-09-08T03:00:05Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T03:00:05Z'
stale_after: '2027-09-08T03:00:05Z'
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

OIDC는 OpenID Connect의 약어다.

## 외부 사실: 정의

OpenID Connect 1.0은 OAuth 2.0 위에 인증 계층을 제공한다. 클라이언트는 인증 서버가 수행한 인증을 바탕으로 최종 사용자의 신원을 확인하고 사용자에 대한 Claims를 받을 수 있다.[^oidc-core]

ID Token은 사용자 인증에 대한 Claims를 담는 JWT다.[^oidc-core]

## 혼동 방지

OIDC와 OAuth 2.0은 같은 이름이 아니다. 여기서는 인증과 ID Token을 설명하며, API 접근 권한 설계나 특정 Provider의 설정 절차를 포괄하지 않는다.

## 적용 범위와 검증

이 예제의 확인 범위는 Core 1.0의 Introduction과 ID Token 정의다. 특정 서비스의 토큰 검증 구현이나 실제 운영 동작을 시험한 문서는 아니다. 개인 실험·Architecture Decision은 아직 없다.

[Security](../../knowledge/ko/security/index.md) · [English](../en/oidc.md)

[^oidc-core]: [OpenID Connect Core 1.0, Introduction and ID Token](https://openid.net/specs/openid-connect-core-1_0.html)
