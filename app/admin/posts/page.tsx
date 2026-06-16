import { createAdminClient } from "@/lib/supabase/admin";
import { AddPostForm } from "./add-post-form";

type Post = {
  id: string;
  background_image_url: string;
  title: string;
  link_url: string;
  button_text: string;
  is_active: boolean;
  sort_order: number;
};

export default async function AdminPostsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const posts = (data ?? []) as Post[];

  return (
    <div style={{ minHeight: "100dvh", background: "#F8FAFC", padding: "24px 16px 40px", fontFamily: "var(--font-rubik)", direction: "rtl" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <a href="/admin" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", fontWeight: 500 }}>
          ← פאנל ניהול
        </a>
        <h1 style={{ margin: 0, fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 24, color: "#0F172A" }}>
          סליידר ראשי
        </h1>
      </div>

      <AddPostForm />

      {posts.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ margin: "0 0 14px", fontFamily: "var(--font-rubik)", fontWeight: 700, fontSize: 16, color: "#0F172A" }}>
            כל הפוסטים
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {posts.map((post) => (
              <article key={post.id} style={{ display: "flex", gap: 12, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 10 }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: 92,
                    height: 64,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: `url(${post.background_image_url}) center / cover`,
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 15, color: "#0F172A" }}>{post.title}</p>
                  <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: 12, color: "#64748B", direction: "ltr", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {post.link_url}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700 }}>
                    <span style={{ color: post.is_active ? "#16A34A" : "#94A3B8" }}>{post.is_active ? "פעיל" : "כבוי"}</span>
                    <span style={{ color: "#CBD5E1" }}>•</span>
                    <span style={{ color: "#475569" }}>{post.button_text}</span>
                    <span style={{ color: "#CBD5E1" }}>•</span>
                    <span style={{ color: "#475569" }}>סדר {post.sort_order}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
