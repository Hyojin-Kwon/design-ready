import JSZip from "jszip";
import type { SerializedNode } from "../ai/conversionSerialize";
import type { LdsTemplateCatalog } from "../types";
import { FOUNDATION_CSS, FOUNDATION_TOKEN_NAMES_BY_FILE } from "../data/foundationTokens.generated";

export interface ExportPackScreen {
  rootLabel: string;
  tree: SerializedNode;
  iconMap: Record<string, string>;
  healthReport?: string;
  semanticMap?: Array<{ nodeId: string; originalName: string; suggestedName: string }>;
}

export interface FlowLink {
  from: { screen: string; nodeId: string; nodeName: string };
  to: { screen: string };
  trigger: string;
  action: string;
}

export interface ExportPackInput {
  projectName: string;
  screens: ExportPackScreen[];
  libraryComponents: string[];
  // 캐싱된 LDS 템플릿 catalog — 있으면 variant property까지 PROMPT.md에 나열.
  ldsTemplateCatalog?: LdsTemplateCatalog | null;
  ldsReference: string;
  systemPrompt: string;
  flow?: FlowLink[];
  includeTreeJson?: boolean;
  libraryImportPath?: string;
}

export interface ExportPackOutput {
  blob: Blob;
  filename: string;
}

interface IconManifestEntry {
  screen: string;
  localId: string;
  file: string;
  name: string;
  hint?: string;
  path: string[];
}

export async function buildExportPack(input: ExportPackInput): Promise<ExportPackOutput> {
  if (input.screens.length === 0) {
    throw new Error("Export Pack: 최소 1개 화면이 필요합니다.");
  }

  const zip = new JSZip();
  const screenSlugs = assignScreenSlugs(input.screens);
  const iconsFolder = zip.folder("icons");
  const manifest: IconManifestEntry[] = [];

  for (let i = 0; i < input.screens.length; i++) {
    const screen = input.screens[i];
    const slug = screenSlugs[i];
    const usedIconNames = new Set<string>();

    for (const [id, svg] of Object.entries(screen.iconMap)) {
      const hint = findIconHint(screen.tree, id);
      const filename = uniqueIconFilename(slug, id, hint, usedIconNames);
      iconsFolder?.file(filename, svg);
      manifest.push(entryFor(screen.tree, id, slug, filename));
    }

    const screenFolder = zip.folder(`screens/${slug}`);
    if (input.includeTreeJson) {
      screenFolder?.file("tree.json", JSON.stringify(screen.tree, null, 2));
    }
    if (screen.healthReport && screen.healthReport.trim()) {
      screenFolder?.file("health-report.md", screen.healthReport.trim() + "\n");
    }
    if (screen.semanticMap && screen.semanticMap.length > 0) {
      screenFolder?.file("semantic-map.json", JSON.stringify(screen.semanticMap, null, 2));
    }
    screenFolder?.file("meta.json", JSON.stringify({ rootLabel: screen.rootLabel, slug }, null, 2));
  }

  iconsFolder?.file("_manifest.json", JSON.stringify(manifest, null, 2));

  zip.file("PROMPT.md", renderPromptMd(input, screenSlugs));
  zip.file("README.md", renderReadmeMd(input, screenSlugs));
  // 에이전트(Codex 등)가 작업 폴더 루트에서 자동으로 읽는 정제 지침 + 확정 잠금 목록.
  zip.file("AGENTS.md", AGENTS_MD);
  zip.file("LOCKED.md", LOCKED_MD_TEMPLATE);

  if (input.ldsReference.trim()) {
    zip.file("lds.md", input.ldsReference.trim() + "\n");
  }

  // foundation CSS 파일 번들 — AI가 실제 토큰 값을 확인할 수 있게 원본 포함.
  const foundationFolder = zip.folder("foundation");
  for (const [filename, content] of Object.entries(FOUNDATION_CSS)) {
    foundationFolder?.file(filename, content);
  }

  if (input.flow && input.flow.length > 0) {
    zip.file("flow.md", renderFlowMd(input.flow, input.screens, screenSlugs));
  }

  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const filename = `figma-export-pack-${slugify(input.projectName)}-${timestamp()}.zip`;
  return { blob, filename };
}

