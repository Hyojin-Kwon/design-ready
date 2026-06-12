import { useEffect, useMemo, useState } from "preact/hooks";
import type {
  ApplyNamingItem,
  AutofixItem,
  Category,
  Issue,
  NamingSuggestion,
  ScanResult
} from "../../types";
import { AUTOFIX_RULE_IDS } from "../../types";
import { IssueRow } from "../components/IssueRow";

const CATEGORY_LABELS: Record<Category, string> = {
  naming: "네이밍",
  layout: "레이아웃",
  system: "시스템",
  style: "스타일",
  hygiene: "청결도"
};

type IssueFilter = "all" | Exclude<Category, "hygiene">;

const FILTERS: Array<{ id: IssueFilter; label: string }> = [
  { id: "all", label: "전체" },
  { id: "naming", label: CATEGORY_LABELS.naming },
  { id: "layout", label: CATEGORY_LABELS.layout },
  { id: "system", label: CATEGORY_LABELS.system },
  { id: "style", label: CATEGORY_LABELS.style }
];

interface Props {
  result: ScanResult | null;
  loading: boolean;
  error: string | null;
  deletedIds: Set<string>;
  deletingIds: Set<string>;
  fixedIssueIds: Set<string>;
  fixingIssueIds: Set<string>;
  fixFailures: Map<string, string>;
  combinedSuggestions: NamingSuggestion[];
  appliedIds: Set<string>;
  applyingIds: Set<string>;
  applyError: string | null;
  replacedIds: Set<string>;
  replacingIds: Set<string>;
  replaceError: string | null;
  invalidLdsKeys: Set<string>;
  initialCategory: Category | null;
  onScan: () => void;
  onSelectNode: (nodeId: string, hint?: string) => void;
  onDelete: (nodeIds: string[]) => void;
  onAutofix: (items: AutofixItem[]) => void;
  onApplyNaming: (items: ApplyNamingItem[], mode: "rename" | "map-only") => void;
  onReplaceWithLds: (items: Array<{ nodeId: string; componentKey: string }>) => void;
}

function isAutofixable(issue: Issue): boolean {
  return AUTOFIX_RULE_IDS.has(issue.ruleId);
}

function toAutofixItem(issue: Issue): AutofixItem {
  return { issueId: issue.id, nodeId: issue.nodeId, ruleId: issue.ruleId };
}

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 } as const;

const CLEANUP_RULE_IDS = new Set([
  "unused-hidden-layer",
  "zero-opacity",
  "empty-frame"
]);

function isCleanup(issue: Issue): boolean {
  return CLEANUP_RULE_IDS.has(issue.ruleId);
}

function toFilter(c: Category | null): IssueFilter {
  if (c === null || c === "hygiene") return "all";
  return c;
}

