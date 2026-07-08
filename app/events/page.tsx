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
    end_hour: null,
    start_hour: "18:00",
    location: "מרכז כיוונים, קומה 2",
    registration_url: null,
    image_url: null,
    is_featured: true,
    is_paid: false,
    price_amount: null,
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
        background: "#181A23",
        padding: "18px 14px 104px",
      }}
    >
      <SwipeBackHome />
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "-18px -14px 26px", background: "#111522", borderRadius: 0, padding: "26px 22px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,46,154,0.15)",
              color: "#FF2E9A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarDays size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 900, fontSize: 22, color: "#FFFFFF" }}>
              אירועים
            </p>
          </div>
        </div>
        <Link
          href="/"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#252836",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            color: "#FFFFFF",
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
