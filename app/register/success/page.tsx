import Image from "next/image";
import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <div
      style={{
        height: "100dvh",
        background: "var(--color-app-bg)",
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
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: "var(--shape-radius-7xl)",
            background: "var(--color-surface-tinted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image src="/logo-aguda.png" alt="לוגו האגודה" width={72} height={72} style={{ display: "block" }} />
        </div>
        <span
          style={{
            display: "inline-block",
            background: "color-mix(in srgb, var(--color-brand) 14%, transparent)",
            borderRadius: "var(--shape-radius-4xl)",
            padding: "3px 14px",
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-black)",
            fontSize: "var(--font-size-md)",
            color: "var(--color-brand)",
          }}
        >
          ברוך הבא למועדון
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-black)",
            fontSize: "var(--font-size-6xl)",
            lineHeight: 1.12,
            color: "var(--color-ink)",
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
            borderRadius: "var(--shape-radius-circle)",
            background: "var(--color-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "var(--font-size-6xl)",
            marginBottom: 8,
          }}
        >
          🎉
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-black)",
            fontSize: "var(--font-size-4xl)",
            color: "var(--color-ink)",
          }}
        >
          ההרשמה התקבלה!
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-semibold)",
            fontSize: "var(--font-size-xl)",
            color: "var(--color-warm-ink)",
            lineHeight: 1.6,
            maxWidth: 300,
          }}
        >
          ההרשמה הושלמה. עכשיו אפשר להיכנס למועדון באמצעות קוד לנייד.
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
          <Link href="/welcome" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                padding: "15px 0",
                background: "var(--color-brand)",
                color: "var(--color-surface-raised)",
                border: "none",
                borderRadius: "var(--shape-radius-3xl)",
                fontFamily: "var(--font-family-sans)",
                fontWeight: "var(--font-weight-black)",
                fontSize: "var(--font-size-xl)",
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