function assignScreenSlugs(screens: ExportPackScreen[]): string[] {
  const used = new Set<string>();
  return screens.map((s) => {
    const base = slugify(s.rootLabel) || "screen";
    let candidate = base;
    let i = 2;
    while (used.has(candidate)) {
      candidate = `${base}-${i}`;
      i++;
    }
    used.add(candidate);
    return candidate;
  });
}

function entryFor(
  tree: SerializedNode,
  iconId: string,
  screenSlug: string,
  filename: string,
): IconManifestEntry {
  let found: { name: string; hint?: string; path: string[] } = {
    name: iconId,
    path: [],
  };
  const walk = (n: SerializedNode, path: string[]) => {
    if (n.iconId === iconId) {
      found = { name: n.name, hint: n.iconHint, path: [...path, n.name] };
    }
    if (n.children) n.children.forEach((c) => walk(c, [...path, n.name]));
  };
  walk(tree, []);
  return {
    screen: screenSlug,
    localId: iconId,
    file: `icons/${filename}`,
    name: found.name,
    hint: found.hint,
    path: found.path,
  };
}

function renderPromptMd(input: ExportPackInput, slugs: string[]): string {
  const parts: string[] = [];
  parts.push("# Figma → React 변환 지침\n");
  parts.push(
    "이 폴더는 `design-ready` Figma 플러그인이 생성한 변환 컨텍스트 팩입니다. " +
      "Claude Code(또는 동급 에이전트)에 이 폴더 전체를 첨부한 뒤 아래 지침을 따라 변환을 요청하세요.\n",
  );

  parts.push("## 대상 화면");
  for (let i = 0; i < input.screens.length; i++) {
    parts.push(`- \`screens/${slugs[i]}/\` — ${input.screens[i].rootLabel}`);
  }
  parts.push("");

  const hasHealthReport = input.screens.some(
    (s) => s.healthReport && s.healthReport.trim().length > 0,
  );
  const hasSemanticMap = input.screens.some((s) => s.semanticMap && s.semanticMap.length > 0);

  parts.push("## 입력 소스");
  parts.push(
    "- **라이브 트리**: Figma MCP 서버가 연결되어 있으면 각 화면을 MCP로 직접 읽어옵니다. 각 `screens/<slug>/meta.json`의 `rootLabel`로 Figma 프레임을 찾으세요.",
  );
  parts.push(
    "- **아이콘**: `icons/` 폴더의 SVG 파일들. `icons/_manifest.json`에 `{screen, localId, file, path}` 매핑이 있습니다. 각 화면의 `tree.json`(포함된 경우) 또는 MCP 트리의 `iconId` 필드를 manifest로 역참조해서 필요한 SVG만 Read하세요. `svgOmitted: true`인 노드는 SVG가 너무 커서 추출에서 제외된 아이콘이므로 `iconHint`(이름/크기)를 참고해 Figma MCP로 원본을 직접 가져오세요.",
  );
  if (input.includeTreeJson) {
    parts.push(
      "- **트리**: 각 화면의 `screens/<slug>/tree.json` (MCP 없는 환경용 스냅샷). " +
        "`repeatCount: N` 필드가 있는 노드는 동일 구조가 N번 반복되는 리스트 아이템 — `.map()`으로 N개 렌더링하세요. " +
        "텍스트가 `…`로 끝나면 400자 초과로 잘린 것이므로 Figma MCP로 원본을 확인하세요.",
    );
  }
  if (input.ldsReference.trim()) parts.push("- **디자인 시스템**: `lds.md` 참조.");
  if (hasHealthReport) {
    parts.push(
      "- **파일 품질 리포트**: `screens/<slug>/health-report.md` — 해당 화면의 알려진 약점. 변환 시 보정하세요.",
    );
  }
  if (input.flow && input.flow.length > 0) {
    parts.push(
      "- **프로토타입 플로우**: `flow.md` — 화면 간 네비게이션. 라우팅/핸들러를 이에 맞춰 연결하세요.",
    );
  }
  if (hasSemanticMap) {
    parts.push(
      "- **시맨틱 네이밍 맵**: `screens/<slug>/semantic-map.json` — 원본 레이어 이름 대신 이 매핑된 이름을 JSX 주석/식별자로 사용.",
    );
  }
  parts.push("");

  parts.push("## 라이브러리 컴포넌트");
  if (input.libraryImportPath?.trim()) {
    parts.push(
      `import 경로: \`import { ComponentName } from '${input.libraryImportPath.trim()}'\`` +
        " — ComponentName 자리에 아래 이름을 그대로 사용.",
    );
  } else {
    parts.push(
      "_⚠️ import 경로 미지정. 설정 탭 → 'React import 경로'를 입력하거나, 코드에 `// TODO: add import` 주석을 남기세요._",
    );
  }
  const cleanComponents = filterLibraryComponents(input.libraryComponents);
  // catalog가 있으면 variant property까지 같이 출력. 이름 → catalog entry 매핑.
  const variantByName = new Map<string, Record<string, string[]>>();
  if (input.ldsTemplateCatalog) {
    for (const e of input.ldsTemplateCatalog.components) {
      if (e.variantProperties) variantByName.set(e.name, e.variantProperties);
    }
  }
  if (cleanComponents.length > 0) {
    for (const name of cleanComponents) {
      const variants = variantByName.get(name);
      if (variants) {
        const spec = Object.entries(variants)
          .map(([prop, opts]) => `${prop}: ${opts.join("|")}`)
          .join(" · ");
        parts.push(`- ${name} (${spec})`);
      } else {
        parts.push(`- ${name}`);
      }
    }
  } else {
    parts.push("- (없음)");
  }
  if (input.libraryComponents.length > cleanComponents.length) {
    parts.push("");
    parts.push(
      `_${input.libraryComponents.length - cleanComponents.length}개 항목이 deprecated/placeholder로 간주되어 제외됨._`,
    );
  }
  if (variantByName.size > 0) {
    parts.push("");
    parts.push("_variant property 표기: 괄호 안 값만 유효한 조합. 다른 조합을 만들어내지 말 것._");
  }
  parts.push("");

  // 디자인 토큰 enumeration — AI가 리터럴 값 대신 이 변수명만 쓰게 강제.
  const tokenFiles = Object.entries(FOUNDATION_TOKEN_NAMES_BY_FILE).filter(
    ([, names]) => names.length > 0,
  );
  if (tokenFiles.length > 0) {
    parts.push("## 사용 가능한 디자인 토큰");
    parts.push(
      "아래 CSS 변수는 **디자인 의도 값에만** 사용: 색상·타이포·radius·stroke·gap/padding. " +
        "이 값들은 정확히 일치하는 토큰이 있을 때만 `var(--name)` 참조. " +
        "**width/height/위치(left/top 등 px 치수)는 토큰화하지 말고 raw px 유지.** " +
        "토큰을 산술 조합(`calc(var(--a)+var(--b))`)하지 말 것 — 한 값에 토큰 하나, 정확히 안 맞으면 리터럴 유지. " +
        "원본 정의와 값은 `foundation/` 디렉토리의 CSS 파일 참고. 여기 없는 토큰을 지어내지 말 것.",
    );
    parts.push("");
    for (const [filename, names] of tokenFiles) {
      parts.push(`### ${filename} (${names.length}개)`);
      parts.push("```");
      for (const n of names) parts.push(n);
      parts.push("```");
      parts.push("");
    }
  }

  parts.push("## 변환 시스템 프롬프트\n");
  parts.push(input.systemPrompt.trim());
  parts.push("");

  parts.push(HANDOFF_SECTION);
  parts.push("");

  return parts.join("\n");
}

