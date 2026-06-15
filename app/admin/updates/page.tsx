import { createClient } from "@/lib/supabase/server";
import { AddUpdateForm } from "./add-update-form";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminUpdatesPage() {
  const supabase = await createClient();
  const { data: updates } = await supabase
    .from("updates")
    .select("*")
    .order("published_at", { ascending: false });

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
        <a
          href="/admin"
          style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontWeight: 500 }}
        >
          ← פאנל ניהול
        </a>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 700,
            fontSize: 24,
            color: "#0F172A",
          }}
        >
          עדכונים
        </h1>
      </div>

      <AddUpdateForm />

      {updates && updates.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 16, color: "#0F172A" }}>
            עדכונים קיימים
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {updates.map((u) => (
              <div
                key={u.id}
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  padding: "14px 16px",
                }}
              >
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>
                  {formatDate(u.published_at)} · {u.author}
                </p>
                <p style={{ margin: "0 0 5px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 16, color: "#0F172A" }}>
                  {u.title}
                </p>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#475569" }}>
                  {u.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
