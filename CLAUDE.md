# Design Ready - Figma File Health Check & Semantic Naming Plugin

## 프로젝트 개요
Figma 파일의 구조적 품질을 자동 체크하고, 레이어 네이밍을 시맨틱하게 자동 변환하는 Figma 플러그인.
Design-to-Code 파이프라인(MCP 연동)의 입력 품질을 보장하는 것이 핵심 목표.

## 핵심 가치
- Figma → MCP → Code 변환 시 일치율 향상
- 파일의 코드 변환 준비도를 정량화
- 디자인 핸드오프 품질 표준화

---

## 기능 구조 (3개 탭)

### Tab 1: Health Check (파일 헬스체크)
파일 전체를 스캔하여 구조적 문제를 리포트

**체크 항목:**
- [ ] 디폴트 네이밍 감지 ("Frame", "Group", "Rectangle", "Vector" 등)
- [ ] 오토레이아웃 미적용 프레임 감지
- [ ] 디태치된 LDS 컴포넌트 인스턴스 감지
- [ ] 로컬 스타일 vs LDS 토큰 불일치 감지 (컬러, 타이포)
- [ ] 불필요한 그룹 중첩 (depth 3 이상)
- [ ] 히든 레이어 감지
- [ ] 빈 프레임 감지

**아웃풋:**
- 이슈 리스트 (severity: 🔴 critical / 🟡 warning / 🔵 info)
- 전체 스코어 (100점 만점)
- 카테고리별 통과율

### Tab 2: Semantic Naming (시맨틱 네이밍 자동화)
레이어 이름을 시맨틱하게 자동 변환

**Phase 1 - 룰 기반 변환 (AI 미사용):**
- 위치 + 크기 + 속성 패턴 매칭
- LDS 컴포넌트 인스턴스 → 컴포넌트 이름 자동 반영
- 배경 역할 Rectangle → "Background"
- 아이콘 역할 Vector/SVG → "Icon/{추론된이름}"

**Phase 2 - AI 기반 시맨틱 추론:**
- 주변 노드 컨텍스트 분석
- 화면 구조 패턴 인식 (Header, Content, Footer, Modal, BottomSheet 등)
- LDS 컴포넌트 마크다운(Button.md 등) 참조하여 정확한 네이밍
- 네이밍 컨벤션: PascalCase, 슬래시(/) 계층 구분

**UX 플로우:**
1. 스캔 실행
2. 변환 제안 리스트 표시 ("Frame 237" → "Header/NavigationBar")
3. 개별 승인 / 전체 일괄 적용 선택
4. 적용 완료 리포트

### Tab 3: Code Readiness (코드 변환 준비도)
이 파일을 MCP로 넘겼을 때 예상 코드 변환 정확도를 평가

**평가 항목 (가중치 기반 스코어링, 2026 모델 시대 잠정 v2):**
> 기준: "모델이 추론으로 복구 가능한 정보인가, 영구 소실인가". 디태치/토큰 해제는 비가역 손실이라 상향, 네이밍/깊이는 모델이 상당 부분 복구하므로 하향. 실측 캘리브레이션(정제 전/후 동일 MCP 비교) 후 확정 예정.
- 디자인 시스템 컴포넌트 인스턴스 유지율 (30%) — 디태치 시 원본 컴포넌트 정체성이 영구 소실 (비가역)
- 스타일 토큰 연결률 (25%) — 하드코딩 값에서 토큰 역매핑은 추측, 바인딩만이 사실
- 시맨틱 네이밍 비율 (20%) — 모델이 시각·구조 컨텍스트로 상당 부분 복구 가능
- 오토레이아웃 적용률 (20%) — flex는 추론되나 반응형 의도(hug/fill)는 복구 불가
- 구조 깊이 적정성 (5%) — 쓰레기 중첩은 모델이 대부분 자동 평탄화

**아웃풋:**
- Code Readiness Score (100점 만점, 원형 게이지)
- 항목별 점수 브레이크다운
- "이 항목을 고치면 +N점" 형태의 개선 가이드
- Before/After 예상 코드 미리보기 (Phase 3)

---

## 기술 구조

