---
type: Repository Policy
title: OKF and repository metadata
---

# Metadata contract

## 기준과 검사 경계

채택 규격은 [Google Open Knowledge Format v0.2](https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/ad30107c31c06aec8a7d5636e0d1058118604e6f/SPEC.md)이다. 2026-09-08에 확인했으며 upstream commit `ad30107c31c06aec8a7d5636e0d1058118604e6f`에 고정한다. 버전 변경은 Migration으로 기록한다.

저장소는 지식 payload와 유지보수 도구가 공존하는 workspace다. OKF payload는 root `index.md`·`log.md`·`README.md`·`AGENTS.md`, `knowledge/`, `glossary/`, `decisions/`, `experiments/`, `failures/`, `lessons/`, `checklists/`, `runbooks/`, `policies/`, `templates/`의 Markdown이다. `skills/`는 Skill 자체 형식으로 관리한다. 이는 저장소 경계 규칙이며 OKF 표준의 파일 제외 기능이 아니다. 전체 저장소를 그대로 순수 OKF bundle이라고 주장하지 않는다. 외부 OKF 소비자에 전달할 때는 지식 payload를 선택하고 도구 링크를 처리해야 한다.

## 표준 필드와 파일

- 일반 문서는 YAML frontmatter의 비어 있지 않은 문자열 `type`을 가진다. 종류 값은 생산자가 선택한다.
- `title`, `description`, `tags`, `resource`, `sources`는 표준 필드다. `sources`의 각 항목은 `resource`가 필요하며 `id`를 본문 각주와 연결한다.
- `generated: {by, at}`는 현재 내용의 마지막 의미 변경, `verified`는 `{by, at}` 검증 사건 목록이다. 단일 mapping도 허용한다. 시간은 UTC offset을 포함한 ISO 8601 datetime이다.
- `status`: `draft | stable | deprecated`. `stale_after`는 절대 시각이며 `now >= stale_after`일 때 stale이다. `status: stale`을 쓰지 않는다.
- `index.md`는 안내와 링크, `log.md`는 최신 날짜부터 `## YYYY-MM-DD` 사건 목록이다. 둘은 Concept 문서가 아니며 frontmatter를 넣지 않는다. 예외는 root index의 `okf_version: "0.2"`다.
- OKF Concept ID는 `.md`를 뺀 bundle 상대 경로다. 이 저장소의 bilingual `concept_id`와 다르다.

선택 필드가 없는 문서, 알 수 없는 확장·type, 깨진 링크를 OKF 자체 위반으로 과장하지 않는다. 필수 `type`과 YAML frontmatter 누락은 별도로 검사한다. `fieldbook.py validate`는 이 저장소에서 채택한 기본 구조/사용 필드를 검사하며 전체 OKF 인증기나 attested computation 검증기가 아니다. `audit`은 별도로 더 엄격한 저장소 운영 정책을 검사한다.

## 저장소 확장 (OKF 표준 아님)

| 필드 | 계약 |
| --- | --- |
| `concept_id` | 지식 문서의 영구적인 kebab-case ID. ko/en은 동일 ID. 한 언어에서 중복 금지 |
| `language` | `ko` 또는 `en`; 경로와 일치 |
| `learning_state` | 선택: backlog, learning, experimenting, applied, mastered. status와 독립 |
| `freshness` | `mode: current | historical`; current이면 `review_days` 양의 정수, `volatility: high | medium | low`, `reason` |
| `translation` | 영어에만 필수. 세부 계약은 [번역 정책](translation.md) |

지식 문서에는 `type`, `title`, `description`, `concept_id`, `language`, `status`, `generated`, `freshness`를 요구한다. 이는 저장소 요구다. 일반 운영 문서와 Template은 bilingual/freshness 대상이 아니다. Stable current 문서는 실제 검증 사건과 검증 시각에 review_days를 더한 stale_after를 가진다. 초안에는 검증 사건을 꾸며 넣지 않는다.

종류: Concept, Glossary Term, Decision, Experiment, Failure, Lesson, Checklist, Runbook. historical은 Decision/Experiment/Failure의 기본이고 Lesson은 현재 적용 가능한 권고라면 current다. Historical에도 새 외부 사실을 추가하면 그 주장의 검증 범위를 명시한다.

`generated.by`, `verified[].by`는 사람은 `human:<id>`, Agent는 `<producer>/<version>`, 자동 과정은 `process:<id>`를 사용한다. 자동 점검을 human-reviewed로 기록하지 않는다. 검증 도구의 통과는 기술 내용에 대한 verified를 만들 근거가 아니다. 알 수 없는 기존 확장 필드는 편집 시 보존한다.

## 출처 예시

```yaml
sources:
  - id: official-spec
    resource: https://openid.net/specs/openid-connect-core-1_0.html
    title: OpenID Connect Core 1.0
```

본문의 `[^official-spec]`에 같은 ID를 사용한다. Source는 도달 가능한 URL 또는 문서 상대 경로를 권장한다. OKF가 허용하는 scope descriptor는 자동 링크 확인 대상으로 해석하지 않는다. 원문 변경 시각을 모르면 `last_modified`를 생략하고 조회 시각으로 대체하지 않는다.
