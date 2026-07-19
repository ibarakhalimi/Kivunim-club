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
        background: "var(--color-surface-muted)",
        padding: "24px 16px 40px",
        fontFamily: "var(--font-family-sans)",
        direction: "rtl",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <a href="/admin" style={{ fontSize: "var(--font-size-md)", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: "var(--font-weight-medium)" }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-4xl)", color: "var(--color-admin-dark)" }}>
          אירועים
        </h1>
      </div>

      <AddEventForm />

      {events && events.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-dark)" }}>
            כל האירועים
          </h2>
          <EventList events={events} />
        </div>
      )}
    </div>
  );
}
