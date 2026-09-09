# Fieldbook 사이트 운영

한국어 원본 설명입니다. [English](README.en.md)

중립적인 배경과 간결한 사이드바, 읽기 편한 본문을 사용합니다. 라이트·다크 테마, 모바일 탐색, 키보드 검색과 코드·다이어그램 도구를 제공합니다.

이 앱은 기존 위키 위에 추가한 읽기 전용 표현 계층이다. 원본 Markdown·OKF 메타데이터·경로·번역 본문은 옮기거나 복제하지 않는다. GitHub Wiki 저장소를 가져오는 작업은 필요하지 않다.

## 로컬 명령

저장소 루트에서 Bun **1.4.0**, Python 3.10+ / PyYAML을 사용한다. 브라우저 테스트는 Playwright의 Node ESM 로더 때문에 Node **24.15.0**도 필요하다. 사이트 실행 서버에는 Node가 필요하지 않으며 배포 후에는 어떤 서버 런타임도 필요하지 않다.

```sh
bun install --frozen-lockfile
python3 -m pip install -r requirements.txt
bun run browser:install
bun run dev
bun run docs:validate
bun run lint
bun run typecheck
bun run test
bun run build
bun run test:e2e
bun run preview
bun run verify
```

Linux에서 브라우저 시스템 라이브러리가 없으면 `node node_modules/@playwright/test/cli.js install --with-deps chromium`으로 준비한다. 개발 주소는 `http://localhost:5173/engineering-fieldbook/`, 빌드 미리보기는 포트 4173이다. 개발 명령은 원본과 사이트 파일 변경을 감지해 실제 정적 산출물을 다시 만든다. 완료 로그 후 브라우저를 새로고침한다. Vite HMR은 사용하지 않는다. 설정 파일/환경변수 변경 후 개발 명령을 재시작한다.

## 원본과 생성물

- `site/config.ts`: 공개 루트·허용 첨부파일·base·origin·실제 GitHub 저장소/브랜치 설정.
- `site/scripts/content.ts`: Markdown AST / YAML 어댑터, 공개 경계, 링크·앵커·번역·메타데이터·목차 처리.
- `site/src/`: React 화면과 검색. 본문 데이터나 목차를 수동 입력하지 않는다.
- `site/dist/`: 배포 전용 자동 생성물. **이 디렉터리만** 업로드한다. 직접 편집하거나 commit하지 않는다.
- `site/.generated/report.json`: 공개 경로→URL, 의도적 제외와 이유, 경고·변환 오류, 복사한 자산 목록. 비공개 경로가 포함될 수 있으므로 배포하지 않는다.
- `site/dist/documents.json`: 공개 문서만 포함하는 대응표. `search.json`도 같은 공개 집합을 사용한다.
- `site/.server/`: 빌드 중 React 서버 렌더 모듈. 배포하지 않는다.

기존 `index.md`의 링크 발생 순서와 섹션 제목을 탐색에 사용한다. 파일을 추가하면 라우터를 수정하지 않아도 HTML과 검색이 생성된다. 기존 Scope index에 등록하지 않은 문서는 `NOT_IN_INDEX` 경고로 알리고 페이지는 생성한다. 현재 저장소에는 SUMMARY.md와 MDX가 없다. 새로운 목차 체계를 도입한다면 어댑터의 입력 정책부터 명시적으로 변경한다.

한국어 URL은 배포 base 다음에 언어 접두사 없이 `/knowledge/cloud/aws-ec2/`, 영어는 `/en/knowledge/cloud/aws-ec2/`로 생성한다. 일본어 등 다른 언어는 해당 언어 접두사를 사용한다. 원본 경로의 언어 구간을 제거하고 URL 앞에 배치하는 어댑터이며 원본 파일은 이동하지 않는다. 언어별 `index.md`는 디렉터리 URL(`/knowledge/`, `/en/knowledge/`)을 사용하고, 공통 목차 `knowledge/index.md`는 `/knowledge/index/`로 보존한다. `README.md`는 basename을 유지한다. 경로 각 구간은 URL 인코딩하며 실제 충돌은 빌드 오류다.

이전 `/docs/<원본 경로에서 .md를 뺀 값>/` 주소에는 동일 원본에서 자동 생성한 정적 본문을 제공한다. JavaScript가 꺼져 있으면 기존 주소와 query/anchor를 유지한 채 읽을 수 있고, 켜져 있으면 query/anchor를 그대로 새 주소에 전달한다. 이전 주소 페이지는 noindex이고 canonical과 sitemap에는 새 URL을 사용한다. `site/dist/redirects.json`은 공개 원본의 이전→새 주소 대응표다. 새 링크·검색·canonical·번역 링크는 모두 새 주소를 사용한다.

한글·공백·#·% 파일명, 상대 .md 링크, reference 링크/이미지, GitHub 방식 한글·중복 heading anchor를 테스트한다. 원본 위치 기준 상대 경로를 해석하고 배포 base를 한 번 붙인다. 잘못된 링크·앵커·중복 URL·중복 언어 pair는 빌드를 실패시킨다.

