"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function uploadImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from("events")
    .upload(fileName, file, { contentType: file.type, upsert: false });
  if (error) return null;
  const { data } = supabase.storage.from("events").getPublicUrl(fileName);
  return data.publicUrl;
}

async function resolveImageUrl(formData: FormData, existingUrl?: string | null): Promise<string | null> {
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    return await uploadImage(file);
  }
  return existingUrl ?? null;
}

export async function addEvent(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const event_date = formData.get("event_date") as string;
  const start_hour = (formData.get("start_hour") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const is_featured = formData.get("is_featured") === "on";
  const registration_url = (formData.get("registration_url") as string)?.trim() || null;

  if (!title || !description || !event_date || !start_hour || !location) {
    return { error: "יש למלא את כל השדות החובה" };
  }

  const image_url = await resolveImageUrl(formData);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("events")
    .insert({ title, description, event_date, start_hour, location, image_url, is_featured, registration_url });

  if (error) return { error: "שגיאה בשמירת האירוע" };

  revalidatePath("/");
  revalidatePath("/admin/events");
  return { success: true };
}

export async function updateEvent(id: string, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const event_date = formData.get("event_date") as string;
  const start_hour = (formData.get("start_hour") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const is_featured = formData.get("is_featured") === "on";
  const registration_url = (formData.get("registration_url") as string)?.trim() || null;
  const existing_image_url = (formData.get("existing_image_url") as string) || null;

  if (!title || !description || !event_date || !start_hour || !location) {
    return { error: "יש למלא את כל השדות החובה" };
  }

  const image_url = await resolveImageUrl(formData, existing_image_url);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("events")
    .update({ title, description, event_date, start_hour, location, image_url, is_featured, registration_url })
    .eq("id", id);

  if (error) return { error: "שגיאה בעדכון האירוע" };

  revalidatePath("/");
  revalidatePath("/admin/events");
  return { success: true };
}

export async function toggleFeatured(id: string, current: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("events")
    .update({ is_featured: !current })
    .eq("id", id);

  if (error) return { error: "שגיאה בעדכון" };

  revalidatePath("/");
  revalidatePath("/admin/events");
  return { success: true };
}

export async function deleteEvent(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) return { error: "שגיאה במחיקת האירוע" };

  revalidatePath("/");
  revalidatePath("/admin/events");
  return { success: true };
}
