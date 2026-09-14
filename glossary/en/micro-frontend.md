---
type: Glossary Term
title: 'Micro Frontend: independently deployable business UI'
description: A frontend architecture with development, verification, and deployment
  boundaries around business areas.
concept_id: micro-frontend
language: en
status: stable
generated:
  by: openai/gpt-6
  at: '2026-09-14T03:54:09+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: Review composition-tool support and the time boundaries of public cases.
sources:
- id: vercel-docs
  resource: https://vercel.com/docs/microfrontends
  title: Vercel Microfrontends
- id: webpack
  resource: https://webpack.js.org/concepts/module-federation/
  title: webpack Module Federation and dynamic containers
verified:
- by: openai/gpt-6
  at: '2026-09-14T03:54:09+00:00'
stale_after: '2027-01-12T03:54:09+00:00'
translation:
  source_language: ko
  source_concept_id: micro-frontend
  source_fingerprint: sha256:0761f99459bb1d0fcbeef6ee25355f0f3cda2f3b6af92a3a4bd35f47d061b185
  target_fingerprint: sha256:58617dee26b765c88beb46a1a4e49cd41806d7d7e4287ddfbc504ce3a6729187
  synced_at: '2026-09-14T03:54:09+00:00'
  review_status: SYNCED
---

# Micro Frontend

A Micro Frontend (also microfrontend) composes one user experience from business-area frontends that can be developed, verified, and deployed independently.[^vercel-docs]

For example, orders and billing belong to different teams, and an orders change ships without rebuilding billing. This can work within one monorepo and differs from extracting a React button or merely creating multiple repositories. Module Federation is one module-composition technology that can support it.[^webpack]

[Concepts and cases](../../knowledge/en/frontend/micro-frontends.md) · [React lab](../../knowledge/en/frontend/micro-frontends-react.md) · [Glossary](index.md) · [한국어](../ko/micro-frontend.md)

## Sources

[^vercel-docs]: [Vercel Microfrontends](https://vercel.com/docs/microfrontends)
[^webpack]: [webpack Module Federation and dynamic containers](https://webpack.js.org/concepts/module-federation/)
