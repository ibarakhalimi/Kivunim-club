import Image from "next/image";
import Link from "next/link";
import { AuthRedirect } from "./auth-redirect";

export default function WelcomePage() {
  return (
    <div
      style={{
        height: "100dvh",
        width: "100%",
        background: "#ffffff",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AuthRedirect />

      {/* Hero image */}
      <div style={{ position: "relative", width: "100%", height: "50dvh", flexShrink: 0 }}>
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
            background: "linear-gradient(to bottom, transparent 50%, #ffffff 100%)",
          }}
        />
      </div>

      {/* Bottom section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px 48px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo + title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 8 }}>
          <Image
            src="/logo-aguda.png"
            alt="לוגו האגודה"
            width={80}
            height={80}
            style={{ display: "block" }}
          />
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 22,
              lineHeight: 1.3,
              color: "#0F172A",
            }}
          >
            מועדון ההטבות והפעילויות<br />הסטודנטיאלי של אשדוד
          </h1>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                padding: "15px 0",
                background: "#1E40AF",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontFamily: "var(--font-rubik)",
                fontWeight: 700,
                fontSize: 17,
                textAlign: "center",
                cursor: "pointer",
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
                background: "#fff",
                color: "#0F172A",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                fontFamily: "var(--font-rubik)",
                fontWeight: 600,
                fontSize: 17,
                textAlign: "center",
                cursor: "pointer",
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
