# Cloud Infrastructure

Scope and suggested learning order: Infrastructure fundamentals → AWS Infrastructure → Cloud Cost / FinOps.

## AWS learning path

This index is the shared entry point for 23 AWS fundamentals. Database and Security entries live once in their respective domains. The Cloud scope remains open to other infrastructure and FinOps.

## Learning stages

In 101, understand concepts and terms. In 201, follow the calculation or flow of a hypothetical example. In 301, explain judgments using conditional recommendations and operational checks. Answer the question at the end before comparing it with the explanation. These are reading and design exercises, not results of labs executed in an AWS account.

Start with [CIDR](../../../glossary/en/cidr.md) and [Availability Zones](../../../glossary/en/availability-zone.md), then follow the sequence below. You do not need to memorize every entry first.

1. Network: VPC → Subnets → Route Table → Internet Gateway / NAT Gateway → Security Group.
2. Identity: IAM User → IAM Role → IAM Policy.
3. Compute: EC2 → ECS → Fargate → Lambda, comparing execution responsibilities.
4. Data: RDS PostgreSQL → Connection Pool → Multi-AZ → Backup; S3 → Versioning → Lifecycle.
5. Protection: connect KMS → Secrets Manager → WAF to data, identity, and request boundaries.

Read external facts, conditional recommendations, and operational checks separately. Record actual operating decisions and measurements in ADRs and Experiments.

## Compute

- [Amazon EC2: virtual servers and operational responsibility](aws-ec2.md) — Distinguish instances, AMIs, and instance types, and explain what to check when replacing a server.
- [Amazon ECS: orchestrating tasks and services](aws-ecs.md) — Distinguish task definitions, tasks, and services, and evaluate task count separately from deployment success.
- [AWS Fargate: managed capacity for ECS](aws-fargate.md) — Separate server management handled by Fargate from the resources, networking, and permissions you configure.
- [AWS Lambda: event-driven function execution](aws-lambda.md) — Explain invocation time and state constraints, and define handling criteria for repeated delivery of an event.

## Network

- [Amazon VPC: address space and connectivity boundaries](aws-vpc.md) — Explain the relationship between VPCs, subnets, and Availability Zones, and separate address planning from access control.
- [Public and private subnets: a routing distinction](aws-subnets.md) — Distinguish public and private subnets by routing, and trace internet-bound and VPC-local paths in an IPv4 example.
- [Security groups: resource traffic permissions](aws-security-group.md) — Separate reachability from traffic permission and explain how permissions from multiple security groups combine.
- [Route tables: destinations and next hops](aws-route-table.md) — Distinguish destinations from targets and select the more specific of two matching routes.
- [NAT gateways: egress and availability modes](aws-nat-gateway.md) — Distinguish connectivity types from availability modes and explain the application’s egress dependencies.
- [Internet gateways: a target for VPC internet routing](aws-internet-gateway.md) — Explain why IGW attachment, routing, addressing, and traffic permissions each matter.

## Database

- [RDS for PostgreSQL: responsibility boundaries for a managed database](../data/aws-rds-postgresql.md) — Separate RDS management capabilities from DB operating responsibilities retained by the application team.
- [RDS backups: recoverable points and restoration procedures](../data/aws-rds-backup.md) — Separate backup retention from restorable time and explain checks after restoring a new DB.
- [RDS Multi-AZ: distinguishing instances and clusters](../data/aws-rds-multi-az.md) — Distinguish a single standby from a cluster with readers, and evaluate availability separately from read scaling.
- [Connection pooling: PostgreSQL budgets and RDS Proxy](../data/aws-rds-connection-pooling.md) — Explain connection reuse and calculate steady-state and deployment connection limits against a budget.

## Storage

- [Amazon S3: object storage and access design](aws-s3.md) — Distinguish buckets, objects, and keys, and separate object storage from updates spanning multiple objects.
- [S3 Lifecycle: transition and expiration policies](aws-s3-lifecycle.md) — Distinguish transition from expiration and assess effects on existing objects and noncurrent versions.
- [S3 Versioning: recovering from overwrites and deletes](aws-s3-versioning.md) — Distinguish delete markers from permanent version deletion and explain how to inspect previous versions.

## Security

- [IAM users: exceptional use of long-term credentials](../security/aws-iam-user.md) — Distinguish root, IAM users, and roles, and explain conditions for long-term credential exceptions.
- [IAM roles: trust policies and temporary session permissions](../security/aws-iam-role.md) — Distinguish trust-policy and permission-policy questions, and select the relevant ECS application or execution role.
- [IAM policies: explicit permissions and effective-access evaluation](../security/aws-iam-policy.md) — Read policy actions, resources, and conditions, and explain why both permitted and denied requests need checking.
- [AWS KMS: encryption keys and decryption permissions](../security/aws-kms.md) — Separate key administration from data-decryption permissions and explain recovery implications of rotation and deletion.
- [Secrets Manager: retrieval, rotation, and consumer refresh](../security/aws-secrets-manager.md) — Distinguish storage, rotation, and consumer refresh, and check new-value adoption by running applications.
- [AWS WAF: web request inspection and false-positive control](../security/aws-waf.md) — Separate observation from blocking and explain criteria for checking a new rule’s false positives.

## Next questions on cost and recovery

Include NAT, transfer, storage versions, backups, and operating effort alongside compute costs. Record usage assumptions and measurements in Experiments rather than copying price tables; link the decision rationale to an ADR. Define recovery targets using [RPO](../../../glossary/en/rpo.md) and [RTO](../../../glossary/en/rto.md).

[Glossary](../../../glossary/en/index.md) · [Related domains](../index.md) · [Other language](../../ko/cloud/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)
