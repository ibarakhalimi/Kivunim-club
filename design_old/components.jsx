/* global React */
const { useState, useEffect, useRef } = React;

/* ─────────────────────────────────────────────────────────────
   KIVUNIM CLUB · UI COMPONENTS
   ───────────────────────────────────────────────────────────── */

// ── Inline icons (stroke-based, 1.75 weight, friendly rounded) ──
const Icon = {
  Bell: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 8a6 6 0 1 1 12 0c0 4.5 1.5 6 2 6.5H4c.5-.5 2-2 2-6.5Z"/>
      <path d="M10 18a2 2 0 0 0 4 0"/>
    </svg>
  ),
  Home: (p) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z"/>
    </svg>
  ),
  Calendar: (p) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5"/>
      <path d="M8 3v4M16 3v4M3.5 10h17"/>
    </svg>
  ),
  Community: (p) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="9" cy="9" r="3.2"/>
      <circle cx="17" cy="11" r="2.5"/>
      <path d="M3 19c.5-3 3-5 6-5s5.5 2 6 5"/>
      <path d="M15 19c.3-1.7 1.4-3 3-3s2.7 1 3 3"/>
    </svg>
  ),
  User: (p) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8.5" r="3.5"/>
      <path d="M4 20c1-3.5 4.2-5.5 8-5.5s7 2 8 5.5"/>
    </svg>
  ),
  Pin: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12Z"/>
      <circle cx="12" cy="9.5" r="2.5"/>
    </svg>
  ),
  Arrow: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  Sparkle: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2zM19 14l.9 2.5L22 17l-2.1.5L19 20l-.9-2.5L16 17l2.1-.5L19 14z"/>
    </svg>
  ),
  Plus: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" {...p}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Search: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="6.5"/>
      <path d="M20 20l-3.5-3.5"/>
    </svg>
  ),
};

// ── Top bar ────────────────────────────────────────────────
function TopBar({ unread }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '6px 20px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 999,
          background: 'var(--color-text-primary)',
          color: 'var(--color-accent-highlight)',
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
          letterSpacing: '-0.04em',
        }}>כ</div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
            letterSpacing: '-0.03em',
          }}>כיוונים</span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2,
          }}>מועדון · תל אביב</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="kv-tap" aria-label="Notifications" style={{
          width: 40, height: 40, borderRadius: 999,
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          display: 'grid', placeItems: 'center', position: 'relative',
          color: 'var(--color-text-primary)', cursor: 'pointer', padding: 0,
        }}>
          <Icon.Bell />
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6,
              minWidth: 16, height: 16, padding: '0 4px',
              borderRadius: 999, background: 'var(--color-accent-primary)',
              color: '#fff', fontSize: 10, fontWeight: 700,
              display: 'grid', placeItems: 'center',
              border: '2px solid var(--color-bg-card)',
            }}>{unread}</span>
          )}
        </button>
        <div className="kv-tap" style={{
          width: 40, height: 40, borderRadius: 999,
          background: 'linear-gradient(135deg, #FFD9B8 0%, #FF8C42 100%)',
          border: '2px solid var(--color-text-primary)',
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
        }}>מ</div>
      </div>
    </div>
  );
}

// ── Welcome strip ──────────────────────────────────────────
function WelcomeStrip({ name, points, tier }) {
  return (
    <div style={{ padding: '4px 20px 18px' }}>
      <h1 style={{
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'var(--font-size-3xl)',
        lineHeight: 1.0,
        letterSpacing: 'var(--tracking-tight)',
      }}>
        היי {name} <span style={{ display: 'inline-block', transformOrigin: '70% 70%' }}>👋</span>
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px 5px',
          background: 'var(--color-accent-highlight)',
          color: 'var(--color-text-primary)',
          borderRadius: 999,
          fontSize: 12, fontWeight: 700,
          letterSpacing: '-0.005em',
        }}>
          <Icon.Sparkle /> {tier}
        </span>
        <span style={{
          fontSize: 13, color: 'var(--color-text-secondary)',
          fontWeight: 500,
        }}>{points.toLocaleString()} נק׳ · 4 אירועים החודש</span>
      </div>
    </div>
  );
}

