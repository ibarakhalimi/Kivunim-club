// screens-other.jsx — Events, Perks, Profile, EventSheet · modern editorial · Hebrew RTL

// ════════════════ EVENTS ════════════════
const EventsScreen = ({ onOpenEvent }) => {
  const [filter, setFilter] = React.useState('שבוע');
  const groups = {
    'שבוע': EVENTS.slice(0, 2),
    'חודש': EVENTS,
    'הכל': EVENTS,
  };
  return (
    <div style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ marginTop: 8 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 0.95,
          letterSpacing: '-0.02em', color: 'var(--fg-1)', margin: 0, fontWeight: 500,
        }}>
          מה <span style={{ color: 'var(--magenta-600)' }}>קורה.</span>
        </h1>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg-2)', marginTop: 6 }}>
          חברים מארחים חברים, בעיקר.
        </div>
      </div>

      <div style={{ display: 'inline-flex', padding: 4, background: 'var(--bg-sunken)', borderRadius: 12, gap: 2, alignSelf: 'flex-start' }}>
        {['שבוע', 'חודש', 'הכל'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
            padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: filter === f ? 'white' : 'transparent',
            color: filter === f ? 'var(--fg-1)' : 'var(--fg-2)',
            boxShadow: filter === f ? 'var(--shadow-sm)' : 'none',
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {groups[filter].map(e => <EventRow key={e.id} event={e} onClick={() => onOpenEvent(e)} />)}
      </div>

      <div style={{
        background: 'var(--bg-tint)', border: '1px dashed var(--magenta-300)',
        borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Icon name="plus" size={20} color="var(--magenta-600)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: 'var(--magenta-800)' }}>תארחו משהו</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--magenta-700)' }}>מייסדים + פריים יכולים לארח. ארוחה, הליכה, כל דבר.</div>
        </div>
      </div>
    </div>
  );
};

// ════════════════ PERKS ════════════════
const PerksScreen = () => (
  <div style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div style={{ marginTop: 8 }}>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 0.95,
        letterSpacing: '-0.02em', color: 'var(--fg-1)', margin: 0, fontWeight: 500,
      }}>
        47 הטבות, <span style={{ color: 'var(--magenta-600)' }}>פתוחות.</span>
      </h1>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg-2)', marginTop: 6 }}>
        חסכת ₪4,832 השנה. בשקט.
      </div>
    </div>

    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'var(--bg-sunken)', borderRadius: 12, padding: '10px 14px',
    }}>
      <Icon name="search" size={16} color="var(--fg-3)" />
      <input placeholder="חיפוש הטבות…" style={{
        background: 'transparent', border: 'none', outline: 'none',
        fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg-1)', flex: 1,
      }} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {PERKS.map(p => <PerkCard key={p.id} perk={p} />)}
    </div>
  </div>
);

const PerkCard = ({ perk }) => {
  const featured = perk.tag === 'מומלץ';
  return (
    <div style={{
      background: featured ? 'var(--grad-soft)' : 'var(--bg-surface)',
      border: '1px solid ' + (featured ? 'transparent' : 'var(--border-subtle)'),
      borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
      minHeight: 150, boxShadow: 'var(--shadow-sm)',
      opacity: perk.locked ? 0.55 : 1, cursor: 'pointer',
      transition: 'transform 200ms var(--ease-out)',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: featured ? 'white' : 'var(--bg-tint)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--magenta-600)',
        }}><Icon name={perk.icon} size={18} /></div>
        {perk.tag && !perk.locked && <Badge tone={featured ? 'pink' : 'neutral'}>{perk.tag}</Badge>}
        {perk.locked && <Badge tone="neutral">מייסדים</Badge>}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.08em', fontWeight: 600, color: featured ? 'var(--magenta-700)' : 'var(--fg-3)' }}>
          {perk.biz}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, lineHeight: 1.05, letterSpacing: '-0.015em', color: 'var(--fg-1)', marginTop: 4, fontWeight: 500 }}>
          {perk.title} <span style={{ color: 'var(--magenta-600)' }}>{perk.titleEm}</span>
        </div>
      </div>
      {perk.saved && (
        <div style={{ marginTop: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--magenta-600)', fontWeight: 600, direction: 'ltr', alignSelf: 'flex-start' }}>חסכת {perk.saved}</div>
      )}
    </div>
  );
};

// ════════════════ PROFILE ════════════════
const ProfileScreen = ({ onOpenCard, onToast }) => (
  <div style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 22 }}>
    <div style={{ marginTop: 8 }}>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 40, lineHeight: 0.95,
        letterSpacing: '-0.02em', color: 'var(--fg-1)', margin: 0, fontWeight: 500,
      }}>
        אני.
      </h1>
    </div>

    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 20, padding: 16, boxShadow: 'var(--shadow-sm)',
    }}>
      <Avatar name={MEMBER.name} size={64} ring />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1, letterSpacing: '-0.015em', color: 'var(--fg-1)', fontWeight: 500 }}>
          עדה שטרן
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
          <TierChip tier={MEMBER.tier} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', direction: 'ltr' }}>מאז {MEMBER.since}</span>
        </div>
      </div>
    </div>

    <ListGroup>
      <ListRow icon="card" iconBg title="כרטיס חבר" sub={MEMBER.memberNo} subLtr onClick={onOpenCard} rightChev />
      <ListRow icon="users" iconBg title="הזמינו חבר/ה" sub="2 הזמנות נותרו החודש" rightBadge="2" />
      <ListRow icon="sparkles" iconBg title="הדרך למייסדים" sub="3 אירועים משלב" rightChev />
    </ListGroup>

    <ListGroup label="העדפות">
      <ListRow icon="bell" title="התראות" toggle defaultOn />
      <ListRow icon="moon" title="שעות שקטות" sub="22:00 – 08:00" rightChev />
      <ListRow icon="map" title="עיר בית" sub="תל אביב" rightChev />
    </ListGroup>

    <ListGroup label="חברות">
      <ListRow icon="settings" title="תוכנית וחיוב" sub="פריים · ₪179 לחודש" rightChev />
      <ListRow icon="heart" title="כללי הבית" rightChev />
      <ListRow icon="key" title="יציאה" danger onClick={() => onToast && onToast({ title: 'נתראה בקרוב, עדה.', sub: 'הכרטיס נשאר בארנק.' })} />
    </ListGroup>
  </div>
);

