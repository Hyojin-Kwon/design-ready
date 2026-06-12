import { useEffect, useRef, useState } from "preact/hooks";
import type {
  AiNodeContext,
  ApplyNamingItem,
  AutofixItem,
  LdsTemplateCatalog,
  NameOverride,
  NamingSuggestion,
  PluginMessage,
  PluginSettings,
  ScanResult
} from "../types";
import { callAnthropic } from "../ai/semanticInfer";
import { buildExportPack } from "../export/exportPack";
import { DEFAULT_SYSTEM_PROMPT } from "../export/systemPrompt";
import type { ExportPayload } from "../types";
import type { Category } from "../types";
import { Tabs } from "./components/Tabs";
import { DiagnoseTab } from "./tabs/DiagnoseTab";
import { FixTab } from "./tabs/FixTab";
import { ConversionTab } from "./tabs/ConversionTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { AboutTab } from "./tabs/AboutTab";

const PLUGIN_VERSION = "0.1.0";

// __DEV__: 빌드 타임 플래그 (DESIGN_READY_DEV=true npm run build).
// PROD 빌드 = 일반 사용자용, Settings 탭 대신 About 탭만 노출.
const TABS = [
  { id: "diagnose", label: "진단" },
  { id: "fix", label: "수정" },
  { id: "convert", label: "Export Pack" },
  __DEV__
    ? { id: "settings", label: "설정" }
    : { id: "about", label: "About" }
];

const DEFAULT_SETTINGS: PluginSettings = {
  apiKey: "",
  model: "claude-haiku-4-5-20251001",
  aiEnabled: false,
  ldsReference: ""
};

function post(msg: PluginMessage) {
  parent.postMessage({ pluginMessage: msg }, "*");
}

// 번들 + override 카탈로그 병합 (key 기준 dedupe, override 우선).
function mergeCatalogs(
  bundled: LdsTemplateCatalog | null,
  override: LdsTemplateCatalog | null
): LdsTemplateCatalog | null {
  if (!bundled && !override) return null;
  const byKey = new Map<string, LdsTemplateCatalog["components"][number]>();
  if (bundled) for (const c of bundled.components) byKey.set(c.key, c);
  if (override) for (const c of override.components) byKey.set(c.key, c);
  const components = Array.from(byKey.values()).sort((a, b) => a.name.localeCompare(b.name));
  const source = override ?? bundled!;
  return {
    components,
    sourceFileName: override
      ? `${override.sourceFileName} (+ bundled)`
      : source.sourceFileName,
    extractedAt: source.extractedAt
  };
}

