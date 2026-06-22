// ChatBubble.tsx — from: chat bubble (Figma rootLabel)
// NOTE: ICONS map embedded in this single file per user's single-file request.
//       PROMPT.md normally requires a separate Icon.tsx module.

import React from "react";

// ── Design tokens (import foundation CSS in your entry to activate) ──────────
// All colour/typography/spacing values reference var(--…) from foundation/

// ── Icons ────────────────────────────────────────────────────────────────────
const ICONS: Record<string, string> = {
  // Clip 5 (sent tail, 12×12 at x=0,y=0) — same shape as ico_1, green fill
  // ico_0 (Fill 1, 10×9 at x=10,y=1) is an internal Figma fill, not the visual ear
  tailSent: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow:hidden"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.95003 9.00014C2.02103 6.78814 0.699031 4.04514 0.220031 1.01514C2.80703 2.86414 5.95903 3.96614 9.37403 3.99414C12.399 1.49914 3.64703 12.1921 4.76403 9.88814C4.48003 9.60214 4.21303 9.30214 3.95003 9.00014Z" fill="var(--rainbow-colors-chatbubblesurface)"/></svg>`,
  // ico_1 — white tail for received bubbles (from: tail 12x12) — mask replaced with overflow:hidden
  tailReceived: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow:hidden"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.95003 9.00014C2.02103 6.78814 0.699031 4.04514 0.220031 1.01514C2.80703 2.86414 5.95903 3.96614 9.37403 3.99414C12.399 1.49914 3.64703 12.1921 4.76403 9.88814C4.48003 9.60214 4.21303 9.30214 3.95003 9.00014Z" fill="var(--neutral-colors-linewhite)"/></svg>`,
  // ico_8 — back arrow (from: Frame 48 18x24)
  backArrow: `<svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.5523 21.1046L3 12.5523L11.5523 4" stroke="var(--neutral-colors-lineblack)" stroke-width="1.5"/></svg>`,
  // ico_9 — search (from: Group 34 18x18)
  search: `<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.6295 12.8766L18.3108 18.4898" stroke="var(--neutral-colors-lineblack)" stroke-width="1.5"/><path d="M7.55859 4.19818V7.80944L10.347 10.626" stroke="var(--neutral-colors-lineblack)" stroke-width="1.5"/><circle cx="7.875" cy="7.875" r="7.125" stroke="var(--neutral-colors-lineblack)" stroke-width="1.5"/></svg>`,
  // ico_10 — call (from: Path 17x17)
  call: `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.96244 11.6024L6.88602 14.5314C8.03457 15.6821 9.39195 16.6236 10.7493 17.1466C12.1067 17.6696 13.3597 17.8789 14.6126 17.6696C15.448 17.565 16.1788 17.1466 16.7009 16.519L17.5362 15.4729C17.8495 15.0544 17.8495 14.4268 17.3274 14.0083L13.7773 11.0793C13.4641 10.8701 13.2553 10.8701 13.0464 11.1839L11.5846 12.8577C11.0626 13.3807 10.6449 13.3807 10.1228 12.8577L5.63306 8.35949C5.11099 7.83645 5.11099 7.41801 5.63306 6.89497L7.30368 5.43045C7.61692 5.22124 7.61692 4.90741 7.40809 4.69819L4.48451 1.14151C4.17126 0.723072 3.44037 0.618464 3.02271 0.932289L1.97857 1.76916C1.35209 2.39681 1.03885 3.12907 0.830023 3.86133C0.621196 5.11663 0.830023 6.37193 1.35209 7.73184C1.87416 9.09175 2.81388 10.4517 3.96244 11.6024Z" stroke="var(--neutral-colors-lineblack)" stroke-width="1.5" stroke-linecap="square"/></svg>`,
  // ico_11 — menu (from: Group 3 15x15)
  menu: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.75 0.75H15.25" stroke="var(--neutral-colors-linegray900)" stroke-width="1.5" stroke-linecap="square"/><path d="M0.75 7.54999H15.25" stroke="var(--neutral-colors-linegray900)" stroke-width="1.5" stroke-linecap="square"/><path d="M0.75 14.35H15.25" stroke="var(--neutral-colors-linegray900)" stroke-width="1.5" stroke-linecap="square"/></svg>`,
  // ico_12 — battery (from: Battery 24x11)
  battery: `<svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.35" x="0.5" y="0.5" width="21" height="10.3333" rx="2.16667" stroke="var(--neutral-colors-lineblack)"/><path opacity="0.4" d="M23 3.66669V7.66669C23.8047 7.32791 24.328 6.53982 24.328 5.66669C24.328 4.79355 23.8047 4.00546 23 3.66669" fill="var(--neutral-colors-lineblack)"/><rect x="2" y="2" width="18" height="7.33333" rx="1.33333" fill="var(--neutral-colors-lineblack)"/></svg>`,
  // ico_13 — wifi (from: Wifi 15x11)
  wifi: `<svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.44825 8.42669C6.72891 7.34442 8.60509 7.34442 9.88575 8.42669C9.9501 8.4849 9.98749 8.56751 9.98926 8.65423C9.99092 8.74086 9.95644 8.82399 9.89454 8.8847L7.88965 10.9072C7.83087 10.9666 7.7506 10.9999 7.667 10.9999C7.5834 10.9999 7.50311 10.9666 7.44434 10.9072L5.43848 8.8847C5.37688 8.824 5.34303 8.74066 5.34473 8.65423C5.34657 8.56755 5.3839 8.48485 5.44825 8.42669ZM2.77247 5.72942C5.5316 3.16504 9.80432 3.1651 12.5635 5.72942C12.6258 5.78956 12.6612 5.87238 12.6621 5.95892C12.6629 6.04526 12.6293 6.12811 12.5684 6.18938L11.4092 7.36028C11.2897 7.47959 11.0971 7.48144 10.9746 7.36517C10.0685 6.5454 8.88933 6.09165 7.667 6.09173C6.4456 6.09225 5.26773 6.5461 4.36231 7.36517C4.23976 7.48151 4.04623 7.47979 3.92676 7.36028L2.76856 6.18938C2.70748 6.12818 2.67313 6.04533 2.67383 5.95892C2.67465 5.87244 2.71026 5.78954 2.77247 5.72942ZM0.0966847 3.03899C4.3285 -1.01307 11.0044 -1.01292 15.2363 3.03899C15.2976 3.09919 15.3325 3.18166 15.333 3.26751C15.3335 3.35327 15.2998 3.43615 15.2393 3.497L14.0791 4.66692C13.9595 4.78702 13.765 4.7881 13.6436 4.66985C12.0312 3.13845 9.89158 2.28421 7.667 2.28411C5.44211 2.28412 3.30199 3.13822 1.68946 4.66985C1.56818 4.78822 1.37441 4.78703 1.25489 4.66692L0.0937551 3.497C0.0333244 3.43612 -0.000475824 3.35324 5.06194e-06 3.26751C0.000570337 3.18166 0.0353826 3.09915 0.0966847 3.03899Z" fill="var(--neutral-colors-lineblack)"/></svg>`,
  // ico_14 — cellular (from: Cellular Connection 17x11)
  cellular: `<svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.66699C2.55228 6.66699 3 7.11471 3 7.66699V9.66699C2.99982 10.2191 2.55218 10.667 2 10.667H1C0.447824 10.667 0.000175969 10.2191 0 9.66699V7.66699C0 7.11471 0.447715 6.66699 1 6.66699H2ZM6.66699 4.66699C7.21913 4.66717 7.66699 5.11482 7.66699 5.66699V9.66699C7.66682 10.219 7.21902 10.6668 6.66699 10.667H5.66699C5.11482 10.667 4.66717 10.2191 4.66699 9.66699V5.66699C4.66699 5.11471 5.11471 4.66699 5.66699 4.66699H6.66699ZM11.333 2.33301C11.8852 2.33301 12.3328 2.78087 12.333 3.33301V9.66699C12.3328 10.2191 11.8852 10.667 11.333 10.667H10.333C9.78098 10.6668 9.33318 10.219 9.33301 9.66699V3.33301C9.33318 2.78098 9.78098 2.33318 10.333 2.33301H11.333ZM16 0C16.5523 0 17 0.447715 17 1V9.66699C16.9998 10.2191 16.5522 10.667 16 10.667H15C14.4478 10.667 14.0002 10.2191 14 9.66699V1C14 0.447715 14.4477 0 15 0H16Z" fill="var(--neutral-colors-lineblack)"/></svg>`,
  // ico_15/16 combined — plus (+) icon for input bar (from: IOS / 303-2 / Light BG / chatroom_input_plus)
  // ico_15: vertical bar 2x21, ico_16: horizontal bar 2x21 (rotated 90° in Figma)
  inputPlus: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="19" y="9" width="2" height="21" fill="var(--neutral-colors-lineblack)"/><rect x="9" y="19" width="21" height="2" fill="var(--neutral-colors-lineblack)"/></svg>`,
  // ico_17 — camera (from: IOS / 303-2 / Light BG / chatroom_input_camera)
  inputCamera: `<svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.307 3.06989L13.922 1.00689C13.793 0.81489 13.578 0.69989 13.347 0.69989H7.71895C7.48795 0.69989 7.27195 0.81489 7.14295 1.00689L5.75895 3.06989H2.36695C1.44595 3.06989 0.699951 3.81589 0.699951 4.73689V18.4189C0.699951 19.3389 1.44595 20.0849 2.36695 20.0849H18.699C19.619 20.0849 20.366 19.3389 20.366 18.4189V4.73689C20.366 3.81589 19.619 3.06989 18.699 3.06989H15.307Z" stroke="var(--neutral-colors-lineblack)" stroke-width="1.4" stroke-linecap="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.3949 11.3208C14.3949 13.4538 12.6659 15.1828 10.5329 15.1828C8.39992 15.1828 6.66992 13.4538 6.66992 11.3208C6.66992 9.1878 8.39992 7.4588 10.5329 7.4588C12.6659 7.4588 14.3949 9.1878 14.3949 11.3208Z" stroke="var(--neutral-colors-lineblack)" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  // ico_18 — gallery (from: IOS / 303-2 / Light BG / chatroom_input_gallery_off)
  inputGallery: `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.36695 19.7H18.034C18.954 19.7 19.7 18.954 19.7 18.034V2.36695C19.7 1.44595 18.954 0.699951 18.034 0.699951H2.36695C1.44595 0.699951 0.699951 1.44595 0.699951 2.36695V18.034C0.699951 18.954 1.44595 19.7 2.36695 19.7Z" stroke="var(--neutral-colors-lineblack)" stroke-width="1.4"/><path d="M0.699951 12.194L5.71995 7.17404L11.829 13.284L14.848 10.264L19.7 15.116" stroke="var(--neutral-colors-lineblack)" stroke-width="1.4"/></svg>`,
  // ico_19 — sticker (from: IOS / 303-2 / Light BG / chatroom_input_sticker_on)
  inputSticker: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.87109 0.75H9.875C14.9145 0.750016 18.9999 4.83556 19 9.875V9.87891C19.0199 13.5785 16.8038 16.9246 13.3896 18.3496C9.9756 19.7744 6.0388 18.9967 3.42285 16.3809C0.806934 13.7649 0.029332 9.82813 1.4541 6.41406C2.8836 2.98909 6.1831 0.730118 9.87109 0.75Z" stroke="var(--neutral-colors-linegray600)" stroke-width="1.5"/><path d="M6.67236 11.6686C7.34318 12.8329 8.58465 13.5504 9.92839 13.5504C11.2721 13.5504 12.5136 12.8329 13.1844 11.6686" stroke="var(--neutral-colors-linegray600)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.90715" cy="8.06029" r="1.06755" fill="var(--neutral-colors-linegray600)"/><circle cx="12.8427" cy="8.06029" r="1.06755" fill="var(--neutral-colors-linegray600)"/></svg>`,
  // ico_20 — AI off (from: IOS / 303-2 / Light BG /chatroom_input_ai_off)
  inputAi: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.3842 3.61576C14.9548 2.27194 12.5723 1.46951 10.0007 1.46951H9.99931C7.42766 1.46951 5.04523 2.27055 3.61715 3.61576C2.27194 5.04522 1.46951 7.42764 1.46951 9.99928C1.46951 12.5709 2.27194 14.9533 3.61715 16.3828C5.04661 17.7266 7.42905 18.529 10.0007 18.529C12.5723 18.529 14.9562 17.728 16.3842 16.3828C17.7281 14.9533 18.5305 12.5709 18.5305 9.99928C18.5305 7.42764 17.7281 5.04522 16.3842 3.61576ZM2.57717 2.57716C4.37953 0.859054 7.19011 0 9.99931 0C12.8099 0 15.6205 0.859054 17.4242 2.57716C20.8591 6.18187 20.8591 13.8181 17.4242 17.4228C15.6219 19.1409 12.8113 19.9999 10.0007 19.9999C7.19011 19.9999 4.37953 19.1409 2.57717 17.4228C-0.859057 13.8181 -0.859057 6.18187 2.57717 2.57716ZM12.4785 6.47331V13.3015C12.4785 13.3968 12.531 13.459 12.6276 13.459H14.1372C14.2339 13.459 14.2947 13.3982 14.2947 13.3015V6.47331C14.2947 6.37663 14.2339 6.31586 14.1372 6.31586H12.6276C12.531 6.31586 12.4785 6.37663 12.4785 6.47331ZM9.22595 6.42635L11.9744 13.3015H11.9785C12.0089 13.3775 11.9537 13.459 11.8722 13.459H10.2673C10.1996 13.459 10.1403 13.4176 10.1182 13.354L9.71901 12.2298L9.19557 10.7548L8.41385 8.55189L7.64181 10.7548H8.92784L9.45129 12.2298H7.16256L6.76341 13.354C6.73993 13.4176 6.68055 13.459 6.61425 13.459H5.00939C4.92791 13.459 4.87266 13.3761 4.90305 13.3015L7.65147 6.42635C7.67772 6.35868 7.74401 6.31448 7.81583 6.31448H9.0616C9.13342 6.31448 9.19971 6.35868 9.22595 6.42635Z" fill="var(--neutral-colors-linegray600)"/></svg>`,
  // ico_21 — voice (from: IOS / 303-2 / Light BG / chatroom_input_voice)
  inputVoice: `<svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.32251 9.9076C4.32251 12.1197 6.11586 13.9129 8.32792 13.9129C10.54 13.9129 12.3333 12.1197 12.3333 9.9076V4.75408C12.3333 2.54202 10.54 0.748779 8.32792 0.748779C6.11586 0.748779 4.32251 2.54202 4.32251 4.75408V9.9076Z" stroke="var(--neutral-colors-lineblack)" stroke-width="1.4976"/><path d="M8.3278 21.3632V17.5708" stroke="var(--neutral-colors-lineblack)" stroke-width="1.4976"/><path d="M0.744385 10.7758C1.16114 14.5966 4.39609 17.5708 8.32772 17.5708C12.2594 17.5708 15.4943 14.5966 15.9111 10.7758" stroke="var(--neutral-colors-lineblack)" stroke-width="1.4976"/></svg>`,
};

