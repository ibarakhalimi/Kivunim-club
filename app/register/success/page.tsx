import Image from "next/image";
import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <div
      style={{
        height: "100dvh",
        background: "#F8FAFC",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "48px 24px 0",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Image src="/logo-aguda.png" alt="לוגו האגודה" width={80} height={80} style={{ display: "block" }} />
        <span
          style={{
            display: "inline-block",
            background: "#DCFCE7",
            borderRadius: 20,
            padding: "3px 14px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 13,
            color: "#16A34A",
          }}
        >
          ברוך הבא למועדון
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 28,
            lineHeight: 1.2,
            color: "#0F172A",
            textAlign: "center",
          }}
        >
          הקלאב הסטודנטיאלי
        </h1>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          textAlign: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#DCFCE7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            marginBottom: 8,
          }}
        >
          🎉
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 26,
            color: "#0F172A",
          }}
        >
          ההרשמה התקבלה!
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 400,
            fontSize: 16,
            color: "#475569",
            lineHeight: 1.6,
            maxWidth: 300,
          }}
        >
          ברוך הבא למועדון הסטודנטים. בדוק את תיבת האימייל שלך לאישור הרשמה.
        </p>
      </div>

      {/* CTA */}
      <div
        style={{
          flexShrink: 0,
          padding: "16px 24px 48px",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
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
              כניסה למועדון
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
