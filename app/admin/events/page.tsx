import { createAdminClient } from "@/lib/supabase/admin";
import { AddEventForm } from "./add-event-form";
import { EventList } from "./event-list";

export default async function AdminEventsPage() {
  const supabase = createAdminClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F8FAFC",
        padding: "24px 16px 40px",
        fontFamily: "var(--font-rubik)",
        direction: "rtl",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <a href="/admin" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontWeight: 500 }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 24, color: "#0F172A" }}>
          אירועים
        </h1>
      </div>

      <AddEventForm />

      {events && events.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 16, color: "#0F172A" }}>
            כל האירועים
          </h2>
          <EventList events={events} />
        </div>
      )}
    </div>
  );
}
