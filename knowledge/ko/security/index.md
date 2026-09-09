# Security

범위와 추천 학습 순서: Identity → Cloud Security → Software Supply Chain Security.

## AWS 접근 제어와 보호

IAM User / Role로 identity를 구분한 뒤 Policy 평가를 읽는다. KMS → Secrets Manager → WAF 순서로 키·비밀·웹 요청의 보호 대상을 나눈다.

- [IAM User: 장기 자격 증명의 예외적 사용](aws-iam-user.md) — Root·IAM User·Role을 구분하고, 장기 자격 증명이 필요한 예외의 조건을 설명합니다.
- [IAM Role: 신뢰 정책과 임시 세션 권한](aws-iam-role.md) — 신뢰 정책과 권한 정책의 질문을 구분하고, ECS의 애플리케이션 역할과 실행 역할을 선택합니다.
- [IAM Policy: 명시적 허용과 유효 권한 평가](aws-iam-policy.md) — 정책의 작업·리소스·조건을 읽고, 허용과 거부 요청을 각각 확인할 이유를 설명합니다.
- [AWS KMS: 암호화 키와 복호화 권한](aws-kms.md) — 키 관리와 데이터 복호화 권한을 구분하고, 키 회전과 삭제가 복구에 미치는 영향을 설명합니다.
- [Secrets Manager: 비밀 조회·회전·소비자 갱신](aws-secrets-manager.md) — 저장·회전·소비자 갱신을 구분하고, 실행 중인 애플리케이션의 새 값 반영을 확인합니다.
- [AWS WAF: 웹 요청 검사와 오탐 제어](aws-waf.md) — 요청 관측과 차단을 구분하고, 새 규칙의 오탐을 확인할 기준을 설명합니다.

[AWS 전체 학습 경로](../cloud/index.md)에서 Network·Compute·Storage와 함께 탐색한다.

[Security Group](../cloud/aws-security-group.md)은 Network 영역에서 관리한다.

[Glossary](../../../glossary/ko/index.md) · [Related domains](../index.md) · [Other language](../../en/security/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)

[OIDC](../../../glossary/ko/oidc.md) — 인증 용어의 출발점.
