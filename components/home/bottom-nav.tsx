"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Calendar, Gift, Home, Megaphone, Zap } from "lucide-react";

const ITEMS = [
  { key: "home", label: "בית", Icon: Home, href: "/" },
  { key: "updates", label: "עדכונים", Icon: Megaphone, href: "/updates" },
  { key: "events", label: "אירועים", Icon: Calendar, href: "/events" },
  { key: "actions", label: "פעולות", Icon: Zap, href: "/" },
  { key: "benefits", label: "הטבות", Icon: Gift, href: "/benefits" },
  { key: "activity", label: "פעילות", Icon: Activity, href: "/activities" },
];

type BottomNavProps = {
  activeKey?: string;
  alwaysOpen?: boolean;
};

export function BottomNav({ activeKey, alwaysOpen = false }: BottomNavProps) {
  const router = useRouter();
  const [active, setActive] = useState(activeKey ?? "home");
  const [scrolling, setScrolling] = useState(false);
  const [open, setOpen] = useState(alwaysOpen);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOpen = alwaysOpen || open;
  const currentActive = activeKey ?? active;

  useEffect(() => {
    function handleScroll() {
      setScrolling(true);
      if (!alwaysOpen) setOpen(false);

      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        setScrolling(false);
        if (alwaysOpen) setOpen(true);
      }, 180);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [alwaysOpen]);

  function openActionsDrawer() {
    setOpen(false);
    window.dispatchEvent(new Event("open-actions-drawer"));
  }

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
        width: isOpen ? "min(86vw, 340px)" : 154,
        background: "rgba(255,255,255,0.24)",
        border: "1px solid rgba(255,255,255,0.72)",
        borderRadius: 999,
        padding: 4,
        display: "grid",
        gridTemplateColumns: isOpen ? `repeat(${ITEMS.length}, 1fr)` : "1fr 42px",
        gap: isOpen ? 0 : 6,
        zIndex: 20,
        backdropFilter: "blur(26px) saturate(1.55)",
        WebkitBackdropFilter: "blur(26px) saturate(1.55)",
        boxShadow: "0 10px 28px rgba(15,23,42,0.16), inset 0 0 0 1px rgba(255,255,255,0.28)",
        transform: `translateX(-50%) scale(${scrolling ? 0.9 : 1})`,
        transformOrigin: "center bottom",
        opacity: 1,
        transition: "transform 0.24s ease, width 0.22s ease",
      }}
    >
      {!isOpen ? (
        <>
          <button
            onClick={() => setOpen(true)}
            style={{
              minHeight: 42,
              borderRadius: 999,
              background: "rgba(255,255,255,0.76)",
              color: "#0F172A",
              border: "none",
              cursor: "pointer",
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            תפריט
          </button>
          <button
            onClick={openActionsDrawer}
            aria-label="פעולות"
            style={{
              width: 42,
              minHeight: 42,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.76)",
              color: "#1E40AF",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={21} strokeWidth={2.25} />
          </button>
        </>
      ) : (
        ITEMS.map(({ key, label, Icon, href }) => {
          const on = currentActive === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActive(key);
                if (!alwaysOpen) setOpen(false);
                if (key === "actions") {
                  window.dispatchEvent(new Event("open-actions-drawer"));
                }
                router.push(href);
              }}
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
              }}
            >
              <Icon size={on ? 25 : 20} strokeWidth={on ? 2.35 : 1.9} />
            </button>
          );
        })
      )}
    </div>
  );
}