// ── Live banner ────────────────────────────────────────────
function LiveBanner({ title, where, watchers, onJoin, joined }) {
  return (
    <div className="kv-rise" style={{
      margin: '0 16px 18px',
      background: 'var(--color-text-primary)',
      color: '#fff',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 18px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative lime stripe */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 140, height: 140, borderRadius: 999,
        background: 'var(--color-accent-highlight)',
        opacity: 0.18, filter: 'blur(8px)',
      }}/>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span className="kv-pulse-dot"/>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--color-accent-highlight)',
        }}>משדרים עכשיו</span>
        <span style={{
          fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)',
          marginInlineStart: 'auto',
        }}>{watchers} צופים</span>
      </div>

      <h2 style={{
        margin: '0 0 4px',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 22, lineHeight: 1.1, letterSpacing: '-0.02em',
        paddingInlineEnd: 32,
      }}>{title}</h2>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500,
        marginBottom: 14,
      }}>
        <Icon.Pin /> {where}
      </div>

      <button className="kv-tap" onClick={onJoin} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', minHeight: 46,
        padding: '0 18px',
        background: joined ? 'rgba(212, 245, 66, 0.18)' : 'var(--color-accent-highlight)',
        color: joined ? 'var(--color-accent-highlight)' : 'var(--color-text-primary)',
        border: joined ? '1.5px solid var(--color-accent-highlight)' : 'none',
        borderRadius: 999,
        fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
        letterSpacing: '-0.01em', cursor: 'pointer',
      }}>
        <span>{joined ? 'אתם בפנים · געו לפתיחה' : 'הצטרפו לחדר'}</span>
        <span style={{
          width: 28, height: 28, borderRadius: 999,
          background: joined ? 'var(--color-accent-highlight)' : 'var(--color-text-primary)',
          color: joined ? 'var(--color-text-primary)' : 'var(--color-accent-highlight)',
          display: 'grid', placeItems: 'center',
          transform: 'scaleX(-1)',
        }}>
          <Icon.Arrow />
        </span>
      </button>
    </div>
  );
}

// ── Quick action pills ─────────────────────────────────────
const QUICK_ACTIONS = [
  { key: 'all',     label: 'בשבילך' },
  { key: 'event',   label: 'אירועים' },
  { key: 'update',  label: 'עדכונים' },
  { key: 'poll',    label: 'סקרים' },
  { key: 'post',    label: 'פוסטים' },
];

function QuickActions({ active, onChange }) {
  return (
    <div className="kv-no-scrollbar" style={{
      display: 'flex', gap: 8, padding: '0 20px 18px',
      overflowX: 'auto', scrollSnapType: 'x mandatory',
    }}>
      {QUICK_ACTIONS.map((a) => {
        const on = active === a.key;
        return (
          <button key={a.key} onClick={() => onChange(a.key)} className="kv-tap" style={{
            flex: '0 0 auto', minHeight: 38, padding: '0 16px',
            borderRadius: 999,
            background: on ? 'var(--color-text-primary)' : 'var(--color-bg-card)',
            color: on ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
            border: on ? '1.5px solid var(--color-text-primary)' : '1.5px solid var(--color-border)',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
            letterSpacing: '-0.005em',
            cursor: 'pointer', scrollSnapAlign: 'start',
            whiteSpace: 'nowrap',
            transition: 'all var(--duration-fast) var(--ease-default)',
          }}>{a.label}</button>
        );
      })}
    </div>
  );
}

