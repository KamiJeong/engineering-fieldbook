# 사이트 디자인 토큰과 읽기 UI

이 문서는 `site/` 표현 계층을 수정하는 개발자를 위한 안내입니다. 기술 지식 원본이나 배포 자산이 아니며, 실행·배포 명령은 [사이트 운영](README.md)을 따릅니다.

## 토큰 사용

[원시 팔레트와 의미 토큰](src/tokens.css)을 [일반 CSS](src/style.css)에서 가져옵니다. 이슈 #3의 Kami 참고 자료에서 primary/secondary/accent/neutral 50–950 값을 옮겼습니다. Tailwind 전용 지시문·외부 폰트·새 UI 라이브러리는 사용하지 않습니다.

컴포넌트에는 `--fb-surface`, `--fb-foreground`, `--fb-accent`처럼 역할이 드러나는 변수를 사용합니다. 테마 색을 바꿀 때는 `tokens.css`의 light/dark 의미 매핑을 함께 수정합니다. 원시 팔레트를 바꾸면 해당 색을 참조하는 모든 역할에 영향을 줍니다.

| 기존 변수   | 의미 토큰               | 역할               |
| ----------- | ----------------------- | ------------------ |
| `--bg`      | `--fb-background`       | 페이지 배경        |
| `--panel`   | `--fb-surface`          | 카드·대화상자 표면 |
| `--text`    | `--fb-foreground`       | 일반 글자          |
| `--muted`   | `--fb-muted-foreground` | 보조 **글자**      |
| `--soft`    | `--fb-muted`            | 보조 **배경**      |
| `--line`    | `--fb-border`           | 장식적 구분선      |
| `--accent`  | `--fb-accent`           | 본문 링크·강조     |
| `--sidebar` | `--fb-sidebar`          | 탐색 배경          |
| `--focus`   | `--fb-ring`             | 포커스 윤곽        |

`--fb-secondary`는 앰버 브랜드 강조입니다. 일반 보조 버튼은 surface·outline을 사용하며, 앰버 액션에는 `--fb-secondary-foreground`의 어두운 글자를 짝지어 사용합니다. 틸 액션은 `--fb-accent-foreground`와 짝을 이룹니다. 다크의 primary는 밝은 색이므로 고정 네이비 패널에는 `--fb-brand-surface`와 `--fb-brand-foreground`를 사용합니다. 해당 패널의 포커스 윤곽은 `--fb-brand-label`입니다.

`--fb-border`는 장식용입니다. 입력·버튼의 식별에 필요한 테두리는 `--fb-input`을 사용합니다. warning/error는 문구와 함께 표시하며 색만으로 상태를 전달하지 않습니다. 코드 하이라이터는 유지하고 `--fb-code-*`를 통해 문법 종류별 색을 두 테마에서 구분합니다. 모든 코드 토큰을 단일 글자색으로 덮지 않습니다.

치수는 컨트롤 44px, 곡률 10/16/24px, 본문 16px/1.75, 읽기 폭 최대 46rem입니다. 전환은 120/180/240ms이며 `prefers-reduced-motion`에서는 0ms입니다. 전체 shell에 본문 폭 제한을 걸지 않습니다.

## 화면 구성과 보존 경계

- `App.tsx`: 짧은 홈 소개 → 기존 `learningPaths`의 시작 안내 → 원본 순서의 주제 → 실제 공개 문서의 수정일 목록입니다. 학습 순서와 문서 수를 완료율로 해석하지 않습니다.
- 문서의 첫 H1까지 원래 HTML을 유지하고 그 아래에 언어·수정일을 삽입합니다. 본문·ID·각주·번역·출처는 원본에서 생성한 값을 사용합니다. 원본 경로는 ‘문서 정보와 출처’에서 확인합니다.
- `Sidebar.tsx`: 기존 트리와 sessionStorage 상태를 유지합니다. 640px 이하에서는 hydration 후 drawer가 열리며 배경을 inert로 만들고 포커스를 안에서 순환시킵니다. Escape·바깥 배경·상단 닫기로 닫고 트리거에 포커스를 돌려줍니다. JavaScript가 없으면 기본 details 탐색을 읽을 수 있습니다.
- 1200px 이하에서는 오른쪽 목차를 본문 상단 details로 전환합니다. 코드·표는 자신의 컨테이너에서 가로 스크롤합니다. 페이지 넘침을 숨기기 위한 `overflow-x: hidden`은 사용하지 않습니다.
- 검색은 기존 정적 인덱스·검색 함수를 사용합니다. 방향키는 검색창과 결과 사이를 이동하며 Tab·Escape도 지원합니다. loading/error/retry/empty 상태를 구분합니다.
- Mermaid는 요청 시에만 불러오며 strict 모드와 SVG 정화를 유지합니다. 확대 대화상자와 닫기 후에도 코드 원문이 남습니다. 이미 렌더된 SVG는 생성 당시의 배경색을 유지해 테마 변경 후에도 대비를 보존합니다. 닫고 다시 생성하면 현재 테마를 적용합니다.
- 초기 테마 스크립트는 저장값이 없거나 읽을 수 없을 때 시스템 설정을 따릅니다. 테마 아이콘도 CSS의 `data-theme`로 선택해 hydration 전후의 표시를 맞춥니다.

Markdown 원본, URL/base, 번역 pair, 학습 순서, 생성·서빙 방식과 공개 정책은 유지합니다. 초기 테마 스크립트의 저장소 실패 처리만 빌드 템플릿에서 보완합니다. 참고 토큰 파일을 배포하지 않고 `site/dist`만 배포하는 경계도 동일합니다.

## 검증과 화면 기록

`bun run verify`로 audit·lint·typecheck·단위 테스트·빌드·Chromium 테스트를 실행합니다. `SITE_BASE=/`로 빌드와 E2E도 실행한 뒤 기본 base로 다시 빌드합니다. 원격 배포 성공이나 문서 기술 사실의 검증을 의미하지 않습니다.

`site/e2e/site.spec.ts`는 홈과 Subnet 문서를 375/768/1440px × KO/EN × light/dark로 캡처합니다. 결과는 `site/.generated/screenshots/project/` 또는 `root/` 아래에 저장됩니다. `redesign.spec.ts`는 320px, 대비, drawer 포커스, 검색 상태, Mermaid 확대·닫기, storage 실패, JavaScript 없는 탐색과 앵커를 확인합니다. 캡처 생성 후 실제 이미지를 열어 간격·잘림·색상·본문을 별도로 확인해야 합니다.

테스트 중 생성한 `.generated`·`dist`·`.server`·브라우저 추적 파일은 커밋하거나 별도 공개하지 않습니다. 토큰이나 레이아웃을 바꾼 뒤에는 두 언어와 두 테마에서 같은 조합을 다시 확인합니다.