// 변환 완료 직후 AI가 자동으로 정제 루프를 여는 핸드오프. 시스템 프롬프트와 별개로
// 항상 PROMPT.md에 붙어, 사용자가 시스템 프롬프트를 덮어써도 유지된다.
const HANDOFF_SECTION = `## 변환 완료 후 — 정제 루프 (필수)

변환을 모두 마치면, **추가 지시 없이** 마지막 턴을 정확히 아래 메시지(인용 블록 전체)로 끝맺으세요. ("설명/마크다운 없이 .tsx만 출력" 규칙의 유일한 예외입니다.) 메시지 안의 \`<화면이름>\`은 실제 생성한 화면 파일명으로 바꿔 적으세요.

> ✅ **변환을 완료했어요.** 브라우저에 **미리보기**를 띄워 뒀습니다 — \`preview/<화면이름>-preview.html\` (안 열렸으면 그 파일을 더블클릭하세요).
>
> 이제 **디자인과 똑같이 맞춰가는 정제 단계**입니다. 제가 코드만 보고 임의로 손대면 디자인과 어긋나기 쉬워서, **틀린 부분을 캡처로 짚어주시는 방식**으로 진행합니다:
>
> 1. 미리보기를 디자인과 비교해 보세요.
> 2. **다른 섹션이 있으면 그 섹션의 Figma 캡처(PNG)** 를 보내주세요. (헤더·검색바·리스트처럼 한 덩어리 단위로요.)
> 3. 캡처를 정답으로 놓고 **그 섹션만** — 레이아웃·간격·색·폰트·정렬·요소 유무를 1:1로 비교해 다른 점만 고칩니다.
> 4. 일치하면 그 섹션을 확정(\`LOCKED.md\`에 잠금)하고 다음 섹션으로 넘어갑니다. 한 번에 한 섹션씩, 위에서 아래로 수렴합니다.
>
> 어디부터 볼지 막막하시면 "위에서부터 순서대로 보자"고 해주셔도 됩니다. 캡처를 받기 전까진 추측으로 고치지 않고 기다릴게요.

(에이전트용 메모) 위 메시지로 턴을 끝낸 뒤:
- 캡처를 받기 전에는 스타일을 추측으로 바꾸지 마세요. 사용자가 캡처로 섹션을 지목할 때까지 기다립니다.
- 캡처를 받으면 \`AGENTS.md\`의 정제 규칙을 따르세요: ① 캡처(정답) ↔ 현재 렌더 비교해 **다른 점만** 수정 → ② 반복은 데이터 배열로 → ③ 일치하면 \`LOCKED.md\`에 추가하고 다음 섹션. \`LOCKED.md\`에 이미 있는 섹션은 절대 수정하지 마세요.
- 수정할 때마다 \`preview/<화면이름>-preview.html\`을 갱신하고 다시 열어, 사용자가 바로 결과를 보게 하세요.`;

