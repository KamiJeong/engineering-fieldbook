---
type: Glossary Term
title: 'Git: 파일의 변경 이력을 관리하는 도구'
description: Git의 변경 이력 관리와 저장소·커밋·브랜치·병합, GitHub와 GitLab의 관계를 정의합니다.
concept_id: git
language: ko
status: stable
generated:
  by: codex/gpt-6-astra
  at: '2026-09-10T17:16:27+09:00'
freshness:
  mode: current
  volatility: low
  review_days: 365
  reason: Git의 기본 의미는 안정적이며 플랫폼과의 구분을 함께 재검토합니다.
sources:
- id: git
  resource: https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
  title: Git — About Version Control
- id: github
  resource: https://docs.github.com/en/get-started/start-your-journey/what-is-github
  title: GitHub — What is GitHub?
- id: hello
  resource: https://docs.github.com/en/get-started/using-github/hello-world
  title: GitHub — Hello World
- id: gitlab
  resource: https://docs.gitlab.com/user/project/repository/
  title: GitLab — Repository
verified:
- by: codex/gpt-6-astra
  at: '2026-09-10T17:16:27+09:00'
stale_after: '2027-09-10T17:16:27+09:00'
---

# Git: 파일의 변경 이력을 관리하는 도구

**Git**은 파일의 여러 버전과 변경 이력을 관리하는 분산 버전 관리 도구입니다. 누가 무엇을 바꿨는지 살펴보고, 이전 기록을 비교하며, 여러 작업 흐름의 변경을 합칠 수 있습니다.[^git][^github]

안내문의 모임 시간을 수정한다고 가정합니다. `안내_최종2.md`를 계속 만드는 대신, Git으로 같은 파일의 변경과 이유를 기록하면 이전 안내와 달라진 부분을 찾아볼 수 있습니다. 이 예시는 사용 목적을 설명하기 위한 가정입니다.

- **Repository / 저장소:** 관리하는 파일과 변경 이력이 있는 공간입니다.
- **Commit / 커밋:** 변경을 설명과 함께 남기는 기록입니다.
- **Branch / 브랜치:** 별도로 작업할 수 있는 변경 흐름입니다.
- **Merge / 병합:** 한 흐름의 변경을 다른 흐름에 합치는 일입니다.[^hello]

Git은 GitHub나 GitLab이라는 웹 서비스 자체가 아닙니다. GitHub·GitLab은 Git 저장소와 협업 기능을 제공하는 플랫폼이며, Issue와 Pages는 Git 자체의 기능이 아닙니다.[^github][^gitlab]

어떤 Git 기록이 남는지는 실제로 기록한 파일과 변경에 달려 있습니다. 파일을 편집하기만 했다고 커밋이 자동으로 만들어지는 것은 아닙니다.[^hello]

[GitHub 입문](../../knowledge/ko/delivery/github-fundamentals.md) · [GitLab 입문](../../knowledge/ko/delivery/gitlab-fundamentals.md) · [종합 비교](../../knowledge/ko/delivery/github-and-gitlab.md) · [Glossary](index.md)

## 출처

[^git]: [Git — About Version Control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
[^github]: [GitHub — What is GitHub?](https://docs.github.com/en/get-started/start-your-journey/what-is-github)
[^hello]: [GitHub — Hello World](https://docs.github.com/en/get-started/using-github/hello-world)
[^gitlab]: [GitLab — Repository](https://docs.gitlab.com/user/project/repository/)
