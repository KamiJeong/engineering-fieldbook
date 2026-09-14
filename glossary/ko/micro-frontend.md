---
type: Glossary Term
title: 'Micro Frontend: 업무 영역별 독립 프런트엔드'
description: 개발·검증·배포 경계를 업무 영역으로 나누는 프런트엔드 아키텍처 용어입니다.
concept_id: micro-frontend
language: ko
status: stable
generated:
  by: openai/gpt-6
  at: '2026-09-14T03:54:09+00:00'
freshness:
  mode: current
  volatility: medium
  review_days: 120
  reason: 합성 도구의 지원 범위와 공개 사례의 현재성을 재검토합니다.
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
---

# Micro Frontend

Micro Frontend(microfrontend, 마이크로 프런트엔드)는 하나의 사용자 경험을 업무 영역별 프런트엔드로 구성하고 각 영역을 독립적으로 개발·검증·배포할 수 있게 하는 방식입니다.[^vercel-docs]

예를 들어 주문과 청구 화면을 서로 다른 팀이 담당하고, 주문 변경을 청구 앱의 재빌드 없이 배포합니다. 같은 monorepo에서도 가능하며, 버튼을 React 컴포넌트로 분리하거나 저장소만 여러 개로 만드는 것과는 다릅니다. Module Federation은 이를 구현할 수 있는 모듈 합성 기술 중 하나입니다.[^webpack]

[개념과 실제 사례](../../knowledge/ko/frontend/micro-frontends.md) · [React 실습](../../knowledge/ko/frontend/micro-frontends-react.md) · [Glossary](index.md) · [English](../en/micro-frontend.md)

## 출처

[^vercel-docs]: [Vercel Microfrontends](https://vercel.com/docs/microfrontends)
[^webpack]: [webpack Module Federation and dynamic containers](https://webpack.js.org/concepts/module-federation/)
