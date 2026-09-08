---
type: Repository Policy
title: Knowledge maintenance
---

# Knowledge maintenance

## Create

1. `concept_id`, 제목, 별칭을 검색하여 기존 지식과 Glossary가 있는지 확인한다. 중요한 새 용어는 기존 항목으로 링크하거나 정의가 필요한 경우 독립 Glossary pair를 만든다. 무조건 모든 명사를 용어로 만들지 않는다.
2. 적절한 Template을 복사한다. `REPLACE` 값을 실제 ID·설명으로 바꾸고 작성 당시 `generated`를 기록한다. 기본은 `draft`이며 검증하지 않았다면 verified를 생략한다.
3. 새 문서 경로 기준으로 Template 링크를 고친다. 한국어를 먼저 쓰고 대응 영어 문서를 만든다. 양쪽 Index에 링크한다.
4. 사실·권고·개인 경험을 구분하고 증거 범위를 명시한다.

## Sources와 주장 종류

외부 사실의 근거 우선순위는 Official Specification → Official Documentation → Official Release Notes/Changelog → Official Repository → Standards Body → 신뢰 가능한 Secondary Source다. 해당 주장에 직접 적용되는 표준이 우선이며 검색 결과 자체를 출처로 쓰지 않는다.

| 내용 | 갱신 원칙 |
| --- | --- |
| External Fact | 현재 공식 자료와 비교하여 변경된 주장만 수정 |
| Engineering Recommendation | 판단 근거·대안·적용 조건을 별도로 검토 |
| Personal Experiment | 환경·버전·방법·원본 결과 유지, 새 실행은 새 기록 |
| Architecture Decision | 당시 Context/Decision 보존, 새 ADR로 supersede |
| Failure Experience | 당시 관찰 유지, 정정은 증거와 Correction으로 추가 |
| Personal Lesson | 경험 링크와 적용 한계 유지, 일반화 변경을 명시 |

충돌 시 사실의 범위·버전·환경을 먼저 비교한다. 공식 문서가 개인 측정 결과를 덮어쓰지 않는다. 해결되지 않으면 불확실성을 기록하고 stable 승격과 번역 확정을 보류한다. 출처 접속 실패는 거짓이라는 증거가 아니며 검증 시각을 갱신하지 않는다. 외부 링크 404, 인증/403, timeout은 구분한다.

## Freshness

| 변동성 | 시작 주기 | 기본값 | 예 |
| --- | --- | --- | --- |
| high | 30–90일 | 60일 | AI Model, Agent CLI, LLM SDK, Cloud Pricing, AI Framework |
| medium | 90–180일 | 120일 | AWS Managed Service, GitHub Actions, Security Tool, CI/CD |
| low | 180–365일 이상 | 365일 | HTTP, SQL Transaction, Git, Architecture 원칙 |

이는 주기 선택의 출발점이다. 각 문서 `freshness.review_days`와 `reason`으로 예외를 설명한다. Runbook은 실제 운영 환경/담당자/배포/의존성에 맞는 검증을 별도로 수행하고 기본 90일로 시작한다. 배포·권한·복구 경로 변경, upstream deprecation, 장애 발견은 TTL 전이라도 검증을 유발한다.

`stale_after = 가장 최근의 유효한 verified.at + review_days`. 유효한 검증은 generated.at 이상이어야 한다. 검증이 없거나 내용 변경보다 오래되면 UNVERIFIED로 보고한다. 달력상의 경과만으로 status를 바꾸거나 본문을 재작성하지 않는다. Historical 문서는 현재 기술 freshness와 분리하여 historical로 보고하고 TTL을 강제하지 않는다. 과거의 링크·번역·정정 가능성은 여전히 점검한다.

## Verify / Refresh

기존 Concept → 기존 sources → 현재 authoritative source → 주장별 비교표 → 변경 판단 순서로 수행한다.

