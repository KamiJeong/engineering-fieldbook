# Data Systems

범위와 추천 학습 순서: Database → Transactions → Vector Database.

## AWS RDS PostgreSQL

PostgreSQL → 연결 수 제어 → 장애 전환 → 백업 복구 순서로 읽는다. 현재 문서는 AWS 구현에 범위를 한정하며, 일반 Database 원리나 Vector Database 영역을 대체하지 않는다.

- [RDS for PostgreSQL: 관리형 DB의 책임 경계](aws-rds-postgresql.md) — PostgreSQL 운영 인프라와 애플리케이션 데이터 설계의 책임을 구분한다.
- [Connection Pool: PostgreSQL 연결 예산과 RDS Proxy](aws-rds-connection-pooling.md) — 애플리케이션 동시성과 실제 DB 연결 수를 분리해 제어한다.
- [RDS Multi-AZ: instance와 cluster 구분](aws-rds-multi-az.md) — 고가용성 배포 형태와 읽기 처리 가능 여부를 구분한다.
- [RDS Backup: 복원 가능한 시점과 복구 절차](aws-rds-backup.md) — 보관된 백업이 아니라 복원·검증·전환까지 포함한 복구 능력을 관리한다.

[AWS 전체 학습 경로](../cloud/index.md)에서 Network·Compute·Storage와 함께 탐색한다.

[Glossary](../../../glossary/ko/index.md) · [Related domains](../index.md) · [Other language](../../en/data/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)
