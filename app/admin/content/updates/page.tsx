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
        background: "var(--color-surface-muted)",
        padding: "24px 16px 40px",
        fontFamily: "var(--font-family-sans)",
        direction: "rtl",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <a
          href="/admin"
          style={{ fontSize: "var(--font-size-md)", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: "var(--font-weight-medium)" }}
        >
          ← פאנל ניהול
        </a>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-bold)",
            fontSize: "var(--font-size-4xl)",
            color: "var(--color-admin-dark)",
          }}
        >
          עדכונים
        </h1>
      </div>

      <AddUpdateForm />

      <div style={{ marginTop: 28 }}>
        <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-family-sans)", fontWeight: "var(--font-weight-bold)", fontSize: "var(--font-size-xl)", color: "var(--color-admin-dark)" }}>
          עדכונים קיימים
        </h2>
        <UpdateList updates={updates ?? []} />
      </div>
    </div>
  );
}