// 에이전트가 폴더 루트에서 자동으로 읽는 정제 루프 지침. 화면별 내용이 아니라
// 모든 pack에 동일하게 적용되는 행동 규칙이므로 정적 상수로 동봉한다.
const AGENTS_MD = `# AGENTS.md — 이 폴더에서 작업하는 에이전트(Codex 등) 지침

이 폴더는 \`design-ready\` 플러그인이 만든 Figma → React 변환 팩입니다.
**변환(생성)** 규칙은 \`PROMPT.md\`를 따르고, **변환 후 디자인과 맞춰가는 "정제"** 는 아래 규칙을 반드시 따르세요.

---

## 핵심 행동 규칙 (반드시 지킬 것)

### 1. 한 섹션씩, 위에서 아래로
- 한 번에 화면 전체를 고치지 마세요. 한 섹션(헤더 → 검색 → 배너 → 리스트 …)씩 처리합니다.
- 사용자가 "전체 다 고쳐줘"라고 해도, 섹션 단위로 쪼개서 순서대로 진행하겠다고 먼저 제안하세요.

### 2. 디자인 이미지와 비교해서 고친다 (추측 금지)
- 코드만 보고 스타일을 바꾸지 마세요. **디자인 캡처(PNG)가 없으면 먼저 요청**하세요:
  > "이 섹션의 Figma 화면 캡처를 주시면 그것과 비교해서 정확히 맞추겠습니다."
- 캡처를 받으면: 정답 PNG ↔ 현재 렌더 결과를 비교 → **다른 점만** 골라 고칩니다. 비교 항목: 레이아웃·간격·색·폰트·정렬·요소 유무.

### 3. 반복되는 마크업은 데이터로 분리
- 같은 구조가 여러 번 복붙돼 있으면, 마크업 1벌 + 데이터 배열(\`.map()\`)로 정리하세요.
- \`tree.json\`의 \`repeatCount: N\` 노드도 마찬가지로 처리합니다.

### 4. 확정된 섹션은 절대 건드리지 않는다
- 작업 시작 시 **\`LOCKED.md\`를 먼저 읽으세요.** 거기 적힌 섹션/컴포넌트는 수정 금지입니다.
- 한 섹션이 디자인과 일치하면, 사용자에게 "이 섹션 확정할까요?"라고 물어 \`LOCKED.md\`에 추가하세요.
- 잠긴 섹션을 바꿔야만 하는 상황이면, 고치기 전에 반드시 먼저 사용자에게 알리고 확인받으세요.

---

## 수정 후 검증 방법 (스스로 확인할 것)

- 변환 시 만든 \`preview/<화면>-preview.html\`(브라우저에서 바로 열리는 자기완결 파일)을 **수정할 때마다 갱신하고 다시 열어** 디자인 캡처와 눈으로 비교하세요. "맞을 것 같다"로 끝내지 말 것.
- 미리보기가 없으면(예: 이전 변환에서 누락) 먼저 만들어 띄우세요 — 정제는 항상 "보면서" 합니다.
- **색상은 스크린샷으로 단정하지 말고** 계산된 CSS 값(토큰)으로 확인하세요.

---

## 한계 (알고 있을 것)

- 실제 **사진/아이콘 이미지**는 채울 수 없습니다(원본 에셋이 placeholder). 비교·수정은 **구조(레이아웃·간격·색·폰트·정렬)** 에 집중하고, 이미지 자리는 placeholder로 둡니다.
- 토큰은 \`foundation/\`의 CSS 변수를 사용하고, 순수 기하(px)는 토큰화하지 마세요.

---

## 요약

> **디자인 이미지를 보여달라 → 한 섹션씩 비교해서 다른 점만 고친다 → 반복은 데이터로 → 일치하면 LOCKED.md에 잠그고 다음 섹션.**
> "알아서 잘 만들기"가 아니라 "이 이미지와 똑같이 맞추기"가 목표입니다.
`;

