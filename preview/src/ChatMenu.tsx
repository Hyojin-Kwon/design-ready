// ChatMenu.tsx — from: task5_type_2_2 (Figma rootLabel)
// Full LINE chat-menu screen (375×812). Status bar, subtab, 4-button quick layout,
// scrollable menu Stack (profile / BGM / Photo+Video / Album / description /
// Note / Event / Link / File / Settings), Home indicator.

import React from "react";
import { Icon } from "./Icon";
import "./ChatMenu.css";

// ── Common typography helpers ───────────────────────────────────────────────
const fontIos = "var(--font-family-font-family-text-ios)";
const w4 = "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"];
const w6 = "var(--font-weight-ios-font-weight-semibold)" as React.CSSProperties["fontWeight"];
const wBold = "var(--font-weight-ios-font-weight-bold)" as React.CSSProperties["fontWeight"];
const wHeavy = "var(--font-weight-ios-font-weight-heavy)" as React.CSSProperties["fontWeight"];

// ── Status Bar ──────────────────────────────────────────────────────────────
// from: Status Bar
const StatusBar: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 375, height: 44 }}>
    {/* Time 9:41 — at (20,11) within Status Bar, time text at (0,3) within Time */}
    <span
      style={{
        position: "absolute",
        left: 20,
        top: 14,
        width: 54,
        height: 18,
        fontFamily: fontIos,
        fontSize: "var(--font-size-ios-font-size-text-15)",
        fontWeight: w6,
        color: "var(--neutral-colors-lineblack)",
        textAlign: "center",
        lineHeight: 1,
      }}
    >
      9:41
    </span>
    {/* Right group: cellular, wifi, battery */}
    <Icon
      name="cellular"
      style={{ position: "absolute", left: 294, top: 18, width: 17, height: 11 }}
    />
    <Icon name="wifi" style={{ position: "absolute", left: 316, top: 17, width: 15, height: 11 }} />
    <Icon
      name="battery"
      style={{ position: "absolute", left: 336, top: 17, width: 24, height: 11 }}
    />
  </div>
);

// ── Subtab (375×44 at y=44) — back arrow + "同期会 (5)" title ─────────────────
// from: Subtab
const Subtab: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 44,
      width: 375,
      height: 44,
      backgroundColor: "var(--neutral-colors-linewhite)",
    }}
  >
    {/* Icon 1 (24×24) — back arrow, vertically centered */}
    <Icon
      name="subtabBack"
      style={{ position: "absolute", left: 16, top: 10, width: 24, height: 24 }}
    />
    {/* Title — centered across full width */}
    <span
      style={{
        position: "absolute",
        left: 0,
        top: 9,
        width: 375,
        height: 26,
        textAlign: "center",
        fontFamily: fontIos,
        fontSize: "var(--font-size-ios-font-size-text-17)",
        fontWeight: w6,
        color: "var(--neutral-colors-lineblack)",
        lineHeight: 1.5,
      }}
    >
      同期会 (5)
    </span>
    {/* Frame 17 — right text button (text.chars is empty) */}
    <span
      style={{
        position: "absolute",
        right: 19,
        top: 12,
        width: 75,
        height: 19,
        fontFamily: fontIos,
        fontSize: "var(--font-size-ios-font-size-text-16)",
        fontWeight: w4,
        color: "var(--neutral-colors-lineblack)",
      }}
    />
  </div>
);

// ── Quick layout 4-button strip (375×86 at y=88) ────────────────────────────
// from: A_quick_layout_4
type QuickButton = {
  label: string;
  iconName: string;
  iconW: number;
  iconH: number;
  iconX: number;
  iconY: number;
  left: number;
  width: number;
};
const quickButtons: QuickButton[] = [
  {
    label: "通知オフ",
    iconName: "muteOffGroup",
    iconW: 24,
    iconH: 23,
    iconX: 15,
    iconY: 6,
    left: 0,
    width: 94,
  },
  {
    label: "メンバー",
    iconName: "membersGroup",
    iconW: 27,
    iconH: 23,
    iconX: 12,
    iconY: 5,
    left: 94,
    width: 93,
  },
  {
    label: "招待",
    iconName: "inviteGroup",
    iconW: 27,
    iconH: 23,
    iconX: 13,
    iconY: 5,
    left: 187,
    width: 94,
  },
  {
    label: "退会",
    iconName: "exitGroup",
    iconW: 21,
    iconH: 20,
    iconX: 16,
    iconY: 7,
    left: 281,
    width: 94,
  },
];

