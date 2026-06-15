"use client";

import { useState } from "react";
import type { Tables } from "@/src/types/database";

type Event = Tables<"events">;

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
  const [selected, setSelected] = useState<Event | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  if (events.length === 0) return null;

  const ev = events[0];

  return (
    <>
      <section>
        {events.length > 1 && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button
              onClick={() => setAllOpen(true)}
              style={{
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                borderRadius: 99,
                padding: "3px 12px",
                fontSize: 13,
                fontWeight: 600,
                color: "#1E40AF",
                fontFamily: "var(--font-rubik)",
                cursor: "pointer",
              }}
            >
              + {events.length - 1} נוספים
            </button>
          </div>
        )}

        {/* Featured event card */}
        <div
          onClick={() => setSelected(ev)}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            border: "1px solid #E2E8F0",
            borderRadius: 14,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            overflow: "hidden",
            cursor: "pointer",
            background: "#fff",
            minHeight: 100,
          }}
        >
          {/* Content */}
          <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 5, minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 12, color: "#94A3B8" }}>
              {formatDate(ev.event_date)}{ev.start_hour ? ` · ${ev.start_hour}` : ""}
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 17, lineHeight: 1.25, color: "#0F172A" }}>
              {ev.title}
            </p>
            {ev.location && (
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 13, color: "#64748B" }}>
                📍 {ev.location}
              </p>
            )}
          </div>

          {/* Image */}
          <div
            style={{
              flexShrink: 0,
              width: 90,
              background: "#EFF6FF",
              overflow: "hidden",
            }}
          >
            {ev.image_url ? (
              <img src={ev.image_url} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                📸
              </div>
            )}
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
              {events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => { setAllOpen(false); setSelected(ev); }}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
