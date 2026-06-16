"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

const ALL_ACTIONS = [
  { emoji: "📞", label: "יצירת קשר", bg: "#EEF2FF", color: "#4338CA" },
  { emoji: "📋", label: "מידע חשוב", bg: "#FFFBEB", color: "#B45309" },
  { emoji: "💡", label: "יש לי רעיון", bg: "#F0FDF4", color: "#15803D" },
  { emoji: "🎁", label: "ההטבות שלי", bg: "#FFF1F2", color: "#BE123C" },
  { emoji: "📅", label: "אירועים קרובים", bg: "#EFF6FF", color: "#1E40AF" },
  { emoji: "✅", label: "בדיקת נוכחות", bg: "#F5F3FF", color: "#6D28D9" },
];

const drawerStyle = (open: boolean): React.CSSProperties => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: open ? 51 : -1,
  background: "#fff",
  borderRadius: "20px 20px 0 0",
  border: "1px solid #E2E8F0",
  borderBottom: "none",
  direction: "rtl",
  padding: "0 20px 52px",
  transform: open ? "translateY(0)" : "translateY(105%)",
  transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
  willChange: "transform",
});

const backdropStyle = (open: boolean): React.CSSProperties => ({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  zIndex: 50,
  opacity: open ? 1 : 0,
  pointerEvents: open ? "auto" : "none",
  transition: "opacity 0.28s ease",
});

function Handle() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 16px" }}>
      <div style={{ width: 36, height: 4, background: "#E2E8F0", borderRadius: 99 }} />
    </div>
  );
}

export function ActionsGrid() {
  const [actionsOpen, setActionsOpen] = useState(false);
  const visibleActions = ALL_ACTIONS.slice(0, 3);

  useEffect(() => {
    function openActionsDrawer() {
      setActionsOpen(true);
    }

    window.addEventListener("open-actions-drawer", openActionsDrawer);
    return () => window.removeEventListener("open-actions-drawer", openActionsDrawer);
  }, []);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <section
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            overflow: "hidden",
          }}
        >
          {visibleActions.map((action) => (
            <button
              key={action.label}
              style={{
                flex: 1,
                minWidth: 0,
                border: "1px solid #E2E8F0",
                background: "#fff",
                borderRadius: 18,
                padding: "12px 6px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: action.bg,
                  color: action.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  lineHeight: 1,
                }}
              >
                {action.emoji}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 800,
                  fontSize: 11,
                  lineHeight: 1.15,
                  color: "#0F172A",
                  whiteSpace: "nowrap",
                }}
              >
                {action.label}
              </span>
            </button>
          ))}

          <button
            onClick={() => setActionsOpen(true)}
            aria-label="כל הפעולות"
            style={{
              flex: 1,
              minWidth: 0,
              border: "1px solid #E2E8F0",
              background: "#fff",
              borderRadius: 18,
              padding: "12px 6px",
              color: "#0F172A",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: "#0F172A",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={21} strokeWidth={2.4} />
            </span>
            <span
              style={{
                fontFamily: "var(--font-rubik)",
                fontWeight: 800,
                fontSize: 11,
                lineHeight: 1.15,
                color: "#0F172A",
                whiteSpace: "nowrap",
              }}
            >
              כל הפעולות
            </span>
          </button>
        </section>
      </div>

      <div style={backdropStyle(actionsOpen)} onClick={() => setActionsOpen(false)} />
      <div style={drawerStyle(actionsOpen)}>
        <Handle />
        <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 18, color: "#0F172A" }}>
          כל הפעולות
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ALL_ACTIONS.map((action) => (
            <button
              key={action.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: action.bg,
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "12px 16px",
                cursor: "pointer",
                width: "100%",
                textAlign: "right",
              }}
            >
              <span style={{ fontSize: 20 }}>{action.emoji}</span>
              <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 15, color: action.color }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

    </>
  );
}
