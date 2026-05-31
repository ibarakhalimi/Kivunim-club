import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div
      style={{
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        background:
          "linear-gradient(160deg, #FFE4CC 0%, #EDE8FF 35%, #C6F0DE 70%, #FAFAF5 100%)",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "32px 28px 52px",
        textAlign: "center",
      }}
    >

      {/* Logo at the very top */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <Image
          src="/logo-aguda.png"
          alt="לוגו האגודה"
          width={140}
          height={140}
          style={{ display: "block" }}
        />
      </div>

      {/* Brand + tagline — vertically centred in remaining space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        {/* Chip */}
        <div
          style={{
            display: "inline-block",
            background: "var(--color-accent-primary)",
            color: "#fff",
            border: "2px solid var(--color-accent-primary)",
            borderRadius: "var(--radius-full)",
            padding: "4px 16px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.04em",
          }}
        >
          וולקאם טו דה קלאב
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
            fontSize: 56,
            lineHeight: 1.1,
            letterSpacing: "-0.05em",
            color: "var(--color-text-primary)",
          }}
        >
          מועדון כיוונים
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: 340,
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1.1,
            color: "var(--color-text-secondary)",
          }}
        >
          מועדון ההטבות והפעילויות<br />הסטודנטיאלי של אשדוד
        </p>
      </div>

        {/* Bottom: CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                padding: "16px 0",
                background: "var(--color-accent-primary)",
                color: "#fff",
                border: "2px solid var(--color-accent-primary)",
                borderRadius: "var(--radius-md)",
                boxShadow: "none",
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
                border: "2px solid var(--color-accent-primary)",
                borderRadius: "var(--radius-md)",
                boxShadow: "none",
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
  );
}
