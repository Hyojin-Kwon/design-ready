# 작업 인수인계 (2026-06-18)

다른 PC에서 이어서 작업하기 위한 현재 상태 + 다음 할 일.

## 이어서 시작하는 법

```bash
git fetch origin
git checkout feat/code-readiness-weights-v2   # = upstream origin/main 위의 단일 작업 브랜치
npm install
npm run build
```

Figma: Plugins → Development → Import plugin from manifest → 이 폴더의 `manifest.json`.
플러그인 UI 미리보기(브라우저): `node scripts/preview-ui.mjs` → http://localhost:5180/ui.html

## ⏭️ 월요일(2026-06-22) 이어서 할 일 — 우선순위순

> 금요일(6/19) 세션 결과: 변환 회귀 5종 fix 완료(PR #1, 커밋 `6b4571c`~`c6192d1`). 아래 진단/적용 내역은 이 파일 하단 "회귀 원인 규명" 참조.
> 월요일(6/22) 진행: 빌드 가드 2종 완료(커밋 `2e90fac`), 정적 검증 통과. Figma 실측 검증/배포만 남음(사람 필요).

**1. 최신 빌드 검증 (먼저) — ⏳ Figma 실측만 남음**
- `git pull` 후 `npm run build:dev`(이제 prebuild가 자동 clean) → Figma에서 **Development** 항목으로 실행(게시본 말고!). _dist는 이미 dev 빌드 상태로 준비됨._
- friends 화면 export → 검증: `PROMPT.md`에 `"TOKEN REPORT"` **없음** / `"Render the component inline"` **있음**, `tree.json`에 `repeatCount` **없음**, 출력에 친구 3행·탭 5개 다 있음.
- ✅ 정적 산출물은 검증 완료: `dist/ui.html` TOKEN REPORT=0, "render the component inline"=1, tree.json 소스(`conversionSerialize.ts`)에 repeatCount 없음, typecheck OK, 테스트 18/18 통과.
- 금요일에 사용자가 본 누락/TOKEN REPORT는 **Figma가 옛 게시본(stale)을 돌려서**였음(소스·clean dist는 정상 확인됨). Settings override는 비어 있음(확인됨).

**2. 빌드 가드 추가 (재발 방지) — ✅ 완료 (커밋 `2e90fac`)**
- `esbuild.config.mjs`의 worktree→메인 `dist/ui.html` 자동 sync를 **기본 OFF**로. `DESIGN_READY_SYNC_MAIN=true` 일 때만 동작. (이게 stale dist의 진짜 원흉)
- `package.json`에 `prebuild` 훅 추가 → `npm run build`(배포 경로)는 항상 `rm -rf dist` 선행. `clean` 스크립트도 추가.
- 남은 worktree 없음(`git worktree list`로 확인 — `youthful-joliot`는 이미 정리됨).

**3. 정상 확인되면 prod 재배포 — ⏳ 사람 필요**
- `npm run build`(이제 prebuild가 dist 자동 clean) → Figma 데스크탑에서 **Publish**(사람이 직접; CLI 불가).
- 게시 직전 30초 검증: `grep -c "TOKEN REPORT" dist/ui.html`(=0), `grep -ic "render the component inline" dist/ui.html`(=1).

**4. PR #1 머지** (검증·배포 끝나면) — base `main`, MERGEABLE. 가드 커밋 push 완료.

## 현재 상태 (v0.2.0, 커밋 e576eaf)

오늘 끝낸 것:
- UI 전면 리디자인 + 다국어(i18n EN/KO)
- 변환 출력 안정화 3종:
  - **geometry는 raw px** (토큰은 색/타이포/radius/stroke/gap·padding에만) — calc(var+var) 범벅 해결 (`src/export/systemPrompt.ts`)
  - **트리워커 출력 금지 가드레일** — `const TREE` + 범용 재귀 렌더러 금지, JSX 직접 작성 강제 (`src/export/systemPrompt.ts` 최상단 CRITICAL 규칙). chats·friends 2개 화면에서 검증됨.
  - **겹친 중복 컴포넌트 제거** — `src/ai/treeOptimize.ts`의 `dropOccludedDuplicates` 패스 (+테스트)
- v0.2.0 버전 범프 + CHANGELOG

**남은 배포 단계:** Figma 데스크탑에서 플러그인 **Publish**(사람이 직접; CLI 불가).

## 회귀 원인 규명 완료 (2026-06-19): 범인은 시스템 프롬프트

**증상:** 출력이 `position:absolute` + 정확 px로 픽셀-고정된 기계적 코드. 4월(V1)이 더 깔끔(컴포넌트 분해 + CSS flex)했음.

**이전 가설은 반증됨:** "트리가 비대해져서(0→66필드) 픽셀 전사로 몰렸다"는 추정은 **git 측정으로 틀린 것으로 확인**. 변환 기능은 첫 커밋(cde0b7b, 4/23)부터 `absolute`/`x`/`y`/`inferredLayout`/`boundTokens`를 갖고 있었고, `SerializedNode` 필드 수는 4월 36 → 지금 37(추가된 건 `svgOmitted` 하나)뿐. flex/absolute 결정 기계(직렬화기 + 프롬프트의 absolute 규칙)는 4월과 글자 단위로 동일.

**격리 실험으로 범인 확정 (변수 1개씩 고정):**
- 변환 = Codex(플러그인이 아님). 4월 Codex 5.3 → 지금 5.5.
- 4월 팩(4월 프롬프트+4월 패스+4월 트리)을 **현재 Codex 5.5**로 변환 → 깔끔 ✅ (∴ 모델 무죄)
- **현재 트리·패스 그대로 + 프롬프트만 4월 것**으로 변환 → 깔끔 회복 ✅
- ∴ **회귀는 100% 시스템 프롬프트.** optimize 패스 3개·트리·모델 모두 무죄.

**유력 용의자:** 4월→현재 추가된 프롬프트 규칙 중 **HAND-WRITE 규칙(b42cc4d, 6/18)**. "author the JSX literally, element by element … styles inline"이 Codex 5.5를 컴포넌트 분해 대신 납작한 인라인 전사로 몰았을 가능성(트리워커 막으려다 픽셀 전사 유발).

## 적용된 fix (2026-06-19)

- **`src/export/systemPrompt.ts`의 `DEFAULT_SYSTEM_PROMPT`를 4월판(cde0b7b)으로 교체.** 검증된 깔끔 출력 프롬프트. (토큰 enumeration은 PROMPT.md에 별도 생성되므로 4월 프롬프트로도 토큰 사용 유지됨)
- "leaner 트리" 실험은 **회귀 원인이 아님이 확정되어 전량 롤백**(토글·패스·테스트 제거).
- **content-aware 반복 collapse** (`treeOptimize.ts` `repeatSignature`): 컴포넌트 정체성만 보고 텍스트 다른 형제까지 합쳐 라벨이 다른 탭/리스트 행이 대표 1개로 뭉개지던 버그. signature에 서브트리 텍스트 지문을 포함해 "보이는 텍스트까지 동일"할 때만 collapse.
- **occlusion 좌표 가드** (`treeOptimize.ts` `sameBox`): x/y 미정의를 `?? 0`으로 떨어뜨려 오토레이아웃 자식(세로 리스트 행 등)을 전부 (0,0)에 겹친 중복으로 오판 → 같은 이름 친구 행 3개 중 2개가 사라지던 버그. x/y가 하나라도 없으면 같은 박스로 보지 않도록 수정(절대 배치 스택 dedup은 유지).
- **`systemPrompt.ts` componentRef 규칙** + **예시 프롬프트(i18n EN/KO)**: "컴포넌트 라이브러리 없음 → children으로 인라인 렌더 + `// from:` 주석, import 지어내지 말 것"으로 명시·동기화(`data-component` 제거).

위 fix들은 실제 Codex 5.5 변환 출력(friends 화면)으로 탭/행 누락 해소·컴포넌트 인라인 렌더 검증 완료.

**남은 follow-up (선택):**
- 4월 프롬프트로 Codex 5.5가 트리워커를 재발시키면, 장황한 HAND-WRITE 대신 **최소 가드 1줄**만 다시 추가.
- 정밀히 하려면: 신규 규칙(토큰/variant/modification)을 하나씩 다시 넣어 **정확히 어느 규칙이 깨뜨리는지** 외과적 bisect → 유용한 규칙은 살리고 범인만 제거.

**규율(교훈):** 변환 출력은 run마다 편차 큼 — 변경마다 같은 화면 2~3회 돌려 비교. 그리고 "git 측정"이라도 **실제로 다시 세어 검증**할 것(이번에 0→66필드 주장이 반증됨).

## 핵심 파일

- 변환 프롬프트: `src/export/systemPrompt.ts`
- Export Pack 생성: `src/export/exportPack.ts`
- 트리 직렬화: `src/ai/conversionSerialize.ts`
- 트리 최적화(패스): `src/ai/treeOptimize.ts` (+ `.test.ts`)
- 가중치/스코어: `src/analyzers/codeReadiness.ts` (가중치 v2 아직 잠정 — 캘리브레이션 미완)
