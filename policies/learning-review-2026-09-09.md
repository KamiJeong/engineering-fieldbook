---
type: Repository Review
title: 학습 문체·영어 번역·기술 출처 검토 — 2026-09-09
---

# 학습 문체·영어 번역·기술 출처 검토

검토자: `codex/gpt-6`. 내용·번역 대조 기록 시각: `2026-09-09T00:46:30+00:00`. 사람의 의미 검토나 AWS 운영 실험을 수행했다는 기록이 아닙니다.

## 범위와 방법

기존 개념 24쌍(한국어 24개·영어 24개), 용어 6쌍을 학습자 중심으로 편집했습니다. 원본 경로·concept_id·분류·출처·과거 검증 사건은 보존합니다. 101 이해 → 201 가정 예제 적용 → 301 조건별 판단을 본문에 제공하고, 선수 지식·학습 목표·질문 해설을 두 언어에 반영합니다. 새 난이도 필드나 강좌별 복제본은 만들지 않았습니다.

기존 영어 49개 파일(지식 단위 34개와 언어별 목차 15개) 및 `site/README.en.md`를 대응 한국어와 읽고 비교했습니다. 주장·전제·조건·권고 강도·예제 수치·예외·출처·링크 대상을 확인한 뒤 지식 단위 34쌍의 번역 지문을 기록했습니다. 해시 갱신이나 자동 Audit을 의미 검토 근거로 사용하지 않았습니다.

아래 지식 출처 55개 URL의 해당 정의와 제약을 대조했습니다. 기존 52개 출처는 HTTP 200과 관련 본문을 확인했고, 추가한 CIDR 표준·AZ ID·Lambda VPC 직접 근거도 열어 확인했습니다. 페이지 전체의 모든 주장이나 제품의 전체 기능 목록을 검증했다는 뜻은 아닙니다. 공식 내용의 적용 범위와 일치하는 기존 주장은 유지하고 설명·가정·직접 출처를 보완했습니다.

현재 문서 31쌍(개념 24·용어 6·체크리스트 1)에 대해 각 언어의 내용을 근거와 대조하고 검증 사건 및 기존 review_days에 따른 기한을 기록했습니다. Runbook의 과거 운영 검증은 재실행하지 않아 verified와 기한을 연장하지 않았습니다. 과거 ADR/실험은 현재 사실의 기한 갱신 대상이 아닙니다.

## 지식 단위별 의미·기술 대조

각 행은 한·영 전체 본문을 검토한 범위와 판단입니다. 출처 번호는 아래 URL 목록에 대응합니다. 로컬 구현을 근거로 하는 항목은 해당 문서의 sources 및 원본 증거를 확인했습니다.

