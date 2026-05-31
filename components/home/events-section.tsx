"use client";

import { useState } from "react";
import type { Tables } from "@/src/types/database";

type Event = Tables<"events">;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateBadge(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("he-IL", { day: "numeric" }),
    month: d.toLocaleDateString("he-IL", { month: "short" }),
    weekday: d.toLocaleDateString("he-IL", { weekday: "short" }),
  };
}

export function EventsSection({ events }: { events: Event[] }) {
  const [selected, setSelected] = useState<Event | null>(null);

  if (events.length === 0) return null;

  return (
    <>
      <section>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
            paddingInline: 2,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-rubik)",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.018em",
              color: "var(--color-text-primary)",
            }}
          >
            אירועים קרובים
          </h2>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--color-accent-secondary)",
            }}
          >
            כל האירועים ←
          </span>
        </div>

        {/* Single horizontal card */}
        {(() => {
          const ev = events[0];
          const badge = formatDateBadge(ev.event_date);
          return (
            <div
              className="kv-tap"
              onClick={() => setSelected(ev)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                border: "1.5px solid rgba(255,255,255,0.6)",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                overflow: "hidden",
                cursor: "pointer",
                background: "rgba(255,255,255,0.8)",
                minHeight: 100,
              }}
            >
              {/* Date badge — right side (RTL start) */}
              <div
                style={{
                  flexShrink: 0,
                  width: 72,
                  background: "var(--color-accent-primary)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  padding: "12px 0",
                }}
              >
                <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 11, color: "rgba(255,255,255,0.8)", letterSpacing: "0.04em" }}>
                  {badge.weekday}
                </span>
                <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 30, color: "#fff", lineHeight: 1 }}>
                  {badge.day}
                </span>
                <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
                  {badge.month}
                </span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, minWidth: 0 }}>
                <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 17, lineHeight: 1.2, color: "var(--color-text-primary)" }}>
                  {ev.title}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {ev.start_hour && (
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-muted)", fontFamily: "var(--font-rubik)" }}>
                      🕐 {ev.start_hour}
                    </span>
                  )}
                  {ev.location && (
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-muted)", fontFamily: "var(--font-rubik)" }}>
                      📍 {ev.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Image — left side (RTL end) */}
              {ev.image_url && (
                <div style={{ flexShrink: 0, width: 90, overflow: "hidden", borderRight: "1px solid rgba(0,0,0,0.05)" }}>
                  <img src={ev.image_url} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>
          );
        })()}
      </section>

      {/* Off-canvas drawer */}
      {selected && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelected(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 50,
            }}
          />

          {/* Drawer */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 51,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              border: "1.5px solid rgba(255,255,255,0.7)",
              borderBottom: "none",
              borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.10)",
              direction: "rtl",
              maxHeight: "85dvh",
              overflowY: "auto",
            }}
          >
            {/* Image */}
            <div
              style={{
                width: "100%",
                height: 220,
                background: selected.image_url ? undefined : "rgba(0,0,0,0.06)",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 96,
                flexShrink: 0,
                position: "relative",
              }}
            >
              {selected.image_url ? (
                <img
                  src={selected.image_url}
                  alt={selected.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}

              <button
                onClick={() => setSelected(null)}
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  width: 34,
                  height: 34,
                  background: "rgba(255,255,255,0.85)",
                  color: "var(--color-text-primary)",
                  border: "1.5px solid rgba(255,255,255,0.6)",
                  borderRadius: 999,
                  backdropFilter: "blur(8px)",
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div style={{ padding: "20px 20px 32px" }}>
              <p
                style={{
                  margin: "0 0 14px",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 800,
                  fontSize: 24,
                  lineHeight: 1.2,
                  color: "var(--color-text-primary)",
                }}
              >
                {selected.title}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 17 }}>📅</span>
                  <span style={metaStyle}>{formatDate(selected.event_date)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 17 }}>🕐</span>
                  <span style={metaStyle}>{selected.start_hour}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 17 }}>📍</span>
                  <span style={metaStyle}>{selected.location}</span>
                </div>
              </div>

              <p
                style={{
                  margin: "0 0 24px",
                  fontFamily: "var(--font-heebo)",
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "var(--color-text-secondary)",
                }}
              >
                {selected.description}
              </p>

              {selected.registration_url ? (
                <a
                  href={selected.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "15px 0",
                    background: "var(--color-accent-primary)",
                    color: "#fff",
                    border: "2px solid var(--color-accent-primary)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "none",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 800,
                    fontSize: 17,
                    cursor: "pointer",
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
                    background: "rgba(0,0,0,0.08)",
                    color: "rgba(0,0,0,0.35)",
                    border: "1.5px solid rgba(0,0,0,0.08)",
                    borderRadius: "var(--radius-md)",
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
    </>
  );
}

const metaStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: "var(--color-text-secondary)",
  fontFamily: "var(--font-heebo)",
};