## 공개 정책과 안전한 렌더링

공개 대상은 root `index.md`, `README.md`, `log.md`와 `knowledge`, `glossary`, `decisions`, `experiments`, `failures`, `lessons`, `checklists`, `runbooks`, `policies` 아래 Markdown이다. 이는 사이트 정책이며 OKF 자체의 제외 기능은 아니다.

다음은 페이지·검색·공개 JSON에 넣지 않는다: 도구/설정/에이전트 파일, templates, 숨김 경로, private/internal/draft/drafts/secrets 경로, `status: draft`, `draft: true`, `private: true`, `publish: false`, `public: false`, `visibility: private|internal`. MDX는 실행하지 않고 제외한다. 심볼릭 링크는 탐색하지 않는다. 새 비공개 문서는 이 경계 밖에 보관하거나 위 표시를 적용한다. 공개로 선택한 원문의 비밀정보 여부는 작성자가 검토해야 한다. 이 필터가 임의의 자연어 비밀을 판별하는 DLP는 아니다.

원본에서 제외 문서로 향하는 링크는 게시 제외 상태로 표시하며 해당 문서 본문을 읽거나 복사하지 않는다. 첨부파일은 참조된 것 중 `assets`에 **개별 허용한 경로만** 복사한다. 기존 실험의 `result.json`, `reproduce.py`는 읽기 자료로 제공하며 Python을 웹에서 실행하지 않는다. 새 이미지·첨부는 콘텐츠 확인 후 허용 목록에 추가한다. SVG/HTML/JS 등 실행 가능한 첨부는 허용하지 않는다. 사이트 `public` 디렉터리나 저장소 전체를 복사하지 않는다.

임의 HTML은 실행/해석하지 않고 생략한다(`RAW_HTML_OMITTED`). GFM AST → rehype sanitize → 정적 코드 하이라이팅 순서로 처리한다. 위험한 URL은 실패한다. 위키 `[[...]]` 문법은 현재 원본에 없으며 새로 발견하면 명시적 미지원 오류로 보고한다. Mermaid는 코드 원문을 기본 표시하고 버튼을 누를 때만 라이브러리를 가져온다. strict 모드와 SVG 정화를 거친다. 렌더 실패 시 코드 원문이 남는다. 외부 Markdown 지침/코드는 빌드 명령으로 실행하지 않는다.

## 언어·날짜·검색

기본 홈 `/`는 한국어이고 `/en/`는 영어 홈이다(저장소 base 다음 기준). 화면 언어는 URL/문서 언어를 따르며 별도의 UI 언어 선택을 두지 않는다. 상단 한국어/English 링크는 같은 `concept_id`의 번역 문서로 이동하고, 홈에서는 해당 언어 홈으로 이동한다. 번역이 없으면 비활성 상태와 해당 언어 홈 링크를 표시한다. 본문 번역은 생성하지 않는다. 언어별 index는 대응 원본 경로로 연결하고 기존의 다른 언어도 보존한다. 검색 기본 필터·탐색·최근 문서는 현재 언어를 따른다. 한국어만 있는 변경 이력은 영어 화면에서 한국어임을 명시한다. 원본 안에 명시된 다른 언어 링크 자체는 유지한다. `translation.review_status`, `status`, `freshness.mode`, 기존 검증 기록을 보존하며 사이트 빌드는 verified를 만들지 않는다.

수정일은 유효한 `generated.at`와 실제 Git 마지막 변경 시각 중 최신 값이며 출처를 표시한다. 둘 다 없으면 미확인이다. Git 날짜 계산을 위해 CI는 전체 이력을 checkout한다. `log.md`는 지식 변경 이력이며 앱 변경 이력으로 사용하지 않는다.

검색은 필요한 때 한 번 다운로드하는 정적 `search.json`을 사용한다. Unicode NFKC·소문자 정규화, 공백 단위 AND 부분 문자열 검색이며 제목→태그→본문 순으로 점수를 준다. 한국어 `가상 서버`, 영어 `virtual server`, OIDC와 compute 태그를 실제 문서로 검증한다. 한국어 형태소 분석, 조사 제거, 동의어, 오타 교정은 지원하지 않는다. 결과는 상위 30개이며 모두 원본 대응 URL로 이동한다. 현재 규모에 맞는 방식이며 문서가 크게 늘면 분할 인덱스/검색 엔진을 별도로 검토한다.

## 사전 렌더와 배포

