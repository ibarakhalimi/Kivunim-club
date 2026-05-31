import Link from "next/link";

const FLOATERS = [
  { icon: "📅", label: "אירועים",  bg: "var(--color-card-sky)",      top: "22%", left: "4%",  anim: "kv-float-1 5s ease-in-out infinite",   rotate: "-6deg" },
  { icon: "🎁", label: "הטבות",   bg: "var(--color-card-mint)",     top: "32%", right: "4%", anim: "kv-float-2 6.5s ease-in-out infinite", rotate: "5deg"  },
  { icon: "📢", label: "עדכונים", bg: "var(--color-card-butter)",   top: "54%", left: "6%",  anim: "kv-float-3 4.8s ease-in-out infinite", rotate: "-4deg" },
  { icon: "🎓", label: "חברים",   bg: "var(--color-card-peach)",    top: "60%", right: "5%", anim: "kv-float-4 5.5s ease-in-out infinite", rotate: "7deg"  },
  { icon: "📊", label: "סקרים",   bg: "var(--color-card-lavender)", top: "42%", left: "2%",  anim: "kv-float-2 7s ease-in-out infinite",   rotate: "3deg"  },
  { icon: "🤝", label: "קהילה",   bg: "var(--color-card-lime)",     top: "74%", left: "10%", anim: "kv-float-1 6s ease-in-out infinite",   rotate: "-5deg" },
  { icon: "🗓️", label: "לוח שנה", bg: "var(--color-card-sky)",      top: "20%", right: "6%", anim: "kv-float-4 5.2s ease-in-out infinite", rotate: "4deg"  },
];

export default function WelcomePage() {
  return (
    <div
      style={{
        position: "relative",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        background:
          "linear-gradient(160deg, #FFE4CC 0%, #EDE8FF 35%, #C6F0DE 70%, #FAFAF5 100%)",
        direction: "rtl",
      }}
    >
      {/* ── Floating background cards ── */}
      {FLOATERS.map((f) => (
        <div
          key={f.label}
          style={{
            position: "absolute",
            top: f.top,
            ...(f.left ? { left: f.left } : { right: f.right }),
            animation: f.anim,
            zIndex: 0,
          }}
        >
          <div
            style={{
              background: f.bg,
              border: "2px solid #0F0F0F",
              borderRadius: 0,
              boxShadow: "3px 3px 0 0 #0F0F0F",
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              transform: `rotate(${f.rotate})`,
              minWidth: 64,
            }}
          >
            <span style={{ fontSize: 28, lineHeight: 1 }}>{f.icon}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "var(--font-rubik)",
                color: "var(--color-text-primary)",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              {f.label}
            </span>
          </div>
        </div>
      ))}

      {/* ── Foreground layout ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 28px 52px",
          textAlign: "center",
        }}
      >
        {/* Top: brand + tagline */}
        <div>
          {/* Comic badge */}
          <div
            style={{
              display: "inline-block",
              background: "#0F0F0F",
              color: "var(--color-accent-highlight)",
              border: "2px solid #0F0F0F",
              borderRadius: 0,
              padding: "4px 14px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            ברוכים הבאים
          </div>

          <h1
            style={{
              margin: "0 0 16px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 58,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              color: "var(--color-text-primary)",
            }}
          >
            מועדון<br />כיוונים
          </h1>

          <p
            style={{
              margin: "0 auto",
              maxWidth: 300,
              fontFamily: "var(--font-heebo)",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: 1.65,
              color: "var(--color-text-secondary)",
            }}
          >
            הירשמו או התחברו כדי לצפות בעדכונים, אירועים והטבות של המועדון.
          </p>
        </div>

        {/* Bottom: CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                padding: "16px 0",
                background: "#0F0F0F",
                color: "var(--color-accent-highlight)",
                border: "2px solid #0F0F0F",
                borderRadius: 0,
                boxShadow: "4px 4px 0 0 #555",
                fontFamily: "var(--font-rubik)",
                fontWeight: 800,
                fontSize: 18,
                textAlign: "center",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              הרשמה למועדון
            </div>
          </Link>

          <Link href="/login" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                padding: "15px 0",
                background: "rgba(255,255,255,0.75)",
                color: "var(--color-text-primary)",
                border: "2px solid #0F0F0F",
                borderRadius: 0,
                boxShadow: "4px 4px 0 0 #0F0F0F",
                fontFamily: "var(--font-rubik)",
                fontWeight: 700,
                fontSize: 17,
                textAlign: "center",
                cursor: "pointer",
                backdropFilter: "blur(4px)",
              }}
            >
              כבר יש לי חשבון
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
