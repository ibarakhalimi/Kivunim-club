import { createAdminClient } from "@/lib/supabase/admin";
import { CardSlider, type SliderPost } from "./card-slider";

export async function CardSliderLoader() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("posts")
    .select("id, title, link_url, button_text, background_image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return <CardSlider posts={(data ?? []) as SliderPost[]} />;
}