const QuickLayout: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 375,
      height: 86,
      flexShrink: 0,
      backgroundColor: "var(--neutral-colors-linewhite)",
    }}
  >
    {/* Bottom 1px divider — ico_16 (375×1 #EFEFEF) */}
    <Icon
      name="divider"
      style={{ position: "absolute", left: 0, top: 85, width: 375, height: 1 }}
    />
    {quickButtons.map((b) => (
      <div
        key={b.label}
        style={{
          position: "absolute",
          left: b.left,
          top: 0,
          width: b.width,
          height: 86,
        }}
      >
        {/* Icon container (ic_btn_*) — 49×34 at (~22,11), inner icon at (iconX,iconY) */}
        <div
          style={{
            position: "absolute",
            left: b.left === 94 ? 22 : 23,
            top: 11,
            width: 49,
            height: 34,
          }}
        >
          <Icon
            name={b.iconName}
            style={{
              position: "absolute",
              left: b.iconX,
              top: b.iconY,
              width: b.iconW,
              height: b.iconH,
            }}
          />
        </div>
        {/* Label */}
        <span
          style={{
            position: "absolute",
            left: 10,
            top: 49,
            width: b.label === "メンバー" ? 73 : 74,
            height: 17,
            fontFamily: fontIos,
            fontSize: "var(--font-size-ios-font-size-text-11)",
            fontWeight: w6,
            color: "var(--neutral-colors-linegray900)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {b.label}
        </span>
      </div>
    ))}
  </div>
);

// ── Stack: simple menu row (375×50) ─────────────────────────────────────────
// Common pattern: white bg, label at (45,16), icon-left at (16-19, 15-17), chevron at (351,20).
type RowProps = {
  label: string;
  iconName: string;
  iconLeft: number;
  iconTop: number;
  iconW: number;
  iconH: number;
  labelWidth: number;
};
const MenuRow: React.FC<RowProps> = ({
  label,
  iconName,
  iconLeft,
  iconTop,
  iconW,
  iconH,
  labelWidth,
}) => (
  <div
    style={{
      position: "relative",
      width: 375,
      height: 50,
      backgroundColor: "var(--neutral-colors-linewhite)",
    }}
  >
    <Icon
      name={iconName}
      style={{ position: "absolute", left: iconLeft, top: iconTop, width: iconW, height: iconH }}
    />
    <span
      style={{
        position: "absolute",
        left: 45,
        top: 16,
        width: labelWidth,
        height: 20,
        fontFamily: fontIos,
        fontSize: "var(--font-size-ios-font-size-text-13)",
        fontWeight: w4,
        color: "var(--neutral-colors-linegray900)",
        lineHeight: 1.5,
      }}
    >
      {label}
    </span>
    <Icon
      name="chevronMore"
      style={{ position: "absolute", left: 351, top: 21, width: 6, height: 11 }}
    />
  </div>
);

// ── Stack[0] グループプロフィール row ────────────────────────────────────────
const ProfileRow: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 375,
      height: 50,
      backgroundColor: "var(--neutral-colors-linewhite)",
    }}
  >
    {/* User-circle icon at (16,15) */}
    <Icon
      name="userCircle"
      style={{ position: "absolute", left: 16, top: 15, width: 20, height: 20 }}
    />
    {/* Title text at (45,16) */}
    <span
      style={{
        position: "absolute",
        left: 45,
        top: 16,
        width: 124,
        height: 20,
        fontFamily: fontIos,
        fontSize: "var(--font-size-ios-font-size-text-13)",
        fontWeight: w4,
        color: "var(--neutral-colors-linegray900)",
        lineHeight: 1.5,
      }}
    >
      グループプロフィール
    </span>
    {/* Chevron */}
    <Icon
      name="chevronMore"
      style={{ position: "absolute", left: 351, top: 21, width: 6, height: 11 }}
    />
    {/* Right Row: 17×17 photo ellipse + "同期会" label — 10px gap before chevron */}
    <div
      style={{
        position: "absolute",
        right: 34,
        top: 16,
        height: 23,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      }}
    >
      {/* IOS / Profile / Photo — 17×17 ellipse fill #17C098 (no token) */}
      <span
        style={{
          width: 17,
          height: 17,
          borderRadius: "50%",
          backgroundColor: "#17C098", // TODO: token? #17C098 not in token list
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: fontIos,
          fontSize: "var(--font-size-ios-font-size-text-15)",
          fontWeight: w4,
          color: "#949494", // TODO: token? #949494 not in token list
          lineHeight: 1.5,
          whiteSpace: "nowrap",
        }}
      >
        同期会
      </span>
    </div>
  </div>
);

