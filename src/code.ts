import { collectAiCandidates } from "./ai/semanticInfer";
import { computeCodeReadiness } from "./analyzers/codeReadiness";
import { runHealthCheck } from "./analyzers/healthCheck";
import { proposeSemanticNames } from "./analyzers/semanticNaming";
import { walk } from "./utils/nodeTraversal";
import type {
  ApplyNamingResult,
  DeleteNodesResult,
  PluginMessage,
  PluginSettings,
  ReplaceWithLdsResult,
  ScanResult
} from "./types";

const SETTINGS_KEY = "design-ready-settings";
const DEFAULT_SETTINGS: PluginSettings = {
  apiKey: "",
  model: "claude-haiku-4-5-20251001",
  aiEnabled: false,
  ldsReference: ""
};

async function loadSettings(): Promise<PluginSettings> {
  const stored = await figma.clientStorage.getAsync(SETTINGS_KEY);
  if (!stored || typeof stored !== "object") return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...stored };
}

async function saveSettings(settings: PluginSettings): Promise<void> {
  await figma.clientStorage.setAsync(SETTINGS_KEY, settings);
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
      const parent = main.parent;
      const name =
        parent && parent.type === "COMPONENT_SET" ? parent.name : main.name;
      const key =
        parent && parent.type === "COMPONENT_SET" ? parent.key : main.key;
      if (!key) continue;
      if (!seen.has(name)) {
        seen.set(name, { name, key });
        instanceCaptured += 1;
      }
    } catch {
      // ignore per-instance errors
    }
  }

  const localComponents = figma.root.findAllWithCriteria({
    types: ["COMPONENT", "COMPONENT_SET"]
  });
  let componentCaptured = 0;
  for (const node of localComponents) {
    if (node.type === "COMPONENT" && node.parent?.type === "COMPONENT_SET") continue;
    const c = node as ComponentNode | ComponentSetNode;
    if (!c.key) continue;
    if (!seen.has(c.name)) {
      seen.set(c.name, { name: c.name, key: c.key });
      componentCaptured += 1;
    }
  }

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

function runScan(): ScanResult {
  const { root, label } = pickScanRoot();
  const health = runHealthCheck(root);
  const suggestions = proposeSemanticNames(root);
  const readiness = computeCodeReadiness(root);
  return { health, suggestions, readiness, scanRoot: label };
}

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (msg.type === "scan:start") {
    try {
      const result = runScan();
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
    if (page) figma.currentPage = page;
    figma.currentPage.selection = [scene];
    figma.viewport.scrollAndZoomIntoView([scene]);
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
    const { root } = pickScanRoot();
    const skipIds = new Set(msg.existingSuggestionIds);
    const contexts = collectAiCandidates(root, skipIds);
    const libraryComponents = await collectLibraryVocabulary(figma.currentPage);
    figma.ui.postMessage({ type: "ai:collected", contexts, libraryComponents });
    return;
  }

  if (msg.type === "library:extract") {
    const payload = await extractLibraryComponents();
    figma.ui.postMessage({ type: "library:extracted", payload });
    figma.notify(`${payload.components.length}개 컴포넌트 추출 완료`);
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
        const component = await figma.importComponentByKeyAsync(item.componentKey);
        console.log("[DesignReady] imported:", component.name);

        const instance = component.createInstance();
        instance.x = frame.x;
        instance.y = frame.y;

        const index = (parent as ChildrenMixin).children.indexOf(frame);
        (parent as ChildrenMixin & { insertChild(i: number, n: SceneNode): void }).insertChild(
          index < 0 ? 0 : index,
          instance
        );
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
