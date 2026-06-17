// SmartCh — Smart Channel Banner
// Source corpus: design-ready-corpus/screens/smartch-new (375×121)

import React from "react";

const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Apple SD Gothic Neo", sans-serif';
const fw = { Regular: 400, Medium: 500, Semibold: 600, Bold: 700 } as const;

const ICONS: Record<string, string> = {
  // SMC_01_01 ico_0 — AD info "i" icon
  adInfo: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.125 7.5625C2.125 10.5607 4.56366 13 7.56187 13C10.5601 13 13 10.5607 13 7.5625C13 4.56429 10.5601 2.125 7.56187 2.125C4.56366 2.125 2.125 4.56429 2.125 7.5625" stroke="#555" stroke-width="1.03"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.60642 6.62476C6.60642 6.54256 6.67281 6.47681 6.755 6.47681L7.91838 6.47807C8.17381 6.49261 8.37677 6.70569 8.37677 6.96428L8.36349 7.07303L7.94746 8.63967L7.59782 10.0609L7.5877 10.1437C7.5877 10.3031 7.69139 10.439 7.83555 10.4858L7.94746 10.5041H8.17128C8.25411 10.5041 8.31987 10.5711 8.31987 10.6533C8.31987 10.7349 8.25411 10.8 8.17128 10.8H7.00854C6.75311 10.7848 6.55078 10.5718 6.55078 10.3132L6.56406 10.2044L6.94721 8.63967L7.32973 7.21719L7.33922 7.13373C7.33922 6.9744 7.23553 6.8391 7.09137 6.79231L6.97883 6.77334H6.755C6.67281 6.77334 6.60642 6.70695 6.60642 6.62476Z" fill="#555"/><circle cx="8.118" cy="5.038" r="0.628" fill="#555"/></svg>`,
  // SMC_01_01 ico_7 — banner_ch_mute: 9×9 icon inside 17×17 touch target (offset 4,4)
  bannerMute: `<svg width="9" height="9" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="4.66667" cy="4.66667" r="4.66667" transform="matrix(-1 0 0 1 9.83331 0.5)" stroke="#B7B7B7" stroke-linejoin="round"/><path d="M1.95833 1.95825L8.375 8.37492" stroke="#B7B7B7" stroke-linejoin="round"/></svg>`,
  // SMC_01_01 ico_8 — banner_ch_more: 3×11 icon inside 17×17 touch target (offset 8,4)
  bannerMore: `<svg width="3" height="11" viewBox="0 0 3 11" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="1.044" cy="1.044" r="1.044" fill="#B7B7B7"/><circle cx="1.044" cy="5.38189" r="1.044" fill="#B7B7B7"/><circle cx="1.044" cy="9.72003" r="1.044" fill="#B7B7B7"/></svg>`,
};

const Icon: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      ...style,
    }}
    dangerouslySetInnerHTML={{ __html: ICONS[name] ?? "" }}
  />
);

export default function SmartCh() {
  return (
    <div
      style={{
        fontFamily: fontStack,
        position: "relative",
        width: 375,
        height: 121,
        background: "#fff",
      }}
    >
      {/* image: 86×86 at (256, 18) */}
      <div
        style={{
          position: "absolute",
          left: 256,
          top: 18,
          width: 86,
          height: 86,
          borderRadius: 5,
          background: `#F5F5F5 url(https://images.unsplash.com/photo-1556228720-195a672e8a03?w=180&h=180&fit=crop&auto=format) center/cover no-repeat`,
        }}
      />
      {/* text type 2: (18, 32) 218×58 */}
      <div style={{ position: "absolute", left: 18, top: 32, width: 218, height: 58 }}>
        {/* main text: 2 lines × 18px */}
        <div
          style={{
            width: 218,
            height: 36,
            fontSize: 14,
            fontWeight: fw.Semibold,
            color: "#2A2A2A",
            lineHeight: "18px",
            overflow: "hidden",
            wordBreak: "break-all",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
          }}
        >
          WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
        </div>
        {/* sub text: AD · brand — at offset (0, 44) */}
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
            height: 14,
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Icon name="adInfo" style={{ width: 15, height: 15 }} />
            <span
              style={{ fontSize: 12, fontWeight: fw.Regular, color: "#555", lineHeight: "14px" }}
            >
              AD
            </span>
          </div>
          <span
            style={{
              width: 2,
              height: 2,
              background: "#C8C8C8",
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: fw.Regular,
              color: "#909090",
              lineHeight: "14px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            LUSH Cosmetics
          </span>
        </div>
      </div>
      {/* banner_ch_mute — 17×17 at (345, 10), icon 9×9 at offset (4, 4) */}
      <div style={{ position: "absolute", left: 345, top: 10, width: 17, height: 17 }}>
        <Icon name="bannerMute" style={{ position: "absolute", left: 4, top: 4 }} />
      </div>
      {/* banner_ch_more — 17×17 at (345, 93), icon 3×11 at offset (8, 4) */}
      <div style={{ position: "absolute", left: 345, top: 93, width: 17, height: 17 }}>
        <Icon name="bannerMore" style={{ position: "absolute", left: 8, top: 4 }} />
      </div>
    </div>
  );
}