// ── Event card ─────────────────────────────────────────────
function EventCard({ event, onRsvp, rsvped }) {
  const tone = event.tone || 'lavender';
  const bg = `var(--color-card-${tone})`;
  return (
    <div className="kv-rise" style={{
      background: bg,
      borderRadius: 'var(--radius-lg)',
      padding: 18,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Date block */}
        <div style={{
          flex: '0 0 auto',
          width: 60, padding: '8px 0',
          background: 'rgba(255,255,255,0.55)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          lineHeight: 1,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--color-text-secondary)',
          }}>{event.month}</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 28, marginTop: 4, letterSpacing: '-0.03em',
          }}>{event.day}</div>
          <div style={{
            fontSize: 10, fontWeight: 600, marginTop: 4,
            color: 'var(--color-text-secondary)',
          }}>{event.weekday}</div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            display: 'inline-block', padding: '3px 8px 4px',
            background: 'var(--color-text-primary)', color: '#fff',
            borderRadius: 999, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 8,
          }}>אירוע</span>
          <h3 style={{
            margin: '0 0 6px',
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 20, lineHeight: 1.1, letterSpacing: '-0.02em',
          }}>{event.title}</h3>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)',
          }}>
            <Icon.Pin/> {event.where} · {event.time}
          </div>
        </div>
      </div>

      {/* Attendees + RSVP */}
      <div style={{
        marginTop: 16, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {event.attendees.slice(0, 4).map((a, i) => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: 999,
              background: a.color,
              marginInlineStart: i === 0 ? 0 : -8,
              border: '2px solid #FAFAF5',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11,
              color: a.fg || '#0F0F0F',
              display: 'grid', placeItems: 'center',
              position: 'relative', zIndex: 10 - i,
            }}>{a.initial}</div>
          ))}
          <span style={{
            marginInlineStart: 8, fontSize: 12, fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}>+{event.attendees.length - 4} מגיעים</span>
        </div>

        <button className="kv-tap" onClick={onRsvp} style={{
          minHeight: 38, padding: '0 16px',
          background: rsvped ? 'transparent' : 'var(--color-text-primary)',
          color: rsvped ? 'var(--color-text-primary)' : '#fff',
          border: rsvped ? '1.5px solid var(--color-text-primary)' : 'none',
          borderRadius: 999, fontWeight: 700, fontSize: 13,
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          {rsvped ? '✓ אתם בפנים' : 'אישור הגעה'}
        </button>
      </div>
    </div>
  );
}

// ── Update card ────────────────────────────────────────────
function UpdateCard({ update }) {
  return (
    <div className="kv-rise" style={{
      background: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 16,
      display: 'flex', gap: 14, alignItems: 'flex-start',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
        }}>
          <span style={{
            display: 'inline-block', padding: '3px 8px 4px',
            background: 'var(--color-accent-secondary)', color: '#fff',
            borderRadius: 999, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>עדכון</span>
          <span style={{
            fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)',
          }}>{update.when}</span>
        </div>
        <h3 style={{
          margin: '0 0 6px',
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 17, lineHeight: 1.2, letterSpacing: '-0.018em',
        }}>{update.title}</h3>
        <p style={{
          margin: 0, fontSize: 13, lineHeight: 1.45,
          color: 'var(--color-text-secondary)',
          fontWeight: 500,
        }}>{update.body}</p>
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600,
        }}>
          <span>{update.author}</span>
          <span style={{ opacity: 0.6 }}>·</span>
          <span>{update.reactions} תגובות</span>
        </div>
      </div>
      {/* Thumbnail */}
      <div style={{
        flex: '0 0 auto', width: 84, height: 96,
        borderRadius: 'var(--radius-md)',
        background: update.thumb,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: update.thumbOverlay || 'transparent',
        }}/>
        <div style={{
          position: 'absolute', left: 10, bottom: 10,
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 11, letterSpacing: '-0.01em',
          color: update.thumbText || '#0F0F0F',
          lineHeight: 1,
        }}>{update.thumbLabel}</div>
      </div>
    </div>
  );
}

