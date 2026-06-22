import React from "react";
import ReactDOM from "react-dom/client";
import FriendTab from "./FriendTab";
import ChatTab from "./ChatTab";
import ChatBubble from "./ChatBubble";
import ChatMenu from "./ChatMenu";
import Setting from "./Setting";
import SmartCh from "./SmartCh";

const screens = [
  { name: "FriendTab", component: <FriendTab /> },
  { name: "ChatTab", component: <ChatTab /> },
  { name: "ChatBubble", component: <ChatBubble /> },
  { name: "ChatMenu", component: <ChatMenu /> },
  { name: "Setting", component: <Setting /> },
  { name: "SmartCh", component: <SmartCh /> },
];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f5f7",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      <header
        style={{
          padding: "10px 16px",
          background: "#111",
          color: "#fff",
          fontSize: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Design Ready — All Screens</strong>
        <span>{screens.length} screens</span>
      </header>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          padding: 32,
          justifyContent: "flex-start",
        }}
      >
        {screens.map(({ name, component }) => (
          <div
            key={name}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.5px" }}>
              {name}
            </span>
            <div
              style={{
                background: "#fff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {component}
            </div>
          </div>
        ))}
      </div>
    </div>
  </React.StrictMode>,
);
