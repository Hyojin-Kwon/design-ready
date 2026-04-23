import React from 'react';
import { Icon } from './Icon';

// ─── Sub-components ────────────────────────────────────────────

// from: Status Bar
const StatusBar: React.FC = () => (
  <header style={styles.statusBar}>
    {/* from: IOS / Light / Status bar / Time - Default */}
    <span style={styles.time}>9:41</span>
    <div style={styles.statusIcons}>
      <Icon name="cellular" style={{ width: 17, height: 11 }} />
      <Icon name="wifi" style={{ width: 15, height: 11 }} />
      <Icon name="battery" style={{ width: 24, height: 11 }} />
    </div>
  </header>
);

// from: Subtab
const SubtabHeader: React.FC = () => (
  <nav style={styles.subtab}>
    <div style={styles.subtabInner}>
      {/* from: IOS / Light / Icon /navi_top_back */}
      <button style={styles.backButton} aria-label="Back">
        <Icon name="back" style={{ width: 9, height: 17 }} />
      </button>
      <span style={styles.subtabTitle}>WWWWWWWWWWWWWW</span>
    </div>
    <div style={styles.subtabRight}>
      {/* from: IOS / Light / Icon /navi_top_share — empty instance, no visible children */}
      <div style={{ width: 24, height: 24 }} />
      {/* Header info icon overlaid */}
      <Icon name="info_circle" style={{ width: 24, height: 24 }} />
    </div>
  </nav>
);

// Description text
const DescriptionBar: React.FC = () => (
  <div style={styles.descriptionBar}>
    <span style={styles.descriptionText}>WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW</span>
  </div>
);

// Profile avatar (circular image placeholder)
const Avatar: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 200,
      backgroundColor: '#E0E0E0',
      overflow: 'hidden',
      flexShrink: 0,
    }}
  >
    <div style={{ width: '100%', height: '100%', backgroundColor: '#C4C4C4' }} />
  </div>
);

// Right area — time + optional badge
interface RightAreaProps {
  timeText: string;
  badgeCount?: number;
}
const RightArea: React.FC<RightAreaProps> = ({ timeText, badgeCount }) => (
  <div style={styles.rightArea}>
    <div style={styles.timeRow}>
      <span style={styles.timeText}>{timeText}</span>
    </div>
    {badgeCount !== undefined && (
      <div style={styles.notiBadge}>
        <span style={styles.notiBadgeText}>{badgeCount}</span>
      </div>
    )}
  </div>
);

