import * as React from "react";
import { Icon } from "./Icon";

const fontStack = "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Helvetica Neue', Arial, sans-serif";
const fw = { Regular: 400, Medium: 500, Semibold: 600, Bold: 700, Heavy: 900 } as const;

type RowProps = {
  top: number;
  thumb: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
  right: React.ReactNode;
  pad?: { t?: number; l?: number; r?: number };
};

function ChatRow({ top, thumb, title, body, right, pad }: RowProps) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: 375,
        height: 68,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingLeft: pad?.l ?? 16,
        paddingRight: pad?.r ?? 16,
        paddingTop: pad?.t ?? 0,
        background: "#FFFFFF",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
        {thumb}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", flex: 1, minWidth: 0 }}>
          {title}
          {body}
        </div>
      </div>
      {right}
    </div>
  );
}

function Avatar48({ badge }: { badge?: React.ReactNode }) {
  return (
    <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#E5E5E5",
        }}
      />
      {badge ? (
        <div style={{ position: "absolute", left: 34, top: 32 }}>{badge}</div>
      ) : null}
    </div>
  );
}

function StoryRingAvatar({ badge }: { badge?: React.ReactNode }) {
  return (
    <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          left: -5,
          top: -5,
          width: 58,
          height: 58,
          borderRadius: "50%",
          padding: 2.5,
          background:
            "conic-gradient(from 0deg, #20A1FF 4%, #00E5BF 18%, #00E75F 40%, #20BDFF 59%, #5855FF 77%, #5855FF 97%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E5E5E5" }} />
      {badge ? <div style={{ position: "absolute", left: 34, top: 32 }}>{badge}</div> : null}
    </div>
  );
}

