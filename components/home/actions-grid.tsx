"use client";

import { useEffect, useRef, useState } from "react";

const ALL_ACTIONS = [
  { emoji: "📞", label: "יצירת קשר",      bg: "#EEF2FF", color: "#4338CA" },
  { emoji: "📋", label: "מידע חשוב",      bg: "#FFFBEB", color: "#B45309" },
  { emoji: "💡", label: "יש לי רעיון",    bg: "#F0FDF4", color: "#15803D" },
  { emoji: "🎁", label: "ההטבות שלי",     bg: "#FFF1F2", color: "#BE123C" },
  { emoji: "📅", label: "אירועים קרובים", bg: "#EFF6FF", color: "#1E40AF" },
  { emoji: "✅", label: "בדיקת נוכחות",  bg: "#F5F3FF", color: "#6D28D9" },
];

const INFO_PAGES = [
  { icon: "🕐", label: "שעות פעילות" },
  { icon: "📍", label: "מיקום" },
  { icon: "📞", label: "יצירת קשר" },
  { icon: "🎓", label: "לסטודנטים" },
  { icon: "📸", label: "רשתות" },
];

const INFO_FULL = [
  { icon: "🕐", label: "שעות פעילות",  value: "א׳–ה׳, 08:00–22:00" },
  { icon: "📍", label: "מיקום",         value: "בניין 28, קומה 2" },
  { icon: "📞", label: "טלפון",         value: "054-000-0000" },
  { icon: "📧", label: "אימייל",        value: "club@college.ac.il" },
  { icon: "📸", label: "אינסטגרם",      value: "@kivunim_club" },
];

// Days-of-week activity bar (Sun–Sat, 1-indexed like Date.getDay())
const DAYS = [
  { label: "א", active: true },
  { label: "ב", active: true },
  { label: "ג", active: false },
  { label: "ד", active: true },
  { label: "ה", active: true },
  { label: "ו", active: false },
  { label: "ש", active: false },
];

