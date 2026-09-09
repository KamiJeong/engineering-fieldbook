# Data Systems

Scope and suggested learning order: Database → Transactions → Vector Database.

## AWS RDS PostgreSQL

Read PostgreSQL → connection control → failover → backup recovery. These entries cover the AWS implementation and do not replace general database principles or the Vector Database scope.

- [RDS for PostgreSQL: responsibility boundaries for a managed database](aws-rds-postgresql.md) — Separate RDS management capabilities from DB operating responsibilities retained by the application team.
- [Connection pooling: PostgreSQL budgets and RDS Proxy](aws-rds-connection-pooling.md) — Explain connection reuse and calculate steady-state and deployment connection limits against a budget.
- [RDS Multi-AZ: distinguishing instances and clusters](aws-rds-multi-az.md) — Distinguish a single standby from a cluster with readers, and evaluate availability separately from read scaling.
- [RDS backups: recoverable points and restoration procedures](aws-rds-backup.md) — Separate backup retention from restorable time and explain checks after restoring a new DB.

Use the [complete AWS learning path](../cloud/index.md) to connect these entries with Network, Compute, and Storage.

[Glossary](../../../glossary/en/index.md) · [Related domains](../index.md) · [Other language](../../ko/data/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)
