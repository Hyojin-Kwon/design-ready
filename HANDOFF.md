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

## 다음 작업: V1 퀄리티 복원 ("leaner 트리" 실험)

**문제:** 트리워커는 잡았지만, 출력이 여전히 `position:absolute` + 정확 px로 픽셀-고정된 기계적 코드. 맨 처음 배포(V1, 4월)가 더 깔끔(flex 위주)했던 것으로 보임.

**근거(git 측정, 추측 아님):** V1 트리 직렬화엔 `absolute`/`inferredLayout`/`boundTokens`/정확 geometry 필드가 **전무**했음(0). 지금 SerializedNode는 66필드. 즉 V1은 뼈대만 줘서 모델이 flex로 해석·재구성하게 강제했고, 우리가 정확 좌표를 다 넣으면서 픽셀-전사로 몰림.

**실험:** `src/ai/conversionSerialize.ts` / `src/ai/treeOptimize.ts`에서 직렬화를 **의도적으로 leaner하게** (정확 x/y·absolute 비중 축소, 뼈대 위주) → 같은 화면 변환해 flex/깔끔도 비교.

**필수 규율(오늘의 교훈):** 변환 출력은 **run마다 편차가 큼**. 같은 프롬프트가 시맨틱/트리워커 둘 다 냄. **샘플 1개로 인과 단정 금지** — 변경마다 같은 화면 2~3회 돌려 비교할 것.

## 핵심 파일

- 변환 프롬프트: `src/export/systemPrompt.ts`
- Export Pack 생성: `src/export/exportPack.ts`
- 트리 직렬화: `src/ai/conversionSerialize.ts`
- 트리 최적화(패스): `src/ai/treeOptimize.ts` (+ `.test.ts`)
- 가중치/스코어: `src/analyzers/codeReadiness.ts` (가중치 v2 아직 잠정 — 캘리브레이션 미완)