### Figma Plugin Architecture
```
design-ready-plugin/
├── CLAUDE.md              # 이 파일
├── manifest.json          # Figma 플러그인 매니페스트
├── package.json
├── tsconfig.json
├── src/
│   ├── code.ts            # 메인 플러그인 로직 (Figma API 접근)
│   ├── ui.tsx             # UI 레이어 (iframe)
│   ├── analyzers/
│   │   ├── healthCheck.ts     # 헬스체크 분석 로직
│   │   ├── semanticNaming.ts  # 시맨틱 네이밍 룰 엔진
│   │   └── codeReadiness.ts      # 코드 변환 준비도 분석
│   ├── rules/
│   │   ├── namingRules.ts     # 네이밍 컨벤션 룰 정의
│   │   ├── layoutRules.ts     # 오토레이아웃 관련 룰
│   │   └── styleRules.ts      # 스타일/토큰 관련 룰
│   ├── ai/
│   │   └── semanticInfer.ts   # AI 기반 시맨틱 추론 (Phase 2)
│   ├── types/
│   │   └── index.ts           # 타입 정의
│   └── utils/
│       ├── nodeTraversal.ts   # Figma 노드 트리 탐색 유틸
│       └── scoring.ts         # 스코어 계산 로직
└── design-system/
    └── (기존 LDS 파운데이션 참조)
```

### 핵심 기술 결정
- **언어:** TypeScript
- **번들러:** esbuild (UX Review 플러그인과 동일)
- **UI 프레임워크:** Preact 또는 vanilla (경량 유지)
- **AI 호출:** figma.fetch()를 통한 API 호출 (CORS 우회, UX Review에서 검증된 패턴)
- **AI Provider:** Anthropic Claude API (1차), 추후 GenAI Gateway 연동

### Figma API 핵심 사용 포인트
```typescript
// 노드 트리 탐색
figma.currentPage.selection  // 선택 영역만 스캔
figma.currentPage.children   // 페이지 전체 스캔

// 노드 속성 접근
node.name                    // 레이어 이름
node.type                    // FRAME, GROUP, COMPONENT, INSTANCE 등
node.layoutMode              // AUTO_LAYOUT 여부 (HORIZONTAL, VERTICAL, NONE)
node.children                // 자식 노드
node.componentPropertyReferences  // 컴포넌트 바인딩 정보

// 컴포넌트 관련
node.mainComponent           // 인스턴스의 원본 컴포넌트
node.mainComponent.name      // 원본 컴포넌트 이름

// 스타일 관련
node.fillStyleId             // 적용된 fill 스타일 ID
node.textStyleId             // 적용된 텍스트 스타일 ID
node.effectStyleId           // 적용된 이펙트 스타일 ID

// 이름 변경 (쓰기)
node.name = "Header/NavigationBar"  // 레이어 이름 변경
```

---

## 시맨틱 네이밍 룰 (Phase 1 룰 기반)

### 위치 기반 추론
| 조건 | 추론 이름 |
|------|-----------|
| 최상단 + 가로 full width + height 44~56px | Header |
| 최하단 + 가로 full width + height 49~83px | BottomNavigation |
| 하단 고정 + primary color + 버튼 형태 | FloatingCTA |
| 전체 화면 + 반투명 배경 위 | Modal / BottomSheet |

### 속성 기반 추론
| 조건 | 추론 이름 |
|------|-----------|
| Rectangle + 부모와 동일 사이즈 | Background |
| Vector/SVG + 24x24 이하 | Icon |
| Text + fontSize 20+ + fontWeight bold | Title |
| Text + fontSize 14 이하 + 회색 계열 | Caption |
| 인스턴스 + mainComponent 존재 | {mainComponent.name} |

### 네이밍 컨벤션
- 계층 구분: `/` (슬래시)
- 케이스: PascalCase
- 예시: `Header/NavigationBar/BackButton`, `Content/CardList/Card/Thumbnail`

---

## 개발 우선순위

### Phase 1 (MVP) - 2~3일
1. 프로젝트 셋업 (manifest, 빌드 파이프라인)
2. Health Check 탭 - 기본 체크 항목 구현
3. 디폴트 네이밍 감지 + 룰 기반 변환 제안
4. 결과 UI (이슈 리스트 + 스코어)

### Phase 2 - 추가 3~4일
5. Semantic Naming 탭 - 승인/적용 플로우
6. Code Readiness 탭 - 변환 준비도 스코어링
7. AI 기반 시맨틱 추론 연동

### Phase 3 - 고도화
8. 커스텀 룰 설정 (팀별 컨벤션 대응)
9. Before/After 리포트 생성
10. LDS 컴포넌트 마크다운(Button.md 등) 연동

---

## 참고 컨텍스트
- UX Review 플러그인 레포: https://github.com/Hyojin-Kwon/ux-review-plugin
- 기존 design-system/ 디렉토리의 CLAUDE.md, MASTER.md 참조
- LDS 파운데이션: CSS 변수 (color, typography, spacing), 1,500+ SVG 아이콘
- figma.fetch() 패턴: code.ts에서 외부 API 호출 → iframe UI로 결과 전달
