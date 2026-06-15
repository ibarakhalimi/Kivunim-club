"use client";

import { useRef, useState } from "react";
import type { Tables } from "@/src/types/database";

type Event = Tables<"events">;

const TEMP_EVENTS: Event[] = [
  {
    id: "temp-event-study-night",
    title: "ליל למידה פתוח",
    description: "מרחב למידה שקט עם קפה, נשנושים וחדרים לעבודה בקבוצות לקראת תקופת המבחנים.",
    event_date: "2026-06-18",
    start_hour: "18:00",
    location: "מרכז כיוונים, קומה 2",
    registration_url: null,
    image_url: null,
    is_featured: true,
    created_at: "2026-06-15T00:00:00.000Z",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTabDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString("he-IL", { day: "numeric" }),
    month: date.toLocaleDateString("he-IL", { month: "short" }),
  };
}

const drawerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0, left: 0, right: 0,
  zIndex: 51,
  background: "#fff",
  borderRadius: "16px 16px 0 0",
  border: "1px solid #E2E8F0",
  borderBottom: "none",
  direction: "rtl",
  maxHeight: "85dvh",
  overflowY: "auto",
};

const closeBtn: React.CSSProperties = {
  position: "absolute", top: 14, left: 16,
  width: 32, height: 32,
  background: "#F1F5F9",
  border: "none",
  borderRadius: "50%",
  fontSize: 14,
  cursor: "pointer",
  color: "#64748B",
  display: "flex", alignItems: "center", justifyContent: "center",
};

export function EventsSection({ events }: { events: Event[] }) {
  const eventPointerStartX = useRef<number | null>(null);
  const didEventSwipe = useRef(false);
  const [selected, setSelected] = useState<Event | null>(null);
  const [allOpen, setAllOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"next" | "prev">("next");

  const displayEvents = [...events, ...TEMP_EVENTS];
  const ev = displayEvents[activeIndex] ?? displayEvents[0];

  function showNextEvent() {
    setSwipeDirection("next");
    setActiveIndex((current) => (current + 1) % displayEvents.length);
  }

  function showPrevEvent() {
    setSwipeDirection("prev");
    setActiveIndex((current) => (current - 1 + displayEvents.length) % displayEvents.length);
  }

  function handleEventSwipe(endX: number) {
    if (eventPointerStartX.current === null) return;

    const distance = endX - eventPointerStartX.current;
    eventPointerStartX.current = null;
    if (Math.abs(distance) < 36) return;

    didEventSwipe.current = true;
    if (distance > 0) showNextEvent();
    else showPrevEvent();
  }

  function handleEventClick() {
    if (didEventSwipe.current) {
      didEventSwipe.current = false;
      return;
    }

    setSelected(ev);
  }

  return (
    <>
      <style>
        {`
          @keyframes eventCardIn {
            from {
              opacity: 0.72;
              transform: translateX(${swipeDirection === "next" ? "-14px" : "14px"}) scale(0.985);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
        `}
      </style>
      <section>
        <div
          style={{
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 18,
            boxShadow: "none",
            padding: 14,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "stretch", gap: 10 }}>
            <div
              style={{
                width: 58,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                overflowY: "auto",
                maxHeight: 278,
                scrollbarWidth: "none",
              }}
            >
              {displayEvents.map((event, i) => {
                const active = i === activeIndex;
                const tabDate = formatTabDate(event.event_date);
                return (
                  <button
                    key={event.id}
                    onClick={() => setActiveIndex(i)}
                    style={{
                      flexShrink: 0,
                      border: `1px solid ${active ? "#BFDBFE" : "#E2E8F0"}`,
                      borderRadius: 14,
                      background: active ? "#EFF6FF" : "#F8FAFC",
                      color: active ? "#1E40AF" : "#64748B",
                      padding: "8px 7px",
                      minHeight: 62,
                      fontFamily: "var(--font-rubik)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <span style={{ fontWeight: 800, fontSize: 16, lineHeight: 1 }}>
                      {tabDate.day}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 10, lineHeight: 1.1 }}>
                      {tabDate.month}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              key={ev.id}
              onClick={handleEventClick}
              onPointerDown={(event) => { eventPointerStartX.current = event.clientX; }}
              onPointerUp={(event) => { handleEventSwipe(event.clientX); }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                overflow: "hidden",
                cursor: "pointer",
                background: "#F8FAFC",
                touchAction: "pan-y",
                userSelect: "none",
                animation: "eventCardIn 0.22s ease",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  height: 172,
                  background: "#EFF6FF",
                  overflow: "hidden",
                }}
              >
                {ev.image_url ? (
                  <img src={ev.image_url} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38 }}>
                    📅
                  </div>
                )}
              </div>

              <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 12, color: "#1E40AF" }}>
                  {formatDate(ev.event_date)}{ev.start_hour ? ` · ${ev.start_hour}` : ""}
                </p>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 18, lineHeight: 1.22, color: "#0F172A" }}>
                  {ev.title}
                </p>
                {ev.location && (
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 12, color: "#64748B" }}>
                    📍 {ev.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event detail drawer */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} />
          <div style={drawerStyle}>
            <div style={{ width: "100%", height: 180, background: "#EFF6FF", position: "relative", flexShrink: 0 }}>
              {selected.image_url ? (
                <img src={selected.image_url} alt={selected.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>📸</div>
              )}
              <button onClick={() => setSelected(null)} style={closeBtn}>✕</button>
            </div>

            <div style={{ padding: "20px 20px 40px" }}>
              <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 13, color: "#94A3B8" }}>
                {formatDate(selected.event_date)}{selected.start_hour ? ` · ${selected.start_hour}` : ""}
              </p>
              <p style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: "#0F172A" }}>
                {selected.title}
              </p>
              {selected.location && (
                <p style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 14, color: "#64748B" }}>
                  📍 {selected.location}
                </p>
              )}
              {selected.description && (
                <p style={{ margin: "0 0 20px", fontFamily: "var(--font-rubik)", fontWeight: 400, fontSize: 15, lineHeight: 1.75, color: "#334155", whiteSpace: "pre-wrap" }}>
                  {selected.description}
                </p>
              )}

              {selected.registration_url ? (
                <a
                  href={selected.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "14px 0",
                    background: "#1E40AF",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 700,
                    fontSize: 16,
                    textDecoration: "none",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  הרשמה לאירוע
                </a>
              ) : (
                <button
                  disabled
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    background: "#F1F5F9",
                    color: "#94A3B8",
                    border: "1px solid #E2E8F0",
                    borderRadius: 10,
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "not-allowed",
                  }}
                >
                  הרשמה לאירוע
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* All events drawer */}
      {allOpen && (
        <>
          <div onClick={() => setAllOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} />
          <div style={{ ...drawerStyle, padding: "24px 20px 48px" }}>
            <button onClick={() => setAllOpen(false)} style={closeBtn}>✕</button>

            <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 18, color: "#0F172A" }}>
              כל האירועים
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {displayEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => { setAllOpen(false); setSelected(ev); }}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    boxShadow: "none",
                    background: "#fff",
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                  }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 8, background: "#EFF6FF", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {ev.image_url ? (
                      <img src={ev.image_url} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : "📅"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 15, lineHeight: 1.3, color: "#0F172A" }}>
                      {ev.title}
                    </p>
                    <p style={{ margin: "3px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 12, color: "#94A3B8" }}>
                      {formatDate(ev.event_date)}{ev.start_hour ? ` · ${ev.start_hour}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