// 확정(수정 금지) 섹션 목록. 빈 템플릿으로 시작하고, 정제 루프가 진행되며 항목이 채워진다.
const LOCKED_MD_TEMPLATE = `# LOCKED — 수정 금지 (디자인 대조 통과한 섹션)

디자인과 일치 확인이 끝난 섹션을 여기에 기록합니다. **에이전트는 이 목록의 항목을 수정하지 마세요.**
변경이 꼭 필요하면 고치기 전에 사용자에게 먼저 확인받으세요.

> 아직 확정된 섹션이 없습니다. 한 섹션이 디자인과 일치하면 아래 표에 추가하세요.

| 섹션 | 위치 (파일 › 식별자) | 확정일 | 비고 |
|---|---|---|---|
| _(예: 상단 탭)_ | _(예: screens/foo/Foo.tsx › filterTabs)_ | _(YYYY-MM-DD)_ | _(데이터만 변경 허용 등)_ |
`;

function renderReadmeMd(input: ExportPackInput, slugs: string[]): string {
  const totalIcons = input.screens.reduce((acc, s) => acc + Object.keys(s.iconMap).length, 0);
  const lines: Array<string | null> = [
    "# Export Pack 사용법",
    "",
    `프로젝트: **${input.projectName}**`,
    `화면 수: ${input.screens.length}`,
    `아이콘 수: ${totalIcons}`,
    "",
    "## Claude Code + Figma MCP",
    "1. Figma MCP 서버가 Claude Code에 연결되어 있는지 확인.",
    "2. Figma에서 변환할 프레임들이 선택(또는 접근 가능)한 상태인지 확인.",
    "3. Claude Code 세션에 이 폴더를 드래그(또는 `@` 로 첨부).",
    "4. 프롬프트 예시:",
    "",
    "   > `PROMPT.md` 지침을 따라 `screens/` 아래 모든 화면을 React + TypeScript 컴포넌트로 변환해줘. 공용 컴포넌트는 `components/` 로 추출하고, `flow.md` 의 네비게이션을 react-router 로 연결해줘.",
    "",
    "## 파일 구성",
    "- `PROMPT.md` — 시스템 프롬프트 + 변환 지침 (끝에 변환 완료 후 정제 루프 핸드오프 포함)",
    "- `AGENTS.md` — 에이전트(Codex 등)가 자동으로 읽는 정제 루프 규칙",
    "- `LOCKED.md` — 디자인 대조 통과한 '수정 금지' 섹션 목록 (정제하며 채워짐)",
    "- `README.md` — 이 파일",
    "- `icons/` — 추출된 아이콘 SVG + `_manifest.json` (화면별 localId → file 매핑)",
    "- `screens/<slug>/` — 화면별 메타/리포트" + (input.includeTreeJson ? "/트리" : ""),
    "- `foundation/` — 디자인 토큰 CSS (변수 정의/값)",
    input.ldsReference.trim() ? "- `lds.md` — 디자인 시스템 레퍼런스" : null,
    input.flow && input.flow.length > 0 ? "- `flow.md` — 프로토타입 네비게이션 그래프" : null,
    "",
    "## 화면 목록",
    ...input.screens.map((s, i) => `- \`screens/${slugs[i]}/\` — ${s.rootLabel}`),
  ];
  return lines.filter((v): v is string => v !== null).join("\n");
}

