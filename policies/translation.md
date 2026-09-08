---
type: Repository Policy
title: Bilingual synchronization
---

# Bilingual synchronization

한국어는 primary authoring language, 영어는 synchronized translation이다. 외부 근거는 공식 영어 원문이어도 그대로 사용한다. 영어에서 먼저 발견한 정정은 한국어에 먼저 반영하고 영어를 동기화한다. 별도의 영어 사실 체계를 만들지 않는다.

## Pair와 fingerprint

각 지식 단위는 동일 `concept_id`의 ko/en 문서 하나씩이다. 언어 부분만 다른 경로를 유지한다. 이동은 양쪽 동시 수행하고 ID는 유지한다. 정책·Index·Template·Agent 지침은 기술 Concept pair 의무에서 제외한다. 언어별 Index는 각 언어로 안내하지만 concept_id를 갖지 않는다.

영어의 Repository extension:

```yaml
translation:
  source_language: ko
  source_concept_id: oidc
  source_fingerprint: sha256:REPLACE
  target_fingerprint: sha256:REPLACE
  synced_at: 2026-09-08T00:00:00Z
  review_status: SYNCED
```

Fingerprint는 UTF-8 본문(개행은 LF로 정규화)과 metadata 중 type/title/description/concept_id/language/tags/resource/sources/status를 JSON 정규화한 SHA-256이다. `generated`, `verified`, `stale_after`, 개인 learning_state와 translation 자체는 제외한다. source 변화는 보수적으로 재검토한다. 입력 해시는 `fieldbook.py fingerprint <문서 경로>`로 얻는다. 이 명령은 파일을 쓰지 않는다.

`source_fingerprint`는 마지막 의미 대조 시 한국어, `target_fingerprint`는 그때 영어의 fingerprint다. 두 해시가 서로 같은지는 검사하지 않는다. 각자의 마지막 검토본과 비교한다. Verify-only metadata 변경은 해시에 영향을 주지 않는다.

## 상태 판정

| 결과 | 조건 / 조치 |
| --- | --- |
| MISSING_TRANSLATION | 한쪽 언어가 없음. 한국어 누락도 이 코드와 누락 언어로 보고 |
| TRANSLATION_STALE | 현재 한국어 fingerprint가 저장된 값과 다름 |
| CONTENT_DIVERGED | 영어 fingerprint만 독립 변경되었거나 양쪽 독립 변경. 의미 대조 필요 신호 |
| NEEDS_HUMAN_REVIEW | metadata 부족/경로 불일치/판단 보류 또는 의미 위험을 Agent가 표시 |
| SYNCED | 양쪽 fingerprint 유지 + review_status가 SYNCED |

CONTENT_DIVERGED는 기계적으로 의미 차이를 확정한 결과가 아니다. SYNCED도 과거의 검토 선언이 현재 파일에 적용됨만 확인한다. 해시를 채운 행위만으로 의미 일치가 입증되지는 않는다. 두 언어 동시 변경이면 CONTENT_DIVERGED로 우선 보고하고 원문 변경 사실도 메시지에 표시한다. 명시적인 NEEDS_HUMAN_REVIEW/CONTENT_DIVERGED는 해시가 같아도 자동 해제하지 않는다.

## 동기화 절차

1. 최신 한국어와 기존 영어를 주장·전제·제약·권고 강도·예외·증거별로 대조한다.
2. 영어를 자연스러운 기술 문장으로 작성한다. 한국어에 없는 비교 대상, 확정적 보장, 기술적 사실을 덧붙이지 않는다.
3. sources의 출처와 본문 각주 대응을 확인한다. 역사적 결과와 결정 맥락을 보존한다.
4. 의미가 맞는 경우에만 두 fingerprint, 실제 synced_at, review_status: SYNCED를 기록한다. 영어 의미 변경이면 generated도 갱신한다.
5. 모호한 용어, 권고 강도나 실험 해석이 달라질 위험은 review_status: NEEDS_HUMAN_REVIEW로 표시하고 무엇이 모호한지 본문 또는 log에 기록한다. fingerprint를 억지로 재설정해 경고를 없애지 않는다.
6. Scope index, glossary 링크, audit를 확인한다. 인간이 검토하기 전 human actor를 verified에 쓰지 않는다.

번역 검토와 기술 검증은 별개다. ko/en은 각각 자신의 verified와 freshness를 갖는다. 번역이 최신이어도 근거가 오래되었을 수 있다. 영어 지연을 허용하되 누락/오래됨을 숨기지 않는다.
