---
type: Decision
title: 'ADR-0001: 파일 기반 bilingual 지식 구조'
description: 개인 Fieldbook의 초기 저장·탐색·번역·유지보수 구조를 선택한 기록.
concept_id: adr-0001-file-based-bilingual-knowledge
language: ko
status: stable
generated:
  by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
verified:
- by: codex/gpt-6
  at: '2026-09-08T04:30:37+00:00'
freshness:
  mode: historical
sources:
- id: architecture
  resource: ../../../policies/architecture.md
  title: Initial architecture
- id: metadata
  resource: ../../../policies/metadata.md
  title: Metadata contract
---

# ADR-0001: 파일 기반 bilingual 지식 구조

## Status

Accepted — 2026-09-08. 소유자의 초기 구축 및 후속 작업 진행 요청에 따라 적용한 결정을 Agent가 기록한다. 인간의 별도 문서 검증을 주장하지 않는다.

## Context

장기간 사용할 개인 Engineering Knowledge System이 필요하다. 한국어가 기본 작성 언어이며 영어도 같은 지식을 제공해야 한다. 지식·실험·과거 판단·운영 절차를 구분하고 Agent가 필요한 문서부터 읽을 수 있어야 한다. 초기에는 웹 앱이나 검색 서버를 도입하지 않는다는 제약이 있다.[^architecture]

초기 구현 기준점은 Git commit `8fa8472ebab16911dffaee8a5037bde84094ab3c`이다.

## Decision

1. Markdown + Git으로 시작하고 지식 payload에 OKF v0.2를 적용한다. Skill 도구 영역과 표준의 경계는 Metadata 정책에 명시한다.[^metadata]
2. 지식은 제품명이 아닌 안정적인 Domain에 배치한다. 기록 목적이 다른 ADR·실험·실패·교훈·Checklist·Runbook·Glossary는 별도 Scope로 둔다.
3. 한국어가 원문이고 영어는 같은 ID 및 대응 경로의 번역이다. 경로 기반 OKF ID와 저장소 `concept_id`는 구분한다.
4. Index로 단계적으로 탐색하고, 자동 검사는 후보를 찾는 역할만 맡는다. 실제 검증과 갱신은 증거에 근거한다.
5. 과거 기록을 보존하고, 현재 문서는 변경 속도에 맞춰 검증한다. 최초에는 도구 하나와 공통 정책을 유지한다.

## Alternatives

| 대안 | 채택하지 않은 이유 |
| --- | --- |
| 한 파일에 두 언어 | 작은 문서는 편하지만 길어질수록 언어별 읽기와 변경 검토가 어려워질 수 있음 |
| 제품별 최상위 폴더 | 제품 교체와 도메인 간 중복에 따른 재분류 부담 |
| 유형별 모든 기술 복제 | 같은 개념의 소유 위치와 원문이 여러 개 생김 |
| 웹 앱·DB·자동 번역 서비스 우선 | 초기 지식 양에 비해 운영할 구성 요소가 늘어남 |

이 비교는 이 저장소 제약에 따른 판단이며 보편적인 우열 주장이 아니다.

## Consequences

GitHub와 텍스트 도구로 읽을 수 있는 구조를 얻는다. 대신 Index, 링크와 영어 pair를 지속적으로 관리해야 한다. 해시 기반 감지는 의미 검토를 대신하지 않는다. 정책과 도구가 공존하므로 외부 순수 OKF 배포에는 payload 선택이 필요하다.

검색이나 번역 유지 비용이 실제 문제로 확인되면 측정 근거와 함께 새 ADR을 작성한다. 기존 Context/Decision은 보존하고 후속 ADR에서 supersede한다.

## References

[^architecture]: [초기 Architecture와 자기검토](../../../policies/architecture.md)
[^metadata]: [OKF와 저장소 확장 계약](../../../policies/metadata.md)

[English](../en/ADR-0001-file-based-bilingual-knowledge.md)
