---
type: Repository Guide
title: Engineering Fieldbook
---

# Engineering Fieldbook

소프트웨어 개발과 운영의 기본 개념부터 설계 판단까지 단계적으로 학습하는 지식공유소입니다. 개념 설명과 적용 예제로 기초를 익히고, 실험 기록과 의사결정 사례에서 기술 선택의 근거와 한계를 살펴봅니다. 원본은 Markdown으로 관리하며 Git으로 변경 이력을 보존합니다.

[전체 지도](index.md) · [한국어 지식](knowledge/ko/index.md) · [English knowledge](knowledge/en/index.md) · [용어집](glossary/index.md)

[AWS 학습 경로](knowledge/ko/cloud/index.md)에서 컴퓨팅·네트워크·데이터베이스·스토리지·보안의 23개 개념을 읽을 수 있습니다. [English AWS path](knowledge/en/cloud/index.md)는 같은 학습 목표와 예제를 제공합니다.

## 학습 시작하기

| 단계 | 읽고 할 수 있는 일 | 문서에서 확인할 부분 |
| --- | --- | --- |
| 101 · 이해 | 개념과 필요성을 자기 말로 설명합니다. | 선수 지식, 용어 설명, 기본 동작 |
| 201 · 적용 | 주어진 상황의 계산이나 요청 흐름을 따라갑니다. | 가정, 예제, 결과 해석 |
| 301 · 판단 | 조건이 달라질 때 선택의 근거를 설명합니다. | 권고의 적용 조건, 운영 확인, 이해 확인 질문 |

번호는 한 개념을 읽는 단계입니다. AWS 실습 환경을 제공하거나 모든 분야의 강좌가 완성되었다는 뜻은 아닙니다. 예제는 설계 연습과 실제 실행 결과를 구분해 표시합니다.

처음에는 [CIDR](glossary/ko/cidr.md)과 [가용 영역](glossary/ko/availability-zone.md)에서 주소와 배치 단위를 익힌 뒤 [VPC](knowledge/ko/cloud/aws-vpc.md) → [서브넷](knowledge/ko/cloud/aws-subnets.md)으로 이어갑니다. 서버 실행이 먼저 궁금하다면 [EC2](knowledge/ko/cloud/aws-ec2.md)의 101 설명부터 읽습니다. 본문 끝의 질문에 답하고 해설과 비교하면 다음에 확인할 내용을 찾을 수 있습니다.

실험과 ADR은 당시 환경과 판단을 담은 사례 자료입니다. 현재 적용할 설명은 연결된 개념 문서와 출처를 함께 읽습니다. 상세 문서가 없는 분야는 각 목차에 준비 상태를 표시합니다.

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

문서 유지보수를 학습하려면 [변경 감지와 검증](knowledge/ko/testing/verification-vs-change-detection.md) → [로컬 실험](experiments/ko/2026-09-08-fieldbook-audit.md) → [체크리스트](checklists/ko/knowledge-maintenance.md) → [Audit 실패 대응](runbooks/ko/fieldbook-audit-failure.md) 순으로 읽습니다. 점검 일정과 실행 기록은 [유지보수 정책](policies/maintenance.md)과 [변경 이력](log.md)에서 확인합니다.
