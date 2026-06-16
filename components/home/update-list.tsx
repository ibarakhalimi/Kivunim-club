"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";

type Update = {
  id: string;
  title: string;
  description: string;
  published_at: string;
  author: string;
};

const CARD_COLORS = [
  { bg: "#EFF6FF", accent: "#1E40AF" },
  { bg: "#F0FDF4", accent: "#15803D" },
  { bg: "#FFFBEB", accent: "#B45309" },
  { bg: "#FFF1F2", accent: "#BE123C" },
  { bg: "#F5F3FF", accent: "#6D28D9" },
  { bg: "#ECFDF5", accent: "#059669" },
];

function createTempUpdates(currentTime: string): Update[] {
  const now = new Date(currentTime).getTime();
  return [
    {
      id: "temp-campus-evening",
      title: "ערב סטודנטים במרכז העיר",
      description: "מפגש פתוח לסטודנטים עם מוזיקה, אוכל קל והיכרות עם סטודנטים נוספים מהעיר.",
      published_at: new Date(now).toISOString(),
      author: "צוות כיוונים",
    },
    {
      id: "temp-exam-benefits",
      title: "הטבות חדשות לתקופת מבחנים",
      description: "ריכזנו עבורכם הטבות בקפה, הדפסות וחללי למידה שיעזרו לעבור את התקופה קצת יותר בנוח.",
      published_at: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      author: "צוות כיוונים",
    },
    {
      id: "temp-volunteer-call",
      title: "מחפשים נציגי סטודנטים לפעילות הבאה",
      description: "רוצים לקחת חלק בהפקת אירועים ולייצג את הסטודנטים בעיר? זה הזמן להצטרף לצוות המתנדבים.",
      published_at: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      author: "צוות כיוונים",
    },
  ];
}

function timeAgo(dateStr: string, currentTime: string): string {
  const diff = new Date(currentTime).getTime() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `לפני ${mins} דקות`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `לפני ${hrs} שעות`;
  const days = Math.floor(hrs / 24);
  return `לפני ${days} ימים`;
}

