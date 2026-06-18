import { createAdminClient } from "@/lib/supabase/admin";
import { CardSlider, type SliderPost } from "./card-slider";

export async function CardSliderLoader() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!error) {
    const posts = (data ?? []).map((post) => ({
      ...post,
      short_text: "short_text" in post ? post.short_text : null,
      post_type: post.post_type ?? "link",
      body_text: post.body_text ?? null,
    })) as SliderPost[];

    return <CardSlider posts={posts} />;
  }

  const { data: legacyData } = await supabase
    .from("posts")
    .select("id, title, link_url, button_text, background_image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const legacyPosts = (legacyData ?? []).map((post) => ({
    ...post,
    short_text: null,
    post_type: "link",
    body_text: null,
  })) as SliderPost[];

  return <CardSlider posts={legacyPosts} />;
}
