import { collectAiCandidates, collectAiContextsForIds } from "./ai/semanticInfer";
import { serializeNode, extractIcons } from "./ai/conversionSerialize";
import { setExtraFigmaPool } from "./ai/ldsMatch";
import { optimizeTree } from "./ai/treeOptimize";
import { computeCodeReadiness } from "./analyzers/codeReadiness";
import { runHealthCheck } from "./analyzers/healthCheck";
import { proposeSemanticNames } from "./analyzers/semanticNaming";
import { renderHealthReportMd } from "./export/healthReportMd";
import { walk, setTopLevelFilter } from "./utils/nodeTraversal";
import { tryApplyAutoLayout } from "./utils/autoLayoutInfer";
import type {
  ApplyNamingResult,
  AutofixItem,
  AutofixResult,
  DeleteNodesResult,
  ExportFlowLink,
  ExportScreenPayload,
  LdsTemplateCatalog,
  LdsTemplateCatalogEntry,
  PluginMessage,
  PluginSettings,
  ReplaceWithLdsResult,
  ScanResult
} from "./types";

const SETTINGS_KEY = "design-ready-settings";
const LDS_TEMPLATE_CATALOG_KEY = "design-ready-lds-template-catalog";
const DEFAULT_SETTINGS: PluginSettings = {
  apiKey: "",
  model: "claude-haiku-4-5-20251001",
  aiEnabled: false,
  ldsReference: ""
};

// ============================================================================
// 오버라이드 보존 (LDS 교체 시 디자이너 커스텀 내용을 유지).
// 원본 frame 트리를 path(자식 인덱스 배열)로 캡처 → 새 instance의 같은 path 노드에 복원.
// ============================================================================

interface NodeOverride {
  name: string;
  type: SceneNode["type"];
  visible?: boolean;
  characters?: string;
  fontName?: FontName;
  fills?: readonly Paint[];
  strokes?: readonly Paint[];
}

type OverrideMap = Map<string, NodeOverride>;

function captureOverrides(root: SceneNode): OverrideMap {
  const map: OverrideMap = new Map();
  const visit = (node: SceneNode, path: string) => {
    const ov: NodeOverride = { name: node.name, type: node.type };
    if (node.visible === false) ov.visible = false;
    if (node.type === "TEXT") {
      const t = node as TextNode;
      // mixed 폰트면 보존 불가 → skip.
      if (t.fontName !== figma.mixed) {
        ov.characters = t.characters;
        ov.fontName = t.fontName as FontName;
      }
    }
    if ("fills" in node) {
      const fills = (node as GeometryMixin).fills;
      if (Array.isArray(fills)) {
        // IMAGE paint가 있으면 오버라이드 가능성 높음 → 보존. SOLID 색도 보존(스타일 바인딩이 아닌 로컬 값일 수 있음).
        const worth = fills.some((f) => f.type === "IMAGE") || fills.length > 0;
        if (worth) ov.fills = fills as readonly Paint[];
      }
    }
    if ("strokes" in node) {
      const strokes = (node as GeometryMixin).strokes;
      if (Array.isArray(strokes) && strokes.length > 0) {
        ov.strokes = strokes as readonly Paint[];
      }
    }
    map.set(path, ov);
    if ("children" in node) {
      const children = (node as ChildrenMixin).children as readonly SceneNode[];
      children.forEach((c, i) => visit(c, path === "" ? String(i) : `${path}.${i}`));
    }
  };
  visit(root, "");
  return map;
}

async function applyOverrides(root: SceneNode, overrides: OverrideMap): Promise<number> {
  let applied = 0;
  const visit = async (node: SceneNode, path: string): Promise<void> => {
    const ov = overrides.get(path);
    if (ov && ov.type === node.type) {
      // 가시성.
      if (ov.visible === false && node.visible !== false) {
        try { node.visible = false; } catch {}
      }
      // 텍스트.
      if (node.type === "TEXT" && ov.characters != null && ov.fontName) {
        const t = node as TextNode;
        try {
          await figma.loadFontAsync(ov.fontName);
          t.fontName = ov.fontName;
          t.characters = ov.characters;
          applied += 1;
        } catch (err) {
          console.warn("[DesignReady] font/text override failed:", path, err);
        }
      }
      // Fills (IMAGE / SOLID).
      if (ov.fills && "fills" in node) {
        try {
          (node as GeometryMixin).fills = ov.fills as Paint[];
          applied += 1;
        } catch (err) {
          console.warn("[DesignReady] fills override failed:", path, err);
        }
      }
      // Strokes.
      if (ov.strokes && "strokes" in node) {
        try {
          (node as GeometryMixin).strokes = ov.strokes as Paint[];
          applied += 1;
        } catch (err) {
          console.warn("[DesignReady] strokes override failed:", path, err);
        }
      }
    }
    if ("children" in node) {
      const children = (node as ChildrenMixin).children as readonly SceneNode[];
      for (let i = 0; i < children.length; i += 1) {
        await visit(children[i], path === "" ? String(i) : `${path}.${i}`);
      }
    }
  };
  await visit(root, "");
  return applied;
}