const Icon = ({ name, style }: { name: string; style?: React.CSSProperties }) => (
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

// ── StatusBar ─────────────────────────────────────────────────────────────────
// from: Status Bar
const StatusBar: React.FC = () => (
  <div
    style={{
      width: 375,
      height: 44,
      // TODO: token? — #8CABD8 not in token list; matches nav background
      backgroundColor: "#8CABD8",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 11,
      paddingBottom: 12,
      paddingLeft: 20,
      paddingRight: 14,
      boxSizing: "border-box",
    }}
  >
    {/* from: IOS / Light / Status bar / Time - Default */}
    <span
      style={{
        fontSize: "var(--font-size-ios-font-size-text-15)",
        fontWeight:
          "var(--font-weight-ios-font-weight-semibold)" as React.CSSProperties["fontWeight"],
        fontFamily: "var(--font-family-font-family-text-ios)",
        color: "var(--neutral-colors-lineblack)",
        lineHeight: 1,
        width: 54,
        height: 18,
      }}
    >
      9:41
    </span>
    {/* from: Status Bar — Group 1 (cellular, wifi, battery) */}
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
      <Icon name="cellular" style={{ width: 17, height: 11 }} />
      <Icon name="wifi" style={{ width: 15, height: 11 }} />
      <Icon name="battery" style={{ width: 24, height: 11 }} />
    </div>
  </div>
);

// ── TopNavigation ─────────────────────────────────────────────────────────────
// from: Top Navigation
const TopNavigation: React.FC = () => (
  <nav
    style={{
      width: 375,
      height: 44,
      // TODO: token? — #8CABD8 not in token list
      backgroundColor: "#8CABD8",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 16,
      paddingRight: 16,
      gap: 16,
      boxSizing: "border-box",
    }}
  >
    {/* Left: back arrow + title */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* from: IOS / Light / Icon /navi_top_chat_back — ico_8 */}
      <Icon name="backArrow" style={{ width: 18, height: 24, flexShrink: 0 }} />
      {/* Title text — verbatim from tree */}
      <span
        style={{
          fontFamily: "var(--font-family-font-family-text-ios)",
          // TODO: token? — fontSize: 0 with fontWeight "mixed" in tree; using display-size token as best match
          fontSize: "var(--font-size-ios-font-size-text-17)",
          fontWeight:
            "var(--font-weight-ios-font-weight-semibold)" as React.CSSProperties["fontWeight"],
          color: "var(--neutral-colors-lineblack)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        新宿 犬のお母さんたち (4)
      </span>
    </div>
    {/* Right icons */}
    {/* from: IOS / 303-1 / Badge Type wrapping search, call, menu */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        flexShrink: 0,
      }}
    >
      {/* from: IOS / Light / Icon /navi_top_chat_search */}
      <Icon name="search" style={{ width: 24, height: 24 }} />
      {/* from: IOS / Light / Icon /navi_top_call */}
      <Icon name="call" style={{ width: 24, height: 24 }} />
      {/* from: IOS / Light / Icon /navi_top_menu */}
      <Icon name="menu" style={{ width: 24, height: 24 }} />
    </div>
  </nav>
);

// ── SentMessage ───────────────────────────────────────────────────────────────
// from: Text Message (sent variant — no profile, right-aligned, green bubble)
interface SentMessageProps {
  text: string;
  timestamp: string;
  lines?: number;
}

const SentMessage: React.FC<SentMessageProps> = ({ text, timestamp, lines = 1 }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      paddingLeft: 8,
      paddingRight: 8,
      paddingBottom: 7,
      gap: 3,
    }}
  >
    {/* Timestamp (left of bubble, bottom-aligned) */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        paddingLeft: 5,
        paddingBottom: 4,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-family-font-family-text-ios)",
          fontSize: "var(--font-size-ios-font-size-text-10)",
          fontWeight:
            "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"],
          color: "var(--opacity-lineblack_alpha50)",
          width: 45,
          height: 24,
          whiteSpace: "pre-line",
          lineHeight: 1.4,
        }}
      >
        {timestamp}
      </span>
    </div>
    {/* Bubble with tail */}
    <div style={{ position: "relative" }}>
      {/* Green tail — right side, horizontally flipped */}
      <Icon
        name="tailSent"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 12,
          height: 12,
          zIndex: 0,
          transform: "scaleX(-1)",
        }}
      />
      {/* Green bubble — from: Frame 74 / Group 62 */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginRight: 3,
          backgroundColor: "var(--rainbow-colors-chatbubblesurface)",
          // TODO: token? — cornerRadius 17 not in token list (closest: --radius-radius-12 = 12px)
          borderRadius: 17,
          paddingTop: 6,
          paddingBottom: 8,
          paddingLeft: 14,
          paddingRight: 14,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-family-font-family-text-ios)",
            fontSize: "var(--font-size-ios-font-size-text-14)",
            fontWeight:
              "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"],
            color: "var(--neutral-colors-linegray900)",
            whiteSpace: lines > 1 ? "pre-wrap" : "nowrap",
            display: "block",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  </div>
);

