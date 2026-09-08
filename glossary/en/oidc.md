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
  at: '2026-09-08T03:00:05Z'
verified:
- by: codex/gpt-6
  at: '2026-09-08T03:00:05Z'
stale_after: '2027-09-08T03:00:05Z'
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
  source_fingerprint: sha256:e6a7d4c04dfad5bd2ea9a99037e1b0f5682b4b5c5b7749bf0fa93161890ba4c4
  target_fingerprint: sha256:f0ac4137c7f458f827ad16e3d639be509fa8e1addab827b946e56b36c6c5b569
  synced_at: '2026-09-08T03:00:05Z'
  review_status: SYNCED
---

# OIDC (OpenID Connect)

## Term and aliases

OIDC stands for OpenID Connect.

## External facts: definition

OpenID Connect 1.0 adds an authentication layer to OAuth 2.0. It lets a client establish an end user's identity based on authentication performed by an authorization server and receive claims about that user.[^oidc-core]

An ID Token is a JWT containing claims about the user's authentication.[^oidc-core]

## Distinctions

OIDC and OAuth 2.0 are distinct terms. This entry covers authentication and ID Tokens; it does not cover API authorization design or configuration for a particular provider.

## Scope and verification

Verification for this example covers the Introduction and ID Token definitions in Core 1.0. It does not test a service's token-validation implementation or production behavior. No personal experiment or architecture decision is recorded yet.

[Security](../../knowledge/en/security/index.md) · [한국어](../ko/oidc.md)

[^oidc-core]: [OpenID Connect Core 1.0, Introduction and ID Token](https://openid.net/specs/openid-connect-core-1_0.html)
