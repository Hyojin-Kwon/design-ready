import { useEffect, useMemo, useRef, useState } from "preact/hooks";
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
import { EmptyState } from "../components/EmptyState";
import { useT } from "../LangContext";

function FixIllust() {
  return (
    <svg width="180" height="160" viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="22" width="136" height="116" rx="8" stroke="#D1D5DB" stroke-width="1.7" fill="#FFFFFF"/>
      <circle cx="42" cy="50" r="7" fill="#111111"/>
      <path d="M38.5 50 L41 52.5 L46 47.5" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <rect x="58" y="46" width="78" height="6" rx="3" fill="#E5E7EB"/>
      <rect x="58" y="56" width="50" height="4" rx="2" fill="#EFEFEF"/>
      <circle cx="42" cy="82" r="7" fill="#111111"/>
      <path d="M38.5 82 L41 84.5 L46 79.5" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <rect x="58" y="78" width="62" height="6" rx="3" fill="#E5E7EB"/>
      <rect x="58" y="88" width="40" height="4" rx="2" fill="#EFEFEF"/>
      <circle cx="42" cy="114" r="7" stroke="#D1D5DB" stroke-width="1.7" fill="#FFFFFF"/>
      <rect x="58" y="110" width="70" height="6" rx="3" fill="#E5E7EB"/>
      <rect x="58" y="120" width="46" height="4" rx="2" fill="#EFEFEF"/>
    </svg>
  );
}

function AllClearIllust() {
  return (
    <svg width="180" height="160" viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="80" r="48" stroke="#D1D5DB" stroke-width="1.7" fill="#FFFFFF"/>
      <circle cx="90" cy="80" r="34" fill="#111111"/>
      <path d="M76 80 L86 90 L106 70" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="34" cy="46" r="3" fill="#E5E7EB"/>
      <circle cx="150" cy="50" r="2.5" fill="#E5E7EB"/>
      <circle cx="146" cy="118" r="3" fill="#E5E7EB"/>
      <circle cx="36" cy="118" r="2.5" fill="#E5E7EB"/>
    </svg>
  );
}

