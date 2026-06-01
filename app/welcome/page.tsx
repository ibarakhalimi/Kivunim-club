import Image from "next/image";
import Link from "next/link";
import { AuthRedirect } from "./auth-redirect";

export default function WelcomePage() {
  return (
    <div
      style={{
        height: "100dvh",
        width: "100%",
        background: "#e7e3da",
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.1) 1.2px, transparent 1.2px)",
        backgroundSize: "18px 18px",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AuthRedirect />
      {/* Hero image — top half, fades into background */}
      <div style={{ position: "relative", width: "100%", height: "48dvh", flexShrink: 0 }}>
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
            background: "linear-gradient(to bottom, transparent 40%, #e7e3da 100%)",
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
          padding: "0 28px 48px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo + text */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, paddingTop: 4 }}>
          <Image
            src="/logo-aguda.png"
            alt="לוגו האגודה"
            width={90}
            height={90}
            style={{ display: "block" }}
          />
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 900,
              fontSize: 24,
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
              color: "#111",
            }}
          >
            מועדון ההטבות והפעילויות<br />הסטודנטיאלי של אשדוד
          </p>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                padding: "16px 0",
                background: "#5250DB",
                color: "#fff",
                border: "3px solid #000",
                borderRadius: "var(--radius-md)",
                boxShadow: "4px 4px 0px #000",
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
                fontSize: 18,
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
                padding: "16px 0",
                background: "#fff",
                color: "#000",
                border: "3px solid #000",
                borderRadius: "var(--radius-md)",
                boxShadow: "4px 4px 0px #000",
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
                fontSize: 18,
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
