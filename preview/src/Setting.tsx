import React from "react";

const fw = { Light: 300, Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 };

const ICONS: Record<string, string> = {
  // X close icon (14×14 content in 16×16 viewBox)
  ico_0: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.530273 14.583L14.583 0.530273" stroke="black" stroke-width="1.5" stroke-linejoin="round"/><path d="M0.530273 0.530273L14.583 14.583" stroke="black" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  // multi-profile user icon (16×16)
  ico_1: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.36032 10.2152C6.14931 9.88133 5.9158 9.49908 5.57592 8.86429C5.48771 8.81413 5.15042 8.60138 5.04664 7.89654C4.99908 7.56444 5.13485 7.33007 5.21355 7.22456C5.21355 7.21591 5.21269 7.20899 5.21269 7.20035C5.21269 5.44387 6.42346 4.22272 8.00005 4.22272C9.57578 4.22272 10.7865 5.44387 10.7865 7.20035C10.7865 7.20899 10.7857 7.21591 10.7857 7.22456C10.8644 7.33007 11.0002 7.56444 10.9526 7.89654C10.8488 8.60138 10.5115 8.81413 10.4233 8.86429C10.0834 9.49908 9.84993 9.88133 9.63891 10.2152C9.39157 10.6061 9.34573 11.2971 9.80236 11.6179C10.0895 11.8186 11.3478 12.6843 12.3121 13.3485C11.1316 14.3024 9.63199 14.8766 8.00005 14.8766C6.36724 14.8766 4.86762 14.3024 3.68712 13.3485C4.4698 12.8097 5.94866 11.7909 6.19687 11.6179C6.6535 11.2971 6.60767 10.6061 6.36032 10.2152ZM8.00032 0C3.58847 0 0 3.58934 0 8.00032C0 12.4122 3.58847 16.0006 8.00032 16.0006C12.4113 16.0006 16.0006 12.4122 16.0006 8.00032C16.0006 3.58934 12.4113 0 8.00032 0Z" fill="#B7B7B7"/></svg>`,
  // small arrow right (8×8 content in 9×10 viewBox)
  ico_2: `<svg width="8" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 0.866699L8 4.8667L4 8.8667" stroke="#B7B7B7" stroke-width="1.22565" stroke-linecap="square"/></svg>`,
  // search icon (16×16)
  ico_4: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7.6363" cy="7.34089" r="4.31818" stroke="#B7B7B7" stroke-width="1.35"/><path d="M11.5226 11.2272L13.2499 12.9545" stroke="#B7B7B7" stroke-width="1.35" stroke-linecap="square"/></svg>`,
  // list arrow right / chevron (6×6 content)
  ico_5: `<svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.919225 0.919225L5.16187 5.16187L0.919225 9.40451" stroke="#B7B7B7" stroke-width="1.3" stroke-linecap="square"/></svg>`,
};

const Ico = ({
  id,
  style,
}: {
  id: string;
  style?: React.CSSProperties;
}) => (
  <span
    style={{ display: "inline-flex", flexShrink: 0, ...style }}
    dangerouslySetInnerHTML={{ __html: ICONS[id] }}
  />
);

