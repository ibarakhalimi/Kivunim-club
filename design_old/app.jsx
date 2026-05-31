/* global React, ReactDOM, IOSDevice, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle, TweakText, useTweaks */
const { useState, useMemo } = React;

/* ─────────────────────────────────────────────────────────────
   KIVUNIM CLUB · HOME SCREEN APP
   ───────────────────────────────────────────────────────────── */

// ── Seed data ──────────────────────────────────────────────
const FEED = [
  {
    id: 'live',
    type: 'live',
    title: 'ערב מיקרופון פתוח · בר ג׳יורא',
    where: 'בר ג׳יורא, יוסף הטוב 4',
    watchers: 38,
  },
  {
    id: 'evt-1',
    type: 'event',
    tone: 'lavender',
    month: 'מאי', day: '31', weekday: 'שבת',
    title: 'טיול ובראנץ׳ · נחל יהודיה',
    where: 'רמת הגולן', time: '07:30',
    attendees: [
      { initial: 'א', color: '#FFD4D4' },
      { initial: 'ר', color: '#C6F0DE' },
      { initial: 'ד', color: '#FFE99A' },
      { initial: 'נ', color: '#C8E5FF' },
      { initial: 'ש', color: '#E4DDFF' },
      { initial: 'י', color: '#FFD9B8' },
      { initial: 'ע', color: '#FFD4D4' },
      { initial: 'ל', color: '#C6F0DE' },
      { initial: 'מ', color: '#FFE99A' },
      { initial: 'ב', color: '#C8E5FF' },
      { initial: 'ת', color: '#E4DDFF' },
      { initial: 'פ', color: '#FFD9B8' },
    ],
  },
  {
    id: 'upd-1',
    type: 'update',
    when: 'לפני שעתיים',
    title: 'סניף חדש נפתח בחיפה',
    body: 'חתמנו על חוזה שכירות לחלל של 200 מ״ר ליד הנמל. ההרשמה לחברות מייסדת נפתחת ביום שישי.',
    author: 'פורסם על ידי המועצה',
    reactions: 47,
    thumb: 'linear-gradient(135deg, #C8E5FF 0%, #2F5BFF 100%)',
    thumbLabel: 'חיפה ’26',
    thumbText: '#FAFAF5',
  },
  {
    id: 'poll-1',
    type: 'poll',
    deadline: 'נותרו יומיים',
    question: 'בחרו את יעד הרטריט של יולי',
    options: [
      { key: 'lisbon', label: 'ליסבון', emoji: '🇵🇹', votes: 42 },
      { key: 'tulum',  label: 'טולום',  emoji: '🏝️', votes: 31 },
      { key: 'crete',  label: 'כרתים',  emoji: '🫒', votes: 28 },
    ],
  },
  {
    id: 'evt-2',
    type: 'event',
    tone: 'mint',
    month: 'יוני', day: '04', weekday: 'רביעי',
    title: 'ערב קדרות עם יעל',
    where: 'סטודיו פלורנטין', time: '19:00',
    attendees: [
      { initial: 'מ', color: '#E4DDFF' },
      { initial: 'א', color: '#FFD9B8' },
      { initial: 'ע', color: '#FFD4D4' },
      { initial: 'ר', color: '#C8E5FF' },
      { initial: 'ש', color: '#FFE99A' },
      { initial: 'ד', color: '#E4DDFF' },
      { initial: 'ל', color: '#FFD9B8' },
    ],
  },
  {
    id: 'post-1',
    type: 'post',
    author: 'נעה בר-לב',
    role: 'רכזת סניף',
    when: 'לפני 5 שעות',
    body: 'תזכורת: חברים מקבלים 20% הנחה בכל בתי הקפה ברשימת השותפים שלנו החודש. הצגת כרטיס החבר בקופה — וזהו, בלי התעסקות עם אפליקציה.',
    likes: 124,
    comments: 18,
    avatarInitial: 'נ',
    avatarBg: '#D4F542',
  },
  {
    id: 'upd-2',
    type: 'update',
    when: 'אתמול',
    title: 'שבוע ההתנדבות: 240 שעות נרשמו',
    body: 'היה מטורף. ניקיון חופים, משמרות בבנק מזון ותוכנית החונכות לנוער שברו שיאי השתתפות.',
    author: 'דו״ח קהילתי',
    reactions: 89,
    thumb: 'linear-gradient(135deg, #E6F56A 0%, #0E8C5E 100%)',
    thumbLabel: 'התנדבות · 240 ש׳',
    thumbText: '#0F0F0F',
  },
];

