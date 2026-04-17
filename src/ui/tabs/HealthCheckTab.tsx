import { useMemo, useState } from "preact/hooks";
import type { Category, Issue, ScanResult } from "../../types";
import { IssueRow } from "../components/IssueRow";
import { ScoreCard } from "../components/ScoreCard";

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
  scanTarget: string | null;
  deletedIds: Set<string>;
  deletingIds: Set<string>;
  onScan: () => void;
  onSelectNode: (nodeId: string) => void;
  onDelete: (nodeIds: string[]) => void;
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

export function HealthCheckTab({
  result,
  loading,
  error,
  scanTarget,
  deletedIds,
  deletingIds,
  onScan,
  onSelectNode,
  onDelete
}: Props) {
  const [filter, setFilter] = useState<IssueFilter>("all");

  const allIssues = result?.health.issues ?? [];
  const visibleIssues = allIssues.filter((i) => !deletedIds.has(i.nodeId));
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

  return (
    <div>
      <div class="toolbar">
        <button class="btn primary" onClick={onScan} disabled={loading}>
          {loading ? "스캔 중..." : result ? "다시 스캔" : "스캔"}
        </button>
        {scanTarget && <span class="scan-target">{scanTarget}</span>}
      </div>

      {error && <div class="error">{error}</div>}

      {!result && !loading && !error && (
        <div class="empty">프레임이나 페이지를 선택하고 "스캔"을 눌러주세요.</div>
      )}

      {result && (
        <>
          <ScoreCard
            score={result.health.score}
            totalNodes={result.health.totalNodes}
            categories={result.health.categoryScores}
          />

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
                  <div class="cleanup-row" key={issue.id}>
                    <IssueRow issue={issue} onSelect={onSelectNode} />
                    <button
                      class="btn cleanup-delete"
                      disabled={deletingIds.has(issue.nodeId) || anyDeleting}
                      onClick={() => onDelete([issue.nodeId])}
                    >
                      {deletingIds.has(issue.nodeId) ? "..." : "삭제"}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div class="section-title">
            이슈 <span class="badge">{otherIssues.length}</span>
          </div>
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
              {filteredIssues.length === 0 ? (
                <div class="empty">이 카테고리에는 이슈가 없습니다.</div>
              ) : (
                <div class="issue-list">
                  {filteredIssues.map((issue) => (
                    <IssueRow key={issue.id} issue={issue} onSelect={onSelectNode} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
