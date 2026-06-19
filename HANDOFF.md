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