async function loadSettings(): Promise<PluginSettings> {
  const stored = await figma.clientStorage.getAsync(SETTINGS_KEY);
  if (!stored || typeof stored !== "object") return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...stored };
}

async function saveSettings(settings: PluginSettings): Promise<void> {
  await figma.clientStorage.setAsync(SETTINGS_KEY, settings);
}

// ============================================================================
// LDS 템플릿 카탈로그 — published 템플릿 파일을 한 번 스캔하면 clientStorage에 캐싱,
// 모든 작업 파일에서 매처 풀에 자동 병합된다.
// ============================================================================

async function loadLdsTemplateCatalog(): Promise<LdsTemplateCatalog | null> {
  const stored = await figma.clientStorage.getAsync(LDS_TEMPLATE_CATALOG_KEY);
  if (!stored || typeof stored !== "object") return null;
  const catalog = stored as LdsTemplateCatalog;
  if (!Array.isArray(catalog.components)) return null;
  return catalog;
}

async function saveLdsTemplateCatalog(catalog: LdsTemplateCatalog): Promise<void> {
  await figma.clientStorage.setAsync(LDS_TEMPLATE_CATALOG_KEY, catalog);
}

async function clearLdsTemplateCatalog(): Promise<void> {
  await figma.clientStorage.deleteAsync(LDS_TEMPLATE_CATALOG_KEY);
}

// 현재 파일이 LDS 템플릿이라고 가정하고 모든 COMPONENT / COMPONENT_SET을 스캔.
// COMPONENT_SET은 set 레벨에서 한 엔트리로 캡처 (variant들은 교체 시 defaultVariant fallback).
// published(팀 라이브러리)된 컴포넌트만 타 파일에서 importComponentByKeyAsync가 먹히므로
// key가 있는 것만 수집. 로컬 unpublished는 필연적으로 타 파일에서 실패하지만
// key 유무만으로는 판별 어려움 — 사용자가 published 파일에서만 실행한다는 전제.
async function extractLdsTemplateCatalog(): Promise<LdsTemplateCatalog> {
  const loader = (figma as unknown as { loadAllPagesAsync?: () => Promise<void> })
    .loadAllPagesAsync;
  if (typeof loader === "function") {
    await loader.call(figma);
  }

  const seenKeys = new Set<string>();
  const entries: LdsTemplateCatalogEntry[] = [];

  const nodes = figma.root.findAllWithCriteria({ types: ["COMPONENT", "COMPONENT_SET"] });
  for (const node of nodes) {
    // COMPONENT_SET 안의 COMPONENT는 skip — set 레벨에서 이미 잡힘.
    if (node.type === "COMPONENT" && node.parent && node.parent.type === "COMPONENT_SET") {
      continue;
    }
    const target = node as ComponentNode | ComponentSetNode;
    const key = target.key;
    if (!key) continue;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    // variant property 정의 추출 — COMPONENT_SET만 가짐. AI가 valid variant 조합을 알게.
    let variantProperties: Record<string, string[]> | undefined;
    if (target.type === "COMPONENT_SET") {
      const defs = (target as unknown as {
        componentPropertyDefinitions?: Record<
          string,
          { type: string; defaultValue: unknown; variantOptions?: string[] }
        >;
      }).componentPropertyDefinitions;
      if (defs) {
        const result: Record<string, string[]> = {};
        for (const [propName, def] of Object.entries(defs)) {
          if (def.type === "VARIANT" && Array.isArray(def.variantOptions)) {
            result[propName] = def.variantOptions;
          }
        }
        if (Object.keys(result).length > 0) variantProperties = result;
      }
    }

    entries.push({ name: target.name, key, variantProperties });
  }

  entries.sort((a, b) => a.name.localeCompare(b.name));

  return {
    components: entries,
    sourceFileName: figma.root.name,
    extractedAt: new Date().toISOString()
  };
}

async function initLdsTemplatePool(): Promise<LdsTemplateCatalog | null> {
  const catalog = await loadLdsTemplateCatalog();
  if (catalog) setExtraFigmaPool(catalog.components);
  return catalog;
}

