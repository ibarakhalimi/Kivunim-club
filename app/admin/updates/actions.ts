"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function addUpdate(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const author = (formData.get("author") as string)?.trim() || "צוות כיוונים";
  const is_active = formData.get("is_active") === "on";

  if (!title || !description) {
    return { error: "כותרת ותוכן הם שדות חובה" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("updates")
    .insert({ title, description, author, is_active });

  if (error) {
    return { error: "שגיאה בשמירת העדכון" };
  }

  revalidatePath("/");
  revalidatePath("/updates");
  revalidatePath("/admin/updates");
  return { success: true };
}

export async function updateUpdate(id: string, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const author = (formData.get("author") as string)?.trim() || "צוות כיוונים";
  const is_active = formData.get("is_active") === "on";

  if (!title || !description) {
    return { error: "כותרת ותוכן הם שדות חובה" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("updates")
    .update({ title, description, author, is_active })
    .eq("id", id);

  if (error) {
    return { error: "שגיאה בעדכון הרשומה" };
  }

  revalidatePath("/");
  revalidatePath("/updates");
  revalidatePath("/admin/updates");
  return { success: true };
}

export async function setUpdateActive(id: string, isActive: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("updates")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { error: `שגיאה בעדכון מצב התצוגה: ${error.message}` };
  }

  revalidatePath("/");
  revalidatePath("/updates");
  revalidatePath("/admin/updates");
  return { success: true };
}

export async function deleteUpdate(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("updates").delete().eq("id", id);

  if (error) {
    return { error: "שגיאה במחיקת העדכון" };
  }

  revalidatePath("/");
  revalidatePath("/updates");
  revalidatePath("/admin/updates");
  return { success: true };
}