- **변경 없음 (Verify)**: 본문 bytes와 generated를 유지한다. 실제 확인한 actor/time을 verified에 추가하고 stale_after만 재계산한다. Source가 그대로면 수정하지 않는다. 로그에 확인 범위·출처·결과를 기록한다. ko의 검증 metadata만 변경된 경우 영어 번역은 stale로 만들지 않는다. 영어 verified는 별도 확인 없이 복제하지 않는다.
- **사실 변경 (Refresh)**: 변경된 External Fact와 필요한 권고만 좁게 수정하고 sources와 generated를 갱신한다. 기존 verified는 과거 사건으로 보존하되 새 내용의 검증으로 간주하지 않는다. 새 검증 이후 freshness를 갱신하고 번역을 확인한다.
- **의미 불확실**: 추정으로 고치지 않고 검토 필요를 보고한다. 검증하지 않은 상태에서 기한만 연장하지 않는다.
- **Deprecation**: 공식 근거 확인 후 status를 deprecated로 두고 대체 문서 링크와 이유를 남긴다. 기한 만료만으로 deprecated로 만들지 않는다.

Stable 승격은 내용/근거 검토 후 명시적으로 한다. 내용이 맞더라도 자동 검사만으로 stable 또는 human-reviewed를 부여하지 않는다. ADR은 본문의 Status에서 proposed/accepted/superseded 등을 구분하고 OKF status와 혼동하지 않는다. 새 ADR이 기존 ADR을 supersede하면 기존 Context/Decision은 보존하고 Status와 후속 링크만 보완한다.

## Log와 Git

Git은 실제 diff·작성자·시점을 보존한다. log는 무엇이 왜 달라졌는지 기록한다. 기본 root log 한 곳을 사용하며 Scope별 기록이 읽기 어려워질 때 가까운 log로 분리한다. 같은 사건을 여러 log에 복제하지 않는다.

종류는 Creation, Update, Correction, Verification, Deprecation, Migration. 최신 날짜부터 `## YYYY-MM-DD` 아래 대상 링크, 이유, 증거/범위, 번역 결과를 짧게 적는다. Verification은 의미 검토 결과이므로 본문 diff가 없어도 기록한다. 오탈자·줄바꿈·무의미한 번역 문구 수정은 제외한다.

## 자동 검사의 범위

`fieldbook.py`는 읽기 전용이다. validate / stale / translations / links / audit를 제공한다. Exit 0은 검사 범위에서 이슈 없음, 1은 발견 사항 있음, 2는 실행 입력/환경 오류다. `--root`로 대상을, `--as-of`로 재현 가능한 UTC offset 포함 시각을 지정한다.

links는 Markdown inline/reference link와 로컬 sources/resource의 파일 존재를 확인한다. 외부 URL은 목록만 출력하며 연결 여부·anchor·GitHub heading slug·복잡한 HTML은 자동 증명하지 않는다. Audit에서는 Agent가 외부 링크와 release/deprecation 공지를 별도로 확인한다. JSON 출력을 원하면 `--json`을 쓴다. 스크립트의 정상 종료는 Audit의 외부 확인까지 완료했다는 의미가 아니다.

검사 도구 변경 시 `python3 -m unittest discover -s skills/refresh-fieldbook/scripts -p 'test_*.py'`로 회귀 검사를 실행한다. 테스트는 임시 디렉터리에서 번역 변경, 검증 기한, 잘못된 입력과 읽기 전용 동작을 확인한다.

## 정기 운영 시작: 2026-09-08

주간 점검은 매주 화요일에 저장소 소유자 또는 위임받은 Agent가 [유지보수 Checklist](../checklists/ko/knowledge-maintenance.md)를 사용하여 수동으로 실행한다. 첫 후속 점검일은 2026-09-15 (Asia/Seoul)이다. 이는 운영 계획이며 OS cron, CI, 알림이나 자동 실행 예약을 설치한 것은 아니다.

점검에서는 stale/미검증 문서, 미동기화 pair 수와 남은 검토 대상을 기록한다. 결과가 정상이라고 검증 날짜를 일괄 갱신하지 않는다. 외부 원문 확인과 번역 의미 검토는 별도로 수행한다. 코드의 exit 0만으로 Audit 전체를 완료 처리하지 않는다.

월간 검토의 첫 예정일은 2026-10-06이다. 실제 검토 시간·남은 번역 수·반복 경고를 근거로 작성 범위와 review_days를 조정한다. 아직 장기간 관측이 없으므로 이번에는 주기를 일괄 변경하지 않았다. 최초 로컬 Runbook과 Checklist는 90일, 검사 동작 Concept와 용어는 120일로 시작한다. 새 데이터가 생기면 문서별 reason과 변경 이유를 함께 갱신한다.