// A single chat list row
interface ChatRowProps {
  title: string;
  body: string;
  timeText: string;
  badgeCount?: number;
  badges?: React.ReactNode;
  mentionText?: string;
  avatarOverlay?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
const ChatRow: React.FC<ChatRowProps> = ({
  title,
  body,
  timeText,
  badgeCount,
  badges,
  mentionText,
  avatarOverlay,
  rightIcon,
}) => (
  <div style={styles.chatRow}>
    <div style={styles.chatRowInner}>
      <div style={{ position: 'relative' }}>
        <Avatar />
        {avatarOverlay && (
          <div style={{ position: 'absolute', bottom: -2, right: -2 }}>{avatarOverlay}</div>
        )}
      </div>
      <div style={styles.textArea}>
        <div style={styles.titleRow}>
          <span style={styles.titleText}>{title}</span>
          {badges}
        </div>
        <span style={styles.bodyText}>{body}</span>
        {mentionText && (
          <div style={styles.mentionRow}>
            <span style={styles.mentionText}>{mentionText}</span>
          </div>
        )}
      </div>
    </div>
    {rightIcon || <RightArea timeText={timeText} badgeCount={badgeCount} />}
  </div>
);

// ─── Main Screen ───────────────────────────────────────────────

const B1MRBList: React.FC = () => {
  return (
    <div style={styles.screen}>
      {/* Header section — absolute */}
      <div style={styles.headerGroup}>
        <StatusBar />
        <SubtabHeader />
      </div>

      {/* Description */}
      <DescriptionBar />

      {/* MRB Chats Lists */}
      <main style={styles.chatList}>
        {/* Row 1: Cautions icon — Ken */}
        <div style={{ position: 'relative' }}>
          <ChatRow
            title="Ken"
            body="Let's plan a workout together! "
            timeText="1min ago"
            rightIcon={<Icon name="notification_3" style={{ width: 45, height: 38 }} />}
          />
          {/* Caution badge overlay */}
          <div style={{ position: 'absolute', left: 49, top: 40 }}>
            <Icon name="caution" style={{ width: 20, height: 20 }} />
          </div>
        </div>

        {/* Row 2: 6. Group (Mentioned) — Europe Travelers */}
        <ChatRow
          title="Europe Travelers (268)"
          body="Pancakes are best eaten fresh from"
          timeText="5min ago"
          badges={
            <div style={styles.badgesRow}>
              <Icon name="blocking" style={{ width: 16, height: 16 }} />
              <Icon name="sound_off" style={{ width: 16, height: 16 }} />
            </div>
          }
          mentionText="You were mentioned."
          avatarOverlay={
            <Icon name="badge_favorites" style={{ width: 16, height: 16 }} />
          }
          rightIcon={<Icon name="notification_5min" style={{ width: 47, height: 38 }} />}
        />

        {/* Row 3: List — Evan Kao */}
        <ChatRow
          title="Evan Kao"
          body="I'd really love to get to know you."
          timeText="2min ago"
          badgeCount={7}
        />

        {/* Row 4: List — 2024 Tech Seminar */}
        <ChatRow
          title="2024 Tech Seminar (230)"
          body="Today's event was terrific!"
          timeText="5min ago"
        />

        {/* Row 5: List_with badge — Skyrocket stock */}
        <ChatRow
          title="Skyrocket stock (99)"
          body={"Thanks to the team at New Start Studio! I'm in, waiting for the take..."}
          timeText="Yesterday"
        />

        {/* Row 6: Group 2085667646 — Baseball Club */}
        <div style={{ position: 'relative' }}>
          <ChatRow
            title="Baseball Club (12)"
            body="sujung invited to the group."
            timeText="Yesterday"
          />
          {/* Caution badge overlay for this group */}
          <div style={{ position: 'absolute', left: 49, bottom: -2 }}>
            <Icon name="caution" style={{ width: 20, height: 20 }} />
          </div>
        </div>

        {/* Row 7: List — Jamie william (mentioned) */}
        <ChatRow
          title="Jamie william"
          body="How r you?"
          timeText="2/9"
          mentionText="You were mentioned."
          rightIcon={<Icon name="date_fraction" style={{ width: 17, height: 38 }} />}
        />

        {/* Row 8: List — Maya */}
        <ChatRow
          title="Maya"
          body="Aren't you coming to the meeting?"
          timeText="2/9"
          rightIcon={<Icon name="date_fraction" style={{ width: 17, height: 38 }} />}
        />

        {/* Row 9: List — Alison Lee */}
        <ChatRow
          title="Alison Lee"
          body="Hello. It'me"
          timeText="2/9"
          rightIcon={<Icon name="date_fraction" style={{ width: 17, height: 38 }} />}
        />
      </main>

      {/* Bottom Button */}
      <div style={styles.bottomButton}>
        {/* from: Box Button / XLarge */}
        <div style={styles.boxButtonXLarge}>
          {/* from: IOS / Box / Large */}
          <button style={styles.boxLarge}>
            {/* from: IOS / Box Text */}
            <span style={styles.buttonText}>WWWWWWWWWWWWWWWWW</span>
          </button>
        </div>
        {/* from: Home Indicator */}
        <div style={styles.homeIndicatorWrap}>
          <div style={styles.homeIndicator} />
        </div>
      </div>
    </div>
  );
};

// ─── Styles ────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  screen: {
    width: 375,
    height: 812,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },

  // Header
  headerGroup: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 375,
    height: 88,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
  },
  statusBar: {
    width: 375,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '11px 14px 12px 20px',
    boxSizing: 'border-box',
  },
  time: {
    fontSize: 15,
    fontWeight: 600,
    color: '#000000',
  },
  statusIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  subtab: {
    width: 375,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '17px 16px',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
  },
  subtabInner: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  backButton: {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  subtabTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: '#111111',
  },
  subtabRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  // Description
  descriptionBar: {
    position: 'absolute',
    top: 108,
    left: 16,
    width: 343,
    zIndex: 5,
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: 400,
    color: '#777777',
  },

  // Chat list
  chatList: {
    position: 'absolute',
    top: 156,
    left: 0,
    width: 375,
    height: 552,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  chatRow: {
    width: 375,
    height: 68,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: '0 16px',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
  },
  chatRowInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  textArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 500,
    color: '#111111',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  bodyText: {
    fontSize: 13,
    fontWeight: 400,
    color: '#777777',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  mentionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  mentionText: {
    fontSize: 12,
    fontWeight: 400,
    color: '#4D73FF',
  },
  badgesRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  // Right area
  rightArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 7,
    flexShrink: 0,
  },
  timeRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  timeText: {
    fontSize: 11,
    fontWeight: 400,
    color: '#909090',
  },
  notiBadge: {
    minWidth: 23,
    height: 24,
    borderRadius: 100,
    backgroundColor: '#06C755',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 7.5px',
    boxSizing: 'border-box',
  },
  notiBadgeText: {
    fontSize: 13,
    fontWeight: 700,
    color: '#FFFFFF',
  },

  // Bottom button
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 375,
    height: 104,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  boxButtonXLarge: {
    width: 375,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px 14px 16px',
    boxSizing: 'border-box',
  },
  boxLarge: {
    width: 343,
    height: 48,
    borderRadius: 5,
    border: '1px solid #EFEFEF',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px 9px',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 700,
    color: '#000000',
  },
  homeIndicatorWrap: {
    width: 134,
    height: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: '#000000',
  },
};

export default B1MRBList;
