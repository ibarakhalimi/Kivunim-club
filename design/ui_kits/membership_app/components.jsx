// components.jsx — atoms · modern editorial · Hebrew RTL

const { useState, useEffect, useRef } = React;

// ───────── Icons (Lucide-style, 1.5px stroke) ─────────
const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 1.75, style = {} }) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  };
  const paths = {
    home: <><path d="m3 12 9-9 9 9" /><path d="M5 10v10h14V10" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    card: <><rect x="3" y="6" width="18" height="13" rx="2.5" /><circle cx="8" cy="12.5" r="2" /><path d="M12 12.5h6M12 16h4" /></>,
    sparkles: <><path d="M12 2 9 7H4l4 4-2 7 6-4 6 4-2-7 4-4h-5z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 6 3 8 3 8H3s3-2 3-8" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    qr: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3h-3zM20 14v3M14 20h3M17 17h4v4" /></>,
    arrowRight: <><path d="M5 12h14M13 5l7 7-7 7" /></>,
    chev: <><path d="m9 6 6 6-6 6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    check: <><polyline points="4,12 10,18 20,6" /></>,
    pin: <><path d="M12 22s8-8 8-13a8 8 0 1 0-16 0c0 5 8 13 8 13Z" /><circle cx="12" cy="9" r="3" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 11h-6M19 8v6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .4 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.4 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .4-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.4-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.4H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.4 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    star: <><path d="m12 2 3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" /></>,
    heart: <><path d="M20 8c-1.7-3.5-6-3.5-8 0-2-3.5-6.3-3.5-8 0-1.7 3.7 1.5 7 8 13 6.5-6 9.7-9.3 8-13Z" /></>,
    back: <><path d="M19 12H5M12 19l-7-7 7-7" /></>,
    coffee: <><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM7 1v3M11 1v3M15 1v3" /></>,
    wine: <><path d="M8 22h8M12 15v7M5 2h14l-2 9a5 5 0 0 1-10 0Z" /></>,
    ticket: <><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-2Z" /><path d="M13 6v12" strokeDasharray="2 2" /></>,
    key: <><circle cx="8" cy="15" r="4" /><path d="m10.5 12 7.5-7.5M16 8l3 3M14 10l3 3" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
    map: <><path d="M9 4 3 6v15l6-2 6 2 6-2V4l-6 2Z" /><path d="M9 4v15M15 6v15" /></>,
    moon: <><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z" /></>,
  };
  return <svg {...props}>{paths[name] || null}</svg>;
};

// ───────── Avatar (round, gradient) ─────────
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, var(--magenta-500), var(--pink-500))',
  'linear-gradient(135deg, var(--purple-500), var(--magenta-600))',
  'linear-gradient(135deg, var(--pink-500), var(--purple-500))',
  'linear-gradient(135deg, var(--magenta-700), var(--purple-700))',
  'linear-gradient(135deg, var(--pink-400), var(--magenta-500))',
  'linear-gradient(135deg, var(--purple-400), var(--pink-500))',
];
const gradientFor = (key) => {
  const h = String(key).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
};

const Avatar = ({ name = '', size = 40, ring = false, badge = false, style = {} }) => {
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: gradientFor(name),
      color: 'white', fontFamily: 'var(--font-sans)', fontWeight: 500,
      fontSize: size * 0.4, display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center',
      boxShadow: ring ? '0 0 0 2px white, 0 0 0 4px var(--magenta-500)' : 'none',
      position: 'relative', flexShrink: 0, ...style,
    }}>
      {initials}
      {badge && (
        <span style={{
          position: 'absolute', bottom: -1, right: -1,
          width: size * 0.28, height: size * 0.28, borderRadius: 999,
          background: 'var(--success-500)', boxShadow: '0 0 0 2px white',
        }} />
      )}
    </div>
  );
};

