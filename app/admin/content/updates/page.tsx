import { createAdminClient } from "@/lib/supabase/admin";
import { AddUpdateForm } from "./add-update-form";
import { UpdateList } from "./update-list";

export default async function AdminUpdatesPage() {
  const supabase = createAdminClient();
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

      <div style={{ marginTop: 28 }}>
        <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 16, color: "#0F172A" }}>
          עדכונים קיימים
        </h2>
        <UpdateList updates={updates ?? []} />
      </div>
    </div>
  );
}
