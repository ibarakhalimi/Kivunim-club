import { createAdminClient } from "@/lib/supabase/admin";

type Inquiry = {
  id: string;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  subject: string;
  message: string;
  created_at: string;
};

type Idea = {
  id: string;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  idea_text: string;
  created_at: string;
};

type InquiryTab = "inquiries" | "ideas";

type AdminInquiriesPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

const tabs: Array<{ key: InquiryTab; label: string; href: string }> = [
  { key: "inquiries", label: "פניות", href: "/admin/inquiries?tab=inquiries" },
  { key: "ideas", label: "רעיונות", href: "/admin/inquiries?tab=ideas" },
];

function resolveTab(value: string | undefined): InquiryTab {
  return value === "ideas" ? "ideas" : "inquiries";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminInquiriesPage({ searchParams }: AdminInquiriesPageProps) {
  const params = await searchParams;
  const activeTab = resolveTab(params?.tab);
  const supabase = createAdminClient();
  const [{ data: inquiriesData }, { data: ideasData }] = await Promise.all([
    supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("idea_submissions")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const inquiries = (inquiriesData ?? []) as Inquiry[];
  const ideas = (ideasData ?? []) as Idea[];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-surface-muted)", padding: "24px 16px 40px", fontFamily: "var(--font-family-sans)", direction: "rtl" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <a href="/admin" style={{ fontSize: "var(--font-size-md)", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: "var(--font-weight-medium)" }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-4xl)", color: "var(--color-admin-ink)" }}>
          פניות
        </h1>
      </div>

      <nav
        aria-label="טאבים לפניות ורעיונות"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          marginBottom: 22,
          paddingBottom: 2,
        }}
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <a
              key={tab.key}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              style={{
                minHeight: 40,
                minWidth: 92,
                borderRadius: "var(--shape-radius-pill)",
                border: active ? "1px solid var(--color-admin-dark)" : "1px solid var(--color-border-subtle)",
                background: active ? "var(--color-admin-dark)" : "var(--color-surface-raised)",
                color: active ? "var(--color-surface-raised)" : "var(--color-slate-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "var(--font-size-base)",
                fontWeight: "var(--font-weight-black)",
                padding: "0 18px",
                flexShrink: 0,
              }}
            >
              {tab.label}
            </a>
          );
        })}
      </nav>

      {activeTab === "inquiries" && inquiries.length === 0 ? (
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)" }}>
          אין פניות עדיין.
        </p>
      ) : activeTab === "inquiries" ? (
        <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {inquiries.map((inquiry) => (
            <article
              key={inquiry.id}
              style={{
                background: "var(--color-surface-raised)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "var(--shape-radius-xl)",
                padding: "14px 16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-ink)" }}>
                    {inquiry.user_name ?? "משתמש"}
                  </p>
                  <p style={{ margin: 0, fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", color: "var(--color-text-tertiary)" }}>
                    {formatDate(inquiry.created_at)}
                  </p>
                </div>
                <span style={{ flexShrink: 0, borderRadius: "var(--shape-radius-pill)", background: "var(--color-indigo-50)", color: "var(--color-indigo-700)", padding: "5px 9px", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-xs)" }}>
                  {inquiry.subject}
                </span>
              </div>

              {(inquiry.user_email || inquiry.user_phone) && (
                <p style={{ margin: "0 0 10px", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", direction: "ltr", textAlign: "right" }}>
                  {[inquiry.user_phone, inquiry.user_email].filter(Boolean).join(" · ")}
                </p>
              )}

              <p style={{ margin: 0, fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-base)", lineHeight: 1.65, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>
                {inquiry.message}
              </p>
            </article>
          ))}
        </section>
      ) : ideas.length === 0 ? (
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)" }}>
          אין רעיונות עדיין.
        </p>
      ) : (
        <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ideas.map((idea) => (
            <article
              key={idea.id}
              style={{
                background: "var(--color-surface-raised)",
                border: "1px solid var(--color-amber-100)",
                borderRadius: "var(--shape-radius-xl)",
                padding: "14px 16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: "var(--font-weight-black)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-ink)" }}>
                    {idea.user_name ?? "משתמש"}
                  </p>
                  <p style={{ margin: 0, fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", color: "var(--color-text-tertiary)" }}>
                    {formatDate(idea.created_at)}
                  </p>
                </div>
                <span style={{ flexShrink: 0, borderRadius: "var(--shape-radius-pill)", background: "var(--color-amber-50)", color: "var(--color-amber-700)", padding: "5px 9px", fontWeight: "var(--font-weight-extrabold)", fontSize: "var(--font-size-xs)" }}>
                  רעיון
                </span>
              </div>

              {(idea.user_email || idea.user_phone) && (
                <p style={{ margin: "0 0 10px", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", direction: "ltr", textAlign: "right" }}>
                  {[idea.user_phone, idea.user_email].filter(Boolean).join(" · ")}
                </p>
              )}

              <p style={{ margin: 0, fontWeight: "var(--font-weight-medium)", fontSize: "var(--font-size-base)", lineHeight: 1.65, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>
                {idea.idea_text}
              </p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
