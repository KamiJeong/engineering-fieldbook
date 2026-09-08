# Security

Scope and suggested learning order: Identity → Cloud Security → Software Supply Chain Security.

## AWS access control and protection

Distinguish identities with IAM User / Role, then read policy evaluation. Continue through KMS → Secrets Manager → WAF to distinguish keys, secrets, and web requests.

- [IAM users: exceptional use of long-term credentials](aws-iam-user.md) — Distinguish IAM users from root and roles, managing long-term credentials only where required.
- [IAM roles: trust policies and temporary session permissions](aws-iam-role.md) — Separate who can assume a role from what the resulting session can do.
- [IAM policies: explicit permissions and effective-access evaluation](aws-iam-policy.md) — Review all applicable permission boundaries rather than a single policy’s Allow.
- [AWS KMS: encryption keys and decryption permissions](aws-kms.md) — Design encryption together with key access, retention, and deletion responsibilities.
- [Secrets Manager: retrieval, rotation, and consumer refresh](aws-secrets-manager.md) — Manage safe consumer updates as well as secret storage.
- [AWS WAF: web request inspection and false-positive control](aws-waf.md) — Inspect HTTP requests reaching protected resources and roll out rules progressively.

Use the [complete AWS learning path](../cloud/index.md) to connect these entries with Network, Compute, and Storage.

[Security Group](../cloud/aws-security-group.md) is maintained in the Network section.

[Glossary](../../../glossary/en/index.md) · [Related domains](../index.md) · [Other language](../../ko/security/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)

[OIDC](../../../glossary/en/oidc.md) — A starting point for identity terminology.
