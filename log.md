# Fieldbook knowledge change log

## 2026-09-08

- **Verification**: 첫 운영 점검에서 72개 Markdown, 7개 pair가 로컬 Audit을 통과했다. 미동기화·stale·Metadata/로컬 링크 발견 사항은 0건이었다. 17개 회귀 테스트와 기준 commit의 11개 실험 재현을 확인했다. 공식 OKF 고정 규격과 OIDC 출처의 접속·관련 정의를 별도로 확인했다. 검사기 수정 후 관련 Concept·내용 지문·Runbook 양쪽 언어를 재검토하고 본문·generated·번역 fingerprint를 유지한 채 검증 사건과 기한만 갱신했다. 번역 의미는 Agent가 대조했으며 human-reviewed를 기록하지 않았다.
- **Correction**: 첫 ADR pair를 연결하면서 번역 검사기의 `pair_path`가 list slice를 tuple과 비교해 ADR 경로의 언어 위치를 잘못 선택하는 결함을 발견했다. [회귀 테스트](skills/refresh-fieldbook/scripts/test_fieldbook.py)로 실패를 재현한 뒤 비교를 수정했다. 기존 실험의 원본 결과와 기준 commit은 당시 관측으로 보존한다.
- **Creation**: [ADR-0001](decisions/ADR/ko/ADR-0001-file-based-bilingual-knowledge.md)에 초기 선택과 대안을 기록하고, [Concept](knowledge/ko/testing/verification-vs-change-detection.md)·[실험](experiments/ko/2026-09-08-fieldbook-audit.md)·[Runbook](runbooks/ko/fieldbook-audit-failure.md)·[Checklist](checklists/ko/knowledge-maintenance.md)와 [내용 지문 용어](glossary/ko/content-fingerprint.md)를 한·영으로 연결했다. 후속 작업의 실제 적용 대상은 현재 로컬 Fieldbook이다.
- **Verification**: [원본 실험 결과](experiments/evidence/2026-09-08-fieldbook-audit/result.json)에서 11개 case가 기대 관측과 일치했고 검사 전후 fixture 파일이 보존됐다. 검증 Metadata만 변경하면 본문·generated와 번역 상태가 유지됐다. 의미가 틀린 영어도 해시를 재설정하면 SYNCED가 되는 한계를 확인했다.
- **Update**: [주간 점검](policies/maintenance.md)을 매주 화요일 수동 운영으로 시작한다. 다음 점검은 2026-09-15, 첫 월간 부담 검토는 2026-10-06이다. 장기 관측이 없어 기존 문서 TTL은 일괄 조정하지 않았다. 외부 자동 실행 예약은 설치하지 않았다.
- **Verification**: [OIDC pair](glossary/en/oidc.md)의 정의를 OpenID Connect Core 1.0 Introduction/ID Token과 대조하고 언어별 의미를 확인했다. Agent 검증이며 실제 Provider 운영 검증은 아니다. 번역 결과는 SYNCED다.
- **Verification**: [Metadata 계약](policies/metadata.md)을 고정한 OKF v0.2 규격과 대조했다. 초기 로컬 Audit과 유지보수 도구의 16개 회귀 테스트가 통과했다. 외부 접속·번역 의미 검토는 자동 검사와 구분한다.
- **Creation**: [초기 구조](policies/architecture.md)를 구축했다. 제품별 분류 대신 안정적인 지식 영역과 기록 목적을 분리했다.
- **Creation**: [OIDC](glossary/ko/oidc.md)와 [English pair](glossary/en/oidc.md)를 최소 예제로 작성해 출처·검증·번역 계약을 연결했다.
