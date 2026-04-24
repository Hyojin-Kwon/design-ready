import JSZip from "jszip";
import type { SerializedNode } from "../ai/conversionSerialize";
import type { LdsTemplateCatalog } from "../types";
import {
  FOUNDATION_CSS,
  FOUNDATION_TOKEN_NAMES_BY_FILE
} from "../data/foundationTokens.generated";

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
  filename: string
): IconManifestEntry {
  let found: { name: string; hint?: string; path: string[] } = {
    name: iconId,
    path: []
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
    path: found.path
  };
}

function renderPromptMd(input: ExportPackInput, slugs: string[]): string {
  const parts: string[] = [];
  parts.push("# Figma → React 변환 지침\n");
  parts.push(
    "이 폴더는 `design-ready` Figma 플러그인이 생성한 변환 컨텍스트 팩입니다. " +
      "Claude Code(또는 동급 에이전트)에 이 폴더 전체를 첨부한 뒤 아래 지침을 따라 변환을 요청하세요.\n"
  );

  parts.push("## 대상 화면");
  for (let i = 0; i < input.screens.length; i++) {
    parts.push(`- \`screens/${slugs[i]}/\` — ${input.screens[i].rootLabel}`);
  }
  parts.push("");

  const hasHealthReport = input.screens.some(
    (s) => s.healthReport && s.healthReport.trim().length > 0
  );
  const hasSemanticMap = input.screens.some(
    (s) => s.semanticMap && s.semanticMap.length > 0
  );

  parts.push("## 입력 소스");
  parts.push(
    "- **라이브 트리**: Figma MCP 서버가 연결되어 있으면 각 화면을 MCP로 직접 읽어옵니다. 각 `screens/<slug>/meta.json`의 `rootLabel`로 Figma 프레임을 찾으세요."
  );
  parts.push("- **아이콘**: `icons/` 폴더의 SVG 파일들. `icons/_manifest.json`에 `{screen, localId, file, path}` 매핑이 있습니다. 각 화면의 `tree.json`(포함된 경우) 또는 MCP 트리의 `iconId` 필드를 manifest로 역참조해서 필요한 SVG만 Read하세요.");
  if (input.includeTreeJson) {
    parts.push("- **트리**: 각 화면의 `screens/<slug>/tree.json` (MCP 없는 환경용 스냅샷).");
  }
  if (input.ldsReference.trim()) parts.push("- **디자인 시스템**: `lds.md` 참조.");
  if (hasHealthReport) {
    parts.push("- **파일 품질 리포트**: `screens/<slug>/health-report.md` — 해당 화면의 알려진 약점. 변환 시 보정하세요.");
  }
  if (input.flow && input.flow.length > 0) {
    parts.push("- **프로토타입 플로우**: `flow.md` — 화면 간 네비게이션. 라우팅/핸들러를 이에 맞춰 연결하세요.");
  }
  if (hasSemanticMap) {
    parts.push("- **시맨틱 네이밍 맵**: `screens/<slug>/semantic-map.json` — 원본 레이어 이름 대신 이 매핑된 이름을 JSX 주석/식별자로 사용.");
  }
  parts.push("");

  parts.push("## 라이브러리 컴포넌트 (컴포넌트 참조 시 이 이름을 verbatim 사용)");
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
      `_${input.libraryComponents.length - cleanComponents.length}개 항목이 deprecated/placeholder로 간주되어 제외됨._`
    );
  }
  if (variantByName.size > 0) {
    parts.push("");
    parts.push(
      "_variant property 표기: 괄호 안 값만 유효한 조합. 다른 조합을 만들어내지 말 것._"
    );
  }
  parts.push("");

  // 디자인 토큰 enumeration — AI가 리터럴 값 대신 이 변수명만 쓰게 강제.
  const tokenFiles = Object.entries(FOUNDATION_TOKEN_NAMES_BY_FILE).filter(
    ([, names]) => names.length > 0
  );
  if (tokenFiles.length > 0) {
    parts.push("## 사용 가능한 디자인 토큰");
    parts.push(
      "아래 CSS 변수만 사용. 색상/타이포/간격은 **리터럴 값 금지** — 반드시 `var(--name)` 참조. " +
        "원본 정의와 값은 `foundation/` 디렉토리의 CSS 파일 참고. 여기 없는 토큰을 지어내지 말 것."
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

  return parts.join("\n");
}

function renderReadmeMd(input: ExportPackInput, slugs: string[]): string {
  const totalIcons = input.screens.reduce(
    (acc, s) => acc + Object.keys(s.iconMap).length,
    0
  );
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
    "- `PROMPT.md` — 시스템 프롬프트 + 변환 지침",
    "- `README.md` — 이 파일",
    "- `icons/` — 추출된 아이콘 SVG + `_manifest.json` (화면별 localId → file 매핑)",
    "- `screens/<slug>/` — 화면별 메타/리포트" + (input.includeTreeJson ? "/트리" : ""),
    "- `foundation/` — 디자인 토큰 CSS (변수 정의/값)",
    input.ldsReference.trim() ? "- `lds.md` — 디자인 시스템 레퍼런스" : null,
    input.flow && input.flow.length > 0 ? "- `flow.md` — 프로토타입 네비게이션 그래프" : null,
    "",
    "## 화면 목록",
    ...input.screens.map((s, i) => `- \`screens/${slugs[i]}/\` — ${s.rootLabel}`)
  ];
  return lines.filter((v): v is string => v !== null).join("\n");
}

function renderFlowMd(
  links: FlowLink[],
  screens: ExportPackScreen[],
  slugs: string[]
): string {
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
        `- **${link.from.nodeName}** (${link.trigger}) → \`${link.action}\` → ${link.to.screen} (\`screens/${toSlug}/\`)`
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
  used: Set<string>
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
