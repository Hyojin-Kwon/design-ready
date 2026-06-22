import type { Category, ReadinessMetric, ReadinessMetricId, ScanResult } from "../../types";
import { CircularGauge } from "../components/CircularGauge";
import { EmptyState } from "../components/EmptyState";
import { useT } from "../LangContext";
import type { T } from "../../i18n";

function DiagnoseIllust() {
  return (
    <svg
      width="180"
      height="160"
      viewBox="0 0 180 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="30"
        y="20"
        width="92"
        height="120"
        rx="8"
        stroke="#D1D5DB"
        stroke-width="1.7"
        fill="#FFFFFF"
      />
      <rect x="42" y="36" width="54" height="6" rx="3" fill="#E5E7EB" />
      <rect x="42" y="50" width="68" height="6" rx="3" fill="#E5E7EB" />
      <rect x="42" y="64" width="46" height="6" rx="3" fill="#E5E7EB" />
      <rect x="42" y="82" width="60" height="6" rx="3" fill="#E5E7EB" />
      <rect x="42" y="96" width="38" height="6" rx="3" fill="#E5E7EB" />
      <circle cx="138" cy="56" r="26" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="3.2" />
      <path
        d="M 138 30 A 26 26 0 1 1 114.5 44.9"
        stroke="#111111"
        stroke-width="3.2"
        stroke-linecap="round"
        fill="none"
      />
      <text
        x="138"
        y="61"
        text-anchor="middle"
        font-family="Pretendard Variable, Pretendard, sans-serif"
        font-size="13"
        font-weight="700"
        fill="#111111"
      >
        82
      </text>
    </svg>
  );
}

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
  "structure-depth": "layout",
};

function scoreColor(score: number): string {
  if (score >= 80) return "var(--chart-accent)";
  if (score >= 50) return "var(--warning)";
  return "var(--critical)";
}

function MetricRow({ metric, t, onClick }: { metric: ReadinessMetric; t: T; onClick: () => void }) {
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
          {metric.sampleSize === 0
            ? t.checkNoTargets
            : t.checkPassing(metric.passing, metric.sampleSize)}
        </span>
      </div>
      <div class="metric-hint">{metric.hint}</div>
      {metric.upliftIfFixed > 0 && (
        <div class="metric-uplift">{t.checkUplift(metric.upliftIfFixed)}</div>
      )}
    </button>
  );
}

export function DiagnoseTab({ result, onScan, loading, error, onGoToFix }: Props) {
  const t = useT();
  return (
    <div class="tab-with-sticky">
      {error && <div class="error">{error}</div>}

      {!result && !loading && !error && (
        <EmptyState
          illustration={<DiagnoseIllust />}
          title={t.checkEmptyTitle}
          description={
            t.checkScan === "Scan" ? (
              <>
                Select a frame or page and press <strong>Scan</strong>.
                <br />
                Code readiness is evaluated across 5 metrics.
              </>
            ) : (
              <>
                프레임 또는 페이지를 선택하고 <strong>스캔</strong>을 눌러주세요.
                <br />
                5가지 지표로 코드 변환 준비도를 평가합니다.
              </>
            )
          }
        />
      )}

      {result && (
        <>
          <div class="readiness-header">
            <CircularGauge value={result.readiness.score} size={80} />
            <div class="readiness-copy">
              <div class="readiness-title">{t.checkReadinessTitle}</div>
              <p class="readiness-desc">{t.checkReadinessDesc}</p>
            </div>
          </div>

          <div class="metric-list">
            {[...result.readiness.metrics]
              .sort((a, b) => b.upliftIfFixed - a.upliftIfFixed)
              .map((m) => (
                <MetricRow
                  key={m.id}
                  metric={m}
                  t={t}
                  onClick={() => onGoToFix(METRIC_TO_CATEGORY[m.id])}
                />
              ))}
          </div>
        </>
      )}
      <div class="toolbar-sticky">
        <button class="btn primary full" onClick={onScan} disabled={loading}>
          {loading ? t.checkScanning : result ? t.checkRescan : t.checkScan}
        </button>
      </div>
    </div>
  );
}
