---
type: Experiment
title: Fieldbook Audit 변경 감지와 복구 실험
description: 격리된 파일 변형으로 변경 감지·검증 분리·복구·읽기 전용 동작을 관찰했다.
concept_id: experiment-2026-09-08-fieldbook-audit
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
- id: result
  resource: ../evidence/2026-09-08-fieldbook-audit/result.json
  title: Original execution evidence
- id: reproducer
  resource: ../evidence/2026-09-08-fieldbook-audit/reproduce.py
  title: Reproducer
---

# Experiment: Fieldbook Audit 변경 감지와 복구

## Goal

현재 유지보수 도구를 실제로 실행하여 감지 범위와 한계를 확인한다. 소유자의 과거 업무 경험을 대신 서술하지 않는다. Agent가 이번 세션에서 수행한 로컬 실험이다.

## Hypothesis

검증 Metadata만 갱신하면 번역 상태는 유지되고, 독립적인 본문 변경·누락·잘못된 Metadata는 감지된다. 검사는 대상 파일을 변경하지 않는다. 해시 재설정만으로 의미 일치를 보장할 수 없다.

## Environment

- 실행: `2026-09-08T04:24:48+00:00`; Linux x86_64, Python 3.12.3, PyYAML 6.0.1.
- 저장소 기준: `8fa8472ebab16911dffaee8a5037bde84094ab3c`.
- 입력: 이 기준점의 OIDC 한·영 pair. 도구·재현 스크립트·입력 파일 SHA-256은 결과 JSON에 있다.
- 네트워크·Cloud 리전·실제 운영 서비스는 대상이 아니다.

## Method

[재현 스크립트](../evidence/2026-09-08-fieldbook-audit/reproduce.py)는 임시 디렉터리에 저장소를 복사하고 case마다 독립 사본을 만든다. `.git`, `.venv`, `__pycache__`, evidence는 복사하지 않는다. 대상 CLI 전후 파일 해시를 비교한다. 검증 Metadata/원문/번역/누락/YAML/링크/기한/잘못된 root를 각각 변형한다. 링크 복구는 해당 fixture의 원본 bytes를 복원한 후 다시 검사한다.

```bash
rtk proxy python3 experiments/evidence/2026-09-08-fieldbook-audit/reproduce.py
```

현재 checkout에서 실행하면 새 실행이며 과거 관측의 재현과 구분한다. 원 실행을 재현하려면 별도 checkout을 위 baseline commit에 맞추고 이 기록의 `reproduce.py`를 동일한 상대 경로에 복사한 후 실행한다. Python/PyYAML 버전과 JSON에 기록된 도구·입력 해시를 비교한다. 새 결과는 stdout 또는 별도 파일에 저장하고 기존 result.json을 덮어쓰지 않는다.

## Result

11개 case의 관측이 가설에 따른 기대 결과와 일치했다. exit 1/2는 주입한 오류의 기대 결과이며 실험 자체 실패가 아니다. 각 검사 전후 파일 해시는 모두 같았다.[^result]

| Case | 실제 exit | 기대한 관측 |
| --- | --- | --- |
| baseline | 0 | SYNCED |
| verification-only | 0 | SYNCED |
| korean-change | 1 | TRANSLATION_STALE |
| english-change | 1 | CONTENT_DIVERGED |
| missing-translation | 1 | MISSING_TRANSLATION |
| invalid-metadata | 1 | PARSE_ERROR |
| broken-link | 1 | BROKEN_LINK |
| stale-boundary | 1 | STALE |
| invalid-root | 2 | CLI input error |
| repair-local-link | 1 | BROKEN_LINK |
| hash-is-not-semantic-review | 0 | SYNCED |

`verification-only`에서 본문과 generated가 보존됐다. `repair-local-link`는 초기 BROKEN_LINK/exit 1에서 원본 복원 후 exit 0으로 돌아왔다. 의미가 무관한 영어에 해시를 재설정한 case는 SYNCED였다.

## Problems

실제 검증기는 기술 의미를 평가하지 않는다. 이번 결과에서 도구 장애나 테스트 assertion 실패는 없었다. 전체 Audit과 외부 자료 검증을 대신하는 실험도 아니다. 현재 checkout에 다른 문서가 추가되면 부분 검사에도 그 문서가 포함된다. evidence를 제외하므로 이후 문서의 evidence 링크는 추가 경고를 낼 수 있다. `passed`는 명시한 case 조건만 의미하며 모든 경고가 0이라는 뜻이 아니다.

## Lesson

해시 일치, 검증의 최신성, 의미 일치는 서로 다른 신호다. [변경 감지와 검증 Concept](../../knowledge/ko/testing/verification-vs-change-detection.md)와 [Audit 대응 Runbook](../../runbooks/ko/fieldbook-audit-failure.md)으로 연결한다.

## Next Experiment

실제 기술 문서를 갱신할 때 출처 변경 비교와 사람의 번역 검토 시간을 측정한다. 이번 실험에서는 수행하지 않았다.

[^result]: [원본 실행 결과](../evidence/2026-09-08-fieldbook-audit/result.json)

[English](../en/2026-09-08-fieldbook-audit.md)