type IssueFilter = "all" | Category;

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
  if (c === null) return "all";
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
  const t = useT();

  const FILTERS: Array<{ id: IssueFilter; label: string }> = [
    { id: "all", label: t.fixAll },
    { id: "naming", label: t.fixNaming },
    { id: "layout", label: t.fixLayout },
    { id: "system", label: t.fixSystem },
    { id: "style", label: t.fixStyle },
    { id: "hygiene", label: t.fixCleanup },
  ];

  const [filter, setFilter] = useState<IssueFilter>(toFilter(initialCategory));
  const chipsRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll for filter chips
  useEffect(() => {
    const el = chipsRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - el.getBoundingClientRect().left;
      scrollLeft = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };
    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = "";
      el.style.userSelect = "";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.getBoundingClientRect().left;
      el.scrollLeft = scrollLeft - (x - startX);
    };
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, [result]);

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
    const counts: Record<string, number> = { all: otherIssues.length, hygiene: cleanupIssues.length };
    for (const issue of otherIssues) {
      counts[issue.category] = (counts[issue.category] ?? 0) + 1;
    }
    return counts;
  }, [otherIssues, cleanupIssues]);

  const filteredIssues = filter === "all"
    ? otherIssues
    : filter === "hygiene"
    ? cleanupIssues
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
            <span class="badge" title="This node is also a detached LDS candidate — replacing with LDS first will inherit the name automatically">
              LDS replace recommended
            </span>
          )}
          {applied && <span class="badge success">Applied</span>}
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
                  ? "⚠ This node is a detached LDS candidate. Renaming first can confuse LDS matching on the next scan. We recommend replacing with LDS from the System tab first."
                  : "Rename the Figma layer"
              }
            >
              {applying ? t.fixApplying : t.fixRenameOnly}
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
              title="Replace the detached frame with an LDS instance (overrides will be lost)"
            >
              {replacing ? "Replacing..." : "Replace with LDS"}
            </button>
          </div>
        )}
        {noMatch && (
          <div class="suggestion-actions">
            {keyInvalid && (
              <span
                class="badge"
                title="The original component may have been republished/deleted since extraction, so its key has changed. Re-extract the library from the Settings tab to scan with the latest keys."
                style={{ background: "#fef3c7", color: "#92400e" }}
              >
                ⚠ Library re-extract needed
              </span>
            )}
            <button
              class="btn"
              onClick={() => {
                // If we have a low-confidence match, expose the candidate name as a hint (user can search in Assets).
                const hint = keyInvalid
                  ? `This component key is not in the library (likely republished/deleted). Re-extract the library from Settings and re-scan, or find "${s?.suggestedName ?? ""}" in the Assets panel (Shift+I) and replace manually.`
                  : s?.suggestedName
                  ? `Candidate: "${s.suggestedName}" — search this name in the Assets panel (Shift+I) and drag it in, or copy an existing instance to overwrite this spot.`
                  : `No LDS match candidate. Find the original in the Assets panel (Shift+I) and drag it in, or copy an existing instance to overwrite this spot.`;
                onSelectNode(issue.nodeId, hint);
              }}
              title="Select this frame in the Figma viewport — then find the original component in the Assets panel and replace manually"
            >
              Select in Figma · Reconnect manually
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
              {fixingIssueIds.has(issue.id) ? "..." : "Auto-fix"}
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
          {fixFailures.size} auto-fix failure(s) — check details on the issue(s) below
        </div>
      )}
      {applyError && <div class="error">{applyError}</div>}
      {replaceError && <div class="error">{replaceError}</div>}

      {!result && !loading && !error && (
        <EmptyState
          illustration={<FixIllust />}
          title={t.fixEmptyTitle}
          description={
            t.fixScan === "Scan" ? (
              <>
                Run a scan first.
                <br />
                Found issues will be listed here with one-click fixes.
              </>
            ) : (
              <>
                먼저 스캔을 실행해 주세요.
                <br />
                발견된 이슈가 여기에 원클릭 수정 옵션과 함께 표시됩니다.
              </>
            )
          }
        />
      )}

      {result && (
        <>
          {otherIssues.length === 0 && cleanupIssues.length === 0 ? (
            <EmptyState
              illustration={<AllClearIllust />}
              title={t.fixAllClearTitle}
              description={
                t.fixScan === "Scan" ? (
                  <>
                    No issues found.
                    <br />
                    Your file is ready for code conversion.
                  </>
                ) : (
                  <>
                    이슈가 없습니다.
                    <br />
                    코드 변환 준비가 완료된 파일입니다.
                  </>
                )
              }
            />
          ) : (
            <>
              <div class="filter-chips" ref={chipsRef}>
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
                    {combinedSuggestions.length} naming suggestion(s) ·{" "}
                    {appliedIds.size + replacedIds.size} processed · detached LDS candidates excluded
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
                    title="Apply all naming suggestions in bulk, excluding detached LDS candidates"
                  >
                    {anyApplying
                      ? "Applying..."
                      : `Rename all (${pendingNamingSuggestions.length})`}
                  </button>
                </div>
              )}

              {filter === "hygiene" && (
                <div class="autofix-bar">
                  <div style={{ flex: 1, fontSize: 12, color: "var(--text-muted)" }}>
                    <strong>{cleanupIssues.length}</strong> hidden / empty layer{cleanupIssues.length !== 1 ? "s" : ""} — safe to delete
                  </div>
                  <button
                    class="btn primary"
                    disabled={anyDeleting}
                    onClick={() => onDelete(cleanupIssues.map((i) => i.nodeId))}
                  >
                    {anyDeleting ? "Deleting..." : `Delete all (${cleanupIssues.length})`}
                  </button>
                </div>
              )}

              {filter !== "all" && filter !== "naming" && filter !== "hygiene" && (() => {
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
                        ? <><strong>{autofixableInFilter.length}</strong> auto-fixable in this category</>
                        : hasLds
                          ? <><strong>{ldsReplaceable.length}</strong> LDS replacement(s) available — overrides will be lost</>
                          : "No auto-fix rules for this category — manual review required"}
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
                        title="Replace all detached instances with LDS components in bulk (overrides will be lost)"
                      >
                        {anyReplacing ? "Replacing..." : `Replace all with LDS (${ldsReplaceable.length})`}
                      </button>
                    )}
                    {filter !== "style" && filter !== "system" && (
                      <button
                        class="btn primary"
                        disabled={!hasAny || anyFixing}
                        onClick={() => onAutofix(autofixableInFilter.map(toAutofixItem))}
                        title={hasAny ? "" : "No auto-fix rules for this category"}
                      >
                        {anyFixing ? "Fixing..." : "Auto-fix all"}
                      </button>
                    )}
                  </div>
                );
              })()}

              {filteredIssues.length === 0 ? (
                <div class="empty">No issues in this category.</div>
              ) : (
                <div class="issue-list">
                  {filteredIssues.map((issue) => {
                    if (issue.category === "hygiene") {
                      return (
                        <div class="suggestion-row" key={issue.id}>
                          <IssueRow issue={issue} onSelect={onSelectNode} />
                          <div class="suggestion-actions">
                            <button
                              class="btn"
                              disabled={deletingIds.has(issue.nodeId) || anyDeleting}
                              onClick={() => onDelete([issue.nodeId])}
                            >
                              {deletingIds.has(issue.nodeId) ? "..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      );
                    }
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
          {loading ? t.checkScanning : result ? t.checkRescan : t.fixScan}
        </button>
      </div>
    </div>
  );
}
