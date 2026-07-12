"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isPastBenefitExpiry, syncExpiredBenefits } from "@/lib/benefits/expiry";
import { revalidatePath } from "next/cache";

async function uploadImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from("benefits")
    .upload(fileName, file, { contentType: file.type, upsert: false });
  if (error) return null;
  const { data } = supabase.storage.from("benefits").getPublicUrl(fileName);
  return data.publicUrl;
}

async function resolveImageUrl(formData: FormData, existingUrl?: string | null): Promise<string | null> {
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) return await uploadImage(file);
  return existingUrl ?? null;
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/content");
  revalidatePath("/admin/benefits");
}

export async function addBenefit(formData: FormData) {
  const business = (formData.get("business") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const deal = (formData.get("deal") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const business_description = (formData.get("business_description") as string)?.trim() || null;
  const contact_phone = (formData.get("contact_phone") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const expires_at = (formData.get("expires_at") as string)?.trim() || null;
  const is_active = formData.get("is_active") === "on" && !isPastBenefitExpiry(expires_at);

  if (!business || !category || !deal || !description) {
    return { error: "יש למלא את כל השדות החובה" };
  }

  const image_url = await resolveImageUrl(formData);
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("benefits")
    .insert({ business, category, deal, description, business_description, contact_phone, location, expires_at, is_active, image_url });

  if (error) return { error: "שגיאה בשמירת ההטבה" };
  revalidate();
  return { success: true };
}

export async function updateBenefit(id: string, formData: FormData) {
  const business = (formData.get("business") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const deal = (formData.get("deal") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const business_description = (formData.get("business_description") as string)?.trim() || null;
  const contact_phone = (formData.get("contact_phone") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const expires_at = (formData.get("expires_at") as string)?.trim() || null;
  const is_active = formData.get("is_active") === "on" && !isPastBenefitExpiry(expires_at);
  const existing_image_url = (formData.get("existing_image_url") as string) || null;

  if (!business || !category || !deal || !description) {
    return { error: "יש למלא את כל השדות החובה" };
  }

  const image_url = await resolveImageUrl(formData, existing_image_url);
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("benefits")
    .update({ business, category, deal, description, business_description, contact_phone, location, expires_at, is_active, image_url })
    .eq("id", id);

  if (error) return { error: "שגיאה בעדכון ההטבה" };
  revalidate();
  return { success: true };
}

export async function toggleActive(id: string, current: boolean) {
  const supabase = createAdminClient();
  await syncExpiredBenefits();

  const { data: benefit } = await supabase
    .from("benefits")
    .select("expires_at")
    .eq("id", id)
    .single();

  const nextActive = !current && !isPastBenefitExpiry(benefit?.expires_at ?? null);
  const { error } = await supabase
    .from("benefits")
    .update({ is_active: nextActive })
    .eq("id", id);
  if (error) return { error: "שגיאה בעדכון" };
  revalidate();
  return { success: true };
}

export async function deleteBenefit(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("benefits").delete().eq("id", id);
  if (error) return { error: "שגיאה במחיקת ההטבה" };
  revalidate();
  return { success: true };
}
