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
}

export function ConversionTab({ running, error, summary, onExport }: Props) {
  return (
    <div class="settings">
      <div class="toolbar">
        <button class="btn primary" onClick={onExport} disabled={running}>
          {running ? "생성 중…" : "선택 프레임 Export Pack 생성"}
        </button>
      </div>

      <p class="settings-desc">
        선택된 프레임들을 하나의 <code>.zip</code> 컨텍스트 팩으로 내보냅니다. Claude Code + Figma
        MCP 환경에서 이 팩을 첨부해 변환을 수행하세요. 여러 프레임을 선택하면 프로토타입 링크가
        자동으로 <code>flow.md</code>로 추출됩니다.
      </p>

      {error && <div class="error">{error}</div>}

      {summary && (
        <div class="settings-field">
          <div class="section-header">
            <span class="section-title">생성 완료</span>
          </div>
          <ul class="settings-note">
            <li>파일: <code>{summary.filename}</code></li>
            <li>화면 수: {summary.screens}</li>
            <li>아이콘 수: {summary.icons}</li>
            <li>프로토타입 링크: {summary.flowLinks}</li>
            {summary.optStats && (
              <>
                <li>
                  트리 최적화: {summary.optStats.beforeNodes} → {summary.optStats.afterNodes}개 노드
                  {summary.optStats.beforeNodes > 0 && (
                    <> (-{summary.optStats.beforeNodes - summary.optStats.afterNodes})</>
                  )}
                </li>
                <li>
                  평탄화: GROUP {summary.optStats.flattenedGroups}개 · FRAME{" "}
                  {summary.optStats.flattenedFrames}개
                </li>
                <li>유추된 auto-layout: {summary.optStats.inferredLayouts}개</li>
                <li>
                  아이콘 dedup: {summary.optStats.totalIconNodes}개 노드 →{" "}
                  {summary.optStats.uniqueIcons}개 고유 ({
                    Math.round(summary.optStats.iconBytes / 1024)
                  }
                  KB)
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {!summary && !error && !running && (
        <p class="settings-note">
          Figma 캔버스에서 변환할 프레임을 1개 이상 선택한 뒤 위 버튼을 누르세요.
        </p>
      )}
    </div>
  );
}
