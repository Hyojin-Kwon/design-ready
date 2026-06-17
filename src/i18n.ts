export type Lang = "ko" | "en";

const en = {
  langToggle: "KO",

  // Tabs
  tabCheck: "Check",
  tabFix: "Fix",
  tabExport: "Export Pack",
  tabAbout: "About",
  tabSettings: "Settings",

  // Check tab
  checkEmptyTitle: "Scan Your File",
  checkScan: "Scan",
  checkRescan: "Re-scan",
  checkScanning: "Scanning...",
  checkReadinessTitle: "Code Readiness",
  checkReadinessDesc:
    "Estimated MCP → code conversion accuracy. Click a metric to jump to the Fix tab with related issues filtered.",
  checkNoTargets: "No targets",
  checkPassing: (p: number, s: number) => `${p} / ${s} passing`,
  checkUplift: (n: number) => `+${n} pts if fixed · Go to Fix tab →`,

  // Fix tab
  fixEmptyTitle: "Fix Issues",
  fixAllClearTitle: "All Clear",
  fixAllClearDesc: "No naming issues found.",
  fixScan: "Scan",
  fixAll: "All",
  fixNaming: "Naming",
  fixLayout: "Layout",
  fixSystem: "System",
  fixStyle: "Style",
  fixApply: "Apply",
  fixApplying: "Applying...",
  fixApplyAll: "Apply All",
  fixCleanup: "Cleanup",
  fixRenameOnly: "Rename only",
  fixMapOnly: "Map only",
  fixSkip: "Skip",

  // Export tab
  exportEmptyTitle: "Export Pack",
  exportGenerate: "Generate Export Pack from selection",
  exportGenerating: "Generating…",
  exportDownload: "Download",
  exportRegenerate: "Regenerate",
  exportComplete: "Export complete",
  exportScreens: "Screens",
  exportIcons: "Icons",
  exportProtoLinks: "Prototype links",
  exportTreeOpt: "Tree optimization",
  exportNodes: "Nodes",
  exportFlattened: "Flattened",
  exportAutoLayout: "Auto-layout inferred",
  exportIconDedup: "Icon dedup",

  // About tab
  aboutHeroDesc:
    "Tidy Figma designs into a code-conversion-ready shape and generate an Export Pack that AI coding tools can convert to React.",
  aboutHowItWorks: "How it works",
  aboutExamplePrompt: "Example prompt",
  aboutExamplePromptText: `Read PROMPT.md first — it is the source of truth. Follow its rules exactly.
Based on screens/<slug>/tree.json + meta.json, convert to a single React file.

Key points (detailed in PROMPT.md — do not override):
(a) Use foundation/ tokens via var(--...) for colors, typography, radius,
    stroke, and gap/padding only. Layout geometry (width/height/left/top)
    stays as raw px — never compose tokens (no calc(var(--a) + var(--b))).
(b) No React component library is bundled: preserve componentRef.name as a
    data-component attribute and never fabricate import paths.
(c) Keep all text verbatim from tree.json.

PROMPT.md already resolves the common ambiguities — follow it instead of asking.`,
  aboutNudge: "If the AI slips on (a)(b)(c), nudge with",
  aboutLdsMatcher: "LDS matcher",
  aboutSource: "Source",
  aboutEmpty: "Empty",
  aboutStep1Title: "Check",
  aboutStep1Desc: "Run a file health check and get a code-readiness score.",
  aboutStep2Title: "Fix",
  aboutStep2Desc: "Bulk-fix the diagnostics with semantic naming suggestions.",
  aboutStep3Title: "Export Pack",
  aboutStep3Desc: "Bundle selected screens as a code-ready zip.",
  aboutStep4Title: "Prompt your coding tool",
  aboutStep4Desc: "Hand the pack to Codex / Claude Code with the example prompt below.",
};

