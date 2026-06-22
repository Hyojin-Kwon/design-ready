# Changelog

## 0.2.0 — 2026-06-18

### UI

- 전면 리디자인: 라이트 테마, 블랙 액센트, Plus Jakarta Sans / NanumSquareNeo
- 다국어(i18n) 지원: EN / KO 토글, 일러스트 빈 상태
- About 탭 예시 프롬프트 정비 + 다국어화

### 변환 품질 (Export Pack)

- **레이아웃 치수는 raw px 유지** — 토큰을 색/타이포/radius/stroke/gap·padding에만 적용, 토큰 산술 조합 금지. (이전: width/height/위치까지 토큰화하며 `calc(var+var)` 범벅 발생)
- **트리워커 출력 금지 가드레일** — 디자인을 `const TREE` 데이터 + 범용 재귀 렌더러로 출력하는 것을 명시 금지, JSX를 요소별로 직접 작성하도록 강제.
- **겹친 중복 컴포넌트 제거** — 동일 위치에 쌓인 대체 상태(예: BottomNav 2개)를 직렬화 단계에서 정리.

### 알려진 한계

- 복잡한 화면은 첫 변환에서 일부 노드를 생략할 수 있음 → 변환 에이전트에 "누락된 부분을 마저 그려줘"로 재요청하면 보완됨.

### 문서

- 사용 위키(`WIKI.md` / `WIKI.confluence`) 추가.