const AvatarStack = ({ names = [], more = 0, size = 28 }) => (
  <div style={{ display: 'flex' }}>
    {names.map((n, i) => (
      <div key={i} style={{ marginRight: i === 0 ? 0 : -size * 0.32, boxShadow: '0 0 0 2px var(--bg-canvas)', borderRadius: 999 }}>
        <Avatar name={n} size={size} />
      </div>
    ))}
    {more > 0 && (
      <div style={{
        marginRight: -size * 0.32, width: size, height: size, borderRadius: 999,
        background: 'var(--bg-tint)', color: 'var(--magenta-700)',
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size * 0.34,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 2px var(--bg-canvas)',
      }}>+{more}</div>
    )}
  </div>
);

// ───────── Button (modern, pill, soft shadow) ─────────
const Button = ({ children, variant = 'primary', size = 'md', icon, iconRight, onClick, style = {}, full = false, disabled = false }) => {
  const sizes = {
    sm: { padding: '8px 16px', fontSize: 13 },
    md: { padding: '12px 22px', fontSize: 14 },
    lg: { padding: '15px 26px', fontSize: 15 },
  };
  const variants = {
    primary:   { background: 'var(--magenta-500)', color: 'white' },
    secondary: { background: 'var(--neutral-900)', color: 'white' },
    ghost:     { background: 'transparent', color: 'var(--fg-1)', border: '1px solid var(--border-default)' },
    tint:      { background: 'var(--bg-tint)', color: 'var(--magenta-700)' },
    grad:      { background: 'var(--grad-primary)', color: 'white', boxShadow: '0 8px 24px oklch(0.64 0.22 340 / 0.32)' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily: 'var(--font-sans)', fontWeight: 600,
      border: 'none', borderRadius: 999, cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 200ms var(--ease-out)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: full ? '100%' : undefined,
      opacity: disabled ? 0.4 : 1,
      ...sizes[size], ...variants[variant], ...style,
    }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.transform = 'translateY(-1px)')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.transform = 'none')}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={e => !disabled && (e.currentTarget.style.transform = 'translateY(-1px)')}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 14 : 16} />}
    </button>
  );
};

// ───────── Badge ─────────
const Badge = ({ children, tone = 'magenta', dot = false }) => {
  const tones = {
    magenta: { bg: 'var(--magenta-100)', fg: 'var(--magenta-700)' },
    purple:  { bg: 'var(--purple-100)', fg: 'var(--purple-700)' },
    pink:    { bg: 'oklch(0.95 0.04 10)', fg: 'var(--pink-600)' },
    neutral: { bg: 'var(--neutral-100)', fg: 'var(--fg-2)' },
    success: { bg: 'var(--success-bg)', fg: 'oklch(0.40 0.15 155)' },
    danger:  { bg: 'var(--danger-bg)', fg: 'oklch(0.40 0.18 25)' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500,
      padding: '4px 10px', borderRadius: 999, background: t.bg, color: t.fg,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} />}
      {children}
    </span>
  );
};

const TIER_HE = { Trial: 'ניסיון', Core: 'ליבה', Prime: 'פריים', Founders: 'מייסדים' };
const TierChip = ({ tier = 'Core' }) => {
  const styles = {
    Trial:    { background: 'white', color: 'var(--fg-2)', border: '1px solid var(--border-default)' },
    Core:     { background: 'var(--magenta-100)', color: 'var(--magenta-700)' },
    Prime:    { background: 'var(--grad-primary)', color: 'white' },
    Founders: { background: 'var(--neutral-900)', color: 'white' },
  };
  return (
    <span style={{
      fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
      letterSpacing: '0.04em',
      padding: '5px 12px', borderRadius: 999,
      display: 'inline-block', ...styles[tier],
    }}>{TIER_HE[tier] || tier}</span>
  );
};

Object.assign(window, { Icon, Avatar, AvatarStack, Button, Badge, TierChip, gradientFor, TIER_HE });
