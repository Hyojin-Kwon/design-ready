import type { Category, CategoryScore } from "../../types";

const CATEGORY_LABELS: Record<Category, string> = {
  naming: "Naming",
  layout: "Layout",
  system: "System",
  style: "Style",
  hygiene: "Hygiene"
};

interface Props {
  score: number;
  totalNodes: number;
  categories: CategoryScore[];
}

export function ScoreCard({ score, totalNodes, categories }: Props) {
  return (
    <div class="score-card">
      <div class="score-value">{score}</div>
      <div class="score-label">
        Health score · {totalNodes} nodes scanned
      </div>
      <div class="category-grid">
        {categories.map((c) => (
          <div class="category-chip" key={c.category}>
            <span class="label">{CATEGORY_LABELS[c.category]}</span>
            <span class="value">{c.passRate}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
