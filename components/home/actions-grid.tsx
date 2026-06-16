"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ClipboardList, Gift, Lightbulb, Phone, Plus, UserCheck } from "lucide-react";

const ALL_ACTIONS = [
  { Icon: Phone, label: "יצירת קשר", bg: "#EEF2FF", color: "#4338CA" },
  { Icon: ClipboardList, label: "מידע חשוב", bg: "#EEF2FF", color: "#4338CA" },
  { Icon: Lightbulb, label: "יש לי רעיון", bg: "#EEF2FF", color: "#4338CA" },
  { Icon: Gift, label: "ההטבות שלי", bg: "#EEF2FF", color: "#4338CA" },
  { Icon: CalendarDays, label: "אירועים קרובים", bg: "#EEF2FF", color: "#4338CA" },
  { Icon: UserCheck, label: "בדיקת נוכחות", bg: "#EEF2FF", color: "#4338CA" },
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
      <section style={{ width: "100%", display: "flex", alignItems: "stretch", gap: 8, overflow: "hidden", padding: "2px 0" }}>
        {visibleActions.map((action) => (
          <button
            key={`contained-${action.label}`}
            style={{
              flex: 1,
              minWidth: 0,
              border: "1px solid rgba(67, 56, 202, 0.12)",
              background: "#fff",
              borderRadius: 20,
              padding: "10px 8px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "space-between",
              gap: 12,
              textAlign: "right",
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 13,
                background: action.bg,
                color: action.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                alignSelf: "flex-start",
              }}
            >
              <action.Icon size={20} strokeWidth={2.15} />
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
            border: "1px solid rgba(67, 56, 202, 0.12)",
            background: "#fff",
            borderRadius: 20,
            padding: "10px 8px",
            color: "#0F172A",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "space-between",
            gap: 12,
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 13,
              background: "#EEF2FF",
              color: "#4338CA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-start",
            }}
          >
            <Plus size={20} strokeWidth={2.4} />
          </span>
          <span
            style={{
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 11,
              lineHeight: 1.15,
              color: "#0F172A",
              whiteSpace: "nowrap",
              alignSelf: "stretch",
              textAlign: "right",
            }}
          >
            כל הפעולות
          </span>
        </button>
      </section>

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
              <span style={{ width: 34, height: 34, borderRadius: 10, background: action.bg, color: action.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <action.Icon size={18} strokeWidth={2.1} />
              </span>
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
