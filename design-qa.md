---
type: Design QA Record
title: 열린 기록 로고 적용 QA
---

# 열린 기록 로고 적용 QA

- source visual truth: `artifacts/logo-implementation/selected-reference.png` (승인된 수정 시안, 1254×1254 디자인 보드)
- implementation: `artifacts/logo-implementation/local/home-375-ko-light.png`, `home-375-en-dark.png`, `home-1440-ko-light.png`
- focused regions: `artifacts/logo-implementation/local/logo-1440-ko-light.png`, `logo-1440-en-dark.png`
- viewport: 375/768/1440 × 900 CSS px, Chromium, DPR 1. 한·영 × 라이트·다크 12개 상태.
- normalization: 원본은 페이지가 아닌 로고 보드입니다. 전체 페이지의 레이아웃 일치를 주장하지 않습니다. 보드의 가로 로고와 작은 적용 예시를 기준으로 헤더 로고를 비교했습니다. 생성한 3:1 마스터를 720×240 WebP로 인코딩했고, 표시 상자는 데스크톱 180×40, 모바일 156×36 CSS px입니다. object-fit: cover로 바깥 배경 여백만 제외하며 심볼·글자는 잘리지 않습니다.

## Findings

현재 actionable P0/P1/P2 없음.

- Typography: 승인한 워드마크를 이미지에 포함해 사용합니다. 운영체제별 대체 글꼴로 Fieldbook 로고가 바뀌지 않습니다. 본문의 글꼴·언어별 제목은 기존 화면을 유지합니다.
- Spacing/layout: 열린 페이지와 워드마크 사이 간격, 작은 책갈피, 아래 열린 선이 보입니다. 헤더 검색·언어·테마 조작 영역과 겹치지 않으며 검사한 폭에서 가로 넘침이 없습니다.
- Colors/tokens: 라이트 네이비/골드, 다크 흰색/골드입니다. 흰색과 검은색 배경 마스터를 multiply/screen으로 합성해 기존 헤더 표면에 표시합니다. 캡처에서 배경 사각형이나 테두리 얼룩이 보이지 않습니다.
- Asset fidelity: 실제 생성 이미지 사용. SVG/CSS 도형으로 대체하지 않았습니다. 작은 책갈피와 열린 페이지 형태를 보존했습니다. 첫 추출본의 가짜 투명 체크 패턴은 사용하지 않았고 배경이 균일한 이미지로 다시 생성했습니다.
- Content: 로고 전체를 누르면 현재 언어의 홈으로 이동하며 접근 가능한 이름은 Engineering Fieldbook · 홈/Home입니다. 이미지 두 장은 장식용 빈 alt를 사용해 중복 낭독하지 않습니다.

## Comparison history

1. 자산 준비 중 체크 패턴이 남은 첫 추출본 거부. 라이트/다크 마스터 재생성 후 헤더에 배치했습니다.
2. 원본 보드와 모바일 한글 라이트·영어 다크 전체 캡처를 같은 비교 입력에서 열었습니다. 별도로 데스크톱 양 테마 로고 영역도 확인했습니다. 제품 화면에서 수정이 필요한 P0/P1/P2 차이를 찾지 못했습니다.

## Implementation checklist

- [x] 승인한 로고의 한·영/라이트·다크 적용
- [x] 해상도·WebP 용량 최적화 (두 파일 약 107KiB)
- [x] 12개 홈 상태의 이미지 로딩·가로 넘침·제목·메타 설명 검사
- [x] 문서에서 브랜드 링크를 통한 언어별 홈 복귀
- [x] 전체/로고 영역 캡처 직접 확인

## Follow-up polish / limits

생성 이미지의 미세 윤곽은 원본 보드와 픽셀 단위 동일성을 보장하지 않습니다. 매우 큰 인쇄용 벡터 원본이나 파비콘은 이번 범위에 포함하지 않습니다. Safari/Firefox, 스크린리더와 실제 터치 기기는 별도 확인이 필요합니다.

final result: passed

배포: f0e726d, Pages 실행 https://github.com/KamiJeong/engineering-fieldbook/actions/runs/34437790807 성공. 전체 verify는 단위 18개·브라우저 41개 통과했습니다. 공개 주소의 12개 화면 상태와 이미지 로딩·브랜드 홈 복귀 및 실제 테마 전환도 통과했습니다. pageerror 없음. `artifacts/logo-implementation/live/` 참고.
