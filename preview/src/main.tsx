import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import ChatTab from "./ChatTab";
import FriendTab from "./FriendTab";
import Setting from "./Setting";
import ChatMenu from "./ChatMenu";
import B1MRBList from "./B1MRBList";
import SmartCh from "./SmartCh";
import { ChatBubble } from "./ChatBubble";
import { ICONS, Icon } from "./Icon";
import Generated from "./Generated";
import Screen02 from "./Screen02";

// ── Inline icon gallery ──────────────────────────────────────────────────────

function IconGallery() {
  const names = Object.keys(ICONS);
  return (
    <div style={{ padding: 20, fontFamily: "-apple-system, sans-serif" }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
        {names.length}개 아이콘
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {names.map((name) => (
          <div
            key={name}
            title={name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              width: 64,
              cursor: "default",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f5f5",
                borderRadius: 8,
              }}
            >
              <Icon name={name} />
            </div>
            <span
              style={{
                fontSize: 9,
                color: "#999",
                textAlign: "center",
                wordBreak: "break-all",
                lineHeight: 1.3,
              }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen registry ─────────────────────────────────────────────────────────

interface ScreenEntry {
  id: string;
  label: string;
  desc: string;
  size: string;
  component: React.ComponentType;
}

const SCREENS: ScreenEntry[] = [
  { id: "chat-tab",    label: "ChatTab",    desc: "채팅 목록",       size: "375 × 812", component: ChatTab },
  { id: "friend-tab", label: "FriendTab",  desc: "친구 탭",         size: "375 × 812", component: FriendTab },
  { id: "setting",    label: "Setting",    desc: "설정 화면",       size: "375 × 812", component: Setting },
  { id: "chatmenu",   label: "ChatMenu",   desc: "채팅 메뉴",       size: "375 × 812", component: ChatMenu },
  { id: "b1mrb",      label: "B1MRBList",  desc: "B1 MRB 리스트",  size: "375 × 812", component: B1MRBList },
  { id: "smartch",    label: "SmartCh",    desc: "스마트 채널 배너", size: "375 × 121", component: SmartCh },
  { id: "chat-bubble",label: "ChatBubble", desc: "채팅 버블",       size: "375 × 812", component: ChatBubble },
  { id: "icons",      label: "Icons",      desc: "아이콘 갤러리",   size: "auto",      component: IconGallery },
];

const DEV_SCREENS: ScreenEntry[] = [
  { id: "generated", label: "Generated", desc: "변환 결과 붙여넣기용", size: "auto",      component: Generated },
  { id: "screen02",  label: "Screen02",  desc: "Screen 02",           size: "375 × 812", component: Screen02 },
];

// ── App ─────────────────────────────────────────────────────────────────────

function App() {
  const [activeId, setActiveId] = useState<string>(SCREENS[0].id);

  const allScreens = [...SCREENS, ...DEV_SCREENS];
  const active = allScreens.find((s) => s.id === activeId) ?? allScreens[0];
  const Component = active.component;

  return (
    <div className="preview-shell">
      <header className="preview-header">
        <strong>Design Ready — Preview</strong>
        <span className="preview-header-hint">
          {active.label} · {active.size}
        </span>
      </header>

      <div className="preview-body">
        {/* ── Sidebar ── */}
        <nav className="preview-nav">
          <div className="preview-nav-section">Corpus</div>
          {SCREENS.map((s) => (
            <button
              key={s.id}
              className={`preview-nav-item${activeId === s.id ? " active" : ""}`}
              onClick={() => setActiveId(s.id)}
            >
              {s.label}
              <small>{s.desc}</small>
            </button>
          ))}

          <div className="preview-nav-section" style={{ marginTop: 16 }}>Dev</div>
          {DEV_SCREENS.map((s) => (
            <button
              key={s.id}
              className={`preview-nav-item${activeId === s.id ? " active" : ""}`}
              onClick={() => setActiveId(s.id)}
            >
              {s.label}
              <small>{s.desc}</small>
            </button>
          ))}
        </nav>

        {/* ── Stage ── */}
        <main className="preview-stage">
          <div className="preview-wrap">
            <div className="preview-frame">
              <Component />
            </div>
            <div className="preview-frame-label">
              {active.label} — {active.size}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