// ── Poll card ──────────────────────────────────────────────
function PollCard({ poll, voted, onVote }) {
  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0) + (voted ? 1 : 0);
  return (
    <div className="kv-rise" style={{
      background: 'var(--color-card-lime)',
      borderRadius: 'var(--radius-lg)',
      padding: 18,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <span style={{
          display: 'inline-block', padding: '3px 8px 4px',
          background: 'var(--color-text-primary)', color: 'var(--color-card-lime)',
          borderRadius: 999, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>סקר · {poll.deadline}</span>
        <span style={{
          fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)',
        }}>{totalVotes} הצבעות</span>
      </div>
      <h3 style={{
        margin: '0 0 14px',
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 20, lineHeight: 1.1, letterSpacing: '-0.02em',
      }}>{poll.question}</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {poll.options.map((opt) => {
          const myVote = voted === opt.key;
          const votes = opt.votes + (myVote ? 1 : 0);
          const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          return (
            <button
              key={opt.key}
              onClick={() => !voted && onVote(opt.key)}
              className="kv-tap"
              disabled={!!voted}
              style={{
                position: 'relative', overflow: 'hidden',
                minHeight: 46, padding: '0 16px',
                background: 'rgba(255,255,255,0.55)',
                border: myVote ? '2px solid var(--color-text-primary)' : '1.5px solid rgba(15,15,15,0.1)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: voted ? 'default' : 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-body)',
              }}>
              {/* Fill bar */}
              {voted && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: myVote ? 'rgba(15,15,15,0.10)' : 'rgba(15,15,15,0.04)',
                  width: pct + '%',
                  transition: 'width var(--duration-slow) var(--ease-spring)',
                }}/>
              )}
              <span style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)',
              }}>
                <span>{opt.emoji}</span> {opt.label}
                {myVote && <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 6px',
                  background: 'var(--color-text-primary)', color: 'var(--color-card-lime)',
                  borderRadius: 999, letterSpacing: '0.06em',
                }}>הצבעת</span>}
              </span>
              <span style={{
                position: 'relative',
                fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)',
              }}>
                {voted ? pct + '%' : 'הצבעה'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Post / announcement card ───────────────────────────────
function PostCard({ post, liked, onLike }) {
  return (
    <div className="kv-rise" style={{
      background: 'var(--color-card-peach)',
      borderRadius: 'var(--radius-lg)',
      padding: 18,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 999,
          background: post.avatarBg,
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
          color: '#0F0F0F',
          display: 'grid', placeItems: 'center',
          border: '2px solid var(--color-text-primary)',
        }}>{post.avatarInitial}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 700,
          }}>
            {post.author}
            <span style={{
              display: 'inline-block', padding: '1px 6px 2px',
              background: 'var(--color-accent-primary)', color: '#fff',
              borderRadius: 999, fontSize: 9, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>{post.role}</span>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)',
          }}>{post.when}</div>
        </div>
      </div>
      <p style={{
        margin: 0, fontSize: 14, lineHeight: 1.45, fontWeight: 500,
        color: 'var(--color-text-primary)',
      }}>{post.body}</p>

      <div style={{
        marginTop: 14, display: 'flex', alignItems: 'center', gap: 16,
        paddingTop: 12, borderTop: '1.5px dashed rgba(15,15,15,0.16)',
      }}>
        <button className="kv-tap" onClick={onLike} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none', padding: 0,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)',
        }}>
          <span style={{
            transition: 'transform var(--duration-fast) var(--ease-spring)',
            transform: liked ? 'scale(1.15)' : 'scale(1)',
            display: 'inline-block',
          }}>{liked ? '❤️' : '🤍'}</span>
          {post.likes + (liked ? 1 : 0)}
        </button>
        <button className="kv-tap" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none', padding: 0,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)',
        }}>
          💬 {post.comments}
        </button>
        <button className="kv-tap" style={{
          marginInlineStart: 'auto',
          fontSize: 12, fontWeight: 700,
          background: 'transparent', border: 'none', padding: 0,
          color: 'var(--color-text-secondary)', cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}>פתיחת השרשור ←</button>
      </div>
    </div>
  );
}

// ── Bottom nav ─────────────────────────────────────────────
function BottomNav({ active, onChange }) {
  const items = [
    { key: 'home',      label: 'בית',     Icon: Icon.Home },
    { key: 'events',    label: 'אירועים', Icon: Icon.Calendar },
    { key: 'community', label: 'קהילה',   Icon: Icon.Community },
    { key: 'profile',   label: 'הפרופיל',  Icon: Icon.User },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      padding: '10px 14px 28px',
      background: 'linear-gradient(180deg, rgba(250,250,245,0) 0%, rgba(250,250,245,0.92) 28%, rgba(250,250,245,1) 60%)',
    }}>
      <div style={{
        background: 'var(--color-text-primary)',
        borderRadius: 999,
        padding: 6,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 4,
        boxShadow: 'var(--shadow-lg)',
      }}>
        {items.map(({ key, label, Icon: I }) => {
          const on = active === key;
          return (
            <button key={key} onClick={() => onChange(key)} className="kv-tap" style={{
              minHeight: 48, borderRadius: 999,
              background: on ? 'var(--color-accent-highlight)' : 'transparent',
              color: on ? 'var(--color-text-primary)' : 'rgba(255,255,255,0.65)',
              border: 'none', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6,
              transition: 'all var(--duration-normal) var(--ease-spring)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
            }}>
              <I style={{ width: 20, height: 20 }}/>
              {on && <span>{label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Section heading ────────────────────────────────────────
function SectionHead({ label, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '20px 20px 12px',
    }}>
      <h2 style={{
        margin: 0,
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 22, letterSpacing: '-0.025em',
      }}>{label}</h2>
      {action && (
        <button style={{
          background: 'transparent', border: 'none', padding: 0,
          fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)',
          cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}>{action}</button>
      )}
    </div>
  );
}

// Export to window for cross-script access
Object.assign(window, {
  Icon, TopBar, WelcomeStrip, LiveBanner, QuickActions,
  EventCard, UpdateCard, PollCard, PostCard, BottomNav, SectionHead,
  QUICK_ACTIONS,
});