// ── App ────────────────────────────────────────────────────
function HomeApp({ t }) {
  const [filter, setFilter] = useState('all');
  const [navTab, setNavTab] = useState('home');
  const [joinedLive, setJoinedLive] = useState(false);
  const [rsvped, setRsvped] = useState({});
  const [pollVotes, setPollVotes] = useState({});
  const [postLikes, setPostLikes] = useState({});

  // Filter feed (live always shown on home)
  const visible = useMemo(() => {
    return FEED.filter((item) => {
      if (item.type === 'live') return t.showLive;
      if (filter === 'all') return true;
      return item.type === filter;
    });
  }, [filter, t.showLive]);

  return (
    <div data-theme={t.theme} style={{
      height: '100%', position: 'relative',
      background: 'var(--color-bg-primary)',
      overflow: 'hidden',
    }}>
      {/* SCROLLABLE CONTENT */}
      <div data-screen-label="01 Home" style={{
        height: '100%', overflowY: 'auto', overflowX: 'hidden',
        paddingTop: 54, /* clear iOS status bar */
        paddingBottom: 110, /* room for bottom nav */
      }} className="kv-no-scrollbar">

        <TopBar unread={3}/>
        <WelcomeStrip name={t.userName} points={1240} tier={t.tier}/>
        <QuickActions active={filter} onChange={setFilter}/>

        {/* FEED */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: t.density === 'cozy' ? 10 : 14,
          padding: '0 16px',
        }}>
          {visible.map((item) => {
            if (item.type === 'live') {
              return (
                <LiveBanner
                  key={item.id}
                  title={item.title}
                  where={item.where}
                  watchers={item.watchers + (joinedLive ? 1 : 0)}
                  joined={joinedLive}
                  onJoin={() => setJoinedLive((v) => !v)}
                />
              );
            }
            if (item.type === 'event') {
              return (
                <EventCard
                  key={item.id}
                  event={item}
                  rsvped={!!rsvped[item.id]}
                  onRsvp={() => setRsvped((s) => ({ ...s, [item.id]: !s[item.id] }))}
                />
              );
            }
            if (item.type === 'update') return <UpdateCard key={item.id} update={item}/>;
            if (item.type === 'poll') return (
              <PollCard
                key={item.id}
                poll={item}
                voted={pollVotes[item.id]}
                onVote={(k) => setPollVotes((s) => ({ ...s, [item.id]: k }))}
              />
            );
            if (item.type === 'post') return (
              <PostCard
                key={item.id}
                post={item}
                liked={!!postLikes[item.id]}
                onLike={() => setPostLikes((s) => ({ ...s, [item.id]: !s[item.id] }))}
              />
            );
            return null;
          })}

          {visible.length === 0 && (
            <div style={{
              padding: '40px 20px', textAlign: 'center',
              color: 'var(--color-text-muted)', fontSize: 14,
            }}>
              אין כאן כלום בסינון הזה — נסו סינון אחר.
            </div>
          )}
        </div>

        {/* Footer flourish */}
        <div style={{
          padding: '32px 20px 8px', textAlign: 'center',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--color-text-muted)',
        }}>
          הגעתם לסוף · ✿
        </div>
      </div>

      {/* BOTTOM NAV (overlay) */}
      <BottomNav active={navTab} onChange={setNavTab}/>
    </div>
  );
}

// ── Tweaks panel ───────────────────────────────────────────
function HomeTweaks({ t, setTweak }) {
  return (
    <TweaksPanel title="תזזוזים">
      <TweakSection label="ערכת צבע">
        <TweakRadio
          label="גוון דגש"
          value={t.theme}
          onChange={(v) => setTweak('theme', v)}
          options={[
            { value: 'coral',    label: 'קורל' },
            { value: 'electric', label: 'חשמלי' },
            { value: 'meadow',   label: 'אחו' },
          ]}
        />
      </TweakSection>
      <TweakSection label="פיד">
        <TweakToggle
          label="באנר שידור חי"
          value={!!t.showLive}
          onChange={(v) => setTweak('showLive', v)}
        />
        <TweakRadio
          label="צפיפות"
          value={t.density}
          onChange={(v) => setTweak('density', v)}
          options={[
            { value: 'comfy', label: 'מרווח' },
            { value: 'cozy',  label: 'צפוף' },
          ]}
        />
      </TweakSection>
      <TweakSection label="זהות">
        <TweakText
          label="שם"
          value={t.userName}
          onChange={(v) => setTweak('userName', v)}
        />
        <TweakText
          label="סטטוס"
          value={t.tier}
          onChange={(v) => setTweak('tier', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// ── Root: device frame + scale-to-fit ──────────────────────
function Root() {
  const [t, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "theme": "coral",
    "showLive": true,
    "userName": "מאיה",
    "tier": "צוות מייסדת",
    "density": "comfy"
  }/*EDITMODE-END*/);

  // Letterbox the iPhone frame in any viewport
  const W = 375, H = 812;
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const fit = () => {
      const pad = 32;
      const sw = (window.innerWidth - pad) / W;
      const sh = (window.innerHeight - pad) / H;
      setScale(Math.min(1.1, Math.min(sw, sh)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 30% 10%, #FFE6DA 0%, #FFF5E8 35%, #FAFAF5 100%)',
      display: 'grid', placeItems: 'center',
      padding: 16,
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
        <IOSDevice width={W} height={H}>
          <HomeApp t={t}/>
        </IOSDevice>
      </div>
      <HomeTweaks t={t} setTweak={setTweak}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
