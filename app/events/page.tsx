import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { BottomNav } from "@/components/home/bottom-nav";
import { SwipeBackHome } from "@/app/updates/swipe-back-home";
import { EventsList, type EventItem } from "./events-list";

export const dynamic = "force-dynamic";

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

      <EventsList events={events} />
      <BottomNav activeKey="events" alwaysOpen />
    </main>
  );
}
