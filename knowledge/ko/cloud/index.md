# Cloud Infrastructure

범위와 추천 학습 순서: Infrastructure fundamentals → AWS Infrastructure → Cloud Cost / FinOps.

## AWS 학습 경로

이 Index는 AWS 기초 23개 Concept의 공통 입구다. Database와 Security 문서는 각 책임 영역에 한 번만 저장한다. Cloud 범위는 AWS 외 인프라와 FinOps로 확장할 수 있다.

## 학습 단계

101에서는 개념과 용어를 이해하고, 201에서는 가정한 예제의 계산·흐름을 따라갑니다. 301에서는 조건별 권고와 운영 확인을 읽고 판단 근거를 설명합니다. 본문 끝의 이해 확인 질문에 답한 뒤 해설과 비교합니다. 이 단계는 읽기·설계 연습이며 AWS 계정에서 실행한 실습 결과를 뜻하지 않습니다.

먼저 [CIDR](../../../glossary/ko/cidr.md)과 [가용 영역](../../../glossary/ko/availability-zone.md)을 읽고 아래 순서를 따라갑니다. 모든 문서를 처음부터 외울 필요는 없습니다.

1. Network: VPC → Subnet → Route Table → Internet Gateway / NAT Gateway → Security Group.
2. Identity: IAM User → IAM Role → IAM Policy.
3. Compute: EC2 → ECS → Fargate → Lambda를 읽고 실행 책임을 비교한다.
4. Data: RDS PostgreSQL → Connection Pool → Multi-AZ → Backup, S3 → Versioning → Lifecycle.
5. Protection: KMS → Secrets Manager → WAF를 데이터·인증·요청 경계에 연결한다.

각 문서의 외부 사실, 조건부 권고, 운영 확인 항목을 구분해 읽는다. 실제 운영 결정과 측정 결과는 ADR과 Experiment에 남긴다.

## Compute

- [Amazon EC2: 가상 서버와 운영 책임](aws-ec2.md) — 인스턴스·AMI·인스턴스 유형을 구분하고, 서버 교체 때 확인할 항목을 설명합니다.
- [Amazon ECS: Task와 Service의 오케스트레이션](aws-ecs.md) — Task definition·Task·Service의 역할을 구분하고, 실행 수와 배포 성공을 따로 판단합니다.
- [AWS Fargate: ECS의 관리형 실행 용량](aws-fargate.md) — Fargate가 맡는 서버 관리와 사용자가 설정할 자원·네트워크·권한을 구분합니다.
- [AWS Lambda: 이벤트 기반 함수 실행](aws-lambda.md) — 함수 호출의 시간·상태 제약을 설명하고, 같은 이벤트가 다시 전달될 때의 처리 기준을 세웁니다.

## Network

- [Amazon VPC: 주소 공간과 연결 경계](aws-vpc.md) — VPC·서브넷·가용 영역의 관계를 설명하고, 주소 계획과 접근 제어를 구분합니다.
- [Public / Private Subnet: 라우팅으로 구분하기](aws-subnets.md) — Public·Private Subnet을 경로로 구분하고, IPv4 예제에서 인터넷 방향과 VPC 내부 방향을 추적합니다.
- [Security Group: 리소스 통신 허용 규칙](aws-security-group.md) — 도달 경로와 통신 허용을 구분하고, 여러 보안 그룹의 허용 규칙이 합쳐지는 의미를 설명합니다.
- [Route Table: 목적지와 다음 경로](aws-route-table.md) — 목적지와 target을 구분하고, 두 경로 중 더 구체적인 경로를 선택합니다.
- [NAT Gateway: egress와 가용성 모드](aws-nat-gateway.md) — 연결 유형과 가용성 모드를 구분하고, 애플리케이션이 의존하는 출구 경로를 설명합니다.
- [Internet Gateway: VPC 인터넷 연결의 경로 대상](aws-internet-gateway.md) — IGW 연결, 경로, 주소, 통신 허용이 각각 필요한 이유를 설명합니다.