function renderFlowMd(links: FlowLink[], screens: ExportPackScreen[], slugs: string[]): string {
  const labelToSlug = new Map<string, string>();
  screens.forEach((s, i) => labelToSlug.set(s.rootLabel, slugs[i]));

  const bySource = new Map<string, FlowLink[]>();
  for (const link of links) {
    const key = link.from.screen;
    if (!bySource.has(key)) bySource.set(key, []);
    bySource.get(key)!.push(link);
  }

  const parts: string[] = ["# 프로토타입 플로우\n"];
  parts.push("Figma 프로토타입에서 추출한 화면 간 네비게이션입니다.\n");

  for (const [sourceLabel, outgoing] of bySource) {
    const sourceSlug = labelToSlug.get(sourceLabel) ?? slugify(sourceLabel);
    parts.push(`## ${sourceLabel} (\`screens/${sourceSlug}/\`)`);
    for (const link of outgoing) {
      const toSlug = labelToSlug.get(link.to.screen) ?? slugify(link.to.screen);
      parts.push(
        `- **${link.from.nodeName}** (${link.trigger}) → \`${link.action}\` → ${link.to.screen} (\`screens/${toSlug}/\`)`,
      );
    }
    parts.push("");
  }
  return parts.join("\n");
}

function findIconHint(tree: SerializedNode, iconId: string): string {
  let hint = "";
  const walk = (n: SerializedNode) => {
    if (hint) return;
    if (n.iconId === iconId) {
      hint = n.iconHint ?? n.name ?? "";
      return;
    }
    if (n.children) n.children.forEach(walk);
  };
  walk(tree);
  return hint;
}

function uniqueIconFilename(
  screenSlug: string,
  id: string,
  hint: string | undefined,
  used: Set<string>,
): string {
  const hintSlug = slugify(hint ?? "");
  const base = hintSlug ? `${screenSlug}__${id}__${hintSlug}` : `${screenSlug}__${id}`;
  let candidate = `${base}.svg`;
  let i = 2;
  while (used.has(candidate)) {
    candidate = `${base}-${i}.svg`;
    i++;
  }
  used.add(candidate);
  return candidate;
}

function filterLibraryComponents(names: string[]): string[] {
  return names.filter((raw) => {
    const name = raw.trim();
    if (!name) return false;
    // Deprecated marker: leading "x /" or "x/" (case-insensitive)
    if (/^x\s*\//i.test(name)) return false;
    // Placeholder markers (unfilled checkbox emoji, explicit "placeholder")
    if (name.includes("◻️") || name.includes("◻")) return false;
    if (/\bplaceholder\b/i.test(name)) return false;
    return true;
  });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}
