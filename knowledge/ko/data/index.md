# Data Systems

범위와 추천 학습 순서: Database → Transactions → Vector Database.

## AWS RDS PostgreSQL

PostgreSQL → 연결 수 제어 → 장애 전환 → 백업 복구 순서로 읽는다. 현재 문서는 AWS 구현에 범위를 한정하며, 일반 Database 원리나 Vector Database 영역을 대체하지 않는다.

- [RDS for PostgreSQL: 관리형 DB의 책임 경계](aws-rds-postgresql.md) — RDS가 제공하는 관리 기능과 애플리케이션 팀이 확인할 DB 운영 항목을 구분합니다.
- [Connection Pool: PostgreSQL 연결 예산과 RDS Proxy](aws-rds-connection-pooling.md) — 연결 재사용을 설명하고, 평상시와 배포 중의 최대 연결 수를 계산해 한도와 비교합니다.
- [RDS Multi-AZ: instance와 cluster 구분](aws-rds-multi-az.md) — 단일 standby 구성과 reader가 있는 cluster를 구분하고, 가용성과 읽기 확장을 따로 판단합니다.
- [RDS Backup: 복원 가능한 시점과 복구 절차](aws-rds-backup.md) — 백업 보존 기간과 복원 가능 시각을 구분하고, 새 DB 복원 뒤 필요한 확인을 설명합니다.

[AWS 전체 학습 경로](../cloud/index.md)에서 Network·Compute·Storage와 함께 탐색한다.

[Glossary](../../../glossary/ko/index.md) · [Related domains](../index.md) · [Other language](../../en/data/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)
