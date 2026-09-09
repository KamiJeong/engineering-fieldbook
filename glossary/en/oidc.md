---
type: Glossary Term
title: OIDC (OpenID Connect)
description: An identity protocol that adds user authentication to OAuth 2.0.
concept_id: oidc
language: en
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
  reason: Limited to Core 1.0 terminology, excluding provider-specific behavior.
sources:
- id: oidc-core
  resource: https://openid.net/specs/openid-connect-core-1_0.html
  title: OpenID Connect Core 1.0 incorporating errata set 2
translation:
  source_language: ko
  source_concept_id: oidc
  source_fingerprint: sha256:958ba2fcc0d51b69a09498bf3cef6e4b90784983d14342491544ad2b96767c91
  target_fingerprint: sha256:bf388763402faff93af9ae3d9d407dabaebc61133f606ebf7725409bc91324d9
  synced_at: '2026-09-09T00:46:30+00:00'
  review_status: SYNCED
---

# OIDC (OpenID Connect)

## Term and aliases

OIDC stands for OpenID Connect. It is useful when learning how an application uses an external service’s login result to establish who a user is.

## External facts: definition

OpenID Connect 1.0 adds an authentication layer to OAuth 2.0. A client can establish user identity from authentication performed by an authorization server and receive information about the user. A claim is a named value carrying such information.[^oidc-core]

An ID Token contains claims about user authentication and is represented as a JSON Web Token (JWT).[^oidc-core]

## Understand through an example

Consider an application receiving a login result. Who issued the token (`iss`), which user it represents (`sub`), and which client it targets (`aud`) are different questions. The presence of fields alone does not complete validation; actual validation rules must be applied separately.[^oidc-core]

## Distinctions

Authentication establishes identity; authorization determines allowed actions. Do not use OIDC and OAuth 2.0 interchangeably or extend an ID Token explanation into a complete API authorization design.

## Scope and verification

The scope covers the Introduction and ID Token definitions and claims in Core 1.0. It does not test provider configuration, a token-validation implementation, or production behavior.

[Security](../../knowledge/en/security/index.md) · [한국어](../ko/oidc.md)

## Sources

[^oidc-core]: [OpenID Connect Core 1.0 incorporating errata set 2](https://openid.net/specs/openid-connect-core-1_0.html)
