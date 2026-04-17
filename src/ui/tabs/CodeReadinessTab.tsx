import type { ReadinessMetric, ScanResult } from "../../types";
import { CircularGauge } from "../components/CircularGauge";

interface Props {
  result: ScanResult | null;
  onScan: () => void;
  loading: boolean;
}

function scoreColor(score: number): string {
  if (score >= 80) return "var(--accent)";
  if (score >= 50) return "var(--warning)";
  return "var(--critical)";
}

function MetricRow({ metric }: { metric: ReadinessMetric }) {
  return (
    <div class="metric-row">
      <div class="metric-head">
        <span class="metric-label">{metric.label}</span>
        <span class="metric-weight">{metric.weight}%</span>
      </div>
      <div class="metric-bar">
        <div
          class="metric-fill"
          style={{ width: `${metric.score}%`, background: scoreColor(metric.score) }}
        />
      </div>
      <div class="metric-foot">
        <span class="metric-score">{metric.score} / 100</span>
        <span class="metric-sample">
          {metric.sampleSize === 0 ? "대상 없음" : `${metric.passing} / ${metric.sampleSize} 통과`}
        </span>
      </div>
      <div class="metric-hint">{metric.hint}</div>
      {metric.upliftIfFixed > 0 && (
        <div class="metric-uplift">이걸 고치면 총점 +{metric.upliftIfFixed}점</div>
      )}
    </div>
  );
}

export function CodeReadinessTab({ result, onScan, loading }: Props) {
  if (!result) {
    return (
      <div>
        <div class="toolbar">
          <button class="btn primary" onClick={onScan} disabled={loading}>
            {loading ? "스캔 중..." : "스캔"}
          </button>
        </div>
        <div class="empty">
          스캔을 실행하면 이 파일의 MCP → 코드 변환 정확도를 추정합니다.
        </div>
      </div>
    );
  }

  const { readiness } = result;
  const sorted = [...readiness.metrics].sort((a, b) => b.upliftIfFixed - a.upliftIfFixed);

  return (
    <div>
      <div class="readiness-header">
        <CircularGauge value={readiness.score} label="준비도" />
        <div class="readiness-copy">
          <div class="section-title" style={{ margin: 0 }}>
            코드 준비도
          </div>
          <p class="readiness-desc">
            MCP → 코드 변환 정확도 예상치. 5개 항목 가중치 평균.
          </p>
        </div>
      </div>

      <div class="section-title">항목별 점수</div>
      <div class="metric-list">
        {sorted.map((m) => (
          <MetricRow key={m.id} metric={m} />
        ))}
      </div>
    </div>
  );
}
