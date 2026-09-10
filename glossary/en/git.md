---
type: Glossary Term
title: 'Git: a tool for tracking file history'
description: Define Git version control, repositories, commits, branches, merges, and its relationship
  to GitHub and GitLab.
concept_id: git
language: en
status: stable
generated:
  by: codex/gpt-6-astra
  at: '2026-09-10T17:16:27+09:00'
freshness:
  mode: current
  volatility: low
  review_days: 365
  reason: Core Git concepts are stable; review their distinction from hosting platforms.
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
translation:
  source_language: ko
  source_concept_id: git
  source_fingerprint: sha256:7578a553cd9a9f31e8063dc4e3e74ca1538a503fd3d8c0a5084e7aeb04740bd9
  target_fingerprint: sha256:dce7167a7ce4d380acd2fe96abc063ccd0137b369e2ff18dba240a622e926b72
  synced_at: '2026-09-10T17:16:27+09:00'
  review_status: SYNCED
---

# Git: a tool for tracking file history

**Git** is a distributed version control tool that manages file versions and their history. It lets you see who changed what, compare earlier records, and combine changes from different lines of work.[^git][^github]

Imagine updating the meeting time in a guide. Instead of repeatedly creating `guide_final2.md`, recording changes and their reasons with Git helps you find how the same file differs from an earlier version. This is a hypothetical illustration of its purpose.

- **Repository:** A space containing managed files and history.
- **Commit:** A record of changes with an explanation.
- **Branch:** A line of changes you can work on separately.
- **Merge:** Combining changes from one line of work into another.[^hello]

Git is not the GitHub or GitLab web service. Those platforms provide Git repositories and collaboration features; Issues and Pages are not features of Git itself.[^github][^gitlab]

The Git history available depends on the files and changes actually recorded. Merely editing a file does not automatically create a commit.[^hello]

[GitHub basics](../../knowledge/en/delivery/github-fundamentals.md) · [GitLab basics](../../knowledge/en/delivery/gitlab-fundamentals.md) · [Comparison](../../knowledge/en/delivery/github-and-gitlab.md) · [Glossary](index.md)

## Sources

[^git]: [Git — About Version Control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
[^github]: [GitHub — What is GitHub?](https://docs.github.com/en/get-started/start-your-journey/what-is-github)
[^hello]: [GitHub — Hello World](https://docs.github.com/en/get-started/using-github/hello-world)
[^gitlab]: [GitLab — Repository](https://docs.gitlab.com/user/project/repository/)
