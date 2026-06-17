import { createAdminClient } from "@/lib/supabase/admin";
import { CardSlider, type SliderPost } from "./card-slider";

export async function CardSliderLoader() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, post_type, body_text, link_url, button_text, background_image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!error) {
    return <CardSlider posts={(data ?? []) as SliderPost[]} />;
  }

  const { data: legacyData } = await supabase
    .from("posts")
    .select("id, title, link_url, button_text, background_image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const legacyPosts = (legacyData ?? []).map((post) => ({
    ...post,
    post_type: "link",
    body_text: null,
  })) as SliderPost[];

  return <CardSlider posts={legacyPosts} />;
}
