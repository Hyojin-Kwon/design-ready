import type { Issue } from "../../types";

interface Props {
  issue: Issue;
  onSelect: (nodeId: string) => void;
}

export function IssueRow({ issue, onSelect }: Props) {
  return (
    <button class="issue-row" onClick={() => onSelect(issue.nodeId)}>
      <span class={`sev-icon ${issue.severity}`} aria-label={issue.severity} />
      <div class="issue-body">
        <div class="issue-title">{issue.title}</div>
        <div class="issue-node">
          {issue.nodeName} · {issue.nodeType}
        </div>
        <div class="issue-desc">{issue.description}</div>
      </div>
    </button>
  );
}
