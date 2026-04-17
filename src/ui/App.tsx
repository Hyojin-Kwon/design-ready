import { useEffect, useRef, useState } from "preact/hooks";
import type {
  AiNodeContext,
  ApplyNamingItem,
  NamingSuggestion,
  PluginMessage,
  PluginSettings,
  ScanResult
} from "../types";
import { callAnthropic } from "../ai/semanticInfer";
import { Tabs } from "./components/Tabs";
import { HealthCheckTab } from "./tabs/HealthCheckTab";
import { SemanticNamingTab } from "./tabs/SemanticNamingTab";
import { CodeReadinessTab } from "./tabs/CodeReadinessTab";
import { SettingsTab } from "./tabs/SettingsTab";

const TABS = [
  { id: "health", label: "헬스체크" },
  { id: "naming", label: "시맨틱 네이밍" },
  { id: "readiness", label: "코드 준비도" },
  { id: "settings", label: "설정" }
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

export function App() {
  const [active, setActive] = useState("health");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applyingIds, setApplyingIds] = useState<Set<string>>(new Set());
  const [applyError, setApplyError] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [replacedIds, setReplacedIds] = useState<Set<string>>(new Set());
  const [replacingIds, setReplacingIds] = useState<Set<string>>(new Set());
  const [replaceError, setReplaceError] = useState<string | null>(null);
  const [invalidLdsKeys, setInvalidLdsKeys] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useState<PluginSettings>(DEFAULT_SETTINGS);
  const settingsRef = useRef<PluginSettings>(DEFAULT_SETTINGS);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<NamingSuggestion[]>([]);
  const [aiRunning, setAiRunning] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [extractedLibrary, setExtractedLibrary] = useState<{
    components: Array<{ name: string; key: string }>;
    extractedAt: string;
    pageCount: number;
    instanceCount: number;
    componentCount: number;
  } | null>(null);
  const [extracting, setExtracting] = useState(false);

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
        setDeletedIds(new Set());
        setDeletingIds(new Set());
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
            ? " · 이 key가 현재 라이브러리에 존재하지 않습니다. 해당 매칭은 교체 불가로 표시됩니다."
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

  const onScan = () => {
    setLoading(true);
    setError(null);
    post({ type: "scan:start" });
  };

  const onSelectNode = (nodeId: string) => {
    post({ type: "select:node", nodeId });
  };

  const onApplyNaming = (items: ApplyNamingItem[]) => {
    if (items.length === 0) return;
    setApplyError(null);
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

  const onRunAi = () => {
    if (!result) return;
    if (!settings.aiEnabled || !settings.apiKey) {
      setAiError("설정 탭에서 API 키 저장 및 활성화 후 다시 시도해주세요.");
      return;
    }
    setAiRunning(true);
    setAiError(null);
    setAiNotice(null);
    const existing = new Set([
      ...result.suggestions.map((s) => s.nodeId),
      ...aiSuggestions.map((s) => s.nodeId)
    ]);
    post({ type: "ai:collect", existingSuggestionIds: Array.from(existing) });
  };

  const combinedSuggestions = result
    ? mergeSuggestions(result.suggestions, aiSuggestions)
    : [];

  return (
    <div class="app">
      <Tabs tabs={TABS} active={active} onChange={setActive} />
      <main class="tab-body">
        {active === "health" && (
          <HealthCheckTab
            result={result}
            loading={loading}
            error={error}
            scanTarget={result?.scanRoot ?? null}
            deletedIds={deletedIds}
            deletingIds={deletingIds}
            onScan={onScan}
            onSelectNode={onSelectNode}
            onDelete={onDeleteNodes}
          />
        )}
        {active === "naming" && (
          <SemanticNamingTab
            result={result}
            combinedSuggestions={combinedSuggestions}
            appliedIds={appliedIds}
            applyingIds={applyingIds}
            applyError={applyError}
            replacedIds={replacedIds}
            replacingIds={replacingIds}
            replaceError={replaceError}
            invalidLdsKeys={invalidLdsKeys}
            aiEnabled={settings.aiEnabled && settings.apiKey.length > 0}
            aiRunning={aiRunning}
            aiError={aiError}
            aiNotice={aiNotice}
            onSelectNode={onSelectNode}
            onApply={onApplyNaming}
            onReplaceWithLds={onReplaceWithLds}
            onRunAi={onRunAi}
          />
        )}
        {active === "readiness" && (
          <CodeReadinessTab result={result} onScan={onScan} loading={loading} />
        )}
        {active === "settings" && (
          <SettingsTab
            settings={settings}
            onSave={onSaveSettings}
            savedMark={settingsSaved}
            extractedLibrary={extractedLibrary}
            onExtract={onExtractLibrary}
            extracting={extracting}
          />
        )}
      </main>
    </div>
  );
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
