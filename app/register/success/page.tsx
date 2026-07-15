import Image from "next/image";
import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <div
      style={{
        height: "100dvh",
        background: "#DFDBD3",
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
            borderRadius: 28,
            background: "#F7F8FF",
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
            background: "rgba(89, 52, 237, 0.14)",
            borderRadius: 20,
            padding: "3px 14px",
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
            fontSize: 13,
            color: "#5934ED",
          }}
        >
          ברוך הבא למועדון
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
            fontSize: 31,
            lineHeight: 1.12,
            color: "#290800",
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
            background: "#EFF2EC",
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
            fontWeight: 900,
            fontSize: 26,
            color: "#290800",
          }}
        >
          ההרשמה התקבלה!
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 600,
            fontSize: 16,
            color: "#683633",
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
                background: "#5934ED",
                color: "#fff",
                border: "none",
                borderRadius: 18,
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
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