const drawerStyle = (open: boolean): React.CSSProperties => ({
  position: "fixed",
  bottom: 0, left: 0, right: 0,
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
  const [infoOpen, setInfoOpen] = useState(false);
  const [activeActionIndex, setActiveActionIndex] = useState(0);
  const actionPointerStartX = useRef<number | null>(null);
  const didActionSwipe = useRef(false);
  const activeAction = ALL_ACTIONS[activeActionIndex];

  useEffect(() => {
    function openActionsDrawer() {
      setActionsOpen(true);
    }

    window.addEventListener("open-actions-drawer", openActionsDrawer);
    return () => window.removeEventListener("open-actions-drawer", openActionsDrawer);
  }, []);

  function nextAction() {
    setActiveActionIndex((current) => (current + 1) % ALL_ACTIONS.length);
  }

  function prevAction() {
    setActiveActionIndex((current) => (current - 1 + ALL_ACTIONS.length) % ALL_ACTIONS.length);
  }

  function handleActionSwipe(endX: number) {
    if (actionPointerStartX.current === null) return;

    const distance = endX - actionPointerStartX.current;
    actionPointerStartX.current = null;
    if (Math.abs(distance) < 28) return;

    didActionSwipe.current = true;
    if (distance < 0) nextAction();
    else prevAction();
  }

  function handleActionsClick() {
    if (didActionSwipe.current) {
      didActionSwipe.current = false;
      return;
    }

    setActionsOpen(true);
  }

  return (
    <>
      <style>
        {`
          @keyframes actionWidgetIn {
            from {
              opacity: 0;
              transform: translateX(10px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
        `}
      </style>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12 }}>

        {/* ── פעולות ── */}
        <div
          onClick={handleActionsClick}
          onPointerDown={(event) => { actionPointerStartX.current = event.clientX; }}
          onPointerUp={(event) => { handleActionSwipe(event.clientX); }}
          role="button"
          style={{
            background: activeAction.bg,
            border: "1px solid #E2E8F0",
            borderRadius: 18,
            boxShadow: "none",
            padding: "14px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            touchAction: "none",
            userSelect: "none",
            position: "relative",
          }}
        >
          <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 14, color: activeAction.color }}>
            פעולות
          </p>

          <div
            key={activeAction.label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              animation: "actionWidgetIn 0.22s ease",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "rgba(255,255,255,0.72)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                boxShadow: "none",
              }}
            >
              {activeAction.emoji}
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-rubik)",
                fontWeight: 800,
                fontSize: 18,
                lineHeight: 1.18,
                color: activeAction.color,
                textAlign: "center",
              }}
            >
              {activeAction.label}
            </p>
          </div>

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            {ALL_ACTIONS.map((a, i) => (
              <span
                key={a.label}
                style={{
                  width: activeActionIndex === i ? 14 : 4,
                  height: 4,
                  borderRadius: 99,
                  background: activeActionIndex === i ? activeAction.color : "rgba(15,23,42,0.18)",
                  transition: "width 0.2s ease, background 0.2s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── מידע ── */}
        <div
          onClick={() => setInfoOpen(true)}
          role="button"
          style={{
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 18,
            boxShadow: "none",
            padding: "14px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            aspectRatio: "1 / 1",
            overflow: "hidden",
          }}
        >
          <p style={{ margin: "0 0 10px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 14, color: "#0F172A" }}>
            מידע
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              flex: 1,
              overflowY: "auto",
              overscrollBehavior: "contain",
              touchAction: "pan-y",
              paddingLeft: 2,
              scrollbarWidth: "none",
            }}
          >
            {INFO_PAGES.map((page) => (
              <button
                key={page.label}
                onClick={(event) => {
                  event.stopPropagation();
                  setInfoOpen(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  border: "1px solid #E2E8F0",
                  borderRadius: 99,
                  background: "#F8FAFC",
                  padding: "8px 10px",
                  cursor: "pointer",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 14, lineHeight: 1 }}>{page.icon}</span>
                <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#0F172A", whiteSpace: "nowrap" }}>
                  {page.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Actions Drawer ── */}
      <div style={backdropStyle(actionsOpen)} onClick={() => setActionsOpen(false)} />
      <div style={drawerStyle(actionsOpen)}>
        <Handle />
        <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 18, color: "#0F172A" }}>
          כל הפעולות
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ALL_ACTIONS.map((a) => (
            <button
              key={a.label}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: a.bg, border: "1px solid #E2E8F0", borderRadius: 12,
                padding: "12px 16px", cursor: "pointer", width: "100%", textAlign: "right",
              }}
            >
              <span style={{ fontSize: 20 }}>{a.emoji}</span>
              <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 15, color: a.color }}>
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Info Drawer ── */}
      <div style={backdropStyle(infoOpen)} onClick={() => setInfoOpen(false)} />
      <div style={drawerStyle(infoOpen)}>
        <Handle />
        <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 18, color: "#0F172A" }}>
          מידע על המועדון
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {INFO_FULL.map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12,
                padding: "13px 16px",
              }}
            >
              <span style={{ fontSize: 20 }}>{r.icon}</span>
              <div>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 12, color: "#94A3B8" }}>
                  {r.label}
                </p>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 15, color: "#0F172A" }}>
                  {r.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* days bar in drawer too */}
        <div style={{ marginTop: 20, padding: "16px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12 }}>
          <p style={{ margin: "0 0 10px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 14, color: "#0F172A" }}>
            ימי פעילות
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            {DAYS.map((d) => (
              <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: "100%", height: 28, borderRadius: 6,
                  background: d.active ? "#1E40AF" : "#EFF6FF",
                }} />
                <span style={{
                  fontFamily: "var(--font-rubik)", fontSize: 11, fontWeight: 700,
                  color: d.active ? "#1E40AF" : "#CBD5E1",
                }}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
