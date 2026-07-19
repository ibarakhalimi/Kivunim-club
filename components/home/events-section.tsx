"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import type { Tables } from "@/src/types/database";

type ClubEvent = Tables<"events">;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function EventsSection({ events }: { events: ClubEvent[] }) {
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const eventItem = events[0];

  useEffect(() => {
    document.body.style.overflow = selectedEvent ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedEvent]);

  if (!eventItem) {
    return (
      <section style={{ width: "100%", gridColumn: "1 / -1", minWidth: 0, boxSizing: "border-box" }}>
        <article
          style={{
            width: "100%",
            minHeight: 116,
            border: "none",
            borderRadius: "var(--shape-radius-5xl)",
            background: "var(--color-surface)",
            padding: 12,
            color: "var(--color-ink)",
            textAlign: "right",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "var(--shape-radius-2xl)",
              background: "color-mix(in srgb, var(--color-brand) 14%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-brand) 22%, transparent)",
              color: "var(--color-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarDays size={22} strokeWidth={2.2} />
          </div>
          <div>
            <p style={{ margin: "0 0 5px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-xs)", color: "var(--color-brand)" }}>
              אירועים
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-lg)", lineHeight: 1.22, color: "var(--color-ink)" }}>
              אין אירועים להצגה כרגע
            </p>
          </div>
        </article>
      </section>
    );
  }

  const selectedTimeRange = selectedEvent
    ? selectedEvent.end_hour ? `${selectedEvent.start_hour}-${selectedEvent.end_hour}` : selectedEvent.start_hour
    : "";
  const selectedCostLabel = selectedEvent?.is_paid && selectedEvent.price_amount !== null ? `₪${selectedEvent.price_amount}` : "ללא עלות";

  return (
    <>
    <section style={{ width: "100%", gridColumn: "1 / -1", minWidth: 0, boxSizing: "border-box" }}>
      <h2 style={{ margin: "0 2px 12px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-xl)", lineHeight: 1.1, color: "var(--color-ink)" }}>
        אירוע קרוב
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {events.map((item) => {
          const timeRange = item.end_hour ? `${item.start_hour}-${item.end_hour}` : item.start_hour;
          const eventMeta = [item.location, timeRange].filter(Boolean).join(" · ");
          const costLabel = item.is_paid && item.price_amount !== null ? `₪${item.price_amount}` : "ללא עלות";
          const costColor = item.is_paid ? "var(--color-brand)" : "var(--color-neutral-200)";
          return (
      <button
        key={item.id}
        type="button"
        onClick={() => setSelectedEvent(item)}
        style={{
          width: "100%",
          background: "var(--color-surface)",
          border: "none",
          borderRadius: "var(--shape-radius-5xl)",
          boxShadow: "none",
          padding: 12,
          display: "flex",
          flexDirection: "row",
          gap: 12,
          direction: "ltr",
          alignItems: "stretch",
          overflow: "hidden",
          textAlign: "right",
          boxSizing: "border-box",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 142,
            minHeight: 118,
            alignSelf: "stretch",
            flexShrink: 0,
            borderRadius: "var(--shape-radius-3xl)",
            background: "color-mix(in srgb, var(--color-brand) 12%, transparent)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-brand)",
            position: "relative",
          }}
        >
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <CalendarDays size={38} strokeWidth={2} />
          )}
        </div>

        <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", direction: "rtl", paddingBlock: 2, boxSizing: "border-box" }}>
          <p style={{ margin: "0 0 4px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-sm)", lineHeight: 1.3, color: "var(--color-text-disabled)" }}>
            {formatDate(item.event_date)}
          </p>
          <h3 style={{ margin: "0 0 7px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-2xl)", lineHeight: 1.2, color: "var(--color-ink)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.title}
          </h3>
          {eventMeta && (
            <p style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-sm)", lineHeight: 1.3, color: "var(--color-text-disabled)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
              {eventMeta}
            </p>
          )}
          <p style={{ margin: "7px 0 0", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-sm)", lineHeight: 1.2, color: costColor }}>
            {costLabel}
          </p>
        </div>
      </button>
          );
        })}
      </div>
    </section>
    {selectedEvent && (
      <div
        onClick={() => setSelectedEvent(null)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "color-mix(in srgb, var(--color-overlay) 58%, transparent)",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          style={{
            width: "100%",
            maxHeight: "86dvh",
            borderRadius: "var(--shape-radius-sheet)",
            background: "var(--color-surface)",
            border: "1px solid color-mix(in srgb, var(--color-surface-raised) 06%, transparent)",
            borderBottom: "none",
            overflow: "hidden",
            direction: "rtl",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 0 18px" }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "1.8 / 1",
                borderRadius: "var(--shape-radius-sheet)",
                background: "color-mix(in srgb, var(--color-brand) 12%, transparent)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-brand)",
                marginBottom: 22,
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                aria-label="סגור"
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  zIndex: 2,
                  width: 36,
                  height: 36,
                  borderRadius: "var(--shape-radius-circle)",
                  border: "1px solid color-mix(in srgb, var(--color-surface-raised) 45%, transparent)",
                  background: "color-mix(in srgb, var(--color-ink) 38%, transparent)",
                  color: "var(--color-surface-raised)",
                  fontSize: "var(--font-size-3xl)",
                  lineHeight: 1,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                ×
              </button>
              {selectedEvent.image_url ? (
                <img src={selectedEvent.image_url} alt={selectedEvent.title} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
              ) : (
                <CalendarDays size={42} strokeWidth={2} />
              )}
            </div>

            <div style={{ padding: "0 16px" }}>
              <p style={{ margin: "0 0 8px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-md)", lineHeight: 1.35, color: "var(--color-brand)" }}>
                {formatDate(selectedEvent.event_date)}
                {selectedTimeRange ? ` · ${selectedTimeRange}` : ""}
              </p>
              <h2 style={{ margin: "0 0 10px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-4xl)", lineHeight: 1.12, color: "var(--color-ink)" }}>
                {selectedEvent.title}
              </h2>
              {selectedEvent.location && (
                <p style={{ margin: "0 0 10px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-base)", lineHeight: 1.45, color: "var(--color-text-secondary)" }}>
                  {selectedEvent.location}
                </p>
              )}
              <p style={{ margin: "0 0 14px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-lg)", lineHeight: 1.3, color: selectedEvent.is_paid ? "var(--color-brand)" : "var(--color-ink)" }}>
                {selectedCostLabel}
              </p>

              {selectedEvent.description && (
                <div
                  dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
                  style={{ margin: "0 0 18px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-lg)", lineHeight: 1.75, color: "var(--color-neutral-300)" }}
                />
              )}
            </div>
          </div>
          <div
            style={{
              flexShrink: 0,
              padding: "12px 16px 22px",
              background: "var(--color-surface)",
              borderTop: "1px solid color-mix(in srgb, var(--color-ink) 08%, transparent)",
            }}
          >
            {selectedEvent.registration_url ? (
              <a
                href={selectedEvent.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 50,
                  borderRadius: "var(--shape-radius-2xl)",
                  background: "var(--color-brand)",
                  color: "var(--color-surface-raised)",
                  fontFamily: "var(--font-family-sans)",
                  fontWeight: "var(--font-weight-black)",
                  fontSize: "var(--font-size-lg)",
                  lineHeight: 1,
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                הרשמה לאירוע
              </a>
            ) : (
              <button
                type="button"
                disabled
                style={{
                  width: "100%",
                  minHeight: 50,
                  borderRadius: "var(--shape-radius-2xl)",
                  border: "none",
                  background: "var(--color-neutral-deep)",
                  color: "var(--color-neutral-700)",
                  fontFamily: "var(--font-family-sans)",
                  fontWeight: "var(--font-weight-black)",
                  fontSize: "var(--font-size-lg)",
                  cursor: "not-allowed",
                }}
              >
                אין קישור הרשמה
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