## Database

- [RDS for PostgreSQL: 관리형 DB의 책임 경계](../data/aws-rds-postgresql.md) — RDS가 제공하는 관리 기능과 애플리케이션 팀이 확인할 DB 운영 항목을 구분합니다.
- [RDS Backup: 복원 가능한 시점과 복구 절차](../data/aws-rds-backup.md) — 백업 보존 기간과 복원 가능 시각을 구분하고, 새 DB 복원 뒤 필요한 확인을 설명합니다.
- [RDS Multi-AZ: instance와 cluster 구분](../data/aws-rds-multi-az.md) — 단일 standby 구성과 reader가 있는 cluster를 구분하고, 가용성과 읽기 확장을 따로 판단합니다.
- [Connection Pool: PostgreSQL 연결 예산과 RDS Proxy](../data/aws-rds-connection-pooling.md) — 연결 재사용을 설명하고, 평상시와 배포 중의 최대 연결 수를 계산해 한도와 비교합니다.

## Storage

- [Amazon S3: 객체 저장과 접근 설계](aws-s3.md) — 버킷·객체·키를 구분하고, 객체 저장과 여러 객체를 함께 갱신하는 처리를 구분합니다.
- [S3 Lifecycle: 전환과 만료 정책](aws-s3-lifecycle.md) — 전환과 만료를 구분하고, 기존 객체와 과거 버전까지 규칙의 영향을 확인합니다.
- [S3 Versioning: 덮어쓰기와 삭제 복구](aws-s3-versioning.md) — 삭제 표시와 버전 영구 삭제를 구분하고, 이전 버전 확인 절차를 설명합니다.

## Security

- [IAM User: 장기 자격 증명의 예외적 사용](../security/aws-iam-user.md) — Root·IAM User·Role을 구분하고, 장기 자격 증명이 필요한 예외의 조건을 설명합니다.
- [IAM Role: 신뢰 정책과 임시 세션 권한](../security/aws-iam-role.md) — 신뢰 정책과 권한 정책의 질문을 구분하고, ECS의 애플리케이션 역할과 실행 역할을 선택합니다.
- [IAM Policy: 명시적 허용과 유효 권한 평가](../security/aws-iam-policy.md) — 정책의 작업·리소스·조건을 읽고, 허용과 거부 요청을 각각 확인할 이유를 설명합니다.
- [AWS KMS: 암호화 키와 복호화 권한](../security/aws-kms.md) — 키 관리와 데이터 복호화 권한을 구분하고, 키 회전과 삭제가 복구에 미치는 영향을 설명합니다.
- [Secrets Manager: 비밀 조회·회전·소비자 갱신](../security/aws-secrets-manager.md) — 저장·회전·소비자 갱신을 구분하고, 실행 중인 애플리케이션의 새 값 반영을 확인합니다.
- [AWS WAF: 웹 요청 검사와 오탐 제어](../security/aws-waf.md) — 요청 관측과 차단을 구분하고, 새 규칙의 오탐을 확인할 기준을 설명합니다.

## 비용과 복구의 다음 질문

Compute 비용 외에 NAT·전송·스토리지 버전·백업·운영 시간도 비교 대상으로 잡는다. 가격표 복사 대신 사용량 가정과 측정 결과를 Experiment에 기록하고, 선택 근거는 ADR에 연결한다. 복구 목표는 [RPO](../../../glossary/ko/rpo.md)와 [RTO](../../../glossary/ko/rto.md)부터 정의한다.

[Glossary](../../../glossary/ko/index.md) · [Related domains](../index.md) · [Other language](../../en/cloud/index.md)

[Checklist](../../../checklists/index.md) · [ADR](../../../decisions/index.md) · [Experiment](../../../experiments/index.md) · [Runbook](../../../runbooks/index.md)
