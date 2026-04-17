import type { Category, CategoryScore } from "../../types";

const CATEGORY_LABELS: Record<Category, string> = {
  naming: "네이밍",
  layout: "레이아웃",
  system: "시스템",
  style: "스타일",
  hygiene: "청결도"
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
        헬스 스코어 · {totalNodes}개 노드 스캔
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
