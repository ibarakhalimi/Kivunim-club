// screens-card.jsx — flippable membership card · modern editorial · Hebrew RTL

const { useState: useState_C } = React;

const CardScreen = ({ onClose }) => {
  const [flipped, setFlipped] = useState_C(false);
  return (
    <div style={{
      padding: '0 20px 120px',
      display: 'flex', flexDirection: 'column', gap: 24,
      minHeight: '100%',
      background: 'linear-gradient(180deg, var(--bg-canvas) 0%, var(--bg-tint) 100%)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
        <button onClick={onClose} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'var(--bg-surface)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}><Icon name="back" size={18} color="var(--fg-1)" style={{ transform: 'scaleX(-1)' }} /></button>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--fg-2)' }}>הכרטיס שלי</div>
        <button style={{
          width: 36, height: 36, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'var(--bg-surface)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}><Icon name="share" size={16} color="var(--fg-1)" /></button>
      </div>

      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--fg-2)', textAlign: 'center', maxWidth: 300, alignSelf: 'center' }}>
        הציגו בכניסה. הקליקו על הכרטיס כדי לסובב לQR.
      </div>

      <div onClick={() => setFlipped(f => !f)} style={{
        perspective: 1500, cursor: 'pointer', alignSelf: 'center',
      }}>
        <div style={{
          width: 320, height: 504, position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 700ms var(--ease-in-out)',
          transform: flipped ? 'rotateY(180deg)' : 'none',
        }}>
          {/* FRONT */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 30,
            background: 'var(--grad-glow)', color: 'white',
            boxShadow: 'var(--shadow-card)',
            padding: '28px 24px', boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(1px)', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 90% 110%, rgba(255,255,255,0.18), transparent 60%)' }} />
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 500 }}>כ.</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.16em', opacity: 0.78, marginTop: 4, fontWeight: 500 }}>כיוונים · מועדון</div>
              </div>
              <TierChip tier={MEMBER.tier} />
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, letterSpacing: '0.12em', opacity: 0.72, marginBottom: 6, fontWeight: 500 }}>חבר</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 56, lineHeight: 0.95, letterSpacing: '-0.02em' }}>
                עדה<br />שטרן
              </div>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 9, letterSpacing: '0.12em', opacity: 0.68, fontWeight: 500 }}>מספר חבר</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, letterSpacing: '0.04em', marginTop: 3, direction: 'ltr' }}>{MEMBER.memberNo}</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 9, letterSpacing: '0.12em', opacity: 0.68, fontWeight: 500 }}>מאז</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, letterSpacing: '0.04em', marginTop: 3, direction: 'ltr' }}>{MEMBER.since}</div>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 30,
            background: 'white', boxShadow: 'var(--shadow-card)',
            padding: '28px 24px', boxSizing: 'border-box',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--fg-3)', fontWeight: 600 }}>סריקה בכניסה</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--fg-1)', marginTop: 4, fontWeight: 500, letterSpacing: '-0.015em' }}>עדה שטרן</div>
            </div>
            <div style={{
              width: 220, height: 220, borderRadius: 16,
              background: 'var(--neutral-50)', padding: 14, boxSizing: 'border-box',
              display: 'grid', gridTemplateColumns: 'repeat(21, 1fr)', gap: 1, direction: 'ltr',
            }}>
              {Array.from({ length: 21 * 21 }).map((_, i) => {
                const r = Math.floor(i / 21), c = i % 21;
                const inFinder = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
                let fill;
                if (inFinder) {
                  if ((r === 0 || r === 6 || c === 0 || c === 6) && (r < 7 && c < 7)) fill = true;
                  else if ((r === 0 || r === 6 || c === 14 || c === 20) && (r < 7 && c > 13)) fill = true;
                  else if ((r === 14 || r === 20 || c === 0 || c === 6) && (r > 13 && c < 7)) fill = true;
                  else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) fill = true;
                  else if (r >= 2 && r <= 4 && c >= 16 && c <= 18) fill = true;
                  else if (r >= 16 && r <= 18 && c >= 2 && c <= 4) fill = true;
                  else fill = false;
                } else {
                  fill = ((r * 31 + c * 17 + r * c) % 7) < 3;
                }
                return <div key={i} style={{ background: fill ? 'var(--neutral-900)' : 'transparent', borderRadius: 1 }} />;
              })}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)', letterSpacing: '0.04em', direction: 'ltr' }}>{MEMBER.memberNo}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>מתחדש כל 60 שניות</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
        {[
          { n: MEMBER.events, l: 'אירועים' },
          { n: MEMBER.saved, l: 'חסכת' },
          { n: MEMBER.met, l: 'פגישות' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 500, color: 'var(--fg-1)', letterSpacing: '-0.02em', direction: 'ltr' }}>{s.n}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.04em', fontWeight: 600, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button variant="ghost" full icon="share">שיתוף הפרופיל</Button>
        <Button variant="ghost" full icon="plus">הזמינו חבר/ה · 2 נותרו</Button>
      </div>
    </div>
  );
};

Object.assign(window, { CardScreen });
