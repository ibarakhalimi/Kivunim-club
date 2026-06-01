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

export function EventsSection({ events }: { events: Event[] }) {
  const [selected, setSelected] = useState<Event | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  if (events.length === 0) return null;

  const ev = events[0];

  return (
    <>
      <section>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 20, color: "#111" }}>
            אירועים קרובים
          </h2>
          {events.length > 1 && (
            <button
              onClick={() => setAllOpen(true)}
              style={{
                background: "#B8A7E8",
                border: "2px solid #000",
                borderRadius: 99,
                padding: "3px 12px",
                fontSize: 13,
                fontWeight: 700,
                color: "#111",
                fontFamily: "var(--font-rubik)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              + {events.length - 1} אירועים נוספים
            </button>
          )}
        </div>

        {/* Card — padding wrapper for shadow room */}
        <div style={{ padding: "4px 6px 6px 0" }}>
          <div
            onClick={() => setSelected(ev)}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              border: "3px solid #000",
              borderRadius: 16,
              boxShadow: "5px 5px 0px #000",
              overflow: "hidden",
              cursor: "pointer",
              background: "#fff",
              minHeight: 110,
            }}
          >
            {/* Content — right side (RTL start) */}
            <div style={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 12, color: "#888" }}>
                {formatDate(ev.event_date)}{ev.start_hour ? ` · ${ev.start_hour}` : ""}
              </p>
              <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 18, lineHeight: 1.25, color: "#111" }}>
                {ev.title}
              </p>
              {ev.location && (
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 13, color: "#666" }}>
                  📍 {ev.location}
                </p>
              )}
            </div>

            {/* Image — left side (RTL end) */}
            <div
              style={{
                flexShrink: 0,
                width: 100,
                background: "#f0f0f0",
                borderRight: "3px solid #000",
                overflow: "hidden",
              }}
            >
              {ev.image_url ? (
                <img src={ev.image_url} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                  📸
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50 }} />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 51,
              background: "#fff",
              borderRadius: "20px 20px 0 0",
              border: "3px solid #000",
              borderBottom: "none",
              boxShadow: "0 -5px 0 #000",
              direction: "rtl",
              maxHeight: "85dvh",
              overflowY: "auto",
            }}
          >
            {/* Image */}
            <div style={{ width: "100%", height: 200, background: "#f0f0f0", borderBottom: "3px solid #000", position: "relative", flexShrink: 0 }}>
              {selected.image_url ? (
                <img src={selected.image_url} alt={selected.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>📸</div>
              )}
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: "absolute", top: 12, left: 12,
                  width: 34, height: 34,
                  background: "#fff",
                  border: "2.5px solid #000",
                  borderRadius: "50%",
                  boxShadow: "2px 2px 0 #000",
                  fontSize: 16,
                  cursor: "pointer",
                  fontWeight: 900,
                }}
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div style={{ padding: "20px 20px 40px" }}>
              <p style={{ margin: "0 0 6px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 13, color: "#888" }}>
                {formatDate(selected.event_date)}{selected.start_hour ? ` · ${selected.start_hour}` : ""}
              </p>
              <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 24, lineHeight: 1.2, color: "#111" }}>
                {selected.title}
              </p>
              {selected.location && (
                <p style={{ margin: "0 0 16px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 14, color: "#555" }}>
                  📍 {selected.location}
                </p>
              )}
              {selected.description && (
                <p style={{ margin: "0 0 24px", fontFamily: "var(--font-rubik)", fontWeight: 400, fontSize: 15, lineHeight: 1.75, color: "#333", whiteSpace: "pre-wrap" }}>
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
                    padding: "15px 0",
                    background: "#111",
                    color: "#fff",
                    border: "3px solid #000",
                    borderRadius: 12,
                    boxShadow: "4px 4px 0 #000",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 900,
                    fontSize: 17,
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
                    padding: "15px 0",
                    background: "#eee",
                    color: "#aaa",
                    border: "3px solid #ccc",
                    borderRadius: 12,
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 700,
                    fontSize: 17,
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

      {/* All events off-canvas */}
      {allOpen && (
        <>
          <div onClick={() => setAllOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50 }} />
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 51,
              background: "#fff",
              borderRadius: "20px 20px 0 0",
              border: "3px solid #000",
              borderBottom: "none",
              boxShadow: "0 -5px 0 #000",
              direction: "rtl",
              maxHeight: "85dvh",
              overflowY: "auto",
              padding: "24px 20px 48px",
            }}
          >
            <button
              onClick={() => setAllOpen(false)}
              style={{
                position: "absolute", top: 14, left: 16,
                width: 34, height: 34,
                background: "#fff",
                border: "2.5px solid #000",
                borderRadius: "50%",
                boxShadow: "2px 2px 0 #000",
                fontSize: 16,
                cursor: "pointer",
                fontWeight: 900,
              }}
            >
              ✕
            </button>

            <p style={{ margin: "0 0 18px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 20, color: "#111" }}>
              כל האירועים
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "4px 6px 6px 0" }}>
              {events.map((ev, i) => {
                const GRADIENTS = [
                  "linear-gradient(135deg, #B8A7E8, #7DC8E8)",
                  "linear-gradient(135deg, #EEC84A, #F4A07A)",
                  "linear-gradient(135deg, #A8D464, #7DC8E8)",
                  "linear-gradient(135deg, #F4A07A, #F4C2D4)",
                  "linear-gradient(135deg, #7DC8E8, #B8A7E8)",
                ];
                return (
                  <div
                    key={ev.id}
                    onClick={() => { setAllOpen(false); setSelected(ev); }}
                    style={{
                      border: "3px solid #000",
                      borderRadius: 16,
                      boxShadow: "5px 5px 0 #000",
                      background: "#fff",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    {/* Image / gradient top */}
                    <div
                      style={{
                        width: "100%",
                        height: 140,
                        position: "relative",
                        background: ev.image_url ? undefined : GRADIENTS[i % GRADIENTS.length],
                        borderBottom: "3px solid #000",
                        overflow: "hidden",
                      }}
                    >
                      {ev.image_url && (
                        <img src={ev.image_url} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                      {/* Date chip */}
                      <span
                        style={{
                          position: "absolute",
                          bottom: 10,
                          right: 10,
                          background: "#fff",
                          border: "2px solid #000",
                          borderRadius: 99,
                          padding: "3px 10px",
                          fontFamily: "var(--font-rubik)",
                          fontWeight: 700,
                          fontSize: 12,
                          color: "#111",
                        }}
                      >
                        {formatDate(ev.event_date)}{ev.start_hour ? ` · ${ev.start_hour}` : ""}
                      </span>
                    </div>

                    {/* Text */}
                    <div style={{ padding: "12px 16px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
                      <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 16, lineHeight: 1.2, color: "#111" }}>
                        {ev.title}
                      </p>
                      {ev.location && (
                        <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 12, color: "#666" }}>
                          📍 {ev.location}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
