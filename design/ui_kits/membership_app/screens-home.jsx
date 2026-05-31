// screens-home.jsx — Home screen · modern editorial · Hebrew RTL

const HomeScreen = ({ onOpenEvent, onOpenCard, onNavigate }) => {
  const hero = EVENTS[0];
  return (
    <div style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Greeting */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--magenta-600)' }}>
          ראשון · 12 באפריל
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 0.95,
          letterSpacing: '-0.025em', color: 'var(--fg-1)', margin: '6px 0 0', fontWeight: 500,
        }}>
          היי, <span style={{ color: 'var(--magenta-600)' }}>{MEMBER.firstName}.</span>
        </h1>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.5, color: 'var(--fg-2)', marginTop: 8, maxWidth: 320 }}>
          שלושה אירועים השבוע. את ברשימה להערב.
        </div>
      </div>

      {/* Tonight hero */}
      <div onClick={() => onOpenEvent(hero)} style={{
        borderRadius: 24, overflow: 'hidden', cursor: 'pointer',
        boxShadow: 'var(--shadow-lg)',
        background: 'linear-gradient(160deg, var(--magenta-500) 0%, var(--purple-700) 100%)',
        color: 'white', padding: '24px 22px 20px', position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 60% at 100% 0%, rgba(255,255,255,0.22), transparent 60%)' }} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Badge tone="pink" dot>{hero.when}</Badge>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', opacity: 0.8, direction: 'ltr' }}>
              {hero.month} · {hero.day}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 500,
            fontSize: 40, lineHeight: 0.98, letterSpacing: '-0.025em',
          }}>
            {hero.title} <span style={{ fontWeight: 400 }}>{hero.titleEm}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.5, opacity: 0.92, maxWidth: 320 }}>
            {hero.blurb}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AvatarStack names={['Noa K', 'Roi P', 'Yael R']} size={26} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13 }}>+14 מגיעים</span>
            </div>
            <Button variant="primary" size="sm" style={{ background: 'white', color: 'var(--magenta-700)' }}>אישור הגעה</Button>
          </div>
        </div>
      </div>

      {/* Tier progress */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 18, padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>
            הדרך ל-<span style={{ fontFamily: 'var(--font-display)', color: 'var(--magenta-600)', fontWeight: 500 }}>מייסדים</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)', direction: 'ltr' }}>7 / 10 אירועים</div>
        </div>
        <div style={{ height: 8, background: 'var(--bg-sunken)', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
          <div style={{ width: '70%', height: '100%', background: 'var(--grad-primary)', borderRadius: 999, float: 'right' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-4)', marginTop: 6, fontWeight: 500 }}>
          <span>ניסיון</span><span>ליבה</span><span style={{ color: 'var(--magenta-600)', fontWeight: 600 }}>פריים ●</span><span>מייסדים</span>
        </div>
      </div>

      {/* This week */}
      <div>
        <SectionHead title="השבוע" action="הכל" onAction={() => onNavigate('events')} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          {EVENTS.slice(1, 3).map(e => (
            <EventRow key={e.id} event={e} onClick={() => onOpenEvent(e)} />
          ))}
        </div>
      </div>

      {/* Perks teaser */}
      <div>
        <SectionHead title="הטבות בשבילך" action="גלישה" onAction={() => onNavigate('perks')} />
        <div style={{
          display: 'flex', gap: 10, marginTop: 10, overflowX: 'auto', paddingBottom: 4,
          marginRight: -20, paddingRight: 20, paddingLeft: 20,
        }}>
          {PERKS.slice(0, 4).map(p => (
            <MiniPerkTile key={p.id} perk={p} />
          ))}
        </div>
      </div>

      {/* Open card CTA */}
      <button onClick={onOpenCard} style={{
        background: 'var(--neutral-900)', color: 'white',
        border: 'none', borderRadius: 18, padding: '16px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', boxShadow: 'var(--shadow-md)',
        fontFamily: 'var(--font-sans)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="qr" size={18} color="white" />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600 }}>פתחו את הכרטיס</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.65, marginTop: 2, direction: 'ltr', textAlign: 'right' }}>{MEMBER.memberNo}</div>
          </div>
        </div>
        <Icon name="chev" size={18} color="rgba(255,255,255,0.6)" style={{ transform: 'scaleX(-1)' }} />
      </button>
    </div>
  );
};

// Helpers
const SectionHead = ({ title, action, onAction }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--fg-1)', margin: 0, letterSpacing: '-0.015em' }}>{title}</h3>
    {action && (
      <button onClick={onAction} style={{ background: 'none', border: 'none', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--magenta-600)', fontWeight: 500, cursor: 'pointer' }}>
        {action} ←
      </button>
    )}
  </div>
);

const EventRow = ({ event, onClick }) => (
  <div onClick={onClick} style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
    borderRadius: 18, padding: 12, display: 'flex', gap: 12, cursor: 'pointer',
    boxShadow: 'var(--shadow-xs)', transition: 'all 200ms var(--ease-out)',
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-xs)'}
  >
    <div style={{
      width: 64, height: 64, borderRadius: 12,
      background: `linear-gradient(160deg, ${event.color}, var(--purple-700))`,
      color: 'white', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', opacity: 0.85, direction: 'ltr' }}>{event.month}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, lineHeight: 1, direction: 'ltr' }}>{event.day}</div>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--magenta-600)' }}>{event.when}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 20, lineHeight: 1.1, letterSpacing: '-0.015em', color: 'var(--fg-1)', marginTop: 2 }}>
          {event.title} <span style={{ color: 'var(--magenta-600)' }}>{event.titleEm}</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{event.where} · <span style={{ direction: 'ltr', display: 'inline-block' }}>{event.going}/{event.capacity}</span></div>
        <AvatarStack names={['A', 'B', 'C']} size={20} />
      </div>
    </div>
  </div>
);

const MiniPerkTile = ({ perk }) => (
  <div style={{
    minWidth: 160, background: perk.tag === 'מומלץ' ? 'var(--grad-soft)' : 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0,
    boxShadow: 'var(--shadow-xs)', cursor: 'pointer',
    opacity: perk.locked ? 0.6 : 1,
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 9,
      background: perk.tag === 'מומלץ' ? 'white' : 'var(--bg-tint)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--magenta-600)',
    }}><Icon name={perk.icon} size={16} /></div>
    <div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.06em', fontWeight: 600, color: 'var(--fg-3)' }}>{perk.biz}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, lineHeight: 1.1, letterSpacing: '-0.01em', color: 'var(--fg-1)', marginTop: 3, fontWeight: 500 }}>
        {perk.title} <span style={{ color: 'var(--magenta-600)' }}>{perk.titleEm}</span>
      </div>
    </div>
  </div>
);

Object.assign(window, { HomeScreen, SectionHead, EventRow, MiniPerkTile });
