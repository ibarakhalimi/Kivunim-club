"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BG = "linear-gradient(160deg, #FFE4CC 0%, #EDE8FF 35%, #C6F0DE 70%, #FAFAF5 100%)";

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
}

export default function RegisterSuccessPage() {
  const [platform, setPlatform] = useState<Platform>("other");
  const [installPrompt, setInstallPrompt] = useState<Event & { prompt(): Promise<void> } | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as Event & { prompt(): Promise<void> });
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (platform === "ios") {
      setShowIosHint((v) => !v);
      return;
    }
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  }

  return (
    <div
      style={{
        height: "100dvh",
        background: BG,
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "52px 24px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Image src="/logo-aguda.png" alt="לוגו האגודה" width={80} height={80} style={{ display: "block", marginBottom: 28 }} />

        {/* Celebration */}
        <div style={{ textAlign: "center", maxWidth: 360, marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h1
            style={{
              margin: "0 0 12px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 32,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
            }}
          >
            איזה כיף שנרשמת לקלאב
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 500,
              fontSize: 17,
              lineHeight: 1.5,
              color: "var(--color-text-secondary)",
            }}
          >
            שלחנו לכם קישור כניסה לאימייל.<br />לחצו עליו כדי להיכנס למועדון כיוונים
          </p>
        </div>

        {/* Wallet + install actions */}
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>

          {/* Apple Wallet */}
          <button
            style={{
              width: "100%",
              padding: "15px 20px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            <AppleWalletIcon />
            הוספה ל‑Apple Wallet
          </button>

          {/* Google Wallet */}
          <button
            style={{
              width: "100%",
              padding: "15px 20px",
              background: "#fff",
              color: "#1a1a1a",
              border: "1.5px solid rgba(0,0,0,0.15)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            <GoogleWalletIcon />
            הוספה ל‑Google Wallet
          </button>

          {/* PWA install */}
          {!installed && (platform === "ios" || platform === "android" || installPrompt) && (
            <div>
              <button
                onClick={handleInstall}
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  background: "rgba(255,255,255,0.75)",
                  color: "var(--color-text-primary)",
                  border: "2px solid var(--color-accent-primary)",
                  borderRadius: "var(--radius-md)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 20 }}>📲</span>
                שמירה במסך הבית
              </button>

              {/* iOS hint */}
              {showIosHint && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.85)",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid rgba(0,0,0,0.08)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)", textAlign: "center" }}>
                    לחצו על{" "}
                    <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>
                      <ShareIcon /> שתף
                    </span>
                    {" "}בספארי ואז{" "}
                    <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>הוסף למסך הבית</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {installed && (
            <p style={{ textAlign: "center", fontFamily: "var(--font-rubik)", fontSize: 14, color: "var(--color-text-muted)", margin: 0 }}>
              ✓ האפליקציה נשמרה במסך הבית
            </p>
          )}
        </div>

        <div style={{ height: 16 }} />
      </div>

      {/* Sticky bottom */}
      <div
        style={{
          flexShrink: 0,
          padding: "16px 24px 44px",
          background: "linear-gradient(to top, rgba(255,255,255,0.6) 0%, transparent 100%)",
        }}
      >
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "100%",
                padding: "16px 0",
                background: "var(--color-accent-primary)",
                color: "#fff",
                border: "2px solid var(--color-accent-primary)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-rubik)",
                fontWeight: 800,
                fontSize: 18,
                textAlign: "center",
                cursor: "pointer",
                letterSpacing: "0.01em",
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

function AppleWalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="white" strokeWidth="1.8" />
      <path d="M2 10h20" stroke="white" strokeWidth="1.8" />
      <circle cx="7" cy="15" r="1.5" fill="white" />
    </svg>
  );
}

function GoogleWalletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="#4285F4" strokeWidth="1.8" />
      <path d="M2 10h20" stroke="#4285F4" strokeWidth="1.8" />
      <path d="M7 14h4" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 14h3" stroke="#34A853" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ display: "inline", verticalAlign: "middle" }}>
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98M21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
