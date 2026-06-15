"use client";

import { useRef, useState, useEffect } from "react";

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

const TEMP_UPDATES: Update[] = [
  {
    id: "temp-campus-evening",
    title: "ערב סטודנטים במרכז העיר",
    description: "מפגש פתוח לסטודנטים עם מוזיקה, אוכל קל והיכרות עם סטודנטים נוספים מהעיר.",
    published_at: new Date().toISOString(),
    author: "צוות כיוונים",
  },
  {
    id: "temp-exam-benefits",
    title: "הטבות חדשות לתקופת מבחנים",
    description: "ריכזנו עבורכם הטבות בקפה, הדפסות וחללי למידה שיעזרו לעבור את התקופה קצת יותר בנוח.",
    published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    author: "צוות כיוונים",
  },
  {
    id: "temp-volunteer-call",
    title: "מחפשים נציגי סטודנטים לפעילות הבאה",
    description: "רוצים לקחת חלק בהפקת אירועים ולייצג את הסטודנטים בעיר? זה הזמן להצטרף לצוות המתנדבים.",
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    author: "צוות כיוונים",
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `לפני ${mins} דקות`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `לפני ${hrs} שעות`;
  const days = Math.floor(hrs / 24);
  return `לפני ${days} ימים`;
}

export function UpdateList({ updates }: { updates: Update[] }) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"next" | "prev">("next");
  const [selected, setSelected] = useState<Update | null>(null);
  const displayUpdates = [...updates, ...TEMP_UPDATES];
  const activeUpdate = displayUpdates[activeIndex];
  const activeColor = CARD_COLORS[activeIndex % CARD_COLORS.length];

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
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

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
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 18,
                  left: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {displayUpdates.map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: 6,
                      height: activeIndex === i ? 18 : 6,
                      borderRadius: 99,
                      background: activeIndex === i ? activeColor.accent : "rgba(15,23,42,0.18)",
                      transition: "height 0.24s ease, background 0.24s ease",
                    }}
                  />
                ))}
              </span>

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
                {timeAgo(activeUpdate.published_at)}
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
      </div>

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
                {timeAgo(selected.published_at)} · {selected.author}
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