async function extractLibraryComponents(): Promise<{
  components: Array<{ name: string; key: string }>;
  extractedAt: string;
  pageCount: number;
  instanceCount: number;
  componentCount: number;
}> {
  const loader = (figma as unknown as { loadAllPagesAsync?: () => Promise<void> })
    .loadAllPagesAsync;
  if (typeof loader === "function") {
    await loader.call(figma);
  }

  const seen = new Map<string, { name: string; key: string }>();

  const instances = figma.root.findAllWithCriteria({ types: ["INSTANCE"] });
  let instanceCaptured = 0;
  for (const inst of instances) {
    try {
      const main = await (inst as InstanceNode).getMainComponentAsync();
      if (!main) continue;
      // 원격(팀 라이브러리) 컴포넌트만 importComponentByKeyAsync로 import 가능.
      // 로컬(이 파일에 정의된) 컴포넌트의 key는 import 시도 시 "not found" 실패.
      const parent = main.parent;
      const target: ComponentNode | ComponentSetNode =
        parent && parent.type === "COMPONENT_SET" ? (parent as ComponentSetNode) : main;
      const isRemote = (target as unknown as { remote?: boolean }).remote === true;
      if (!isRemote) continue;
      const name = target.name;
      const key = target.key;
      if (!key) continue;
      if (!seen.has(name)) {
        seen.set(name, { name, key });
        instanceCaptured += 1;
      }
    } catch {
      // ignore per-instance errors
    }
  }

  // 로컬 컴포넌트는 importComponentByKeyAsync로 불러올 수 없어 매칭 후보에서 제외.
  // (로컬 교체가 필요하면 별도 플로우가 필요 — 현재는 원격 라이브러리 교체만 지원.)
  const componentCaptured = 0;

  return {
    components: Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name)),
    extractedAt: new Date().toISOString(),
    pageCount: figma.root.children.length,
    instanceCount: instanceCaptured,
    componentCount: componentCaptured
  };
}

async function collectLibraryVocabulary(root: BaseNode): Promise<string[]> {
  const instances: InstanceNode[] = [];
  walk(root, (node) => {
    if (node.type === "INSTANCE") instances.push(node as InstanceNode);
  });

  const names = new Set<string>();
  for (const instance of instances) {
    try {
      const main = await instance.getMainComponentAsync();
      if (!main) continue;
      const parent = main.parent;
      if (parent && parent.type === "COMPONENT_SET") {
        names.add(parent.name);
      } else {
        names.add(main.name);
      }
    } catch {
      // ignore individual failures
    }
  }
  return Array.from(names).sort();
}

figma.showUI(__html__, { width: 380, height: 620, themeColors: true });

// 캐싱된 LDS 템플릿 catalog가 있으면 매처 풀에 주입. UI에는 "ready" 수신 시 broadcast.
initLdsTemplatePool().catch((err) => console.warn("[DesignReady] lds template init failed:", err));

function pickScanRoot(): { root: BaseNode; label: string } {
  const selection = figma.currentPage.selection;
  if (selection.length === 1) {
    return { root: selection[0], label: selection[0].name };
  }
  if (selection.length > 1) {
    return { root: figma.currentPage, label: `${selection.length} nodes → whole page` };
  }
  return { root: figma.currentPage, label: figma.currentPage.name };
}

// 페이지의 프로토타입 플로우 시작점에서 시작해 reactions을 따라가며
// 연결된 최상위 프레임 ID 집합을 수집. 플로우가 없으면 null.
function collectPrototypeConnectedTopFrameIds(page: PageNode): Set<string> | null {
  const starts = page.flowStartingPoints;
  if (!starts || starts.length === 0) return null;

  const topLevelByDescendantId = new Map<string, string>();
  // 페이지 직계 프레임 ID → 본인 ID. 또한 그 하위 모든 노드 → 최상위 조상 ID 매핑.
  for (const child of page.children) {
    if (child.type !== "FRAME" && child.type !== "COMPONENT" && child.type !== "COMPONENT_SET")
      continue;
    const rootId = child.id;
    const stack: BaseNode[] = [child];
    while (stack.length > 0) {
      const n = stack.pop()!;
      topLevelByDescendantId.set(n.id, rootId);
      if ("children" in n) {
        for (const c of (n as ChildrenMixin).children as readonly SceneNode[]) stack.push(c);
      }
    }
  }

  const connected = new Set<string>();
  const queue: string[] = [];
  for (const s of starts) {
    const topId = topLevelByDescendantId.get(s.nodeId);
    if (topId && !connected.has(topId)) {
      connected.add(topId);
      queue.push(topId);
    }
  }

  const visitReactions = (node: BaseNode) => {
    const reactions = (node as unknown as { reactions?: readonly Reaction[] }).reactions;
    if (!reactions) return;
    for (const r of reactions) {
      const actions: readonly Action[] = r.actions ?? (r.action ? [r.action] : []);
      for (const a of actions) {
        if ("destinationId" in a && a.destinationId) {
          const destTop = topLevelByDescendantId.get(a.destinationId);
          if (destTop && !connected.has(destTop)) {
            connected.add(destTop);
            queue.push(destTop);
          }
        }
      }
    }
  };

  const walkForReactions = (node: BaseNode) => {
    visitReactions(node);
    if ("children" in node) {
      for (const c of (node as ChildrenMixin).children as readonly SceneNode[]) walkForReactions(c);
    }
  };

  while (queue.length > 0) {
    const id = queue.pop()!;
    const node = page.findOne((n) => n.id === id);
    if (node) walkForReactions(node);
  }

  return connected.size > 0 ? connected : null;
}

