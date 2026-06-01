import Image from "next/image";
import Link from "next/link";

const BG = "#e7e3da";
const DOTS = "radial-gradient(circle, rgba(0,0,0,0.1) 1.2px, transparent 1.2px)";

export default function RegisterSuccessPage() {
  return (
    <div
      style={{
        height: "100dvh",
        background: BG,
        backgroundImage: DOTS,
        backgroundSize: "18px 18px",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "48px 24px 0", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Image src="/logo-aguda.png" alt="לוגו האגודה" width={110} height={110} style={{ display: "block" }} />
        <span style={{
          background: "#A8D464",
          border: "2.5px solid #000",
          borderRadius: 99,
          padding: "4px 16px",
          fontFamily: "var(--font-rubik)",
          fontWeight: 800,
          fontSize: 14,
          color: "#111",
        }}>
          ברוך הבא לקלאב 🎉
        </span>
        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-rubik)",
          fontWeight: 900,
          fontSize: 36,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: "#111",
          textAlign: "center",
        }}>
          הקלאב הסטודנטיאלי
        </h1>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <p style={{ margin: "0 0 10px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 20, color: "#555" }}>
          ההרשמה התקבלה
        </p>
        <h2 style={{ margin: 0, fontFamily: "'Comic Sans MS', cursive, var(--font-rubik)", fontWeight: 900, fontSize: 42, lineHeight: 1.1, color: "#111" }}>
          וולקאם טו דה קלאב
        </h2>
      </div>

      {/* Sticky bottom */}
      <div style={{ flexShrink: 0, padding: "16px 24px 44px", background: `linear-gradient(to top, ${BG} 60%, transparent 100%)` }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: "100%", padding: "16px 0",
              background: "#5250DB", color: "#fff",
              border: "3px solid #000", borderRadius: "var(--radius-md)", boxShadow: "4px 4px 0 #000",
              fontFamily: "'Comic Sans MS', cursive, sans-serif",
              fontWeight: 800, fontSize: 18, textAlign: "center", cursor: "pointer",
            }}>
              כניסה למועדון
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