export function UpdateList({ updates, currentTime }: { updates: Update[]; currentTime: string }) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"next" | "prev">("next");
  const [selected, setSelected] = useState<Update | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const displayUpdates = [...updates, ...createTempUpdates(currentTime)];
  const activeUpdate = displayUpdates[activeIndex];
  const firstUpdate = displayUpdates[0];
  const activeColor = CARD_COLORS[activeIndex % CARD_COLORS.length];
  const moreUpdates = Math.max(displayUpdates.length - 1, 0);

  function moveToNext() {
    setSwipeDirection("next");
    setActiveIndex((current) => (current + 1) % displayUpdates.length);
  }

  function moveToPrev() {
    setSwipeDirection("prev");
    setActiveIndex((current) => (current - 1 + displayUpdates.length) % displayUpdates.length);
  }

  function handleSwipeEnd(start: { x: number; y: number } | null, end: { x: number; y: number }) {
    if (start === null) return;

    const distanceX = end.x - start.x;
    const distanceY = end.y - start.y;
    const dominantDistance = Math.abs(distanceY) > Math.abs(distanceX) ? distanceY : distanceX;
    if (Math.abs(dominantDistance) < 36) return;

    didSwipe.current = true;
    if (dominantDistance < 0) moveToNext();
    else moveToPrev();
  }

  function handleCardClick() {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }

    setSelected(activeUpdate);
  }

  useEffect(() => {
    document.body.style.overflow = selected || drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected, drawerOpen]);

  return (
    <>
      <style>
        {`
          @keyframes postCardIn {
            from {
              opacity: 0.72;
              transform: translateX(${swipeDirection === "next" ? "-18px" : "18px"}) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
        `}
      </style>
      <section style={{ width: "calc(50% - 4px)" }}>
        <Link
          href="/updates"
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            background: "#fff",
            border: "1px solid #FEF3C7",
            borderRadius: 22,
            boxShadow: "none",
            padding: 12,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            textAlign: "right",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div
              aria-label="הודעות ועדכונים"
              style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: "#FFFBEB",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#B45309",
              }}
            >
              <Megaphone size={21} strokeWidth={2.1} />
            </div>
            <span
              style={{
                minWidth: 24,
                height: 24,
                borderRadius: "50%",
                background: "#B45309",
                color: "#fff",
                fontFamily: "var(--font-rubik)",
                fontWeight: 800,
                fontSize: 10,
                lineHeight: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {moreUpdates}
            </span>
          </div>

          <div style={{ marginTop: "auto" }}>
            <p suppressHydrationWarning style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#B45309" }}>
              {timeAgo(firstUpdate.published_at, currentTime)}
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 17, lineHeight: 1.22, color: "#0F172A", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
              {firstUpdate.title}
            </p>
          </div>
        </Link>
      </section>

      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} />
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 51,
              background: "#fff",
              borderRadius: "16px 16px 0 0",
              border: "1px solid #E2E8F0",
              borderBottom: "none",
              direction: "rtl",
              maxHeight: "82dvh",
              overflowY: "auto",
              padding: "44px 14px 30px",
            }}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                position: "absolute",
                top: 14,
                left: 16,
                width: 32,
                height: 32,
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                fontSize: 14,
                cursor: "pointer",
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          onPointerDown={(event) => { pointerStart.current = { x: event.clientX, y: event.clientY }; }}
          onPointerUp={(event) => {
            handleSwipeEnd(pointerStart.current, { x: event.clientX, y: event.clientY });
            pointerStart.current = null;
          }}
          style={{
            position: "relative",
            height: 220,
            touchAction: "none",
            userSelect: "none",
          }}
        >
          {[2, 1].map((depth) => {
            const stackIndex = (activeIndex + depth) % displayUpdates.length;
            const stackColor = CARD_COLORS[stackIndex % CARD_COLORS.length].bg;
            return (
              <div
                key={depth}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: depth * 6,
                  left: depth * 6,
                  bottom: 0,
                  height: 214,
                  borderRadius: 14,
                  border: "1px solid #E2E8F0",
                  background: stackColor,
                  boxShadow: "none",
                  transform: `translateY(-${depth * 3}px)`,
                  transformOrigin: "center bottom",
                  opacity: depth === 1 ? 0.82 : 0.58,
                  zIndex: depth,
                  transition: "transform 0.24s ease, background 0.24s ease",
                }}
              />
            );
          })}

          <div
            style={{
              position: "absolute",
              inset: "auto 0 0",
              zIndex: 4,
            }}
          >
            <button
              key={activeUpdate.id}
              onClick={handleCardClick}
              style={{
                width: "100%",
                height: 214,
                borderRadius: 14,
                border: "1px solid #E2E8F0",
                boxShadow: "none",
                background: activeColor.bg,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: 8,
                padding: "22px",
                cursor: "pointer",
                textAlign: "right",
                position: "relative",
                overflow: "hidden",
                animation: "postCardIn 0.24s ease",
              }}
            >
              <span
                suppressHydrationWarning
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 600,
                  fontSize: 13,
                  color: activeColor.accent,
                  opacity: 0.7,
                }}
              >
                {timeAgo(activeUpdate.published_at, currentTime)}
              </span>
              <span
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 800,
                  fontSize: 25,
                  lineHeight: 1.22,
                  color: "#0F172A",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {activeUpdate.title}
              </span>
            </button>
          </div>
        </div>
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            marginTop: 2,
          }}
        >
          {displayUpdates.map((_, i) => (
            <span
              key={i}
              style={{
                width: activeIndex === i ? 18 : 6,
                height: 6,
                borderRadius: 99,
                background: activeIndex === i ? activeColor.accent : "rgba(15,23,42,0.18)",
                transition: "width 0.24s ease, background 0.24s ease",
              }}
            />
          ))}
        </div>
      </div>
          </div>
        </>
      )}

      {/* Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxHeight: "85dvh",
              borderRadius: "16px 16px 0 0",
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderBottom: "none",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: 5 }}>
              <button
                onClick={() => setSelected(null)}
                style={{
                  alignSelf: "flex-start",
                  background: "#F1F5F9",
                  border: "none",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  fontSize: 14,
                  cursor: "pointer",
                  color: "#64748B",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ✕
              </button>
              <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 19, color: "#0F172A" }}>
                {selected.title}
              </h2>
              <p
                suppressHydrationWarning
                style={{ margin: 0, fontSize: 12, color: "#94A3B8", fontFamily: "var(--font-rubik)" }}
              >
                {timeAgo(selected.published_at, currentTime)} · {selected.author}
              </p>
            </div>

            {/* Body */}
            <div style={{ padding: "18px 20px", overflowY: "auto", flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "#334155",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selected.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
