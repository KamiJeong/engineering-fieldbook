# Data Systems

Scope and suggested learning order: Database → Transactions → Vector Database.

## AWS RDS PostgreSQL

Read PostgreSQL → connection control → failover → backup recovery. These entries cover the AWS implementation and do not replace general database principles or the Vector Database scope.

- [RDS for PostgreSQL: responsibility boundaries for a managed database](aws-rds-postgresql.md) — Separate managed PostgreSQL infrastructure from application data-design responsibilities.
- [Connection pooling: PostgreSQL budgets and RDS Proxy](aws-rds-connection-pooling.md) — Control application concurrency separately from physical database connections.
- [RDS Multi-AZ: distinguishing instances and clusters](aws-rds-multi-az.md) — Distinguish high-availability deployment types and their read-serving capabilities.
- [RDS backups: recoverable points and restoration procedures](aws-rds-backup.md) — Manage recovery through restoration, validation, and cutover rather than backup retention alone.

Use the [complete AWS learning path](../cloud/index.md) to connect these entries with Network, Compute, and Storage.

[Glossary](../../../glossary/en/index.md) · [Related domains](../index.md) · [Other language](../../ko/data/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)
