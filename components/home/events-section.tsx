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
            borderRadius: 22,
            background: "#EFF2EC",
            padding: 12,
            color: "#290800",
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
              borderRadius: 16,
              background: "rgba(89, 52, 237, 0.14)",
              border: "1px solid rgba(89, 52, 237, 0.22)",
              color: "#5934ED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarDays size={22} strokeWidth={2.2} />
          </div>
          <div>
            <p style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#5934ED" }}>
              אירועים
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 15, lineHeight: 1.22, color: "#290800" }}>
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
      <h2 style={{ margin: "0 2px 12px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 16, lineHeight: 1.1, color: "#290800" }}>
        אירוע קרוב
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {events.map((item) => {
          const timeRange = item.end_hour ? `${item.start_hour}-${item.end_hour}` : item.start_hour;
          const eventMeta = [item.location, timeRange].filter(Boolean).join(" · ");
          const costLabel = item.is_paid && item.price_amount !== null ? `₪${item.price_amount}` : "ללא עלות";
          const costColor = item.is_paid ? "#5934ED" : "#D7DAE3";
          return (
      <button
        key={item.id}
        type="button"
        onClick={() => setSelectedEvent(item)}
        style={{
          width: "100%",
          background: "#EFF2EC",
          border: "none",
          borderRadius: 22,
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
            borderRadius: 18,
            background: "rgba(89, 52, 237, 0.12)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#5934ED",
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
          <p style={{ margin: "0 0 4px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, lineHeight: 1.3, color: "#9CA0AE" }}>
            {formatDate(item.event_date)}
          </p>
          <h3 style={{ margin: "0 0 7px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 18, lineHeight: 1.2, color: "#290800", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.title}
          </h3>
          {eventMeta && (
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, lineHeight: 1.3, color: "#9CA0AE", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
              {eventMeta}
            </p>
          )}
          <p style={{ margin: "7px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 12, lineHeight: 1.2, color: costColor }}>
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
          background: "rgba(0,0,0,0.58)",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          style={{
            width: "100%",
            maxHeight: "86dvh",
            borderRadius: "26px 26px 0 0",
            background: "#EFF2EC",
            border: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "none",
            overflow: "hidden",
            direction: "rtl",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ maxHeight: "86dvh", overflowY: "auto", padding: "14px 16px 18px" }}>
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              aria-label="סגור"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "none",
                background: "#111522",
                color: "#290800",
                fontSize: 18,
                lineHeight: 1,
                cursor: "pointer",
                marginBottom: 12,
              }}
            >
              ×
            </button>

            <div
              style={{
                width: "100%",
                aspectRatio: "1.8 / 1",
                borderRadius: 18,
                background: "rgba(89, 52, 237, 0.12)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#5934ED",
                marginBottom: 14,
              }}
            >
              {selectedEvent.image_url ? (
                <img src={selectedEvent.image_url} alt={selectedEvent.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : (
                <CalendarDays size={42} strokeWidth={2} />
              )}
            </div>

            <p style={{ margin: "0 0 8px", fontFamily: "var(--font-rubik)", fontWeight: 850, fontSize: 12, lineHeight: 1.35, color: "#5934ED" }}>
              {formatDate(selectedEvent.event_date)}
              {selectedTimeRange ? ` · ${selectedTimeRange}` : ""}
            </p>
            <h2 style={{ margin: "0 0 10px", fontFamily: "var(--font-rubik)", fontWeight: 950, fontSize: 24, lineHeight: 1.15, color: "#290800" }}>
              {selectedEvent.title}
            </h2>
            {selectedEvent.location && (
              <p style={{ margin: "0 0 10px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 14, lineHeight: 1.45, color: "#9CA0AE" }}>
                {selectedEvent.location}
              </p>
            )}
            <p style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 14, lineHeight: 1.3, color: selectedEvent.is_paid ? "#5934ED" : "#D7DAE3" }}>
              {selectedCostLabel}
            </p>

            {selectedEvent.description && (
              <div
                dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
                style={{ margin: "0 0 18px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 15, lineHeight: 1.75, color: "#C7CAD6" }}
              />
            )}

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
                  borderRadius: 16,
                  background: "#5934ED",
                  color: "#290800",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 950,
                  fontSize: 15,
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
                  borderRadius: 16,
                  border: "none",
                  background: "#111522",
                  color: "#7C808E",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 950,
                  fontSize: 15,
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
