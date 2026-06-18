"use client";

import { useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";

export type EventItem = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_hour: string | null;
  location: string | null;
  registration_url: string | null;
  image_url: string | null;
  is_featured: boolean | null;
  created_at: string | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function dateParts(date: string) {
  const eventDate = new Date(date);
  return {
    day: eventDate.toLocaleDateString("he-IL", { day: "numeric" }),
    month: eventDate.toLocaleDateString("he-IL", { month: "short" }),
  };
}

export function EventsList({ events }: { events: EventItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      {events.map((event) => {
        const isOpen = openId === event.id;

        return (
          <div key={event.id} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div
              aria-label={formatDate(event.event_date)}
              style={{
                width: 52,
                height: 62,
                borderRadius: 16,
                background: "#252836",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#FF2E9A",
                fontFamily: "var(--font-rubik)",
                flexShrink: 0,
              }}
            >
              <span style={{ fontWeight: 900, fontSize: 21, lineHeight: 1 }}>
                {dateParts(event.event_date).day}
              </span>
              <span style={{ fontWeight: 800, fontSize: 11, lineHeight: 1.1 }}>
                {dateParts(event.event_date).month}
              </span>
            </div>

            <article
              style={{
                flex: 1,
                background: "#252836",
                border: "none",
                borderRadius: 22,
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              <div style={{ position: "relative", height: 148, background: "linear-gradient(135deg, #2F3344 0%, #252836 52%, #181A23 100%)", overflow: "hidden" }}>
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 52%), repeating-linear-gradient(135deg, rgba(255,46,154,0.12) 0 1px, transparent 1px 15px)",
                    }}
                  />
                )}
              </div>

              <div style={{ padding: 14 }}>
                <p style={{ margin: "0 0 6px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#FF2E9A" }}>
                  {formatDate(event.event_date)}
                  {event.start_hour ? ` · ${event.start_hour}` : ""}
                </p>

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
                  <h2 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 21, lineHeight: 1.2, color: "#FFFFFF" }}>
                    {event.title}
                  </h2>
                  {event.description && (
                    <button
                      type="button"
                      aria-label={isOpen ? "סגור פירוט" : "פתח פירוט"}
                      onClick={() => setOpenId(isOpen ? null : event.id)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        border: "none",
                        background: isOpen ? "#FF2E9A" : "#111522",
                        color: isOpen ? "#fff" : "#FF2E9A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <Info size={16} strokeWidth={2.2} />
                    </button>
                  )}
                </div>

                {isOpen && event.description && (
                  <p style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 15.5, lineHeight: 1.7, color: "#B4B8C6" }}>
                    {event.description}
                  </p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {event.location && (
                    <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 600, fontSize: 12, lineHeight: 1.35, color: "#9CA0AE", textAlign: "right" }}>
                      {event.location}
                    </p>
                  )}
                  {event.is_featured && (
                    <div style={{ display: "inline-flex", alignSelf: "flex-start", borderRadius: 99, background: "#FF2E9A", color: "#fff", padding: "5px 9px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11 }}>
                      אירוע מומלץ
                    </div>
                  )}
                </div>

                {event.registration_url ? (
                  <Link
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      marginTop: 14,
                      borderRadius: 12,
                      background: "#FF2E9A",
                      color: "#fff",
                      padding: "12px 14px",
                      textAlign: "center",
                      textDecoration: "none",
                      fontFamily: "var(--font-rubik)",
                      fontWeight: 900,
                      fontSize: 14,
                    }}
                  >
                    הרשמה לאירוע
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    style={{
                      display: "block",
                      width: "100%",
                      marginTop: 14,
                      borderRadius: 12,
                      background: "#111522",
                      color: "#7C808E",
                      padding: "12px 14px",
                      textAlign: "center",
                      border: "none",
                      fontFamily: "var(--font-rubik)",
                      fontWeight: 900,
                      fontSize: 14,
                      cursor: "not-allowed",
                    }}
                  >
                    הרשמה לאירוע
                  </button>
                )}
              </div>
            </article>
          </div>
        );
      })}
    </section>
  );
}