function NotiBadge({ children, width }: { children: React.ReactNode; width?: number }) {
  return (
    <div
      style={{
        width: width ?? "auto",
        minWidth: 25,
        height: 24,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        background: "#06C755",
        borderRadius: 100,
        color: "#FFFFFF",
        fontFamily: fontStack,
        fontSize: 13,
        fontWeight: fw.Bold,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

function RightMeta({ time, badge, width = 47 }: { time: string; badge?: React.ReactNode; width?: number }) {
  return (
    <div
      style={{
        width,
        height: 38,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: badge ? "flex-start" : "center",
        gap: 7,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: fontStack,
          fontSize: 11,
          fontWeight: fw.Regular,
          color: "#909090",
          lineHeight: "8px",
          height: 8,
        }}
      >
        {time}
      </div>
      {badge}
    </div>
  );
}

const titleStyle: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: 15,
  fontWeight: fw.Medium,
  color: "#111111",
  lineHeight: "18px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
const bodyStyle: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: 13,
  fontWeight: fw.Regular,
  color: "#777777",
  lineHeight: "16px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export default function Screen02() {
  return (
    <div
      style={{
        width: 375,
        height: 811,
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "center",
        position: "relative",
        fontFamily: fontStack,
      }}
    >
      {/* from: Header */}
      <header style={{ position: "relative", width: 375, height: 138, flexShrink: 0 }}>
        {/* Status Bar */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 375, height: 44 }}>
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 14,
              width: 54,
              height: 18,
              color: "#000000",
              fontFamily: fontStack,
              fontSize: 15,
              fontWeight: fw.Semibold,
              textAlign: "center",
            }}
          >
            9:41
          </div>
          <div style={{ position: "absolute", left: 294, top: 17, display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Icon name="cellular" />
            <Icon name="wifi" />
            <Icon name="battery" />
          </div>
        </div>

        {/* Maintab Chat */}
        <div style={{ position: "absolute", left: 0, top: 44, width: 375, height: 44, background: "#FFFFFF" }}>
          <div style={{ position: "absolute", left: 17, top: 8, display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}>
            <span style={{ fontFamily: fontStack, fontSize: 24, fontWeight: fw.Heavy, color: "#000000", lineHeight: "29px" }}>Chats</span>
            <Icon name="arrowDown" />
          </div>
          <button
            aria-label="chat edit"
            style={{ position: "absolute", right: 160, top: 10, width: 24, height: 24, padding: 0, border: "none", background: "transparent", cursor: "pointer" }}
          >
            <Icon name="chatEdit" />
          </button>
          <button
            aria-label="albums"
            style={{ position: "absolute", right: 120, top: 10, width: 24, height: 24, padding: 0, border: "none", background: "transparent", cursor: "pointer" }}
          >
            <Icon name="albums" />
          </button>
          <button
            aria-label="open chat"
            style={{ position: "absolute", right: 80, top: 10, width: 24, height: 24, padding: 0, border: "none", background: "transparent", cursor: "pointer" }}
          >
            <Icon name="openChat" />
          </button>
          <button
            aria-label="add chat"
            style={{ position: "absolute", right: 40, top: 10, width: 24, height: 24, padding: 0, border: "none", background: "transparent", cursor: "pointer" }}
          >
            <Icon name="addChat" />
          </button>
        </div>

        {/* Search Bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 88,
            width: 375,
            height: 50,
            paddingTop: 6,
            paddingBottom: 6,
            paddingLeft: 16,
            paddingRight: 16,
            background: "#FFFFFF",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 38,
              background: "#F5F5F5",
              borderRadius: 5,
              paddingLeft: 11,
              paddingRight: 11,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Icon name="search" />
              <span style={{ fontFamily: fontStack, fontSize: 13, fontWeight: fw.Medium, color: "#B7B7B7" }}>Search</span>
            </div>
            <Icon name="searchQr" />
          </div>
        </div>
      </header>

      {/* Smart CH */}
      <section style={{ position: "relative", width: 375, height: 110, background: "#FFFFFF", flexShrink: 0 }}>
        {/* 86x86 thumbnail */}
        <div
          style={{
            position: "absolute",
            left: 256,
            top: 12,
            width: 86,
            height: 86,
            borderRadius: 5,
            background: "linear-gradient(135deg, #FFE4B5, #FFB6C1)",
          }}
        />
        {/* banner_ch_mute */}
        <div style={{ position: "absolute", left: 346, top: 10, width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="muteIcon" />
        </div>
        {/* text type 2 */}
        <div
          style={{
            position: "absolute",
            left: 18,
            top: 26,
            width: 218,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: fontStack,
              fontSize: 14,
              fontWeight: fw.Semibold,
              color: "#111111",
              lineHeight: "18px",
            }}
          >
            Inventors of the bath bomb and the home of bath art.
          </div>
          {/* sub text */}
          <div style={{ position: "relative", width: 120, height: 14 }}>
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                fontFamily: fontStack,
                fontSize: 12,
                fontWeight: fw.Regular,
                color: "#949494",
              }}
            >
              AD
            </span>
            <span style={{ position: "absolute", left: 17, top: 0, width: 14, height: 14, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="infoCircle" />
            </span>
            <span style={{ position: "absolute", left: 31, top: 2, width: 10, height: 10, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="bannerDot" />
            </span>
            <span
              style={{
                position: "absolute",
                left: 42,
                top: 0,
                fontFamily: fontStack,
                fontSize: 12,
                fontWeight: fw.Regular,
                color: "#949494",
              }}
            >
              LUSH Cosmetics
            </span>
          </div>
        </div>
      </section>

      {/* Chat list */}
      <main style={{ position: "relative", width: 375, height: 476, flexShrink: 0 }}>
        {/* Activity Module — Birthday */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 375,
            height: 68,
            background: "#FFFFFF",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            paddingLeft: 16,
            paddingRight: 16,
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
            <div style={{ position: "relative", width: 48, height: 48, borderRadius: "50%", background: "#FFDCE4", flexShrink: 0 }}>
              <div style={{ position: "absolute", left: 5, top: 0, width: 41, height: 19 }}>
                <Icon name="cakeSparkles" />
              </div>
              <div style={{ position: "absolute", left: 11, top: 9, width: 26, height: 27 }}>
                <div style={{ position: "absolute", left: 11, top: 0, width: 5, height: 12 }}>
                  <Icon name="cakeCandle" />
                </div>
                <div style={{ position: "absolute", left: 0, top: 10, width: 26, height: 17 }}>
                  <Icon name="cakeBody" />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center", flex: 1, minWidth: 0 }}>
              <div style={titleStyle}>Wish friends a happy birthday!</div>
              <div style={{ ...bodyStyle, color: "#616161" }}>Olivia, Hirao kanno</div>
            </div>
          </div>
          <div style={{ width: 24, height: 24, flexShrink: 0 }}>
            <Icon name="chevronCircle" />
          </div>
        </div>

        {/* 1. MRB */}
        <div style={{ position: "absolute", top: 68, left: 0, width: 375, height: 68 }}>
          <ChatRow
            top={0}
            pad={{ t: 10, l: 16, r: 16 }}
            thumb={
              <div style={{ width: 48, height: 48, flexShrink: 0 }}>
                <Icon name="profilePhoto" />
              </div>
            }
            title={<div style={titleStyle}>2 non-friend message requests</div>}
            body={<div style={bodyStyle}>Ken, Evan Kao</div>}
            right={
              <RightMeta
                width={45}
                time="1min ago"
                badge={
                  <div style={{ width: 43, height: 24 }}>
                    <Icon name="mrbArrow" />
                  </div>
                }
              />
            }
          />
          <div style={{ position: "absolute", left: 60, top: 9, width: 5, height: 5 }}>
            <Icon name="dotGreen" />
          </div>
        </div>

        {/* 3. 1:1 — Aimee */}
        <ChatRow
          top={136}
          thumb={
            <StoryRingAvatar
              badge={
                <div style={{ width: 16, height: 16 }}>
                  <Icon name="badgePin" />
                </div>
              }
            />
          }
          title={<div style={titleStyle}>Aimee</div>}
          body={<div style={bodyStyle}>Pancakes are best eaten fresh </div>}
          right={<RightMeta time="3min ago" badge={<NotiBadge>2</NotiBadge>} />}
        />

        {/* 4. Keep Memo */}
        <ChatRow
          top={204}
          thumb={
            <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FC0E0E" }} />
              <div style={{ position: "absolute", left: 34, top: 32, width: 16, height: 16 }}>
                <Icon name="badgePin" />
              </div>
            </div>
          }
          title={<div style={titleStyle}>Keep Memo</div>}
          body={<div style={bodyStyle}>My storage is full</div>}
          right={<RightMeta time="3min ago" badge={<NotiBadge>2</NotiBadge>} />}
        />

        {/* 5. Group — Singles (3) */}
        <ChatRow
          top={272}
          thumb={<Avatar48 />}
          title={
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
              <div style={{ width: 25, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="listBadgeCall" />
              </div>
              <span style={titleStyle}>Singles (3)</span>
            </div>
          }
          body={
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3 }}>
              <div style={{ width: 12, height: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="callIcon" />
              </div>
              <span style={bodyStyle}>Group video call stared.</span>
            </div>
          }
          right={<RightMeta time="5min ago" badge={<NotiBadge>3</NotiBadge>} />}
        />

        {/* 6. Group (Mentioned) — Europe Travelers */}
        <ChatRow
          top={340}
          thumb={
            <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#D9D9D9" }} />
              <div style={{ position: "absolute", left: 34, top: 32, width: 16, height: 16 }}>
                <Icon name="badgeFavorites" />
              </div>
            </div>
          }
          title={
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
              <span style={{ ...titleStyle, flex: "0 1 auto" }}>Europe Travelers (268)</span>
              <span style={{ width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="badgeMuted" />
              </span>
            </div>
          }
          body={
            <>
              <div style={bodyStyle}>Pancakes are best eaten fresh from</div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5, marginTop: 0 }}>
                <span style={{ fontFamily: fontStack, fontSize: 12, fontWeight: fw.Regular, color: "#4D73FF", lineHeight: "14px" }}>
                  You were mentioned.
                </span>
                <span style={{ width: 2, height: 2, display: "inline-flex" }}>
                  <Icon name="oval2" />
                </span>
                <span style={{ fontFamily: fontStack, fontSize: 12, fontWeight: fw.Regular, color: "#B7B7B7", lineHeight: "14px" }}>
                  Multi chat title
                </span>
              </div>
            </>
          }
          right={
            <RightMeta
              time="5min ago"
              badge={
                <NotiBadge width={40}>
                  <span style={{ width: 13, height: 13, position: "relative", display: "inline-flex" }}>
                    <span style={{ position: "absolute", left: 1, top: 2 }}>
                      <Icon name="threadMain" />
                    </span>
                    <span style={{ position: "absolute", left: 5, top: 4 }}>
                      <Icon name="threadSub" />
                    </span>
                  </span>
                  5
                </NotiBadge>
              }
            />
          }
        />

        {/* 7. Chat — Camping group */}
        <ChatRow
          top={408}
          thumb={<Avatar48 />}
          title={<div style={titleStyle}>Camping group (1)</div>}
          body={
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3 }}>
              <span style={bodyStyle}>sujung invited you to the group.</span>
            </div>
          }
          right={
            <div style={{ width: 24, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="notiNewMessage" />
            </div>
          }
        />
      </main>

      {/* Bottom Navigation */}
      <nav
        style={{
          position: "relative",
          width: 375,
          height: 84,
          background: "#FFFFFF",
          boxShadow: "0 -3px 5px rgba(0,0,0,0.05)",
          flexShrink: 0,
        }}
      >
        {[
          { x: 6, label: "Home", icon: "navHome" as const, badge: "dot", size: { w: 19, h: 20, x: 23, y: 28 } },
          { x: 81, label: "Chats", icon: "navChats" as const, badge: "111", size: { w: 19, h: 20, x: 22, y: 28 } },
          { x: 156, label: "Voom", icon: "navVoom" as const, badge: "dot", size: { w: 24, h: 24, x: 20, y: 26 } },
          { x: 231, label: "News", icon: "navNews" as const, badge: "dot", size: { w: 17, h: 18, x: 24, y: 29 } },
          { x: 306, label: "Wallet", icon: "navWallet" as const, badge: "dot", size: { w: 18, h: 16, x: 23, y: 30 } },
        ].map((tab) => (
          <button
            key={tab.label}
            aria-label={tab.label}
            style={{
              position: "absolute",
              left: tab.x,
              top: -20,
              width: 64,
              height: 69,
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <span style={{ position: "absolute", left: tab.size.x, top: tab.size.y, width: tab.size.w, height: tab.size.h, display: "inline-flex" }}>
              <Icon name={tab.icon} />
            </span>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: 51,
                width: 40,
                height: 11,
                color: "#111111",
                fontFamily: fontStack,
                fontSize: 9,
                fontWeight: fw.Regular,
                textAlign: "center",
                lineHeight: "11px",
              }}
            >
              {tab.label}
            </span>
            {tab.badge === "dot" ? (
              <span style={{ position: "absolute", left: 47, top: 26, width: 5, height: 5, display: "inline-flex" }}>
                <Icon name="dotRed" />
              </span>
            ) : (
              <span
                style={{
                  position: "absolute",
                  left: 38,
                  top: 25,
                  minWidth: 25,
                  height: 16,
                  background: "#FF334B",
                  border: "1.5px solid #FFFFFF",
                  borderRadius: 100,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5px 4.5px 2.5px 4.5px",
                  color: "#FFFFFF",
                  fontFamily: fontStack,
                  fontSize: 10,
                  fontWeight: fw.Bold,
                  lineHeight: "12px",
                  boxSizing: "border-box",
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
        {/* Home Indicator */}
        <div style={{ position: "absolute", left: 120, top: 71, width: 134, height: 5, background: "#000000", borderRadius: 100 }} />
      </nav>
    </div>
  );
}
