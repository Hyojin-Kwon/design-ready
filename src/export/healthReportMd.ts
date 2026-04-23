import type { HealthReport } from "../types";

export function renderHealthReportMd(label: string, report: HealthReport): string {
  const lines: string[] = [];
  lines.push(`# Health Report — ${label}`);
  lines.push("");
  lines.push(`- Score: **${report.score}/100**`);
  lines.push(`- Total nodes: ${report.totalNodes}`);
  lines.push(`- Issue count: ${report.issues.length}`);
  lines.push("");

  if (report.categoryScores.length > 0) {
    lines.push("## 카테고리별 통과율");
    for (const cat of report.categoryScores) {
      const pct = Math.round(cat.passRate * 100);
      lines.push(
        `- \`${cat.category}\`: ${pct}% (${cat.totalCount - cat.issueCount}/${cat.totalCount})`
      );
    }
    lines.push("");
  }

  if (report.issues.length === 0) {
    lines.push("## 이슈");
    lines.push("- (없음)");
    return lines.join("\n") + "\n";
  }

  const bySeverity: Record<string, typeof report.issues> = {
    critical: [],
    warning: [],
    info: []
  };
  for (const issue of report.issues) {
    (bySeverity[issue.severity] ?? bySeverity.info).push(issue);
  }

  const headings: Array<[string, string]> = [
    ["critical", "🔴 Critical"],
    ["warning", "🟡 Warning"],
    ["info", "🔵 Info"]
  ];

  lines.push("## 이슈 상세 (변환 시 보정할 약점)");
  lines.push("");
  for (const [key, heading] of headings) {
    const group = bySeverity[key];
    if (group.length === 0) continue;
    lines.push(`### ${heading} (${group.length})`);
    for (const issue of group) {
      lines.push(
        `- **${issue.title}** — ${issue.nodeType} \`${issue.nodeName}\` (${issue.ruleId})`
      );
      if (issue.description) lines.push(`  - ${issue.description}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