const ListGroup = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {label && (
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--fg-3)', padding: '0 6px' }}>
        {label}
      </div>
    )}
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
      {children}
    </div>
  </div>
);

const ListRow = ({ icon, iconBg, title, sub, subLtr, rightChev, rightBadge, toggle, defaultOn, danger, onClick }) => {
  const [on, setOn] = React.useState(!!defaultOn);
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '13px 16px', borderBottom: '1px solid var(--border-subtle)',
      cursor: (onClick || toggle) ? 'pointer' : 'default',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: iconBg ? 'var(--bg-tint)' : 'var(--bg-sunken)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? 'var(--danger-500)' : (iconBg ? 'var(--magenta-600)' : 'var(--fg-2)'),
        flexShrink: 0,
      }}><Icon name={icon} size={16} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 550, color: danger ? 'var(--danger-500)' : 'var(--fg-1)' }}>{title}</div>
        {sub && <div style={{ fontFamily: subLtr ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginTop: 1, direction: subLtr ? 'ltr' : 'rtl', textAlign: 'right' }}>{sub}</div>}
      </div>
      {rightBadge && <Badge tone="magenta">{rightBadge}</Badge>}
      {toggle && (
        <div onClick={(e) => { e.stopPropagation(); setOn(o => !o); }} style={{
          width: 44, height: 26, borderRadius: 999, position: 'relative', cursor: 'pointer',
          background: on ? 'var(--magenta-500)' : 'var(--neutral-300)', transition: 'background 200ms',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: 3, right: on ? 21 : 3, width: 20, height: 20, borderRadius: 999,
            background: 'white', boxShadow: 'var(--shadow-sm)', transition: 'right 200ms var(--ease-out)',
          }} />
        </div>
      )}
      {rightChev && <Icon name="chev" size={14} color="var(--fg-4)" style={{ transform: 'scaleX(-1)' }} />}
    </div>
  );
};

// ════════════════ EVENT SHEET ════════════════
const EventSheet = ({ event, onClose, onRsvp, rsvped }) => {
  if (!event) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'oklch(0.2 0.08 320 / 0.55)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn 260ms var(--ease-out)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-surface)', borderRadius: '28px 28px 0 0',
        width: '100%', padding: '12px 22px 28px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: 16,
        animation: 'slideUp 320ms var(--ease-out)',
      }}>
        <div style={{ width: 38, height: 4, borderRadius: 999, background: 'var(--neutral-300)', margin: '4px auto 8px' }} />
        <div style={{
          height: 140, borderRadius: 18,
          background: `linear-gradient(160deg, ${event.color}, var(--purple-700))`,
          color: 'white', padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 60% at 100% 0%, rgba(255,255,255,0.2), transparent 60%)' }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
            <Badge tone="pink">{event.when}</Badge>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.2)', color: 'white' }}>{event.tag}</span>
          </div>
          <div style={{ position: 'relative', fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 500 }}>
            {event.title} <span style={{ fontWeight: 400 }}>{event.titleEm}</span>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.5, color: 'var(--fg-1)' }}>
          {event.blurb}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DetailRow icon="pin" label="היכן" value={event.where} />
          <DetailRow icon="users" label="מגיעים" value={`${event.going} מתוך ${event.capacity} · ${event.plusOne ? '+1 בסדר' : 'חברים בלבד'}`} />
          <DetailRow icon="user" label="מארח/ת" value={event.host} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
          <AvatarStack names={['Noa K', 'Roi P', 'Yael R', 'Omer L']} more={event.going - 4} size={32} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-2)' }}>ועוד {event.going - 4} חברים</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="ghost" onClick={onClose} style={{ flex: 1 }}>אולי אחר כך</Button>
          <Button variant={rsvped ? 'tint' : 'primary'} onClick={onRsvp} style={{ flex: 2 }} icon={rsvped ? 'check' : undefined}>
            {rsvped ? 'את בפנים' : 'אישור הגעה'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{
      width: 32, height: 32, borderRadius: 9, background: 'var(--bg-sunken)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-2)',
      flexShrink: 0,
    }}><Icon name={icon} size={16} /></div>
    <div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--fg-1)', marginTop: 1 }}>{value}</div>
    </div>
  </div>
);

Object.assign(window, { EventsScreen, PerksScreen, PerkCard, ProfileScreen, ListGroup, ListRow, EventSheet, DetailRow });
