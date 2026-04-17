import type { Category, CategoryScore, Issue, Severity } from "../types";

const WEIGHTS: Record<Severity, number> = {
  critical: 2,
  warning: 0.8,
  info: 0.25
};

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 2,
  warning: 1,
  info: 0
};

function worstSeverityPerNode(issues: Issue[]): Severity[] {
  const map = new Map<string, Severity>();
  for (const issue of issues) {
    const prev = map.get(issue.nodeId);
    if (!prev || SEVERITY_RANK[issue.severity] > SEVERITY_RANK[prev]) {
      map.set(issue.nodeId, issue.severity);
    }
  }
  return [...map.values()];
}

export function computeScore(totalNodes: number, issues: Issue[]): number {
  if (totalNodes <= 0) return 100;
  const worst = worstSeverityPerNode(issues);
  const penalty = worst.reduce((sum, sev) => sum + WEIGHTS[sev], 0);
  const normalized = (penalty / totalNodes) * 100;
  return Math.max(0, Math.min(100, Math.round(100 - normalized)));
}

const ALL_CATEGORIES: Category[] = ["naming", "layout", "system", "style", "hygiene"];

export function computeCategoryScores(totalNodes: number, issues: Issue[]): CategoryScore[] {
  return ALL_CATEGORIES.map((category) => {
    const categoryIssues = issues.filter((i) => i.category === category);
    const issueNodes = new Set(categoryIssues.map((i) => i.nodeId)).size;
    const passRate = totalNodes > 0 ? Math.max(0, 1 - issueNodes / totalNodes) : 1;
    return {
      category,
      passRate: Math.round(passRate * 100),
      issueCount: categoryIssues.length,
      totalCount: totalNodes
    };
  });
}