// ── Stack[1] BGM / music row ────────────────────────────────────────────────
const MusicRow: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 375,
      height: 50,
      backgroundColor: "var(--neutral-colors-linewhite)",
    }}
  >
    <Icon
      name="musicNote"
      style={{ position: "absolute", left: 19, top: 17, width: 13, height: 15 }}
    />
    <span
      style={{
        position: "absolute",
        left: 45,
        top: 16,
        width: 34,
        height: 20,
        fontFamily: fontIos,
        fontSize: "var(--font-size-ios-font-size-text-13)",
        fontWeight: w4,
        color: "var(--neutral-colors-linegray900)",
        lineHeight: 1.5,
      }}
    >
      BGM
    </span>
    <Icon
      name="chevronMore"
      style={{ position: "absolute", left: 351, top: 21, width: 6, height: 11 }}
    />
    {/* Sub text — 10px gap before chevron */}
    <span
      style={{
        position: "absolute",
        right: 34,
        top: 16,
        fontFamily: fontIos,
        fontSize: "var(--font-size-ios-font-size-text-15)",
        fontWeight: w4,
        color: "#949494", // TODO: token? #949494 not in token list
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      Put some mus
    </span>
  </div>
);

// ── Stack[2] 写真・動画 (Photo/Video, 375×136) ───────────────────────────────
// Header row at top + 4 thumbnail tiles below at y=45.
const PhotoVideoSection: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 375,
      height: 136,
      backgroundColor: "var(--neutral-colors-linewhite)",
    }}
  >
    <Icon
      name="photoVideo"
      style={{ position: "absolute", left: 16, top: 15, width: 20, height: 20 }}
    />
    <span
      style={{
        position: "absolute",
        left: 45,
        top: 16,
        width: 64,
        height: 20,
        fontFamily: fontIos,
        fontSize: "var(--font-size-ios-font-size-text-13)",
        fontWeight: w4,
        color: "var(--neutral-colors-linegray900)",
        lineHeight: 1.5,
        whiteSpace: "nowrap",
      }}
    >
      写真・動画
    </span>
    <Icon
      name="chevronMore"
      style={{ position: "absolute", left: 351, top: 21, width: 6, height: 11 }}
    />

    {/* img GROUP at (16,45) — 4 thumbnails 85×85 (gap 1px). Tile order in tree:
        '1' at (188,45) image-only
        '2' at (16,45) image + dimmed bottom + ic_vr (VR badge)
        '3' at (102,45) image + dimmed bottom
        '4' at (274,45) image + dimmed bottom + "0:32" duration label */}

    {/* Tile 2 — leftmost */}
    <div
      style={{
        position: "absolute",
        left: 16,
        top: 45,
        width: 85,
        height: 85,
        backgroundColor: "#F5F5F5",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=170&h=170&fit=crop&auto=format&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <DimmedOverlay />
      {/* ic_vr at (22-16, 114-45) = (6, 69). Tree x=22, y=114; relative to tile (16,45) → (6, 69) */}
      <Icon
        name="vrPlay"
        style={{ position: "absolute", left: 6, top: 69, width: 11, height: 11 }}
      />
    </div>
    {/* Tile 3 */}
    <div
      style={{
        position: "absolute",
        left: 102,
        top: 45,
        width: 85,
        height: 85,
        backgroundColor: "#F5F5F5",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=170&h=170&fit=crop&auto=format&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <DimmedOverlay />
    </div>
    {/* Tile 1 */}
    <div
      style={{
        position: "absolute",
        left: 188,
        top: 45,
        width: 85,
        height: 85,
        backgroundColor: "#F5F5F5",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=170&h=170&fit=crop&auto=format&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <DimmedOverlay />
    </div>
    {/* Tile 4 — with "0:32" duration */}
    <div
      style={{
        position: "absolute",
        left: 274,
        top: 45,
        width: 85,
        height: 85,
        backgroundColor: "#F5F5F5",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1519046904884-53103b34b206?w=170&h=170&fit=crop&auto=format&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <DimmedOverlay />
      <span
        style={{
          position: "absolute",
          left: 28,
          top: 67,
          width: 50,
          height: 13,
          fontFamily: fontIos,
          fontSize: "var(--font-size-ios-font-size-text-11)",
          fontWeight: w4,
          color: "var(--neutral-colors-linewhite)",
          textAlign: "center",
          lineHeight: 1,
          textShadow: "0 0 1px rgba(0,0,0,0.2)",
        }}
      >
        0:32
      </span>
    </div>
  </div>
);

// 38px tall linear-gradient from transparent to #000000@~1 (0% → 100%) — covers bottom of tile.
const DimmedOverlay: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 47,
      width: 85,
      height: 38,
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
    }}
  />
);

// ── Stack[3] アルバム (Album, 375×136 GROUP) ────────────────────────────────
// Internally: title FRAME (375×136 at 0,0 album-rel) with create card; img GROUP
// (343×85 at 16,45 album-rel) overlaying with 2 album cards.
const AlbumSection: React.FC = () => (
  <div style={{ position: "relative", width: 375, height: 136 }}>
    {/* title FRAME background */}
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 375,
        height: 136,
        backgroundColor: "var(--neutral-colors-linewhite)",
      }}
    />
    {/* Album icon */}
    <Icon name="album" style={{ position: "absolute", left: 16, top: 15, width: 20, height: 20 }} />
    <span
      style={{
        position: "absolute",
        left: 45,
        top: 16,
        width: 50,
        height: 20,
        fontFamily: fontIos,
        fontSize: "var(--font-size-ios-font-size-text-13)",
        fontWeight: w4,
        color: "var(--neutral-colors-linegray900)",
        lineHeight: 1.5,
      }}
    >
      アルバム
    </span>
    <Icon
      name="chevronMore"
      style={{ position: "absolute", left: 351, top: 21, width: 6, height: 11 }}
    />

    {/* Create-album card (343×85 at 16,45) — beneath the 2 album cards */}
    <div
      style={{
        position: "absolute",
        left: 16,
        top: 45,
        width: 343,
        height: 85,
        backgroundColor: "var(--neutral-colors-linewhite)",
        border: "1px solid var(--neutral-colors-linegray200)",
        borderRadius: "var(--radius-radius-7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxSizing: "border-box",
        padding: "29px 63px 26px 62px",
      }}
    >
      <span
        style={{
          fontFamily: fontIos,
          fontSize: "var(--font-size-ios-font-size-text-12)",
          fontWeight: w6,
          color: "var(--neutral-colors-lineblack)",
          lineHeight: 1,
        }}
      >
        アルバム作成
      </span>
    </div>

    {/* Album card 1 (171×85 at 16,45) — Home Party */}
    <AlbumCard
      left={16}
      title="Home Party"
      titleWidth={77}
      count="72"
      countLeft={92}
      countWidth={16}
      bgImage="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=342&h=170&fit=crop&auto=format&q=80"
    />
    {/* Album card 2 (171×85 at 188,45) — Cafetour, with row layout for title + count */}
    <div
      style={{
        position: "absolute",
        left: 188,
        top: 45,
        width: 171,
        height: 85,
        backgroundColor: "#F5F5F5",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=342&h=170&fit=crop&auto=format&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 47,
          width: 171,
          height: 38,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 11,
          top: 61,
          width: 85,
          height: 16,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: fontIos,
            fontSize: "var(--font-size-ios-font-size-text-13)",
            fontWeight: wBold,
            color: "var(--neutral-colors-linewhite)",
            textShadow: "0 0 1px rgba(0,0,0,0.2)",
            lineHeight: 1.2,
          }}
        >
          Cafetour
        </span>
        <span
          style={{
            fontFamily: fontIos,
            fontSize: "var(--font-size-ios-font-size-text-13)",
            fontWeight: w4,
            color: "var(--neutral-colors-linewhite)",
            textShadow: "0 0 1px rgba(0,0,0,0.22)",
            lineHeight: 1.2,
          }}
        >
          131
        </span>
      </div>
    </div>
  </div>
);

const AlbumCard: React.FC<{
  left: number;
  title: string;
  titleWidth: number;
  count: string;
  countLeft: number;
  countWidth: number;
  bgImage?: string;
}> = ({ left, title, titleWidth, count, countLeft, countWidth, bgImage }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: 45,
      width: 171,
      height: 85,
      backgroundColor: "#F5F5F5",
      backgroundImage: bgImage ? `url(${bgImage})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      overflow: "hidden",
    }}
  >
    {/* Dimmed gradient bottom 38px */}
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 47,
        width: 171,
        height: 38,
        background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
      }}
    />
    <span
      style={{
        position: "absolute",
        left: 11,
        top: 61,
        width: titleWidth,
        height: 16,
        fontFamily: fontIos,
        fontSize: "var(--font-size-ios-font-size-text-13)",
        fontWeight: wBold,
        color: "var(--neutral-colors-linewhite)",
        textShadow: "0 0 1px rgba(0,0,0,0.2)",
        lineHeight: 1.2,
      }}
    >
      {title}
    </span>
    <span
      style={{
        position: "absolute",
        left: countLeft,
        top: 61,
        width: countWidth,
        height: 16,
        fontFamily: fontIos,
        fontSize: "var(--font-size-ios-font-size-text-13)",
        fontWeight: w4,
        color: "var(--neutral-colors-linewhite)",
        textShadow: "0 0 1px rgba(0,0,0,0.2)",
        lineHeight: 1.2,
      }}
    >
      {count}
    </span>
  </div>
);

// ── Stack[4] description (375×29) — CHECK badge + help row ──────────────────
const DescriptionRow: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 375,
      height: 29,
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 16,
      paddingRight: 16,
      boxSizing: "border-box",
    }}
  >
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5, height: 17 }}
    >
      {/* CHECK badge */}
      <div
        style={{
          width: 40,
          height: 15,
          backgroundColor: "var(--brand-colors-linegreen-ios)",
          borderRadius: "var(--radius-radius-7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 3,
          paddingBottom: 3,
          paddingLeft: 4.5,
          paddingRight: 4.5,
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: fontIos,
            fontSize: 8.3, // TODO: token? font-size 8.3 not in token list
            fontWeight: wHeavy,
            color: "var(--neutral-colors-linewhite)",
            lineHeight: 1,
          }}
        >
          CHECK
        </span>
      </div>
      {/* help text + arrow — gap 3 between text and > */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3 }}>
        <span
          style={{
            fontFamily: fontIos,
            fontSize: "var(--font-size-ios-font-size-text-11)",
            fontWeight: w4,
            color: "var(--neutral-colors-linegray650)",
            lineHeight: 1.5,
            whiteSpace: "nowrap",
          }}
        >
          動画やオリジナル画質の写真を追加するには？
        </span>
        <Icon name="arrowRightSmall" style={{ width: 7, height: 11, flexShrink: 0 }} />
      </div>
    </div>
  </div>
);

// ── Home Indicator (375×34 at y=778) ────────────────────────────────────────
// from: Home Indicator
const HomeIndicator: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 778, width: 375, height: 34 }}>
    <div style={{ position: "absolute", left: 121, top: 21, width: 134, height: 5 }}>
      <div
        style={{
          width: 134,
          height: 5,
          backgroundColor: "var(--neutral-colors-lineblack)",
          borderRadius: 100,
        }}
      />
    </div>
  </div>
);

// ── Main screen ─────────────────────────────────────────────────────────────
const ChatMenu: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: 375,
      height: 812,
      backgroundColor: "var(--neutral-colors-linewhite)",
      overflow: "hidden",
    }}
  >
    <StatusBar />
    <Subtab />

    {/* Scrollable content area: y=88 → y=778 (above HomeIndicator) */}
    <div
      className="chat-scroll"
      style={{
        position: "absolute",
        left: 0,
        top: 88,
        width: 375,
        height: 690,
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {/* QuickLayout — scrolls with content */}
      <QuickLayout />

      {/* Stack: vertical flex */}
      <div
        style={{
          width: 375,
          display: "flex",
          flexDirection: "column",
          paddingBottom: 21,
        }}
      >
        {/* Stack[0] グループプロフィール */}
        <ProfileRow />
        {/* Stack[1] BGM */}
        <MusicRow />
        {/* Stack[2] 写真・動画 */}
        <PhotoVideoSection />
        {/* Stack[3] アルバム */}
        <AlbumSection />
        {/* Stack[4] description (CHECK + help) */}
        <DescriptionRow />
        {/* Stack[5] ノート */}
        <MenuRow
          label="ノート"
          labelWidth={39}
          iconName="note"
          iconLeft={16}
          iconTop={15}
          iconW={20}
          iconH={20}
        />
        {/* Stack[6] イベント */}
        <MenuRow
          label="イベント"
          labelWidth={50}
          iconName="event"
          iconLeft={19}
          iconTop={17}
          iconW={14}
          iconH={15}
        />
        {/* Stack[7] リンク */}
        <MenuRow
          label="リンク"
          labelWidth={39}
          iconName="link"
          iconLeft={16}
          iconTop={15}
          iconW={20}
          iconH={20}
        />
        {/* Stack[8] ファイル */}
        <MenuRow
          label="ファイル"
          labelWidth={51}
          iconName="file"
          iconLeft={16}
          iconTop={15}
          iconW={20}
          iconH={20}
        />
        {/* Stack[9] 設定 */}
        <MenuRow
          label="設定"
          labelWidth={30}
          iconName="settings"
          iconLeft={16}
          iconTop={15}
          iconW={20}
          iconH={20}
        />
      </div>
    </div>

    <HomeIndicator />
  </div>
);

export default ChatMenu;
