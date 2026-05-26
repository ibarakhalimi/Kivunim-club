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
        background: "var(--color-bg-primary)",
        padding: "24px 16px 40px",
        fontFamily: "var(--font-heebo)",
        direction: "rtl",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <a
          href="/admin"
          style={{
            fontSize: 13,
            color: "var(--color-text-muted)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          ← פאנל ניהול
        </a>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-rubik)",
            fontWeight: 800,
            fontSize: 26,
            color: "var(--color-text-primary)",
          }}
        >
          עדכונים
        </h1>
      </div>

      {/* Add Form */}
      <AddUpdateForm />

      {/* Existing Updates */}
      {updates && updates.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2
            style={{
              margin: "0 0 16px",
              fontFamily: "var(--font-rubik)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--color-text-primary)",
            }}
          >
            עדכונים קיימים
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {updates.map((u) => (
              <div
                key={u.id}
                style={{
                  background: "var(--color-card-butter)",
                  border: "2px solid #0F0F0F",
                  borderRadius: 0,
                  boxShadow: "4px 4px 0 0 #0F0F0F",
                  padding: "14px 18px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                    fontWeight: 500,
                  }}
                >
                  {formatDate(u.published_at)} · {u.author}
                </p>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontFamily: "var(--font-rubik)",
                    fontWeight: 800,
                    fontSize: 18,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {u.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "var(--color-text-secondary)",
                  }}
                >
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
