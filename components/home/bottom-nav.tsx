"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, Calendar, Gift, Home, Zap } from "lucide-react";

const ITEMS = [
  { key: "home", label: "בית", Icon: Home },
  { key: "events", label: "אירועים", Icon: Calendar },
  { key: "actions", label: "פעולות", Icon: Zap },
  { key: "benefits", label: "הטבות", Icon: Gift },
  { key: "activity", label: "פעילות", Icon: Activity },
];

export function BottomNav() {
  const [active, setActive] = useState("home");
  const [visible, setVisible] = useState(true);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleScroll() {
      setVisible(false);

      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        setVisible(true);
      }, 180);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
        width: "min(76vw, 300px)",
        background: "rgba(255,255,255,0.24)",
        border: "1px solid rgba(255,255,255,0.72)",
        borderRadius: 999,
        padding: 4,
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 0,
        zIndex: 20,
        backdropFilter: "blur(26px) saturate(1.55)",
        WebkitBackdropFilter: "blur(26px) saturate(1.55)",
        boxShadow: "0 10px 28px rgba(15,23,42,0.16), inset 0 0 0 1px rgba(255,255,255,0.28)",
        transform: visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(110px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.24s ease, opacity 0.2s ease",
      }}
    >
      {ITEMS.map(({ key, label, Icon }) => {
        const on = active === key;
        return (
          <button
            key={key}
            onClick={() => setActive(key)}
            aria-label={label}
            style={{
              minHeight: 42,
              borderRadius: 999,
              background: on ? "rgba(255,255,255,0.76)" : "transparent",
              color: on ? "#1E40AF" : "#94A3B8",
              border: "none",
              cursor: "pointer",
              padding: on ? "6px 2px" : "5px 1px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 140ms ease",
              fontFamily: "var(--font-rubik)",
              fontWeight: on ? 700 : 500,
              fontSize: 10,
            }}
          >
            <Icon size={on ? 25 : 20} strokeWidth={on ? 2.35 : 1.9} />
          </button>
        );
      })}
    </div>
  );
}
