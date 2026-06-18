"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
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

const GRID_EXPAND_EVENT = "home-grid-expand";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

const drawerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0, left: 0, right: 0,
  zIndex: 51,
  background: "#252836",
  borderRadius: "26px 26px 0 0",
  border: "1px solid rgba(255,255,255,0.06)",
  borderBottom: "none",
  direction: "rtl",
  maxHeight: "85dvh",
  overflowY: "auto",
};

const closeBtn: React.CSSProperties = {
  position: "absolute", top: 14, left: 16,
  width: 32, height: 32,
  background: "#2F3344",
  border: "none",
  borderRadius: "50%",
  fontSize: 14,
  cursor: "pointer",
  color: "#9CA0AE",
  display: "flex", alignItems: "center", justifyContent: "center",
};

export function EventsSection({ events }: { events: Event[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eventPointerStartX = useRef<number | null>(null);
  const didEventSwipe = useRef(false);
  const [selected, setSelected] = useState<Event | null>(null);
  const [allOpen, setAllOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
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

    setExpanded(true);
    window.dispatchEvent(new CustomEvent(GRID_EXPAND_EVENT, { detail: "events" }));
  }

  useEffect(() => {
    const handleExpand = (event: Event) => {
      const target = (event as CustomEvent<string>).detail;
      setExpanded(true);
      if (target === "events") {
        requestAnimationFrame(() => {
          sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    window.addEventListener(GRID_EXPAND_EVENT, handleExpand);
    return () => window.removeEventListener(GRID_EXPAND_EVENT, handleExpand);
  }, []);

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
      <section ref={sectionRef} style={{ width: expanded ? "100%" : "calc(50% - 5.5px)", flex: expanded ? "0 0 100%" : "0 0 calc(50% - 5.5px)", minWidth: 0, boxSizing: "border-box", transition: "flex-basis 0.24s ease, width 0.24s ease", scrollMarginTop: 14 }}>
        <div
          style={{
            width: "100%",
            aspectRatio: expanded ? "auto" : "1 / 1",
            background: expanded ? "transparent" : "#252836",
            border: "none",
            borderRadius: 22,
            boxShadow: "none",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            textAlign: "right",
            boxSizing: "border-box",
          }}
        >
          {!expanded ? (
            <button
              key={ev.id}
              type="button"
              onClick={handleEventClick}
              onPointerDown={(event) => { eventPointerStartX.current = event.clientX; }}
              onPointerUp={(event) => { handleEventSwipe(event.clientX); }}
              style={{
                border: "none",
                borderRadius: 22,
                boxShadow: "none",
                overflow: "hidden",
                aspectRatio: "1 / 1",
                cursor: "pointer",
                background: "transparent",
                touchAction: "pan-y",
                userSelect: "none",
                animation: "eventCardIn 0.22s ease",
                textDecoration: "none",
                display: "block",
                width: "100%",
                padding: 0,
                font: "inherit",
                textAlign: "right",
              }}
            >
              <div style={{ padding: 12, display: "flex", flexDirection: "column", height: "100%", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                  <div
                    aria-label="אירוע קרוב"
                    style={{
                      width: "auto",
                      height: "auto",
                      borderRadius: 0,
                      background: "rgba(17,32,58,0.72)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FF2E9A",
                    }}
                  >
                    <CalendarDays size={19} strokeWidth={2.1} />
                  </div>
                  <span
                    style={{
                      minWidth: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: "none",
                      background: "#111522",
                      color: "#FF2E9A",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontFamily: "var(--font-rubik)",
                      fontWeight: 800,
                      fontSize: 10,
                      lineHeight: 1,
                    }}
                  >
                    {displayEvents.length}
                  </span>
                </div>
                <div style={{ marginTop: "auto" }}>
                  <p style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#FF2E9A" }}>
                    {formatDate(ev.event_date)}
                  </p>
                  <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 15, lineHeight: 1.22, color: "#FFFFFF", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {ev.title}
                  </p>
                </div>
              </div>
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingInline: 2 }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 14,
                    background: "rgba(255, 46, 154, 0.14)",
                    color: "#FF2E9A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CalendarDays size={22} strokeWidth={2.2} />
                </div>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, lineHeight: 1.1, color: "#FFFFFF" }}>
                  אירועים
                </p>
              </div>
              <div style={{ background: "#252836", borderRadius: 22, padding: 18, boxSizing: "border-box" }}>
              {displayEvents.map((eventItem, index) => (
                <article
                  key={eventItem.id}
                  style={{
                    padding: "13px 0",
                    borderBottom: index === displayEvents.length - 1 ? "none" : "1px solid rgba(255, 46, 154, 0.16)",
                  }}
                >
                  <p style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#FF2E9A" }}>
                    {formatDate(eventItem.event_date)}
                  </p>
                  <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 16, lineHeight: 1.25, color: "#FFFFFF" }}>
                    {eventItem.title}
                  </h3>
                  {eventItem.location && (
                    <p style={{ margin: "0 0 6px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#9CA0AE" }}>
                      {eventItem.location}
                    </p>
                  )}
                  {eventItem.description && (
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 13, lineHeight: 1.6, color: "#C7CAD6" }}>
                      {eventItem.description}
                    </p>
                  )}
                </article>
              ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }} />
          <div style={drawerStyle}>
            <div style={{ width: "100%", height: 180, background: "rgba(255,46,154,0.12)", position: "relative", flexShrink: 0 }}>
              {selected.image_url ? (
                <img src={selected.image_url} alt={selected.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>📸</div>
              )}
              <button onClick={() => setSelected(null)} style={closeBtn}>✕</button>
            </div>

            <div style={{ padding: "20px 20px 40px" }}>
              <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 13, color: "#9CA0AE" }}>
                {formatDate(selected.event_date)}{selected.start_hour ? ` · ${selected.start_hour}` : ""}
              </p>
              <p style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: "#FFFFFF" }}>
                {selected.title}
              </p>
              {selected.location && (
                <p style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 14, color: "#9CA0AE" }}>
                  📍 {selected.location}
                </p>
              )}
              {selected.description && (
                <p style={{ margin: "0 0 20px", fontFamily: "var(--font-rubik)", fontWeight: 400, fontSize: 15, lineHeight: 1.75, color: "#9CA0AE", whiteSpace: "pre-wrap" }}>
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
                    background: "#FF2E9A",
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
                    background: "#2F3344",
                    color: "#5A5E6B",
                    border: "1px solid rgba(255,255,255,0.06)",
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

      {allOpen && (
        <>
          <div onClick={() => setAllOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }} />
          <div style={{ ...drawerStyle, padding: "24px 20px 48px" }}>
            <button onClick={() => setAllOpen(false)} style={closeBtn}>✕</button>

            <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 18, color: "#FFFFFF" }}>
              כל האירועים
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {displayEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => { setAllOpen(false); setSelected(ev); }}
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    boxShadow: "none",
                    background: "#2F3344",
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                  }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 8, background: "rgba(255,46,154,0.12)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {ev.image_url ? (
                      <img src={ev.image_url} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : "📅"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 15, lineHeight: 1.3, color: "#FFFFFF" }}>
                      {ev.title}
                    </p>
                    <p style={{ margin: "3px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 12, color: "#9CA0AE" }}>
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