[React Router prerender](https://reactrouter.com/how-to/pre-rendering)를 검토했으나 런타임 라우팅이 필요 없는 문서 탐색이므로 [Vite SSR 기반 사전 생성](https://vite.dev/guide/ssr)을 사용한다. Vite 클라이언트 빌드 후 React `renderToString`을 **모든 공개 문서에 실행**하여 실제 본문 HTML을 저장한다. 일반 링크로 완전한 페이지를 탐색하고 검색·테마·복사 기능만 hydration한다. Vite SPA fallback은 사용하지 않는다.

```sh
SITE_BASE=/ SITE_ORIGIN=https://example.github.io bun run build
SITE_BASE=/ SITE_ORIGIN=https://example.github.io bun run test:e2e
SITE_BASE=/ bun run preview
# 프로젝트 하위 경로
SITE_BASE=/engineering-fieldbook/ bun run build
```

빌드·개발·미리보기·브라우저 테스트에 동일한 base를 사용한다. SITE_ORIGIN은 경로/마지막 슬래시가 없는 origin이다. canonical과 sitemap에 사용한다. 커스텀 도메인을 사용할 경우 GitHub Pages의 도메인/DNS 설정도 별도로 필요하다.

`.github/workflows/pages.yml`은 PR과 main 변경(문서만 변경되어도)에 audit/lint/typecheck/test/build/브라우저 검증을 수행한다. PR은 contents:read만 사용하며 배포 job을 실행하지 않는다. main 또는 main에서 수동 실행 시 검증 성공 산출물 `site/dist`를 [GitHub 공식 Pages 액션](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)으로 배포하도록 구성했다.

사용자 수동 설정: 변경 검토·commit/push, Settings → Pages → Source: GitHub Actions, 필요 시 Actions 변수 SITE_BASE/SITE_ORIGIN, github-pages 환경의 허용 브랜치/검토자. 저장소 공개 범위는 변경하지 않는다. 실제 원격 실행·배포는 이 작업의 검증 범위가 아니다.

## 검증 경계

`bun run verify`는 기존 문서 audit과 사이트 검증을 실행한다. audit의 외부 URL 목록은 이번 사이트 작업에서 외부 기술 사실이나 번역 의미까지 재검증했다는 뜻이 아니다. freshness 경고가 발생하면 기존 최신화 절차를 따르고 날짜를 자동 연장하지 않는다.

브라우저 테스트는 SPA fallback 없는 Bun 정적 서버에서 전체 공개 문서와 내부 링크의 HTTP 응답/앵커, 대표 문서의 JavaScript 비활성 읽기, 검색·언어 전환·404·코드 복사·Mermaid를 확인한다. 375/768/1440px와 라이트/다크 홈·문서 캡처는 `site/.generated/screenshots`에 생성한다. Chromium 검증이며 Safari/Firefox, 실제 GitHub Pages 도메인과 원격 Actions 실행은 별도 확인이 필요하다.

원시 HTML 노드는 제목·설명·검색 데이터 생성 전에 제거합니다. 외부 URL 이미지는 인라인/참조 문법 모두 빌드 오류로 처리합니다. 이미지는 검토한 로컬 자산만 허용하며 외부 문서로의 일반 링크는 허용합니다.

사이드바의 전체 문서 지도는 기존 root index로 연결되어 결정·실험·체크리스트·운영·정책 문서 탐색을 보존한다. 영어 화면에서는 이 지도가 한국어 원문임을 표시한다.

GitHub Pages는 없는 주소마다 공통 `404.html` 하나를 반환한다. JavaScript가 켜져 있으면 요청 URL의 언어를 읽어 오류 화면·홈·검색 언어를 맞추며 HTTP 404와 주소를 유지한다. JavaScript가 꺼져 있으면 언어별 404를 선택할 수 없어 공통 한국어 안내와 별도의 영어 안내·영어 홈 링크를 표시한다. 정상 문서의 언어별 정적 HTML에는 이 제한이 없다.

## 전체 목차와 학습 경로

사이드바는 언어별 Knowledge index의 주제 순서를 유지하고 각 영역의 index에서 문서를 가져옵니다. 현재 문서의 영역을 펼치며 접힘 상태와 스크롤은 base·언어별 sessionStorage에 보존합니다. 저장소 접근이 차단되어도 기본 탐색은 동작합니다. 용어집과 전체 문서 지도에서 다른 문서 종류를 탐색합니다.

학습 경로는 원본 index의 `## 학습 순서`(영어 `## Reading order`) 아래 순서 목록의 링크를 AST로 읽어 생성합니다. 목록 안의 링크 순서가 기준이며 일반 주제 목차 순서와 분리합니다. 중복·누락·게시 제외·다른 언어 단계는 검증 오류입니다. 새로운 학습 경로도 이 규칙으로 추가하며 React에 문서 목록을 복제하지 않습니다. 한·영 목록은 같은 의미와 순서를 유지합니다.

선택한 경로는 `?path=`에 저장하고 경로 내 문서·번역·이전/다음 링크에 전달합니다. 직접 접근하거나 유효하지 않은 경로는 선택 안내를 표시합니다. 번호는 읽기 순서이며 학습 완료율이 아닙니다. canonical과 sitemap은 쿼리가 없는 기존 URL을 유지합니다. JavaScript 없이 전체 트리와 원본 순서 목록을 읽을 수 있으며, 쿼리 기반 경로 선택과 이전/다음 안내는 hydration 후 제공됩니다.
