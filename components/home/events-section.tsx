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

export function EventsSection({ events }: { events: Event[] }) {
  const [selected, setSelected] = useState<Event | null>(null);

  if (events.length === 0) return null;

  return (
    <>
      <section style={{ padding: "4px 16px 8px" }}>
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

        {/* Cards */}
        <div
          className="kv-no-scrollbar"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 14,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {events.map((ev) => (
            <div
              key={ev.id}
              className="kv-tap"
              onClick={() => setSelected(ev)}
              style={{
                flexShrink: 0,
                width: 260,
                border: "2px solid #0F0F0F",
                borderRadius: 0,
                boxShadow: "4px 4px 0 0 #0F0F0F",
                overflow: "hidden",
                cursor: "pointer",
                background: "var(--color-bg-card)",
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: "100%",
                  height: 200,
                  background: ev.image_url ? undefined : "#E8E8E8",
                  borderBottom: "2px solid #0F0F0F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 72,
                  overflow: "hidden",
                }}
              >
                {ev.image_url ? (
                  <img
                    src={ev.image_url}
                    alt={ev.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : null}
              </div>

              {/* Content */}
              <div style={{ position: "relative", padding: "14px 16px 40px" }}>
                <p
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-heebo)",
                  }}
                >
                  {formatDate(ev.event_date)}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 800,
                    fontSize: 19,
                    lineHeight: 1.25,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {ev.title}
                </p>
              </div>
            </div>
          ))}
        </div>
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
              background: "#fff",
              border: "2px solid #0F0F0F",
              borderBottom: "none",
              borderRadius: 0,
              boxShadow: "0 -4px 0 0 #0F0F0F",
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
                background: selected.image_url ? undefined : "#E8E8E8",
                borderBottom: "2px solid #0F0F0F",
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
                  background: "#0F0F0F",
                  color: "#fff",
                  border: "none",
                  borderRadius: 0,
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
                    padding: "14px 0",
                    background: "#0F0F0F",
                    color: "#fff",
                    border: "2px solid #0F0F0F",
                    borderRadius: 0,
                    boxShadow: "3px 3px 0 0 #555",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 700,
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
                    padding: "14px 0",
                    background: "#ccc",
                    color: "#888",
                    border: "2px solid #ccc",
                    borderRadius: 0,
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
