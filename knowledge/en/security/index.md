# Security

Scope and suggested learning order: Identity → Cloud Security → Software Supply Chain Security.

## AWS access control and protection

Distinguish identities with IAM User / Role, then read policy evaluation. Continue through KMS → Secrets Manager → WAF to distinguish keys, secrets, and web requests.

- [IAM users: exceptional use of long-term credentials](aws-iam-user.md) — Distinguish root, IAM users, and roles, and explain conditions for long-term credential exceptions.
- [IAM roles: trust policies and temporary session permissions](aws-iam-role.md) — Distinguish trust-policy and permission-policy questions, and select the relevant ECS application or execution role.
- [IAM policies: explicit permissions and effective-access evaluation](aws-iam-policy.md) — Read policy actions, resources, and conditions, and explain why both permitted and denied requests need checking.
- [AWS KMS: encryption keys and decryption permissions](aws-kms.md) — Separate key administration from data-decryption permissions and explain recovery implications of rotation and deletion.
- [Secrets Manager: retrieval, rotation, and consumer refresh](aws-secrets-manager.md) — Distinguish storage, rotation, and consumer refresh, and check new-value adoption by running applications.
- [AWS WAF: web request inspection and false-positive control](aws-waf.md) — Separate observation from blocking and explain criteria for checking a new rule’s false positives.

Use the [complete AWS learning path](../cloud/index.md) to connect these entries with Network, Compute, and Storage.

[Security Group](../cloud/aws-security-group.md) is maintained in the Network section.

[Glossary](../../../glossary/en/index.md) · [Related domains](../index.md) · [Other language](../../ko/security/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)

[OIDC](../../../glossary/en/oidc.md) — A starting point for identity terminology.
