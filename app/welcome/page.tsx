import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div
      style={{
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        background: "#e7e3da",
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.1) 1.2px, transparent 1.2px)",
        backgroundSize: "18px 18px",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "0 28px 52px",
        textAlign: "center",
        position: "relative",
      }}
    >

      {/* Background hero image — square, top, fades into page */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          aspectRatio: "1 / 1",
          zIndex: 0,
        }}
      >
        <Image
          src="/ChatGPT Image Jun 1, 2026, 01_12_22 PM.png"
          alt=""
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 50%, #e7e3da 100%)",
          }}
        />
      </div>

      {/* Spacer to push content below the image */}
      <div style={{ width: "100%", aspectRatio: "1 / 1", flexShrink: 0 }} />

      {/* Brand + tagline — vertically centred in remaining space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, position: "relative", zIndex: 1 }}>
        <Image
          src="/logo-aguda.png"
          alt="לוגו האגודה"
          width={160}
          height={160}
          style={{ display: "block" }}
        />

        {/* Chip */}
        <div
          style={{
            display: "inline-block",
            background: "#5250DB",
            color: "#fff",
            
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

        <p
          style={{
            margin: 0,
            maxWidth: 360,
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
            fontSize: 36,
            lineHeight: 1.1,
            letterSpacing: "-2px",
            color: "#000000",
          }}
        >
          מועדון ההטבות והפעילויות<br />הסטודנטיאלי של אשדוד
        </p>
      </div>

        {/* Bottom: CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 1 }}>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                padding: "16px 0",
                background: "#5250DB",
                color: "#fff",
                border: "3px solid #000",
                borderRadius: "var(--radius-md)",
                boxShadow: "4px 4px 0px rgba(0, 0, 0, 1)",
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
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
                padding: "16px 0",
                background: "#fff",
                color: "#000",
                border: "3px solid #000",
                borderRadius: "var(--radius-md)",
                boxShadow: "4px 4px 0px rgba(0, 0, 0, 1)",
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
                fontSize: 18,
                textAlign: "center",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              כבר יש לי חשבון
            </div>
          </Link>
        </div>
    </div>
  );
}
