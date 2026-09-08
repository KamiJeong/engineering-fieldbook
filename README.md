---
type: Repository Guide
title: Engineering Fieldbook
---

# Engineering Fieldbook

개발자에서 Tech Lead / Engineering Lead로 성장하며 지식, 선택 근거, 실험, 실패와 운영 경험을 쌓는 개인 Engineering Knowledge System이다. Markdown으로 작성하고 Git으로 판단의 이력을 보존한다.

[전체 지도](index.md) · [한국어 지식](knowledge/ko/index.md) · [English knowledge](knowledge/en/index.md) · [용어집](glossary/index.md)

[AWS 학습 경로](knowledge/ko/cloud/index.md)에서 Compute·Network·Database·Storage·Security의 23개 Concept를 읽을 수 있다. 각 문서는 공식 근거, 선택 기준, 설계 예시와 운영 확인 항목을 제공한다. [English AWS path](knowledge/en/cloud/index.md)도 같은 개념을 다룬다.

## 구조와 문서 역할

| 위치 | 기록하는 것 |
| --- | --- |
| `knowledge/` · `glossary/` | 기술 개념과 용어 정의 |
| `decisions/ADR/` | 당시 제약 아래 무엇을 왜 선택했는지 |
| `experiments/` · `failures/` · `lessons/` | 수행한 검증, 발생한 실패, 그로부터 얻은 교훈 |
| `runbooks/` | 특정 운영 증상에 대한 진단·복구·중단 절차 |
| `checklists/` | 반복 작업의 누락 방지와 완료 기준 |

## 작성과 유지보수

한국어가 Source of Truth이고 영어는 같은 의미의 동기화 문서다. 언어별 디렉터리와 같은 `concept_id`로 연결한다. 공식 출처는 원문 언어를 유지한다. [번역 정책](policies/translation.md)을 참고한다.

지식 문서는 **OKF v0.2**의 Markdown/YAML, provenance, verification, freshness를 사용한다. 자체 확장과 도구 파일 경계는 [Metadata 계약](policies/metadata.md)에 명시한다.

Create → Verify → Stable → Age → Stale → Re-verify/Refresh로 관리한다. 오래되었다는 이유로 본문을 다시 쓰지 않는다. 내용이 맞으면 `generated`를 유지하고 검증 기록과 기한만 갱신한다.

1. [영역 지도](knowledge/index.md)와 Glossary에서 기존 개념을 찾는다.
2. [Template](templates/index.md)을 복사하고 한국어 원문·출처·적용 조건을 작성한다.
3. 영어 pair를 만들거나 누락을 Audit 결과로 남긴다. 의미를 검토하고 해당 Scope index에 연결한다.
4. 검증을 수행하고 의미 있는 변화의 이유만 [log](log.md)에 기록한다.

## Refresh 실행

Python 3.10+와 PyYAML이 필요하다. 필요한 환경에서 가상환경을 만들고 `python3 -m pip install -r requirements.txt`로 설치한다.

```bash
python3 skills/refresh-fieldbook/scripts/fieldbook.py audit
python3 skills/refresh-fieldbook/scripts/fieldbook.py translations
python3 skills/refresh-fieldbook/scripts/fieldbook.py stale --as-of 2026-09-08T00:00:00Z
```

Agent에게 `skills/refresh-fieldbook/SKILL.md를 읽고 glossary/ko/oidc.md를 Verify해줘`처럼 모드와 범위를 지정한다. Refresh는 실제 사실 차이만 반영한다. 자세한 절차는 [유지보수 정책](policies/maintenance.md), 구조 선택 이유는 [Architecture](policies/architecture.md)를 참고한다.

첫 실제 흐름은 [변경 감지와 검증 Concept](knowledge/ko/testing/verification-vs-change-detection.md) → [로컬 실험](experiments/ko/2026-09-08-fieldbook-audit.md) → [Checklist](checklists/ko/knowledge-maintenance.md) → [Audit 실패 Runbook](runbooks/ko/fieldbook-audit-failure.md) 순으로 읽는다. 매주 화요일 수동 점검부터 시작하며 다음 점검일은 2026-09-15다.
