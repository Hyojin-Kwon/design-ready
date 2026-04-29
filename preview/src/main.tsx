import React from "react";
import ReactDOM from "react-dom/client";
import Generated from "./FriendTab";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="preview-shell">
      <header className="preview-header">
        <strong>Design Ready — Preview</strong>
        <span>preview/src/Generated.tsx 에 변환 결과 붙여넣기 → 저장하면 HMR 반영</span>
      </header>
      <main className="preview-stage">
        <div className="preview-frame">
          <Generated />
        </div>
      </main>
    </div>
  </React.StrictMode>
);