| 개념 | 한국어 / 영어 | 확인 범위와 결과 | 외부 근거 |
| --- | --- | --- | --- |
| knowledge-maintenance | [한국어](../checklists/ko/knowledge-maintenance.md) / [English](../checklists/en/knowledge-maintenance.md) | 작성/검증/번역/역사 보존 절차를 현재 정책과 대조. 특정 실행을 지칭하던 표현을 날짜 있는 기록으로 변경하고 학습 설명 검토 항목 동기화. | 로컬 구현·정책·원본 기록 |
| adr-0001-file-based-bilingual-knowledge | [한국어](../decisions/ADR/ko/ADR-0001-file-based-bilingual-knowledge.md) / [English](../decisions/ADR/en/ADR-0001-file-based-bilingual-knowledge.md) | 초기 Context/Decision/대안/결과 전수 대조. 개인 시스템·웹 앱 제외는 당시 제약으로 보존. 과거 결정을 현재 교육 목표로 재작성하지 않음. | 로컬 구현·정책·원본 기록 |
| experiment-2026-09-08-fieldbook-audit | [한국어](../experiments/ko/2026-09-08-fieldbook-audit.md) / [English](../experiments/en/2026-09-08-fieldbook-audit.md) | 환경·11개 결과·한계·후속 계획 전수 대조. 영어 Next Experiment에 빠진 사람의 번역 검토 시간 조건만 정정; 한국어와 원본 JSON 보존. | 로컬 구현·정책·원본 기록 |
| availability-zone | [한국어](../glossary/ko/availability-zone.md) / [English](../glossary/en/availability-zone.md) | AZ ID의 계정 간 일관성, AZ 이름 매핑의 일부 기존 리전/계정 조건 보강. 단순 다중 배치와 복구 보장 구분. | [S27](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html), [S28](https://docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html) |
| cidr | [한국어](../glossary/ko/cidr.md) / [English](../glossary/en/cidr.md) | RFC 4632 §3.1 접두사·32비트·/24 계산. 주소 개수와 실제 서비스 할당 가능 개수 구분, /16 안 /24 포함 관계 동일. | [S47](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html), [S55](https://www.rfc-editor.org/rfc/rfc4632.html) |
| content-fingerprint | [한국어](../glossary/ko/content-fingerprint.md) / [English](../glossary/en/content-fingerprint.md) | 실제 parse/fingerprint 입력 필드·LF 정규화·SHA-256·metadata 제외를 코드와 정책에 대조. 의미/서명 증명과 구분. | 로컬 구현·정책·원본 기록 |
| oidc | [한국어](../glossary/ko/oidc.md) / [English](../glossary/en/oidc.md) | Core 1.0 Introduction·ID Token/iss/sub/aud 정의. 실제 토큰 검증 구현의 테스트로 확대하지 않음. | [S54](https://openid.net/specs/openid-connect-core-1_0.html) |
| rpo | [한국어](../glossary/ko/rpo.md) / [English](../glossary/en/rpo.md) | 허용 데이터 손실의 시간 간격. 한국어 13:45 이후를 13:45 또는 그 이후로 명확히 하여 영어의 포함 경계와 맞춤. | [S53](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html) |
| rto | [한국어](../glossary/ko/rto.md) / [English](../glossary/en/rto.md) | 서비스 중단부터 복구까지 최대 허용 시간. 14:00/60분/15:00과 서비스 완료 기준 동일. | [S53](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html) |
| aws-ec2 | [한국어](../knowledge/ko/cloud/aws-ec2.md) / [English](../knowledge/en/cloud/aws-ec2.md) | 가상 서버·AMI·자원 구성·저장 종류·사용자 OS 책임. 서버 수를 복구 보장으로 해석하지 않는 조건 유지. | [S02](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html), [S01](https://aws.amazon.com/compliance/shared-responsibility-model/) |
| aws-ecs | [한국어](../knowledge/ko/cloud/aws-ecs.md) / [English](../knowledge/en/cloud/aws-ecs.md) | 실행 명세/Task/Service와 실행 용량, 애플리케이션·실행 역할 분리. 두 Task 예제는 부하 검증 전의 가정. | [S05](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html), [S09](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html) |
| aws-fargate | [한국어](../knowledge/ko/cloud/aws-fargate.md) / [English](../knowledge/en/cloud/aws-fargate.md) | ECS 범위, awsvpc/ENI와 이미지·로그·비밀 접근. 시작 실패의 경로/권한 진단을 양쪽에 동일하게 설명. | [S04](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html), [S07](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html), [S06](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html) |
| aws-internet-gateway | [한국어](../knowledge/ko/cloud/aws-internet-gateway.md) / [English](../knowledge/en/cloud/aws-internet-gateway.md) | VPC 연결·IGW 경로·공인 주소·허용 조건 구분. 게이트웨이 연결만으로 공개되지 않는 조건 유지. | [S41](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html), [S42](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html) |
| aws-lambda | [한국어](../knowledge/ko/cloud/aws-lambda.md) / [English](../knowledge/en/cloud/aws-lambda.md) | 일반 호출 900초·환경 상태·VPC 제약. MicroVMs/Managed Instances/장기 워크플로와 구분; VPC 제약의 직접 출처 보강. | [S37](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html), [S36](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html), [S34](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc-internet.html), [S33](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html), [S26](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/fargate-or-lambda.html), [S35](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html) |
| aws-nat-gateway | [한국어](../knowledge/ko/cloud/aws-nat-gateway.md) / [English](../knowledge/en/cloud/aws-nat-gateway.md) | Public/Private 연결 유형과 Zonal/Regional 가용성 구분. Automatic/Manual 책임과 Private NAT 미지원 확인. | [S48](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html), [S44](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html) |
| aws-route-table | [한국어](../knowledge/ko/cloud/aws-route-table.md) / [English](../knowledge/en/cloud/aws-route-table.md) | 목적지/target/main table·최장 접두사·IPv4/IPv6 독립 평가. /16과 /0의 계산 동일. | [S40](https://docs.aws.amazon.com/vpc/latest/userguide/RouteTables.html), [S45](https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html) |
| aws-s3-lifecycle | [한국어](../knowledge/ko/cloud/aws-s3-lifecycle.md) / [English](../knowledge/en/cloud/aws-s3-lifecycle.md) | 기존 객체 포함·전환/만료·noncurrent 구분·버킷 정책으로 Lifecycle 차단 불가. 보존 목표에 따른 권고 유지. | [S20](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html), [S19](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html) |
| aws-s3-versioning | [한국어](../knowledge/ko/cloud/aws-s3-versioning.md) / [English](../knowledge/en/cloud/aws-s3-versioning.md) | 새 버전/삭제 표시/버전 지정 영구 삭제·suspend·전체 버전 과금. 과거 버전 복원 가정 동일. | [S17](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html), [S16](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html) |
| aws-s3 | [한국어](../knowledge/ko/cloud/aws-s3.md) / [English](../knowledge/en/cloud/aws-s3.md) | 일반 목적 버킷 범위·객체/key·단일 객체 일관성과 여러 객체 트랜잭션 구분. 공개 접근 제한 확인. | [S18](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) |
| aws-security-group | [한국어](../knowledge/ko/cloud/aws-security-group.md) / [English](../knowledge/en/cloud/aws-security-group.md) | Allow 합집합·연결 추적·기존 연결 규칙 변경 조건. DB 포트 예제는 라우팅/DB 로그인 부여가 아님. | [S49](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html), [S46](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html), [S03](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-connection-tracking.html) |
| aws-subnets | [한국어](../knowledge/ko/cloud/aws-subnets.md) / [English](../knowledge/en/cloud/aws-subnets.md) | IGW 직접 경로로 구분. IPv4/Zonal NAT 가정과 생략한 SG/NACL/AZ 이중화 범위 및 Mermaid 동일. | [S42](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html), [S41](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html), [S48](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) |
| aws-vpc | [한국어](../knowledge/ko/cloud/aws-vpc.md) / [English](../knowledge/en/cloud/aws-vpc.md) | 리전/AZ/서브넷 관계·CIDR·주소 중복. 주소 계획과 접근 허용을 구분하는 예제 유지. | [S43](https://docs.aws.amazon.com/vpc/latest/userguide/configure-your-vpc.html), [S50](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-subnet-basics.html), [S42](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html), [S47](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html) |
| aws-rds-backup | [한국어](../knowledge/ko/data/aws-rds-backup.md) / [English](../knowledge/en/data/aws-rds-backup.md) | 자동/수동 백업 보존 차이·PITR 새 인스턴스·LatestRestorableTime·복원 설정. 14:00 후 정상 데이터 보존 문제 동일. | [S13](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html), [S12](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) |
| aws-rds-connection-pooling | [한국어](../knowledge/ko/data/aws-rds-connection-pooling.md) / [English](../knowledge/en/data/aws-rds-connection-pooling.md) | 안전한 트랜잭션별 재사용·pinning·중단 처리. 250/450 계산을 직접 DB 연결 가정으로 명시하여 Proxy 실제 연결 수와 구분. | [S15](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.howitworks.html) |
| aws-rds-multi-az | [한국어](../knowledge/ko/data/aws-rds-multi-az.md) / [English](../knowledge/en/data/aws-rds-multi-az.md) | 단일 동기 standby는 읽기 미지원, cluster는 세 AZ의 writer+두 reader·반동기. Aurora/리전·엔진 지원 범위 구분. | [S11](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html), [S14](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html) |
| aws-rds-postgresql | [한국어](../knowledge/ko/data/aws-rds-postgresql.md) / [English](../knowledge/en/data/aws-rds-postgresql.md) | 지원 기능·호스트 접근 제한·Multi-AZ 유형 차이. 관리형 DB와 쿼리/연결 관리의 책임 구분. | [S10](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html), [S11](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html), [S14](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html) |
| aws-iam-policy | [한국어](../knowledge/ko/security/aws-iam-policy.md) / [English](../knowledge/en/security/aws-iam-policy.md) | JSON 요소·명시적 Deny·권한 제한 정책. Permissions boundary의 identity-based 범위를 명시하여 resource-based 허용까지 일반화하지 않음. | [S21](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html), [S25](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) |
| aws-iam-role | [한국어](../knowledge/ko/security/aws-iam-role.md) / [English](../knowledge/en/security/aws-iam-role.md) | 임시 세션·trust/permissions 정책·ECS 역할 분리. 한국어 발급자/대상 표현을 issuer/audience로 명확히 함. | [S23](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html), [S09](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html) |
| aws-iam-user | [한국어](../knowledge/ko/security/aws-iam-user.md) / [English](../knowledge/en/security/aws-iam-user.md) | 계정 root와 IAM User 구분·장기 자격 증명 예외·사람 federation/workload Role 권고. 의무/예외 강도 일치. | [S24](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html), [S22](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) |
| aws-kms | [한국어](../knowledge/ko/security/aws-kms.md) / [English](../knowledge/en/security/aws-kms.md) | 키/비밀 저장 목적 구분·key policy·회전과 재암호화 차이·삭제 위험. 복구 키/권한 조건 동일. | [S31](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html), [S30](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html), [S32](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html), [S29](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html) |
| aws-secrets-manager | [한국어](../knowledge/ko/security/aws-secrets-manager.md) / [English](../knowledge/en/security/aws-secrets-manager.md) | 저장/조회/회전·대상 자격 증명 갱신·ECS 환경 변수는 자동 갱신 안 됨. 소비자/연결 풀 검증 범위 유지. | [S38](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html), [S39](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html), [S08](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html) |
| aws-waf | [한국어](../knowledge/ko/security/aws-waf.md) / [English](../knowledge/en/security/aws-waf.md) | 지원 리소스의 HTTP(S)·Allow/Block/Count·테스트 후 적용. 현재 공식 명칭 protection pack (web ACL) 보완. | [S52](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html), [S51](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html) |
| verification-vs-change-detection | [한국어](../knowledge/ko/testing/verification-vs-change-detection.md) / [English](../knowledge/en/testing/verification-vs-change-detection.md) | 현재 검사 구현과 원본 11개 관측에 대조. SYNCED를 의미 검증으로 해석하지 않음; 과거 실험을 재실행한 것으로 표시하지 않음. | 로컬 구현·정책·원본 기록 |
| fieldbook-audit-failure | [한국어](../runbooks/ko/fieldbook-audit-failure.md) / [English](../runbooks/en/fieldbook-audit-failure.md) | 본문 전체의 오류 분류·명령·중단 조건·운영 검증 범위 일치. 운영 장애 주입 재실행 없이 verified/stale_after/본문/generated 보존. | 로컬 구현·정책·원본 기록 |

## 기존 언어별 목차와 운영 안내 전수 검토

| 한국어 / 영어 | 결과 |
| --- | --- |
| [한국어](../checklists/ko/index.md) / [English](../checklists/en/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../decisions/ADR/ko/index.md) / [English](../decisions/ADR/en/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../experiments/ko/index.md) / [English](../experiments/en/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../glossary/ko/index.md) / [English](../glossary/en/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../knowledge/ko/ai-engineering/index.md) / [English](../knowledge/en/ai-engineering/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../knowledge/ko/architecture/index.md) / [English](../knowledge/en/architecture/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../knowledge/ko/cloud/index.md) / [English](../knowledge/en/cloud/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../knowledge/ko/data/index.md) / [English](../knowledge/en/data/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../knowledge/ko/delivery/index.md) / [English](../knowledge/en/delivery/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../knowledge/ko/engineering-management/index.md) / [English](../knowledge/en/engineering-management/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../knowledge/ko/index.md) / [English](../knowledge/en/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../knowledge/ko/reliability/index.md) / [English](../knowledge/en/reliability/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../knowledge/ko/security/index.md) / [English](../knowledge/en/security/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../knowledge/ko/testing/index.md) / [English](../knowledge/en/testing/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [한국어](../runbooks/ko/index.md) / [English](../runbooks/en/index.md) | 링크 대상·순서·분야 범위 대조. 상세 문서가 없는 분야의 준비 상태와 추가한 학습 안내를 동기화. |
| [사이트 운영](../site/README.md) / [English](../site/README.en.md) | 명령·공개 경계·URL·번역 누락·날짜·검색 한계·사전 생성·404·배포 조건 대조. 영어에만 있던 화면 설명을 두 언어에 맞춤. |

## 열어 확인한 지식 출처

번호는 이 검토의 대응표이며 원본 sources ID를 바꾸지 않습니다. 추가 URL 3개를 제외한 기존 출처는 그대로 유지했습니다.

- S01: [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
- S02: [What is Amazon EC2?](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)
- S03: [Amazon EC2 security group connection tracking](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-connection-tracking.html)
- S04: [AWS Fargate for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
- S05: [What is Amazon ECS?](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)
- S06: [Amazon ECS task networking options for Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html)
- S07: [Amazon ECS task definitions for Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html)
- S08: [Pass Secrets Manager secrets through Amazon ECS environment variables](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html)
- S09: [IAM roles for Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html)
- S10: [PostgreSQL on Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- S11: [Multi-AZ DB instance deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html)
- S12: [Restoring a DB instance to a specified time](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html)
- S13: [Working with automated backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html)
- S14: [Multi-AZ DB cluster deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html)
- S15: [How RDS Proxy works](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.howitworks.html)
- S16: [Deleting object versions from a versioning-enabled bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html)
- S17: [Using versioning in S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
- S18: [What is Amazon S3?](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- S19: [Expiring objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html)
- S20: [Managing the lifecycle of objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
- S21: [Policies and permissions in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
- S22: [Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- S23: [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
- S24: [IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)
- S25: [Policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
- S26: [AWS Fargate or AWS Lambda?](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/fargate-or-lambda.html)
- S27: [AWS Availability Zones](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html)
- S28: [AZ IDs](https://docs.aws.amazon.com/global-infrastructure/latest/regions/az-ids.html)
- S29: [Deleting AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html)
- S30: [Key policies in AWS KMS](https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html)
- S31: [What is AWS Key Management Service?](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html)
- S32: [Rotating AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html)
- S33: [Best practices for working with AWS Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- S34: [Enable internet access for VPC-connected Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc-internet.html)
- S35: [Giving Lambda functions access to resources in an Amazon VPC](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html)
- S36: [Lambda quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)
- S37: [What is AWS Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- S38: [What is AWS Secrets Manager?](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)
- S39: [Rotate AWS Secrets Manager secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html)
- S40: [Configure route tables](https://docs.aws.amazon.com/vpc/latest/userguide/RouteTables.html)
- S41: [Connect to the internet using an internet gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)
- S42: [Subnets for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)
- S43: [Your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/configure-your-vpc.html)
- S44: [Regional NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateways-regional.html)
- S45: [Route priority](https://docs.aws.amazon.com/vpc/latest/userguide/route-tables-priority.html)
- S46: [Security group rules](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html)
- S47: [VPC CIDR blocks](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html)
- S48: [NAT gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)
- S49: [Control traffic to your AWS resources using security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html)
- S50: [VPC basics](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-subnet-basics.html)
- S51: [Testing and tuning your AWS WAF protections](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl-testing.html)
- S52: [What is AWS WAF?](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html)
- S53: [Business Continuity Plan: Recovery objectives (RTO and RPO)](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/business-continuity-plan-bcp.html)
- S54: [OpenID Connect Core 1.0 incorporating errata set 2](https://openid.net/specs/openid-connect-core-1_0.html)
- S55: [RFC 4632, section 3.1: Basic Concept and Prefix Notation](https://www.rfc-editor.org/rfc/rfc4632.html)

## 표준과 사이트 안내의 추가 근거

- [채택한 OKF v0.2 고정 사양](https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/ad30107c31c06aec8a7d5636e0d1058118604e6f/SPEC.md): type·producer 확장·generated/verified·stale_after와 본문 절의 선택성을 대조했습니다. 채택 버전은 변경하지 않았습니다.
- [React Router prerender](https://reactrouter.com/how-to/pre-rendering): 빌드 시 경로별 렌더링 가능 여부와 런타임 서버와의 구분을 확인했습니다. 저장소에 React Router를 도입하거나 버전을 변경하지 않았습니다.
- [Vite SSR/SSG](https://vite.dev/guide/ssr#pre-rendering-ssg): 알려진 경로와 데이터를 빌드 시 HTML로 만드는 설명을 실제 build.ts와 대조했습니다.
- [GitHub Pages 공식 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): artifact·needs·pages/id-token 권한·environment를 현재 워크플로와 대조했습니다. 원격 배포를 실행한 검증은 아닙니다.

## 검증 경계와 남은 항목

- 이번 범위는 원본 설명 편집, Agent의 영어 의미 대조와 기술 주장별 출처 확인입니다. 영어 원어민이나 사람의 교육 효과 검토는 수행하지 않았습니다.
- 201은 계산·설계 연습입니다. AWS 계정 생성, 리소스 배포, 요금 발생 작업, 실제 장애·복구 시험은 수행하지 않았습니다. 학습 목표를 실습 완료·운영 보장으로 해석하지 않습니다.
- 가격·계정별 할당량·전체 리전/엔진 지원표와 제품의 모든 릴리스·폐기 공지를 전수 검증하지 않았습니다. 문서에 적힌 범위와 제약에 해당하는 공식 절을 확인했습니다. 적용 직전 대상 환경 확인이 필요합니다.
- 실험의 원본 JSON과 한국어 본문, ADR의 양쪽 본문은 보존했습니다. Runbook의 마지막 운영 검증 시각은 2026-09-08입니다. 이번 번역 검토 시각과 구분합니다.
- 자동 Audit의 EXTERNAL_UNCHECKED는 자동 도구가 외부 내용을 검사하지 않는다는 뜻으로 남습니다. 위 수동 대조 기록이 자동 코드의 판정을 변경하지 않습니다.
- 로컬 실행 명령과 최종 결과는 [문서 변경 이력](../log.md)에 기록합니다. 생성된 사이트 HTML·검색은 원본에서 다시 만들며 별도 문서 원본으로 관리하지 않습니다.
