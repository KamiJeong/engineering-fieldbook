# Security

범위와 추천 학습 순서: Identity → Cloud Security → Software Supply Chain Security.

## AWS 접근 제어와 보호

IAM User / Role로 identity를 구분한 뒤 Policy 평가를 읽는다. KMS → Secrets Manager → WAF 순서로 키·비밀·웹 요청의 보호 대상을 나눈다.

- [IAM User: 장기 자격 증명의 예외적 사용](aws-iam-user.md) — IAM User와 root·Role을 구분하고 필요한 경우에만 장기 자격 증명을 관리한다.
- [IAM Role: 신뢰 정책과 임시 세션 권한](aws-iam-role.md) — 누가 Role을 맡을 수 있는지와 맡은 뒤 무엇을 할 수 있는지를 분리한다.
- [IAM Policy: 명시적 허용과 유효 권한 평가](aws-iam-policy.md) — 한 정책의 Allow 대신 요청에 적용되는 모든 권한 경계를 검토한다.
- [AWS KMS: 암호화 키와 복호화 권한](aws-kms.md) — 데이터 암호화와 키 접근·보존·삭제의 운영 책임을 함께 설계한다.
- [Secrets Manager: 비밀 조회·회전·소비자 갱신](aws-secrets-manager.md) — 비밀 값의 저장뿐 아니라 실제 소비자의 안전한 갱신을 관리한다.
- [AWS WAF: 웹 요청 검사와 오탐 제어](aws-waf.md) — 보호 대상에 들어오는 HTTP 요청을 규칙으로 검사하고 단계적으로 적용한다.

[AWS 전체 학습 경로](../cloud/index.md)에서 Network·Compute·Storage와 함께 탐색한다.

[Security Group](../cloud/aws-security-group.md)은 Network 영역에서 관리한다.

[Glossary](../../../glossary/ko/index.md) · [Related domains](../index.md) · [Other language](../../en/security/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)

[OIDC](../../../glossary/ko/oidc.md) — 인증 용어의 출발점.