// ── ReceivedMessage ───────────────────────────────────────────────────────────
// from: Text Message (received variant — with profile + username, white bubble)
interface ReceivedMessageProps {
  username: string;
  text: string;
  timestamp: string;
  lines?: number;
  showProfile?: boolean;
  usernameSize?: number; // fontSize for username (10 or 11)
}

const ReceivedMessage: React.FC<ReceivedMessageProps> = ({
  username,
  text,
  timestamp,
  lines = 1,
  showProfile = true,
  usernameSize = 11,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      paddingLeft: 8,
      paddingBottom: 7,
      gap: 3,
    }}
  >
    {/* Profile avatar — ELLIPSE with image fill (raster per health report) */}
    {showProfile ? (
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          // TODO: token? — image fill, no SVG available; placeholder
          backgroundColor: "var(--neutral-colors-linegray300)",
          flexShrink: 0,
        }}
      />
    ) : (
      // Spacer to preserve indent when profile is hidden (continuation message)
      <div style={{ width: 30, flexShrink: 0 }} />
    )}

    {/* Content column: username + bubble row */}
    <div style={{ display: "flex", flexDirection: "column", gap: showProfile ? 5 : 0 }}>
      {/* Username — first message in sequence only */}
      {showProfile && (
        <div style={{ paddingLeft: 5 }}>
          <span
            style={{
              fontFamily: "var(--font-family-font-family-text-ios)",
              fontSize:
                usernameSize === 10
                  ? "var(--font-size-ios-font-size-text-10)"
                  : "var(--font-size-ios-font-size-text-11)",
              fontWeight:
                "var(--font-weight-ios-font-weight-medium)" as React.CSSProperties["fontWeight"],
              color: "var(--neutral-colors-linegray900)",
              display: "block",
            }}
          >
            {username}
          </span>
        </div>
      )}

      {/* Bubble row: bubble + timestamp */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "flex-start",
        }}
      >
        {/* Bubble with tail */}
        <div style={{ position: "relative" }}>
          {/* White tail — first message in sequence only */}
          {showProfile && (
            <Icon
              name="tailReceived"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 12,
                height: 12,
                zIndex: 0,
              }}
            />
          )}
          {/* White bubble — from: Bubble */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginLeft: showProfile ? 3 : 6,
              backgroundColor: "var(--neutral-colors-linewhite)",
              // TODO: token? — cornerRadius 17 not in token list
              borderRadius: 17,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 14,
              paddingRight: 14,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-family-font-family-text-ios)",
                fontSize: "var(--font-size-ios-font-size-text-14)",
                fontWeight:
                  "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"],
                color: "var(--neutral-colors-linegray900)",
                whiteSpace: lines > 1 ? "pre-wrap" : "nowrap",
                display: "block",
              }}
            >
              {text}
            </span>
          </div>
        </div>

        {/* Timestamp */}
        <div style={{ paddingLeft: 5, paddingBottom: 4 }}>
          <span
            style={{
              fontFamily: "var(--font-family-font-family-text-ios)",
              fontSize: "var(--font-size-ios-font-size-text-10)",
              fontWeight:
                "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"],
              color: "var(--opacity-lineblack_alpha50)",
              width: 45,
              height: 24,
              whiteSpace: "pre-line",
              lineHeight: 1.4,
              display: "block",
            }}
          >
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// ── PhotoMessage ──────────────────────────────────────────────────────────────
// みお's photo grid section (profile + 2×4 image grid with video overlay)
// Nodes: profile ELLIPSE y=838, Frame 70 username y=838, photo RECTs y=855–1219
// from: standalone absolute nodes (みお's photos, not a Text Message instance)
const PhotoMessage: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      paddingLeft: 8,
      paddingBottom: 14,
      gap: 3,
    }}
  >
    {/* Profile — ELLIPSE raster (health: raster-in-icon-slot warning) */}
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        // TODO: token? — image fill placeholder
        backgroundColor: "var(--neutral-colors-linegray300)",
        flexShrink: 0,
      }}
    />

    {/* Photo grid column */}
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {/* Username */}
      <div style={{ paddingLeft: 5 }}>
        <span
          style={{
            fontFamily: "var(--font-family-font-family-text-ios)",
            fontSize: "var(--font-size-ios-font-size-text-10)",
            fontWeight:
              "var(--font-weight-ios-font-weight-medium)" as React.CSSProperties["fontWeight"],
            color: "var(--neutral-colors-linegray900)",
            display: "block",
          }}
        >
          みお
        </span>
      </div>

      {/* 2 × 4 photo grid — each cell 120×120, 1px gap */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Row 1 — left cell has video overlay */}
        <div style={{ display: "flex", flexDirection: "row", gap: 1 }}>
          {/* Left photo with video overlay (album_thumb_play + "1:03") */}
          {/* from: album_thumb_play */}
          <div
            style={{
              position: "relative",
              width: 120,
              height: 120,
              backgroundImage: "url(/dog_01.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "12px 0 0 0",
              overflow: "hidden",
            }}
          >
            {/* Play overlay — Group 2085669966: canvas x=47,y=951 → photo-relative left=3,bottom=7 */}
            {/* album_thumb_play(18×17) + gap:68 + "1:03"(25px) = 111px total */}
            <div
              style={{
                position: "absolute",
                left: 3,
                bottom: 7,
                width: 111,
                height: 17,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 68,
              }}
            >
              {/* album_thumb_play: 18×17. Triangle at local x=3, y=2, 12×10 */}
              <div style={{ width: 18, height: 17, flexShrink: 0, position: "relative" }}>
                <svg
                  width="9"
                  height="11"
                  viewBox="0 0 9 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: "absolute",
                    left: 3,
                    top: 2,
                    filter: "drop-shadow(0 0 2px rgba(0,0,0,0.25))",
                  }}
                >
                  {/* exact Figma export path — LDS album_thumb_play Triangle */}
                  <path
                    d="M8.31501 4.15824C8.97058 4.54521 8.97058 5.49361 8.31501 5.88057L1.50823 9.89846C0.841613 10.292 -9.53674e-05 9.81139 -9.53674e-05 9.0373V1.00152C-9.53674e-05 0.227426 0.841611 -0.253137 1.50823 0.140354L8.31501 4.15824Z"
                    fill="var(--neutral-colors-linewhite)"
                  />
                </svg>
              </div>
              {/* "1:03" — canvas x=133 → photo-relative x=89 = 3(overlay)+18(component)+68(gap) */}
              <span
                style={{
                  fontFamily: "var(--font-family-font-family-text-ios)",
                  fontSize: "var(--font-size-ios-font-size-text-12)",
                  fontWeight:
                    "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"],
                  color: "var(--neutral-colors-linewhite)",
                  textShadow: "0 0 2px rgba(0,0,0,0.5)",
                }}
              >
                1:03
              </span>
            </div>
          </div>
          {/* Right photo */}
          <div
            style={{
              width: 120,
              height: 120,
              backgroundImage: "url(/dog_02.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "0 12px 0 0",
            }}
          />
        </div>
        {/* Row 2 */}
        <div style={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <div
            style={{
              width: 120,
              height: 120,
              backgroundImage: "url(/dog_03.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 0,
            }}
          />
          <div
            style={{
              width: 120,
              height: 120,
              backgroundImage: "url(/dog_04.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 0,
            }}
          />
        </div>
        {/* Row 3 */}
        <div style={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <div
            style={{
              width: 120,
              height: 120,
              backgroundImage: "url(/dog_05.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 0,
            }}
          />
          <div
            style={{
              width: 120,
              height: 120,
              backgroundImage: "url(/dog_06.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 0,
            }}
          />
        </div>
        {/* Row 4 */}
        <div style={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <div
            style={{
              width: 120,
              height: 120,
              backgroundImage: "url(/dog_07.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "0 0 0 12px",
            }}
          />
          <div
            style={{
              width: 120,
              height: 120,
              backgroundImage: "url(/dog_08.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "0 0 12px 0",
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

// ── UnreadSeparator ───────────────────────────────────────────────────────────
// from: Time stamp (359×24 full-width) — "未読メッセージ" badge
// Rectangle bg 359×24, cornerRadius=12, fill=#000 → --opacity-lineblack_alpha50
// Text x=144(center), y=5, fontSize=10, fontWeight=W4
const UnreadSeparator: React.FC = () => (
  <div style={{ paddingTop: 8, paddingLeft: 8, paddingRight: 8 }}>
    <div
      style={{
        // 359×24 badge — x=8 within 375px chat (8px margin each side)
        backgroundColor: "var(--opacity-opacity-black-15)",
        borderRadius: 12,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-family-font-family-text-ios)",
          fontSize: "var(--font-size-ios-font-size-text-10)",
          fontWeight:
            "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"],
          color: "var(--neutral-colors-linewhite)",
          lineHeight: 1,
          letterSpacing: "var(--letter-spacing-ios-letter-spacing-size-10)",
        }}
      >
        未読メッセージ
      </span>
    </div>
  </div>
);

// ── TodaySeparator ────────────────────────────────────────────────────────────
// from: Time stamp (53×24 pill) — "Today" badge
// Rectangle bg 53×24, cornerRadius=12, fill=#000 → --opacity-lineblack_alpha50
// Text x=10, y=8(centered), width=33, height=8, fontSize=12, fontWeight=Regular
// gap=15 from inferredLayout between UnreadSeparator and TodaySeparator
const TodaySeparator: React.FC = () => (
  <div
    style={{
      paddingTop: 15,
      paddingBottom: 8,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        backgroundColor: "var(--opacity-opacity-black-15)",
        borderRadius: 12,
        width: 53,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-family-font-family-text-ios)",
          fontSize: "var(--font-size-ios-font-size-text-12)",
          fontWeight:
            "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"],
          color: "var(--neutral-colors-linewhite)",
          lineHeight: 1,
          letterSpacing: "var(--letter-spacing-ios-letter-spacing-size-12)",
        }}
      >
        Today
      </span>
    </div>
  </div>
);

// ── AddedItemMessage ──────────────────────────────────────────────────────────
// from: Frame 2085673174 (375×371)
//   └ INSTANCE "User=Receiver, img=3 / 楽しい私たちの旅" (375×338) — album card
//   └ floating_blue_close (230×33, x=44) — banner below card
const AddedItemMessage: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    {/* Received-style row — paddingLeft:44 maps to: 8(outer) + 30(avatar) + 6(gap) */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        paddingLeft: 8,
        paddingBottom: 0,
        gap: 6,
      }}
    >
      {/* Profile avatar */}
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          backgroundColor: "var(--neutral-colors-linegray300)",
          flexShrink: 0,
        }}
      />

      {/* Content column: username + card-row */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {/* Username */}
        <div style={{ paddingLeft: 5 }}>
          <span
            style={{
              fontFamily: "var(--font-family-font-family-text-ios)",
              fontSize: "var(--font-size-ios-font-size-text-11)",
              fontWeight:
                "var(--font-weight-ios-font-weight-medium)" as React.CSSProperties["fontWeight"],
              color: "var(--neutral-colors-linegray900)",
              display: "block",
            }}
          >
            Mai
          </span>
        </div>

        {/* Card + timestamp row */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
          {/* Album card — 241×331, borderRadius:17, overflow:hidden */}
          <div
            style={{
              width: 241,
              borderRadius: 17,
              overflow: "hidden",
              backgroundColor: "var(--neutral-colors-linewhite)",
            }}
          >
            {/* ── iOS / Image Type (241×241) ── */}
            {/* 01: x=0,y=0 w=120,h=241 | 02: x=121,y=0 w=120,h=120 | 03: x=121,y=121 w=120,h=120 */}
            <div style={{ position: "relative", width: 241, height: 241 }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 120,
                  height: 241,
                  backgroundColor: "var(--neutral-colors-linegray300)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 121,
                  top: 0,
                  width: 120,
                  height: 120,
                  backgroundColor: "var(--neutral-colors-linegray300)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 121,
                  top: 121,
                  width: 120,
                  height: 120,
                  backgroundColor: "var(--neutral-colors-linegray300)",
                }}
              />
            </div>

            {/* ── Bottom (241×90) — title + subtitle + service label ── */}
            {/* paddingLeft/Right:14 applied to text; Frame 110 breaks out via negative margin */}
            <div
              style={{
                backgroundColor: "var(--neutral-colors-linewhite)",
                paddingTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* ✏️Title — fontSize:13, W6, #111111 */}
              <span
                style={{
                  fontFamily: "var(--font-family-font-family-text-ios)",
                  fontSize: "var(--font-size-ios-font-size-text-13)",
                  // TODO: token? — W6 SemiBold (600)
                  fontWeight: 600 as React.CSSProperties["fontWeight"],
                  color: "#111111",
                  paddingLeft: 14,
                  paddingRight: 14,
                  display: "block",
                }}
              >
                楽しい私たちの旅
              </span>

              {/* ✏️Sub — fontSize:12, W4, #777777 */}
              <span
                style={{
                  fontFamily: "var(--font-family-font-family-text-ios)",
                  fontSize: "var(--font-size-ios-font-size-text-12)",
                  fontWeight:
                    "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"],
                  // TODO: token? — #777777 not in token list
                  color: "#777777",
                  paddingLeft: 14,
                  paddingRight: 14,
                  display: "block",
                }}
              >
                アルバムを作成しました
              </span>

              {/* Frame 110 — full-width (breaks padding via negative margin), paddingTop:10 */}
              <div style={{ marginLeft: 0, paddingTop: 10 }}>
                {/* Indivisual line (1px, #EFEFEF) */}
                <div style={{ height: 1, backgroundColor: "#EFEFEF" }} />

                {/* iOS / Service Label icon + text row — height:32 (33 − 1px line) */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: 32,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                >
                  {/* iOS / Service Label Icon (14×15) — ico_0+ico_1 circle, ico_2 image icon */}
                  <div style={{ position: "relative", width: 14, height: 15, flexShrink: 0 }}>
                    {/* ico_0: green filled circle (y=1) */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ position: "absolute", left: 0, top: 1 }}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.1965 12.1969C9.67402 14.6022 4.32685 14.6022 1.80436 12.1969C-0.601454 9.67363 -0.601454 4.32724 1.80436 1.80401C4.32685 -0.601338 9.67285 -0.601338 12.1965 1.80401C14.6012 4.32724 14.6012 9.67363 12.1965 12.1969Z"
                        fill="#06C755"
                      />
                    </svg>
                    {/* ico_1: thin stroke overlay (y=1) */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ position: "absolute", left: 0, top: 1 }}
                    >
                      <path
                        d="M7 0.25C8.9224 0.25 10.8177 0.838047 12.0195 1.98047C13.1618 3.182 13.7499 5.07731 13.75 7C13.75 8.9226 13.1616 10.8179 12.0195 12.0195C10.8183 13.1622 8.92282 13.751 7 13.751C5.07709 13.7509 3.1816 13.1624 1.98047 12.0195C0.838046 10.8179 0.25 8.92236 0.25 7C0.250089 5.07755 0.837846 3.18202 1.98047 1.98047C3.18172 0.837777 5.07733 0.25 7 0.25Z"
                        stroke="black"
                        strokeOpacity="0.05"
                        strokeWidth="0.5"
                      />
                    </svg>
                    {/* ico_2: image icon 7×7 at (x=4, y=4) */}
                    <svg
                      width="7"
                      height="7"
                      viewBox="0 0 7 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ position: "absolute", left: 4, top: 4 }}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.37482 6.75049C2.69883 6.75049 2.02732 6.71015 1.37943 6.62951C0.720148 6.54843 0.20267 6.03057 0.120944 5.37112C0.0407398 4.72283 0 4.0514 0 3.37524C0 2.69908 0.0407398 2.02762 0.120944 1.37936C0.202629 0.719915 0.720148 0.202062 1.37923 0.120974C2.02736 0.0402971 2.69883 0 3.37482 0C4.05081 0 4.72232 0.0403383 5.37021 0.120974C6.02949 0.202062 6.54697 0.719915 6.6287 1.37936C6.7089 2.02766 6.74964 2.69908 6.74964 3.37524C6.74964 4.0514 6.7089 4.72287 6.6287 5.37112C6.54701 6.03057 6.02949 6.54843 5.37041 6.62951C4.72232 6.71015 4.05081 6.75049 3.37482 6.75049Z"
                        fill="white"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.34561 2.22177C3.26848 2.0892 3.07699 2.0892 2.99986 2.22177L1.66217 4.52109C1.5846 4.65442 1.68079 4.82166 1.83504 4.82166H4.51042C4.66468 4.82166 4.76087 4.65442 4.6833 4.52109L3.34561 2.22177Z"
                        fill="#06C755"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.21919 2.0969C5.21919 2.40065 4.97323 2.64696 4.6699 2.64696C4.36657 2.64696 4.12061 2.40065 4.12061 2.0969C4.12061 1.79315 4.36657 1.54746 4.6699 1.54746C4.97323 1.54746 5.21919 1.79315 5.21919 2.0969"
                        fill="#06C755"
                      />
                    </svg>
                  </div>

                  {/* Frame 109: "アルバム" label + ico_3 chevron, space-between */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingLeft: 5,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-family-font-family-text-ios)",
                        fontSize: "var(--font-size-ios-font-size-text-10)",
                        fontWeight: 600 as React.CSSProperties["fontWeight"],
                        // TODO: token? — #949494 not in token list
                        color: "#949494",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      アルバム
                    </span>
                    {/* ico_3: gray chevron ">" (11×13) */}
                    <svg
                      width="11"
                      height="13"
                      viewBox="0 0 11 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect opacity="0.01" width="11" height="13" fill="#B7B7B7" />
                      <path d="M4 9.91845L7.45969 6.45876L4 3" stroke="#B7B7B7" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamp — same style as ReceivedMessage */}
          <div style={{ paddingLeft: 5, paddingBottom: 4 }}>
            <span
              style={{
                fontFamily: "var(--font-family-font-family-text-ios)",
                fontSize: "var(--font-size-ios-font-size-text-10)",
                fontWeight:
                  "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"],
                color: "var(--opacity-lineblack_alpha50)",
                width: 45,
                whiteSpace: "pre-line",
                lineHeight: 1.4,
                display: "block",
              }}
            >
              午前 11:00
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* floating_blue_close — x=44 aligns with card start (8+30+6=44), 230×33 */}
    <div style={{ paddingLeft: 44, paddingBottom: 7, marginTop: 7 }}>
      <div
        style={{
          width: "fit-content",
          height: 33,
          backgroundColor: "rgba(0,0,0,0.15)",
          // TODO: token? — cornerRadius 100 (pill)
          borderRadius: 100,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 10,
          paddingRight: 10,
          boxSizing: "border-box",
        }}
      >
        {/* CHECK badge + text + chevron */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          {/* lyp_nomemver_label — green pill */}
          <div
            style={{
              width: 40,
              height: 15,
              backgroundColor: "var(--brand-colors-linegreen-ios)",
              borderRadius: "var(--radius-radius-7)",
              paddingTop: 3,
              paddingBottom: 3,
              paddingLeft: 4.5,
              paddingRight: 4.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-family-font-family-text-ios)",
                fontSize: 8.3,
                fontWeight: 800 as React.CSSProperties["fontWeight"],
                color: "var(--neutral-colors-linewhite)",
                lineHeight: 1,
              }}
            >
              CHECK
            </span>
          </div>
          {/* text + chevron — gap 3 */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3 }}>
            <span
              style={{
                fontFamily: "var(--font-family-font-family-text-ios)",
                fontSize: "var(--font-size-ios-font-size-text-11)",
                fontWeight:
                  "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"],
                color: "var(--neutral-colors-linewhite)",
                textShadow: "0 0 1px rgba(0,0,0,0.10)",
              }}
            >
              動画を追加する方法をチェック
            </span>
            {/* ico_4: white semi-transparent chevron (9×11) */}
            <svg
              width="9"
              height="11"
              viewBox="0 0 9 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <g opacity="0.5">
                <path
                  d="M3.5 9.35053L7.35104 5.49949L3.5 1.64948"
                  stroke="white"
                  strokeWidth="1.3"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── InputBar ──────────────────────────────────────────────────────────────────
