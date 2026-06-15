import { createAdminClient } from "@/lib/supabase/admin";
import { PollForm } from "./poll-form";
import { PollList } from "./poll-list";

export default async function AdminPollsPage() {
  const supabase = createAdminClient();
  const { data: polls } = await supabase
    .from("polls")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: allVotes } = await supabase.from("poll_votes").select("poll_id, option_index");

  return (
    <div style={{ minHeight: "100dvh", background: "#F8FAFC", padding: "24px 16px 40px", fontFamily: "var(--font-rubik)", direction: "rtl" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <a href="/admin" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontWeight: 500 }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 24, color: "#0F172A" }}>
          סקרים
        </h1>
      </div>

      <PollForm />

      <div style={{ marginTop: 28 }}>
        {polls && polls.length > 0 && (
          <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 16, color: "#0F172A" }}>
            סקרים קיימים
          </h2>
        )}
        <PollList polls={polls ?? []} allVotes={allVotes ?? []} />
      </div>
    </div>
  );
}
