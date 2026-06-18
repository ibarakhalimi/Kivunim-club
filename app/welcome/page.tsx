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
        background: "#181A23",
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
          padding: "96px 14px 48px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo + title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 8 }}>
          {/* Logo with floating icons */}
          <div style={{ position: "relative", width: 112, height: 112 }}>
            <span style={{ position: "absolute", top: -14, right: -10, fontSize: 26, lineHeight: 1, animation: "float 3.2s ease-in-out infinite", animationDelay: "0s", display: "block" }}>🎉</span>
            <span style={{ position: "absolute", top: 6, left: -20, fontSize: 22, lineHeight: 1, animation: "float 2.8s ease-in-out infinite", animationDelay: "0.6s", display: "block" }}>🎟️</span>
            <span style={{ position: "absolute", bottom: -10, right: -14, fontSize: 24, lineHeight: 1, animation: "float 3.5s ease-in-out infinite", animationDelay: "1.1s", display: "block" }}>⭐</span>
            <span style={{ position: "absolute", bottom: 4, left: -18, fontSize: 22, lineHeight: 1, animation: "float 3.0s ease-in-out infinite", animationDelay: "0.3s", display: "block" }}>🎁</span>
            <span style={{ position: "absolute", top: -18, left: 14, fontSize: 22, lineHeight: 1, animation: "float 2.6s ease-in-out infinite", animationDelay: "1.5s", display: "block" }}>🏆</span>
            <span style={{ position: "absolute", bottom: -16, left: "28%", fontSize: 20, lineHeight: 1, animation: "float 3.3s ease-in-out infinite", animationDelay: "0.9s", display: "block" }}>👥</span>
            <div
              style={{
                width: 112,
                height: 112,
                borderRadius: 34,
                background: "#F7F8FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/logo-aguda.png"
                alt="לוגו האגודה"
                width={88}
                height={88}
                style={{ display: "block" }}
              />
            </div>
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 900,
              fontSize: 24,
              lineHeight: 1.12,
              color: "#F7F8FF",
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
              color: "#9CA0AE",
              fontFamily: "var(--font-rubik)",
              fontSize: 14,
              fontWeight: 800,
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
                background: "#FF2E9A",
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
              הרשמה למועדון
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