// from: Input (outer frame, VERTICAL layout)
//   └ Input (inner, bg white) + Home Indicator
const InputBar: React.FC = () => (
  <footer
    style={{
      width: 375,
      height: 85,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "center",
    }}
  >
    {/* Input row — from: Input (inner FRAME, height 51) */}
    <div
      style={{
        width: 375,
        height: 51,
        backgroundColor: "var(--neutral-colors-linewhite)",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingTop: 6,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        boxSizing: "border-box",
        gap: 0,
      }}
    >
      {/* Group 2: left icons + input field */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingRight: 8,
          flex: 1,
        }}
      >
        {/* Frame 41: plus + camera + gallery icons */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* from: IOS / 303-2 / Light BG / chatroom_input_plus */}
          <div
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="inputPlus" style={{ width: 40, height: 40 }} />
          </div>
          {/* from: IOS / 303-2 / Light BG / chatroom_input_camera */}
          <div
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="inputCamera" style={{ width: 22, height: 21 }} />
          </div>
          {/* from: IOS / 303-2 / Light BG / chatroom_input_gallery_off */}
          <div
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="inputGallery" style={{ width: 21, height: 21 }} />
          </div>
        </div>

        {/* Input Field — from: Input Field (FRAME, bg #F5F5F5, stroke 0.5px #EFEFEF, br 17) */}
        <div
          style={{
            flex: 1,
            height: 35,
            position: "relative",
            backgroundColor: "#F5F5F5",
            border: `0.5px solid var(--neutral-colors-linegray200)`,
            borderRadius: 17,
            boxSizing: "border-box",
          }}
        >
          {/* Real input — triggers iOS native keyboard on tap */}
          <input
            type="text"
            placeholder="Aa"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "calc(100% - 70px)",
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              paddingLeft: 12,
              paddingRight: 0,
              fontFamily: "var(--font-family-font-family-text-ios)",
              // iOS Safari: font-size < 16px면 자동 줌 + 키보드 미표시 버그 → 16px 고정
              fontSize: 16,
              fontWeight:
                "var(--font-weight-ios-font-weight-regular)" as React.CSSProperties["fontWeight"],
              color: "var(--neutral-colors-linegray900)",
              boxSizing: "border-box",
              touchAction: "manipulation",
            }}
          />
          {/* from: IOS / 303-2 / Light BG /chatroom_input_ai_off */}
          <div
            style={{
              position: "absolute",
              right: 35,
              top: 0,
              width: 35,
              height: 35,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="inputAi" style={{ width: 20, height: 20 }} />
          </div>
          {/* from: IOS / 303-2 / Light BG / chatroom_input_sticker_on (📌 Icon Input field) */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: 35,
              height: 35,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="inputSticker" style={{ width: 20, height: 20 }} />
          </div>
        </div>
      </div>

      {/* Voice button — from: IOS / 303-2 / Light BG / chatroom_input_voice (📌 Icon 4) */}
      <div
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="inputVoice" style={{ width: 17, height: 22 }} />
      </div>
    </div>

    {/* Home Indicator — from: Home Indicator (INSTANCE, height 34) */}
    <div
      style={{
        width: 375,
        height: 34,
        backgroundColor: "var(--neutral-colors-linewhite)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 8,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 134,
          height: 5,
          backgroundColor: "var(--neutral-colors-lineblack)",
          // TODO: token? — cornerRadius 100 not in token list
          borderRadius: 100,
        }}
      />
    </div>
  </footer>
);

// ── ChatBubble (main screen) ──────────────────────────────────────────────────
// from: chat bubble (375×812 FRAME)
// All messages rendered verbatim in y-position order
export const ChatBubble: React.FC = () => (
  <>
    <style>{`main::-webkit-scrollbar { display: none; } input::placeholder { color: var(--neutral-colors-linegray350); font-family: var(--font-family-font-family-text-ios); }`}</style>
    <div
      style={{
        position: "relative",
        width: 375,
        height: 812,
        // TODO: token? — #8BABD7 background not in token list
        backgroundColor: "#8BABD7",
        fontFamily: "var(--font-family-font-family-text-ios)",
      }}
    >
      {/* ── Header (fixed, height 88) ── */}
      {/* from: Chat navigation GROUP (y=0, h=88): Rectangle bg + Status Bar + Top Navigation */}
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 375,
          height: 88,
          zIndex: 10,
        }}
      >
        <StatusBar />
        <TopNavigation />
      </header>

      {/* ── Scrollable message area ── */}
      {/* Inset: top 88px (header), bottom 85px (input) */}
      <main
        style={{
          position: "absolute",
          top: 88,
          bottom: 85,
          left: 0,
          width: 375,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none" as React.CSSProperties["scrollbarWidth"],
          paddingTop: 8,
          paddingBottom: 8,
          boxSizing: "border-box",
        }}
      >
        {/* ──────────────────────────────────────────
          Messages — ordered by Figma y-position
          ────────────────────────────────────────── */}

        {/* y=142 — from: Text Message INSTANCE (received, Mai, 3 lines) */}
        <ReceivedMessage
          username="Mai"
          text={"この前みんなでワンちゃん連れてド\nッグカフェ行ったの、めっちゃ楽\nしかったよね！"}
          timestamp={"既読 4\n午後 8:21"}
          lines={3}
        />

        {/* y=238 — from: Text Message INSTANCE (received, Mai) */}
        <ReceivedMessage
          username="Mai"
          text="ほんとだね"
          timestamp={"既読 4 午後 8:23"}
          showProfile={false}
        />

        {/* y=278 — from: Text Message FRAME (sent) */}
        <SentMessage text="かわいい子たちいっぱいだったし！" timestamp="既読 4 午後 8:23" />

        {/* y=318 — from: Text Message INSTANCE (received, Mai) */}
        <ReceivedMessage username="Mai" text="また行きたいね" timestamp={"既読 4\n午後 8:23"} />

        {/* y=376 — from: Text Message INSTANCE (received, Mai) */}
        <ReceivedMessage
          username="Mai"
          text="すごく癒されたなぁ"
          timestamp={"既読 4\n午後 8:23"}
          showProfile={false}
        />

        {/* y=443 — from: Text Message INSTANCE (sent) */}
        <SentMessage text="うん、うちのモモもすごく喜んでたよ" timestamp="既読 4 午後 8:23" />

        {/* y=489 — from: Text Message INSTANCE (received, はな) */}
        <ReceivedMessage
          username="はな"
          text="あの時、写真もけっこう撮ったよね"
          timestamp={"既読 4\n午後 8:23"}
          usernameSize={10}
        />

        {/* y=553 — from: Text Message FRAME (sent, 2 lines) */}
        <SentMessage
          text={"モモとほかのワンちゃんの写真も\n送ってもらえる？"}
          timestamp="既読 4 午後 8:23"
          lines={2}
        />

        {/* y=613 — from: Text Message INSTANCE (received, はな) */}
        <ReceivedMessage
          username="はな"
          text="あるよ！送るから待ってて"
          timestamp={"既読 4\n午後 8:24"}
          usernameSize={10}
        />

        {/* y=682 — from: Text Message INSTANCE (received, Mai) */}
        <ReceivedMessage username="Mai" text="うちも写真撮った！" timestamp={"既読 4\n午後 8:24"} />

        {/* y=751 — from: Text Message INSTANCE (received, みお, 2 lines) */}
        <ReceivedMessage
          username="みお"
          text={"写真ここに送るね モモもいるよ! すごくかわいい！"}
          timestamp={"既読 4\n午後 8:24"}
          lines={2}
          usernameSize={10}
        />

        {/* y=838–1340 — みお photo grid (standalone absolute nodes in Figma) */}
        <PhotoMessage />

        {/* y=1353 — from: Text Message INSTANCE (sent) */}
        <SentMessage text="可愛すぎる！" timestamp="既読 4 午後 8:25" />

        {/* y=1393 — from: Text Message FRAME (sent, 2 lines) */}
        <SentMessage
          text={"そういえば、みおのワンち\nゃんって何歳だっけ？"}
          timestamp="既読 4 午後 8:25"
          lines={2}
        />

        {/* y=1451 — from: Text Message INSTANCE (received, みお) */}
        <ReceivedMessage
          username="みお"
          text="8歳だよ！まだまだ若いでしょ"
          timestamp={"既読 4\n午後 8:32"}
          usernameSize={10}
        />

        {/* y=1560 — from: Text Message INSTANCE (received, Mai) */}
        <ReceivedMessage
          username="Mai"
          text="わ〜本当に可愛いね！"
          timestamp={"既読 4\n午後 8:35"}
        />

        {/* y=1669 — from: Text Message INSTANCE (received, はな) */}
        <ReceivedMessage
          username="はな"
          text="またワンちゃん連れてみんなで遊ぼうね!"
          timestamp={"既読 4\n午後 8:35"}
          usernameSize={10}
        />

        {/* y=1737 — from: Text Message INSTANCE (received, Mai) */}
        <ReceivedMessage
          username="Mai"
          text="いいね！いつにする？"
          timestamp={"既読 4\n午後 8:35"}
          showProfile={false}
        />

        {/* y=1846 — from: Text Message INSTANCE (received, はな) */}
        <ReceivedMessage
          username="はな"
          text="みんなでドッグラン行きたいな"
          timestamp={"既読 4\n午後 8:35"}
          usernameSize={10}
        />

        {/* y=1975 — from: Time stamp 2 GROUP */}
        <UnreadSeparator />
        <TodaySeparator />

        {/* y=2139 — from: Text Message INSTANCE (received, Mai) */}
        <ReceivedMessage
          username="Mai"
          text="ごめんね！みんなの犬は車は大丈夫？"
          timestamp={"既読 3\n午後 2:25"}
        />

        {/* y=2207 — from: Text Message INSTANCE (received, はな) */}
        <ReceivedMessage
          username="はな"
          text="うん！うちの子は大丈夫だよ"
          timestamp={"既読 3\n午後 2:26"}
          usernameSize={10}
        />

        {/* y=2265 — from: Text Message FRAME (received, no profile — continuation)
           Note: x=33 in Figma = indented, profile hidden; profile spacer maintained */}
        <ReceivedMessage
          username=""
          text="まいちゃんのワンコは苦手かな？"
          timestamp={"既読 2\n午後 2:28"}
          showProfile={false}
        />

        {/* y=2316 — from: Group 2085668797 (received, Mai)
           Structure: profile ELLIPSE + Frame70 username + Group62 Union bubble + timestamp
           Rendered as standard received message (Union boolean → white bubble) */}
        <ReceivedMessage
          username="Mai"
          text="あまり好きじゃないみたい…"
          timestamp={"既読 2\n午後 2:29"}
        />

        {/* screens/added-item — album card + floating banner */}
        <AddedItemMessage />
      </main>

      {/* ── Input bar (fixed at bottom, constraint: vertical MAX) ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 375,
          zIndex: 10,
        }}
      >
        <InputBar />
      </div>
    </div>
  </>
);

export default ChatBubble;