export function FixTab({
  result,
  loading,
  error,
  deletedIds,
  deletingIds,
  fixedIssueIds,
  fixingIssueIds,
  fixFailures,
  combinedSuggestions,
  appliedIds,
  applyingIds,
  applyError,
  replacedIds,
  replacingIds,
  replaceError,
  invalidLdsKeys,
  initialCategory,
  onScan,
  onSelectNode,
  onDelete,
  onAutofix,
  onApplyNaming,
  onReplaceWithLds
}: Props) {
  const [filter, setFilter] = useState<IssueFilter>(toFilter(initialCategory));

  // Sync filter when deep-link arrives.
  useEffect(() => {
    if (initialCategory) setFilter(toFilter(initialCategory));
  }, [initialCategory]);

  const allIssues = result?.health.issues ?? [];
  const visibleIssues = allIssues.filter(
    (i) => !deletedIds.has(i.nodeId) && !fixedIssueIds.has(i.id)
  );
  const cleanupIssues = visibleIssues.filter(isCleanup);
  const otherIssues = useMemo(
    () =>
      visibleIssues
        .filter((i) => !isCleanup(i))
        .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]),
    [visibleIssues]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: otherIssues.length };
    for (const issue of otherIssues) {
      counts[issue.category] = (counts[issue.category] ?? 0) + 1;
    }
    return counts;
  }, [otherIssues]);

  const filteredIssues = filter === "all"
    ? otherIssues
    : otherIssues.filter((i) => i.category === filter);

  const anyDeleting = deletingIds.size > 0;
  const anyFixing = fixingIssueIds.size > 0;
  const anyApplying = applyingIds.size > 0;
  const anyReplacing = replacingIds.size > 0;

  // nodeId → suggestion lookup for inline naming UI
  const suggestionByNode = useMemo(() => {
    const m = new Map<string, NamingSuggestion>();
    for (const s of combinedSuggestions) m.set(s.nodeId, s);
    return m;
  }, [combinedSuggestions]);

  const namingIssuesCount = otherIssues.filter((i) => i.category === "naming").length;

  // system 카테고리 이슈(디태치 LDS 후보)를 가진 노드 집합.
  // 네이밍 일괄 변경 전에 LDS 교체를 먼저 해야 원본 이름 기반 매칭이 살아있다.
  // 이름부터 바꿔버리면 재스캔 시 변경된 이름으로 findLdsMatch가 돌아 엉뚱한 컴포넌트와 매칭됨.
  const systemIssueNodeIds = useMemo(() => {
    const s = new Set<string>();
    for (const i of otherIssues) if (i.category === "system") s.add(i.nodeId);
    return s;
  }, [otherIssues]);

  const pendingNamingSuggestions = combinedSuggestions.filter(
    (s) =>
      !appliedIds.has(s.nodeId) &&
      !replacedIds.has(s.nodeId) &&
      // 디태치 LDS 후보는 LDS 교체가 원본 이름을 자동 승계하므로 배치 리네임에서 제외.
      !systemIssueNodeIds.has(s.nodeId)
  );

  // 네이밍 카테고리 전용: 제안이 있는 행. 이름 변경만 노출 (LDS 교체는 system 탭에서 처리).
  const renderSuggestionRow = (issue: Issue, s: NamingSuggestion) => {
    const applied = appliedIds.has(issue.nodeId);
    const replaced = replacedIds.has(issue.nodeId);
    const applying = applyingIds.has(issue.nodeId);
    const done = applied || replaced;
    const failMsg = fixFailures.get(issue.id);
    // 같은 노드가 system 이슈(디태치 LDS 후보)도 가진 경우: 이름 먼저 바꾸면 LDS 매칭 오염됨.
    const hasSystemIssue = systemIssueNodeIds.has(issue.nodeId);

    return (
      <div class={`suggestion-row ${done ? "applied" : ""}`} key={issue.id}>
        <IssueRow issue={issue} onSelect={onSelectNode} />
        <div class="suggestion-names">
          <span class="suggestion-current">
            {done ? s.suggestedName : s.currentName}
          </span>
          {!done && (
            <>
              <span class="suggestion-arrow">→</span>
              <span class="suggestion-new">{s.suggestedName}</span>
            </>
          )}
          {hasSystemIssue && !done && (
            <span class="badge" title="이 노드는 디태치 LDS 후보이기도 함 — LDS 교체를 먼저 하면 이름이 자동 반영됨">
              LDS 교체 권장
            </span>
          )}
          {applied && <span class="badge success">적용됨</span>}
        </div>
        {failMsg && <div class="fix-fail">⚠ {failMsg}</div>}
        {!done && (
          <div class="suggestion-actions">
            <button
              class="btn"
              disabled={applying || anyApplying}
              onClick={() =>
                onApplyNaming(
                  [{ nodeId: s.nodeId, suggestedName: s.suggestedName }],
                  "rename"
                )
              }
              title={
                hasSystemIssue
                  ? "⚠ 이 노드는 디태치 LDS 후보입니다. 이름을 먼저 바꾸면 다음 스캔에서 LDS 매칭이 엉킬 수 있습니다. 시스템 탭에서 LDS 교체를 먼저 권장."
                  : "Figma 레이어 이름 변경"
              }
            >
              {applying ? "적용 중..." : "네이밍만 변경"}
            </button>
          </div>
        )}
      </div>
    );
  };

  // 네이밍 카테고리 전용: 제안이 아직 없는 행. 룰이 이름을 못 만든 케이스 — 수동 확인만 안내.
  const renderNamingNoSuggestionRow = (issue: Issue) => {
    const failMsg = fixFailures.get(issue.id);
    return (
      <div class="suggestion-row" key={issue.id}>
        <IssueRow issue={issue} onSelect={onSelectNode} />
        {failMsg && <div class="fix-fail">⚠ {failMsg}</div>}
      </div>
    );
  };

  // 시스템 카테고리 전용: IssueRow + (LDS 매칭 있으면) "LDS로 교체" 버튼. 이름 변경 UI 없음.
  const renderSystemRow = (issue: Issue) => {
    const s = suggestionByNode.get(issue.nodeId);
    const replaced = replacedIds.has(issue.nodeId);
    const replacing = replacingIds.has(issue.nodeId);
    const applied = appliedIds.has(issue.nodeId);
    const done = applied || replaced;
    const keyInvalid = Boolean(s?.ldsComponentKey && invalidLdsKeys.has(s.ldsComponentKey));
    const canReplace = Boolean(s?.ldsComponentKey) && !done && !keyInvalid;
    const failMsg = fixFailures.get(issue.id);
    // 매칭 후보가 없거나(stale 포함) 교체 실패 후 key가 무효화된 경우 수동 안내.
    const noMatch = (!s?.ldsComponentKey || keyInvalid) && !done;

    return (
      <div class={`suggestion-row ${done ? "applied" : ""}`} key={issue.id}>
        <IssueRow issue={issue} onSelect={onSelectNode} />
        {failMsg && <div class="fix-fail">⚠ {failMsg}</div>}
        {canReplace && (
          <div class="suggestion-actions">
            <button
              class="btn"
              disabled={replacing || anyReplacing}
              onClick={() =>
                onReplaceWithLds([
                  { nodeId: issue.nodeId, componentKey: s!.ldsComponentKey as string }
                ])
              }
              title="디태치 프레임을 LDS 인스턴스로 교체 (오버라이드는 사라짐)"
            >
              {replacing ? "교체 중..." : "LDS로 교체"}
            </button>
          </div>
        )}
        {noMatch && (
          <div class="suggestion-actions">
            {keyInvalid && (
              <span
                class="badge"
                title="라이브러리 추출 시점 이후 원본 컴포넌트가 재발행/삭제되어 key가 달라졌을 수 있습니다. 설정 탭에서 라이브러리를 재추출하면 최신 key로 다시 스캔 가능합니다."
                style={{ background: "#fef3c7", color: "#92400e" }}
              >
                ⚠ 라이브러리 재추출 필요
              </span>
            )}
            <button
              class="btn"
              onClick={() => {
                // 저신뢰 매칭이 있으면 후보 이름을 힌트로 노출 (유저가 Assets에서 검색 가능).
                const hint = keyInvalid
                  ? `이 컴포넌트 key가 라이브러리에 없습니다 (재발행/삭제 추정). "설정 탭 → 라이브러리 재추출" 후 다시 스캔하거나, Assets 패널(Shift+I)에서 "${s?.suggestedName ?? ""}"을 직접 찾아 덮어쓰세요.`
                  : s?.suggestedName
                  ? `후보: "${s.suggestedName}" — Assets 패널(Shift+I)에서 이 이름으로 검색 후 드래그하거나, 기존 인스턴스 복사해 이 자리에 덮어쓰세요.`
                  : `LDS 매칭 후보 없음. Assets 패널(Shift+I)에서 원본을 직접 찾아 드래그하거나, 기존 인스턴스 복사해 이 자리에 덮어쓰세요.`;
                onSelectNode(issue.nodeId, hint);
              }}
              title="이 프레임을 Figma 뷰포트에서 선택 — Assets 패널에서 원본 컴포넌트를 찾아 수동 교체"
            >
              Figma에서 선택 · 수동 재연결
            </button>
          </div>
        )}
      </div>
    );
  };

  // layout / style / hygiene: IssueRow + autofix 버튼(가능 시).
  const renderAutofixRow = (issue: Issue) => {
    const failMsg = fixFailures.get(issue.id);
    const fixable = isAutofixable(issue);
    return (
      <div class="suggestion-row" key={issue.id}>
        <IssueRow issue={issue} onSelect={onSelectNode} />
        {failMsg && <div class="fix-fail">⚠ {failMsg}</div>}
        {fixable && (
          <div class="suggestion-actions">
            <button
              class="btn"
              disabled={fixingIssueIds.has(issue.id) || anyFixing}
              onClick={() => onAutofix([toAutofixItem(issue)])}
            >
              {fixingIssueIds.has(issue.id) ? "..." : "자동 수정"}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div class="tab-with-sticky">
      {error && <div class="error">{error}</div>}
      {fixFailures.size > 0 && (
        <div class="error">
          {fixFailures.size}개 자동 수정 실패 — 아래 해당 이슈에서 상세 사유 확인
        </div>
      )}
      {applyError && <div class="error">{applyError}</div>}
      {replaceError && <div class="error">{replaceError}</div>}

      {!result && !loading && !error && (
        <div class="empty">프레임이나 페이지를 선택하고 "스캔"을 눌러주세요.</div>
      )}

      {result && (
        <>
          {cleanupIssues.length > 0 && (
            <>
              <div class="section-header">
                <div class="section-title" style={{ margin: 0 }}>
                  삭제 후보 <span class="badge">{cleanupIssues.length}</span>
                </div>
                <button
                  class="btn"
                  disabled={anyDeleting}
                  onClick={() => onDelete(cleanupIssues.map((i) => i.nodeId))}
                >
                  {anyDeleting ? "삭제 중..." : "전체 삭제"}
                </button>
              </div>
              <div class="issue-list">
                {cleanupIssues.map((issue) => (
                  <div class="suggestion-row" key={issue.id}>
                    <IssueRow issue={issue} onSelect={onSelectNode} />
                    <div class="suggestion-actions">
                      <button
                        class="btn"
                        disabled={deletingIds.has(issue.nodeId) || anyDeleting}
                        onClick={() => onDelete([issue.nodeId])}
                      >
                        {deletingIds.has(issue.nodeId) ? "..." : "삭제"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {otherIssues.length === 0 ? (
            <div class="empty">
              {cleanupIssues.length > 0
                ? "삭제 후보 외에는 이슈가 없습니다."
                : "이슈를 찾지 못했습니다. 깔끔하네요."}
            </div>
          ) : (
            <>
              <div class="filter-chips">
                {FILTERS.map((f) => {
                  const count = categoryCounts[f.id] ?? 0;
                  return (
                    <button
                      key={f.id}
                      class={`chip ${filter === f.id ? "active" : ""}`}
                      disabled={f.id !== "all" && count === 0}
                      onClick={() => setFilter(f.id)}
                    >
                      {f.label} <span class="chip-count">{count}</span>
                    </button>
                  );
                })}
              </div>

              {filter === "naming" && namingIssuesCount > 0 && (
                <div class="autofix-bar">
                  <div style={{ flex: 1, fontSize: 12, color: "var(--text-muted)" }}>
                    네이밍 제안 {combinedSuggestions.length}개 ·{" "}
                    {appliedIds.size + replacedIds.size}개 처리됨 · 디태치 LDS 후보는 제외
                  </div>
                  <button
                    class="btn primary"
                    disabled={anyApplying || pendingNamingSuggestions.length === 0}
                    onClick={() =>
                      onApplyNaming(
                        pendingNamingSuggestions.map((s) => ({
                          nodeId: s.nodeId,
                          suggestedName: s.suggestedName
                        })),
                        "rename"
                      )
                    }
                    title="디태치 LDS 후보를 제외한 나머지 네이밍 제안을 일괄 적용"
                  >
                    {anyApplying
                      ? "변경 중..."
                      : `네이밍 전체 변경 (${pendingNamingSuggestions.length})`}
                  </button>
                </div>
              )}

              {filter !== "all" && filter !== "naming" && (() => {
                const autofixableInFilter = filteredIssues.filter(isAutofixable);
                const hasAny = autofixableInFilter.length > 0;
                // LDS 교체는 system 탭에서만 (디태치 인스턴스 전용)
                const ldsReplaceable = filter === "system"
                  ? filteredIssues
                      .map((i) => suggestionByNode.get(i.nodeId))
                      .filter((s): s is NamingSuggestion =>
                        !!s &&
                        !!s.ldsComponentKey &&
                        !invalidLdsKeys.has(s.ldsComponentKey) &&
                        !appliedIds.has(s.nodeId) &&
                        !replacedIds.has(s.nodeId)
                      )
                  : [];
                const hasLds = ldsReplaceable.length > 0;
                return (
                  <div class="autofix-bar">
                    <div style={{ flex: 1, fontSize: 12, color: "var(--text-muted)" }}>
                      {hasAny
                        ? <>이 카테고리에서 자동 수정 가능 <strong>{autofixableInFilter.length}</strong>개</>
                        : hasLds
                          ? <>LDS 교체 가능 <strong>{ldsReplaceable.length}</strong>개 — 오버라이드 손실 주의</>
                          : "이 카테고리는 자동 수정 규칙이 없습니다 — 수동 확인 필요"}
                    </div>
                    {hasLds && (
                      <button
                        class="btn"
                        disabled={anyReplacing || anyApplying}
                        onClick={() =>
                          onReplaceWithLds(
                            ldsReplaceable.map((s) => ({
                              nodeId: s.nodeId,
                              componentKey: s.ldsComponentKey as string
                            }))
                          )
                        }
                        title="디태치 인스턴스를 LDS 컴포넌트로 일괄 교체 (오버라이드는 사라짐)"
                      >
                        {anyReplacing ? "교체 중..." : `전체 LDS로 교체 (${ldsReplaceable.length})`}
                      </button>
                    )}
                    {filter !== "style" && filter !== "system" && (
                      <button
                        class="btn primary"
                        disabled={!hasAny || anyFixing}
                        onClick={() => onAutofix(autofixableInFilter.map(toAutofixItem))}
                        title={hasAny ? "" : "이 카테고리는 자동 수정 규칙이 없습니다"}
                      >
                        {anyFixing ? "수정 중..." : "일괄 자동 수정"}
                      </button>
                    )}
                  </div>
                );
              })()}

              {filteredIssues.length === 0 ? (
                <div class="empty">이 카테고리에는 이슈가 없습니다.</div>
              ) : (
                <div class="issue-list">
                  {filteredIssues.map((issue) => {
                    if (issue.category === "naming") {
                      // 디태치 LDS 후보 노드는 네이밍 제안을 노출하지 않음.
                      // (이름을 먼저 바꾸면 LDS 매칭 오염 → system 탭에서 LDS 교체하면 이름 자동 승계됨)
                      if (systemIssueNodeIds.has(issue.nodeId)) {
                        return renderNamingNoSuggestionRow(issue);
                      }
                      const s = suggestionByNode.get(issue.nodeId);
                      return s
                        ? renderSuggestionRow(issue, s)
                        : renderNamingNoSuggestionRow(issue);
                    }
                    if (issue.category === "system") {
                      return renderSystemRow(issue);
                    }
                    return renderAutofixRow(issue);
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}
      <div class="toolbar-sticky">
        <button class="btn primary full" onClick={onScan} disabled={loading}>
          {loading ? "스캔 중..." : result ? "다시 스캔" : "스캔"}
        </button>
      </div>
    </div>
  );
}
