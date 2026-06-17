import { createAdminClient } from "@/lib/supabase/admin";

type Idea = {
  id: string;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  idea_text: string;
  created_at: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminIdeasPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("idea_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const ideas = (data ?? []) as Idea[];

  return (
    <div style={{ minHeight: "100dvh", background: "#F8FAFC", padding: "24px 16px 40px", fontFamily: "var(--font-rubik)", direction: "rtl" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <a href="/admin" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontWeight: 500 }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 24, color: "#0F172A" }}>
          הצעות ורעיונות
        </h1>
      </div>

      {ideas.length === 0 ? (
        <p style={{ margin: 0, color: "#64748B", fontSize: 14, fontWeight: 600 }}>
          אין רעיונות עדיין.
        </p>
      ) : (
        <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ideas.map((idea) => (
            <article
              key={idea.id}
              style={{
                background: "#fff",
                border: "1px solid #FEF3C7",
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: 900, fontSize: 16, color: "#0F172A" }}>
                    {idea.user_name ?? "משתמש"}
                  </p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 12, color: "#94A3B8" }}>
                    {formatDate(idea.created_at)}
                  </p>
                </div>
                <span style={{ flexShrink: 0, borderRadius: 999, background: "#FEFCE8", color: "#A16207", padding: "5px 9px", fontWeight: 800, fontSize: 11 }}>
                  רעיון
                </span>
              </div>

              {(idea.user_email || idea.user_phone) && (
                <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 12, color: "#64748B", direction: "ltr", textAlign: "right" }}>
                  {[idea.user_phone, idea.user_email].filter(Boolean).join(" · ")}
                </p>
              )}

              <p style={{ margin: 0, fontWeight: 500, fontSize: 14, lineHeight: 1.65, color: "#334155", whiteSpace: "pre-wrap" }}>
                {idea.idea_text}
              </p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
