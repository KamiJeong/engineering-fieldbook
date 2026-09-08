# Fieldbook knowledge change log

## 2026-09-08

- **Verification**: AWS 추가 후 전체 126개 Markdown의 Audit에서 문제 0건, 한·영 34개 pair의 SYNCED를 확인했다. 요청한 AWS 항목 23/23의 양쪽 문서·출처 대응·Index 연결을 확인했고 18개 회귀 테스트가 통과했다. 새 출처 51개 모두 HTTP 200으로 응답했으며 별도 문서로 잘못 redirect되지 않았다. 자동 Audit의 EXTERNAL_UNCHECKED 표시는 그대로 유지하며, 외부 접속과 기술 내용 대조는 별도 검증으로 기록한다.
- **Correction**: AWS 문서의 연속 각주 `[^a][^b]`를 링크 검사기가 일반 reference link로 오인했다. 잘못된 경고를 테스트로 재현한 뒤 각주를 참조 링크 패턴에서 제외했다. 일반 참조 링크의 누락 검출은 유지한다. 기존 실험 결과는 당시 기록으로 보존한다.
- **Creation**: 요청한 AWS 23개 Concept를 [Cloud 학습 경로](knowledge/ko/cloud/index.md)에 연결했다. Compute·Network·Storage는 Cloud, RDS는 [Data](knowledge/ko/data/index.md), IAM·KMS·Secrets Manager·WAF는 [Security](knowledge/ko/security/index.md)에 한 번씩 저장하고 한·영 pair를 작성했다. [AZ](glossary/ko/availability-zone.md)·[CIDR](glossary/ko/cidr.md)·[RPO](glossary/ko/rpo.md)·[RTO](glossary/ko/rto.md)를 별도 용어로 추가했다. 외부 사실과 조건부 권고·가상 설계 예시를 구분하며 AWS 실험이나 운영 경험으로 기록하지 않았다.
- **Verification**: AWS 공식 출처 51개의 관련 내용을 기준으로 새 문서의 기술적 주장과 한·영 의미를 Agent가 대조했다. Zonal/Regional NAT, RDS Multi-AZ instance/cluster, 일반 Lambda 함수의 범위, S3 버전 삭제, ECS의 secret 회전 반영 조건을 구분했다. 서비스 문서는 영향과 변화 속도에 따라 90·120·180일, 용어는 180·365일 후 재검토하도록 설정했다. 실제 AWS 리소스 배포·장애 전환·복구 시험은 수행하지 않았다.
- **Verification**: 첫 운영 점검에서 72개 Markdown, 7개 pair가 로컬 Audit을 통과했다. 미동기화·stale·Metadata/로컬 링크 발견 사항은 0건이었다. 17개 회귀 테스트와 기준 commit의 11개 실험 재현을 확인했다. 공식 OKF 고정 규격과 OIDC 출처의 접속·관련 정의를 별도로 확인했다. 검사기 수정 후 관련 Concept·내용 지문·Runbook 양쪽 언어를 재검토하고 본문·generated·번역 fingerprint를 유지한 채 검증 사건과 기한만 갱신했다. 번역 의미는 Agent가 대조했으며 human-reviewed를 기록하지 않았다.
- **Correction**: 첫 ADR pair를 연결하면서 번역 검사기의 `pair_path`가 list slice를 tuple과 비교해 ADR 경로의 언어 위치를 잘못 선택하는 결함을 발견했다. [회귀 테스트](skills/refresh-fieldbook/scripts/test_fieldbook.py)로 실패를 재현한 뒤 비교를 수정했다. 기존 실험의 원본 결과와 기준 commit은 당시 관측으로 보존한다.
- **Creation**: [ADR-0001](decisions/ADR/ko/ADR-0001-file-based-bilingual-knowledge.md)에 초기 선택과 대안을 기록하고, [Concept](knowledge/ko/testing/verification-vs-change-detection.md)·[실험](experiments/ko/2026-09-08-fieldbook-audit.md)·[Runbook](runbooks/ko/fieldbook-audit-failure.md)·[Checklist](checklists/ko/knowledge-maintenance.md)와 [내용 지문 용어](glossary/ko/content-fingerprint.md)를 한·영으로 연결했다. 후속 작업의 실제 적용 대상은 현재 로컬 Fieldbook이다.
- **Verification**: [원본 실험 결과](experiments/evidence/2026-09-08-fieldbook-audit/result.json)에서 11개 case가 기대 관측과 일치했고 검사 전후 fixture 파일이 보존됐다. 검증 Metadata만 변경하면 본문·generated와 번역 상태가 유지됐다. 의미가 틀린 영어도 해시를 재설정하면 SYNCED가 되는 한계를 확인했다.
- **Update**: [주간 점검](policies/maintenance.md)을 매주 화요일 수동 운영으로 시작한다. 다음 점검은 2026-09-15, 첫 월간 부담 검토는 2026-10-06이다. 장기 관측이 없어 기존 문서 TTL은 일괄 조정하지 않았다. 외부 자동 실행 예약은 설치하지 않았다.
- **Verification**: [OIDC pair](glossary/en/oidc.md)의 정의를 OpenID Connect Core 1.0 Introduction/ID Token과 대조하고 언어별 의미를 확인했다. Agent 검증이며 실제 Provider 운영 검증은 아니다. 번역 결과는 SYNCED다.
- **Verification**: [Metadata 계약](policies/metadata.md)을 고정한 OKF v0.2 규격과 대조했다. 초기 로컬 Audit과 유지보수 도구의 16개 회귀 테스트가 통과했다. 외부 접속·번역 의미 검토는 자동 검사와 구분한다.
- **Creation**: [초기 구조](policies/architecture.md)를 구축했다. 제품별 분류 대신 안정적인 지식 영역과 기록 목적을 분리했다.
- **Creation**: [OIDC](glossary/ko/oidc.md)와 [English pair](glossary/en/oidc.md)를 최소 예제로 작성해 출처·검증·번역 계약을 연결했다.
