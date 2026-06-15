# LINE Design System (LDS) — Reference

LDS 컴포넌트 · 네이밍 규칙 · 디자인 토큰 전반 레퍼런스. Claude로 UI 생성 시 이 문서와 `foundation/*.css`를 함께 주면 LDS 스타일에 맞는 결과를 얻습니다.

- **출처**: LDS — iOS Component Naming Structure Review (2019.12.10) + LINE Design System 팀 라이브러리
- **등록된 컴포넌트**: 4,776개 (모두 퍼블리시 key 포함, `src/data/ldsComponents.json`)
- **디자인 토큰** (Figma Variables 내보내기):
  - [`foundation/line-colors.css`](foundation/line-colors.css) — 프리미티브 컬러
  - [`foundation/semantic-colors.css`](foundation/semantic-colors.css) — 시맨틱 컬러 (Light/Dark)
  - [`foundation/typography.css`](foundation/typography.css) — 폰트 (iOS/Android/Web × Locale)
  - [`foundation/object-styles.css`](foundation/object-styles.css) — radius, spacing, stroke

---

## 1. 네이밍 컨벤션 (요약)

| # | 규칙 |
|---|------|
| 1 | 최상위 컴포넌트는 **3자리 숫자 prefix**로 구분 — 예: `101 Button`, `206 Card` |
| 2 | 계층 구분자는 **`' / '`** (앞뒤 공백 포함) — PascalCase 아닌 공백 + 대문자 |
| 3 | 방향 + 이름 조합은 **`.`** 사용 — 예: `Left . Icon Button` |
| 4 | 요소 조합은 **`+`** — 예: `Title + Description + Button` |
| 5 | On/Off 상태는 **`- On`**, **`- Off`** suffix — 예: `Home - On` |
| 6 | 배경 모드는 **`Light BG`**, **`Dark BG`**, **`Overlay`**, **`Common`**로 분기 |
| 7 | 약어 지양 — `Image`(Img 금지), `Button`(btn 금지), `Navigation`(Navi 금지). 예외: `Background → BG` |
| 8 | Overrides 전용 심볼은 **`x / ...`** prefix |

---

## 2. Top-level Components (PDF 기준 16종)

### 100번대 — Single Components

| ID | 이름 | 설명 |
|----|------|------|
| 101 | Button | 단일/더블/플로팅/아이콘 버튼 |
| 109 | Video Player | Full View / Module 모드 |
| 110 | Input | Text field / Code field |
| 111 | Dialog | Snackbar (Top/Bottom) |
| 114 | Message | Sender/Receiver, Service Label, Map Pin, Media 등 |
| 115 | Flex Message | 메신저 Flex 메시지 |
| 116 | List Header | Small / Medium / Large, Filter |

### 200번대 — Combined Components

| ID | 이름 | 설명 |
|----|------|------|
| 201 | Top Navigation | Navy 기준 좌우 Icon/Text Button, Title |
| 202 | Bottom Navigation | Home / Chats / Timeline / News / Wallet / Friends / Calls / More |
| 203 | Tab | Text / Icon Button / Box |
| 204 | List | 리스트 아이템 조합 |
| 205 | Image Grid | Small / Medium / Large |
| 206 | Card | Image / Rectangular |
| 208 | Empty | Text/Image × Fullpage/Module 조합 |
| 209 | Popup | Text / Image / Progress |
| 210 | Chips | Filter Chip 등 |

---

## 3. Variant Modifiers

### Color
`Primary Green` · `Secondary Navy` · `Secondary Black` · `Destructive Red` · `Retreative Light` · `Primary White` · `Navigation Outline`

### Size
`Small` · `Medium` · `Large` (경우에 따라 `XSmall`, `XLarge`)

### Background
`Light BG` · `Dark BG` · `Overlay` · `Common`

### State
`On` · `Off` · `Active` · `Inactive` · `Selected` · `Unselected` · `Default`

---

## 4. 공통 Sub-pattern