const ko: typeof en = {
  langToggle: "EN",

  tabCheck: "체크",
  tabFix: "수정",
  tabExport: "내보내기",
  tabAbout: "소개",
  tabSettings: "설정",

  checkEmptyTitle: "파일 스캔",
  checkScan: "스캔",
  checkRescan: "다시 스캔",
  checkScanning: "스캔 중...",
  checkReadinessTitle: "코드 준비도",
  checkReadinessDesc:
    "MCP → 코드 변환 예상 정확도. 지표를 클릭하면 관련 이슈가 필터된 수정 탭으로 이동합니다.",
  checkNoTargets: "대상 없음",
  checkPassing: (p: number, s: number) => `${p} / ${s} 통과`,
  checkUplift: (n: number) => `수정 시 +${n}점 · 수정 탭으로 →`,

  fixEmptyTitle: "이슈 수정",
  fixAllClearTitle: "이슈 없음",
  fixAllClearDesc: "네이밍 이슈가 없습니다.",
  fixScan: "스캔",
  fixAll: "전체",
  fixNaming: "네이밍",
  fixLayout: "레이아웃",
  fixSystem: "시스템",
  fixStyle: "스타일",
  fixApply: "적용",
  fixApplying: "적용 중...",
  fixApplyAll: "전체 적용",
  fixCleanup: "정리",
  fixRenameOnly: "이름 변경",
  fixMapOnly: "매핑만",
  fixSkip: "건너뛰기",

  exportEmptyTitle: "내보내기 팩",
  exportGenerate: "선택 항목으로 내보내기 팩 생성",
  exportGenerating: "생성 중…",
  exportDownload: "다운로드",
  exportRegenerate: "재생성",
  exportComplete: "내보내기 완료",
  exportScreens: "화면",
  exportIcons: "아이콘",
  exportProtoLinks: "프로토타입 링크",
  exportTreeOpt: "트리 최적화",
  exportNodes: "노드",
  exportFlattened: "병합됨",
  exportAutoLayout: "오토레이아웃 추론",
  exportIconDedup: "아이콘 중복 제거",

  aboutHeroDesc:
    "Figma 디자인을 코드 변환에 최적화된 형태로 정리하고, AI 코딩 도구가 React로 변환할 수 있는 내보내기 팩을 생성합니다.",
  aboutHowItWorks: "사용 방법",
  aboutExamplePrompt: "예시 프롬프트",
  aboutExamplePromptText: `먼저 PROMPT.md를 읽으세요 — 이것이 단일 진실원입니다. 규칙을 정확히 따르세요.
screens/<slug>/tree.json + meta.json을 기반으로 단일 React 파일로 변환하세요.

핵심 (자세한 내용은 PROMPT.md — 임의로 바꾸지 말 것):
(a) foundation/ 토큰(var(--...))은 색상·타이포·radius·stroke·gap/padding에만 사용.
    레이아웃 치수(width/height/left/top)는 raw px 유지 — 토큰을 산술 조합하지 말 것
    (calc(var(--a) + var(--b)) 금지).
(b) React 컴포넌트 라이브러리는 포함돼 있지 않음: componentRef.name을 data-component
    속성으로 보존하고, import 경로를 지어내지 말 것.
(c) 모든 텍스트는 tree.json에서 그대로 유지.

PROMPT.md가 흔한 모호함을 이미 해결해 둠 — 묻지 말고 그대로 따르세요.`,
  aboutNudge: "AI가 (a)(b)(c)를 놓치면 다음으로 유도하세요:",
  aboutLdsMatcher: "LDS 매처",
  aboutSource: "소스",
  aboutEmpty: "없음",
  aboutStep1Title: "체크",
  aboutStep1Desc: "파일 헬스체크를 실행하여 코드 준비도 점수를 확인합니다.",
  aboutStep2Title: "수정",
  aboutStep2Desc: "시맨틱 네이밍 제안으로 진단된 항목을 일괄 수정합니다.",
  aboutStep3Title: "내보내기 팩",
  aboutStep3Desc: "선택한 화면을 코드 변환 준비 완료된 zip으로 묶습니다.",
  aboutStep4Title: "코딩 도구에 전달",
  aboutStep4Desc: "팩을 Codex / Claude Code에 전달하고 아래 예시 프롬프트를 사용합니다.",
};

export const translations: Record<Lang, typeof en> = { en, ko };
export type T = typeof en;
