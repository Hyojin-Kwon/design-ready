import type { Category, ReadinessMetric, ReadinessMetricId, ScanResult } from "../../types";
import { CircularGauge } from "../components/CircularGauge";

interface Props {
  result: ScanResult | null;
  onScan: () => void;
  loading: boolean;
  error: string | null;
  onGoToFix: (category?: Category) => void;
}

// Metric → Fix tab category filter mapping.
const METRIC_TO_CATEGORY: Record<ReadinessMetricId, Category> = {
  "semantic-naming": "naming",
  "auto-layout": "layout",
  "component-binding": "system",
  "token-linkage": "style",
  "structure-depth": "layout"
};

function scoreColor(score: number): string {
  if (score >= 80) return "var(--accent)";
  if (score >= 50) return "var(--warning)";
  return "var(--critical)";
}

function MetricRow({
  metric,
  onClick
}: {
  metric: ReadinessMetric;
  onClick: () => void;
}) {
  return (
    <button class="metric-row metric-row-clickable" onClick={onClick}>
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
        <div class="metric-uplift">
          고치면 +{metric.upliftIfFixed}점 · 수정 탭으로 이동 →
        </div>
      )}
    </button>
  );
}

export function DiagnoseTab({
  result,
  onScan,
  loading,
  error,
  onGoToFix
}: Props) {
  return (
    <div class="tab-with-sticky">
      {error && <div class="error">{error}</div>}

      {!result && !loading && !error && (
        <div class="empty">
          프레임이나 페이지를 선택하고 "스캔"을 눌러주세요. 코드 변환 준비도를 5개 항목으로
          평가합니다.
        </div>
      )}

      {result && (
        <>
          <div class="readiness-header">
            <CircularGauge value={result.readiness.score} size={80} />
            <div class="readiness-copy">
              <div class="readiness-title">코드 준비도</div>
              <p class="readiness-desc">
                MCP → 코드 변환 정확도 예상치. 항목을 클릭하면 관련 이슈를 볼 수 있는 수정 탭으로
                이동합니다.
              </p>
            </div>
          </div>

          <div class="metric-list">
            {[...result.readiness.metrics]
              .sort((a, b) => b.upliftIfFixed - a.upliftIfFixed)
              .map((m) => (
                <MetricRow
                  key={m.id}
                  metric={m}
                  onClick={() => onGoToFix(METRIC_TO_CATEGORY[m.id])}
                />
              ))}
          </div>
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
