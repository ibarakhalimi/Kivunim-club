"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function uploadBackgroundImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from("posts")
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return null;

  const { data } = supabase.storage.from("posts").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function addPost(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const link_url = (formData.get("link_url") as string)?.trim();
  const button_text = (formData.get("button_text") as string)?.trim();
  const sort_order_raw = (formData.get("sort_order") as string)?.trim();
  const is_active = formData.get("is_active") === "on";
  const image = formData.get("background_image") as File | null;

  if (!title || !link_url || !button_text || !image || image.size === 0) {
    return { error: "יש למלא כותרת, לינק, טקסט כפתור ותמונת רקע" };
  }

  const background_image_url = await uploadBackgroundImage(image);
  if (!background_image_url) {
    return { error: "שגיאה בהעלאת תמונת הרקע" };
  }

  const sort_order = sort_order_raw ? Number(sort_order_raw) : 0;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("posts")
    .insert({ title, link_url, button_text, background_image_url, sort_order, is_active });

  if (error) {
    return { error: "שגיאה בשמירת הפוסט" };
  }

  revalidatePath("/");
  revalidatePath("/admin/posts");
  return { success: true };
}
