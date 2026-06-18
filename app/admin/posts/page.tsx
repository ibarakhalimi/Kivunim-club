import { createAdminClient } from "@/lib/supabase/admin";
import { AddPostForm } from "./add-post-form";
import { PostList } from "./post-list";

type Post = {
  id: string;
  background_image_url: string | null;
  title: string;
  short_text: string | null;
  post_type: string;
  body_text: string | null;
  link_url: string | null;
  button_text: string | null;
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
          <PostList posts={posts} />
        </div>
      )}
    </div>
  );
}
