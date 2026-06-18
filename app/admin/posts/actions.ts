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
  const post_type = (formData.get("post_type") as string) === "text_link" ? "text_link" : "link";
  const short_text = (formData.get("short_text") as string)?.trim() || null;
  const link_url = (formData.get("link_url") as string)?.trim() || null;
  const button_text = (formData.get("button_text") as string)?.trim() || null;
  const body_text = (formData.get("body_text") as string)?.trim() || null;
  const sort_order_raw = (formData.get("sort_order") as string)?.trim();
  const is_active = formData.get("is_active") === "on";
  const image = formData.get("background_image") as File | null;

  if (!title) {
    return { error: "כותרת היא שדה חובה" };
  }

  const background_image_url = image && image.size > 0 ? await uploadBackgroundImage(image) : null;
  if (image && image.size > 0 && !background_image_url) {
    return { error: "שגיאה בהעלאת תמונת הרקע" };
  }

  const sort_order = sort_order_raw ? Number(sort_order_raw) : 0;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("posts")
    .insert({ title, short_text, post_type, body_text, link_url, button_text, background_image_url, sort_order, is_active });

  if (error) {
    return { error: "שגיאה בשמירת הפוסט" };
  }

  revalidatePath("/");
  revalidatePath("/admin/posts");
  return { success: true };
}

export async function updatePost(id: string, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const post_type = (formData.get("post_type") as string) === "text_link" ? "text_link" : "link";
  const short_text = (formData.get("short_text") as string)?.trim() || null;
  const link_url = (formData.get("link_url") as string)?.trim() || null;
  const button_text = (formData.get("button_text") as string)?.trim() || null;
  const body_text = (formData.get("body_text") as string)?.trim() || null;
  const sort_order_raw = (formData.get("sort_order") as string)?.trim();
  const is_active = formData.get("is_active") === "on";
  const existing_background_image_url = (formData.get("existing_background_image_url") as string)?.trim() || null;
  const image = formData.get("background_image") as File | null;

  if (!title) {
    return { error: "כותרת היא שדה חובה" };
  }

  const uploadedImageUrl = image && image.size > 0 ? await uploadBackgroundImage(image) : null;
  if (image && image.size > 0 && !uploadedImageUrl) {
    return { error: "שגיאה בהעלאת תמונת הרקע" };
  }

  const sort_order = sort_order_raw ? Number(sort_order_raw) : 0;
  const background_image_url = uploadedImageUrl ?? existing_background_image_url;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("posts")
    .update({ title, short_text, post_type, body_text, link_url, button_text, background_image_url, sort_order, is_active })
    .eq("id", id);

  if (error) {
    return { error: `שגיאה בעדכון הפוסט: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin/posts");
  return { success: true };
}
