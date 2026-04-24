# 세션 핸드오프 노트

**마지막 세션:** 2026-04-24 (금)
**다음 세션 예정:** 2026-04-27 (월) — 회사 컴퓨터

---

## 오늘 커밋한 것 (`fd32f9d`)

1. **LDS 매칭 튜닝** — `src/ai/ldsMatch.ts`
   - `단어+숫자` 인접 합성 토큰 (`title 1` → `title1`, `size 12` → `size12`) — 사이즈/레벨 suffix가 구분 신호로 살아남음
   - 내부 clamp 제거 — 테마/플랫폼 페널티가 bonus 적층에 묻혀 dark↔light 구분이 무력화되던 이슈 수정. 최종 반환 시에만 clamp.

2. **dynamic-page documentAccess 대응**
   - `manifest.json`의 `documentAccess: "dynamic-page"` 때문에 동기 `instance.mainComponent` getter 금지 → `getMainComponentAsync()`로 전환
   - 영향: `semanticNaming.ts` (suggestFromInstance/suggestFromAutoLayout), `conversionSerialize.ts` (describeComponentRef), `code.ts` (runScan) 체인 async화

3. **LDS 템플릿 카탈로그** (신규 기능)
   - `extractLdsTemplateCatalog()` — 템플릿 파일 전체 COMPONENT/COMPONENT_SET 스캔, 이름+key+variantProperties 캡처
   - `clientStorage` 키 `design-ready-lds-template-catalog`에 캐싱 → 작업 파일에서 자동 매처 풀 주입
   - Settings 탭에 캐시 상태/재추출/삭제 버튼

4. **Export Pack 품질 개선**
   - `esbuild.config.mjs`에 build step 추가 — `foundation/*.css`에서 `--var` 이름 추출 → `src/data/foundationTokens.generated.ts` 생성 (gitignored)
   - Pack에 `foundation/` CSS 번들 + PROMPT.md에 "사용 가능한 디자인 토큰" 섹션 (543개 토큰 파일별 그룹핑)
   - 시스템 프롬프트 3개 규칙 추가: `DESIGN TOKENS` (리터럴 금지, `var(--)`만) / `COMPONENT VARIANTS` (카탈로그 variant만) / `MODIFICATION RULES` (팔로업 수정 시 기존 토큰 유지)

**검증 완료:** Figma + Claude Code 풀 플로우 테스트 성공. 샘플 결과 `https://moonlit-kataifi-4491cd.netlify.app/` — 싱크로율 좋고 수정 요청도 LDS 스타일 유지됨.

---

## ⚠️ 회사 컴퓨터에서 주의할 점

- **clientStorage는 device-bound** — LDS 템플릿 카탈로그(155개)는 집 컴퓨터에만 저장됨. 회사 컴퓨터에선 **플러그인 실행 후 설정 탭에서 템플릿 파일 열고 재추출 필요**.
- 리포는 이미 푸시됨. 회사에서 `git pull`만 하면 최신 코드 동기화.

---

## 월요일 계획: Level 1-2 신규 디자인 생성

### 목표
Export Pack을 base로 **LDS 스타일 신규 화면 생성** 가능하게. Figma→code 변환을 넘어 code→new design까지.

- **Level 1** = 기존 화면 변주 (도메인/컨텐츠만 교체, 구조 유지)
- **Level 2** = 라이브러리 컴포넌트로 새 화면 조합

### 월요일 수동 테스트 플로우 (먼저 이것부터)

**구현 전에 수동 테스트 먼저** — 실제 어디가 약한지 파악 후 코드 보완. 추측 기반 구현 지양.

1. 플러그인으로 스크린 3~4개 각각 Export Pack 뽑기 (다양한 타입 — 리스트, 상세, 폼, 설정 등)
2. 압축 풀어서 하나의 `corpus/` 폴더로 합침 (스크린들은 `corpus/screens/<slug>/` 경로)
3. `foundation/`, `icons/`, `lds.md` 등 공통 파일은 루트에 한 번만
4. Claude Code에 corpus 통째로 제공 + 테스트 프롬프트:
   - "이 LDS 코퍼스를 참고해서 **설정 화면**을 React로 만들어줘"
   - "**피드 화면** 스타일을 참고해서 **음악 플레이어 화면** 생성"
   - "이 리스트 화면을 **음식 배달 앱 메뉴 리스트**로 변주"
5. 결과 체크:
   - 라이브러리 컴포넌트만 사용하는지 (새 컴포넌트 생성 안 하는지)
   - 토큰 `var(--...)`만 쓰는지 (리터럴 hex/px 섞이는지)
   - 구조가 기존 화면 템플릿을 따라가는지
   - 텍스트는 요청 도메인에 맞게 자연스러운지

### 테스트 후 코드로 만들 후보 (순서, 수동 결과 보고 조정)

1. **스크린 타입 라벨** — Export 탭에 dropdown: `list / detail / form / settings / modal / empty / auth / feed / onboarding / other`. `meta.json`에 `screenType` 저장, PROMPT.md에 각 화면 타입 병기. (30분~1시간)

2. **"생성 모드" 시스템 프롬프트 섹션** — `src/export/systemPrompt.ts` 확장. 신규 화면 요청 시 규칙:
   - 같은 `screenType`의 기존 화면을 **구조 템플릿**으로 사용
   - 컴포넌트는 라이브러리 리스트에서만 선택 (새 생성 금지)
   - 토큰은 foundation에서만 참조
   - 텍스트는 요청 도메인 맞게 **생성 허용** (기존 verbatim 규칙은 "변환 모드" 전용)

   (10분)

3. **팩 merge CLI** (선택) — 여러 팩 zip을 `corpus/` 폴더로 합치는 Node 스크립트. 팩 3~4개 돌려보고 수동이 번거로울 때만 만들기.

---

## 참고 정보

- 메인 브랜치: `main`
- 최근 커밋:
  - `fd32f9d` Improve LDS matching, add template catalog, enrich Export Pack
  - `cde0b7b` Narrow Fix tab scope: disable AI naming, guard against stale/local LDS keys
  - `8008087` Initial: Figma plugin for file health check and semantic naming
- 파일 구조: [`CLAUDE.md`](../CLAUDE.md) 참고
- 테스트 결과 샘플: `https://moonlit-kataifi-4491cd.netlify.app/`

## 이 세션 시작 시 Claude에게 할 말 (제안)

> 월요일 이어서 작업. `.claude/SESSION-NOTES.md` 읽고 상황 파악해줘. 오늘은 수동 테스트부터 해보려 해 — 스크린 몇 개 뽑아서 corpus로 합치고 생성 프롬프트 돌려볼 예정.
