"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SPLASH_KEY = "kivunim-pwa-splash-seen";

export function AppSplash() {
  const pathname = usePathname();
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    if (sessionStorage.getItem(SPLASH_KEY) === "1") return;

    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 0);

    const fadeTimer = window.setTimeout(() => {
      setFading(true);
    }, 5000);

    const hideTimer = window.setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, "1");
      setVisible(false);
    }, 5650);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-label="מסך פתיחה"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 650ms ease",
        pointerEvents: "none",
      }}
    >
      <style>
        {`
          @keyframes appSplashLogo {
            0% { transform: scale(0.86); opacity: 0; }
            16% { transform: scale(1.04); opacity: 1; }
            32% { transform: scale(1); }
            68% { transform: scale(1.08); }
            100% { transform: scale(1); }
          }
          @keyframes appSplashRing {
            0% { transform: scale(0.72); opacity: 0; }
            24% { transform: scale(1); opacity: 0.42; }
            100% { transform: scale(1.28); opacity: 0; }
          }
        `}
      </style>

      <div
        style={{
          position: "relative",
          width: 132,
          height: 132,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid rgba(15,23,42,0.18)",
            animation: "appSplashRing 1800ms ease-out infinite",
          }}
        />
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: 26,
            background: "rgba(255,255,255,0.82)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "appSplashLogo 5000ms ease-in-out both",
          }}
        >
          <Image src="/logo-aguda.png" alt="כיוונים" width={64} height={64} priority />
        </div>
      </div>
    </div>
  );
}
