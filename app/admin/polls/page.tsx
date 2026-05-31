import { createAdminClient } from "@/lib/supabase/admin";
import { PollForm } from "./poll-form";
import { PollList } from "./poll-list";

export default async function AdminPollsPage() {
  const supabase = createAdminClient();
  const { data: polls } = await supabase
    .from("polls")
    .select("*")
    .order("created_at", { ascending: false });

  // Vote counts per poll
  const { data: allVotes } = await supabase.from("poll_votes").select("poll_id, option_index");

  return (
    <main dir="rtl" style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 60px" }}>
      <h1 style={{ fontFamily: "var(--font-rubik)", fontWeight: 800, fontSize: 28, marginBottom: 28, color: "var(--color-text-primary)" }}>
        ניהול סקרים
      </h1>
      <PollForm />
      <div style={{ marginTop: 32 }}>
        <PollList polls={polls ?? []} allVotes={allVotes ?? []} />
      </div>
    </main>
  );
}
