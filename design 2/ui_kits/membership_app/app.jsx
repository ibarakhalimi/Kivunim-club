// app.jsx — main Kivunim Club app shell · modern editorial · Hebrew RTL

const { useState: useStateApp, useEffect: useEffectApp } = React;

const TABS = [
  { id: 'home',    icon: 'home',     label: 'בית' },
  { id: 'events',  icon: 'calendar', label: 'אירועים' },
  { id: 'card',    icon: 'card',     label: 'כרטיס' },
  { id: 'perks',   icon: 'sparkles', label: 'הטבות' },
  { id: 'profile', icon: 'user',     label: 'אני' },
];

function App() {
  const [tab, setTab] = useStateApp(() => localStorage.getItem('kvn-tab') || 'home');
  const [openEvent, setOpenEvent] = useStateApp(null);
  const [rsvpedIds, setRsvpedIds] = useStateApp(new Set());
  const [toast, setToast] = useStateApp(null);

  useEffectApp(() => { localStorage.setItem('kvn-tab', tab); }, [tab]);

  const showToast = (t) => {
    setToast(t);
    setTimeout(() => setToast(null), 3500);
  };

  const handleRsvp = () => {
    if (!openEvent) return;
    const was = rsvpedIds.has(openEvent.id);
    const next = new Set(rsvpedIds);
    if (was) next.delete(openEvent.id); else next.add(openEvent.id);
    setRsvpedIds(next);
    if (!was) {
      showToast({ title: 'את בפנים', sub: `אישור הגעה ל"${openEvent.title} ${openEvent.titleEm}"` });
      setTimeout(() => setOpenEvent(null), 600);
    }
  };

  const onOpenCard = () => setTab('card');
  const onNavigate = (t) => setTab(t);

  const screen = (() => {
    switch (tab) {
      case 'home':    return <HomeScreen onOpenEvent={setOpenEvent} onOpenCard={onOpenCard} onNavigate={onNavigate} />;
      case 'events':  return <EventsScreen onOpenEvent={setOpenEvent} />;
      case 'card':    return <CardScreen onClose={() => setTab('home')} />;
      case 'perks':   return <PerksScreen />;
      case 'profile': return <ProfileScreen onOpenCard={onOpenCard} onToast={showToast} />;
      default: return null;
    }
  })();

  const showTabBar = tab !== 'card';

  return (
    <div dir="rtl" style={{
      position: 'relative', width: '100%', height: '100%',
      background: 'var(--bg-canvas)', overflow: 'hidden',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', paddingTop: 60 }}>
        {screen}
      </div>

      {/* Bottom tab bar — liquid glass pill */}
      {showTabBar && (
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          width: 340, padding: 7, display: 'flex', gap: 4,
          background: 'oklch(0.99 0.005 340 / 0.82)',
          backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--border-subtle)', borderRadius: 999,
          boxShadow: 'var(--shadow-lg)', zIndex: 50,
        }}>
          {TABS.map(t => {
            const active = t.id === tab;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '8px 0', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: active ? 'var(--neutral-900)' : 'transparent',
                color: active ? 'white' : 'var(--fg-3)',
                transition: 'all 220ms var(--ease-out)',
                fontFamily: 'var(--font-sans)',
              }}>
                <Icon name={t.icon} size={19} strokeWidth={active ? 2 : 1.75} />
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.02em' }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {openEvent && (
        <EventSheet
          event={openEvent}
          rsvped={rsvpedIds.has(openEvent.id)}
          onClose={() => setOpenEvent(null)}
          onRsvp={handleRsvp}
        />
      )}

      {toast && (
        <div style={{
          position: 'absolute', top: 64, left: 20, right: 20,
          background: 'var(--neutral-900)', color: 'white',
          borderRadius: 16, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: 'var(--shadow-lg)', zIndex: 200,
          animation: 'toastIn 320ms var(--ease-spring)',
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--magenta-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="check" size={14} color="white" strokeWidth={3} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600 }}>{toast.title}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, opacity: 0.7, marginTop: 1 }}>{toast.sub}</div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app-root')).render(
  <IOSDevice>
    <App />
  </IOSDevice>
);
