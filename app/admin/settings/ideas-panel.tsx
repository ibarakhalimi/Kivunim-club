import type { IdeaSubmission } from "./actions";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function IdeasPanel({ ideas }: { ideas: IdeaSubmission[] }) {
  if (ideas.length === 0) {
    return (
      <p style={{ margin: 0, color: "#64748B", fontSize: 13, fontWeight: 700 }}>
        אין רעיונות עדיין.
      </p>
    );
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {ideas.map((idea) => (
        <article
          key={idea.id}
          style={{
            border: "1px solid #FEF3C7",
            borderRadius: 14,
            background: "#FFFBEB",
            padding: "12px 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
            <div>
              <p style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 900, color: "#0F172A" }}>
                {idea.user_name ?? "משתמש"}
              </p>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 750, color: "#94A3B8" }}>
                {formatDate(idea.created_at)}
              </p>
            </div>
            <span style={{ borderRadius: 999, background: "#FEFCE8", color: "#A16207", padding: "5px 8px", fontWeight: 850, fontSize: 11, flexShrink: 0 }}>
              רעיון
            </span>
          </div>

          {(idea.user_phone || idea.user_email) && (
            <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 750, color: "#64748B", direction: "ltr", textAlign: "right" }}>
              {[idea.user_phone, idea.user_email].filter(Boolean).join(" · ")}
            </p>
          )}

          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, lineHeight: 1.6, color: "#334155", whiteSpace: "pre-wrap" }}>
            {idea.idea_text}
          </p>
        </article>
      ))}
    </section>
  );
}