export default function Setting() {
  return (
    <div
      style={{
        width: 375,
        height: 812,
        background: "#FFFFFF",
        overflow: "hidden",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans', sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        .setting-scroll::-webkit-scrollbar { display: none; }
        .setting-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Scrollable content wrapper */}
      <div
        className="setting-scroll"
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "auto",
        }}
      >
        {/* Entry_LINE Setting — full 1105 px tall content */}
        <div style={{ width: 375, height: 1105, position: "relative", background: "#FFFFFF" }}>

          {/* ── Status bar placeholder (0–44 px) ─────────────────── */}

          {/* ── Header / Subtab (y:44, h:44) ─────────────────────── */}
          <div
            style={{
              position: "absolute",
              top: 44,
              left: 0,
              width: 375,
              height: 44,
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Title "設定" — W6 16px centered */}
            <span style={{ fontSize: 16, fontWeight: fw.SemiBold, color: "#000000" }}>
              設定
            </span>
            {/* X close button — 24×24, right side */}
            <div
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ico id="ico_0" />
            </div>
          </div>

          {/* ── Search bar (y:90, h:50) ────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              top: 90,
              left: 0,
              width: 375,
              height: 50,
              background: "#FFFFFF",
            }}
          >
            {/* Rounded input box: 16px side margins, y:6 */}
            <div
              style={{
                position: "absolute",
                left: 16,
                top: 6,
                width: 343,
                height: 38,
                background: "#F5F5F5",
                borderRadius: 5,
              }}
            >
              {/* Search icon: x:11, y:11 within input */}
              <div
                style={{
                  position: "absolute",
                  left: 11,
                  top: 11,
                  lineHeight: 0,
                }}
              >
                <Ico id="ico_4" />
              </div>
              {/* "Search" placeholder: x:30, y:12 within input */}
              <span
                style={{
                  position: "absolute",
                  left: 30,
                  top: 11,
                  fontSize: 13,
                  fontWeight: fw.Medium,
                  color: "#B7B7B7",
                  lineHeight: "16px",
                }}
              >
                Search
              </span>
            </div>
          </div>

          {/* ── Profile row (y:164, h:42, x:20) ──────────────────── */}
          <div
            style={{
              position: "absolute",
              top: 164,
              left: 20,
              width: 335,
              height: 42,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Left: avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Avatar (42×42 circle, raster image) */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "0.5px solid rgba(0,0,0,0.05)",
                  flexShrink: 0,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=84&fit=crop"
                  alt="あおい"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Name: W7 16px */}
              <span style={{ fontSize: 16, fontWeight: fw.Bold, color: "#000000" }}>
                あおい
              </span>
            </div>

            {/* Right: sub-profile button (133×28, border 1px #EFEFEF, radius 30) */}
            <div
              style={{
                width: 133,
                height: 28,
                border: "1px solid #EFEFEF",
                borderRadius: 30,
                display: "flex",
                alignItems: "center",
                paddingLeft: 8,
                paddingRight: 8,
                gap: 5,
                boxSizing: "border-box",
              }}
            >
              {/* Multi-profile icon */}
              <Ico id="ico_1" />
              {/* Button text: W5 10px #777 */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: fw.Medium,
                  color: "#777777",
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                サブプロフィール
              </span>
              {/* Arrow right */}
              <Ico id="ico_2" />
            </div>
          </div>

          {/* ── Account center section (y:229, h:85) ─────────────── */}
          <div
            style={{
              position: "absolute",
              top: 229,
              left: 0,
              width: 375,
              height: 85,
              background: "#FFFFFF",
            }}
          >
            {/* Title row: "account center" + chevron (y:12, x:20, w:335) */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 20,
                width: 335,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 17, fontWeight: fw.SemiBold, color: "#000000" }}>
                account center
              </span>
              <Ico id="ico_5" style={{ lineHeight: 0 }} />
            </div>

            {/* Description (y:39, x:20, w:335, 2 lines) */}
            <p
              style={{
                position: "absolute",
                top: 39,
                left: 20,
                width: 335,
                margin: 0,
                fontSize: 12,
                fontWeight: fw.Light,
                color: "#777777",
                lineHeight: "18px",
              }}
            >
              LINEとYahoo! JAPANのアカウント連携や連携解除、プロフィール情報の管理などが行えます。
            </p>
          </div>

          {/* ── Divider (y:328, h:1, x:20, w:335) ───────────────── */}
          <div
            style={{
              position: "absolute",
              top: 328,
              left: 20,
              width: 335,
              height: 1,
              background: "#F5F5F5",
            }}
          />

        </div>
      </div>
    </div>
  );
}
