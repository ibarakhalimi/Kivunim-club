"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type { Tables } from "@/src/types/database";

type ClubEvent = Tables<"events">;

function getDateParts(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString("he-IL", { day: "numeric" }),
    month: date.toLocaleDateString("he-IL", { month: "short" }),
  };
}

export function EventsSection({ events }: { events: ClubEvent[] }) {
  const [showAll, setShowAll] = useState(false);
  const eventItem = events[0];
  const additionalCount = Math.max(events.length - 1, 0);
  const visibleEvents = showAll ? events : events.slice(0, 1);

  if (!eventItem) {
    return (
      <section style={{ width: "100%", gridColumn: "1 / -1", minWidth: 0, boxSizing: "border-box" }}>
        <article
          style={{
            width: "100%",
            minHeight: 116,
            border: "none",
            borderRadius: 22,
            background: "#252836",
            padding: 12,
            color: "#FFFFFF",
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
              background: "rgba(255, 46, 154, 0.14)",
              border: "1px solid rgba(255, 46, 154, 0.22)",
              color: "#FF2E9A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarDays size={22} strokeWidth={2.2} />
          </div>
          <div>
            <p style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#FF2E9A" }}>
              אירועים
            </p>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 15, lineHeight: 1.22, color: "#FFFFFF" }}>
              אין אירועים להצגה כרגע
            </p>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section style={{ width: "100%", gridColumn: "1 / -1", minWidth: 0, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 950, fontSize: 16, lineHeight: 1, color: "#C7CAD6" }}>
          אירועים
        </h2>
        {!showAll && additionalCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            style={{
              border: "1px solid rgba(255, 46, 154, 0.3)",
              borderRadius: 999,
              background: "rgba(255, 46, 154, 0.14)",
              color: "#FF2E9A",
              padding: "5px 10px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 950,
              fontSize: 12,
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            +{additionalCount}
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {visibleEvents.map((item) => {
          const dateParts = getDateParts(item.event_date);
          const eventMeta = [item.location, item.start_hour].filter(Boolean).join(" · ");
          return (
      <article
        key={item.id}
        style={{
          width: "100%",
          minHeight: 360,
          background: "#252836",
          border: "none",
          borderRadius: 22,
          boxShadow: "none",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          textAlign: "right",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 190,
            flexShrink: 0,
            borderRadius: 18,
            background: "rgba(255, 46, 154, 0.12)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FF2E9A",
            position: "relative",
          }}
        >
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <CalendarDays size={38} strokeWidth={2} />
          )}
          <div
            style={{
              position: "absolute",
              top: 9,
              right: 9,
              width: 46,
              height: 52,
              borderRadius: 14,
              background: "#2F3344",
              color: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-rubik)",
              boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
            }}
          >
            <span style={{ fontWeight: 900, fontSize: 18, lineHeight: 1 }}>
              {dateParts.day}
            </span>
            <span style={{ marginTop: 4, fontWeight: 800, fontSize: 9, lineHeight: 1 }}>
              {dateParts.month}
            </span>
          </div>
        </div>

        <div style={{ minHeight: 0, flex: 1, display: "flex", flexDirection: "column", paddingTop: 12 }}>
          <h3 style={{ margin: "0 0 7px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 18, lineHeight: 1.2, color: "#FFFFFF", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.title}
          </h3>
          {eventMeta && (
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, lineHeight: 1.3, color: "#9CA0AE", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {eventMeta}
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: "auto", paddingTop: 18 }}>
            {item.registration_url ? (
              <a
                href={item.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 42,
                  borderRadius: 14,
                  background: "#FF2E9A",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 900,
                  fontSize: 14,
                  lineHeight: 1,
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
                }}
              >
                הרשמה
              </a>
            ) : (
              <button
                type="button"
                disabled
                style={{
                  minHeight: 42,
                  borderRadius: 14,
                  border: "none",
                  background: "#2F3344",
                  color: "#7C808E",
                  fontFamily: "var(--font-rubik)",
                  fontWeight: 900,
                  fontSize: 14,
                  cursor: "not-allowed",
                }}
              >
                הרשמה
              </button>
            )}
            <a
              href="/events"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 42,
                borderRadius: 14,
                border: "1px solid rgba(255, 46, 154, 0.32)",
                background: "transparent",
                color: "#FF2E9A",
                fontFamily: "var(--font-rubik)",
                fontWeight: 900,
                fontSize: 14,
                lineHeight: 1,
                textAlign: "center",
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              פרטים
            </a>
          </div>
        </div>
      </article>
          );
        })}
      </div>
    </section>
  );
}
