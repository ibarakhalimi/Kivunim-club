import { createAdminClient } from "@/lib/supabase/admin";
import { EventsSection } from "./events-section";

export async function EventsLoader() {
  const supabase = createAdminClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  return <EventsSection events={events ?? []} />;
}