export function App() {
  const [active, setActive] = useState("diagnose");
  const [fixInitialCategory, setFixInitialCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applyingIds, setApplyingIds] = useState<Set<string>>(new Set());
  const [applyError, setApplyError] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [fixedIssueIds, setFixedIssueIds] = useState<Set<string>>(new Set());
  const [fixingIssueIds, setFixingIssueIds] = useState<Set<string>>(new Set());
  const [fixFailures, setFixFailures] = useState<Map<string, string>>(new Map());
  const [replacedIds, setReplacedIds] = useState<Set<string>>(new Set());
  const [replacingIds, setReplacingIds] = useState<Set<string>>(new Set());
  const [replaceError, setReplaceError] = useState<string | null>(null);
  const [invalidLdsKeys, setInvalidLdsKeys] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useState<PluginSettings>(DEFAULT_SETTINGS);
  const settingsRef = useRef<PluginSettings>(DEFAULT_SETTINGS);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<NamingSuggestion[]>([]);
  const [, setAiRunning] = useState(false);
  const [, setAiError] = useState<string | null>(null);
  const [, setAiNotice] = useState<string | null>(null);
  const [extractedLibrary, setExtractedLibrary] = useState<{
    components: Array<{ name: string; key: string }>;
    extractedAt: string;
    pageCount: number;
    instanceCount: number;
    componentCount: number;
  } | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [bundledLdsCatalog, setBundledLdsCatalog] = useState<LdsTemplateCatalog | null>(null);
  const [overrideLdsCatalog, setOverrideLdsCatalog] = useState<LdsTemplateCatalog | null>(null);
  const [ldsTemplateExtracting, setLdsTemplateExtracting] = useState(false);
  const [nameOverrides, setNameOverrides] = useState<Map<string, NameOverride>>(new Map());
  const [exportRunning, setExportRunning] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportBlob, setExportBlob] = useState<{ blob: Blob; filename: string } | null>(null);
  const [exportSummary, setExportSummary] = useState<{
    filename: string;
    screens: number;
    icons: number;
    flowLinks: number;
    optStats?: {
      beforeNodes: number;
      afterNodes: number;
      flattenedGroups: number;
      flattenedFrames: number;
      inferredLayouts: number;
      collapsedRepeats: number;
      truncatedChildren: number;
      totalIconNodes: number;
      uniqueIcons: number;
      iconBytes: number;
    };
  } | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const msg = event.data.pluginMessage as PluginMessage | undefined;
      if (!msg) return;
      if (msg.type === "scan:result") {
        setResult(msg.result);
        setLoading(false);
        setError(null);
        setAppliedIds(new Set());
        setApplyingIds(new Set());
        setApplyError(null);
        setNameOverrides(new Map());
        setDeletedIds(new Set());
        setDeletingIds(new Set());
        setFixedIssueIds(new Set());
        setFixingIssueIds(new Set());
        setFixFailures(new Map());
        setAiSuggestions([]);
        setAiNotice(null);
        setAiError(null);
        setReplacedIds(new Set());
        setReplacingIds(new Set());
        setReplaceError(null);
        setInvalidLdsKeys(new Set());
      } else if (msg.type === "scan:error") {
        setError(msg.message);
        setLoading(false);
      } else if (msg.type === "apply:naming:result") {
        setAppliedIds((prev) => {
          const next = new Set(prev);
          for (const id of msg.result.applied) next.add(id);
          return next;
        });
        setApplyingIds(new Set());
        if (msg.result.failed.length > 0) {
          setApplyError(`${msg.result.failed.length}개 항목 적용 실패`);
        } else {
          setApplyError(null);
        }
      } else if (msg.type === "delete:nodes:result") {
        setDeletedIds((prev) => {
          const next = new Set(prev);
          for (const id of msg.result.deleted) next.add(id);
          return next;
        });
        setDeletingIds(new Set());
      } else if (msg.type === "autofix:result") {
        setFixedIssueIds((prev) => {
          const next = new Set(prev);
          for (const id of msg.result.fixed) next.add(id);
          return next;
        });
        setFixingIssueIds(new Set());
        setFixFailures((prev) => {
          const next = new Map(prev);
          // Clear stale failures for ids that have now succeeded.
          for (const id of msg.result.fixed) next.delete(id);
          for (const f of msg.result.failed) next.set(f.issueId, f.error);
          return next;
        });
      } else if (msg.type === "settings:loaded") {
        setSettings(msg.settings);
        settingsRef.current = msg.settings;
      } else if (msg.type === "settings:saved") {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2000);
      } else if (msg.type === "ai:collected") {
        runAiInference(msg.contexts, msg.libraryComponents);
      } else if (msg.type === "library:extracted") {
        setExtractedLibrary(msg.payload);
        setExtracting(false);
      } else if (msg.type === "lds-template:loaded") {
        setBundledLdsCatalog(msg.bundledCatalog);
        setOverrideLdsCatalog(msg.overrideCatalog);
      } else if (msg.type === "lds-template:extracted") {
        setOverrideLdsCatalog(msg.catalog);
        setLdsTemplateExtracting(false);
        if (msg.download) {
          // 메인테이너가 src/data/ldsCatalog.bundled.json에 커밋할 수 있게 JSON 파일 다운로드
          const blob = new Blob([JSON.stringify(msg.catalog, null, 2)], {
            type: "application/json"
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "ldsCatalog.bundled.json";
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 0);
        }
      } else if (msg.type === "lds-template:cleared") {
        setOverrideLdsCatalog(null);
      } else if (msg.type === "export:prepared") {
        runExport(msg.payload);
      } else if (msg.type === "export:error") {
        setExportError(msg.message);
        setExportRunning(false);
      } else if (msg.type === "replace:lds:result") {
        setReplacedIds((prev) => {
          const next = new Set(prev);
          for (const r of msg.result.replaced) next.add(r.nodeId);
          return next;
        });
        setReplacingIds(new Set());
        if (msg.result.failed.length > 0) {
          const first = msg.result.failed[0];
          const looksLikeKeyIssue =
            first.error.toLowerCase().includes("not found") ||
            first.error.toLowerCase().includes("published");
          const hint = looksLikeKeyIssue
            ? " · 이 key가 현재 라이브러리에 없습니다 (원본 재발행/삭제 추정). 설정 탭 → 라이브러리 재추출 후 다시 스캔하세요. 실패한 항목은 교체 불가로 표시됩니다."
            : "";
          setReplaceError(
            `${msg.result.failed.length}개 교체 실패 — ${first.error}${hint}`
          );
          if (looksLikeKeyIssue) {
            const keysToInvalidate = new Set<string>();
            for (const f of msg.result.failed) {
              const sugg = [...(result?.suggestions ?? []), ...aiSuggestions].find(
                (s) => s.nodeId === f.nodeId
              );
              if (sugg?.ldsComponentKey) keysToInvalidate.add(sugg.ldsComponentKey);
            }
            if (keysToInvalidate.size > 0) {
              setInvalidLdsKeys((prev) => {
                const next = new Set(prev);
                for (const k of keysToInvalidate) next.add(k);
                return next;
              });
            }
          }
        } else {
          setReplaceError(null);
        }
      }
    }
    window.addEventListener("message", onMessage);
    post({ type: "settings:get" });
    post({ type: "lds-template:get" });
    return () => window.removeEventListener("message", onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runAiInference = async (
    contexts: AiNodeContext[],
    libraryComponents: string[]
  ) => {
    if (contexts.length === 0) {
      setAiRunning(false);
      setAiNotice("AI가 추론할 대상이 없습니다. 룰이 이미 대부분 잡은 상태입니다.");
      return;
    }
    const current = settingsRef.current;
    if (!current.apiKey) {
      setAiRunning(false);
      setAiError("API 키가 저장되지 않았습니다. 설정 탭에서 저장 후 다시 시도해주세요.");
      return;
    }
    try {
      const suggestions = await callAnthropic(
        current.apiKey,
        current.model,
        current.ldsReference ?? "",
        libraryComponents,
        contexts
      );
      setAiSuggestions((prev) => mergeSuggestions(prev, suggestions));
      const libHint =
        libraryComponents.length > 0
          ? ` · 라이브러리 컴포넌트 ${libraryComponents.length}개 참조`
          : "";
      setAiNotice(
        `AI가 ${suggestions.length}개 이름을 추가 제안했습니다 (분석 ${contexts.length}개)${libHint}.`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setAiError(message);
    } finally {
      setAiRunning(false);
    }
  };

  const runExport = async (payload: ExportPayload) => {
    try {
      const current = settingsRef.current;
      const screens = payload.screens.map((s) => ({
        rootLabel: s.rootLabel,
        tree: s.tree,
        iconMap: s.iconMap,
        healthReport: s.healthReport,
        semanticMap: s.semanticMap
      }));
      const mergedCatalog = mergeCatalogs(bundledLdsCatalog, overrideLdsCatalog);
      const { blob, filename } = await buildExportPack({
        projectName: payload.projectName,
        screens,
        libraryComponents: payload.libraryComponents,
        ldsTemplateCatalog: mergedCatalog,
        ldsReference: current.ldsReference ?? "",
        systemPrompt: current.systemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT,
        flow: payload.flow,
        includeTreeJson: true,
        libraryImportPath: current.libraryImportPath
      });
      triggerDownload(blob, filename);
      setExportBlob({ blob, filename });
      const iconTotal = payload.screens.reduce(
        (acc, s) => acc + Object.keys(s.iconMap).length,
        0
      );
      setExportSummary({
        filename,
        screens: payload.screens.length,
        icons: iconTotal,
        flowLinks: payload.flow.length,
        optStats: payload.optStats
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setExportError(message);
    } finally {
      setExportRunning(false);
    }
  };

  const onExport = () => {
    setExportRunning(true);
    setExportError(null);
    setExportSummary(null);
    setExportBlob(null);
    const overrides = Array.from(nameOverrides.values());
    post({ type: "export:start", overrides: overrides.length > 0 ? overrides : undefined });
  };

  const onDownload = () => {
    if (exportBlob) triggerDownload(exportBlob.blob, exportBlob.filename);
  };

  const onScan = () => {
    setLoading(true);
    setError(null);
    setExportSummary(null);
    setExportBlob(null);
    setExportError(null);
    post({ type: "scan:start" });
  };

  const onSelectNode = (nodeId: string, hint?: string) => {
    post({ type: "select:node", nodeId, hint });
  };

  const onApplyNaming = (items: ApplyNamingItem[], mode: "rename" | "map-only") => {
    if (items.length === 0) return;
    setApplyError(null);
    if (mode === "map-only") {
      const allSuggestions = combinedSuggestions;
      setNameOverrides((prev) => {
        const next = new Map(prev);
        for (const i of items) {
          const s = allSuggestions.find((x) => x.nodeId === i.nodeId);
          next.set(i.nodeId, {
            nodeId: i.nodeId,
            originalName: s?.currentName ?? "",
            suggestedName: i.suggestedName
          });
        }
        return next;
      });
      setAppliedIds((prev) => {
        const next = new Set(prev);
        for (const i of items) next.add(i.nodeId);
        return next;
      });
      return;
    }
    setApplyingIds((prev) => {
      const next = new Set(prev);
      for (const i of items) next.add(i.nodeId);
      return next;
    });
    post({ type: "apply:naming", items });
  };

  const onReplaceWithLds = (items: Array<{ nodeId: string; componentKey: string }>) => {
    if (items.length === 0) return;
    setReplaceError(null);
    setReplacingIds((prev) => {
      const next = new Set(prev);
      for (const i of items) next.add(i.nodeId);
      return next;
    });
    post({ type: "replace:lds", items });
  };

  const onAutofix = (items: AutofixItem[]) => {
    if (items.length === 0) return;
    // Clear prior failures for items we're retrying.
    setFixFailures((prev) => {
      const next = new Map(prev);
      for (const i of items) next.delete(i.issueId);
      return next;
    });
    setFixingIssueIds((prev) => {
      const next = new Set(prev);
      for (const i of items) next.add(i.issueId);
      return next;
    });
    post({ type: "autofix:apply", items });
  };

  const onDeleteNodes = (nodeIds: string[]) => {
    if (nodeIds.length === 0) return;
    setDeletingIds((prev) => {
      const next = new Set(prev);
      for (const id of nodeIds) next.add(id);
      return next;
    });
    post({ type: "delete:nodes", nodeIds });
  };

  const onSaveSettings = (next: PluginSettings) => {
    setSettings(next);
    settingsRef.current = next;
    post({ type: "settings:save", settings: next });
  };

  const onExtractLibrary = () => {
    setExtracting(true);
    post({ type: "library:extract" });
  };

  const onExtractLdsTemplate = () => {
    setLdsTemplateExtracting(true);
    post({ type: "lds-template:extract" });
  };

  const onClearLdsTemplate = () => {
    post({ type: "lds-template:clear" });
  };

  const combinedSuggestions = result
    ? mergeSuggestions(result.suggestions, aiSuggestions)
    : [];

  return (
    <div class="app">
      <Tabs tabs={TABS} active={active} onChange={setActive} />
      <main class="tab-body">
        {active === "diagnose" && (
          <DiagnoseTab
            result={result}
            loading={loading}
            error={error}
            onScan={onScan}
            onGoToFix={(category) => {
              setFixInitialCategory(category ?? null);
              setActive("fix");
            }}
          />
        )}
        {active === "fix" && (
          <FixTab
            result={result}
            loading={loading}
            error={error}
            deletedIds={deletedIds}
            deletingIds={deletingIds}
            fixedIssueIds={fixedIssueIds}
            fixingIssueIds={fixingIssueIds}
            fixFailures={fixFailures}
            combinedSuggestions={combinedSuggestions}
            appliedIds={appliedIds}
            applyingIds={applyingIds}
            applyError={applyError}
            replacedIds={replacedIds}
            replacingIds={replacingIds}
            replaceError={replaceError}
            invalidLdsKeys={invalidLdsKeys}
            initialCategory={fixInitialCategory}
            onScan={onScan}
            onSelectNode={onSelectNode}
            onDelete={onDeleteNodes}
            onAutofix={onAutofix}
            onApplyNaming={onApplyNaming}
            onReplaceWithLds={onReplaceWithLds}
          />
        )}
        {active === "convert" && (
          <ConversionTab
            running={exportRunning}
            error={exportError}
            summary={exportSummary}
            onExport={onExport}
            onDownload={onDownload}
          />
        )}
        {__DEV__ && active === "settings" && (
          <SettingsTab
            settings={settings}
            onSave={onSaveSettings}
            savedMark={settingsSaved}
            extractedLibrary={extractedLibrary}
            onExtract={onExtractLibrary}
            extracting={extracting}
            bundledLdsCatalog={bundledLdsCatalog}
            overrideLdsCatalog={overrideLdsCatalog}
            onExtractLdsTemplate={onExtractLdsTemplate}
            onClearLdsTemplate={onClearLdsTemplate}
            ldsTemplateExtracting={ldsTemplateExtracting}
          />
        )}
        {!__DEV__ && active === "about" && (
          <AboutTab version={PLUGIN_VERSION} bundledLdsCatalog={bundledLdsCatalog} />
        )}
      </main>
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function mergeSuggestions(
  base: NamingSuggestion[],
  extra: NamingSuggestion[]
): NamingSuggestion[] {
  const map = new Map<string, NamingSuggestion>();
  for (const s of base) map.set(s.nodeId, s);
  for (const s of extra) {
    if (!map.has(s.nodeId)) map.set(s.nodeId, s);
  }
  return Array.from(map.values());
}
