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
      totalIconNodes: number;
      uniqueIcons: number;
      iconBytes: number;
    };
  } | null;
  onExport: () => void;
  onDownload: () => void;
}

export function ConversionTab({ running, error, summary, onExport, onDownload }: Props) {
  return (
    <div class="tab-with-sticky">
      {error && <div class="error">{error}</div>}

      {!summary && !error && !running && (
        <div class="empty">
          <div>
            <p style={{ margin: 0 }}>
              선택된 프레임들을 하나의 <code>.zip</code> 컨텍스트 팩으로 내보냅니다.
              Claude Code + Figma MCP 환경에서 이 팩을 첨부해 변환을 수행하세요.
              여러 프레임을 선택하면 프로토타입 링크가 자동으로 <code>flow.md</code>로 추출됩니다.
            </p>
            <p style={{ margin: "12px 0 0 0" }}>
              Figma 캔버스에서 변환할 프레임을 1개 이상 선택한 뒤 아래 버튼을 누르세요.
            </p>
          </div>
        </div>
      )}

      {summary && (
        <div class="export-result">
          <div class="export-result-header">
            <span class="export-success-icon">✓</span>
            <div>
              <div class="export-result-title">생성 완료</div>
              <div class="export-result-file">{summary.filename}</div>
            </div>
          </div>

          <div class="export-stat-grid">
            <div class="export-stat">
              <span class="export-stat-value">{summary.screens}</span>
              <span class="export-stat-label">화면</span>
            </div>
            <div class="export-stat">
              <span class="export-stat-value">{summary.icons}</span>
              <span class="export-stat-label">아이콘</span>
            </div>
            <div class="export-stat">
              <span class="export-stat-value">{summary.flowLinks}</span>
              <span class="export-stat-label">프로토타입 링크</span>
            </div>
          </div>

          {summary.optStats && (
            <div class="export-opt-section">
              <div class="export-opt-title">트리 최적화</div>
              <div class="export-opt-rows">
                <div class="export-opt-row">
                  <span class="export-opt-label">노드 수</span>
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
                  <span class="export-opt-label">평탄화</span>
                  <span class="export-opt-val">
                    GROUP {summary.optStats.flattenedGroups} · FRAME {summary.optStats.flattenedFrames}
                  </span>
                </div>
                <div class="export-opt-row">
                  <span class="export-opt-label">auto-layout 유추</span>
                  <span class="export-opt-val">{summary.optStats.inferredLayouts}개</span>
                </div>
                <div class="export-opt-row">
                  <span class="export-opt-label">아이콘 중복 제거</span>
                  <span class="export-opt-val">
                    {summary.optStats.totalIconNodes}개 노드 → {summary.optStats.uniqueIcons}개 고유
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
              다운로드
            </button>
            <button class="btn" onClick={onExport} disabled={running}>
              재생성
            </button>
          </div>
        ) : (
          <button class="btn primary full" onClick={onExport} disabled={running}>
            {running ? "생성 중…" : "선택 프레임 Export Pack 생성"}
          </button>
        )}
      </div>
    </div>
  );
}
