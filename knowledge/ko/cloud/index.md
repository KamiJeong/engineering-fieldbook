# Cloud Infrastructure

범위와 추천 학습 순서: Infrastructure fundamentals → AWS Infrastructure → Cloud Cost / FinOps.

## AWS 학습 경로

이 Index는 AWS 기초 23개 Concept의 공통 입구다. Database와 Security 문서는 각 책임 영역에 한 번만 저장한다. Cloud 범위는 AWS 외 인프라와 FinOps로 확장할 수 있다.

1. Network: VPC → Subnet → Route Table → Internet Gateway / NAT Gateway → Security Group.
2. Identity: IAM User → IAM Role → IAM Policy.
3. Compute: EC2 → ECS → Fargate → Lambda를 읽고 실행 책임을 비교한다.
4. Data: RDS PostgreSQL → Connection Pool → Multi-AZ → Backup, S3 → Versioning → Lifecycle.
5. Protection: KMS → Secrets Manager → WAF를 데이터·인증·요청 경계에 연결한다.

각 문서의 외부 사실, 조건부 권고, 운영 확인 항목을 구분해 읽는다. 실제 운영 결정과 측정 결과는 ADR과 Experiment에 남긴다.

## Compute

- [Amazon EC2: 가상 서버와 운영 책임](aws-ec2.md) — OS와 인스턴스 구성을 직접 제어하는 컴퓨팅 선택지.
- [Amazon ECS: Task와 Service의 오케스트레이션](aws-ecs.md) — 컨테이너 실행 정의·배포·원하는 실행 수를 관리하는 서비스.
- [AWS Fargate: ECS의 관리형 실행 용량](aws-fargate.md) — 호스트 운영을 줄이되 Task의 자원·네트워크·권한은 직접 설계한다.
- [AWS Lambda: 이벤트 기반 함수 실행](aws-lambda.md) — 호출 단위의 실행과 동시성·재시도·외부 의존성을 함께 설계한다.

## Network

- [Amazon VPC: 주소 공간과 연결 경계](aws-vpc.md) — AWS 리전 안에서 논리적으로 격리된 네트워크를 설계한다.
- [Public / Private Subnet: 라우팅으로 구분하기](aws-subnets.md) — Subnet 이름 대신 Internet Gateway로 향하는 직접 경로를 확인한다.
- [Security Group: 리소스 통신 허용 규칙](aws-security-group.md) — 네트워크 도달 경로와 별도로 리소스의 입출력 통신을 허용한다.
- [Route Table: 목적지와 다음 경로](aws-route-table.md) — Subnet에 적용되는 실제 경로와 우선순위를 이해한다.
- [NAT Gateway: egress와 가용성 모드](aws-nat-gateway.md) — 주소 변환의 연결 유형과 zonal/regional 모드를 구분한다.
- [Internet Gateway: VPC 인터넷 연결의 경로 대상](aws-internet-gateway.md) — IGW 연결·라우팅·주소·접근 허용 조건을 함께 이해한다.

## Database

- [RDS for PostgreSQL: 관리형 DB의 책임 경계](../data/aws-rds-postgresql.md) — PostgreSQL 운영 인프라와 애플리케이션 데이터 설계의 책임을 구분한다.
- [RDS Backup: 복원 가능한 시점과 복구 절차](../data/aws-rds-backup.md) — 보관된 백업이 아니라 복원·검증·전환까지 포함한 복구 능력을 관리한다.
- [RDS Multi-AZ: instance와 cluster 구분](../data/aws-rds-multi-az.md) — 고가용성 배포 형태와 읽기 처리 가능 여부를 구분한다.
- [Connection Pool: PostgreSQL 연결 예산과 RDS Proxy](../data/aws-rds-connection-pooling.md) — 애플리케이션 동시성과 실제 DB 연결 수를 분리해 제어한다.

## Storage

- [Amazon S3: 객체 저장과 접근 설계](aws-s3.md) — 파일시스템 가정 없이 객체 키·접근 권한·보존 정책을 설계한다.
- [S3 Lifecycle: 전환과 만료 정책](aws-s3-lifecycle.md) — 객체와 과거 버전의 보존·비용을 규칙으로 관리한다.
- [S3 Versioning: 덮어쓰기와 삭제 복구](aws-s3-versioning.md) — 객체 버전 보존과 실제 복원·영구 삭제의 차이를 이해한다.

## Security

- [IAM User: 장기 자격 증명의 예외적 사용](../security/aws-iam-user.md) — IAM User와 root·Role을 구분하고 필요한 경우에만 장기 자격 증명을 관리한다.
- [IAM Role: 신뢰 정책과 임시 세션 권한](../security/aws-iam-role.md) — 누가 Role을 맡을 수 있는지와 맡은 뒤 무엇을 할 수 있는지를 분리한다.
- [IAM Policy: 명시적 허용과 유효 권한 평가](../security/aws-iam-policy.md) — 한 정책의 Allow 대신 요청에 적용되는 모든 권한 경계를 검토한다.
- [AWS KMS: 암호화 키와 복호화 권한](../security/aws-kms.md) — 데이터 암호화와 키 접근·보존·삭제의 운영 책임을 함께 설계한다.
- [Secrets Manager: 비밀 조회·회전·소비자 갱신](../security/aws-secrets-manager.md) — 비밀 값의 저장뿐 아니라 실제 소비자의 안전한 갱신을 관리한다.
- [AWS WAF: 웹 요청 검사와 오탐 제어](../security/aws-waf.md) — 보호 대상에 들어오는 HTTP 요청을 규칙으로 검사하고 단계적으로 적용한다.

## 비용과 복구의 다음 질문

Compute 비용 외에 NAT·전송·스토리지 버전·백업·운영 시간도 비교 대상으로 잡는다. 가격표 복사 대신 사용량 가정과 측정 결과를 Experiment에 기록하고, 선택 근거는 ADR에 연결한다. 복구 목표는 [RPO](../../../glossary/ko/rpo.md)와 [RTO](../../../glossary/ko/rto.md)부터 정의한다.

[Glossary](../../../glossary/ko/index.md) · [Related domains](../index.md) · [Other language](../../en/cloud/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)
