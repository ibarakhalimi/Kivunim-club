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
    <div style={{ minHeight: "100dvh", background: "#F8FAFC", padding: "24px 16px 40px", fontFamily: "var(--font-rubik)", direction: "rtl" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <a href="/admin" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontWeight: 500 }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 24, color: "#0F172A" }}>
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
                borderRadius: 999,
                border: active ? "1px solid #0F172A" : "1px solid #E2E8F0",
                background: active ? "#0F172A" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 900,
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
        <p style={{ margin: 0, color: "#64748B", fontSize: 14, fontWeight: 600 }}>
          אין פניות עדיין.
        </p>
      ) : activeTab === "inquiries" ? (
        <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {inquiries.map((inquiry) => (
            <article
              key={inquiry.id}
              style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: 900, fontSize: 16, color: "#0F172A" }}>
                    {inquiry.user_name ?? "משתמש"}
                  </p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 12, color: "#94A3B8" }}>
                    {formatDate(inquiry.created_at)}
                  </p>
                </div>
                <span style={{ flexShrink: 0, borderRadius: 999, background: "#EEF2FF", color: "#4338CA", padding: "5px 9px", fontWeight: 800, fontSize: 11 }}>
                  {inquiry.subject}
                </span>
              </div>

              {(inquiry.user_email || inquiry.user_phone) && (
                <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 12, color: "#64748B", direction: "ltr", textAlign: "right" }}>
                  {[inquiry.user_phone, inquiry.user_email].filter(Boolean).join(" · ")}
                </p>
              )}

              <p style={{ margin: 0, fontWeight: 500, fontSize: 14, lineHeight: 1.65, color: "#334155", whiteSpace: "pre-wrap" }}>
                {inquiry.message}
              </p>
            </article>
          ))}
        </section>
      ) : ideas.length === 0 ? (
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