async function runScan(): Promise<ScanResult> {
  const { root, label } = pickScanRoot();
  // 선택 없이 페이지 전체 스캔일 때만 프로토타입 필터 적용
  let filter: Set<string> | null = null;
  let scanLabel = label;
  if (root.type === "PAGE") {
    filter = collectPrototypeConnectedTopFrameIds(root as PageNode);
    if (filter) scanLabel = `${label} (프로토타입 연결 ${filter.size}개)`;
  }
  setTopLevelFilter(filter);
  try {
    const health = runHealthCheck(root);
    const suggestions = await proposeSemanticNames(root);
    const readiness = computeCodeReadiness(root);
    return { health, suggestions, readiness, scanRoot: scanLabel };
  } finally {
    setTopLevelFilter(null);
  }
}

async function applyAutofix(item: AutofixItem): Promise<void> {
  const node = await figma.getNodeByIdAsync(item.nodeId);
  if (!node) throw new Error("노드를 찾을 수 없습니다");
  if (node.removed) throw new Error("이미 삭제된 노드입니다");
  if (node.type === "DOCUMENT" || node.type === "PAGE") {
    throw new Error("지원하지 않는 노드 타입");
  }
  const scene = node as SceneNode;

  switch (item.ruleId) {
    case "subpixel-position": {
      if (!("x" in scene) || !("y" in scene)) throw new Error("위치를 조정할 수 없는 노드");
      (scene as LayoutMixin).x = Math.round((scene as LayoutMixin).x);
      (scene as LayoutMixin).y = Math.round((scene as LayoutMixin).y);
      return;
    }
    case "subpixel-size": {
      if (!("resize" in scene)) throw new Error("크기를 조정할 수 없는 노드");
      const w = Math.round((scene as LayoutMixin).width);
      const h = Math.round((scene as LayoutMixin).height);
      (scene as LayoutMixin).resize(Math.max(1, w), Math.max(1, h));
      return;
    }
    case "subpixel-spacing": {
      if (scene.type !== "FRAME" && scene.type !== "COMPONENT" && scene.type !== "INSTANCE") {
        throw new Error("오토레이아웃 프레임이 아닙니다");
      }
      const frame = scene as FrameNode;
      if (frame.layoutMode === "NONE") throw new Error("오토레이아웃이 꺼져 있습니다");
      frame.paddingTop = Math.round(frame.paddingTop);
      frame.paddingBottom = Math.round(frame.paddingBottom);
      frame.paddingLeft = Math.round(frame.paddingLeft);
      frame.paddingRight = Math.round(frame.paddingRight);
      frame.itemSpacing = Math.round(frame.itemSpacing);
      return;
    }
    case "single-child-group":
    case "deep-group-nesting": {
      if (scene.type !== "GROUP") throw new Error("그룹이 아닙니다");
      figma.ungroup(scene as GroupNode);
      return;
    }
    case "single-child-frame-wrapper": {
      if (scene.type !== "FRAME") throw new Error("프레임이 아닙니다");
      const frame = scene as FrameNode;
      if (frame.children.length !== 1) throw new Error("자식이 1개가 아닙니다");
      const parent = frame.parent;
      if (!parent || !("insertChild" in parent)) throw new Error("부모가 유효하지 않음");
      const child = frame.children[0];
      const parentIsAutoLayout =
        parent.type === "FRAME" && (parent as FrameNode).layoutMode !== "NONE";
      const index = (parent as ChildrenMixin).children.indexOf(frame);
      if (!parentIsAutoLayout && "x" in child && "y" in child) {
        (child as LayoutMixin).x = frame.x + (child as LayoutMixin).x;
        (child as LayoutMixin).y = frame.y + (child as LayoutMixin).y;
      }
      (parent as ChildrenMixin & { insertChild(i: number, n: SceneNode): void }).insertChild(
        index < 0 ? 0 : index,
        child
      );
      frame.remove();
      return;
    }
    case "empty-frame": {
      scene.remove();
      return;
    }
    case "missing-auto-layout": {
      if (scene.type !== "FRAME") throw new Error("프레임이 아닙니다");
      const result = tryApplyAutoLayout(scene as FrameNode);
      if (!result.applied) throw new Error(result.reason);
      return;
    }
    default:
      throw new Error(`자동 수정이 지원되지 않는 룰: ${item.ruleId}`);
  }
}

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === "scan:start") {
    try {
      const result = await runScan();
      figma.ui.postMessage({ type: "scan:result", result });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      figma.ui.postMessage({ type: "scan:error", message });
    }
    return;
  }

  if (msg.type === "select:node") {
    const node = await figma.getNodeByIdAsync(msg.nodeId);
    if (!node || node.type === "DOCUMENT" || node.type === "PAGE") return;
    const scene = node as SceneNode;
    const page = findOwningPage(scene);
    if (page && page.id !== figma.currentPage.id) {
      const setter = (figma as unknown as {
        setCurrentPageAsync?: (p: PageNode) => Promise<void>;
      }).setCurrentPageAsync;
      if (typeof setter === "function") {
        await setter.call(figma, page);
      } else {
        figma.currentPage = page;
      }
    }
    figma.currentPage.selection = [scene];
    figma.viewport.scrollAndZoomIntoView([scene]);
    if (msg.hint) {
      figma.notify(msg.hint, { timeout: 8000 });
    }
    return;
  }

  if (msg.type === "apply:naming") {
    const result: ApplyNamingResult = { applied: [], failed: [] };
    for (const item of msg.items) {
      try {
        const node = await figma.getNodeByIdAsync(item.nodeId);
        if (!node) {
          result.failed.push({ nodeId: item.nodeId, error: "노드를 찾을 수 없습니다" });
          continue;
        }
        if (node.type === "DOCUMENT" || node.type === "PAGE") {
          result.failed.push({ nodeId: item.nodeId, error: "지원하지 않는 노드 타입" });
          continue;
        }
        if (node.removed) {
          result.failed.push({ nodeId: item.nodeId, error: "삭제된 노드" });
          continue;
        }
        (node as SceneNode).name = item.suggestedName;
        result.applied.push(item.nodeId);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        result.failed.push({ nodeId: item.nodeId, error: message });
      }
    }
    figma.ui.postMessage({ type: "apply:naming:result", result });
    const total = msg.items.length;
    const ok = result.applied.length;
    figma.notify(`${ok}/${total}개 이름 변경 완료`);
    return;
  }

  if (msg.type === "delete:nodes") {
    const result: DeleteNodesResult = { deleted: [], failed: [] };
    for (const nodeId of msg.nodeIds) {
      try {
        const node = await figma.getNodeByIdAsync(nodeId);
        if (!node) {
          result.failed.push({ nodeId, error: "노드를 찾을 수 없습니다" });
          continue;
        }
        if (node.type === "DOCUMENT" || node.type === "PAGE") {
          result.failed.push({ nodeId, error: "지원하지 않는 노드 타입" });
          continue;
        }
        if (node.removed) {
          result.deleted.push(nodeId);
          continue;
        }
        (node as SceneNode).remove();
        result.deleted.push(nodeId);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        result.failed.push({ nodeId, error: message });
      }
    }
    figma.ui.postMessage({ type: "delete:nodes:result", result });
    const total = msg.nodeIds.length;
    const ok = result.deleted.length;
    figma.notify(`${ok}/${total}개 레이어 삭제 완료`);
    return;
  }

  if (msg.type === "settings:get") {
    const settings = await loadSettings();
    figma.ui.postMessage({ type: "settings:loaded", settings });
    return;
  }

  if (msg.type === "settings:save") {
    await saveSettings(msg.settings);
    figma.ui.postMessage({ type: "settings:saved" });
    figma.notify("설정 저장 완료");
    return;
  }

  if (msg.type === "ai:collect") {
    const libraryComponents = await collectLibraryVocabulary(figma.currentPage);
    let contexts;
    if (msg.targetNodeIds && msg.targetNodeIds.length > 0) {
      contexts = await collectAiContextsForIds(msg.targetNodeIds);
    } else {
      const { root } = pickScanRoot();
      const skipIds = new Set(msg.existingSuggestionIds);
      contexts = collectAiCandidates(root, skipIds);
    }
    figma.ui.postMessage({ type: "ai:collected", contexts, libraryComponents });
    return;
  }

  if (msg.type === "library:extract") {
    const payload = await extractLibraryComponents();
    figma.ui.postMessage({ type: "library:extracted", payload });
    figma.notify(`${payload.components.length}개 컴포넌트 추출 완료`);
    return;
  }

  if (msg.type === "lds-template:extract") {
    const catalog = await extractLdsTemplateCatalog();
    await saveLdsTemplateCatalog(catalog);
    setExtraFigmaPool(catalog.components);
    figma.ui.postMessage({ type: "lds-template:extracted", catalog });
    figma.notify(`LDS 템플릿 ${catalog.components.length}개 컴포넌트 캐싱 완료`);
    return;
  }

  if (msg.type === "lds-template:get") {
    const catalog = await loadLdsTemplateCatalog();
    figma.ui.postMessage({ type: "lds-template:loaded", catalog });
    return;
  }

  if (msg.type === "lds-template:clear") {
    await clearLdsTemplateCatalog();
    setExtraFigmaPool([]);
    figma.ui.postMessage({ type: "lds-template:cleared" });
    figma.notify("LDS 템플릿 카탈로그 삭제됨");
    return;
  }

  if (msg.type === "autofix:apply") {
    const result: AutofixResult = { fixed: [], failed: [] };
    for (const item of msg.items) {
      try {
        await applyAutofix(item);
        result.fixed.push(item.issueId);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        result.failed.push({ issueId: item.issueId, error: message });
      }
    }
    figma.ui.postMessage({ type: "autofix:result", result });
    const ok = result.fixed.length;
    const total = msg.items.length;
    if (result.failed.length > 0) {
      const first = result.failed[0];
      figma.notify(`자동 수정 실패 (${ok}/${total}): ${first.error}`, {
        error: true,
        timeout: 5000
      });
    } else {
      figma.notify(`${ok}/${total}개 자동 수정 완료`);
    }
    return;
  }

  if (msg.type === "export:start") {
    try {
      const selection = figma.currentPage.selection;
      if (selection.length === 0) {
        figma.ui.postMessage({
          type: "export:error",
          message: "변환할 프레임을 1개 이상 선택해주세요."
        });
        return;
      }
      const validTypes = new Set(["FRAME", "COMPONENT", "INSTANCE", "SECTION"]);
      const invalid = selection.filter((n) => !validTypes.has(n.type));
      if (invalid.length > 0) {
        figma.ui.postMessage({
          type: "export:error",
          message: "FRAME, COMPONENT, INSTANCE, SECTION만 export 가능합니다."
        });
        return;
      }

      const overrides = msg.overrides ?? [];
      const overridesById = new Map(overrides.map((o) => [o.nodeId, o]));

      const screens: ExportScreenPayload[] = [];
      const libSet = new Set<string>();
      const optStats = {
        beforeNodes: 0,
        afterNodes: 0,
        flattenedGroups: 0,
        flattenedFrames: 0,
        inferredLayouts: 0,
        totalIconNodes: 0,
        uniqueIcons: 0,
        iconBytes: 0
      };
      for (const target of selection) {
        const scene = target as SceneNode;
        const rawTree = await serializeNode(scene);
        const { tree, stats } = optimizeTree(rawTree);
        optStats.beforeNodes += stats.beforeNodes;
        optStats.afterNodes += stats.afterNodes;
        optStats.flattenedGroups += stats.flattenedGroups;
        optStats.flattenedFrames += stats.flattenedFrames;
        optStats.inferredLayouts += stats.inferredLayouts;
        const { iconMap, stats: iconStats } = extractIcons(tree);
        optStats.totalIconNodes += iconStats.totalIconNodes;
        optStats.uniqueIcons += iconStats.uniqueIcons;
        optStats.iconBytes += iconStats.totalBytes;
        const health = runHealthCheck(scene);
        const healthReport = renderHealthReportMd(scene.name, health);

        let semanticMap: ExportScreenPayload["semanticMap"];
        if (overridesById.size > 0) {
          const screenOverrides: NonNullable<ExportScreenPayload["semanticMap"]> = [];
          const visit = (n: { id: string; children?: unknown[] }) => {
            const hit = overridesById.get(n.id);
            if (hit) screenOverrides.push(hit);
            const kids = (n as { children?: Array<{ id: string }> }).children;
            if (kids) for (const k of kids) visit(k as { id: string; children?: unknown[] });
          };
          visit(tree as unknown as { id: string; children?: unknown[] });
          if (screenOverrides.length > 0) semanticMap = screenOverrides;
        }

        screens.push({ rootLabel: scene.name, tree, iconMap, healthReport, semanticMap });
        const vocab = await collectLibraryVocabulary(scene);
        for (const v of vocab) libSet.add(v);
      }

      const flow = collectPrototypeFlow(selection);
      const projectName = selection.length === 1 ? selection[0].name : figma.currentPage.name;

      figma.ui.postMessage({
        type: "export:prepared",
        payload: {
          projectName,
          screens,
          libraryComponents: Array.from(libSet).sort(),
          flow,
          optStats
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      figma.ui.postMessage({ type: "export:error", message });
    }
    return;
  }

  if (msg.type === "replace:lds") {
    const result: ReplaceWithLdsResult = { replaced: [], failed: [] };
    for (const item of msg.items) {
      try {
        const node = await figma.getNodeByIdAsync(item.nodeId);
        if (!node || node.removed) {
          result.failed.push({ nodeId: item.nodeId, error: "노드가 없습니다" });
          continue;
        }
        if (node.type !== "FRAME") {
          result.failed.push({ nodeId: item.nodeId, error: "FRAME만 교체 가능" });
          continue;
        }
        const frame = node as FrameNode;
        const parent = frame.parent;
        if (!parent || !("insertChild" in parent)) {
          result.failed.push({ nodeId: item.nodeId, error: "부모가 유효하지 않음" });
          continue;
        }

        console.log("[DesignReady] importing component key:", item.componentKey);
        // 추출 시 parent COMPONENT_SET 키를 저장했을 수 있음. 그 경우 importComponentByKeyAsync는 실패함.
        // 1) COMPONENT로 import → 실패 2) COMPONENT_SET로 import 후 기본 variant →
        // 실패 3) 로컬 파일에서 같은 key를 가진 COMPONENT/COMPONENT_SET 검색 (로컬 컴포넌트 교체 지원).
        let component: ComponentNode;
        try {
          component = await figma.importComponentByKeyAsync(item.componentKey);
        } catch (firstErr) {
          try {
            const set = await (figma as unknown as {
              importComponentSetByKeyAsync: (key: string) => Promise<ComponentSetNode>;
            }).importComponentSetByKeyAsync(item.componentKey);
            const def =
              (set as unknown as { defaultVariant?: ComponentNode }).defaultVariant ??
              (set.children.find((c) => c.type === "COMPONENT") as ComponentNode | undefined);
            if (!def) throw new Error("COMPONENT_SET에 variant가 없습니다");
            component = def;
          } catch (secondErr) {
            // 로컬 fallback: 현재 파일 내 컴포넌트 중 key 일치하는 노드 탐색.
            const localMatches = figma.root.findAllWithCriteria({
              types: ["COMPONENT", "COMPONENT_SET"]
            });
            let localFound: ComponentNode | null = null;
            for (const n of localMatches) {
              if ((n as ComponentNode | ComponentSetNode).key !== item.componentKey) continue;
              if (n.type === "COMPONENT_SET") {
                const set = n as ComponentSetNode;
                const def =
                  (set as unknown as { defaultVariant?: ComponentNode }).defaultVariant ??
                  (set.children.find((c) => c.type === "COMPONENT") as ComponentNode | undefined);
                if (def) localFound = def;
              } else if (n.type === "COMPONENT") {
                localFound = n as ComponentNode;
              }
              if (localFound) break;
            }
            if (localFound) {
              console.log("[DesignReady] using local component fallback:", localFound.name);
              component = localFound;
            } else {
              const msg = firstErr instanceof Error ? firstErr.message : String(firstErr);
              throw new Error(msg);
            }
          }
        }
        console.log("[DesignReady] imported:", component.name);

        // 원본 frame의 자식 트리에서 텍스트/이미지/컬러 오버라이드를 캡처.
        // 교체 후 path가 일치하는 노드에 다시 적용해서 디자이너 커스텀 내용을 보존.
        const overrides = captureOverrides(frame);

        // 원본 프레임의 지오메트리/레이아웃 속성을 캡처.
        const snapshot = {
          x: frame.x,
          y: frame.y,
          width: frame.width,
          height: frame.height,
          rotation: (frame as unknown as { rotation?: number }).rotation,
          constraints: (frame as unknown as { constraints?: Constraints }).constraints,
          layoutAlign: (frame as unknown as { layoutAlign?: string }).layoutAlign,
          layoutGrow: (frame as unknown as { layoutGrow?: number }).layoutGrow,
          layoutPositioning: (frame as unknown as { layoutPositioning?: "AUTO" | "ABSOLUTE" })
            .layoutPositioning,
          layoutSizingHorizontal: (frame as unknown as {
            layoutSizingHorizontal?: "FIXED" | "HUG" | "FILL";
          }).layoutSizingHorizontal,
          layoutSizingVertical: (frame as unknown as {
            layoutSizingVertical?: "FIXED" | "HUG" | "FILL";
          }).layoutSizingVertical
        };

        const index = (parent as ChildrenMixin).children.indexOf(frame);
        const instance = component.createInstance();

        // 삽입 먼저 (부모 오토레이아웃 문맥 들어간 뒤 sizing 적용해야 반영됨).
        (parent as ChildrenMixin & { insertChild(i: number, n: SceneNode): void }).insertChild(
          index < 0 ? 0 : index,
          instance
        );

        // 절대 위치 복원 (부모가 오토레이아웃이면 layoutPositioning=ABSOLUTE일 때만 효과).
        if (snapshot.layoutPositioning) {
          (instance as unknown as { layoutPositioning?: "AUTO" | "ABSOLUTE" })
            .layoutPositioning = snapshot.layoutPositioning;
        }
        instance.x = snapshot.x;
        instance.y = snapshot.y;
        if (typeof snapshot.rotation === "number") {
          (instance as unknown as { rotation?: number }).rotation = snapshot.rotation;
        }

        // 크기 보존: FIXED로 고정해야 resize가 먹힘 (인스턴스가 HUG면 resize 무시됨).
        try {
          if (snapshot.width > 0 && snapshot.height > 0) {
            const inst = instance as unknown as {
              layoutSizingHorizontal?: "FIXED" | "HUG" | "FILL";
              layoutSizingVertical?: "FIXED" | "HUG" | "FILL";
            };
            // 부모가 오토레이아웃이고 원본이 FILL이었으면 FILL 유지, 아니면 FIXED로 강제.
            if (snapshot.layoutSizingHorizontal === "FILL") {
              inst.layoutSizingHorizontal = "FILL";
            } else {
              try { inst.layoutSizingHorizontal = "FIXED"; } catch {}
            }
            if (snapshot.layoutSizingVertical === "FILL") {
              inst.layoutSizingVertical = "FILL";
            } else {
              try { inst.layoutSizingVertical = "FIXED"; } catch {}
            }
            instance.resize(snapshot.width, snapshot.height);
          }
        } catch (resizeErr) {
          console.warn("[DesignReady] resize failed, using default:", resizeErr);
        }

        // 레거시 오토레이아웃 속성 복원.
        if (snapshot.layoutAlign) {
          try {
            (instance as unknown as { layoutAlign?: string }).layoutAlign = snapshot.layoutAlign;
          } catch {}
        }
        if (typeof snapshot.layoutGrow === "number") {
          try {
            (instance as unknown as { layoutGrow?: number }).layoutGrow = snapshot.layoutGrow;
          } catch {}
        }
        if (snapshot.constraints) {
          try {
            (instance as unknown as { constraints?: Constraints }).constraints =
              snapshot.constraints;
          } catch {}
        }

        // 오버라이드 복원 (텍스트, 이미지 fills, 가시성 등).
        try {
          const appliedCount = await applyOverrides(instance, overrides);
          console.log(`[DesignReady] restored ${appliedCount} overrides on ${instance.name}`);
        } catch (ovErr) {
          console.warn("[DesignReady] override restore failed:", ovErr);
        }

        frame.remove();

        result.replaced.push({ nodeId: item.nodeId, newNodeId: instance.id });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("[DesignReady] replace failed:", item, error);
        result.failed.push({ nodeId: item.nodeId, error: message });
      }
    }
    figma.ui.postMessage({ type: "replace:lds:result", result });
    const ok = result.replaced.length;
    const total = msg.items.length;
    if (result.failed.length > 0) {
      const first = result.failed[0];
      figma.notify(`교체 실패 (${ok}/${total}): ${first.error}`, { error: true, timeout: 6000 });
    } else {
      figma.notify(`${ok}/${total}개 LDS 인스턴스로 교체 완료`);
    }
    return;
  }
};

function findOwningPage(node: BaseNode): PageNode | null {
  let current: BaseNode | null = node;
  while (current) {
    if (current.type === "PAGE") return current;
    current = current.parent;
  }
  return null;
}

function collectPrototypeFlow(selection: readonly SceneNode[]): ExportFlowLink[] {
  const idToLabel = new Map<string, string>();
  for (const s of selection) idToLabel.set(s.id, s.name);

  const links: ExportFlowLink[] = [];

  for (const sourceRoot of selection) {
    const fromScreen = sourceRoot.name;
    const visit = (node: BaseNode) => {
      const reactions = (node as unknown as { reactions?: Array<{
        trigger?: { type?: string };
        action?: { type?: string; navigation?: string; destinationId?: string };
        actions?: Array<{ type?: string; navigation?: string; destinationId?: string }>;
      }> }).reactions;
      if (Array.isArray(reactions)) {
        for (const r of reactions) {
          const actionList = r.actions ?? (r.action ? [r.action] : []);
          for (const a of actionList) {
            const destId = a.destinationId;
            if (!destId || !idToLabel.has(destId)) continue;
            if (destId === sourceRoot.id) continue;
            links.push({
              from: { screen: fromScreen, nodeId: node.id, nodeName: node.name },
              to: { screen: idToLabel.get(destId)! },
              trigger: r.trigger?.type ?? "UNKNOWN",
              action: a.navigation ?? a.type ?? "NAVIGATE"
            });
          }
        }
      }
      if ("children" in node) {
        for (const child of (node as ChildrenMixin).children) visit(child);
      }
    };
    visit(sourceRoot);
  }

  return links;
}