- `Button / Single Button`, `Button / Double Buttons`, `Button / Floating`, `Button / Icon`
- `Input / Text field`, `Input / Code field`
- `Dialog / Snackbar`
- `Popup / Text`, `Popup / Image`, `Popup / Progress`
- `Top Navigation / Navy`, `.../ Title`, `.../ Left - Icon Button`, `.../ Left - Text Button`
- `Bottom Navigation / {Home|Chats|Timeline|News|Wallet|Friends|Calls|More}`
- `Tab / Text`, `Tab / Icon / Button`, `Tab / Box`
- `List Header / {Small|Medium|Large}`, `.../ List Filter`
- `Message / {Receiver|Sender}`, `.../ Service Label`, `.../ Map Pin`, `.../ Play Button`, `.../ {GIF|Live|Video}`
- `Card / {Image|Rectangular}`
- `Empty / {Text|Image} / {Fullpage|Module}`
- `Chips / Filter`
- `Video Player / {Full View|Module}`
- `Image Grid / {Small|Medium|Large}`

---

## 5. Figma 라이브러리 어휘 — 그룹별 요약

전체 4,776개 중 상위 prefix 기준 분포:

| 개수 | Prefix |
|-----:|--------|
| 1,849 | Android |
| 1,808 | IOS |
|   162 | Common |
|   159 | x (Overrides 전용) |
|    69 | Brand |
|    44 | And |
|    35 | Icon |
|    25 | iOS |
|    24 | 🌐 Icon |
|    21 | Profile |
|    15 | 303 Chat |
|    11 | banner |
|    11 | Overrides |
|    10 | Keyboards |
|     9 | Icons |
|     9 | Views |
|     8 | Button |
|     7 | Empty Sheet |
|     7 | Private |
|     6 | Badge |
|     5 | 004 Status Bar |

### Android 세부 분포 (상위)
| 개수 | 2nd level |
|-----:|-----------|
|  355 | Android / Light |
|  345 | Android / Icon |
|  296 | Android / Dark |
|  183 | Android / Box |
|  121 | Android / Right Area |
|   47 | Android / Text |
|   40 | Android / Linear |
|   38 | Android / Text Area |
|   37 | Android / Left Area |
|   37 | Android / Smart CH |

### IOS 세부 분포 (상위)
| 개수 | 2nd level |
|-----:|-----------|
|  536 | IOS / Light |
|  434 | IOS / Dark |
|  125 | IOS / Overlay |
|  102 | IOS / Right Area |
|   54 | IOS / 303-2 |
|   50 | IOS / 303-7 |
|   40 | IOS / Linear |
|   37 | IOS / Smart CH |
|   36 | IOS / Icon |
|   28 | IOS / Large |

---

## 6. 대표 경로 예시

**플랫폼/테마/역할** 3차원이 공통적으로 붙음:

```
IOS  / Light / Icon Button / Solid / Active / Album
Android / Dark / Icon / Chat
Android / Overlay / Icon Button / Stroke / Inactive / Setting
IOS / Light / Badge / BG / Logo Small
IOS / Text Area / Light / Title 1 + Body 1 + Caption 1
Android / Right Area / Dark / Buttons / Icons / Like - ON
202 Bottom Navigation / 1. Home - On
101 Button / 1. Single button / Text / 1. Primary Green / Large / Direct Button
```

---

## 7. 네이밍 자동화에서의 활용

### 룰 기반 매칭
디태치 의심 프레임(`FRAME + 자식 ≥1 + 이름이 컴포넌트 컨벤션 + 조상도 LDS 아님`)은 토큰 자카드 유사도로 이 어휘에서 best match 탐색 (임계값 35%, 플랫폼/테마 불일치 페널티 적용).

### AI 프롬프트 주입
4,776개 전부를 Claude에 보내면 토큰 낭비라 **depth 1~3 unique prefix + 남는 슬롯에 전체 경로 균등 샘플**로 최대 250개만 요약 주입. 실제 매칭은 full list 기준.

### 교체
매칭된 후보의 `key` (퍼블리시 key)로 `figma.importComponentByKeyAsync` 호출 → 같은 위치·인덱스에 인스턴스 생성 → 기존 디태치 프레임 제거. 단 오버라이드는 유실.

---

## 8. 갱신 절차

LDS 라이브러리 업데이트 시 vocabulary를 현행화하는 법:

1. LDS 원본 파일 열기 (퍼블리시 권한 있는 사용자)
2. 메뉴 → Libraries → Publish (또는 Update)
3. 플러그인 설정 탭 → "현재 파일에서 LDS 컴포넌트 추출"
4. 클립보드 복사 → `src/data/ldsComponents.json`에 덮어쓰기
5. `npm run build` → 배포

