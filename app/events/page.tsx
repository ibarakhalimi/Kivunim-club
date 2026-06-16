import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { BottomNav } from "@/components/home/bottom-nav";
import { SwipeBackHome } from "@/app/updates/swipe-back-home";

export const dynamic = "force-dynamic";

type EventItem = {
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

const TEMP_EVENTS: EventItem[] = [
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

export default async function EventsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  const events = [...((data ?? []) as EventItem[]), ...TEMP_EVENTS];

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        padding: "18px 14px 104px",
      }}
    >
      <SwipeBackHome />
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              background: "#FFF1F2",
              color: "#BE123C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarDays size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, color: "#0F172A" }}>
              אירועים
            </p>
            <p style={{ margin: "2px 0 0", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#64748B" }}>
              כל האירועים הקרובים
            </p>
          </div>
        </div>
        <Link
          href="/"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#fff",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            color: "#0F172A",
            fontFamily: "var(--font-rubik)",
            fontWeight: 900,
          }}
        >
          ←
        </Link>
      </header>

      <section style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {events.map((event) => (
          <div key={event.id}>
            <p style={{ margin: "0 0 6px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11, color: "#BE123C" }}>
              {formatDate(event.event_date)}
              {event.start_hour ? ` · ${event.start_hour}` : ""}
            </p>
            <article
              style={{
                background: "#fff",
                border: "1px solid #FFE4E6",
                borderRadius: 18,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "relative", height: 168, background: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 52%, #F8FAFC 100%)", overflow: "hidden" }}>
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.62), transparent 52%), repeating-linear-gradient(135deg, rgba(190,18,60,0.08) 0 1px, transparent 1px 15px)",
                    }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 54,
                    height: 62,
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid #FFE4E6",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#BE123C",
                    fontFamily: "var(--font-rubik)",
                  }}
                >
                  <span style={{ fontWeight: 900, fontSize: 22, lineHeight: 1 }}>
                    {dateParts(event.event_date).day}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 11, lineHeight: 1.1 }}>
                    {dateParts(event.event_date).month}
                  </span>
                </div>
              </div>

              <div style={{ padding: 18 }}>
                <h2 style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 18, lineHeight: 1.22, color: "#0F172A" }}>
                  {event.title}
                </h2>
                {event.description && (
                  <p style={{ margin: "0 0 12px", fontFamily: "var(--font-rubik)", fontWeight: 500, fontSize: 14, lineHeight: 1.65, color: "#475569" }}>
                    {event.description}
                  </p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {event.start_hour && (
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderRadius: 12, background: "#FFF1F2", padding: "9px 11px" }}>
                    <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#BE123C" }}>
                      שעה
                    </span>
                    <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, color: "#0F172A" }}>
                      {event.start_hour}
                    </span>
                  </div>
                )}
                {event.location && (
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderRadius: 12, background: "#F8FAFC", padding: "9px 11px" }}>
                    <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 12, color: "#64748B" }}>
                      מיקום
                    </span>
                    <span style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 12, color: "#0F172A", textAlign: "left" }}>
                      {event.location}
                    </span>
                  </div>
                )}
                {event.is_featured && (
                  <div style={{ display: "inline-flex", alignSelf: "flex-start", borderRadius: 99, background: "#BE123C", color: "#fff", padding: "5px 9px", fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 11 }}>
                    אירוע מומלץ
                  </div>
                )}
                </div>

              {event.registration_url && (
                <Link
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    marginTop: 14,
                    borderRadius: 12,
                    background: "#BE123C",
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
              )}
              </div>
            </article>
          </div>
        ))}
      </section>
      <BottomNav activeKey="events" alwaysOpen />
    </main>
  );
}
