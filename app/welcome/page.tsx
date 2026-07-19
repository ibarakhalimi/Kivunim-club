import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AuthRedirect } from "./auth-redirect";
import { WelcomeLoginForm } from "./welcome-login-form";

type WelcomePageProps = {
  searchParams?: Promise<{ next?: string }>;
};

export default async function WelcomePage({ searchParams }: WelcomePageProps) {
  const params = await searchParams;
  const nextPath = params?.next;
  const registerHref = nextPath ? `/register?next=${encodeURIComponent(nextPath)}` : "/register";
  const resolvedNextPath = nextPath || "/";

  return (
    <div
      style={{
        height: "100dvh",
        width: "100%",
        background: "var(--color-app-bg)",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
          50% { transform: translateY(-9px) scale(1.08) rotate(4deg); }
        }
      `}</style>
      <Suspense fallback={null}>
        <AuthRedirect />
      </Suspense>

      {/* Bottom section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 14px 48px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo + title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          {/* Logo with floating icons */}
          <div style={{ position: "relative", width: "calc(100vw - 28px)", maxWidth: 520, height: 156, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ position: "absolute", top: 0, right: 0, fontSize: "var(--font-size-6xl)", lineHeight: 1, animation: "float 3.2s ease-in-out infinite", animationDelay: "0s", display: "block" }}>🎉</span>
            <span style={{ position: "absolute", top: 24, left: 0, fontSize: "var(--font-size-6xl)", lineHeight: 1, animation: "float 2.8s ease-in-out infinite", animationDelay: "0.6s", display: "block" }}>🎟️</span>
            <span style={{ position: "absolute", bottom: 10, right: "3%", fontSize: "var(--font-size-6xl)", lineHeight: 1, animation: "float 3.5s ease-in-out infinite", animationDelay: "1.1s", display: "block" }}>⭐</span>
            <span style={{ position: "absolute", bottom: 16, left: "4%", fontSize: "var(--font-size-6xl)", lineHeight: 1, animation: "float 3.0s ease-in-out infinite", animationDelay: "0.3s", display: "block" }}>🎁</span>
            <span style={{ position: "absolute", top: 0, left: "23%", fontSize: "var(--font-size-6xl)", lineHeight: 1, animation: "float 2.6s ease-in-out infinite", animationDelay: "1.5s", display: "block" }}>🏆</span>
            <span style={{ position: "absolute", bottom: 0, right: "25%", fontSize: "var(--font-size-6xl)", lineHeight: 1, animation: "float 3.3s ease-in-out infinite", animationDelay: "0.9s", display: "block" }}>👥</span>
            <div
              style={{
                width: 146,
                height: 146,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Image
                src="/logo-aguda.png"
                alt="לוגו האגודה"
                width={126}
                height={126}
                style={{ display: "block" }}
              />
            </div>
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-family-sans)",
              fontWeight: "var(--font-weight-black)",
              fontSize: "var(--font-size-4xl)",
              lineHeight: 1.12,
              color: "var(--color-ink)",
              maxWidth: 360,
            }}
          >
            מועדון ההטבות והפעילויות<br />הסטודנטיאלי של אשדוד
          </h1>
        </div>

        <Suspense fallback={null}>
          <WelcomeLoginForm nextPath={resolvedNextPath} />
        </Suspense>

        {/* CTA button */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          <p
            style={{
              margin: 0,
              color: "var(--color-ink)",
              fontFamily: "var(--font-family-sans)",
              fontSize: "var(--font-size-base)",
              fontWeight: "var(--font-weight-extrabold)",
              textAlign: "center",
            }}
          >
            פעם ראשונה פה?
          </p>
          <Link href={registerHref} style={{ textDecoration: "none" }}>
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
              הרשמה למועדון
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
