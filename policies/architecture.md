---
type: Repository Policy
title: Knowledge Architecture
---

# Knowledge Architecture

## 조사 결과와 설계 기준

2026-09-08 기준 작업 디렉터리는 비어 있었고 `.git`도 없었다. 기존 문서의 이동·삭제·덮어쓰기는 필요하지 않았다. 미래의 기술 지식 목록을 미리 문서로 채우지 않는다.

한국어/영어 디렉터리는 GitHub 탐색과 언어별 읽기를 단순하게 한다. 두 언어는 같은 Scope와 slug를 사용한다. 별도 번역 레지스트리는 만들지 않고 파일 frontmatter로 식별한다.

## 저장 위치

| Scope | 책임과 경로 규칙 |
| --- | --- |
| knowledge | 현재 재사용할 개념·기술 설명: `knowledge/{ko,en}/domain/slug.md` |
| glossary | 용어의 짧은 정의와 혼동 방지: `glossary/{ko,en}/slug.md` |
| decisions | 선택 당시 맥락: `decisions/ADR/{ko,en}/ADR-0001-slug.md` |
| experiments | 직접 실행한 가설 검증: `experiments/{ko,en}/YYYY-MM-DD-slug.md` |
| failures | 장애·실패의 사실과 타임라인: `failures/{ko,en}/YYYY-MM-DD-slug.md` |
| lessons | 경험에서 도출한 적용 조건이 있는 교훈: `lessons/{ko,en}/slug.md` |
| checklists | 평상시 반복 작업의 확인 항목: `checklists/{ko,en}/slug.md` |
| runbooks | 특정 증상에서 실행할 진단·완화·복구: `runbooks/{ko,en}/slug.md` |

ADR 아래와 경험·운영 Scope의 `ko/en`은 첫 실제 문서를 작성할 때 Index와 함께 만든다. 빈 폴더·`.gitkeep`은 만들지 않는다. 용어 정의를 기술 문서에 복제하지 않고 Glossary로 링크한다. Glossary와 상세 Concept는 서로 다른 지식 단위이므로 ID도 다르다.

문서 유형을 Domain 아래 또 폴더로 나누지 않는다. 각 문서는 한 위치에만 두고 다른 Domain에서는 링크한다. AWS는 cloud의 제품 주제, GitHub는 delivery의 제품 주제다. Vector Database 구현·운영은 data, RAG 검색 설계·평가는 ai-engineering이 소유한다.

## 10개에서 1,000개로

ID는 저장소 전체에서 언어당 유일하며 이동해도 유지한다. 언어를 뺀 경로는 pair 사이에 같게 유지한다. 최초에는 flat domain을 사용한다. 한 Index가 탐색하기 어려워질 때 실제 문서 묶음을 기준으로 하위 Scope를 분리하고 양쪽 경로·링크를 함께 이동한다. 동일 문서를 두 분류에 복제하지 않는다.

Index는 범위·추천 읽기 순서·핵심 링크를 제공한다. 신규 문서는 가장 가까운 Index에 연결한다. 관련 ADR/실험/Runbook/Checklist가 생기면 실제 문서로 연결하고, 아직 없으면 Scope Index로 안내한다. 태그별 자동 목록은 지금 만들지 않는다.

## 구현 전 자기검토

1. 언어 분리: 요구한 동일 경로·ID 매칭을 지원하므로 채택. 정책과 Template은 공통으로 유지.
2. Scope 경계: 개념 / 용어 / 판단 / 관찰 / 절차를 분리하고 관계는 링크로 표현.
3. OKF 확장: `concept_id`, 번역, 개인 학습 상태를 별도로 정의. stale은 status에 추가하지 않음.
4. Log: 의미와 검증 근거만 기록. 사소한 편집·파일 diff는 Git 담당.
5. Freshness: 변화 속도별 주기와 이벤트 기반 확인 병행. 과거 기록은 TTL 강제 제외.
6. 번역: 내용 fingerprint와 한 개의 검토 상태만 사용. 해시가 의미 일치를 증명하지 않음.
7. Skill: 한 진입점과 읽기 전용 검사 파일 하나. 정책을 references에 복제하지 않음.
8. 최소화: OIDC 한 쌍, Domain Index, 8종 Template. 별도 앱·CI·검색 인프라는 보류.

## 의도한 한계

Index와 번역 유지에는 사람의 판단이 필요하다. 출처의 삭제·변경은 확인 기록으로 남긴다. 표준은 현재 채택한 버전에 고정하며 새 규격은 Migration 검토 후 도입한다. 전체 재작성을 예약 작업으로 실행하지 않는다.
