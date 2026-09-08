# Cloud Infrastructure

Scope and suggested learning order: Infrastructure fundamentals → AWS Infrastructure → Cloud Cost / FinOps.

## AWS learning path

This index is the shared entry point for 23 AWS fundamentals. Database and Security entries live once in their respective domains. The Cloud scope remains open to other infrastructure and FinOps.

1. Network: VPC → Subnets → Route Table → Internet Gateway / NAT Gateway → Security Group.
2. Identity: IAM User → IAM Role → IAM Policy.
3. Compute: EC2 → ECS → Fargate → Lambda, comparing execution responsibilities.
4. Data: RDS PostgreSQL → Connection Pool → Multi-AZ → Backup; S3 → Versioning → Lifecycle.
5. Protection: connect KMS → Secrets Manager → WAF to data, identity, and request boundaries.

Read external facts, conditional recommendations, and operational checks separately. Record actual operating decisions and measurements in ADRs and Experiments.

## Compute

- [Amazon EC2: virtual servers and operational responsibility](aws-ec2.md) — A compute option for direct control over the OS and instance configuration.
- [Amazon ECS: orchestrating tasks and services](aws-ecs.md) — A service for defining, deploying, and maintaining container workloads.
- [AWS Fargate: managed capacity for ECS](aws-fargate.md) — Reduce host management while explicitly designing task resources, networking, and permissions.
- [AWS Lambda: event-driven function execution](aws-lambda.md) — Design invocation-based execution together with concurrency, retries, and dependencies.

## Network

- [Amazon VPC: address space and connectivity boundaries](aws-vpc.md) — Design a logically isolated network within an AWS Region.
- [Public and private subnets: a routing distinction](aws-subnets.md) — Inspect direct internet-gateway routing rather than relying on subnet names.
- [Security groups: resource traffic permissions](aws-security-group.md) — Permit resource ingress and egress separately from network routing.
- [Route tables: destinations and next hops](aws-route-table.md) — Understand the routes and priorities actually applied to a subnet.
- [NAT gateways: egress and availability modes](aws-nat-gateway.md) — Distinguish connectivity types from zonal and regional availability modes.
- [Internet gateways: a target for VPC internet routing](aws-internet-gateway.md) — Understand IGW attachment, routing, addressing, and traffic permissions together.

## Database

- [RDS for PostgreSQL: responsibility boundaries for a managed database](../data/aws-rds-postgresql.md) — Separate managed PostgreSQL infrastructure from application data-design responsibilities.
- [RDS backups: recoverable points and restoration procedures](../data/aws-rds-backup.md) — Manage recovery through restoration, validation, and cutover rather than backup retention alone.
- [RDS Multi-AZ: distinguishing instances and clusters](../data/aws-rds-multi-az.md) — Distinguish high-availability deployment types and their read-serving capabilities.
- [Connection pooling: PostgreSQL budgets and RDS Proxy](../data/aws-rds-connection-pooling.md) — Control application concurrency separately from physical database connections.

## Storage

- [Amazon S3: object storage and access design](aws-s3.md) — Design object keys, access permissions, and retention without assuming filesystem semantics.
- [S3 Lifecycle: transition and expiration policies](aws-s3-lifecycle.md) — Manage retention and cost for objects and historical versions through rules.
- [S3 Versioning: recovering from overwrites and deletes](aws-s3-versioning.md) — Understand retained versions, recovery, and permanent deletion.

## Security

- [IAM users: exceptional use of long-term credentials](../security/aws-iam-user.md) — Distinguish IAM users from root and roles, managing long-term credentials only where required.
- [IAM roles: trust policies and temporary session permissions](../security/aws-iam-role.md) — Separate who can assume a role from what the resulting session can do.
- [IAM policies: explicit permissions and effective-access evaluation](../security/aws-iam-policy.md) — Review all applicable permission boundaries rather than a single policy’s Allow.
- [AWS KMS: encryption keys and decryption permissions](../security/aws-kms.md) — Design encryption together with key access, retention, and deletion responsibilities.
- [Secrets Manager: retrieval, rotation, and consumer refresh](../security/aws-secrets-manager.md) — Manage safe consumer updates as well as secret storage.
- [AWS WAF: web request inspection and false-positive control](../security/aws-waf.md) — Inspect HTTP requests reaching protected resources and roll out rules progressively.

## Next questions on cost and recovery

Include NAT, transfer, storage versions, backups, and operating effort alongside compute costs. Record usage assumptions and measurements in Experiments rather than copying price tables; link the decision rationale to an ADR. Define recovery targets using [RPO](../../../glossary/en/rpo.md) and [RTO](../../../glossary/en/rto.md).

[Glossary](../../../glossary/en/index.md) · [Related domains](../index.md) · [Other language](../../ko/cloud/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)
