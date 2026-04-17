import type { ApplyNamingItem, NamingSuggestion, ScanResult } from "../../types";

interface Props {
  result: ScanResult | null;
  combinedSuggestions: NamingSuggestion[];
  appliedIds: Set<string>;
  applyingIds: Set<string>;
  applyError: string | null;
  replacedIds: Set<string>;
  replacingIds: Set<string>;
  replaceError: string | null;
  invalidLdsKeys: Set<string>;
  aiEnabled: boolean;
  aiRunning: boolean;
  aiError: string | null;
  aiNotice: string | null;
  onSelectNode: (nodeId: string) => void;
  onApply: (items: ApplyNamingItem[]) => void;
  onReplaceWithLds: (items: Array<{ nodeId: string; componentKey: string }>) => void;
  onRunAi: () => void;
}

export function SemanticNamingTab({
  result,
  combinedSuggestions,
  appliedIds,
  applyingIds,
  applyError,
  replacedIds,
  replacingIds,
  replaceError,
  invalidLdsKeys,
  aiEnabled,
  aiRunning,
  aiError,
  aiNotice,
  onSelectNode,
  onApply,
  onReplaceWithLds,
  onRunAi
}: Props) {
  if (!result) {
    return <div class="empty">헬스체크 탭에서 스캔을 먼저 실행해주세요.</div>;
  }

  const suggestions = combinedSuggestions;
  const pending = suggestions.filter(
    (s) => !appliedIds.has(s.nodeId) && !replacedIds.has(s.nodeId)
  );
  const anyApplying = applyingIds.size > 0;
  const anyReplacing = replacingIds.size > 0;

  const applyAll = () => {
    onApply(pending.map((s) => ({ nodeId: s.nodeId, suggestedName: s.suggestedName })));
  };

  const applyOne = (nodeId: string, suggestedName: string) => {
    onApply([{ nodeId, suggestedName }]);
  };

  const replaceOne = (nodeId: string, componentKey: string) => {
    onReplaceWithLds([{ nodeId, componentKey }]);
  };

  return (
    <div>
      <div class="toolbar">
        <button
          class="btn primary"
          onClick={applyAll}
          disabled={pending.length === 0 || anyApplying}
        >
          {anyApplying ? "적용 중..." : `전체 적용 (${pending.length})`}
        </button>
        <button
          class="btn"
          onClick={onRunAi}
          disabled={!aiEnabled || aiRunning}
          title={aiEnabled ? "룰이 못 잡은 노드를 AI로 추가 추론" : "설정 탭에서 AI 활성화 필요"}
        >
          {aiRunning ? "AI 분석 중..." : "AI 추론"}
        </button>
        <span class="scan-target">
          {suggestions.length}개 제안 · {appliedIds.size + replacedIds.size}개 처리됨
        </span>
      </div>

      {applyError && <div class="error">{applyError}</div>}
      {replaceError && <div class="error">{replaceError}</div>}
      {aiError && <div class="error">AI: {aiError}</div>}
      {aiNotice && <div class="notice">{aiNotice}</div>}

      {suggestions.length === 0 ? (
        <div class="empty">이 범위에서는 룰 기반 네이밍 제안이 없습니다.</div>
      ) : (
        <div class="suggestion-list">
          {suggestions.map((s) => {
            const applied = appliedIds.has(s.nodeId);
            const replaced = replacedIds.has(s.nodeId);
            const applying = applyingIds.has(s.nodeId);
            const replacing = replacingIds.has(s.nodeId);
            const done = applied || replaced;
            const fromAi = s.reason.startsWith("AI:");
            const keyInvalid = Boolean(s.ldsComponentKey && invalidLdsKeys.has(s.ldsComponentKey));
            const canReplace = Boolean(s.ldsComponentKey) && !done && !keyInvalid;

            return (
              <div class={`suggestion-row ${done ? "applied" : ""}`} key={s.nodeId}>
                <div
                  class="suggestion-names"
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectNode(s.nodeId)}
                >
                  <span class="suggestion-current">
                    {done ? s.suggestedName : s.currentName}
                  </span>
                  {!done && (
                    <>
                      <span class="suggestion-arrow">→</span>
                      <span class="suggestion-new">{s.suggestedName}</span>
                    </>
                  )}
                  {fromAi && !done && <span class="badge ai-badge">AI</span>}
                  {canReplace && <span class="badge lds-badge">LDS</span>}
                  {keyInvalid && !done && (
                    <span class="badge lds-badge" style={{ background: "#9ca3af" }}>
                      key 없음
                    </span>
                  )}
                  {replaced && <span class="badge success">교체됨</span>}
                  {applied && !replaced && <span class="badge success">적용됨</span>}
                </div>
                <div class="suggestion-reason">{s.reason}</div>
                {!done && (
                  <div class="suggestion-actions">
                    {canReplace && (
                      <button
                        class="btn"
                        disabled={replacing || anyReplacing || applying || anyApplying}
                        onClick={() => replaceOne(s.nodeId, s.ldsComponentKey as string)}
                        title="디태치 프레임을 LDS 인스턴스로 교체 (오버라이드는 사라짐)"
                      >
                        {replacing ? "교체 중..." : "LDS로 교체"}
                      </button>
                    )}
                    <button
                      class="btn"
                      disabled={applying || anyApplying}
                      onClick={() => applyOne(s.nodeId, s.suggestedName)}
                    >
                      {applying ? "적용 중..." : "이름만 적용"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
