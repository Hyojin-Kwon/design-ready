import { EmptyState } from "../components/EmptyState";
import { useT } from "../LangContext";

function ExportIllust() {
  return (
    <svg width="180" height="90" viewBox="8 38 168 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="42" width="48" height="64" rx="5" stroke="#E5E7EB" stroke-width="1.7" fill="#FFFFFF"/>
      <rect x="22" y="50" width="48" height="64" rx="5" stroke="#D1D5DB" stroke-width="1.7" fill="#FFFFFF"/>
      <rect x="30" y="58" width="48" height="64" rx="5" stroke="#111111" stroke-width="1.7" fill="#FFFFFF"/>
      <rect x="38" y="68" width="24" height="4" rx="2" fill="#E5E7EB"/>
      <rect x="38" y="76" width="18" height="4" rx="2" fill="#E5E7EB"/>
      <rect x="38" y="92" width="32" height="20" rx="3" fill="#F3F3F3"/>
      <path d="M92 80 L114 80 M108 74 L114 80 L108 86" stroke="#111111" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="124" y="48" width="48" height="64" rx="5" stroke="#D1D5DB" stroke-width="1.7" fill="#FFFFFF"/>
      <path d="M124 64 L172 64" stroke="#D1D5DB" stroke-width="1.7"/>
      <path d="M148 48 L148 64" stroke="#D1D5DB" stroke-width="1.7"/>
      <text x="148" y="92" text-anchor="middle" font-family="Pretendard Variable, Pretendard, sans-serif" font-size="10" font-weight="700" fill="#9CA3AF">.zip</text>
    </svg>
  );
}

interface Props {
  running: boolean;
  error: string | null;
  summary: {
    filename: string;
    screens: number;
    icons: number;
    flowLinks: number;
    optStats?: {
      beforeNodes: number;
      afterNodes: number;
      flattenedGroups: number;
      flattenedFrames: number;
      inferredLayouts: number;
      collapsedRepeats: number;
      truncatedChildren: number;
      totalIconNodes: number;
      uniqueIcons: number;
      iconBytes: number;
    };
  } | null;
  onExport: () => void;
  onDownload: () => void;
}

export function ConversionTab({ running, error, summary, onExport, onDownload }: Props) {
  const t = useT();
  return (
    <div class="tab-with-sticky">
      {error && <div class="error">{error}</div>}

      {!summary && !error && !running && (
        <EmptyState
          illustration={<ExportIllust />}
          title={t.exportEmptyTitle}
          illustWidth={172}
          illustHeight={92}
          description={
            t.exportDownload === "Download" ? (
              <>
                Bundle selected frames into a single <code>.zip</code> pack
                <br />
                and hand it to Claude Code to convert to React.
              </>
            ) : (
              <>
                선택한 프레임을 <code>.zip</code> 팩으로 묶어
                <br />
                Claude Code에 바로 넘겨 React로 변환합니다.
              </>
            )
          }
        />
      )}

      {summary && (
        <div class="export-result">
          <div class="export-result-header">
            <span class="export-success-icon">✓</span>
            <div>
              <div class="export-result-title">{t.exportComplete}</div>
              <div class="export-result-file">{summary.filename}</div>
            </div>
          </div>

          <div class="export-stat-grid">
            <div class="export-stat">
              <span class="export-stat-value">{summary.screens}</span>
              <span class="export-stat-label">{t.exportScreens}</span>
            </div>
            <div class="export-stat">
              <span class="export-stat-value">{summary.icons}</span>
              <span class="export-stat-label">{t.exportIcons}</span>
            </div>
            <div class="export-stat">
              <span class="export-stat-value">{summary.flowLinks}</span>
              <span class="export-stat-label">{t.exportProtoLinks}</span>
            </div>
          </div>

          {summary.optStats && (
            <div class="export-opt-section">
              <div class="export-opt-title">{t.exportTreeOpt}</div>
              <div class="export-opt-rows">
                <div class="export-opt-row">
                  <span class="export-opt-label">{t.exportNodes}</span>
                  <span class="export-opt-val">
                    {summary.optStats.beforeNodes} → {summary.optStats.afterNodes}
                    {summary.optStats.beforeNodes > 0 && (
                      <span class="export-opt-delta">
                        {" "}(-{summary.optStats.beforeNodes - summary.optStats.afterNodes})
                      </span>
                    )}
                  </span>
                </div>
                <div class="export-opt-row">
                  <span class="export-opt-label">{t.exportFlattened}</span>
                  <span class="export-opt-val">
                    GROUP {summary.optStats.flattenedGroups} · FRAME {summary.optStats.flattenedFrames}
                  </span>
                </div>
                <div class="export-opt-row">
                  <span class="export-opt-label">{t.exportAutoLayout}</span>
                  <span class="export-opt-val">{summary.optStats.inferredLayouts}</span>
                </div>
                {summary.optStats.collapsedRepeats > 0 && (
                  <div class="export-opt-row">
                    <span class="export-opt-label">반복 노드 collapse</span>
                    <span class="export-opt-val">
                      {summary.optStats.collapsedRepeats}개 생략
                      <span class="export-opt-delta"> (repeatCount)</span>
                    </span>
                  </div>
                )}
                {summary.optStats.truncatedChildren > 0 && (
                  <div class="export-opt-row">
                    <span class="export-opt-label">⚠️ 자식 노드 잘림</span>
                    <span class="export-opt-val">
                      {summary.optStats.truncatedChildren}개 생략
                      <span class="export-opt-delta"> (80개 초과 — 그룹핑 권장)</span>
                    </span>
                  </div>
                )}
                <div class="export-opt-row">
                  <span class="export-opt-label">{t.exportIconDedup}</span>
                  <span class="export-opt-val">
                    {summary.optStats.totalIconNodes} nodes → {summary.optStats.uniqueIcons} unique
                    <span class="export-opt-delta"> ({Math.round(summary.optStats.iconBytes / 1024)}KB)</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div class="toolbar-sticky">
        {summary ? (
          <div class="export-btn-row">
            <button class="btn primary" onClick={onDownload} disabled={running}>
              {t.exportDownload}
            </button>
            <button class="btn" onClick={onExport} disabled={running}>
              {t.exportRegenerate}
            </button>
          </div>
        ) : (
          <button class="btn primary full" onClick={onExport} disabled={running}>
            {running ? t.exportGenerating : t.exportGenerate}
          </button>
        )}
      </div>
    </div>
  );
}
