import Link from "next/link";

export default function WelcomePage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background:
          "radial-gradient(circle at top, rgba(255, 236, 211, 0.95) 0%, rgba(250, 250, 245, 0.9) 45%, var(--color-bg-primary) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        direction: "rtl",
      }}
    >
      <div style={{ width: "100%", maxWidth: 760, textAlign: "center", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 24,
            left: "50%",
            transform: "translateX(-50%) scale(1.1)",
            opacity: 0.22,
            fontSize: 112,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          🎉
        </div>

        <p
          style={{
            margin: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "10px 18px",
            borderRadius: 999,
            background: "var(--color-card-butter)",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          ברוכים הבאים
        </p>

        <h1
          style={{
            margin: "28px 0 14px",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 56,
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            color: "var(--color-text-primary)",
          }}
        >
          מועדון כיוונים
        </h1>

        <p
          style={{
            margin: "0 auto",
            maxWidth: 520,
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: 18,
            lineHeight: 1.75,
            color: "var(--color-text-secondary)",
          }}
        >
          כאן מתחיל המסלול לחברי מועדון כיוונים. הירשמו או התחברו כדי לצפות בעדכונים, אירועים והטבות.
        </p>

        <div
          style={{
            display: "grid",
            gap: 16,
            marginTop: 36,
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          <Link href="/register" style={{ width: "100%", maxWidth: 360, textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                minHeight: 52,
                display: "grid",
                placeItems: "center",
                borderRadius: 999,
                background: "var(--color-accent-primary)",
                color: "var(--color-text-inverse)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: "0.01em",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              הרשמה
            </div>
          </Link>

          <Link href="/login" style={{ width: "100%", maxWidth: 360, textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                minHeight: 52,
                display: "grid",
                placeItems: "center",
                borderRadius: 999,
                background: "transparent",
                border: "2px solid var(--color-accent-primary)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: "0.01em",
                cursor: "pointer",
              }}
            >
              כניסה
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