INSTANCE 기반 추출(일반 작업 파일)도 가능하며, 결과는 기존 어휘에 **자동 병합**됩니다.

---

## 9. 디자인 토큰 — 주요 네이밍 규칙

`foundation/*.css`의 CSS 변수는 다음 컨벤션을 따릅니다:

### Primitive Colors (`line-colors.css`)
- `:root`에 선언 (테마 무관)
- `--{category}-{name}`: `--neutral-colors-linegray600`, `--brand-colors-linegreen-ios`
- 플랫폼 suffix: `-ios`, `-android` (브랜드 그린처럼 플랫폼별 hex 다른 경우)

### Semantic Colors (`semantic-colors.css`)
- `[data-theme="Light"]`, `[data-theme="Dark"]` 블록에 선언 → **HTML 루트에 `data-theme` 설정** 필요
- `--{domain}-{role}-{variant?}-{platform?}`: `--brand-colors-primaryfill-ios`, `--neutral-fill-primary-background`
- 플랫폼별 값이 다른 경우 `-ios` / `-android` suffix

### Typography (`typography.css`)
- `[data-locale="EN"]`, `[data-locale="JP"]` 등 **locale 블록** — 언어별 폰트 다름
- 종류:
  - `--font-family-font-family-{display|text}-{platform}`: `SF Pro Display`, `Roboto` 등
  - `--font-size-{platform}-font-size-{display|text}-{NN}`: `16px` 등
  - `--font-weight-{platform}-font-weight-{regular|bold|...}`: `400`, `700`
  - `--line-height-{platform}-line-height-{NN}`: px 값
- HTML에 `data-locale="EN"` 설정 필요

### Object Styles (`object-styles.css`)
- `:root`에 선언 — 테마/플랫폼 무관
- `--radius-radius-{N}`: `4px`, `8px`, `12px` 등
- `--spacing-spacing-{N}`: `2px` ~ `56px`
- `--stroke-stroke-{ui|icon}-{N}`: `0.5px`, `1px`, `1.7px` 등

---

## 10. Claude에 컴포넌트 생성 요청 시 프롬프트

### 첨부 파일
1. `design.md` (이 문서)
2. `foundation/line-colors.css`
3. `foundation/semantic-colors.css`
4. `foundation/typography.css`
5. `foundation/object-styles.css`
6. (선택) 대표 스크린 PNG 2~3장

### 프롬프트 템플릿

```
첨부된 design.md는 LINE Design System의 네이밍/컴포넌트 레퍼런스이고,
foundation/*.css는 실제 디자인 토큰입니다.

아래 규칙을 지켜 React + Tailwind CSS로 화면을 구현해주세요:

1. 플랫폼: iOS (Light 테마, Locale EN)
2. HTML 루트에 data-theme="Light" data-locale="EN" 설정
3. 모든 색/폰트/spacing은 foundation 토큰(CSS 변수)만 사용
   - 하드코딩된 hex/px 금지
   - Tailwind arbitrary value로 `bg-[var(--...)]` 식 사용
4. 레이어/컴포넌트 이름은 design.md의 네이밍 컨벤션 준수
   - ' / ' 구분자, 숫자 prefix 유지
   - 예: "202 Bottom Navigation / Home - On"
5. 4,776개 LDS 컴포넌트 목록은 design.md의 통계 참조 — 해당 이름이 있으면 그대로 사용

요청: {여기에 화면 설명}

출력:
- 레이어 구조 트리 (LDS 네이밍)
- 작동하는 React 컴포넌트 1개 (단일 파일, Tailwind arbitrary value 사용)
- 사용한 토큰/컴포넌트 매핑 표
```

### 예시 요청
- "iOS 친구 목록 화면 (상단 검색바, 친구 섹션, 하단 탭)"
- "Dark 테마 채팅 상세 (상단 네비, 메시지 버블, 하단 입력바)"
- "Android Light 세팅 화면 (헤더, 리스트 섹션 3개)"

토큰 값이 context에 들어가므로 Claude가 실제 LINE Green(`#06C755` iOS / `#4CC764` Android) 등을 정확하게 사용합니다.
